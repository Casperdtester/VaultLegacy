import type { Vault, AppealCase } from '../types/index.js';

export const MOCK_VAULT: Vault = {
    id: 'vault-001',
    name: 'Johnson Family Estate',
    contractAddress: 'bc1p4x9hq3z7k2m8n5t6w0y1a3b5c7d9e2f4g6h8j0k2l4m6n8p0q2r4s6t8u0v',
    ownerAddress: 'bc1powner123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890',
    status: 'ACTIVE',
    executor: {
        name: 'Adeyemi Okonkwo & Associates',
        address: 'bc1plawyer456def789ghi012jkl345mno678pqr901stu234vwx567yz890abc123',
        location: 'Lagos, Nigeria',
        feePercent: 200,
    },
    beneficiaries: [
        {
            id: 'bene-001',
            name: 'Chidi Johnson',
            address: 'bc1pchidi789ghi012jkl345mno678pqr901stu234vwx567yz890abc123def456',
            country: 'Nigeria',
            sharePercent: 3500,
            status: 'ACTIVE',
            isRemote: false,
        },
        {
            id: 'bene-002',
            name: 'Amara Johnson',
            address: 'bc1pamara012jkl345mno678pqr901stu234vwx567yz890abc123def456ghi789',
            country: 'United Kingdom',
            sharePercent: 3000,
            status: 'ACTIVE',
            isRemote: true,
        },
        {
            id: 'bene-003',
            name: 'Emeka Johnson',
            address: 'bc1pemeka345mno678pqr901stu234vwx567yz890abc123def456ghi789jkl012',
            country: 'Canada',
            sharePercent: 2000,
            status: 'SUSPENDED',
            isRemote: true,
            suspensionBlock: 890450n,
        },
        {
            id: 'bene-004',
            name: 'Ngozi Johnson',
            address: 'bc1pngozi678pqr901stu234vwx567yz890abc123def456ghi789jkl012mno345',
            country: 'Nigeria',
            sharePercent: 1500,
            status: 'ACTIVE',
            isRemote: false,
        },
    ],
    charity: {
        name: 'African Children Education Fund',
        address: 'bc1pcharity901stu234vwx567yz890abc123def456ghi789jkl012mno345pqr678',
    },
    willHash: 'a3f4b2c1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    clauseHash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    checkInFrequencyBlocks: 13140n,
    lastCheckInBlock: 887200n,
    missedCheckIns: 0,
    balanceSatoshis: 184200000n,
    balanceAtDeathSatoshis: 0n,
    deathConfirmedBlock: 0n,
    willDecryptionAuthorized: false,
    fraudFlagged: false,
    deployedAt: '2025-09-14',
    deposits: [
        {
            index: 0,
            amountSatoshis: 100000000n,
            blockNumber: 880100n,
            lawyerAcknowledged: true,
            txHash: 'tx001abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef',
        },
        {
            index: 1,
            amountSatoshis: 50000000n,
            blockNumber: 883500n,
            lawyerAcknowledged: true,
            txHash: 'tx002def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123456',
        },
        {
            index: 2,
            amountSatoshis: 34200000n,
            blockNumber: 886900n,
            lawyerAcknowledged: false,
            txHash: 'tx003ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123456def789',
        },
    ],
};

export const MOCK_VAULT_EXECUTING: Vault = {
    ...MOCK_VAULT,
    id: 'vault-002',
    status: 'EXECUTING',
    willDecryptionAuthorized: true,
    balanceAtDeathSatoshis: 184200000n,
    deathConfirmedBlock: 888000n,
    beneficiaries: [
        { ...MOCK_VAULT.beneficiaries[0]!, status: 'COMPLETE', transferTxHash: 'txcomp001' },
        { ...MOCK_VAULT.beneficiaries[1]!, status: 'ACTIVE' },
        { ...MOCK_VAULT.beneficiaries[2]!, status: 'SUSPENDED', suspensionBlock: 888200n },
        { ...MOCK_VAULT.beneficiaries[3]!, status: 'ACTIVE' },
    ],
};

export const MOCK_APPEAL: AppealCase = {
    beneficiaryId: 'bene-003',
    beneficiaryName: 'Emeka Johnson',
    suspensionReason:
        'Conditional clause violation: pending criminal charges as specified in the estate conditions document.',
    deadlineBlock: 892770n,
    evidenceSubmitted: false,
};

export const CURRENT_BLOCK = 889100n;

