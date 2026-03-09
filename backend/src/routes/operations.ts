import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { requireWalletAuth } from '../middleware/auth.js';
import { queueNotification, getContactsForVault } from '../services/NotificationService.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { VaultRow, BeneficiaryRow } from '../types/index.js';

// ─── Check-ins ────────────────────────────────────────────────────────────────

export const checkInsRouter = Router();

checkInsRouter.post('/:vaultId/checkin', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;

        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.owner_address.toLowerCase()) {
            res.status(403).json({ error: 'Only the vault owner can check in' });
            return;
        }
        if (vault.status !== 'ACTIVE') {
            res.status(400).json({ error: 'Check-in only available for active vaults' });
            return;
        }

        const { blockNumber, txHash } = req.body as { blockNumber: number; txHash: string };

        // Record check-in
        db.prepare(`
            INSERT INTO check_ins (id, vault_id, block_number, tx_hash) VALUES (?, ?, ?, ?)
        `).run(uuidv4(), vault.id, blockNumber, txHash);

        // Reset dead man's switch
        db.prepare(`
            UPDATE vaults SET last_check_in_block = ?, missed_check_ins = 0, updated_at = datetime('now') WHERE id = ?
        `).run(blockNumber, vault.id);

        console.log(`✓ Check-in recorded for vault "${vault.name}" at block ${blockNumber}`);
        res.json({ message: 'Check-in recorded. Dead man\'s switch reset.' });
    } catch (err) {
        next(err);
    }
});

checkInsRouter.get('/:vaultId/checkin/status', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }

        const currentBlock = parseInt(req.query.currentBlock as string) || 0;
        const blocksSinceLast = currentBlock - vault.last_check_in_block;
        const blocksRemaining = vault.check_in_frequency_blocks - blocksSinceLast;
        const daysRemaining = Math.floor(blocksRemaining / 144);

        res.json({
            lastCheckInBlock: vault.last_check_in_block,
            checkInFrequencyBlocks: vault.check_in_frequency_blocks,
            missedCheckIns: vault.missed_check_ins,
            blocksRemaining: Math.max(0, blocksRemaining),
            daysRemaining: Math.max(0, daysRemaining),
            isOverdue: blocksRemaining <= 0,
        });
    } catch (err) {
        next(err);
    }
});

// ─── Deposits ─────────────────────────────────────────────────────────────────

export const depositsRouter = Router();

depositsRouter.post('/:vaultId/deposits', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.owner_address.toLowerCase()) {
            res.status(403).json({ error: 'Only the vault owner can record deposits' });
            return;
        }

        const { depositIndex, amountSatoshis, blockNumber, txHash } = req.body as {
            depositIndex: number; amountSatoshis: number; blockNumber: number; txHash: string;
        };

        db.prepare(`
            INSERT INTO deposits (id, vault_id, deposit_index, amount_satoshis, block_number, tx_hash)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(uuidv4(), vault.id, depositIndex, amountSatoshis, blockNumber, txHash);

        // Update vault balance
        db.prepare('UPDATE vaults SET balance_satoshis = balance_satoshis + ?, updated_at = datetime(\'now\') WHERE id = ?')
            .run(amountSatoshis, vault.id);

        // Notify executor to acknowledge
        const contacts = getContactsForVault(vault.id);
        const executorContact = contacts.find(c => c.role === 'executor');
        if (executorContact) {
            await queueNotification(vault.id, vault.executor_address, 'TOP_UP_RECEIVED', {
                vaultName: vault.name,
                btcAmount: (amountSatoshis / 100_000_000).toFixed(8),
            }, executorContact.email ?? undefined, executorContact.phone ?? undefined);
        }

        res.status(201).json({ message: 'Deposit recorded. Executor notified for acknowledgment.' });
    } catch (err) {
        next(err);
    }
});

depositsRouter.put('/:vaultId/deposits/:index/acknowledge', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.executor_address.toLowerCase()) {
            res.status(403).json({ error: 'Only the executor can acknowledge deposits' });
            return;
        }

        db.prepare(`
            UPDATE deposits SET lawyer_acknowledged = 1 WHERE vault_id = ? AND deposit_index = ?
        `).run(vault.id, req.params.index);

        res.json({ message: 'Deposit acknowledged on record.' });
    } catch (err) {
        next(err);
    }
});

depositsRouter.get('/:vaultId/deposits', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }

        const isOwnerOrExecutor =
            req.walletAddress === vault.owner_address.toLowerCase() ||
            req.walletAddress === vault.executor_address.toLowerCase();

        if (!isOwnerOrExecutor) {
            res.status(403).json({ error: 'Only owner or executor can view deposit history' });
            return;
        }

        const deposits = db.prepare('SELECT * FROM deposits WHERE vault_id = ? ORDER BY deposit_index ASC').all(vault.id);
        res.json({ deposits });
    } catch (err) {
        next(err);
    }
});

// ─── Death Confirmation ───────────────────────────────────────────────────────

export const deathRouter = Router();

deathRouter.post('/:vaultId/death/initiate', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (vault.status !== 'ACTIVE' && vault.status !== 'UNLOCK_INITIATED') {
            res.status(400).json({ error: `Cannot initiate death unlock from status: ${vault.status}` });
            return;
        }

        const { deathCertificateHash, blockNumber } = req.body as { deathCertificateHash: string; blockNumber: number };

        db.prepare(`
            UPDATE vaults SET status = 'UNLOCK_INITIATED', updated_at = datetime('now') WHERE id = ?
        `).run(vault.id);

        // Notify all parties
        const contacts = getContactsForVault(vault.id);
        for (const contact of contacts) {
            await queueNotification(vault.id, contact.address, 'DEATH_INITIATED', {
                vaultName: vault.name,
                deathCertificateHash,
            }, contact.email ?? undefined, contact.phone ?? undefined);
        }

        console.log(`🔓 Unlock initiated for vault "${vault.name}" — cert hash: ${deathCertificateHash}`);
        res.json({ message: 'Unlock initiated. All parties notified. Awaiting executor confirmation.' });
    } catch (err) {
        next(err);
    }
});

deathRouter.post('/:vaultId/death/confirm', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.executor_address.toLowerCase()) {
            res.status(403).json({ error: 'Only the executor can confirm death' });
            return;
        }
        if (vault.status !== 'UNLOCK_INITIATED') {
            res.status(400).json({ error: 'Death must be initiated before confirmation' });
            return;
        }

        const { blockNumber } = req.body as { blockNumber: number };

        db.prepare(`
            UPDATE vaults SET status = 'WINDOW_OPEN', death_confirmed_block = ?, updated_at = datetime('now') WHERE id = ?
        `).run(blockNumber, vault.id);

        // Notify all parties — 72-hour window is open
        const contacts = getContactsForVault(vault.id);
        for (const contact of contacts) {
            await queueNotification(vault.id, contact.address, 'DEATH_CONFIRMED', {
                vaultName: vault.name,
                message: '72-hour dispute window is now open.',
            }, contact.email ?? undefined, contact.phone ?? undefined);
        }

        console.log(`✓ Death confirmed for vault "${vault.name}" at block ${blockNumber} — 72h window open`);
        res.json({ message: 'Death confirmed. 72-hour dispute window is now open.' });
    } catch (err) {
        next(err);
    }
});

deathRouter.post('/:vaultId/death/fraud', requireWalletAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (vault.status !== 'WINDOW_OPEN') {
            res.status(400).json({ error: 'Fraud can only be flagged during the 72-hour window' });
            return;
        }

        const { evidenceHash } = req.body as { evidenceHash: string };
        if (!evidenceHash) {
            res.status(400).json({ error: 'Evidence hash is required to flag fraud' });
            return;
        }

        db.prepare(`
            UPDATE vaults SET fraud_flagged = 1, updated_at = datetime('now') WHERE id = ?
        `).run(vault.id);

        // Notify all parties
        const contacts = getContactsForVault(vault.id);
        for (const contact of contacts) {
            await queueNotification(vault.id, contact.address, 'FRAUD_FLAGGED', {
                vaultName: vault.name,
                evidenceHash,
                flaggerAddress: req.walletAddress,
            }, contact.email ?? undefined);
        }

        res.json({ message: 'Fraud flag recorded. All parties notified. Manual review required.' });
    } catch (err) {
        next(err);
    }
});

deathRouter.get('/:vaultId/death/window', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }

        const currentBlock = parseInt(req.query.currentBlock as string) || 0;
        const WINDOW_BLOCKS = 432; // 72 hours
        const blocksElapsed = currentBlock - vault.death_confirmed_block;
        const blocksRemaining = Math.max(0, WINDOW_BLOCKS - blocksElapsed);

        res.json({
            status: vault.status,
            deathConfirmedBlock: vault.death_confirmed_block,
            windowBlocksTotal: WINDOW_BLOCKS,
            blocksElapsed,
            blocksRemaining,
            hoursRemaining: Math.floor(blocksRemaining / 6),
            windowClosed: blocksRemaining === 0,
            fraudFlagged: vault.fraud_flagged === 1,
        });
    } catch (err) {
        next(err);
    }
});
