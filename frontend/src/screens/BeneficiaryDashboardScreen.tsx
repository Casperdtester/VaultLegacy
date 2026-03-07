import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { getMyVaults, APIError } from '../api/client';
import type { Vault, Beneficiary } from '../types/index';

function satsToBTC(s: number): string { return (s / 1e8).toFixed(8); }

export function BeneficiaryDashboardScreen(): React.ReactElement {
    const navigate = useNavigate();
    const { address, getHeaders, connected } = useWallet();
    const [vault, setVault] = useState<Vault | null>(null);
    const [myBen, setMyBen] = useState<Beneficiary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        if (!connected) return;
        try {
            const all = await getMyVaults(getHeaders());
            const v = all[0] ?? null;
            setVault(v);
            if (v) {
                const b = v.beneficiaries.find(b => b.address.toLowerCase() === address.toLowerCase()) ?? null;
                setMyBen(b);
            }
        } catch (e) {
            setError(e instanceof APIError ? e.message : 'Failed to load vault data');
        } finally { setLoading(false); }
    }, [connected, getHeaders, address]);

    useEffect(() => { void load(); }, [load]);

    const isOwnerAlive = !vault || vault.status === 'ACTIVE' || vault.status === 'UNLOCK_INITIATED';
    const showBtcAmount = myBen && vault && vault.status !== 'ACTIVE' && vault.status !== 'UNLOCK_INITIATED';
    const netSats = vault ? Math.round(vault.balanceSatoshis * (1 - (vault.executor?.feePercent ?? 0) / 100)) : 0;
    const myBtcSats = myBen ? Math.round(netSats * myBen.sharePercent / 100) : 0;

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
                    <span style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Beneficiary</span>
                    <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace' }}>{address.slice(0, 14)}...</span>
                </div>
            </div>

            <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 48px' }}>
                {error && <div style={{ padding: '12px 20px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 13, marginBottom: 24 }}>{error}</div>}

                {!vault || !myBen ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>Not Registered as Beneficiary</div>
                        <div style={{ fontSize: 14, color: COLORS.muted }}>Your wallet address is not registered as a beneficiary on any vault. Contact your executor if you believe this is an error.</div>
                    </div>
                ) : (
                    <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Welcome</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.ivory, marginBottom: 8 }}>{myBen.name}</div>
                            <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 40 }}>You have been registered as a beneficiary of the estate below.</div>
                        </motion.div>

                        {myBen.status === 'SUSPENDED' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '16px 20px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}50`, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: 13, color: COLORS.red }}>Your share has been suspended. You have 30 days to submit an appeal.</div>
                                <button onClick={() => navigate('/appeal')} style={{ padding: '8px 20px', background: COLORS.red, border: 'none', color: COLORS.ivory, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}>Appeal Now</button>
                            </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 36, marginBottom: 24 }}>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Your Estate Summary</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 24 }}>
                                <div style={{ padding: '20px 24px', background: COLORS.mid }}>
                                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Estate Vault</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.ivory }}>{vault.name}</div>
                                </div>
                                <div style={{ padding: '20px 24px', background: COLORS.mid }}>
                                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Executor</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 16, color: COLORS.ivory }}>{vault.executor?.name ?? 'Registered Executor'}</div>
                                </div>
                            </div>

                            <div style={{ padding: 28, background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, textAlign: 'center', marginBottom: 24 }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Your Share</div>
                                {showBtcAmount ? (
                                    <>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 56, color: COLORS.gold, lineHeight: 1 }}>{satsToBTC(myBtcSats)}</div>
                                        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 8 }}>BTC - OP_NET Testnet</div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 72, color: COLORS.gold, lineHeight: 1 }}>{myBen.sharePercent}%</div>
                                        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 12 }}>BTC amount shown only when your transfer is initiated</div>
                                    </>
                                )}
                            </div>

                            <div style={{ padding: '16px 20px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.ivory, lineHeight: 1.8 }}>
                                {isOwnerAlive
                                    ? 'The vault is currently active. You will be notified when your transfer is initiated.'
                                    : 'The estate is now in execution. Your executor will initiate your individual transfer after reviewing the will.'
                                }
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: 8, padding: 24, background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>What Happens Next</div>
                            {[
                                'Owner continues checking in to prove they are alive',
                                'Upon death, any party uploads a death certificate',
                                'A 72-hour dispute window opens for verification',
                                'Executor receives their fee and decrypts the will',
                                'Your executor initiates your individual transfer',
                                'You co-sign and receive your BTC in this wallet',
                            ].map((text, i) => (
                                <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 16, color: `${COLORS.gold}60`, minWidth: 20 }}>{i + 1}</div>
                                    <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{text}</div>
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
