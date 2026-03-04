import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { requireWalletAuth, optionalWalletAuth } from '../middleware/auth.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { VaultRow, BeneficiaryRow, SignerRow } from '../types/index.js';

// ─── Contacts (email/phone registration per party) ────────────────────────────

export const contactsRouter = Router();

contactsRouter.post('/:vaultId/contacts', requireWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(req.params.vaultId) as VaultRow | undefined;
        if (!vault) { res.status(404).json({ error: 'Vault not found' }); return; }

        const { address, role, email, phone, pushSubscription } = req.body as {
            address: string; role: string; email?: string; phone?: string; pushSubscription?: object;
        };

        // Only the person registering their own contact, or owner registering parties
        const isOwner = req.walletAddress === vault.owner_address.toLowerCase();
        const isSelf = req.walletAddress === address.toLowerCase();

        if (!isOwner && !isSelf) {
            res.status(403).json({ error: 'You can only register your own contact details' });
            return;
        }

        const id = uuidv4();
        db.prepare(`
            INSERT INTO contacts (id, vault_id, address, role, email, phone, push_subscription)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(vault_id, address) DO UPDATE SET
                email = excluded.email,
                phone = excluded.phone,
                push_subscription = excluded.push_subscription,
                updated_at = datetime('now')
        `).run(
            id, vault.id, address, role,
            email ?? null,
            phone ?? null,
            pushSubscription ? JSON.stringify(pushSubscription) : null,
        );

        res.json({ message: 'Contact registered successfully' });
    } catch (err) {
        next(err);
    }
});

// ─── PSBT Signing Sessions ────────────────────────────────────────────────────

export const psbtRouter = Router();

// Get signing session by token (beneficiary opens link from email)
// No wallet auth required — token IS the auth for this endpoint
psbtRouter.get('/sign/:token', (req, res, next) => {
    try {
        const db = getDb();
        const signer = db.prepare('SELECT * FROM signers WHERE signing_token = ?')
            .get(req.params.token) as SignerRow | undefined;

        if (!signer) {
            res.status(404).json({ error: 'Signing session not found' });
            return;
        }

        if (new Date(signer.expires_at) < new Date()) {
            res.status(400).json({ error: 'This signing link has expired. Contact the executor for a new link.' });
            return;
        }

        if (signer.signed) {
            res.status(400).json({ error: 'This transfer has already been signed.' });
            return;
        }

        // Get vault and beneficiary for display
        const vault = db.prepare('SELECT * FROM vaults WHERE id = ?').get(signer.vault_id) as VaultRow;
        const bene = db.prepare('SELECT * FROM beneficiaries WHERE id = ?').get(signer.beneficiary_id) as BeneficiaryRow;

        // Return only what the beneficiary needs to see
        res.json({
            vaultName: vault.name,
            beneficiaryName: bene.name,
            beneficiaryAddress: bene.address,
            amountSatoshis: signer.amount_satoshis,
            btcAmount: (signer.amount_satoshis / 100_000_000).toFixed(8),
            executorAddress: vault.executor_address,
            expiresAt: signer.expires_at,
            // Never expose psbt_hex directly — frontend uses wallet SDK to sign
        });
    } catch (err) {
        next(err);
    }
});

// Submit signed PSBT
psbtRouter.post('/sign/:token', optionalWalletAuth, (req: AuthenticatedRequest, res, next) => {
    try {
        const db = getDb();
        const signer = db.prepare('SELECT * FROM signers WHERE signing_token = ?')
            .get(req.params.token) as SignerRow | undefined;

        if (!signer) { res.status(404).json({ error: 'Signing session not found' }); return; }
        if (new Date(signer.expires_at) < new Date()) {
            res.status(400).json({ error: 'Signing session expired' });
            return;
        }
        if (signer.signed) {
            res.status(400).json({ error: 'Already signed' });
            return;
        }

        const { signedPsbtHex } = req.body as { signedPsbtHex: string };
        if (!signedPsbtHex) {
            res.status(400).json({ error: 'signedPsbtHex is required' });
            return;
        }

        // Mark signed
        db.prepare(`
            UPDATE signers SET signed = 1, signed_psbt_hex = ?, signed_at = datetime('now') WHERE signing_token = ?
        `).run(signedPsbtHex, req.params.token);

        // Mark beneficiary complete
        db.prepare(`
            UPDATE beneficiaries SET status = 'COMPLETE', updated_at = datetime('now') WHERE id = ?
        `).run(signer.beneficiary_id);

        console.log(`✓ Transfer signed via token ${req.params.token}`);
        res.json({ message: 'Transfer signed successfully. Your BTC will arrive shortly.' });
    } catch (err) {
        next(err);
    }
});
