import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { getMyVaults, acknowledgeDeposit, APIError } from '../api/client';
import type { Vault } from '../types/index';

function satsToBTC(s: number): string { return (s / 1e8).toFixed(8); }

export function DepositHistoryScreen(): React.ReactElement {
    const navigate = useNavigate();
    const { address, role, getHeaders, currentBlock, connected } = useWallet();
    const [vault, setVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState(true);
    const [acking, setAcking] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const load = useCallback(async () => {
        if (!connected) return;
        try {
            const all = await getMyVaults(getHeaders());
            setVault(all[0] ?? null);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, [connected, getHeaders]);

    useEffect(() => { void load(); }, [load]);

    const handleAck = async (depositId: string) => {
        if (!vault) return;
        setAcking(depositId);
        try {
            await acknowledgeDeposit(vault.id, depositId, currentBlock, getHeaders());
            setMsg('Deposit acknowledged on-chain');
            void load();
        } catch (e) {
            setMsg(e instanceof APIError ? e.message : 'Acknowledgment failed');
        } finally { setAcking(null); }
    };

    const isExecutor = role === 'lawyer';
    const deposits = vault?.deposits ?? [];
    const totalSats = deposits.reduce((s, d) => s + Number(d.amountSatoshis), 0);
    const pendingCount = deposits.filter(d => !d.lawyerAcknowledged).length;

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
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Deposit and Withdrawal History</div>
            </div>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>{vault?.name ?? 'Estate Vault'}</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>Deposit History</div>
                    <div style={{ fontSize: 14, color: COLORS.muted }}>Complete on-chain record of every deposit, top-up, and withdrawal.</div>
                </motion.div>

                {msg && <div style={{ padding: '12px 20px', background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}40`, color: COLORS.green, fontSize: 13, marginBottom: 24 }}>{msg}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 40 }}>
                    {[
                        { label: 'Current Balance', value: vault ? `${satsToBTC(vault.balanceSatoshis)} BTC` : '0 BTC', color: COLORS.gold },
                        { label: 'Total Deposited', value: `${satsToBTC(totalSats)} BTC`, color: COLORS.ivory },
                        { label: 'Pending Acknowledgment', value: `${pendingCount} deposit${pendingCount !== 1 ? 's' : ''}`, color: pendingCount > 0 ? COLORS.red : COLORS.green },
                    ].map((s) => (
                        <div key={s.label} style={{ padding: '20px 24px', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>{s.label}</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {deposits.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: COLORS.muted }}>No deposits recorded yet.</div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '130px 140px 1fr 150px', gap: 0, padding: '10px 20px', borderBottom: `1px solid ${COLORS.border}`, marginBottom: 2 }}>
                            {['Amount', 'Block', 'TX Hash', 'Executor Ack'].map((h) => (
                                <div key={h} style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5 }}>{h}</div>
                            ))}
                        </div>
                        {deposits.map((d, i) => {
                            const id = (d as any).id ?? i.toString();
                            return (
                                <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ display: 'grid', gridTemplateColumns: '130px 140px 1fr 150px', gap: 0, padding: '18px 20px', background: COLORS.slate, border: `1px solid ${COLORS.border}`, marginBottom: 2, alignItems: 'center' }}>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold }}>{satsToBTC(Number(d.amountSatoshis))} BTC</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>Block {Number(d.blockNumber).toLocaleString()}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace' }}>{d.txHash?.slice(0, 28) ?? 'pending'}...</div>
                                    <div>
                                        {d.lawyerAcknowledged ? (
                                            <span style={{ fontSize: 12, color: COLORS.green }}>Acknowledged</span>
                                        ) : isExecutor ? (
                                            <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={() => handleAck(id)} disabled={acking === id} style={{ padding: '6px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.gold, fontSize: 11, letterSpacing: 1, cursor: acking === id ? 'wait' : 'pointer' }}>
                                                {acking === id ? 'Signing...' : 'Acknowledge'}
                                            </motion.button>
                                        ) : (
                                            <span style={{ fontSize: 12, color: COLORS.red }}>Pending</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </>
                )}

                {isExecutor && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: 32, padding: '20px 24px', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>
                        As executor, your acknowledgment of each deposit serves as an on-chain witness record. All acknowledgments are immutable on Bitcoin Layer 1.
                    </motion.div>
                )}
            </div>
        </div>
    );
}
