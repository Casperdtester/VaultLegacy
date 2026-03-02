import { useState } from 'react';
import { COLORS, FONTS, formatBTC } from '../utils/constants.js';
import { Card, SectionHeading, GoldButton, StatusPill } from '../components/layout/UI';
import { MOCK_VAULT } from '../data/mockData.js';

export function DepositHistoryScreen(): React.ReactElement {
    const vault = MOCK_VAULT;
    const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set());

    const handleAcknowledge = (index: number): void => {
        setAcknowledged((prev) => new Set([...prev, index]));
    };

    const allDeposits = vault.deposits.map((d) => ({
        ...d,
        lawyerAcknowledged: d.lawyerAcknowledged || acknowledged.has(d.index),
    }));

    const totalAcknowledged = allDeposits.filter((d) => d.lawyerAcknowledged).reduce((s, d) => s + d.amountSatoshis, 0n);
    const totalPending = allDeposits.filter((d) => !d.lawyerAcknowledged).reduce((s, d) => s + d.amountSatoshis, 0n);

    return (
        <div style={{ padding: '48px 48px', maxWidth: 1000, margin: '0 auto' }}>
            <SectionHeading subtitle="On-chain log of all vault deposits and withdrawals">
                Deposit & Withdrawal History
            </SectionHeading>

            {/* Summary row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                <Card accent="gold">
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Total Deposited</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.gold }}>
                        {formatBTC(vault.balanceSatoshis)}
                    </div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Acknowledged</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.green }}>
                        {formatBTC(totalAcknowledged)}
                    </div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Pending Acknowledgment</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: totalPending > 0n ? COLORS.gold : COLORS.muted }}>
                        {formatBTC(totalPending)}
                    </div>
                </Card>
            </div>

            {/* Deposit log */}
            <Card>
                <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 20 }}>
                    Transaction Log
                </div>

                {/* Header row */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 180px 140px',
                    padding: '8px 14px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5,
                    gap: 12,
                }}>
                    <div>#</div>
                    <div>Transaction Hash</div>
                    <div>Amount</div>
                    <div>Block</div>
                    <div>Lawyer Status</div>
                    <div></div>
                </div>

                {allDeposits.map((deposit) => (
                    <div
                        key={deposit.index}
                        style={{
                            display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 180px 140px',
                            padding: '16px 14px',
                            borderBottom: `1px solid ${COLORS.border}`,
                            alignItems: 'center', gap: 12,
                            background: !deposit.lawyerAcknowledged ? `${COLORS.gold}05` : 'transparent',
                        }}
                    >
                        <div style={{ fontSize: 13, color: COLORS.muted }}>#{deposit.index + 1}</div>
                        <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all', minWidth: 0 }}>
                            {deposit.txHash.slice(0, 20)}...{deposit.txHash.slice(-8)}
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold }}>
                            {formatBTC(deposit.amountSatoshis)}
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'monospace' }}>
                            {deposit.blockNumber.toLocaleString()}
                        </div>
                        <div>
                            {deposit.lawyerAcknowledged ? (
                                <StatusPill status="COMPLETE" />
                            ) : (
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '3px 10px', borderRadius: 999,
                                    fontSize: 11, color: COLORS.gold,
                                    background: `${COLORS.gold}18`,
                                    border: `1px solid ${COLORS.gold}50`,
                                    fontFamily: FONTS.body, fontWeight: 500,
                                    textTransform: 'uppercase', letterSpacing: 0.5,
                                }}>
                                    â³ Pending
                                </div>
                            )}
                        </div>
                        <div>
                            {!deposit.lawyerAcknowledged && (
                                <GoldButton
                                    onClick={() => handleAcknowledge(deposit.index)}
                                    variant="ghost"
                                >
                                    Acknowledge
                                </GoldButton>
                            )}
                        </div>
                    </div>
                ))}
            </Card>

            <div style={{ marginTop: 16, fontSize: 12, color: COLORS.mutedDark, lineHeight: 1.8 }}>
                All deposits are recorded on-chain. Lawyer acknowledgment creates a permanent audit trail documenting each addition to the estate. BTC only â€” no fiat conversions.
            </div>
        </div>
    );
}


