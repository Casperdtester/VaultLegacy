import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { getMyVaults, getVault, APIError } from '../api/client';
import type { Vault } from '../types/index';

function satsToBTC(sats: number): string {
    return (sats / 100_000_000).toFixed(8);
}

export function VaultCertificateScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const vaultIdParam = searchParams.get('vaultId') ?? '';
    const { getHeaders, connected } = useWallet();
    const certRef = useRef<HTMLDivElement>(null);

    const [vault, setVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const loadVault = useCallback(async () => {
        if (!connected) return;
        try {
            let v: Vault;
            if (vaultIdParam) {
                v = await getVault(vaultIdParam, getHeaders());
            } else {
                const vaults = await getMyVaults(getHeaders());
                if (!vaults.length) { setLoadError('No vaults found for your wallet.'); setLoading(false); return; }
                v = vaults[0];
            }
            setVault(v);
        } catch (err) {
            setLoadError(err instanceof APIError ? err.message : 'Failed to load vault certificate.');
        } finally {
            setLoading(false);
        }
    }, [connected, getHeaders, vaultIdParam]);

    useEffect(() => { void loadVault(); }, [loadVault]);

    const handlePrint = () => window.print();

    if (!connected) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>Wallet Not Connected</div>
                <button onClick={() => navigate('/')} style={{ padding: '12px 32px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>Go to Home</button>
            </div>
        </div>
    );

    if (loading) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 44, height: 44, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: '50%' }} />
        </div>
    );

    if (loadError) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.red, marginBottom: 12 }}>{loadError}</div>
                <button onClick={() => navigate('/dashboard/owner')} style={{ padding: '12px 28px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Back to Dashboard</button>
            </div>
        </div>
    );

    if (!vault) return <></>;

    const deployDate = new Date(vault.deployedAt ?? vault.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const netFeePercent = vault.executor?.feePercent ?? 0;
    const localBens = vault.beneficiaries.filter(b => !b.isRemote);
    const remoteBens = vault.beneficiaries.filter(b => b.isRemote);

    return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            {/* Toolbar */}
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="no-print">
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button whileHover={{ background: COLORS.mid }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard/owner')} style={{ padding: '10px 24px', background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                        Back
                    </motion.button>
                    <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={handlePrint} style={{ padding: '10px 28px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                        Print / Save PDF
                    </motion.button>
                </div>
            </div>

            {/* Certificate */}
            <div style={{ maxWidth: 820, margin: '48px auto', padding: '0 48px 80px' }}>
                <motion.div ref={certRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `2px solid ${COLORS.gold}`, padding: 60 }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', borderBottom: `1px solid ${COLORS.gold}40`, paddingBottom: 40, marginBottom: 40 }}>
                        <div style={{ fontSize: 10, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>Estate Documentation</div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 44, fontWeight: 700, color: COLORS.ivory, letterSpacing: 2, marginBottom: 8 }}>VAULT CERTIFICATE</div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.gold }}>{vault.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 12 }}>Deployed {deployDate} on OP_NET Testnet - Bitcoin Layer 1</div>
                    </div>

                    {/* Contract Info */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontSize: 10, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>On-Chain Contract</div>
                        <div style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, padding: '16px 20px', marginBottom: 12 }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Contract Address</div>
                            <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>{vault.contractAddress}</div>
                        </div>
                        {vault.txHash && (
                            <div style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, padding: '16px 20px' }}>
                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Deployment Transaction</div>
                                <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>{vault.txHash}</div>
                            </div>
                        )}
                    </div>

                    {/* Executor */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontSize: 10, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Executor / Lawyer</div>
                        <div style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, padding: '20px 24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 4 }}>{vault.executor?.name ?? 'Registered Executor'}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace' }}>{vault.executorAddress.slice(0, 28)}...</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.goldLight }}>{netFeePercent}%</div>
                                    <div style={{ fontSize: 10, color: COLORS.muted }}>Executor Fee</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Beneficiaries */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontSize: 10, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Beneficiaries ({vault.beneficiaries.length})</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {vault.beneficiaries.map((b) => (
                                <div key={b.id} style={{ background: COLORS.mid, border: `1px solid ${b.isRemote ? COLORS.green + '50' : COLORS.border}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <div style={{ fontSize: 14, color: COLORS.ivory }}>{b.name}</div>
                                            {b.isRemote && <div style={{ fontSize: 9, color: COLORS.green, background: `${COLORS.green}15`, border: `1px solid ${COLORS.green}40`, padding: '2px 8px', letterSpacing: 1.5, textTransform: 'uppercase' }}>Remote</div>}
                                        </div>
                                        <div style={{ fontSize: 11, color: COLORS.muted }}>{b.country}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory }}>{b.sharePercent}%</div>
                                        <div style={{ fontSize: 10, color: COLORS.muted }}>of net estate</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 12, padding: '10px 16px', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.gold}30`, fontSize: 11, color: COLORS.muted }}>
                            Net estate = vault balance at death minus {netFeePercent}% executor fee. Children's percentages apply to net estate.
                        </div>
                    </div>

                    {/* Charity Fallback */}
                    {vault.charityAddress && (
                        <div style={{ marginBottom: 40 }}>
                            <div style={{ fontSize: 10, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Charity Fallback</div>
                            <div style={{ background: COLORS.mid, border: `1px solid ${COLORS.red}40`, padding: '16px 20px' }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>Any suspended beneficiary whose appeal fails will have their share redirected here permanently.</div>
                                <div style={{ fontSize: 12, color: COLORS.red, fontFamily: 'monospace', wordBreak: 'break-all' }}>{vault.charityAddress}</div>
                            </div>
                        </div>
                    )}

                    {/* Will Hashes */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontSize: 10, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Document Verification</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: 'Will Document (SHA-256)', hash: vault.willHash },
                                { label: 'Conditional Clause (SHA-256)', hash: vault.clauseHash },
                            ].map((doc) => (
                                <div key={doc.label} style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, padding: '14px 18px' }}>
                                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{doc.label}</div>
                                    <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>{doc.hash}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 12, fontSize: 11, color: COLORS.muted, lineHeight: 1.7 }}>These hashes are stored immutably on the OP_NET smart contract. Any tampering with the original documents is detectable on-chain.</div>
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: `1px solid ${COLORS.gold}30`, paddingTop: 32, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.8 }}>
                            This certificate is estate documentation for the VaultLegacy inheritance vault above.<br />
                            Include this document alongside a traditional will to reference the on-chain Bitcoin inheritance contract.<br />
                            Network: OP_NET Testnet - Bitcoin Layer 1
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 40 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: 120, height: 1, background: COLORS.border, margin: '0 auto 8px' }} />
                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5 }}>Owner Signature</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: 120, height: 1, background: COLORS.border, margin: '0 auto 8px' }} />
                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5 }}>Executor Signature</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`@media print { .no-print { display: none !important; } body { background: #0a0a0a !important; } }`}</style>
        </div>
    );
}
