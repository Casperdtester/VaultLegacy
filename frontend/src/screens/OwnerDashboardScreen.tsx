import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, formatBTC, formatSharePercent, blocksToApproxDays } from '../utils/constants.js';
import { BeneficiaryChip, StatusPill, GoldButton, Card, SectionHeading, Field, Divider, CharityRow } from '../components/layout/UI';
import { MOCK_VAULT, CURRENT_BLOCK } from '../data/mockData.js';
import { useVault, useBackendHealth } from '../hooks/useVault.js';
import { useWallet } from '../context/WalletContext.js';

function DeadMansBanner(): React.ReactElement {
    const vault = MOCK_VAULT;
    const nextDue = vault.lastCheckInBlock + vault.checkInFrequencyBlocks;
    const blocksLeft = nextDue > CURRENT_BLOCK ? nextDue - CURRENT_BLOCK : 0n;
    const daysLeft = blocksToApproxDays(blocksLeft);
    const isOverdue = blocksLeft === 0n;
    const isDueSoon = daysLeft < 14;

    const [checkedIn, setCheckedIn] = useState(false);

    return (
        <div style={{
            padding: '16px 24px',
            border: `1px solid ${isOverdue ? COLORS.red : isDueSoon ? COLORS.gold : COLORS.border}`,
            background: isOverdue ? `${COLORS.red}10` : isDueSoon ? `${COLORS.gold}08` : COLORS.mid,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 32,
            flexWrap: 'wrap',
        }}>
            <div>
                <div style={{ fontSize: 11, color: isOverdue ? COLORS.red : COLORS.gold, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                    {isOverdue ? 'âš  Dead Man\'s Switch â€” Overdue' : 'â—‰ Dead Man\'s Switch'}
                </div>
                {checkedIn ? (
                    <div style={{ fontSize: 14, color: COLORS.green }}>
                        âœ“ Checked in this session â€” timer reset
                    </div>
                ) : (
                    <div style={{ fontSize: 14, color: COLORS.ivory }}>
                        {isOverdue
                            ? 'Check-in overdue. Executor has been notified.'
                            : `Next check-in due in ${daysLeft} days (~${blocksLeft.toLocaleString()} blocks)`}
                    </div>
                )}
            </div>
            {!checkedIn && (
                <GoldButton
                    onClick={() => setCheckedIn(true)}
                    variant={isOverdue ? 'danger' : 'primary'}
                >
                    Check In Now
                </GoldButton>
            )}
        </div>
    );
}

function PendingAcknowledgment(): React.ReactElement | null {
    const pending = MOCK_VAULT.deposits.filter((d) => !d.lawyerAcknowledged);
    if (pending.length === 0) return null;

    return (
        <div style={{
            padding: '14px 20px',
            border: `1px solid ${COLORS.goldDim}`,
            background: `${COLORS.gold}08`,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <div>
                <span style={{ fontSize: 12, color: COLORS.gold }}>â³ Pending Lawyer Acknowledgment</span>
                <span style={{ fontSize: 12, color: COLORS.muted, marginLeft: 12 }}>
                    {pending.length} deposit{pending.length > 1 ? 's' : ''} awaiting executor sign-off
                </span>
            </div>
            <a href="/deposits" style={{ fontSize: 12, color: COLORS.gold, textDecoration: 'none' }}>View â†’</a>
        </div>
    );
}

function VaultHealthChecklist(): React.ReactElement {
    const vault = MOCK_VAULT;
    const checks = [
        { label: 'Will document attached', ok: !!vault.willHash },
        { label: 'Conditional clause attached', ok: !!vault.clauseHash },
        { label: 'All beneficiaries registered', ok: vault.beneficiaries.length > 0 },
        { label: 'Executor confirmed', ok: !!vault.executor.address },
        { label: 'Charity fallback set', ok: !!vault.charity.address },
        { label: 'Dead man\'s switch active', ok: vault.missedCheckIns < 3 },
        { label: 'Vault funded', ok: vault.balanceSatoshis > 0n },
    ];

    const score = checks.filter((c) => c.ok).length;

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, fontFamily: FONTS.body, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Vault Health
                </div>
                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: score === checks.length ? COLORS.green : COLORS.gold }}>
                    {score}/{checks.length}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {checks.map((c) => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: c.ok ? COLORS.green : COLORS.red, fontSize: 14 }}>{c.ok ? 'âœ“' : 'âœ—'}</span>
                        <span style={{ fontSize: 13, color: c.ok ? COLORS.ivory : COLORS.muted }}>{c.label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function OwnerDashboardScreen(): React.ReactElement {
    const navigate = useNavigate();
    const vault = MOCK_VAULT;

    return (
        <div style={{ padding: '48px 48px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <SectionHeading subtitle="OP_NET Testnet Â· All amounts in BTC only">
                    {vault.name}
                </SectionHeading>
                <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                    <StatusPill status={vault.status} />
                    <GoldButton onClick={() => navigate('/create')} variant="ghost">+ New Vault</GoldButton>
                </div>
            </div>

            <DeadMansBanner />
            <PendingAcknowledgment />

            {/* Balance + Executor row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <Card accent="gold">
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Vault Balance
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.gold, lineHeight: 1 }}>
                        {formatBTC(vault.balanceSatoshis)}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                        {vault.deposits.length} deposit{vault.deposits.length !== 1 ? 's' : ''} recorded
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <GoldButton onClick={() => navigate('/deposits')} variant="ghost">
                            View Deposit History
                        </GoldButton>
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
                        Executor
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.ivory, marginBottom: 4 }}>
                        {vault.executor.name}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>{vault.executor.location}</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Field label="Fee" value={<span style={{ color: COLORS.goldLight }}>{formatSharePercent(vault.executor.feePercent)}</span>} />
                        <Field label="Wallet" value={vault.executor.address.slice(0, 18) + '...'} mono />
                    </div>
                </Card>
            </div>

            {/* Beneficiaries */}
            <Card style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>
                        Beneficiaries
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>
                        {vault.beneficiaries.length} of 7 registered
                    </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {vault.beneficiaries.map((b) => (
                        <BeneficiaryChip key={b.id} name={b.name} isRemote={b.isRemote} status={b.status} />
                    ))}
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {vault.beneficiaries.map((b) => (
                        <div key={b.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 14, color: COLORS.ivory }}>{b.name}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted }}>{b.country}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.gold }}>
                                    {formatSharePercent(b.sharePercent)}
                                </div>
                                <StatusPill status={b.status} />
                            </div>
                        </div>
                    ))}
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <CharityRow name={vault.charity.name} address={vault.charity.address} />
            </Card>

            {/* Bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <VaultHealthChecklist />
                <Card>
                    <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 16 }}>
                        Quick Actions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <GoldButton onClick={() => navigate('/death')} variant="ghost" fullWidth>
                            Initiate Unlock (Death Certificate)
                        </GoldButton>
                        <GoldButton onClick={() => navigate('/certificate')} variant="ghost" fullWidth>
                            Download Vault Certificate
                        </GoldButton>
                        <GoldButton onClick={() => navigate('/deposits')} variant="ghost" fullWidth>
                            View Full Deposit History
                        </GoldButton>
                    </div>
                    <Divider />
                    <div style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.8 }}>
                        <div>Contract: <span style={{ color: COLORS.ivory, fontFamily: 'monospace', fontSize: 10 }}>{vault.contractAddress.slice(0, 28)}...</span></div>
                        <div>Deployed: {vault.deployedAt}</div>
                        <div>Network: OP_NET Testnet</div>
                    </div>
                </Card>
            </div>
        </div>
    );
}


