import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { getMyVaults, submitCheckIn, recordDeposit, APIError } from '../api/client';
import type { Vault } from '../types/index';

function satsToBTC(s: number): string { return (s / 1e8).toFixed(8); }

export function OwnerDashboardScreen(): React.ReactElement {
    const navigate = useNavigate();
    const { address, getHeaders, currentBlock, connected, role } = useWallet();
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkedIn, setCheckedIn] = useState(false);
    const [depositAmt, setDepositAmt] = useState('');
    const [depositTx, setDepositTx] = useState('');
    const [depositing, setDepositing] = useState(false);
    const [depositMsg, setDepositMsg] = useState('');
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        if (!connected) return;
        try {
            const data = await getMyVaults(getHeaders());
            setVaults(data);
        } catch (e) {
            setError(e instanceof APIError ? e.message : 'Failed to load vaults');
        } finally { setLoading(false); }
    }, [connected, getHeaders]);

    useEffect(() => { void load(); }, [load]);

    const vault: Vault | null = vaults[0] ?? null;

    const handleCheckIn = async () => {
        if (!vault) return;
        setCheckingIn(true);
        try {
            const txHash = `checkin_${address.slice(0,10)}_${currentBlock}`;
            await submitCheckIn(vault.id, currentBlock, txHash, getHeaders());
            setCheckedIn(true);
            void load();
        } catch (e) {
            setError(e instanceof APIError ? e.message : 'Check-in failed');
        } finally { setCheckingIn(false); }
    };

    const handleDeposit = async () => {
        if (!vault || !depositAmt) return;
        setDepositing(true);
        setDepositMsg('');
        try {
            const sats = Math.round(parseFloat(depositAmt) * 1e8);
            const tx = depositTx.trim() || `deposit_${Date.now()}`;
            await recordDeposit(vault.id, sats, currentBlock, tx, getHeaders());
            setDepositMsg(`Deposit of ${depositAmt} BTC recorded. Awaiting executor acknowledgment.`);
            setDepositAmt(''); setDepositTx('');
            void load();
        } catch (e) {
            setDepositMsg(e instanceof APIError ? e.message : 'Deposit failed');
        } finally { setDepositing(false); }
    };

    const pendingDeposits = vault?.deposits?.filter(d => !d.lawyerAcknowledged) ?? [];
    const checkInBlocks = vault ? currentBlock - (vault as any).lastCheckInBlock : 0;
    const freqBlocks = vault ? (vault as any).checkInFrequencyBlocks ?? 13140 : 13140;
    const blocksLeft = Math.max(0, freqBlocks - checkInBlocks);
    const daysLeft = Math.round(blocksLeft / 144);
    const progressPct = Math.min(100, Math.round((checkInBlocks / freqBlocks) * 100));

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
                    <span style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Owner Dashboard</span>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.green }} />
                    <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace' }}>{address.slice(0, 14)}...</span>
                    <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => navigate('/create')} style={{ padding: '8px 20px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                        New Vault
                    </motion.button>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
                {error && <div style={{ padding: '12px 20px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 13, marginBottom: 24 }}>{error}</div>}

                {!vault ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 16 }}>No Vaults Yet</div>
                        <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 40 }}>Create your first Bitcoin inheritance vault to get started.</div>
                        <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => navigate('/create')} style={{ padding: '16px 40px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
                            Create Vault
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        <AnimatePresence>
                            {!checkedIn && (
                                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginBottom: 24, padding: '20px 28px', background: `${COLORS.gold}12`, border: `1px solid ${COLORS.gold}60`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Dead Man's Switch</div>
                                        <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 8 }}>
                                            Check-in due in <strong style={{ color: COLORS.gold }}>{daysLeft} days</strong>
                                        </div>
                                        <div style={{ width: 300, height: 3, background: COLORS.border }}>
                                            <div style={{ height: '100%', width: `${progressPct}%`, background: progressPct > 70 ? COLORS.red : COLORS.gold, transition: 'width 0.5s' }} />
                                        </div>
                                    </div>
                                    <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.97 }} onClick={handleCheckIn} disabled={checkingIn} style={{ padding: '14px 32px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', cursor: checkingIn ? 'wait' : 'pointer' }}>
                                        {checkingIn ? 'Confirming...' : 'Check In Now'}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {checkedIn && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 24, padding: '16px 24px', background: `${COLORS.green}12`, border: `1px solid ${COLORS.green}60`, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ fontSize: 11, color: COLORS.green, textTransform: 'uppercase', letterSpacing: 2 }}>Checked In</div>
                                <div style={{ fontSize: 14, color: COLORS.ivory }}>Check-in confirmed on-chain. Next due in 90 days.</div>
                            </motion.div>
                        )}

                        {pendingDeposits.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 24, padding: '14px 20px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}50`, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.red, flexShrink: 0 }} />
                                <div style={{ fontSize: 13, color: COLORS.ivory }}>{pendingDeposits.length} deposit(s) pending executor acknowledgment</div>
                                <button onClick={() => navigate('/deposits')} style={{ marginLeft: 'auto', fontSize: 11, color: COLORS.gold, background: 'none', border: `1px solid ${COLORS.goldDim}`, padding: '6px 14px', cursor: 'pointer', letterSpacing: 1 }}>View</button>
                            </motion.div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 32 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                                        <div>
                                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Estate Vault</div>
                                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>{vault.name}</div>
                                        </div>
                                        <div style={{ padding: '4px 12px', background: `${COLORS.green}20`, border: `1px solid ${COLORS.green}50`, fontSize: 11, color: COLORS.green, letterSpacing: 1.5 }}>{vault.status}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                        {[
                                            { label: 'BTC Balance', value: `${satsToBTC(vault.balanceSatoshis)} BTC`, color: COLORS.gold },
                                            { label: 'Beneficiaries', value: vault.beneficiaries.length.toString(), color: COLORS.ivory },
                                            { label: 'Executor Fee', value: `${vault.executor?.feePercent ?? 0}%`, color: COLORS.goldLight },
                                        ].map((s) => (
                                            <div key={s.label} style={{ padding: '16px 20px', background: COLORS.mid }}>
                                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                                                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: s.color }}>{s.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: '28px 32px' }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Beneficiaries</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {vault.beneficiaries.map((b) => (
                                            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: COLORS.mid, border: `1px solid ${COLORS.border}` }}>
                                                <div style={{ padding: '3px 10px', background: b.isRemote ? `${COLORS.green}20` : `${COLORS.gold}20`, border: `1px solid ${b.isRemote ? COLORS.green : COLORS.goldDim}`, fontSize: 10, color: b.isRemote ? COLORS.green : COLORS.gold, letterSpacing: 1, flexShrink: 0 }}>
                                                    {b.isRemote ? 'REMOTE' : 'LOCAL'}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 13, color: COLORS.ivory, marginBottom: 2 }}>{b.name}</div>
                                                    <div style={{ fontSize: 11, color: COLORS.muted }}>{b.country}</div>
                                                </div>
                                                <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.gold }}>{b.sharePercent}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: '24px 32px' }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Record New Deposit</div>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        <input value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="Amount in BTC" style={{ flex: 1, minWidth: 120, padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 13, fontFamily: FONTS.body }} />
                                        <input value={depositTx} onChange={e => setDepositTx(e.target.value)} placeholder="TX hash (optional)" style={{ flex: 2, minWidth: 160, padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 13, fontFamily: FONTS.body }} />
                                        <motion.button whileHover={{ background: COLORS.goldLight }} onClick={handleDeposit} disabled={depositing || !depositAmt} style={{ padding: '10px 20px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', cursor: depositing ? 'wait' : 'pointer' }}>
                                            {depositing ? 'Recording...' : 'Record'}
                                        </motion.button>
                                    </div>
                                    {depositMsg && <div style={{ marginTop: 10, fontSize: 12, color: COLORS.green }}>{depositMsg}</div>}
                                </motion.div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: '28px 24px' }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Vault Health</div>
                                    {[
                                        { label: 'Will Attached', ok: !!(vault as any).willHash },
                                        { label: 'Executor Confirmed', ok: !!vault.executor },
                                        { label: 'Beneficiaries Registered', ok: vault.beneficiaries.length > 0 },
                                        { label: 'Charity Address Set', ok: !!(vault as any).charityAddress },
                                        { label: 'Contract Deployed', ok: !!vault.contractAddress },
                                    ].map((item) => (
                                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.ok ? COLORS.green : COLORS.red, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, color: item.ok ? COLORS.ivory : COLORS.muted }}>{item.label}</span>
                                            <span style={{ marginLeft: 'auto', fontSize: 11, color: item.ok ? COLORS.green : COLORS.red }}>{item.ok ? 'OK' : 'MISSING'}</span>
                                        </div>
                                    ))}
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 24 }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Actions</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[
                                            { label: 'Deposit History', path: '/deposits' },
                                            { label: 'Vault Certificate', path: '/certificate' },
                                            { label: 'Death Confirmation', path: '/death' },
                                        ].map((action) => (
                                            <motion.button key={action.label} whileHover={{ borderColor: COLORS.gold, color: COLORS.ivory }} onClick={() => navigate(action.path)} style={{ width: '100%', padding: '12px 16px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left' }}>
                                                {action.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
