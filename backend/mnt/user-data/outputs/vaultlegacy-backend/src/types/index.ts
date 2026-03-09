// ─── Vault Status ────────────────────────────────────────────────────────────

export type VaultStatus =
    | 'ACTIVE'
    | 'UNLOCK_INITIATED'
    | 'WINDOW_OPEN'
    | 'FEE_PAID'
    | 'EXECUTING'
    | 'COMPLETE';

export type BeneficiaryStatus = 'ACTIVE' | 'SUSPENDED' | 'COMPLETE' | 'ESCROWED';

export type AppealOutcome = 'PENDING' | 'REINSTATED' | 'REDIRECTED';

export type NotificationType =
    | 'CHECKIN_REMINDER'
    | 'CHECKIN_MISSED'
    | 'EXECUTOR_ALERT'
    | 'DEATH_INITIATED'
    | 'DEATH_CONFIRMED'
    | 'FRAUD_FLAGGED'
    | 'WINDOW_CLOSED'
    | 'FEE_PAID'
    | 'TRANSFER_READY'
    | 'TRANSFER_COMPLETE'
    | 'BENEFICIARY_SUSPENDED'
    | 'APPEAL_REMINDER'
    | 'APPEAL_EXPIRED'
    | 'CHARITY_REDIRECT'
    | 'TOP_UP_RECEIVED'
    | 'WITHDRAWAL_REQUESTED';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

// ─── Database Row Types ───────────────────────────────────────────────────────

export interface VaultRow {
    id: string;
    name: string;
    contract_address: string;
    owner_address: string;
    executor_address: string;
    executor_fee_percent: number; // basis points e.g. 200 = 2%
    will_hash: string;
    clause_hash: string;
    charity_address: string;
    check_in_frequency_blocks: number;
    last_check_in_block: number;
    missed_check_ins: number;
    status: VaultStatus;
    balance_satoshis: number;
    balance_at_death_satoshis: number;
    death_confirmed_block: number;
    will_decryption_authorized: 0 | 1;
    fraud_flagged: 0 | 1;
    deployed_at: string;
    created_at: string;
    updated_at: string;
}

export interface BeneficiaryRow {
    id: string;
    vault_id: string;
    name: string;
    address: string;
    country: string;
    share_percent: number; // basis points
    status: BeneficiaryStatus;
    is_remote: 0 | 1;
    transfer_tx_hash: string | null;
    suspension_block: number | null;
    appeal_deadline_block: number | null;
    appeal_evidence_hash: string | null;
    appeal_outcome: AppealOutcome;
    created_at: string;
    updated_at: string;
}

export interface DepositRow {
    id: string;
    vault_id: string;
    deposit_index: number;
    amount_satoshis: number;
    block_number: number;
    tx_hash: string;
    lawyer_acknowledged: 0 | 1;
    created_at: string;
}

export interface CheckInRow {
    id: string;
    vault_id: string;
    block_number: number;
    tx_hash: string;
    created_at: string;
}

export interface NotificationRow {
    id: string;
    vault_id: string;
    recipient_address: string;
    recipient_email: string | null;
    recipient_phone: string | null;
    type: NotificationType;
    status: NotificationStatus;
    payload: string; // JSON
    created_at: string;
    sent_at: string | null;
    retry_count: number;
}

export interface SignerRow {
    id: string;
    vault_id: string;
    beneficiary_id: string;
    psbt_hex: string;
    amount_satoshis: number;
    signing_token: string;
    expires_at: string;
    signed: 0 | 1;
    signed_psbt_hex: string | null;
    signed_at: string | null;
    created_at: string;
}

export interface ContactRow {
    id: string;
    vault_id: string;
    address: string;
    role: 'owner' | 'executor' | 'beneficiary';
    email: string | null;
    phone: string | null;
    push_subscription: string | null; // JSON
    created_at: string;
    updated_at: string;
}

// ─── API Request/Response Types ───────────────────────────────────────────────

export interface CreateVaultRequest {
    name: string;
    contractAddress: string;
    ownerAddress: string;
    executor: {
        address: string;
        feePercent: number;
    };
    beneficiaries: Array<{
        id: string;
        name: string;
        address: string;
        country: string;
        sharePercent: number;
        isRemote: boolean;
    }>;
    willHash: string;
    clauseHash: string;
    charityAddress: string;
    checkInFrequencyBlocks: number;
    deployedAt: string;
}

export interface CheckInRequest {
    ownerAddress: string;
    blockNumber: number;
    txHash: string;
}

export interface DepositRequest {
    depositIndex: number;
    amountSatoshis: number;
    blockNumber: number;
    txHash: string;
}

export interface DeathInitiateRequest {
    initiatorAddress: string;
    deathCertificateHash: string;
    blockNumber: number;
}

export interface DeathConfirmRequest {
    executorAddress: string;
    blockNumber: number;
    txHash: string;
}

export interface FraudFlagRequest {
    flaggerAddress: string;
    evidenceHash: string;
    blockNumber: number;
}

export interface TransferInitiateRequest {
    executorAddress: string;
    amountSatoshis: number;
    blockNumber: number;
}

export interface AppealEvidenceRequest {
    beneficiaryAddress: string;
    evidenceHash: string;
    evidenceDescription: string;
    blockNumber: number;
}

export interface AppealReviewRequest {
    executorAddress: string;
    decision: 'REINSTATE' | 'REDIRECT';
    blockNumber: number;
    txHash: string;
}

export interface RegisterContactRequest {
    address: string;
    role: 'owner' | 'executor' | 'beneficiary';
    email?: string;
    phone?: string;
    pushSubscription?: object;
}
