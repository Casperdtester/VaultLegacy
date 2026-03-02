export type VaultStatus =
    | 'ACTIVE'
    | 'UNLOCK_INITIATED'
    | 'WINDOW_OPEN'
    | 'FEE_PAID'
    | 'EXECUTING'
    | 'COMPLETE';

export type BeneficiaryStatus =
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'COMPLETE'
    | 'ESCROWED'
    | 'REDIRECTED';

export type CheckInFrequency = '3months' | '6months';

export type UserRole = 'owner' | 'lawyer' | 'beneficiary';

export interface Beneficiary {
    readonly id: string;
    readonly name: string;
    readonly address: string;
    readonly country: string;
    readonly sharePercent: number;
    readonly status: BeneficiaryStatus;
    readonly isRemote: boolean;
    readonly suspensionBlock?: bigint;
    readonly appealEvidenceHash?: string;
    readonly transferTxHash?: string;
}

export interface Executor {
    readonly name: string;
    readonly address: string;
    readonly location: string;
    readonly feePercent: number;
}

export interface CharityFallback {
    readonly name: string;
    readonly address: string;
}

export interface DepositRecord {
    readonly index: number;
    readonly amountSatoshis: bigint;
    readonly blockNumber: bigint;
    readonly lawyerAcknowledged: boolean;
    readonly txHash: string;
}

export interface Vault {
    readonly id: string;
    readonly name: string;
    readonly contractAddress: string;
    readonly ownerAddress: string;
    readonly status: VaultStatus;
    readonly executor: Executor;
    readonly beneficiaries: readonly Beneficiary[];
    readonly charity: CharityFallback;
    readonly willHash: string;
    readonly clauseHash: string;
    readonly checkInFrequencyBlocks: bigint;
    readonly lastCheckInBlock: bigint;
    readonly missedCheckIns: number;
    readonly balanceSatoshis: bigint;
    readonly balanceAtDeathSatoshis: bigint;
    readonly deathConfirmedBlock: bigint;
    readonly willDecryptionAuthorized: boolean;
    readonly fraudFlagged: boolean;
    readonly deployedAt: string;
    readonly deposits: readonly DepositRecord[];
}

export interface WizardStep1Data {
    readonly walletConnected: boolean;
    readonly walletAddress: string;
}

export interface WizardStep2Data {
    readonly vaultName: string;
}

export interface WizardStep3Data {
    readonly executor: Executor;
    readonly beneficiaries: readonly Beneficiary[];
    readonly charity: CharityFallback;
}

export interface WizardStep4Data {
    readonly willFileName: string;
    readonly clauseFileName: string;
    readonly willHash: string;
    readonly clauseHash: string;
    readonly encryptionComplete: boolean;
}

export interface WizardStep5Data {
    readonly checkInFrequency: CheckInFrequency;
}

export interface VaultWizardState {
    readonly step: number;
    readonly step1: Partial<WizardStep1Data>;
    readonly step2: Partial<WizardStep2Data>;
    readonly step3: Partial<WizardStep3Data>;
    readonly step4: Partial<WizardStep4Data>;
    readonly step5: Partial<WizardStep5Data>;
}

export interface AppealCase {
    readonly beneficiaryId: string;
    readonly beneficiaryName: string;
    readonly suspensionReason: string;
    readonly deadlineBlock: bigint;
    readonly evidenceHash?: string;
    readonly evidenceSubmitted: boolean;
}

