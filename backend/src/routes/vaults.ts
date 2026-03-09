import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { requireWalletAuth } from '../middleware/auth.js';
import { queueNotification } from '../services/NotificationService.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { CreateVaultRequest, VaultRow, BeneficiaryRow } from '../types/index.js';

export const vaultsRouter = Router();

// ─── POST /api/vaults — Create vault record after on-chain deploy ─────────────

vaultsRouter.post('/', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const body = req.body as CreateVaultRequest;
        const db = getDb();

        // Validate required fields
        if (!body.name || !body.contractAddress || !body.ownerAddress) {
            res.status(400).json({ error: 'name, contractAddress, and ownerAddress are required' });
            return;
        }

        if (body.beneficiaries.length === 0 || body.beneficiaries.length > 7) {
            res.status(400).json({ error: 'Between 1 and 7 beneficiaries required' });
            return;
        }

        const totalShares = body.beneficiaries.reduce((sum, b) => sum + b.sharePercent, 0);
        if (totalShares !== 10000) {
            res.status(400).json({ error: 'Beneficiary share percentages must total exactly 100% (10000 basis points)' });
            return;
        }

        const vaultId = uuidv4();

        // Insert vault
        db.prepare(`
            INSERT INTO vaults (
                id, name, contract_address, owner_address,
                executor_address, executor_fee_percent,
                will_hash, clause_hash, charity_address,
                check_in_frequency_blocks, last_check_in_block,
                deployed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            vaultId, body.name, body.contractAddress, body.ownerAddress,
            body.executor.address, body.executor.feePercent,
            body.willHash, body.clauseHash, body.charityAddress,
            body.checkInFrequencyBlocks, 0,
            body.deployedAt,
        );

        // Insert beneficiaries
        for (const bene of body.beneficiaries) {
            db.prepare(`
                INSERT INTO beneficiaries (id, vault_id, name, address, country, share_percent, is_remote)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(bene.id, vaultId, bene.name, bene.address, bene.country, bene.sharePercent, bene.isRemote ? 1 : 0);
        }

        console.log(`✓ Vault created: "${body.name}" (${vaultId})`);
        res.status(201).json({ vaultId, message: 'Vault created successfully' });
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/vaults/:id — Get vault state ────────────────────────────────────

vaultsRouter.get('/:id', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.id) as VaultRow | undefined;

        if (!vault) {
            res.status(404).json({ error: 'Vault not found' });
            return;
        }

        const beneficiaries = db.prepare('SELECT * FROM beneficiaries WHERE vault_id = ?')
            .all(vault.id) as BeneficiaryRow[];

        const deposits = db.prepare('SELECT * FROM deposits WHERE vault_id = ? ORDER BY deposit_index ASC')
            .all(vault.id);

        // Role-based balance visibility
        const walletAddr = req.walletAddress ?? '';
        const isOwner = walletAddr === vault.owner_address.toLowerCase();
        const isExecutor = walletAddr === vault.executor_address.toLowerCase();
        const isBeneficiary = beneficiaries.some(b => b.address.toLowerCase() === walletAddr);

        // Beneficiaries cannot see total balance while vault is ACTIVE
        const showBalance = isOwner || isExecutor;

        res.json({
            id: vault.id,
            name: vault.name,
            contractAddress: vault.contract_address,
            status: vault.status,
            deployedAt: vault.deployed_at,
            executor: {
                address: vault.executor_address,
                feePercent: vault.executor_fee_percent,
            },
            balanceSatoshis: showBalance ? vault.balance_satoshis : null,
            balanceAtDeathSatoshis: showBalance ? vault.balance_at_death_satoshis : null,
            checkInFrequencyBlocks: vault.check_in_frequency_blocks,
            lastCheckInBlock: vault.last_check_in_block,
            missedCheckIns: vault.missed_check_ins,
            willDecryptionAuthorized: vault.will_decryption_authorized === 1,
            fraudFlagged: vault.fraud_flagged === 1,
            deathConfirmedBlock: vault.death_confirmed_block,
            beneficiaries: beneficiaries.map(b => ({
                id: b.id,
                name: b.name,
                address: b.address,
                country: b.country,
                sharePercent: b.share_percent,
                status: b.status,
                isRemote: b.is_remote === 1,
                // Hide other beneficiaries' shares from individual beneficiaries
                sharePercent: (isOwner || isExecutor || walletAddr === b.address.toLowerCase())
                    ? b.share_percent
                    : null,
                transferTxHash: b.transfer_tx_hash,
                appealOutcome: b.appeal_outcome,
            })),
            deposits: (isOwner || isExecutor) ? deposits : [],
        });
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/vaults — Get all vaults for a wallet address ───────────────────

vaultsRouter.get('/', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const addr = req.walletAddress!;

        const vaults = db.prepare(`
            SELECT DISTINCT v.id, v.name, v.status, v.balance_satoshis, v.deployed_at,
                   v.owner_address, v.executor_address,
                   (SELECT COUNT(*) FROM beneficiaries WHERE vault_id = v.id) as beneficiary_count
            FROM vaults v
            LEFT JOIN beneficiaries b ON b.vault_id = v.id
            WHERE v.owner_address = ? OR v.executor_address = ? OR b.address = ?
        `).all(addr, addr, addr);

        res.json({ vaults });
    } catch (err) {
        next(err);
    }
});

// ─── PUT /api/vaults/:id/balance — Update balance from chain sync ─────────────

vaultsRouter.put('/:id/balance', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const { balanceSatoshis } = req.body as { balanceSatoshis: number };
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.id) as VaultRow | undefined;

        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }
        if (req.walletAddress !== vault.owner_address.toLowerCase() &&
            req.walletAddress !== vault.executor_address.toLowerCase()) {
            res.status(403).json({ error: 'Only owner or executor can update balance' });
            return;
        }

        db.prepare('UPDATE vaults SET balance_satoshis = ?, updated_at = datetime(\'now\') WHERE id = ?')
            .run(balanceSatoshis, req.params.id);

        res.json({ message: 'Balance updated' });
    } catch (err) {
        next(err);
    }
});
