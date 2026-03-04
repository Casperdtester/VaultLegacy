import { getDb } from '../db/database.js';
import { queueNotification, getContactsForVault } from './NotificationService.js';
import type { VaultRow } from '../types/index.js';

// Bitcoin produces ~144 blocks per day
const BLOCKS_PER_DAY = 144;

export async function runDeadMansSwitchCheck(currentBlock: number): Promise<void> {
    const db = getDb();

    const activeVaults = db.prepare(`
        SELECT * FROM vaults WHERE status = 'ACTIVE'
    `).all() as VaultRow[];

    for (const vault of activeVaults) {
        await processVaultCheckIn(vault, currentBlock);
    }
}

async function processVaultCheckIn(vault: VaultRow, currentBlock: number): Promise<void> {
    const db = getDb();
    const blocksSinceLastCheckIn = currentBlock - vault.last_check_in_block;
    const freq = vault.check_in_frequency_blocks;

    // Calculate how many check-in periods have been missed
    const periodsElapsed = Math.floor(blocksSinceLastCheckIn / freq);

    if (periodsElapsed === 0) {
        // Within current period — check if approaching deadline
        const blocksRemaining = freq - blocksSinceLastCheckIn;
        const daysRemaining = Math.floor(blocksRemaining / BLOCKS_PER_DAY);

        // Send reminders at 14 days, 7 days, 3 days, 1 day
        const reminderThresholds = [14 * BLOCKS_PER_DAY, 7 * BLOCKS_PER_DAY, 3 * BLOCKS_PER_DAY, BLOCKS_PER_DAY];
        
        for (const threshold of reminderThresholds) {
            if (blocksRemaining <= threshold && blocksRemaining > threshold - 144) {
                // Send reminder — only once per threshold
                const contacts = getContactsForVault(vault.id);
                const ownerContact = contacts.find(c => c.role === 'owner');
                
                if (ownerContact) {
                    await queueNotification(
                        vault.id,
                        vault.owner_address,
                        'CHECKIN_REMINDER',
                        {
                            vaultName: vault.name,
                            daysRemaining,
                            blocksRemaining,
                        },
                        ownerContact.email ?? undefined,
                        ownerContact.phone ?? undefined,
                    );
                    console.log(`⏰ Check-in reminder queued for vault ${vault.name} — ${daysRemaining} days remaining`);
                }
                break;
            }
        }
        return;
    }

    // One or more periods missed
    const newMissedCount = periodsElapsed;

    if (newMissedCount !== vault.missed_check_ins) {
        // Update missed count
        db.prepare(`
            UPDATE vaults SET missed_check_ins = ?, updated_at = datetime('now') WHERE id = ?
        `).run(newMissedCount, vault.id);

        const contacts = getContactsForVault(vault.id);
        const ownerContact = contacts.find(c => c.role === 'owner');
        const executorContact = contacts.find(c => c.role === 'executor');

        // Notify owner of missed check-in
        if (ownerContact) {
            await queueNotification(
                vault.id,
                vault.owner_address,
                'CHECKIN_MISSED',
                {
                    vaultName: vault.name,
                    missedCount: newMissedCount,
                },
                ownerContact.email ?? undefined,
                ownerContact.phone ?? undefined,
            );
        }

        console.log(`⚠️  Vault "${vault.name}" — ${newMissedCount} missed check-in(s)`);
    }

    // After 3 missed check-ins — notify executor and begin unlock
    if (vault.missed_check_ins >= 3 && vault.status === 'ACTIVE') {
        console.log(`🚨 Vault "${vault.name}" — 3 missed check-ins, notifying executor`);

        const contacts = getContactsForVault(vault.id);
        const executorContact = contacts.find(c => c.role === 'executor');

        if (executorContact) {
            await queueNotification(
                vault.id,
                vault.executor_address,
                'EXECUTOR_ALERT',
                {
                    vaultName: vault.name,
                    message: `The vault owner has missed ${vault.missed_check_ins} consecutive check-in periods. Please verify the owner's status and consider initiating the unlock process.`,
                },
                executorContact.email ?? undefined,
                executorContact.phone ?? undefined,
            );
        }

        // Transition to UNLOCK_INITIATED automatically after 3 missed check-ins
        db.prepare(`
            UPDATE vaults SET status = 'UNLOCK_INITIATED', updated_at = datetime('now') WHERE id = ?
        `).run(vault.id);

        // Notify all parties
        const allContacts = getContactsForVault(vault.id);
        for (const contact of allContacts) {
            await queueNotification(
                vault.id,
                contact.address,
                'DEATH_INITIATED',
                {
                    vaultName: vault.name,
                    message: 'Vault unlock initiated due to missed check-ins. A death certificate submission is required to proceed.',
                },
                contact.email ?? undefined,
                contact.phone ?? undefined,
            );
        }
    }
}
