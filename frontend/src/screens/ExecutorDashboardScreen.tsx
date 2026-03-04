import { useState } from 'react';
import { COLORS, FONTS, formatBTC, formatSharePercent, blocksToApproxDays } from '../utils/constants.js';
import { BeneficiaryChip, StatusPill, GoldButton, Card, SectionHeading, Divider, CharityRow } from '../components/layout/UI';
import { MOCK_VAULT_EXECUTING, CURRENT_BLOCK } from '../data/mockData.js';
import { useVault, useBackendHealth } from '../hooks/useVault.js';
import { useWallet } from '../context/WalletContext.js';
import type { Beneficiary } from '../types/index.js';

function TransferRow({ b, lawyerFee }: { readonly b: Beneficiary; readonly lawyerFee: bigint }): React.ReactElement {
    const [initiated, setInitiated] = useState(false);
    const vaultBalance = MOCK_VAULT_EXECUTING.balanceAtDeathSatoshis;
    const netBalance = vaultBalance - lawyerFee;
    const childAmount = (netBalance * BigInt(b.sharePercent)) / 10000n;

    const actionLabel = (): string => {
        if (b.status === 'COMPLETE') return 'Complete';
        if (b.status === 'SUSPENDED') return 'Suspended â€” Appeal Open';
        if (b.status === 'ESCROWED') return 'Held in Escrow';
        if (b.status === 'REDIRECTED') return 'Redirected to Charity';
        if (initiated) return 'Transfer Initiated â€” Awaiting Signature';
        return 'Initiate Transfer';
    };

    const canInitiate = b.status === 'ACTIVE' && !initiated;
    const appealDaysLeft = b.suspensionBlock
        ? blocksToApproxDays(b.suspensionBlock + 4320n > CURRENT_BLOCK ? b.suspensionBlock + 4320n - CURRENT_BLOCK : 0n)
        : 0;

    return (
        <div style={{
            padding: '16px 20px',
            border: `1px solid ${b.status === 'SUSPENDED' ? COLORS.red : b.status === 'COMPLETE' ? COLORS.mutedDark : COLORS.border}`,
            background: b.status === 'COMPLETE' ? `${COLORS.muted}08` : COLORS.mid,
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
            <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <BeneficiaryChip name={b.name} isRemote={b.isRemote} status={b.status} />
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{b.country}</div>
                {b.status === 'SUSPENDED' && (
                    <div style={{ fontSize: 11, color: COLORS.red, marginTop: 4 }}>
                        âš‘ Appeal window: {appealDaysLeft} days remaining
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: b.status === 'COMPLETE' ? COLORS.muted : COLORS.gold }}>
                    {b.status === 'ACTIVE' || b.status === 'SUSPENDED' || b.status === 'ESCROWED'
                        ? formatBTC(childAmount)
                        : b.status === 'COMPLETE' ? 'âœ“ Sent' : 'â†’ Charity'}
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{formatSharePercent(b.sharePercent)} of net estate</div>
            </div>

            <div style={{ minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <StatusPill status={b.status} />
                {canInitiate && (
                    <GoldButton onClick={() => setInitiated(true)} variant="ghost">
                        Initiate Transfer
                    </GoldButton>
                )}
                {initiated && b.status === 'ACTIVE' && (
                    <div style={{ fontSize: 11, color: COLORS.gold }}>âŸ³ Awaiting child signature</div>
                )}
                {b.status === 'SUSPENDED' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <GoldButton variant="ghost">Reinstate</GoldButton>
                        <GoldButton variant="danger">â†’ Charity</GoldButton>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ExecutorDashboardScreen(): React.ReactElement {
    const vault = MOCK_VAULT_EXECUTING;
    const lawyerFeeSatoshis = (vault.balanceAtDeathSatoshis * BigInt(vault.executor.feePercent)) / 10000n;
    const netEstate = vault.balanceAtDeathSatoshis - lawyerFeeSatoshis;
    const canDecrypt = vault.willDecryptionAuthorized;

    return (
        <div style={{ padding: '48px 48px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <SectionHeading subtitle="Executor view â€” full balance visible">
                    {vault.name}
                </SectionHeading>
                <StatusPill status={vault.status} />
            </div>

            {/* Balance summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                <Card accent="gold">
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Balance at Death
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.gold }}>
                        {formatBTC(vault.balanceAtDeathSatoshis)}
                    </div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Your Fee ({formatSharePercent(vault.executor.feePercent)})
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.goldLight }}>
                        {formatBTC(lawyerFeeSatoshis)}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.green, marginTop: 6 }}>âœ“ Paid to executor wallet</div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Net Estate (for distribution)
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.ivory }}>
                        {formatBTC(netEstate)}
                    </div>
                </Card>
            </div>

            {/* Will decryption */}
            {canDecrypt && (
                <Card accent="gold" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 13, color: COLORS.gold, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                                âœ“ Will Decryption Authorized
                            </div>
                            <div style={{ fontSize: 13, color: COLORS.muted }}>
                                You may now decrypt and read the will document from IPFS.
                            </div>
                        </div>
                        <GoldButton>Decrypt Will</GoldButton>
                    </div>
                    <Divider />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Will SHA-256 Hash</div>
                            <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>{vault.willHash}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Conditional Clause Hash</div>
                            <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>{vault.clauseHash}</div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Per-child transfer rows */}
            <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 16 }}>
                    Beneficiary Transfers â€” Independent Per Child
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {vault.beneficiaries.map((b) => (
                        <TransferRow key={b.id} b={b} lawyerFee={lawyerFeeSatoshis} />
                    ))}
                </div>
            </div>

            <Divider />
            <CharityRow name={vault.charity.name} address={vault.charity.address} />
        </div>
    );
}


