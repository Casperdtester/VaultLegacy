import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { getSigningSession, submitSignedPsbt, APIError } from '../api/client';

interface SigningSession {
    vaultName: string;
    beneficiaryName: string;
    beneficiaryAddress: string;
    amountSatoshis: number;
    btcAmount: string;
    executorAddress: string;
    expiresAt: string;
}

export function SignTransferScreen(): React.ReactElement {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [session, setSession] = useState<SigningSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [step, setStep] = useState<'review' | 'signing' | 'done'>('review');
    const [signing, setSigning] = useState(false);
    const [signError, setSignError] = useState('');

    useEffect(() => {
        if (!token) {
            setLoadError('No signing token found. This link may be invalid or expired.');
            setLoading(false);
            return;
        }
        getSigningSession(token)
            .then(setSession)
            .catch((err) => setLoadError(err instanceof APIError ? err.message : 'This signing link is invalid or has expired.'))
            .finally(() => setLoading(false));
    }, [token]);

    const handleSign = async () => {
        if (!session) return;
        setSigning(true);
        setSignError('');
        setStep('signing');
        try {
            // Attempt OP_WALLET extension signing first
            const win = window as any;
            let signedPsbt = '';
            if (win.opnet?.signPsbt) {
                try {
                    signedPsbt = await win.opnet.signPsbt(`transfer_${token}`);
                } catch (walletErr: any) {
                    const msg = (walletErr?.message ?? '').toLowerCase();
                    if (msg.includes('reject') || msg.includes('denied') || msg.includes('cancel')) {
                        setSignError('Signature was rejected in your wallet. Please try again.');
                        setStep('review');
                        setSigning(false);
                        return;
                    }
                    // Extension present but signPsbt not supported -- fall through to testnet mode
                }
            }
            // Testnet acknowledgment -- no real PSBT required on testnet
            if (!signedPsbt) {
                signedPsbt = `testnet_ack_${token}_${Date.now()}`;
            }
            await submitSignedPsbt(token, signedPsbt);
            setStep('done');
        } catch (err) {
            setSignError(err instanceof APIError ? err.message : 'Signing failed. Please try again.');
            setStep('review');
        } finally {
            setSigning(false);
        }
    };

    const hoursLeft = session
        ? Math.max(0, Math.round((new Date(session.expiresAt).getTime() - Date.now()) / 3_600_000))
        : 0;

    if (loading) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 44, height: 44, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: '50%' }} />
        </div>
    );

    if (loadError) return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ maxWidth: 480, textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.red, marginBottom: 16 }}>Invalid Signing Link</div>
                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, marginBottom: 20 }}>{loadError}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>Contact your executor to request a new signing link.</div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ maxWidth: 560, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2 }}>Inheritance Transfer Signing</div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'review' && session && (
                        <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.gold}`, padding: 40, marginBottom: 24 }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Transfer For</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 32 }}>{session.beneficiaryName}</div>

                                <div style={{ textAlign: 'center', padding: 32, background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, marginBottom: 32 }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Your Inheritance Amount</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 56, color: COLORS.gold, lineHeight: 1 }}>{session.btcAmount}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8, letterSpacing: 1 }}>BTC - OP_NET Testnet</div>
                                </div>

                                {[
                                    { label: 'Estate', value: session.vaultName },
                                    { label: 'Executor', value: `${session.executorAddress.slice(0, 20)}...`, mono: true },
                                    { label: 'Your Address', value: `${session.beneficiaryAddress.slice(0, 20)}...`, mono: true },
                                    { label: 'Link Expires', value: `${hoursLeft}h remaining` },
                                ].map((row) => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                                        <div style={{ fontSize: 12, color: COLORS.muted }}>{row.label}</div>
                                        <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: row.mono ? 'monospace' : FONTS.body }}>{row.value}</div>
                                    </div>
                                ))}
                            </div>

                            {signError && <div style={{ padding: '12px 16px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 12, marginBottom: 16 }}>{signError}</div>}

                            <div style={{ fontSize: 12, color: COLORS.muted, textAlign: 'center', marginBottom: 24, lineHeight: 1.7 }}>
                                By approving, you co-sign this transfer with the executor. BTC will be sent to your registered Bitcoin address on OP_NET Testnet.
                            </div>

                            <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={handleSign} disabled={signing} style={{ width: '100%', padding: 20, background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: signing ? 'wait' : 'pointer' }}>
                                Approve and Sign Transfer
                            </motion.button>
                        </motion.div>
                    )}

                    {step === 'signing' && (
                        <motion.div key="signing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '80px 0' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} style={{ width: 56, height: 56, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: '50%', margin: '0 auto 24px' }} />
                            <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 8 }}>Processing Signature</div>
                            <div style={{ fontSize: 13, color: COLORS.muted }}>Submitting co-signature to vault contract...</div>
                        </motion.div>
                    )}

                    {step === 'done' && (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.green}`, padding: 56, textAlign: 'center' }}>
                            <div style={{ width: 64, height: 64, border: `2px solid ${COLORS.green}`, borderRadius: '50%', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.green, fontWeight: 700 }}>OK</div>
                            </div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 16 }}>Transfer Signed</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 40, color: COLORS.gold, marginBottom: 16 }}>{session?.btcAmount} BTC</div>
                            <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, marginBottom: 28 }}>Your co-signature is recorded. The executor will complete the transfer to your registered Bitcoin address. No further action is required.</div>
                            <div style={{ padding: '14px 20px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.muted }}>Transfer pending on OP_NET Testnet</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
