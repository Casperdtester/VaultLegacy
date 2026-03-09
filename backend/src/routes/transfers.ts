import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { requireWalletAuth } from '../middleware/auth.js';
import { queueNotification, getContactsForVault } from '../services/NotificationService.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { VaultRow, BeneficiaryRow } from '../types/index.js';

// ─── Transfers ────────────────────────────────────────────────────────────────

export const transfersRouter = Router();

// Lawyer initiates transfer for a specific beneficiary
transfersRouter.post('/:vaultId/transfers/:benId/initiate', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.executor_address.toLowerCase()) {
            res.status(403).json({ error: 'Only the executor can initiate transfers' });
            return;
        }
        if (vault.status !== 'FEE_PAID' && vault.status !== 'EXECUTING') {
            res.status(400).json({ error: 'Transfers can only be initiated after executor fee is paid' });
            return;
        }
        if (!vault.will_decryption_authorized) {
            res.status(400).json({ error: 'Will decryption must be authorized before initiating transfers' });
            return;
        }

        const bene = db.prepare('SELECT * FROM beneficiaries WHERE id = ? AND vault_id = ?')
            .get(req.params.benId, req.params.vaultId) as BeneficiaryRow | undefined;
        if (!bene) { res.status(404).json({ error: 'Beneficiary not found' }); return; }
        if (bene.status === 'SUSPENDED') {
            res.status(400).json({ error: 'Cannot initiate transfer for suspended beneficiary' });
            return;
        }
        if (bene.status === 'COMPLETE') {
            res.status(400).json({ error: 'Transfer already complete for this beneficiary' });
            return;
        }

        const { amountSatoshis } = req.body as { amountSatoshis: number };

        // Generate signing token for remote/local beneficiary
        const signingToken = uuidv4();
        const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

        db.prepare(`
            INSERT INTO signers (id, vault_id, beneficiary_id, psbt_hex, amount_satoshis, signing_token, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(uuidv4(), vault.id, bene.id, 'PSBT_PLACEHOLDER', amountSatoshis, signingToken, expiresAt);

        // Update vault status to EXECUTING if not already
        if (vault.status === 'FEE_PAID') {
            db.prepare(`UPDATE vaults SET status = 'EXECUTING', updated_at = datetime('now') WHERE id = ?`).run(vault.id);
        }

        // Build signing link
        const signingLink = `${process.env.FRONTEND_URL}/sign?token=${signingToken}`;
        const btcAmount = (amountSatoshis / 100_000_000).toFixed(8);

        // Notify beneficiary
        const contacts = getContactsForVault(vault.id);
        const beneContact = contacts.find(c => c.address.toLowerCase() === bene.address.toLowerCase());

        if (beneContact) {
            await queueNotification(vault.id, bene.address, 'TRANSFER_READY', {
                vaultName: vault.name,
                recipientName: bene.name,
                btcAmount,
                executorName: vault.executor_address,
                signingLink,
            }, beneContact.email ?? undefined, beneContact.phone ?? undefined);
        }

        console.log(`✓ Transfer initiated for ${bene.name} — ${btcAmount} BTC — token: ${signingToken}`);
        res.json({
            message: 'Transfer initiated. Beneficiary notified.',
            signingToken,
            signingLink,
            btcAmount,
            expiresAt,
        });
    } catch (err) {
        next(err);
    }
});

// Beneficiary co-signs their transfer
transfersRouter.post('/:vaultId/transfers/:benId/cosign', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const bene = db.prepare('SELECT * FROM beneficiaries WHERE id = ? AND vault_id = ?')
            .get(req.params.benId, req.params.vaultId) as BeneficiaryRow | undefined;
        if (!bene) { res.status(404).json({ error: 'Beneficiary not found' }); return; }
        if (req.walletAddress !== bene.address.toLowerCase()) {
            res.status(403).json({ error: 'Only the beneficiary can co-sign their own transfer' });
            return;
        }

        const { signingToken, signedPsbtHex } = req.body as { signingToken: string; signedPsbtHex: string };

        const signer = db.prepare(`
            SELECT * FROM signers WHERE signing_token = ? AND beneficiary_id = ? AND signed = 0
        `).get(signingToken, bene.id) as any;

        if (!signer) {
            res.status(404).json({ error: 'Signing session not found or already used' });
            return;
        }

        if (new Date(signer.expires_at) < new Date()) {
            res.status(400).json({ error: 'Signing session has expired' });
            return;
        }

        // Mark signed
        db.prepare(`
            UPDATE signers SET signed = 1, signed_psbt_hex = ?, signed_at = datetime('now') WHERE signing_token = ?
        `).run(signedPsbtHex, signingToken);

        // Mark beneficiary as complete
        db.prepare(`
            UPDATE beneficiaries SET status = 'COMPLETE', updated_at = datetime('now') WHERE id = ?
        `).run(bene.id);

        // Check if all beneficiaries are done → mark vault COMPLETE
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow;
        const pending = db.prepare(`
            SELECT COUNT(*) as count FROM beneficiaries 
            WHERE vault_id = ? AND status NOT IN ('COMPLETE', 'ESCROWED')
        `).get(vault.id) as { count: number };

        if (pending.count === 0) {
            db.prepare(`UPDATE vaults SET status = 'COMPLETE', updated_at = datetime('now') WHERE id = ?`).run(vault.id);
            console.log(`✅ Vault "${vault.name}" — all transfers complete`);
        }

        // Notify beneficiary of completion
        const contacts = getContactsForVault(vault.id);
        const beneContact = contacts.find(c => c.address.toLowerCase() === bene.address.toLowerCase());
        if (beneContact) {
            await queueNotification(vault.id, bene.address, 'TRANSFER_COMPLETE', {
                vaultName: vault.name,
                recipientName: bene.name,
                btcAmount: (signer.amount_satoshis / 100_000_000).toFixed(8),
            }, beneContact.email ?? undefined, beneContact.phone ?? undefined);
        }

        res.json({ message: 'Transfer co-signed. Transaction will be broadcast shortly.' });
    } catch (err) {
        next(err);
    }
});

// Get all transfer statuses for a vault
transfersRouter.get('/:vaultId/transfers', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }

        const isOwnerOrExecutor =
            req.walletAddress === vault.owner_address.toLowerCase() ||
            req.walletAddress === vault.executor_address.toLowerCase();

        const beneficiaries = db.prepare('SELECT * FROM beneficiaries WHERE vault_id = ?').all(vault.id) as BeneficiaryRow[];

        const transfers = beneficiaries.map(b => {
            const signer = db.prepare('SELECT * FROM signers WHERE beneficiary_id = ? ORDER BY created_at DESC LIMIT 1').get(b.id) as any;
            return {
                beneficiaryId: b.id,
                beneficiaryName: b.name,
                beneficiaryAddress: b.address,
                isRemote: b.is_remote === 1,
                sharePercent: b.share_percent,
                status: b.status,
                transferTxHash: b.transfer_tx_hash,
                appealOutcome: b.appeal_outcome,
                signingPending: signer ? signer.signed === 0 : false,
                signingExpired: signer ? new Date(signer.expires_at) < new Date() : false,
            };
        });

        res.json({ transfers });
    } catch (err) {
        next(err);
    }
});

// ─── Appeals ──────────────────────────────────────────────────────────────────

export const appealsRouter = Router();

// Executor suspends a beneficiary
appealsRouter.post('/:vaultId/appeals/:benId/suspend', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.executor_address.toLowerCase()) {
            res.status(403).json({ error: 'Only the executor can suspend beneficiaries' });
            return;
        }

        const bene = db.prepare('SELECT * FROM beneficiaries WHERE id = ? AND vault_id = ?')
            .get(req.params.benId, req.params.vaultId) as BeneficiaryRow | undefined;
        if (!bene) { res.status(404).json({ error: 'Beneficiary not found' }); return; }

        const { blockNumber, reason } = req.body as { blockNumber: number; reason: string };
        // 30-day appeal window = 4320 blocks
        const appealDeadlineBlock = blockNumber + 4320;

        db.prepare(`
            UPDATE beneficiaries 
            SET status = 'SUSPENDED', suspension_block = ?, appeal_deadline_block = ?, updated_at = datetime('now')
            WHERE id = ?
        `).run(blockNumber, appealDeadlineBlock, bene.id);

        // Notify beneficiary
        const contacts = getContactsForVault(vault.id);
        const beneContact = contacts.find(c => c.address.toLowerCase() === bene.address.toLowerCase());
        if (beneContact) {
            await queueNotification(vault.id, bene.address, 'BENEFICIARY_SUSPENDED', {
                vaultName: vault.name,
                recipientName: bene.name,
                reason,
            }, beneContact.email ?? undefined, beneContact.phone ?? undefined);
        }

        res.json({
            message: 'Beneficiary suspended. 30-day appeal window started.',
            appealDeadlineBlock,
            daysToAppeal: 30,
        });
    } catch (err) {
        next(err);
    }
});

// Beneficiary submits appeal evidence
appealsRouter.post('/:vaultId/appeals/:benId/evidence', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const bene = db.prepare('SELECT * FROM beneficiaries WHERE id = ? AND vault_id = ?')
            .get(req.params.benId, req.params.vaultId) as BeneficiaryRow | undefined;
        if (!bene) { res.status(404).json({ error: 'Beneficiary not found' }); return; }
        if (req.walletAddress !== bene.address.toLowerCase()) {
            res.status(403).json({ error: 'Only the beneficiary can submit appeal evidence' });
            return;
        }
        if (bene.status !== 'SUSPENDED') {
            res.status(400).json({ error: 'Only suspended beneficiaries can submit evidence' });
            return;
        }

        const { evidenceHash, evidenceDescription, blockNumber } = req.body as {
            evidenceHash: string; evidenceDescription: string; blockNumber: number;
        };

        // Check deadline
        if (bene.appeal_deadline_block && blockNumber > bene.appeal_deadline_block) {
            res.status(400).json({ error: 'Appeal deadline has passed' });
            return;
        }

        db.prepare(`
            UPDATE beneficiaries SET appeal_evidence_hash = ?, updated_at = datetime('now') WHERE id = ?
        `).run(evidenceHash, bene.id);

        // Notify executor
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow;
        const contacts = getContactsForVault(vault.id);
        const executorContact = contacts.find(c => c.role === 'executor');
        if (executorContact) {
            await queueNotification(vault.id, vault.executor_address, 'EXECUTOR_ALERT', {
                vaultName: vault.name,
                message: `${bene.name} has submitted appeal evidence. Please review in your executor dashboard.`,
            }, executorContact.email ?? undefined);
        }

        res.json({ message: 'Evidence submitted. Executor has been notified to review.' });
    } catch (err) {
        next(err);
    }
});

// Executor reviews appeal and decides
appealsRouter.put('/:vaultId/appeals/:benId/review', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.executor_address.toLowerCase()) {
            res.status(403).json({ error: 'Only the executor can review appeals' });
            return;
        }

        const bene = db.prepare('SELECT * FROM beneficiaries WHERE id = ? AND vault_id = ?')
            .get(req.params.benId, req.params.vaultId) as BeneficiaryRow | undefined;
        if (!bene) { res.status(404).json({ error: 'Beneficiary not found' }); return; }

        const { decision } = req.body as { decision: 'REINSTATE' | 'REDIRECT' };

        if (decision === 'REINSTATE') {
            db.prepare(`
                UPDATE beneficiaries SET status = 'ACTIVE', appeal_outcome = 'REINSTATED', updated_at = datetime('now') WHERE id = ?
            `).run(bene.id);

            const contacts = getContactsForVault(vault.id);
            const beneContact = contacts.find(c => c.address.toLowerCase() === bene.address.toLowerCase());
            if (beneContact) {
                await queueNotification(vault.id, bene.address, 'EXECUTOR_ALERT', {
                    vaultName: vault.name,
                    recipientName: bene.name,
                    message: 'Your appeal has been reviewed and your share has been reinstated. Your transfer will be initiated shortly.',
                }, beneContact.email ?? undefined);
            }

            res.json({ message: 'Beneficiary reinstated. Transfer can now be initiated.' });
        } else {
            db.prepare(`
                UPDATE beneficiaries SET status = 'ESCROWED', appeal_outcome = 'REDIRECTED', updated_at = datetime('now') WHERE id = ?
            `).run(bene.id);

            const contacts = getContactsForVault(vault.id);
            const beneContact = contacts.find(c => c.address.toLowerCase() === bene.address.toLowerCase());
            if (beneContact) {
                await queueNotification(vault.id, bene.address, 'CHARITY_REDIRECT', {
                    vaultName: vault.name,
                    recipientName: bene.name,
                }, beneContact.email ?? undefined);
            }

            res.json({ message: 'Share redirected to charity. Permanent and irreversible.' });
        }
    } catch (err) {
        next(err);
    }
});

// Get appeal status
appealsRouter.get('/:vaultId/appeals/:benId', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const bene = db.prepare('SELECT * FROM beneficiaries WHERE id = ? AND vault_id = ?')
            .get(req.params.benId, req.params.vaultId) as BeneficiaryRow | undefined;
        if (!bene) { res.status(404).json({ error: 'Beneficiary not found' }); return; }

        const currentBlock = parseInt(req.query.currentBlock as string) || 0;
        const blocksRemaining = bene.appeal_deadline_block
            ? Math.max(0, bene.appeal_deadline_block - currentBlock)
            : null;

        res.json({
            beneficiaryId: bene.id,
            name: bene.name,
            status: bene.status,
            suspensionBlock: bene.suspension_block,
            appealDeadlineBlock: bene.appeal_deadline_block,
            blocksRemaining,
            daysRemaining: blocksRemaining ? Math.floor(blocksRemaining / 144) : null,
            evidenceSubmitted: !!bene.appeal_evidence_hash,
            outcome: bene.appeal_outcome,
        });
    } catch (err) {
        next(err);
    }
});
