import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { getMyVaults, initiateTransfer, suspendBeneficiary, reviewAppeal, acknowledgeDeposit, confirmDeath, APIError } from '../api/client';
import type { Vault, Beneficiary } from '../types/index';

function satsToBTC(s: number): string { return (s / 1e8).toFixed(8); }

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
    ACTIVE: { color: COLORS.gold, bg: `${COLORS.gold}18`, label: 'Pending Signature' },
    SUSPENDED: { color: COLORS.red, bg: `${COLORS.red}18`, label: 'Suspended - Appeal Open' },
    COMPLETE: { color: COLORS.muted, bg: `${COLORS.muted}18`, label: 'Complete' },
    ESCROWED: { color: COLORS.muted, bg: `${COLORS.muted}18`, label: 'Escrowed' },
    REDIRECTED: { color: COLORS.red, bg: `${COLORS.red}18`, label: 'Redirected to Charity' },
};

export function ExecutorDashboardScreen(): React.ReactElement {
    const navigate = useNavigate();
    const { address, getHeaders, currentBlock, connected } = useWallet();
    const [vault, setVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'transfers' | 'deposits' | 'death'>('transfers');
    const [actionMsg, setActionMsg] = useState('');
    const [actionError, setActionError] = useState('');
    const [busyBen, setBusyBen] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!connected) return;
        try {
            const all = await getMyVaults(getHeaders());
            setVault(all[0] ?? null);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, [connected, getHeaders]);

    useEffect(() => { void load(); }, [load]);

    const feePct = vault?.executor?.feePercent ?? 0;
    const balSats = vault?.balanceSatoshis ?? 0;
    const feeSats = Math.round(balSats * feePct / 100);
    const netSats = balSats - feeSats;

    const handleInitiate = async (b: Beneficiary) => {
        if (!vault) return;
        setBusyBen(b.id); setActionError('');
        try {
            const shareSats = Math.round(netSats * b.sharePercent / 100);
            await initiateTransfer(vault.id, b.id, b.address, shareSats, currentBlock, getHeaders());
            setActionMsg(`Transfer initiated for ${b.name}`);
            void load();
        } catch (e) { setActionError(e instanceof APIError ? e.message : 'Action failed'); }
        finally { setBusyBen(null); }
    };

    const handleSuspend = async (b: Beneficiary) => {
        if (!vault) return;
        setBusyBen(b.id); setActionError('');
        try {
            await suspendBeneficiary(vault.id, b.id, currentBlock, getHeaders());
            setActionMsg(`${b.name} suspended`);
            void load();
        } catch (e) { setActionError(e instanceof APIError ? e.message : 'Action failed'); }
        finally { setBusyBen(null); }
    };

    const handleReview = async (b: Beneficiary, decision: 'REINSTATE' | 'REDIRECT') => {
        if (!vault) return;
        setBusyBen(b.id); setActionError('');
        try {
            await reviewAppeal(vault.id, b.id, decision, currentBlock, getHeaders());
            setActionMsg(decision === 'REINSTATE' ? `${b.name} reinstated` : `${b.name} share redirected to charity`);
            void load();
        } catch (e) { setActionError(e instanceof APIError ? e.message : 'Action failed'); }
        finally { setBusyBen(null); }
    };

    const handleAckDeposit = async (depositId: string) => {
        if (!vault) return;
        setBusyBen(depositId); setActionError('');
        try {
            await acknowledgeDeposit(vault.id, depositId, currentBlock, getHeaders());
            setActionMsg('Deposit acknowledged');
            void load();
        } catch (e) { setActionError(e instanceof APIError ? e.message : 'Action failed'); }
        finally { setBusyBen(null); }
    };

    const handleConfirmDeath = async () => {
        if (!vault) return;
        setActionError('');
        try {
            await confirmDeath(vault.id, currentBlock, getHeaders());
            setActionMsg('Death confirmed on-chain. Fee transfer and will decryption authorized.');
            void load();
        } catch (e) { setActionError(e instanceof APIError ? e.message : 'Action failed'); }
    };

    if (!connected) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 16 }}>Connect Your Wallet</div>
                <button onClick={() => navigate('/')} style={{ padding: '12px 32px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>Go to Home</button>
            </div>
        </div>
    );

    if (loading) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 44, height: 44, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: '50%' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Executor Dashboard</span>
                    <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace' }}>{address.slice(0, 14)}...</span>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
                {!vault ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>No Assigned Vaults</div>
                        <div style={{ fontSize: 14, color: COLORS.muted }}>You have not been registered as executor on any vault yet.</div>
                    </div>
                ) : (
                    <>
                        {(actionMsg || actionError) && (
                            <div style={{ padding: '12px 20px', background: actionError ? `${COLORS.red}10` : `${COLORS.green}10`, border: `1px solid ${actionError ? COLORS.red : COLORS.green}40`, color: actionError ? COLORS.red : COLORS.green, fontSize: 13, marginBottom: 20 }}>
                                {actionMsg || actionError}
                            </div>
                        )}

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 32, marginBottom: 32 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Estate Under Management</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>{vault.name}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace', marginTop: 6 }}>{vault.contractAddress.slice(0, 32)}...</div>
                                </div>
                                <div style={{ padding: '4px 14px', background: `${COLORS.gold}20`, border: `1px solid ${COLORS.goldDim}`, fontSize: 11, color: COLORS.gold, letterSpacing: 1.5 }}>{vault.status}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                                {[
                                    { label: 'Vault Balance', value: `${satsToBTC(balSats)} BTC`, color: COLORS.gold },
                                    { label: `Executor Fee (${feePct}%)`, value: `${satsToBTC(feeSats)} BTC`, color: COLORS.goldLight },
                                    { label: 'Net Estate', value: `${satsToBTC(netSats)} BTC`, color: COLORS.ivory },
                                    { label: 'Network', value: 'OP_NET L1', color: COLORS.muted },
                                ].map((s) => (
                                    <div key={s.label} style={{ padding: '16px 20px', background: COLORS.mid }}>
                                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: s.label === 'Network' ? 14 : 18, color: s.color }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div style={{ display: 'flex', marginBottom: 24, borderBottom: `1px solid ${COLORS.border}` }}>
                            {(['transfers', 'deposits', 'death'] as const).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 28px', background: 'none', border: 'none', borderBottom: activeTab === tab ? `2px solid ${COLORS.gold}` : '2px solid transparent', color: activeTab === tab ? COLORS.gold : COLORS.muted, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', marginBottom: -1 }}>
                                    {tab === 'transfers' ? 'Transfers' : tab === 'deposits' ? 'Deposits' : 'Death Confirmation'}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'transfers' && (
                                <motion.div key="transfers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {vault.beneficiaries.map((b) => {
                                            const st = STATUS_STYLE[b.status] ?? STATUS_STYLE.ACTIVE;
                                            const shareSats = Math.round(netSats * b.sharePercent / 100);
                                            const busy = busyBen === b.id;
                                            return (
                                                <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                                    <div style={{ padding: '3px 10px', background: b.isRemote ? `${COLORS.green}20` : `${COLORS.gold}20`, border: `1px solid ${b.isRemote ? COLORS.green : COLORS.goldDim}`, fontSize: 10, color: b.isRemote ? COLORS.green : COLORS.gold, letterSpacing: 1, flexShrink: 0 }}>
                                                        {b.isRemote ? 'REMOTE' : 'LOCAL'}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 140 }}>
                                                        <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 3 }}>{b.name}</div>
                                                        <div style={{ fontSize: 11, color: COLORS.muted }}>{b.country}</div>
                                                    </div>
                                                    <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold, minWidth: 140 }}>
                                                        {vault.status === 'ACTIVE' || vault.status === 'UNLOCK_INITIATED' ? `${b.sharePercent}% share` : `${satsToBTC(shareSats)} BTC`}
                                                    </div>
                                                    <div style={{ padding: '3px 12px', background: st.bg, border: `1px solid ${st.color}50`, fontSize: 10, color: st.color, letterSpacing: 1 }}>{st.label}</div>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        {b.status === 'ACTIVE' && vault.status !== 'ACTIVE' && (
                                                            <>
                                                                <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={() => handleInitiate(b)} disabled={busy} style={{ padding: '8px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.gold, fontSize: 11, letterSpacing: 1, cursor: busy ? 'wait' : 'pointer' }}>
                                                                    {busy ? '...' : 'Initiate'}
                                                                </motion.button>
                                                                <motion.button whileHover={{ background: `${COLORS.red}20` }} onClick={() => handleSuspend(b)} disabled={busy} style={{ padding: '8px 14px', background: 'none', border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 11, cursor: busy ? 'wait' : 'pointer' }}>
                                                                    Suspend
                                                                </motion.button>
                                                            </>
                                                        )}
                                                        {b.status === 'SUSPENDED' && (
                                                            <>
                                                                <motion.button whileHover={{ background: `${COLORS.green}20` }} onClick={() => handleReview(b, 'REINSTATE')} disabled={busy} style={{ padding: '8px 14px', background: 'none', border: `1px solid ${COLORS.green}50`, color: COLORS.green, fontSize: 11, cursor: busy ? 'wait' : 'pointer' }}>
                                                                    Reinstate
                                                                </motion.button>
                                                                <motion.button whileHover={{ background: `${COLORS.red}20` }} onClick={() => handleReview(b, 'REDIRECT')} disabled={busy} style={{ padding: '8px 14px', background: 'none', border: `1px solid ${COLORS.red}50`, color: COLORS.red, fontSize: 11, cursor: busy ? 'wait' : 'pointer' }}>
                                                                    Redirect to Charity
                                                                </motion.button>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                        <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.red}40`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ padding: '3px 10px', background: `${COLORS.red}15`, border: `1px solid ${COLORS.red}50`, fontSize: 10, color: COLORS.red, letterSpacing: 1 }}>CHARITY</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 13, color: COLORS.red }}>Charity Fallback</div>
                                                <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace' }}>{(vault as any).charityAddress?.slice(0, 24) ?? 'Address set at deployment'}...</div>
                                            </div>
                                            <div style={{ fontSize: 12, color: COLORS.muted }}>Receives failed appeals</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'deposits' && (
                                <motion.div key="deposits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {(vault.deposits ?? []).length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '60px 0', color: COLORS.muted }}>No deposits recorded yet.</div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {(vault.deposits ?? []).map((d, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                                                    <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.gold, minWidth: 140 }}>{satsToBTC(Number(d.amountSatoshis))} BTC</div>
                                                    <div style={{ flex: 1, fontSize: 11, color: COLORS.muted, fontFamily: 'monospace' }}>{d.txHash?.slice(0, 20) ?? 'pending'}...</div>
                                                    <div>
                                                        {d.lawyerAcknowledged ? (
                                                            <span style={{ fontSize: 12, color: COLORS.green }}>Acknowledged</span>
                                                        ) : (
                                                            <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={() => handleAckDeposit((d as any).id ?? i.toString())} disabled={busyBen === ((d as any).id ?? i.toString())} style={{ padding: '8px 16px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.gold, fontSize: 11, letterSpacing: 1, cursor: 'pointer' }}>
                                                                Acknowledge
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'death' && (
                                <motion.div key="death" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 40 }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Death Confirmation</div>
                                    {vault.status === 'UNLOCK_INITIATED' ? (
                                        <>
                                            <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 24, lineHeight: 1.8 }}>A death certificate has been submitted. As executor, you must independently verify and co-confirm on-chain before the 72-hour window begins.</div>
                                            <motion.button whileHover={{ background: `${COLORS.red}30` }} onClick={handleConfirmDeath} style={{ padding: '14px 32px', background: 'none', border: `1px solid ${COLORS.red}`, color: COLORS.red, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                                                Confirm Death On-Chain
                                            </motion.button>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8 }}>
                                            Current vault status: <strong style={{ color: COLORS.gold }}>{vault.status}</strong>. Death confirmation becomes available when a beneficiary uploads a death certificate and vault status changes to UNLOCK_INITIATED.
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}
