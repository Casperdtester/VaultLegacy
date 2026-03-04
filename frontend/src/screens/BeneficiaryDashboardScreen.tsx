import { COLORS, FONTS, formatSharePercent } from '../utils/constants.js';
import { Card, SectionHeading, StatusPill, GoldButton } from '../components/layout/UI';
import { MOCK_VAULT } from '../data/mockData.js';
import { useVault, useBackendHealth } from '../hooks/useVault.js';
import { useWallet } from '../context/WalletContext.js';

export function BeneficiaryDashboardScreen(): React.ReactElement {
    const vault = MOCK_VAULT;
    const me = vault.beneficiaries[1]!; // Amara â€” remote signer

    return (
        <div style={{ padding: '48px 40px', maxWidth: 720, margin: '0 auto' }}>
            <SectionHeading subtitle="Your inheritance summary â€” managed by VaultLegacy">
                My Inheritance
            </SectionHeading>

            {/* Identity card */}
            <Card accent="gold" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
                            Vault
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 4 }}>
                            {vault.name}
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted }}>
                            Executor: {vault.executor.name}
                        </div>
                    </div>
                    <StatusPill status={vault.status} />
                </div>
            </Card>

            {/* Your share â€” prominent, no total balance shown */}
            <Card style={{ marginBottom: 20, textAlign: 'center', padding: '48px 28px' }}>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                    Your Share of the Estate
                </div>
                <div style={{ fontFamily: FONTS.heading, fontSize: 80, color: COLORS.gold, lineHeight: 1, marginBottom: 8 }}>
                    {formatSharePercent(me.sharePercent)}
                </div>
                <div style={{ fontSize: 13, color: COLORS.muted, maxWidth: 380, margin: '0 auto', lineHeight: 1.7 }}>
                    Your exact BTC amount will only be shown when your individual transfer is initiated by the executor. The total vault balance is not visible to beneficiaries.
                </div>
            </Card>

            {/* Status explanation */}
            <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    What Happens Next
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        { step: '1', label: 'Owner passes away', done: false, note: 'Any party uploads a death certificate to initiate unlock.' },
                        { step: '2', label: 'Executor confirms death on-chain', done: false, note: 'A 72-hour dispute window opens. Fraud can be flagged during this period.' },
                        { step: '3', label: 'Executor pays fee, decrypts will', done: false, note: 'The executor receives their fee, then decrypts your share information.' },
                        { step: '4', label: 'Your transfer is initiated', done: false, note: 'You and the executor co-sign. You receive your BTC.' },
                    ].map((s) => (
                        <div key={s.step} style={{ display: 'flex', gap: 14 }}>
                            <div style={{
                                width: 28, height: 28, flexShrink: 0,
                                border: `1px solid ${s.done ? COLORS.green : COLORS.border}`,
                                background: s.done ? COLORS.green : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, color: s.done ? COLORS.obsidian : COLORS.muted,
                                fontFamily: FONTS.body,
                            }}>
                                {s.done ? 'âœ“' : s.step}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 2 }}>{s.label}</div>
                                <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{s.note}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Executor info */}
            <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 12 }}>
                    Your Executor
                </div>
                <div style={{ fontSize: 16, color: COLORS.ivory, marginBottom: 4 }}>{vault.executor.name}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>{vault.executor.location}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {vault.executor.address}
                </div>
            </Card>

            {/* Remote signer badge */}
            {me.isRemote && (
                <div style={{
                    padding: '14px 20px',
                    border: `1px solid ${COLORS.green}`,
                    background: `${COLORS.green}10`,
                    fontSize: 13, color: COLORS.green,
                }}>
                    ðŸŒ You are registered as a <strong>Remote Signer</strong>. When your transfer is ready, you will receive a secure signing link via email and SMS. You can sign from anywhere in the world.
                </div>
            )}
        </div>
    );
}


