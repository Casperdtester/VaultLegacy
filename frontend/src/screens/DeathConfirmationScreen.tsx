import { useState } from 'react';
import { COLORS, FONTS, blocksToApproxDays } from '../utils/constants.js';
import { Card, SectionHeading, GoldButton, StatusPill, Divider } from '../components/layout/UI';
import { MOCK_VAULT, CURRENT_BLOCK } from '../data/mockData.js';
import { useVault, useBackendHealth } from '../hooks/useVault.js';
import { useWallet } from '../context/WalletContext.js';

type Stage = 'idle' | 'certificate_uploaded' | 'awaiting_confirmation' | 'window_open' | 'window_closed';

export function DeathConfirmationScreen(): React.ReactElement {
    const vault = MOCK_VAULT;
    const [stage, setStage] = useState<Stage>('idle');
    const [certFile, setCertFile] = useState('');
    const [fraudEvidence, setFraudEvidence] = useState('');
    const [fraudFlagged, setFraudFlagged] = useState(false);
    const [fraudFile, setFraudFile] = useState('');

    const simulateWindowOpen = (): void => {
        setStage('window_open');
    };

    const windowEndsAtBlock = CURRENT_BLOCK + 432n;
    const blocksLeft = windowEndsAtBlock - CURRENT_BLOCK;
    const hoursLeft = Math.round(Number(blocksLeft) * 10 / 60);

    return (
        <div style={{ padding: '48px 40px', maxWidth: 800, margin: '0 auto' }}>
            <SectionHeading subtitle="Death-triggered unlock â€” the only way to release the vault">
                Vault Unlock
            </SectionHeading>

            {/* Current status */}
            <Card style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                            {vault.name}
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.ivory }}>
                            Current Vault Status
                        </div>
                    </div>
                    <StatusPill status={stage === 'window_open' ? 'WINDOW_OPEN' : stage === 'awaiting_confirmation' ? 'UNLOCK_INITIATED' : 'ACTIVE'} />
                </div>
            </Card>

            {/* Step 1 â€” Upload death certificate */}
            <Card style={{ marginBottom: 16, opacity: stage !== 'idle' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        border: `1px solid ${stage !== 'idle' ? COLORS.green : COLORS.gold}`,
                        background: stage !== 'idle' ? COLORS.green : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: stage !== 'idle' ? COLORS.obsidian : COLORS.gold,
                    }}>
                        {stage !== 'idle' ? 'âœ“' : '1'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                            Upload Death Certificate
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.6 }}>
                            Any registered party (beneficiary or executor) can initiate unlock by uploading the death certificate. The document hash is stored on-chain.
                        </div>
                        {stage === 'idle' && (
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                <label style={{
                                    padding: '10px 20px', border: `1px solid ${COLORS.border}`,
                                    color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, cursor: 'pointer',
                                    background: COLORS.mid,
                                }}>
                                    Select Certificate (PDF)
                                    <input type="file" accept=".pdf" style={{ display: 'none' }}
                                        onChange={(e) => setCertFile(e.target.files?.[0]?.name ?? '')} />
                                </label>
                                {certFile && <span style={{ fontSize: 12, color: COLORS.green }}>âœ“ {certFile}</span>}
                                <GoldButton
                                    onClick={() => setStage('certificate_uploaded')}
                                    disabled={!certFile}
                                >
                                    Submit Certificate
                                </GoldButton>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Step 2 â€” Executor co-confirms */}
            <Card style={{ marginBottom: 16, opacity: stage === 'idle' ? 0.4 : stage !== 'idle' && stage !== 'certificate_uploaded' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        border: `1px solid ${stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? COLORS.green : COLORS.border}`,
                        background: stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? COLORS.green : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                        color: stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? COLORS.obsidian : COLORS.muted,
                    }}>
                        {stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? 'âœ“' : '2'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                            Executor Co-Confirms On-Chain
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.6 }}>
                            The lawyer independently verifies the death certificate and confirms on-chain. This opens the 72-hour dispute window.
                        </div>
                        {stage === 'certificate_uploaded' && (
                            <GoldButton onClick={() => { setStage('awaiting_confirmation'); setTimeout(simulateWindowOpen, 1200); }}>
                                Confirm Death (Executor)
                            </GoldButton>
                        )}
                        {(stage === 'window_open' || stage === 'window_closed') && (
                            <div style={{ fontSize: 12, color: COLORS.green }}>âœ“ Confirmed at block {CURRENT_BLOCK.toLocaleString()}</div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Step 3 â€” 72-hour dispute window */}
            {(stage === 'window_open' || stage === 'window_closed') && (
                <Card accent={fraudFlagged ? 'red' : 'gold'} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{
                            width: 36, height: 36, flexShrink: 0,
                            border: `1px solid ${stage === 'window_closed' ? COLORS.green : COLORS.gold}`,
                            background: stage === 'window_closed' ? COLORS.green : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, color: stage === 'window_closed' ? COLORS.obsidian : COLORS.gold,
                        }}>
                            {stage === 'window_closed' ? 'âœ“' : '3'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                                72-Hour Dispute Window
                            </div>

                            {/* Countdown */}
                            <div style={{
                                padding: '16px 20px', background: COLORS.mid, border: `1px solid ${COLORS.border}`,
                                marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
                            }}>
                                <div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                        Window Closes At Block
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.gold }}>
                                        {windowEndsAtBlock.toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                        Approx. Time Remaining
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>
                                        ~{hoursLeft}h / {blocksToApproxDays(blocksLeft)}d
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                        Blocks Remaining
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>
                                        {blocksLeft.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Fraud flag section */}
                            {!fraudFlagged ? (
                                <div>
                                    <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12, lineHeight: 1.6 }}>
                                        Any registered signer may flag fraud during this window. Evidence is required â€” this is not a tap-to-dispute.
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <label style={{
                                            padding: '8px 16px', border: `1px solid ${COLORS.red}50`,
                                            color: COLORS.red, fontFamily: FONTS.body, fontSize: 12, cursor: 'pointer',
                                            background: `${COLORS.red}08`,
                                        }}>
                                            Upload Evidence
                                            <input type="file" style={{ display: 'none' }}
                                                onChange={(e) => setFraudFile(e.target.files?.[0]?.name ?? '')} />
                                        </label>
                                        {fraudFile && (
                                            <GoldButton
                                                variant="danger"
                                                onClick={() => setFraudFlagged(true)}
                                            >
                                                âš‘ Flag as Fraud
                                            </GoldButton>
                                        )}
                                        {!fraudFile && (
                                            <div style={{ fontSize: 11, color: COLORS.mutedDark }}>
                                                Evidence document required to flag fraud
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '12px 16px', border: `1px solid ${COLORS.red}`, background: `${COLORS.red}10` }}>
                                    <div style={{ fontSize: 12, color: COLORS.red, marginBottom: 4 }}>âš‘ Fraud Flag Active</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>
                                        Evidence uploaded. The executor has been notified. The window will not auto-close until this is resolved.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Step 4 â€” What happens after */}
            <Card style={{ opacity: stage === 'window_open' || stage === 'window_closed' ? 1 : 0.4 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        border: `1px solid ${COLORS.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: COLORS.muted,
                    }}>
                        4
                    </div>
                    <div>
                        <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                            After Window Closes
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>
                            <div style={{ marginBottom: 6 }}>â†’ Balance snapshot taken at that exact moment</div>
                            <div style={{ marginBottom: 6 }}>â†’ Executor fee auto-transferred first ({MOCK_VAULT.executor.feePercent / 100}%)</div>
                            <div style={{ marginBottom: 6 }}>â†’ Executor authorised to decrypt the will</div>
                            <div>â†’ Per-child transfers initiated independently</div>
                        </div>
                    </div>
                </div>
            </Card>

            {fraudEvidence && <div style={{ display: 'none' }}>{fraudEvidence}</div>}
        </div>
    );
}


