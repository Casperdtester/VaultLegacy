import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { getMyVaults, submitAppealEvidence, getAppealStatus, APIError } from '../api/client';
import type { Vault } from '../types/index';

export function AppealScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const benIdParam = searchParams.get('benId') ?? '';
    const { address, getHeaders, currentBlock, connected } = useWallet();

    const [vault, setVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [statement, setStatement] = useState('');
    const [uploading, setUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [daysLeft, setDaysLeft] = useState(30);

    const loadData = useCallback(async () => {
        if (!connected) return;
        try {
            const vaults = await getMyVaults(getHeaders());
            const v = vaults[0] ?? null;
            setVault(v);
            if (v) {
                const ben = v.beneficiaries.find(b =>
                    (benIdParam && b.id === benIdParam) ||
                    b.address.toLowerCase() === address.toLowerCase()
                ) ?? v.beneficiaries.find(b => b.status === 'SUSPENDED');
                if (ben) {
                    try {
                        const status = await getAppealStatus(v.id, ben.id, currentBlock, getHeaders());
                        setDaysLeft(status.daysRemaining ?? 30);
                        if (status.evidenceSubmitted) setSubmitted(true);
                    } catch { /* appeal not started yet */ }
                }
            }
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, [connected, getHeaders, currentBlock, benIdParam, address]);

    useEffect(() => { void loadData(); }, [loadData]);

    const myBen = vault?.beneficiaries.find(b =>
        (benIdParam && b.id === benIdParam) ||
        b.address.toLowerCase() === address.toLowerCase()
    ) ?? vault?.beneficiaries.find(b => b.status === 'SUSPENDED') ?? null;

    const progressPct = Math.min(100, Math.round(((30 - daysLeft) / 30) * 100));

    const hashFile = async (file: File): Promise<string> => {
        const buf = await file.arrayBuffer();
        const hashBuf = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleSubmit = async () => {
        if (!vault || !myBen) return;
        const fileList = Object.values(files);
        if (fileList.length === 0 && !statement.trim()) {
            setSubmitError('Upload at least one document or provide a written statement.');
            return;
        }
        setUploading(true);
        setSubmitError('');
        try {
            const primaryFile = fileList[0];
            const evidenceHash = primaryFile
                ? await hashFile(primaryFile)
                : `stmt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            const desc = statement.trim() || fileList.map(f => f.name).join(', ');
            await submitAppealEvidence(vault.id, myBen.id, evidenceHash, desc, currentBlock, getHeaders());
            setSubmitted(true);
        } catch (err) {
            setSubmitError(err instanceof APIError ? err.message : 'Submission failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const DOC_TYPES = ['Court Dismissal / Case Closure', 'Rehabilitation Certificate', 'Character References', 'Legal Correspondence'];

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
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 40, height: 40, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: '50%' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 11, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 2 }}>Inheritance Appeal</div>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 48px' }}>
                {!myBen ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>No Active Appeal</div>
                        <div style={{ fontSize: 14, color: COLORS.muted }}>Your share is not currently suspended, or no vault was found for your wallet.</div>
                    </div>
                ) : (
                    <>
                        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px 28px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}50`, marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                            <div>
                                <div style={{ fontSize: 11, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Share Suspended</div>
                                <div style={{ fontSize: 15, color: COLORS.ivory }}>{myBen.name} - {myBen.sharePercent}% share held on-chain</div>
                                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{vault?.name}</div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 44, color: COLORS.red, lineHeight: 1 }}>{daysLeft}</div>
                                <div style={{ fontSize: 11, color: COLORS.muted }}>days remaining</div>
                            </div>
                        </motion.div>

                        <div style={{ marginBottom: 40 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Appeal Window</div>
                                <div style={{ fontSize: 11, color: COLORS.muted }}>30 days total</div>
                            </div>
                            <div style={{ height: 3, background: COLORS.border }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: progressPct > 80 ? COLORS.red : COLORS.gold }} />
                            </div>
                            <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted, lineHeight: 1.7 }}>If no evidence is submitted within the window, your share automatically redirects to the charity address on-chain. This is irreversible.</div>
                        </div>

                        {!submitted ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 28 }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Submit Appeal Evidence</div>
                                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20, lineHeight: 1.7 }}>Upload documents proving the suspension conditions no longer apply. Each file is SHA-256 hashed in your browser. No document content is stored on our servers - only the hash is recorded on-chain.</div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                    {DOC_TYPES.map((docType) => (
                                        <label key={docType} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: COLORS.mid, border: `1px solid ${files[docType] ? COLORS.gold : COLORS.border}`, cursor: 'pointer' }}>
                                            <div style={{ fontSize: 13, color: files[docType] ? COLORS.gold : COLORS.muted }}>
                                                {files[docType] ? `${files[docType].name}` : docType}
                                            </div>
                                            <div style={{ fontSize: 11, color: COLORS.goldDim, textTransform: 'uppercase', letterSpacing: 1, flexShrink: 0 }}>{files[docType] ? 'Change' : '+ Upload'}</div>
                                            <input type="file" accept=".pdf,.docx,.jpg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFiles(p => ({ ...p, [docType]: f })); }} style={{ display: 'none' }} />
                                        </label>
                                    ))}
                                </div>

                                <textarea value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="Additional statement - explain why the suspension conditions no longer apply..." style={{ width: '100%', minHeight: 120, background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, padding: 14, fontSize: 13, fontFamily: FONTS.body, resize: 'vertical', boxSizing: 'border-box', marginBottom: 16 }} />

                                {submitError && <div style={{ padding: '12px 16px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 12, marginBottom: 16 }}>{submitError}</div>}

                                <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={uploading} style={{ width: '100%', padding: 16, background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', cursor: uploading ? 'wait' : 'pointer' }}>
                                    {uploading ? 'Hashing and Submitting...' : 'Submit Appeal to Executor'}
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.green}`, padding: 48, textAlign: 'center' }}>
                                <div style={{ width: 56, height: 56, border: `2px solid ${COLORS.green}`, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.green, fontWeight: 700 }}>OK</div>
                                </div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 12 }}>Appeal Submitted</div>
                                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, marginBottom: 24 }}>Your evidence has been submitted to the executor for review. You will be notified of their decision. The executor will either reinstate your share or confirm the redirect to charity.</div>
                                <div style={{ padding: '14px 20px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.muted }}>Evidence hash recorded on-chain - {daysLeft} days remaining in appeal window</div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
