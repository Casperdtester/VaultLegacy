import { getDb } from '../db/database.js';
import { queueNotification, getContactsForVault } from './NotificationService.js';
import type { VaultRow, BeneficiaryRow } from '../types/index.js';

// 432 blocks = ~72 hours
const DISPUTE_WINDOW_BLOCKS = 432;
// 4320 blocks = ~30 days
const APPEAL_WINDOW_BLOCKS = 4320;
const BLOCKS_PER_DAY = 144;

// ─── Death Window Monitor ─────────────────────────────────────────────────────

export async function runDeathWindowCheck(currentBlock: number): Promise<void> {
    const db = getDb();

    const windowOpenVaults = db.prepare(`
        SELECT * FROM vaults WHERE status = 'WINDOW_OPEN'
    `).all() as VaultRow[];

    for (const vault of windowOpenVaults) {
        const blocksSinceDeath = currentBlock - vault.death_confirmed_block;

        if (blocksSinceDeath >= DISPUTE_WINDOW_BLOCKS) {
            await closeDisputeWindow(vault, currentBlock);
        } else {
            // Send warning at ~12 hours remaining
            const blocksRemaining = DISPUTE_WINDOW_BLOCKS - blocksSinceDeath;
            if (blocksRemaining <= 72 && blocksRemaining > 66) {
                const contacts = getContactsForVault(vault.id);
                for (const contact of contacts) {
                    await queueNotification(
                        vault.id,
                        contact.address,
                        'WINDOW_CLOSED',
                        {
                            vaultName: vault.name,
                            message: 'The 72-hour dispute window closes in approximately 12 hours.',
                        },
                        contact.email ?? undefined,
                    );
                }
            }
        }
    }
}

async function closeDisputeWindow(vault: VaultRow, currentBlock: number): Promise<void> {
    const db = getDb();

    if (vault.fraud_flagged) {
        console.log(`🚩 Vault "${vault.name}" has a fraud flag — window cannot auto-close. Manual review required.`);
        return;
    }

    console.log(`⏱️  Closing dispute window for vault "${vault.name}"`);

    // Snapshot balance at death
    const balanceAtDeath = vault.balance_satoshis;

    // Calculate lawyer fee
    const lawyerFeeSatoshis = Math.floor((balanceAtDeath * vault.executor_fee_percent) / 10000);
    const netEstate = balanceAtDeath - lawyerFeeSatoshis;

    // Update vault: FEE_PAID + authorize will decryption
    db.prepare(`
        UPDATE vaults 
        SET status = 'FEE_PAID', 
            balance_at_death_satoshis = ?,
            will_decryption_authorized = 1,
            updated_at = datetime('now')
        WHERE id = ?
    `).run(balanceAtDeath, vault.id);

    console.log(`✓ Vault "${vault.name}" — fee snapshot: ${lawyerFeeSatoshis} satoshis (${vault.executor_fee_percent / 100}%)`);
    console.log(`✓ Net estate for distribution: ${netEstate} satoshis`);

    // Notify executor — fee paid, will decryption authorized
    const contacts = getContactsForVault(vault.id);
    const executorContact = contacts.find(c => c.role === 'executor');

    if (executorContact) {
        const btcFee = (lawyerFeeSatoshis / 100_000_000).toFixed(8);
        await queueNotification(
            vault.id,
            vault.executor_address,
            'FEE_PAID',
            {
                vaultName: vault.name,
                btcAmount: btcFee,
            },
            executorContact.email ?? undefined,
            executorContact.phone ?? undefined,
        );
    }

    // Notify all beneficiaries that distribution is authorized
    const beneficiaries = db.prepare('SELECT * FROM beneficiaries WHERE vault_id = ?').all(vault.id) as BeneficiaryRow[];
    for (const bene of beneficiaries) {
        const beneContact = contacts.find(c => c.address === bene.address);
        if (beneContact) {
            await queueNotification(
                vault.id,
                bene.address,
                'DEATH_CONFIRMED',
                {
                    vaultName: vault.name,
                    recipientName: bene.name,
                },
                beneContact.email ?? undefined,
                beneContact.phone ?? undefined,
            );
        }
    }
}

// ─── Appeal Timeout Monitor ───────────────────────────────────────────────────

export async function runAppealTimeoutCheck(currentBlock: number): Promise<void> {
    const db = getDb();

    const suspendedBeneficiaries = db.prepare(`
        SELECT b.*, v.name as vault_name, v.charity_address
        FROM beneficiaries b
        JOIN vaults v ON b.vault_id = v.id
        WHERE b.status = 'SUSPENDED' 
        AND b.appeal_outcome = 'PENDING'
        AND b.appeal_deadline_block IS NOT NULL
    `).all() as Array<BeneficiaryRow & { vault_name: string; charity_address: string }>;

    for (const bene of suspendedBeneficiaries) {
        if (!bene.appeal_deadline_block) continue;

        const blocksRemaining = bene.appeal_deadline_block - currentBlock;

        if (blocksRemaining <= 0) {
            // Appeal window expired — auto redirect to charity
            await autoRedirectToCharity(bene, currentBlock);
        } else {
            // Send reminder at 7 days and 1 day remaining
            const daysRemaining = Math.floor(blocksRemaining / BLOCKS_PER_DAY);
            if ((daysRemaining === 7 || daysRemaining === 1) && blocksRemaining % BLOCKS_PER_DAY < 12) {
                const contacts = getContactsForVault(bene.vault_id);
                const beneContact = contacts.find(c => c.address === bene.address);

                if (beneContact) {
                    await queueNotification(
                        bene.vault_id,
                        bene.address,
                        'APPEAL_REMINDER',
                        {
                            vaultName: bene.vault_name,
                            recipientName: bene.name,
                            daysRemaining,
                            blocksRemaining,
                        },
                        beneContact.email ?? undefined,
                        beneContact.phone ?? undefined,
                    );
                    console.log(`⏰ Appeal reminder for ${bene.name} — ${daysRemaining} days remaining`);
                }
            }
        }
    }
}

async function autoRedirectToCharity(
    bene: BeneficiaryRow & { vault_name: string; charity_address: string },
    currentBlock: number,
): Promise<void> {
    const db = getDb();

    if (bene.appeal_evidence_hash) {
        // Evidence was submitted — don't auto-redirect, executor must review
        console.log(`📋 ${bene.name} submitted evidence — awaiting executor review`);
        return;
    }

    console.log(`⏰ Appeal expired for ${bene.name} — auto-redirecting to charity`);

    db.prepare(`
        UPDATE beneficiaries 
        SET status = 'ESCROWED', appeal_outcome = 'REDIRECTED', updated_at = datetime('now')
        WHERE id = ?
    `).run(bene.id);

    const contacts = getContactsForVault(bene.vault_id);

    // Notify beneficiary
    const beneContact = contacts.find(c => c.address === bene.address);
    if (beneContact) {
        await queueNotification(
            bene.vault_id,
            bene.address,
            'APPEAL_EXPIRED',
            {
                vaultName: bene.vault_name,
                recipientName: bene.name,
            },
            beneContact.email ?? undefined,
            beneContact.phone ?? undefined,
        );
    }

    // Notify executor of charity redirect
    const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(bene.vault_id) as VaultRow;
    const executorContact = contacts.find(c => c.role === 'executor');
    if (executorContact) {
        await queueNotification(
            bene.vault_id,
            vault.executor_address,
            'CHARITY_REDIRECT',
            {
                vaultName: bene.vault_name,
                recipientName: bene.name,
            },
            executorContact.email ?? undefined,
        );
    }
}
