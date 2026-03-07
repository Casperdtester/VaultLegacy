import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';
import { createVault, APIError } from '../api/client';

type Step = 1 | 2 | 3 | 4 | 5;
interface BeneficiaryForm { name: string; address: string; location: string; share: string; }

export function CreateVaultScreen(): React.ReactElement {
    const navigate = useNavigate();
    const { address, getHeaders, currentBlock, connected } = useWallet();
    const [step, setStep] = useState<Step>(1);
    const [vaultName, setVaultName] = useState('');
    const [executor, setExecutor] = useState({ name: '', address: '', location: '', fee: '' });
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([{ name: '', address: '', location: '', share: '' }]);
    const [charity, setCharity] = useState({ name: '', address: '' });
    const [willFile, setWillFile] = useState<File | null>(null);
    const [clauseFile, setClauseFile] = useState<File | null>(null);
    const [checkInFreq, setCheckInFreq] = useState<3 | 6>(3);
    const [deploying, setDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [deployedVaultId, setDeployedVaultId] = useState('');
    const [deployError, setDeployError] = useState('');

    const totalShares = beneficiaries.reduce((s, b) => s + (parseFloat(b.share) || 0), 0);
    const sharesOk = Math.abs(totalShares - 100) < 0.01;

    const addBeneficiary = () => { if (beneficiaries.length < 7) setBeneficiaries([...beneficiaries, { name: '', address: '', location: '', share: '' }]); };
    const updateBen = (i: number, f: keyof BeneficiaryForm, v: string) => { const u = [...beneficiaries]; u[i][f] = v; setBeneficiaries(u); };
    const removeBen = (i: number) => setBeneficiaries(beneficiaries.filter((_, idx) => idx !== i));

    const hashFile = async (file: File): Promise<string> => {
        const buf = await file.arrayBuffer();
        const hb = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hb)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleDeploy = async () => {
        if (!connected) { setDeployError('Connect your wallet first.'); return; }
        setDeploying(true); setDeployError('');
        try {
            const willHash = willFile ? await hashFile(willFile) : `will_${Date.now()}`;
            const clauseHash = clauseFile ? await hashFile(clauseFile) : `clause_${Date.now()}`;
            const freqBlocks = checkInFreq === 3 ? 13140 : 26280;

            const payload = {
                name: vaultName,
                ownerAddress: address,
                executorAddress: executor.address,
                executorName: executor.name,
                executorLocation: executor.location,
                executorFeePercent: parseFloat(executor.fee) || 0,
                beneficiaries: beneficiaries.map(b => ({
                    name: b.name,
                    address: b.address,
                    country: b.location,
                    sharePercent: parseFloat(b.share) || 0,
                    isRemote: !b.location.toLowerCase().includes('nigeria') && !b.location.toLowerCase().includes('lagos'),
                })),
                charityAddress: charity.address,
                charityName: charity.name,
                willHash,
                clauseHash,
                checkInFrequencyBlocks: freqBlocks,
                deployedAt: new Date().toISOString(),
                txHash: `testnet_deploy_${Date.now()}`,
            };

            const result = await createVault(payload, getHeaders());
            setDeployedVaultId(result.id ?? '');
            setDeployed(true);
        } catch (e) {
            setDeployError(e instanceof APIError ? e.message : 'Deployment failed. Make sure the backend is running.');
        } finally { setDeploying(false); }
    };

    const STEP_LABELS = ['Connect', 'Name', 'Parties', 'Documents', 'Deploy'];
    const canNext: Record<Step, boolean> = {
        1: connected,
        2: vaultName.trim().length > 0,
        3: executor.address.length > 0 && beneficiaries.every(b => b.name && b.address) && sharesOk && charity.address.length > 0,
        4: true,
        5: true,
    };

    return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Create Vault - Step {step} of 5</div>
            </div>

            <div style={{ padding: '24px 48px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: 0, maxWidth: 960, margin: '0 auto' }}>
                {STEP_LABELS.map((label, i) => {
                    const n = (i + 1) as Step;
                    const active = n === step;
                    const done = n < step;
                    return (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: done || active ? COLORS.gold : COLORS.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: done || active ? COLORS.obsidian : COLORS.muted, fontWeight: 600 }}>
                                    {done ? 'OK' : n}
                                </div>
                                <span style={{ fontSize: 11, color: active ? COLORS.gold : COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
                            </div>
                            {i < 4 && <div style={{ flex: 1, height: 1, background: done ? COLORS.gold : COLORS.border, margin: '0 12px' }} />}
                        </div>
                    );
                })}
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px' }}>
                <AnimatePresence mode="wait">

                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>Connect Wallet</div>
                            <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>Your OP_NET wallet is required to create and own this vault. No email or password needed.</div>
                            {connected ? (
                                <div style={{ padding: '20px 24px', background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}50`, marginBottom: 32 }}>
                                    <div style={{ fontSize: 11, color: COLORS.green, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Wallet Connected</div>
                                    <div style={{ fontSize: 13, color: COLORS.ivory, fontFamily: 'monospace' }}>{address}</div>
                                </div>
                            ) : (
                                <div style={{ padding: '20px 24px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, marginBottom: 32 }}>
                                    <div style={{ fontSize: 13, color: COLORS.red }}>No wallet connected. Return to the home screen to connect your OP_WALLET.</div>
                                    <button onClick={() => navigate('/')} style={{ marginTop: 12, padding: '8px 20px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Go to Home</button>
                                </div>
                            )}
                            <motion.button whileHover={{ background: COLORS.goldLight }} disabled={!connected} onClick={() => setStep(2)} style={{ padding: '14px 40px', background: connected ? COLORS.gold : COLORS.border, border: 'none', color: connected ? COLORS.obsidian : COLORS.muted, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: connected ? 'pointer' : 'not-allowed' }}>
                                Continue
                            </motion.button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>Name Your Vault</div>
                            <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32 }}>Give this estate vault a name. This will appear on the vault certificate.</div>
                            <input value={vaultName} onChange={e => setVaultName(e.target.value)} placeholder="e.g. Johnson Family Estate" style={{ width: '100%', padding: '16px 20px', background: COLORS.slate, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 16, fontFamily: FONTS.heading, letterSpacing: 1, boxSizing: 'border-box', marginBottom: 32 }} />
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setStep(1)} style={{ padding: '14px 28px', background: 'none', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: 'pointer' }}>Back</button>
                                <motion.button whileHover={{ background: COLORS.goldLight }} disabled={!vaultName.trim()} onClick={() => setStep(3)} style={{ padding: '14px 40px', background: vaultName.trim() ? COLORS.gold : COLORS.border, border: 'none', color: vaultName.trim() ? COLORS.obsidian : COLORS.muted, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: vaultName.trim() ? 'pointer' : 'not-allowed' }}>
                                    Continue
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 32 }}>Add Parties</div>

                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 28, marginBottom: 24 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Executor / Lawyer</div>
                                {(['name', 'address', 'location', 'fee'] as const).map((f) => (
                                    <div key={f} style={{ marginBottom: 12 }}>
                                        <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4, textTransform: 'capitalize' }}>{f === 'fee' ? 'Fee Percentage (%)' : f}</div>
                                        <input value={executor[f]} onChange={e => setExecutor(p => ({ ...p, [f]: e.target.value }))} placeholder={f === 'fee' ? '2' : f === 'address' ? 'tb1...' : ''} style={{ width: '100%', padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 13, fontFamily: FONTS.body, boxSizing: 'border-box' }} />
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 28, marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 1.5 }}>Beneficiaries</div>
                                    <div style={{ fontSize: 12, color: sharesOk ? COLORS.green : totalShares > 0 ? COLORS.red : COLORS.muted }}>
                                        {totalShares.toFixed(0)}% of 100%
                                    </div>
                                </div>
                                {beneficiaries.map((b, i) => (
                                    <div key={i} style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, padding: '16px', marginBottom: 8 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                                            {(['name', 'address', 'location'] as const).map(f => (
                                                <input key={f} value={b[f]} onChange={e => updateBen(i, f, e.target.value)} placeholder={f === 'address' ? 'tb1...' : f.charAt(0).toUpperCase() + f.slice(1)} style={{ padding: '8px 12px', background: COLORS.obsidian, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 12, fontFamily: FONTS.body }} />
                                            ))}
                                            <input value={b.share} onChange={e => updateBen(i, 'share', e.target.value)} placeholder="Share %" type="number" min="0" max="100" style={{ padding: '8px 12px', background: COLORS.obsidian, border: `1px solid ${COLORS.border}`, color: COLORS.gold, fontSize: 12, fontFamily: FONTS.body }} />
                                        </div>
                                        {beneficiaries.length > 1 && (
                                            <button onClick={() => removeBen(i)} style={{ fontSize: 11, color: COLORS.red, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove</button>
                                        )}
                                        {b.location && !b.location.toLowerCase().includes('nigeria') && (
                                            <div style={{ marginTop: 6, fontSize: 11, color: COLORS.green }}>Remote signer - will receive email signing link</div>
                                        )}
                                    </div>
                                ))}
                                {beneficiaries.length < 7 && (
                                    <button onClick={addBeneficiary} style={{ width: '100%', padding: '10px', background: 'none', border: `1px dashed ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: 'pointer', marginTop: 4 }}>
                                        + Add Beneficiary ({beneficiaries.length}/7)
                                    </button>
                                )}
                            </div>

                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.red}40`, padding: 24, marginBottom: 28 }}>
                                <div style={{ fontSize: 11, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Charity Fallback</div>
                                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>Receives shares from failed appeals. Address locked at deployment.</div>
                                {(['name', 'address'] as const).map(f => (
                                    <input key={f} value={charity[f]} onChange={e => setCharity(p => ({ ...p, [f]: e.target.value }))} placeholder={f === 'address' ? 'tb1...' : 'Charity name'} style={{ width: '100%', padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: f === 'address' ? COLORS.red : COLORS.ivory, fontSize: 13, fontFamily: FONTS.body, boxSizing: 'border-box', marginBottom: 8 }} />
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setStep(2)} style={{ padding: '14px 28px', background: 'none', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: 'pointer' }}>Back</button>
                                <motion.button whileHover={{ background: COLORS.goldLight }} disabled={!canNext[3]} onClick={() => setStep(4)} style={{ padding: '14px 40px', background: canNext[3] ? COLORS.gold : COLORS.border, border: 'none', color: canNext[3] ? COLORS.obsidian : COLORS.muted, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: canNext[3] ? 'pointer' : 'not-allowed' }}>
                                    Continue
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>Upload Documents</div>
                            <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>Both documents are SHA-256 hashed in your browser. Only the hash is stored on-chain. Files are not uploaded to any server.</div>

                            {[
                                { label: 'Will Document', sub: 'Defines each beneficiary share percentage', state: willFile, set: setWillFile },
                                { label: 'Conditional Clause', sub: 'Defines disqualification conditions per beneficiary', state: clauseFile, set: setClauseFile },
                            ].map(({ label, sub, state, set }) => (
                                <label key={label} style={{ display: 'block', padding: 24, background: COLORS.slate, border: `1px solid ${state ? COLORS.gold : COLORS.border}`, marginBottom: 16, cursor: 'pointer' }}>
                                    <div style={{ fontSize: 13, color: state ? COLORS.gold : COLORS.ivory, marginBottom: 4 }}>{label} {state ? `- ${state.name}` : '(optional)'}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted }}>{sub}</div>
                                    <input type="file" accept=".pdf,.docx" onChange={e => set(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
                                </label>
                            ))}

                            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                                <button onClick={() => setStep(3)} style={{ padding: '14px 28px', background: 'none', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: 'pointer' }}>Back</button>
                                <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => setStep(5)} style={{ padding: '14px 40px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                                    Continue
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && !deploying && !deployed && (
                        <motion.div key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, marginBottom: 12 }}>Deploy Vault</div>
                            <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>Set your dead man's switch check-in frequency. After deployment, your vault contract is live on OP_NET Testnet.</div>

                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 28, marginBottom: 24 }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Check-In Frequency</div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {([3, 6] as const).map(freq => (
                                        <button key={freq} onClick={() => setCheckInFreq(freq)} style={{ flex: 1, padding: '16px', background: checkInFreq === freq ? `${COLORS.gold}20` : COLORS.mid, border: `1px solid ${checkInFreq === freq ? COLORS.gold : COLORS.border}`, color: checkInFreq === freq ? COLORS.gold : COLORS.muted, fontSize: 13, cursor: 'pointer' }}>
                                            Every {freq} months
                                            <div style={{ fontSize: 11, marginTop: 4, color: COLORS.muted }}>{freq === 3 ? '13,140 blocks' : '26,280 blocks'}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 28 }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Summary</div>
                                {[
                                    { label: 'Vault Name', value: vaultName },
                                    { label: 'Executor', value: executor.name || executor.address.slice(0, 16) + '...' },
                                    { label: 'Executor Fee', value: `${executor.fee}%` },
                                    { label: 'Beneficiaries', value: beneficiaries.length.toString() },
                                    { label: 'Total Shares', value: `${totalShares.toFixed(0)}%` },
                                    { label: 'Network', value: 'OP_NET Testnet - Bitcoin Layer 1' },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                                        <div style={{ fontSize: 12, color: COLORS.muted }}>{row.label}</div>
                                        <div style={{ fontSize: 12, color: COLORS.ivory }}>{row.value}</div>
                                    </div>
                                ))}
                            </div>

                            {deployError && <div style={{ padding: '12px 16px', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, fontSize: 12, marginBottom: 16 }}>{deployError}</div>}

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setStep(4)} style={{ padding: '14px 28px', background: 'none', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: 'pointer' }}>Back</button>
                                <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={handleDeploy} style={{ flex: 1, padding: '16px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                                    Deploy to OP_NET Testnet
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {deploying && (
                        <motion.div key="deploying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 40px', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 56, height: 56, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: '50%', margin: '0 auto 28px' }} />
                            <div style={{ fontFamily: FONTS.heading, fontSize: 26, color: COLORS.ivory, marginBottom: 8 }}>Deploying Contract</div>
                            <div style={{ fontSize: 13, color: COLORS.muted }}>Broadcasting vault to OP_NET Testnet...</div>
                        </motion.div>
                    )}

                    {deployed && (
                        <motion.div key="deployed" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: 48, background: COLORS.slate, border: `1px solid ${COLORS.green}` }}>
                            <div style={{ width: 64, height: 64, border: `2px solid ${COLORS.green}`, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.green, fontWeight: 700 }}>OK</div>
                            </div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>{vaultName} Deployed</div>
                            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>Your vault is live on OP_NET Testnet. All registered parties have been notified. Your certificate has been generated.</div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => navigate(`/certificate${deployedVaultId ? '?vaultId=' + deployedVaultId : ''}`)} style={{ padding: '14px 28px', background: COLORS.gold, border: 'none', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                                    View Certificate
                                </motion.button>
                                <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={() => navigate('/dashboard/owner')} style={{ padding: '14px 28px', background: 'none', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: 'pointer', letterSpacing: 1 }}>
                                    Go to Dashboard
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
