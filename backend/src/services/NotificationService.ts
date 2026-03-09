import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import type { NotificationType, NotificationRow } from '../types/index.js';

interface NotificationPayload {
    vaultName?: string;
    recipientName?: string;
    btcAmount?: string;
    sharePercent?: string;
    executorName?: string;
    daysRemaining?: number;
    blocksRemaining?: number;
    signingLink?: string;
    [key: string]: unknown;
}

// ─── Email Transport ──────────────────────────────────────────────────────────

function createTransport(): nodemailer.Transporter {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function buildEmailTemplate(type: NotificationType, payload: NotificationPayload): {
    subject: string;
    html: string;
} {
    const base = `
        <div style="font-family: 'Montserrat', Georgia, sans-serif; background: #0a0a0a; color: #f5f1eb; padding: 40px; max-width: 600px; margin: 0 auto;">
            <div style="border-bottom: 1px solid #c9a84c; padding-bottom: 24px; margin-bottom: 32px;">
                <span style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
                    VAULT<span style="color: #c9a84c;">LEGACY</span>
                </span>
                <div style="font-size: 10px; color: #888; letter-spacing: 1px; margin-top: 4px;">BITCOIN INHERITANCE VAULT</div>
            </div>
            {{BODY}}
            <div style="border-top: 1px solid #2a2a2a; padding-top: 24px; margin-top: 40px; font-size: 11px; color: #666;">
                This is an automated message from VaultLegacy — OP_NET Testnet.<br/>
                Bitcoin only. No fiat. No compromise.
            </div>
        </div>
    `;

    const templates: Record<NotificationType, { subject: string; body: string }> = {
        CHECKIN_REMINDER: {
            subject: `[VaultLegacy] Check-in reminder — ${payload.daysRemaining} days remaining`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Dead Man's Switch Reminder</h2>
                <p style="color: #888; margin-bottom: 24px;">Your vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong> requires a check-in.</p>
                <div style="background: #1e1e1e; border: 1px solid #c9a84c; padding: 24px; margin-bottom: 24px;">
                    <div style="font-size: 13px; color: #888; margin-bottom: 8px;">CHECK-IN DUE IN</div>
                    <div style="font-family: Georgia, serif; font-size: 48px; color: #c9a84c;">${payload.daysRemaining} days</div>
                    <div style="font-size: 12px; color: #666;">(~${payload.blocksRemaining?.toLocaleString()} blocks)</div>
                </div>
                <p style="color: #888;">Log in to VaultLegacy and tap <strong style="color: #f5f1eb;">Check In Now</strong> to reset your dead man's switch.</p>
                <a href="${process.env.FRONTEND_URL}/owner" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px; margin-top: 16px;">CHECK IN NOW</a>
            `,
        },
        CHECKIN_MISSED: {
            subject: `[VaultLegacy] URGENT: Missed check-in — executor notified`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #e05a5a; font-size: 28px;">Check-in Missed</h2>
                <p style="color: #888;">You have missed ${payload.missedCount ?? 3} consecutive check-ins on vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>.</p>
                <div style="background: #1e1e1e; border: 1px solid #e05a5a; padding: 24px; margin: 24px 0;">
                    <p style="color: #e05a5a; margin: 0;">Your executor has been automatically notified. The unlock process may begin if you do not check in immediately.</p>
                </div>
                <a href="${process.env.FRONTEND_URL}/owner" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">CHECK IN IMMEDIATELY</a>
            `,
        },
        EXECUTOR_ALERT: {
            subject: `[VaultLegacy] Executor Alert — ${payload.vaultName}`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Executor Notification</h2>
                <p style="color: #888;">You have been alerted regarding vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>.</p>
                <div style="background: #1e1e1e; border: 1px solid #2a2a2a; padding: 24px; margin: 24px 0;">
                    <p style="color: #f5f1eb; margin: 0;">${payload.message ?? 'The vault owner has missed 3 consecutive check-ins. Please review the vault status.'}</p>
                </div>
                <a href="${process.env.FRONTEND_URL}/executor" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">VIEW EXECUTOR DASHBOARD</a>
            `,
        },
        DEATH_INITIATED: {
            subject: `[VaultLegacy] Unlock process initiated — ${payload.vaultName}`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Unlock Process Initiated</h2>
                <p style="color: #888;">An unlock has been initiated for vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>.</p>
                <div style="background: #1e1e1e; border: 1px solid #2a2a2a; padding: 24px; margin: 24px 0;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 8px;">72-HOUR DISPUTE WINDOW OPEN</div>
                    <p style="color: #f5f1eb; margin: 0;">A death certificate has been submitted. The 72-hour fraud dispute window is now open. If this is fraudulent, you must flag it with evidence within this period.</p>
                </div>
                <a href="${process.env.FRONTEND_URL}/death" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">VIEW UNLOCK STATUS</a>
            `,
        },
        DEATH_CONFIRMED: {
            subject: `[VaultLegacy] Death confirmed — distribution begins`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Death Confirmed</h2>
                <p style="color: #888;">The 72-hour window has closed for vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>. Distribution is authorized.</p>
            `,
        },
        FRAUD_FLAGGED: {
            subject: `[VaultLegacy] FRAUD FLAG — ${payload.vaultName}`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #e05a5a; font-size: 28px;">Fraud Flag Submitted</h2>
                <p style="color: #888;">A fraud flag has been submitted for vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>. All parties have been notified.</p>
            `,
        },
        WINDOW_CLOSED: {
            subject: `[VaultLegacy] 72-hour window closed — ${payload.vaultName}`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Dispute Window Closed</h2>
                <p style="color: #888;">The 72-hour dispute window has closed for vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>. Executor fee payment is being processed.</p>
            `,
        },
        FEE_PAID: {
            subject: `[VaultLegacy] Executor fee paid — distribution ready`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Executor Fee Paid</h2>
                <p style="color: #888;">Your executor fee for vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong> has been paid. You may now decrypt the will and initiate transfers.</p>
                <a href="${process.env.FRONTEND_URL}/executor" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">DECRYPT WILL & BEGIN</a>
            `,
        },
        TRANSFER_READY: {
            subject: `[VaultLegacy] Your inheritance transfer is ready`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Your Transfer Is Ready</h2>
                <p style="color: #888;">Hello ${payload.recipientName ?? 'Beneficiary'},</p>
                <p style="color: #888;">Your inheritance from vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong> is ready for your signature.</p>
                <div style="background: #1e1e1e; border: 1px solid #c9a84c; padding: 32px; text-align: center; margin: 24px 0;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 8px; letter-spacing: 1px;">YOUR AMOUNT</div>
                    <div style="font-family: Georgia, serif; font-size: 56px; color: #c9a84c;">${payload.btcAmount} BTC</div>
                    <div style="font-size: 12px; color: #666; margin-top: 8px;">Executor: ${payload.executorName}</div>
                </div>
                <a href="${payload.signingLink}" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 16px 40px; text-decoration: none; font-weight: 600; letter-spacing: 1.5px; font-size: 14px;">APPROVE & SIGN →</a>
                <p style="color: #666; font-size: 12px; margin-top: 16px;">This link is valid for 72 hours. Do not share it.</p>
            `,
        },
        TRANSFER_COMPLETE: {
            subject: `[VaultLegacy] Transfer complete — ${payload.btcAmount} BTC sent`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #5bab74; font-size: 28px;">Transfer Complete</h2>
                <p style="color: #888;">${payload.btcAmount} BTC has been sent to your wallet.</p>
            `,
        },
        BENEFICIARY_SUSPENDED: {
            subject: `[VaultLegacy] IMPORTANT: Your share has been suspended`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #e05a5a; font-size: 28px;">Your Share Is Suspended</h2>
                <p style="color: #888;">Hello ${payload.recipientName ?? 'Beneficiary'},</p>
                <p style="color: #888;">Your share in vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong> has been conditionally suspended by the executor.</p>
                <div style="background: #1e1e1e; border: 1px solid #e05a5a; padding: 24px; margin: 24px 0;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 8px;">APPEAL WINDOW</div>
                    <div style="font-family: Georgia, serif; font-size: 36px; color: #e05a5a;">30 days</div>
                    <p style="color: #888; margin: 8px 0 0; font-size: 13px;">Submit evidence within 30 days or your share will be redirected to the registered charity.</p>
                </div>
                <a href="${process.env.FRONTEND_URL}/appeal" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">SUBMIT APPEAL EVIDENCE</a>
            `,
        },
        APPEAL_REMINDER: {
            subject: `[VaultLegacy] Appeal deadline — ${payload.daysRemaining} days remaining`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #e05a5a; font-size: 28px;">Appeal Deadline Approaching</h2>
                <p style="color: #888;">You have <strong style="color: #e05a5a;">${payload.daysRemaining} days</strong> remaining to submit your appeal evidence.</p>
                <a href="${process.env.FRONTEND_URL}/appeal" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">SUBMIT EVIDENCE NOW</a>
            `,
        },
        APPEAL_EXPIRED: {
            subject: `[VaultLegacy] Appeal window expired`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #e05a5a; font-size: 28px;">Appeal Window Expired</h2>
                <p style="color: #888;">The 30-day appeal window has expired without evidence submission. Your share is being redirected to the registered charity.</p>
            `,
        },
        CHARITY_REDIRECT: {
            subject: `[VaultLegacy] Charity redirect — ${payload.vaultName}`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Share Redirected to Charity</h2>
                <p style="color: #888;">A beneficiary share has been permanently redirected to the registered charity address per the conditional clause.</p>
            `,
        },
        TOP_UP_RECEIVED: {
            subject: `[VaultLegacy] Top-up received — acknowledgment required`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Top-Up Received</h2>
                <p style="color: #888;">A new deposit has been made to vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>. Your acknowledgment is required as executor.</p>
                <a href="${process.env.FRONTEND_URL}/deposits" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">ACKNOWLEDGE DEPOSIT</a>
            `,
        },
        WITHDRAWAL_REQUESTED: {
            subject: `[VaultLegacy] Withdrawal co-signature required`,
            body: `
                <h2 style="font-family: Georgia, serif; color: #c9a84c; font-size: 28px;">Withdrawal Co-Signature Required</h2>
                <p style="color: #888;">The vault owner has requested a withdrawal from vault <strong style="color: #f5f1eb;">${payload.vaultName}</strong>. Your co-signature is required to proceed.</p>
                <a href="${process.env.FRONTEND_URL}/deposits" style="display: inline-block; background: #c9a84c; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 600; letter-spacing: 1px;">CO-SIGN WITHDRAWAL</a>
            `,
        },
    };

    const template = templates[type];
    return {
        subject: template.subject,
        html: base.replace('{{BODY}}', template.body),
    };
}

// ─── Notification Service ─────────────────────────────────────────────────────

export async function queueNotification(
    vaultId: string,
    recipientAddress: string,
    type: NotificationType,
    payload: NotificationPayload,
    recipientEmail?: string,
    recipientPhone?: string,
): Promise<void> {
    const db = getDb();
    const id = uuidv4();

    db.prepare(`
        INSERT INTO notifications (id, vault_id, recipient_address, recipient_email, recipient_phone, type, payload)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, vaultId, recipientAddress, recipientEmail ?? null, recipientPhone ?? null, type, JSON.stringify(payload));
}

export async function sendPendingNotifications(): Promise<void> {
    const db = getDb();
    const pending = db.prepare(`
        SELECT * FROM notifications 
        WHERE status = 'PENDING' AND retry_count < 3
        ORDER BY created_at ASC
        LIMIT 50
    `).all() as NotificationRow[];

    for (const notification of pending) {
        await sendNotification(notification);
    }
}

async function sendNotification(notification: NotificationRow): Promise<void> {
    const db = getDb();

    try {
        const payload = JSON.parse(notification.payload) as NotificationPayload;
        let sent = false;

        // Send email
        if (notification.recipient_email && process.env.SMTP_USER) {
            const { subject, html } = buildEmailTemplate(notification.type, payload);
            const transport = createTransport();
            await transport.sendMail({
                from: process.env.EMAIL_FROM ?? 'VaultLegacy <noreply@vaultlegacy.io>',
                to: notification.recipient_email,
                subject,
                html,
            });
            sent = true;
            console.log(`✓ Email sent [${notification.type}] → ${notification.recipient_email}`);
        }

        // Send SMS via Twilio (if configured)
        if (notification.recipient_phone && process.env.TWILIO_ACCOUNT_SID) {
            await sendSMS(notification.recipient_phone, notification.type, payload);
            sent = true;
        }

        if (sent) {
            db.prepare(`
                UPDATE notifications SET status = 'SENT', sent_at = datetime('now') WHERE id = ?
            `).run(notification.id);
        }
    } catch (err) {
        console.error(`✗ Notification failed [${notification.type}]:`, err);
        db.prepare(`
            UPDATE notifications SET retry_count = retry_count + 1, status = CASE WHEN retry_count + 1 >= 3 THEN 'FAILED' ELSE 'PENDING' END WHERE id = ?
        `).run(notification.id);
    }
}

async function sendSMS(phone: string, type: NotificationType, payload: NotificationPayload): Promise<void> {
    const messages: Partial<Record<NotificationType, string>> = {
        CHECKIN_REMINDER: `VaultLegacy: Check-in due in ${payload.daysRemaining} days for vault "${payload.vaultName}". Log in now.`,
        CHECKIN_MISSED: `VaultLegacy URGENT: You missed a check-in for "${payload.vaultName}". Log in immediately.`,
        TRANSFER_READY: `VaultLegacy: Your transfer of ${payload.btcAmount} BTC is ready. Sign here: ${payload.signingLink}`,
        BENEFICIARY_SUSPENDED: `VaultLegacy: Your share in "${payload.vaultName}" is suspended. You have 30 days to appeal.`,
        APPEAL_REMINDER: `VaultLegacy: ${payload.daysRemaining} days left to submit appeal evidence.`,
    };

    const message = messages[type];
    if (!message) return;

    // Twilio REST API call
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            From: process.env.TWILIO_FROM_NUMBER!,
            To: phone,
            Body: message,
        }),
    });
}

// ─── Contact Lookup Helper ────────────────────────────────────────────────────

export function getContactsForVault(vaultId: string): Array<{
    address: string;
    email: string | null;
    phone: string | null;
    role: string;
}> {
    const db = getDb();
    return db.prepare('SELECT address, email, phone, role FROM contacts WHERE vault_id = ?')
        .all(vaultId) as Array<{ address: string; email: string | null; phone: string | null; role: string }>;
}
