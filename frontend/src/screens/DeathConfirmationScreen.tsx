import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { getMyVaults, initiateDeath, flagFraud, getDeathWindow, APIError } from '../api/client';
import type { Vault } from '../types/index';

type Stage = 'upload' | 'window' | 'complete';

export function DeathConfirmationScreen(): React.ReactElement {
    const navigate = useNavigate();
    const { getHeaders, currentBlock, connected } = useWallet();
    const [vault, setVault] = useState<Vault | null>(null);
    const [stage, setStage] = useState<Stage>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [hoursRemaining, setHoursRemaining] = useState(72);
    const [fraudText, setFraudText] = useState('');
    const [fraudFile, setFraudFile] = useState<File | null>(null);
    const [fraudSubmitting, setFraudSubmitting] = useState(false);
    const [fraudMsg, setFraudMsg] = useState('');

    const load = useCallback(async () => {
        if (!connected) return;
        try {
            const all = await getMyVaults(getHeaders());
            const v = all[0] ?? null;
            setVault(v);
            if (v && v.status !== 'ACTIVE') {
                setStage('window');
                try {
                    const win = await getDeathWindow(v.id, currentBlock, getHeaders());
                    setHoursRemaining(win.hoursRemaining ?? 72);
                } catch { /* ignore */ }
            }
        } catch { /* ignore */ }
    }, [connected, getHeaders, currentBlock]);

    useEffect(() => { void load(); }, [load]);

    const hashFile = async (f: File): Promise<string> => {
        const buf = await f.arrayBuffer();
        const hb = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hb)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleUpload = async () => {
        if (!vault || !file) return;
        setUploading(true); setUploadError('');
        try {
            const hash = await hashFile(file);
            await initiateDeath(vault.id, hash, currentBlock, getHeaders());
            setStage('window');
            void load();
        } catch (e) {
            setUploadError(e instanceof APIError ? e.message : 'Upload failed. Please try again.');
        } finally { setUploading(false); }
    };

    const handleFraud = async () => {
        if (!vault || (!fraudText.trim() && !fraudFile)) return;
        setFraudSubmitting(true);
        try {
            const hash = fraudFile ? await hashFile(fraudFile) : `statement_${Date.now()}`;
            await flagFraud(vault.id, hash, currentBlock, getHeaders());
            setFraudMsg('Fraud flag submitted. The process has been halted pending investigation.');
        } catch (e) {
            setFraudMsg(e instanceof APIError ? e.message : 'Submission failed');
        } finally { setFraudSubmitting(false); }
    };

    const progressPct = Math.round(((72 - hoursRemaining) / 72) * 100);

    if (!connected) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 16 }}>Connect Your Wallet</div>
                <button onClick={() => navigate('/')} style={{ padding: '12px 32px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>Go to Home</button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 11, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 2 }}>Death Confirmation Protocol</div>
            </div>

            <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 48px' }}>
                <div style={{ display: 'flex', marginBottom: 48 }}>
                    {['Upload Certificate', 'Executor Verification', '72-Hour Window', 'Execution'].map((step, i) => {
                        const active = stage === 'window' ? i <= 2 : i === 0;
                        return (
                            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                {i < 3 && <div style={{ position: 'absolute', top: 11, left: '50%', width: '100%', height: 1, background: active ? COLORS.gold : COLORS.border }} />}
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: active ? COLORS.gold : COLORS.border, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, zIndex: 1 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? COLORS.obsidian : COLORS.muted }} />
                                </div>
                                <div style={{ fontSize: 10, color: active ? COLORS.gold : COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>{step}</div>
                            </div>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {stage === 'upload' && (
                        <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Initiate Estate Unlock</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 16 }}>Upload Death Certificate</div>
                                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8 }}>An official death certificate is required. The document is hashed in your browser - no file is stored on our servers. Only the SHA-256 hash is recorded on-chain.</div>
                            </div>

                            <label style={{ display: 'block', padding: 40, background: COLORS.slate, border: `2px dashed ${file ? COLORS.gold : COLORS.border}`, textAlign: 'center', marginBottom: 24, cursor: 'pointer' }}>
                                {file ? (
                                    <div>
                                        <div style={{ fontSize: 13, color: COLORS.gold, marginBottom: 8 }}>{file.name}</div>
                                        <div style={{ fontSize: 11, color: COLORS.muted }}>Click to change file</div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>Click to upload death certificate</div>
                                        <div style={{ fontSize: 11, color: COLORS.muted }}>PDF or image - hashed client-side, not stored</div>
                                    </div>
                                )}
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
                            </label>

                            {uploadError && <div style={{ padding: '12px 16px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 12, marginBottom: 16 }}>{uploadError}</div>}

                            <motion.button whileHover={{ opacity: 0.9 }} disabled={!file || uploading} onClick={handleUpload} style={{ width: '100%', padding: 16, background: file ? COLORS.red : COLORS.mid, border: `1px solid ${file ? COLORS.red : COLORS.border}`, color: file ? COLORS.ivory : COLORS.muted, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: file && !uploading ? 'pointer' : 'not-allowed' }}>
                                {uploading ? 'Hashing and Submitting...' : 'Initiate Unlock Protocol'}
                            </motion.button>
                        </motion.div>
                    )}

                    {stage === 'window' && (
                        <motion.div key="window" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Dispute Window Active</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 16 }}>72-Hour Verification Period</div>
                                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8 }}>The executor has been notified and is independently verifying. Any registered party may flag fraud during this window.</div>
                            </div>

                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 32, marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Window Progress</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.gold }}>{hoursRemaining}h remaining</div>
                                </div>
                                <div style={{ width: '100%', height: 4, background: COLORS.border, marginBottom: 24 }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: COLORS.gold }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    {[
                                        { label: 'Certificate Uploaded', status: 'Confirmed', color: COLORS.green },
                                        { label: 'Executor Verification', status: vault?.status === 'WINDOW_OPEN' ? 'Confirmed' : 'In Progress', color: vault?.status === 'WINDOW_OPEN' ? COLORS.green : COLORS.gold },
                                        { label: 'Fraud Flags', status: (vault as any)?.fraudFlagged ? 'FLAGGED' : 'None', color: (vault as any)?.fraudFlagged ? COLORS.red : COLORS.green },
                                        { label: 'Auto-Execute At', status: '72h mark', color: COLORS.muted },
                                    ].map((item) => (
                                        <div key={item.label} style={{ padding: '14px 16px', background: COLORS.mid }}>
                                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                                            <div style={{ fontSize: 13, color: item.color }}>{item.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: `${COLORS.red}08`, border: `1px solid ${COLORS.red}40`, padding: 24 }}>
                                <div style={{ fontSize: 12, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Flag as Fraudulent</div>
                                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.7 }}>If you believe this confirmation is fraudulent, submit evidence. A fraud flag halts the process pending investigation. Evidence is hashed client-side.</div>
                                <textarea value={fraudText} onChange={e => setFraudText(e.target.value)} placeholder="Describe the fraudulent activity..." style={{ width: '100%', minHeight: 100, background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, padding: 12, fontSize: 13, fontFamily: FONTS.body, resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, cursor: 'pointer', marginBottom: 12, fontSize: 12, color: COLORS.muted }}>
                                    {fraudFile ? fraudFile.name : '+ Attach evidence file (optional)'}
                                    <input type="file" onChange={e => setFraudFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
                                </label>
                                {fraudMsg && <div style={{ padding: '10px 14px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 12, marginBottom: 12 }}>{fraudMsg}</div>}
                                <motion.button whileHover={{ background: `${COLORS.red}30` }} onClick={handleFraud} disabled={fraudSubmitting || (!fraudText.trim() && !fraudFile)} style={{ padding: '12px 24px', background: 'none', border: `1px solid ${COLORS.red}`, color: COLORS.red, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                                    {fraudSubmitting ? 'Submitting...' : 'Submit Fraud Flag with Evidence'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
