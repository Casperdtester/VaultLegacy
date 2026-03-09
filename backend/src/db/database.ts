import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, '../../data/vaultlegacy.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (!_db) {
        _db = new Database(DB_PATH);
        _db.pragma('journal_mode = WAL');
        _db.pragma('foreign_keys = ON');
    }
    return _db;
}

export function initSchema(): void {
    const db = getDb();

    db.exec(`
        CREATE TABLE IF NOT EXISTS vaults (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            contract_address TEXT NOT NULL UNIQUE,
            owner_address TEXT NOT NULL,
            executor_address TEXT NOT NULL,
            executor_fee_percent INTEGER NOT NULL,
            will_hash TEXT NOT NULL,
            clause_hash TEXT NOT NULL,
            charity_address TEXT NOT NULL,
            check_in_frequency_blocks INTEGER NOT NULL,
            last_check_in_block INTEGER NOT NULL DEFAULT 0,
            missed_check_ins INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'ACTIVE',
            balance_satoshis INTEGER NOT NULL DEFAULT 0,
            balance_at_death_satoshis INTEGER NOT NULL DEFAULT 0,
            death_confirmed_block INTEGER NOT NULL DEFAULT 0,
            will_decryption_authorized INTEGER NOT NULL DEFAULT 0,
            fraud_flagged INTEGER NOT NULL DEFAULT 0,
            deployed_at TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS beneficiaries (
            id TEXT PRIMARY KEY,
            vault_id TEXT NOT NULL REFERENCES vaults(id),
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            country TEXT NOT NULL,
            share_percent INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'ACTIVE',
            is_remote INTEGER NOT NULL DEFAULT 0,
            transfer_tx_hash TEXT,
            suspension_block INTEGER,
            appeal_deadline_block INTEGER,
            appeal_evidence_hash TEXT,
            appeal_outcome TEXT NOT NULL DEFAULT 'PENDING',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS deposits (
            id TEXT PRIMARY KEY,
            vault_id TEXT NOT NULL REFERENCES vaults(id),
            deposit_index INTEGER NOT NULL,
            amount_satoshis INTEGER NOT NULL,
            block_number INTEGER NOT NULL,
            tx_hash TEXT NOT NULL,
            lawyer_acknowledged INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            UNIQUE(vault_id, deposit_index)
        );

        CREATE TABLE IF NOT EXISTS check_ins (
            id TEXT PRIMARY KEY,
            vault_id TEXT NOT NULL REFERENCES vaults(id),
            block_number INTEGER NOT NULL,
            tx_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            vault_id TEXT NOT NULL,
            recipient_address TEXT NOT NULL,
            recipient_email TEXT,
            recipient_phone TEXT,
            type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            payload TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            sent_at TEXT,
            retry_count INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS signers (
            id TEXT PRIMARY KEY,
            vault_id TEXT NOT NULL REFERENCES vaults(id),
            beneficiary_id TEXT NOT NULL REFERENCES beneficiaries(id),
            psbt_hex TEXT NOT NULL,
            amount_satoshis INTEGER NOT NULL,
            signing_token TEXT NOT NULL UNIQUE,
            expires_at TEXT NOT NULL,
            signed INTEGER NOT NULL DEFAULT 0,
            signed_psbt_hex TEXT,
            signed_at TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            vault_id TEXT NOT NULL REFERENCES vaults(id),
            address TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            push_subscription TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            UNIQUE(vault_id, address)
        );

        CREATE INDEX IF NOT EXISTS idx_vaults_owner ON vaults(owner_address);
        CREATE INDEX IF NOT EXISTS idx_vaults_status ON vaults(status);
        CREATE INDEX IF NOT EXISTS idx_beneficiaries_vault ON beneficiaries(vault_id);
        CREATE INDEX IF NOT EXISTS idx_deposits_vault ON deposits(vault_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
        CREATE INDEX IF NOT EXISTS idx_signers_token ON signers(signing_token);
    `);

    console.log('✓ Database schema initialized');
}
