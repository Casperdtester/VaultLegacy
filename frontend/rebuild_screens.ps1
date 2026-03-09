# VaultLegacy - Rebuild all 10 screens (UTF8 no-BOM)
# Run from: C:\Users\HP\Desktop\VaultLegacy\frontend
$enc = [System.Text.UTF8Encoding]::new($false)

# --- AppealScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { motion } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

export function AppealScreen(): React.ReactElement {
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const beneficiary = { name: ''Ngozi Johnson'', share: 30, daysLeft: 18, reason: ''Pending criminal investigation - charges filed 2024-10-12'' };

    const handleSubmit = () => {
        setUploading(true);
        setTimeout(() => { setUploading(false); setSubmitted(true); }, 1800);
    };

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 11, color: COLORS.red, textTransform: ''uppercase'', letterSpacing: 2 }}>Inheritance Appeal</div>
            </div>

            <div style={{ maxWidth: 720, margin: ''0 auto'', padding: ''60px 48px'' }}>
                {/* Status banner */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: ''20px 28px'', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}50`, marginBottom: 40, display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'', gap: 24 }}>
                    <div>
                        <div style={{ fontSize: 11, color: COLORS.red, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 6 }}>Share Suspended</div>
                        <div style={{ fontSize: 15, color: COLORS.ivory }}>{beneficiary.name} - {beneficiary.share}% share held on-chain</div>
                    </div>
                    <div style={{ textAlign: ''right'' }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.red }}>{beneficiary.daysLeft}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted }}>days remaining</div>
                    </div>
                </motion.div>

                {/* Countdown bar */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: ''flex'', justifyContent: ''space-between'', marginBottom: 8 }}>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>Appeal Window</div>
                        <div style={{ fontSize: 11, color: COLORS.muted }}>30 days total</div>
                    </div>
                    <div style={{ width: ''100%'', height: 3, background: COLORS.border }}>
                        <div style={{ height: ''100%'', width: `${Math.round(((30 - beneficiary.daysLeft) / 30) * 100)}%`, background: COLORS.red }} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted }}>If no evidence is submitted, your share automatically redirects to the charity address after the window closes.</div>
                </div>

                {!submitted ? (
                    <>
                        {/* Suspension reason */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''28px'', marginBottom: 24 }}>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 12 }}>Reason for Suspension</div>
                            <div style={{ fontSize: 14, color: COLORS.ivory, lineHeight: 1.7, padding: ''16px'', background: COLORS.mid, border: `1px solid ${COLORS.border}` }}>{beneficiary.reason}</div>
                        </motion.div>

                        {/* Evidence upload */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''28px'', marginBottom: 24 }}>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 20 }}>Submit Appeal Evidence</div>
                            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20, lineHeight: 1.7 }}>Upload documents that demonstrate the suspension conditions no longer apply. Accepted: court dismissals, rehabilitation certificates, character references, legal correspondence.</div>

                            <div style={{ display: ''flex'', flexDirection: ''column'', gap: 10, marginBottom: 20 }}>
                                {[''Court Dismissal / Case Closure'', ''Rehabilitation Certificate'', ''Character References'', ''Legal Correspondence''].map((docType) => (
                                    <div key={docType} style={{ padding: ''14px 18px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'', cursor: ''pointer'' }}>
                                        <div style={{ fontSize: 13, color: COLORS.muted }}>{docType}</div>
                                        <div style={{ fontSize: 11, color: COLORS.goldDim, textTransform: ''uppercase'', letterSpacing: 1 }}>+ Upload</div>
                                    </div>
                                ))}
                            </div>

                            <textarea placeholder="Additional statement - explain why the suspension conditions no longer apply..." style={{ width: ''100%'', minHeight: 120, background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, padding: ''14px'', fontSize: 13, fontFamily: FONTS.body, resize: ''vertical'', boxSizing: ''border-box'', marginBottom: 20 }} />

                            <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={uploading} style={{ width: ''100%'', padding: ''16px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: uploading ? ''wait'' : ''pointer'' }}>
                                {uploading ? ''Submitting Evidence...'' : ''Submit Appeal to Executor''}
                            </motion.button>
                        </motion.div>
                    </>
                ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.green}`, padding: ''48px'', textAlign: ''center'' }}>
                        <div style={{ width: 56, height: 56, border: `2px solid ${COLORS.green}`, borderRadius: ''50%'', margin: ''0 auto 24px'', display: ''flex'', alignItems: ''center'', justifyContent: ''center'' }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.green, fontWeight: 700 }}>OK</div>
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 12 }}>Appeal Submitted</div>
                        <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, marginBottom: 24 }}>Your evidence has been submitted to the executor for review. You will be notified of the decision within the appeal window. The executor will either reinstate your share or confirm the redirect to charity.</div>
                        <div style={{ padding: ''14px 20px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.muted }}>
                            Evidence hash recorded on-chain - {beneficiary.daysLeft} days remaining in appeal window
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\AppealScreen.tsx'), $content, $enc)

# --- BeneficiaryDashboardScreen.tsx ---
$content = @'
import { motion } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

export function BeneficiaryDashboardScreen(): React.ReactElement {
    const isOwnerAlive = true;
    const beneficiary = { name: ''Chukwuemeka Johnson'', share: 35, vaultName: ''Johnson Family Estate'', executor: ''James Okafor, Esq.'', location: ''London, UK'', status: ''ACTIVE'', hasSigned: true };

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: ''flex'', gap: 16, alignItems: ''center'' }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>Beneficiary</span>
                    <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'' }}>bc1p...k92d</span>
                </div>
            </div>

            <div style={{ maxWidth: 780, margin: ''0 auto'', padding: ''60px 48px'' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Welcome</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.ivory, marginBottom: 8 }}>{beneficiary.name}</div>
                    <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 40 }}>You have been registered as a beneficiary of the estate below.</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''36px'', marginBottom: 24 }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 20 }}>Your Estate Summary</div>
                    <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr'', gap: 2, marginBottom: 24 }}>
                        <div style={{ padding: ''20px 24px'', background: COLORS.mid }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 6 }}>Estate Vault</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.ivory }}>{beneficiary.vaultName}</div>
                        </div>
                        <div style={{ padding: ''20px 24px'', background: COLORS.mid }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 6 }}>Executor</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 16, color: COLORS.ivory }}>{beneficiary.executor}</div>
                        </div>
                    </div>

                    <div style={{ padding: ''28px'', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, textAlign: ''center'', marginBottom: 24 }}>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Your Share</div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 72, color: COLORS.gold, lineHeight: 1 }}>{beneficiary.share}%</div>
                        {isOwnerAlive && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 12 }}>BTC amount shown only when your transfer is initiated</div>}
                    </div>

                    <div style={{ padding: ''16px 20px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.ivory, lineHeight: 1.8 }}>
                        {isOwnerAlive
                            ? ''The vault is currently active. The estate owner is alive and periodically checking in. You will be notified when your transfer is initiated.''
                            : ''The estate is now in execution. Your executor has been notified and will initiate your transfer after reviewing the will and conditional clause.''
                        }
                    </div>
                </motion.div>

                {!beneficiary.hasSigned && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: `${COLORS.gold}10`, border: `1px solid ${COLORS.gold}50`, padding: ''28px'', marginBottom: 24 }}>
                        <div style={{ fontSize: 13, color: COLORS.ivory, marginBottom: 20, lineHeight: 1.7 }}>You need to sign once to register your Bitcoin address on-chain. This confirms your participation in the estate.</div>
                        <motion.button whileHover={{ background: COLORS.goldLight }} style={{ padding: ''14px 36px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                            Sign and Register
                        </motion.button>
                    </motion.div>
                )}

                {beneficiary.hasSigned && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ padding: ''14px 20px'', background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}40`, display: ''flex'', alignItems: ''center'', gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: ''50%'', background: COLORS.green, flexShrink: 0 }} />
                        <div style={{ fontSize: 13, color: COLORS.ivory }}>Participation signature confirmed on-chain</div>
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: 32, padding: ''24px'', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 16 }}>What Happens Next</div>
                    {[
                        { step: ''1'', text: ''Owner continues checking in to prove they are alive'' },
                        { step: ''2'', text: ''Upon death, any party uploads a death certificate'' },
                        { step: ''3'', text: ''A 72-hour dispute window opens for verification'' },
                        { step: ''4'', text: ''Executor receives their fee and decrypts the will'' },
                        { step: ''5'', text: ''Your executor initiates your individual transfer'' },
                        { step: ''6'', text: ''You co-sign and receive your BTC in this wallet'' },
                    ].map((item) => (
                        <div key={item.step} style={{ display: ''flex'', gap: 16, padding: ''10px 0'', borderBottom: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 16, color: `${COLORS.gold}60`, minWidth: 20 }}>{item.step}</div>
                            <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{item.text}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\BeneficiaryDashboardScreen.tsx'), $content, $enc)

# --- CreateVaultScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { useNavigate } from ''react-router-dom'';
import { motion, AnimatePresence } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

type Step = 1 | 2 | 3 | 4 | 5;

interface Beneficiary { name: string; address: string; location: string; share: number; }

export function CreateVaultScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const [vaultName, setVaultName] = useState('''');
    const [executor, setExecutor] = useState({ name: '''', address: '''', location: '''', fee: '''' });
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([{ name: '''', address: '''', location: '''', share: 0 }]);
    const [charity, setCharity] = useState({ name: '''', address: '''' });
    const [willUploaded, setWillUploaded] = useState(false);
    const [clauseUploaded, setClauseUploaded] = useState(false);
    const [checkInFreq, setCheckInFreq] = useState<3 | 6>(3);
    const [deploying, setDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);

    const totalShares = beneficiaries.reduce((sum, b) => sum + (Number(b.share) || 0), 0);
    const sharesOk = totalShares === 100;

    const addBeneficiary = () => {
        if (beneficiaries.length < 7) setBeneficiaries([...beneficiaries, { name: '''', address: '''', location: '''', share: 0 }]);
    };
    const updateBeneficiary = (i: number, field: keyof Beneficiary, value: string | number) => {
        const updated = [...beneficiaries];
        (updated[i] as any)[field] = value;
        setBeneficiaries(updated);
    };
    const removeBeneficiary = (i: number) => setBeneficiaries(beneficiaries.filter((_, idx) => idx !== i));

    const handleDeploy = () => {
        setDeploying(true);
        setTimeout(() => { setDeploying(false); setDeployed(true); }, 3000);
    };

    const STEP_LABELS = [''Connect'', ''Name'', ''Parties'', ''Documents'', ''Deploy''];

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>Create Vault</div>
            </div>

            {/* Step progress */}
            <div style={{ padding: ''24px 48px'', borderBottom: `1px solid ${COLORS.border}`, display: ''flex'', alignItems: ''center'', gap: 0, maxWidth: 960, margin: ''0 auto'' }}>
                {STEP_LABELS.map((label, i) => {
                    const n = i + 1;
                    const active = n === step;
                    const done = n < step;
                    return (
                        <div key={label} style={{ display: ''flex'', alignItems: ''center'', flex: 1 }}>
                            <div style={{ display: ''flex'', alignItems: ''center'', gap: 10, flexShrink: 0 }}>
                                <div style={{ width: 28, height: 28, borderRadius: ''50%'', background: done ? COLORS.gold : active ? COLORS.gold : COLORS.border, display: ''flex'', alignItems: ''center'', justifyContent: ''center'', fontSize: 12, color: (done || active) ? COLORS.obsidian : COLORS.muted, fontWeight: 600 }}>
                                    {done ? ''OK'' : n}
                                </div>
                                <div style={{ fontSize: 11, color: active ? COLORS.gold : done ? COLORS.muted : COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>{label}</div>
                            </div>
                            {i < 4 && <div style={{ flex: 1, height: 1, background: done ? COLORS.gold : COLORS.border, margin: ''0 12px'' }} />}
                        </div>
                    );
                })}
            </div>

            <div style={{ maxWidth: 760, margin: ''0 auto'', padding: ''48px'' }}>
                <AnimatePresence mode="wait">

                    {/* Step 1 - Wallet already connected */}
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Step 1 of 5</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>Wallet Connected</div>
                                <div style={{ fontSize: 14, color: COLORS.muted }}>Your OP_NET wallet is verified. You are the vault owner.</div>
                            </div>
                            <div style={{ padding: ''24px'', background: COLORS.slate, border: `1px solid ${COLORS.green}`, marginBottom: 32, display: ''flex'', alignItems: ''center'', gap: 20 }}>
                                <div style={{ width: 10, height: 10, borderRadius: ''50%'', background: COLORS.green, flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 4 }}>Owner Wallet</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: ''monospace'' }}>bc1powner123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz8</div>
                                </div>
                            </div>
                            <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => setStep(2)} style={{ width: ''100%'', padding: ''16px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                                Continue
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Step 2 - Name */}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Step 2 of 5</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>Name Your Vault</div>
                                <div style={{ fontSize: 14, color: COLORS.muted }}>This name identifies your estate vault in all documents and notifications.</div>
                            </div>
                            <div style={{ marginBottom: 32 }}>
                                <label style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, display: ''block'', marginBottom: 10 }}>Estate Name</label>
                                <input value={vaultName} onChange={(e) => setVaultName(e.target.value)} placeholder="e.g. Johnson Family Estate" style={{ width: ''100%'', padding: ''16px 20px'', background: COLORS.mid, border: `1px solid ${vaultName ? COLORS.gold : COLORS.border}`, color: COLORS.ivory, fontSize: 15, fontFamily: FONTS.heading, boxSizing: ''border-box'', outline: ''none'' }} />
                            </div>
                            <div style={{ display: ''flex'', gap: 12 }}>
                                <button onClick={() => setStep(1)} style={{ flex: 1, padding: ''14px'', background: ''none'', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: ''pointer'', letterSpacing: 1 }}>Back</button>
                                <motion.button whileHover={{ background: COLORS.goldLight }} disabled={!vaultName.trim()} onClick={() => setStep(3)} style={{ flex: 3, padding: ''14px'', background: vaultName.trim() ? COLORS.gold : COLORS.border, border: ''none'', color: vaultName.trim() ? COLORS.obsidian : COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: vaultName.trim() ? ''pointer'' : ''not-allowed'' }}>
                                    Continue
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3 - Parties */}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 28 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Step 3 of 5</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>Register Parties</div>
                                <div style={{ fontSize: 14, color: COLORS.muted }}>Add your executor and up to 7 beneficiaries. Share percentages must total exactly 100%.</div>
                            </div>

                            {/* Executor */}
                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''28px'', marginBottom: 20 }}>
                                <div style={{ fontSize: 12, color: COLORS.goldLight, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 20 }}>Executor (Lawyer)</div>
                                <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr'', gap: 12 }}>
                                    {[{ label: ''Full Name'', field: ''name'' as const, placeholder: ''James Okafor, Esq.'' }, { label: ''Bitcoin Address'', field: ''address'' as const, placeholder: ''bc1p...'' }, { label: ''Location'', field: ''location'' as const, placeholder: ''Lagos, Nigeria'' }, { label: ''Fee Percentage'', field: ''fee'' as const, placeholder: ''2'' }].map(({ label, field, placeholder }) => (
                                        <div key={field}>
                                            <label style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, display: ''block'', marginBottom: 8 }}>{label}{field === ''fee'' && '' (%)''}</label>
                                            <input value={executor[field]} onChange={(e) => setExecutor({ ...executor, [field]: e.target.value })} placeholder={placeholder} style={{ width: ''100%'', padding: ''12px 14px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 13, boxSizing: ''border-box'', outline: ''none'' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Beneficiaries */}
                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''28px'', marginBottom: 20 }}>
                                <div style={{ display: ''flex'', justifyContent: ''space-between'', alignItems: ''center'', marginBottom: 20 }}>
                                    <div style={{ fontSize: 12, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 1.5 }}>Beneficiaries ({beneficiaries.length}/7)</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: sharesOk ? COLORS.green : COLORS.red }}>{totalShares}% {sharesOk ? ''- OK'' : ''- must equal 100%''}</div>
                                </div>

                                {beneficiaries.map((b, i) => {
                                    const isRemote = b.location && ![''lagos'', ''abuja'', ''nigeria''].some(loc => b.location.toLowerCase().includes(loc));
                                    return (
                                        <div key={i} style={{ padding: ''20px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, marginBottom: 10 }}>
                                            <div style={{ display: ''flex'', justifyContent: ''space-between'', alignItems: ''center'', marginBottom: 14 }}>
                                                <div style={{ display: ''flex'', gap: 8, alignItems: ''center'' }}>
                                                    <span style={{ fontSize: 12, color: COLORS.muted }}>Beneficiary {i + 1}</span>
                                                    {b.location && (
                                                        <span style={{ padding: ''2px 8px'', background: isRemote ? `${COLORS.green}20` : `${COLORS.gold}20`, border: `1px solid ${isRemote ? COLORS.green : COLORS.goldDim}`, fontSize: 10, color: isRemote ? COLORS.green : COLORS.gold, letterSpacing: 1 }}>{isRemote ? ''REMOTE'' : ''LOCAL''}</span>
                                                    )}
                                                </div>
                                                {beneficiaries.length > 1 && <button onClick={() => removeBeneficiary(i)} style={{ background: ''none'', border: ''none'', color: COLORS.red, cursor: ''pointer'', fontSize: 12 }}>Remove</button>}
                                            </div>
                                            <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr 1fr 80px'', gap: 10 }}>
                                                {[{ label: ''Name'', field: ''name'' as const, placeholder: ''Full name'' }, { label: ''Bitcoin Address'', field: ''address'' as const, placeholder: ''bc1p...'' }, { label: ''Location'', field: ''location'' as const, placeholder: ''City, Country'' }].map(({ label, field, placeholder }) => (
                                                    <div key={field}>
                                                        <label style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1, display: ''block'', marginBottom: 6 }}>{label}</label>
                                                        <input value={b[field] as string} onChange={(e) => updateBeneficiary(i, field, e.target.value)} placeholder={placeholder} style={{ width: ''100%'', padding: ''10px 12px'', background: COLORS.slate, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 12, boxSizing: ''border-box'', outline: ''none'' }} />
                                                    </div>
                                                ))}
                                                <div>
                                                    <label style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1, display: ''block'', marginBottom: 6 }}>Share %</label>
                                                    <input type="number" value={b.share || ''''} onChange={(e) => updateBeneficiary(i, ''share'', Number(e.target.value))} placeholder="0" min={0} max={100} style={{ width: ''100%'', padding: ''10px 12px'', background: COLORS.slate, border: `1px solid ${COLORS.border}`, color: COLORS.gold, fontSize: 14, fontFamily: FONTS.heading, boxSizing: ''border-box'', outline: ''none'' }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {beneficiaries.length < 7 && (
                                    <button onClick={addBeneficiary} style={{ width: ''100%'', padding: ''12px'', background: ''none'', border: `1px dashed ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: ''pointer'', letterSpacing: 1 }}>
                                        + Add Beneficiary
                                    </button>
                                )}
                            </div>

                            {/* Charity */}
                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.red}40`, padding: ''24px'', marginBottom: 24 }}>
                                <div style={{ fontSize: 12, color: COLORS.red, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 16 }}>Charity Fallback (locked at deployment)</div>
                                <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr'', gap: 12 }}>
                                    <div>
                                        <label style={{ fontSize: 10, color: COLORS.muted, display: ''block'', marginBottom: 8, textTransform: ''uppercase'', letterSpacing: 1 }}>Charity Name</label>
                                        <input value={charity.name} onChange={(e) => setCharity({ ...charity, name: e.target.value })} placeholder="Lagos Children''s Foundation" style={{ width: ''100%'', padding: ''12px 14px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 13, boxSizing: ''border-box'', outline: ''none'' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 10, color: COLORS.muted, display: ''block'', marginBottom: 8, textTransform: ''uppercase'', letterSpacing: 1 }}>Bitcoin Address</label>
                                        <input value={charity.address} onChange={(e) => setCharity({ ...charity, address: e.target.value })} placeholder="bc1p..." style={{ width: ''100%'', padding: ''12px 14px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontSize: 13, boxSizing: ''border-box'', outline: ''none'' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: ''flex'', gap: 12 }}>
                                <button onClick={() => setStep(2)} style={{ flex: 1, padding: ''14px'', background: ''none'', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: ''pointer'' }}>Back</button>
                                <motion.button whileHover={{ background: COLORS.goldLight }} disabled={!sharesOk} onClick={() => setStep(4)} style={{ flex: 3, padding: ''14px'', background: sharesOk ? COLORS.gold : COLORS.border, border: ''none'', color: sharesOk ? COLORS.obsidian : COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: sharesOk ? ''pointer'' : ''not-allowed'' }}>
                                    Continue
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4 - Documents */}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Step 4 of 5</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>Upload Will and Conditional Clause</div>
                                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.7 }}>Documents are encrypted client-side with your executor''s public key before upload. Only the SHA-256 hash is stored on-chain. Documents are unreadable until death is confirmed.</div>
                            </div>

                            {[
                                { label: ''Will Document'', tag: ''WILL'', desc: ''Defines each beneficiary\''s share. Executor reads this after death is confirmed.'', uploaded: willUploaded, onUpload: () => setWillUploaded(true) },
                                { label: ''Conditional Clause'', tag: ''CLAUSE'', desc: ''Defines conditions that disqualify a beneficiary. Co-signed by owner and executor at deployment.'', uploaded: clauseUploaded, onUpload: () => setClauseUploaded(true) },
                            ].map((doc) => (
                                <div key={doc.label} style={{ background: COLORS.slate, border: `1px solid ${doc.uploaded ? COLORS.green : COLORS.border}`, padding: ''28px'', marginBottom: 16 }}>
                                    <div style={{ display: ''flex'', justifyContent: ''space-between'', alignItems: ''center'', marginBottom: 12 }}>
                                        <div style={{ display: ''flex'', gap: 12, alignItems: ''center'' }}>
                                            <div style={{ padding: ''2px 10px'', background: `${COLORS.gold}18`, border: `1px solid ${COLORS.goldDim}`, fontSize: 10, color: COLORS.gold, letterSpacing: 1 }}>{doc.tag}</div>
                                            <div style={{ fontSize: 14, color: COLORS.ivory }}>{doc.label}</div>
                                        </div>
                                        {doc.uploaded && <div style={{ fontSize: 11, color: COLORS.green }}>Encrypted - Hash stored</div>}
                                    </div>
                                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16, lineHeight: 1.6 }}>{doc.desc}</div>
                                    {!doc.uploaded ? (
                                        <div style={{ padding: ''24px'', background: COLORS.mid, border: `2px dashed ${COLORS.border}`, textAlign: ''center'', cursor: ''pointer'' }} onClick={doc.onUpload}>
                                            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>Click to upload PDF or DOCX</div>
                                            <div style={{ fontSize: 11, color: COLORS.mutedDark }}>Encrypted with executor public key before upload</div>
                                        </div>
                                    ) : (
                                        <div style={{ padding: ''12px 16px'', background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}40`, fontSize: 11, color: COLORS.green }}>
                                            Document encrypted and SHA-256 hash ready for on-chain storage
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div style={{ display: ''flex'', gap: 12, marginTop: 24 }}>
                                <button onClick={() => setStep(3)} style={{ flex: 1, padding: ''14px'', background: ''none'', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: ''pointer'' }}>Back</button>
                                <motion.button whileHover={{ background: COLORS.goldLight }} disabled={!willUploaded || !clauseUploaded} onClick={() => setStep(5)} style={{ flex: 3, padding: ''14px'', background: (willUploaded && clauseUploaded) ? COLORS.gold : COLORS.border, border: ''none'', color: (willUploaded && clauseUploaded) ? COLORS.obsidian : COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: (willUploaded && clauseUploaded) ? ''pointer'' : ''not-allowed'' }}>
                                    Continue
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5 - Deploy */}
                    {step === 5 && (
                        <motion.div key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Step 5 of 5</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>Deploy Vault</div>
                                <div style={{ fontSize: 14, color: COLORS.muted }}>Review your settings and deploy the vault contract to OP_NET Testnet.</div>
                            </div>

                            {!deployed && !deploying && (
                                <>
                                    {/* Check-in frequency */}
                                    <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''28px'', marginBottom: 24 }}>
                                        <div style={{ fontSize: 12, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 16 }}>Dead Man''s Switch Frequency</div>
                                        <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr'', gap: 10 }}>
                                            {([3, 6] as const).map((months) => (
                                                <button key={months} onClick={() => setCheckInFreq(months)} style={{ padding: ''16px'', background: checkInFreq === months ? `${COLORS.gold}18` : COLORS.mid, border: `1px solid ${checkInFreq === months ? COLORS.gold : COLORS.border}`, color: checkInFreq === months ? COLORS.gold : COLORS.muted, fontSize: 13, cursor: ''pointer'' }}>
                                                    Every {months} months
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 12 }}>Miss 3 consecutive check-ins to trigger executor notification</div>
                                    </div>

                                    {/* Summary */}
                                    <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''24px'', marginBottom: 24 }}>
                                        <div style={{ fontSize: 12, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 16 }}>Deployment Summary</div>
                                        {[
                                            { label: ''Vault Name'', value: vaultName },
                                            { label: ''Executor'', value: executor.name || ''Not set'' },
                                            { label: ''Executor Fee'', value: executor.fee ? `${executor.fee}%` : ''Not set'' },
                                            { label: ''Beneficiaries'', value: beneficiaries.filter(b => b.name).length.toString() },
                                            { label: ''Check-in Frequency'', value: `Every ${checkInFreq} months` },
                                            { label: ''Network'', value: ''OP_NET Testnet'' },
                                        ].map((row) => (
                                            <div key={row.label} style={{ display: ''flex'', justifyContent: ''space-between'', padding: ''10px 0'', borderBottom: `1px solid ${COLORS.border}` }}>
                                                <span style={{ fontSize: 12, color: COLORS.muted }}>{row.label}</span>
                                                <span style={{ fontSize: 13, color: COLORS.ivory }}>{row.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: ''flex'', gap: 12 }}>
                                        <button onClick={() => setStep(4)} style={{ flex: 1, padding: ''14px'', background: ''none'', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: ''pointer'' }}>Back</button>
                                        <motion.button whileHover={{ background: COLORS.goldLight }} onClick={handleDeploy} style={{ flex: 3, padding: ''14px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                                            Deploy to OP_NET Testnet
                                        </motion.button>
                                    </div>
                                </>
                            )}

                            {deploying && (
                                <div style={{ textAlign: ''center'', padding: ''60px 40px'', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: ''linear'' }} style={{ width: 56, height: 56, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: ''50%'', margin: ''0 auto 28px'' }} />
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 26, color: COLORS.ivory, marginBottom: 8 }}>Deploying Contract</div>
                                    <div style={{ fontSize: 13, color: COLORS.muted }}>Broadcasting vault contract to OP_NET Testnet...</div>
                                </div>
                            )}

                            {deployed && (
                                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: ''center'', padding: ''48px'', background: COLORS.slate, border: `1px solid ${COLORS.green}` }}>
                                    <div style={{ width: 64, height: 64, border: `2px solid ${COLORS.green}`, borderRadius: ''50%'', margin: ''0 auto 24px'', display: ''flex'', alignItems: ''center'', justifyContent: ''center'' }}>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.green, fontWeight: 700 }}>OK</div>
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>{vaultName} Deployed</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: ''monospace'', marginBottom: 24 }}>bc1pvault7x9m...k2r4 - OP_NET Testnet</div>
                                    <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>All registered parties have been sent invite links. Your vault certificate has been generated.</div>
                                    <div style={{ display: ''flex'', gap: 12, justifyContent: ''center'' }}>
                                        <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => navigate(''/certificate'')} style={{ padding: ''14px 28px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                                            View Certificate
                                        </motion.button>
                                        <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={() => navigate(''/owner'')} style={{ padding: ''14px 28px'', background: ''none'', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, cursor: ''pointer'', letterSpacing: 1 }}>
                                            Go to Dashboard
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\CreateVaultScreen.tsx'), $content, $enc)

# --- DeathConfirmationScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { motion, AnimatePresence } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

type Stage = ''upload'' | ''window'' | ''flagged'' | ''complete'';

export function DeathConfirmationScreen(): React.ReactElement {
    const [stage, setStage] = useState<Stage>(''upload'');
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [fraudNote, setFraudNote] = useState('''');
    const windowHoursRemaining = 48;
    const progressPct = Math.round(((72 - windowHoursRemaining) / 72) * 100);

    const handleUpload = () => {
        setUploading(true);
        setTimeout(() => { setUploading(false); setUploaded(true); setTimeout(() => setStage(''window''), 800); }, 2000);
    };

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 11, color: COLORS.red, textTransform: ''uppercase'', letterSpacing: 2 }}>Death Confirmation Protocol</div>
            </div>

            <div style={{ maxWidth: 760, margin: ''0 auto'', padding: ''60px 48px'' }}>
                {/* Progress steps */}
                <div style={{ display: ''flex'', gap: 0, marginBottom: 48 }}>
                    {[''Upload Certificate'', ''Executor Verification'', ''72-Hour Window'', ''Execution''].map((step, i) => {
                        const stages: Stage[] = [''upload'', ''window'', ''window'', ''complete''];
                        const isActive = i <= [''upload'', ''window'', ''window'', ''complete''].indexOf(stage);
                        return (
                            <div key={step} style={{ flex: 1, display: ''flex'', flexDirection: ''column'', alignItems: ''center'', position: ''relative'' }}>
                                {i < 3 && <div style={{ position: ''absolute'', top: 11, left: ''50%'', width: ''100%'', height: 1, background: isActive ? COLORS.gold : COLORS.border }} />}
                                <div style={{ width: 24, height: 24, borderRadius: ''50%'', background: isActive ? COLORS.gold : COLORS.border, display: ''flex'', alignItems: ''center'', justifyContent: ''center'', marginBottom: 8, zIndex: 1 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: ''50%'', background: isActive ? COLORS.obsidian : COLORS.muted }} />
                                </div>
                                <div style={{ fontSize: 10, color: isActive ? COLORS.gold : COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1, textAlign: ''center'' }}>{step}</div>
                            </div>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {stage === ''upload'' && (
                        <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.red, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Initiate Estate Unlock</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 16 }}>Upload Death Certificate</div>
                                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8 }}>An official death certificate is required to begin the confirmation process. The document is hashed on-chain. Your executor will independently verify and co-confirm.</div>
                            </div>

                            <div style={{ padding: ''40px'', background: COLORS.slate, border: `2px dashed ${COLORS.border}`, textAlign: ''center'', marginBottom: 24, cursor: ''pointer'' }} onClick={uploaded ? undefined : handleUpload}>
                                {uploading ? (
                                    <div>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: ''linear'' }} style={{ width: 40, height: 40, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: ''50%'', margin: ''0 auto 16px'' }} />
                                        <div style={{ fontSize: 13, color: COLORS.muted }}>Uploading and hashing document...</div>
                                    </div>
                                ) : uploaded ? (
                                    <div>
                                        <div style={{ fontSize: 13, color: COLORS.green, marginBottom: 8 }}>Document uploaded and hashed</div>
                                        <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'' }}>SHA-256: 8f2a4c1d9e...</div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ width: 48, height: 48, border: `1px solid ${COLORS.border}`, margin: ''0 auto 16px'', display: ''flex'', alignItems: ''center'', justifyContent: ''center'' }}>
                                            <div style={{ width: 20, height: 24, border: `2px solid ${COLORS.muted}`, position: ''relative'' }}>
                                                <div style={{ position: ''absolute'', top: -6, right: -6, width: 12, height: 12, background: COLORS.obsidian, border: `2px solid ${COLORS.muted}`, borderBottom: ''none'', borderLeft: ''none'' }} />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>Click to upload death certificate</div>
                                        <div style={{ fontSize: 11, color: COLORS.mutedDark }}>PDF or image - document is hashed, not stored</div>
                                    </div>
                                )}
                            </div>

                            <motion.button whileHover={{ borderColor: COLORS.red }} disabled={!uploaded} onClick={() => setStage(''window'')} style={{ width: ''100%'', padding: ''16px'', background: uploaded ? COLORS.red : COLORS.mid, border: `1px solid ${uploaded ? COLORS.red : COLORS.border}`, color: uploaded ? COLORS.ivory : COLORS.muted, fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: uploaded ? ''pointer'' : ''not-allowed'' }}>
                                Initiate Unlock Protocol
                            </motion.button>
                        </motion.div>
                    )}

                    {stage === ''window'' && (
                        <motion.div key="window" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Dispute Window Active</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 16 }}>72-Hour Verification Period</div>
                                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8 }}>The estate executor has been notified and is independently verifying the death certificate. Any registered party may flag fraud during this window.</div>
                            </div>

                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''32px'', marginBottom: 24 }}>
                                <div style={{ display: ''flex'', justifyContent: ''space-between'', marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>Window Progress</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.gold }}>{windowHoursRemaining}h remaining</div>
                                </div>
                                <div style={{ width: ''100%'', height: 4, background: COLORS.border, marginBottom: 24 }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1 }} style={{ height: ''100%'', background: COLORS.gold }} />
                                </div>
                                <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr'', gap: 2 }}>
                                    {[{ label: ''Certificate Uploaded'', status: ''Confirmed'', color: COLORS.green }, { label: ''Executor Verification'', status: ''In Progress'', color: COLORS.gold }, { label: ''Fraud Flags'', status: ''None'', color: COLORS.green }, { label: ''Auto-Execute At'', status: ''72h mark'', color: COLORS.muted }].map((item) => (
                                        <div key={item.label} style={{ padding: ''14px 16px'', background: COLORS.mid }}>
                                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                                            <div style={{ fontSize: 13, color: item.color }}>{item.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: `${COLORS.red}08`, border: `1px solid ${COLORS.red}40`, padding: ''24px'' }}>
                                <div style={{ fontSize: 12, color: COLORS.red, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 12 }}>Flag as Fraudulent</div>
                                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.7 }}>If you believe this death confirmation is fraudulent, submit evidence now. A fraud flag halts the process pending investigation.</div>
                                <textarea value={fraudNote} onChange={(e) => setFraudNote(e.target.value)} placeholder="Describe the fraudulent activity and attach evidence..." style={{ width: ''100%'', minHeight: 100, background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, padding: ''12px'', fontSize: 13, fontFamily: FONTS.body, resize: ''vertical'', boxSizing: ''border-box'' }} />
                                <motion.button whileHover={{ background: `${COLORS.red}30` }} style={{ marginTop: 12, padding: ''12px 24px'', background: ''none'', border: `1px solid ${COLORS.red}`, color: COLORS.red, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                                    Submit Fraud Flag with Evidence
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\DeathConfirmationScreen.tsx'), $content, $enc)

# --- DepositHistoryScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { motion } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

const HISTORY = [
    { id: 1, type: ''Initial Deposit'', date: ''2025-10-04'', amount: ''1.500 BTC'', initiatedBy: ''Owner'', txHash: ''0x8f2a4c...'', lawyerAck: true, ackDate: ''2025-10-04'' },
    { id: 2, type: ''Top-up'', date: ''2025-11-21'', amount: ''0.342 BTC'', initiatedBy: ''Owner'', txHash: ''0x3d1b9e...'', lawyerAck: false, ackDate: null },
];

export function DepositHistoryScreen(): React.ReactElement {
    const [acknowledging, setAcknowledging] = useState<number | null>(null);
    const [acked, setAcked] = useState<number[]>([]);
    const isExecutor = true;

    const handleAck = (id: number) => {
        setAcknowledging(id);
        setTimeout(() => { setAcknowledging(null); setAcked((prev) => [...prev, id]); }, 1500);
    };

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>Deposit and Withdrawal History</div>
            </div>

            <div style={{ maxWidth: 960, margin: ''0 auto'', padding: ''48px'' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Johnson Family Estate</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 8 }}>Deposit History</div>
                    <div style={{ fontSize: 14, color: COLORS.muted }}>Complete on-chain record of every deposit, top-up, and withdrawal. Lawyer acknowledgment required for all deposits.</div>
                </motion.div>

                {/* Summary */}
                <div style={{ display: ''grid'', gridTemplateColumns: ''repeat(3, 1fr)'', gap: 2, marginBottom: 40 }}>
                    {[{ label: ''Current Balance'', value: ''1.842 BTC'', color: COLORS.gold }, { label: ''Total Deposited'', value: ''1.842 BTC'', color: COLORS.ivory }, { label: ''Pending Acknowledgment'', value: ''1 top-up'', color: COLORS.red }].map((s) => (
                        <div key={s.label} style={{ padding: ''20px 24px'', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 8 }}>{s.label}</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Table header */}
                <div style={{ display: ''grid'', gridTemplateColumns: ''120px 110px 140px 100px 1fr 160px'', gap: 0, padding: ''10px 20px'', borderBottom: `1px solid ${COLORS.border}`, marginBottom: 2 }}>
                    {[''Type'', ''Date'', ''Amount'', ''Initiated By'', ''TX Hash'', ''Lawyer Ack''].map((h) => (
                        <div key={h} style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5 }}>{h}</div>
                    ))}
                </div>

                {HISTORY.map((entry, i) => {
                    const isAcked = entry.lawyerAck || acked.includes(entry.id);
                    return (
                        <motion.div key={entry.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ display: ''grid'', gridTemplateColumns: ''120px 110px 140px 100px 1fr 160px'', gap: 0, padding: ''18px 20px'', background: COLORS.slate, border: `1px solid ${COLORS.border}`, marginBottom: 2, alignItems: ''center'' }}>
                            <div>
                                <div style={{ padding: ''3px 10px'', background: entry.type === ''Initial Deposit'' ? `${COLORS.gold}18` : `${COLORS.green}15`, border: `1px solid ${entry.type === ''Initial Deposit'' ? COLORS.goldDim : COLORS.green}50`, fontSize: 10, color: entry.type === ''Initial Deposit'' ? COLORS.gold : COLORS.green, letterSpacing: 1, display: ''inline-block'' }}>{entry.type}</div>
                            </div>
                            <div style={{ fontSize: 13, color: COLORS.muted }}>{entry.date}</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold }}>{entry.amount}</div>
                            <div style={{ fontSize: 12, color: COLORS.muted }}>{entry.initiatedBy}</div>
                            <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'' }}>{entry.txHash}</div>
                            <div>
                                {isAcked ? (
                                    <div style={{ display: ''flex'', alignItems: ''center'', gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: ''50%'', background: COLORS.green }} />
                                        <span style={{ fontSize: 12, color: COLORS.green }}>Acknowledged</span>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ display: ''flex'', alignItems: ''center'', gap: 8, marginBottom: 8 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: ''50%'', background: COLORS.red }} />
                                            <span style={{ fontSize: 12, color: COLORS.red }}>Pending</span>
                                        </div>
                                        {isExecutor && (
                                            <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={() => handleAck(entry.id)} disabled={acknowledging === entry.id} style={{ padding: ''6px 14px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.gold, fontSize: 11, letterSpacing: 1, cursor: ''pointer'' }}>
                                                {acknowledging === entry.id ? ''Signing...'' : ''Acknowledge''}
                                            </motion.button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {isExecutor && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: 32, padding: ''20px 24px'', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>
                        As executor, your acknowledgment of each deposit serves as an on-chain witness record - equivalent to a solicitor co-signing estate documents. All acknowledgments are immutable on Bitcoin Layer 1.
                    </motion.div>
                )}
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\DepositHistoryScreen.tsx'), $content, $enc)

# --- ExecutorDashboardScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { useNavigate } from ''react-router-dom'';
import { motion, AnimatePresence } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

const MOCK = {
    vault: { name: ''Johnson Family Estate'', balance: ''1.842 BTC'', balanceAtDeath: ''1.842 BTC'', status: ''EXECUTING'', contractAddress: ''bc1pq8k2...a4f7'', feePct: 2, feeAmount: ''0.036 BTC'', netEstate: ''1.806 BTC'' },
    transfers: [
        { name: ''Adaeze Johnson'', share: 35, amount: ''0.632 BTC'', location: ''Lagos, Nigeria'', isRemote: false, status: ''PENDING'', appeal: null },
        { name: ''Chukwuemeka Johnson'', share: 35, amount: ''0.632 BTC'', location: ''London, UK'', isRemote: true, status: ''SENT'', appeal: null },
        { name: ''Ngozi Johnson'', share: 30, amount: ''0.542 BTC'', location: ''Lagos, Nigeria'', isRemote: false, status: ''SUSPENDED'', appeal: { daysLeft: 18, evidenceSubmitted: true } },
    ],
};

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
    PENDING: { color: COLORS.gold, bg: `${COLORS.gold}18`, label: ''Pending Signature'' },
    SENT: { color: COLORS.green, bg: `${COLORS.green}18`, label: ''Remote - Link Sent'' },
    SIGNED: { color: COLORS.green, bg: `${COLORS.green}18`, label: ''Co-Signed'' },
    SUSPENDED: { color: COLORS.red, bg: `${COLORS.red}18`, label: ''Suspended - Appeal Open'' },
    ESCROWED: { color: COLORS.muted, bg: `${COLORS.muted}18`, label: ''Escrowed'' },
    COMPLETE: { color: COLORS.muted, bg: `${COLORS.muted}18`, label: ''Complete'' },
};

export function ExecutorDashboardScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<''transfers'' | ''will'' | ''audit''>(''transfers'');

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: ''flex'', gap: 16, alignItems: ''center'' }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>Executor Dashboard</span>
                    <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'' }}>bc1p...e34a</span>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: ''0 auto'', padding: ''40px 48px'' }}>
                {/* Vault Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''32px'', marginBottom: 32 }}>
                    <div style={{ display: ''flex'', justifyContent: ''space-between'', alignItems: ''flex-start'', marginBottom: 24 }}>
                        <div>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 8 }}>Estate Under Execution</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>{MOCK.vault.name}</div>
                            <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'', marginTop: 6 }}>{MOCK.vault.contractAddress}</div>
                        </div>
                        <div style={{ padding: ''4px 14px'', background: `${COLORS.gold}20`, border: `1px solid ${COLORS.goldDim}`, fontSize: 11, color: COLORS.gold, letterSpacing: 1.5 }}>EXECUTING</div>
                    </div>
                    <div style={{ display: ''grid'', gridTemplateColumns: ''repeat(4, 1fr)'', gap: 2 }}>
                        {[
                            { label: ''Vault Balance'', value: MOCK.vault.balance, color: COLORS.gold },
                            { label: ''Executor Fee (2%)'', value: MOCK.vault.feeAmount, color: COLORS.goldLight },
                            { label: ''Net Estate'', value: MOCK.vault.netEstate, color: COLORS.ivory },
                            { label: ''Contract'', value: ''OP_NET L1'', color: COLORS.muted },
                        ].map((s) => (
                            <div key={s.label} style={{ padding: ''16px 20px'', background: COLORS.mid }}>
                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: s.label === ''Contract'' ? 14 : 20, color: s.color }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tabs */}
                <div style={{ display: ''flex'', gap: 0, marginBottom: 24, borderBottom: `1px solid ${COLORS.border}` }}>
                    {([''transfers'', ''will'', ''audit''] as const).map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: ''12px 28px'', background: ''none'', border: ''none'', borderBottom: activeTab === tab ? `2px solid ${COLORS.gold}` : ''2px solid transparent'', color: activeTab === tab ? COLORS.gold : COLORS.muted, fontSize: 12, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'', marginBottom: -1 }}>
                            {tab === ''transfers'' ? ''Transfers'' : tab === ''will'' ? ''Will & Clause'' : ''Audit Trail''}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === ''transfers'' && (
                        <motion.div key="transfers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: ''flex'', flexDirection: ''column'', gap: 8 }}>
                                {MOCK.transfers.map((t, i) => {
                                    const st = STATUS_STYLE[t.status] || STATUS_STYLE.PENDING;
                                    return (
                                        <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''20px 24px'', display: ''flex'', alignItems: ''center'', gap: 20, flexWrap: ''wrap'' }}>
                                            <div style={{ padding: ''3px 10px'', background: t.isRemote ? `${COLORS.green}20` : `${COLORS.gold}20`, border: `1px solid ${t.isRemote ? COLORS.green : COLORS.goldDim}`, fontSize: 10, color: t.isRemote ? COLORS.green : COLORS.gold, letterSpacing: 1, flexShrink: 0 }}>
                                                {t.isRemote ? ''REMOTE'' : ''LOCAL''}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 140 }}>
                                                <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 3 }}>{t.name}</div>
                                                <div style={{ fontSize: 11, color: COLORS.muted }}>{t.location}</div>
                                            </div>
                                            <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold, minWidth: 120 }}>{t.amount}</div>
                                            <div style={{ fontSize: 12, color: COLORS.muted }}>{t.share}% share</div>
                                            <div style={{ padding: ''3px 12px'', background: st.bg, border: `1px solid ${st.color}50`, fontSize: 10, color: st.color, letterSpacing: 1 }}>{st.label}</div>
                                            {t.appeal && (
                                                <div style={{ fontSize: 11, color: COLORS.red }}>{t.appeal.daysLeft}d appeal</div>
                                            )}
                                            <div style={{ display: ''flex'', gap: 8 }}>
                                                {t.status === ''PENDING'' && (
                                                    <motion.button whileHover={{ borderColor: COLORS.gold }} style={{ padding: ''8px 16px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.gold, fontSize: 11, letterSpacing: 1, cursor: ''pointer'' }}>
                                                        Initiate Transfer
                                                    </motion.button>
                                                )}
                                                {t.status === ''SUSPENDED'' && (
                                                    <>
                                                        <motion.button whileHover={{ background: `${COLORS.green}20` }} style={{ padding: ''8px 14px'', background: ''none'', border: `1px solid ${COLORS.green}50`, color: COLORS.green, fontSize: 11, cursor: ''pointer'' }}>Reinstate</motion.button>
                                                        <motion.button whileHover={{ background: `${COLORS.red}20` }} style={{ padding: ''8px 14px'', background: ''none'', border: `1px solid ${COLORS.red}50`, color: COLORS.red, fontSize: 11, cursor: ''pointer'' }}>Redirect to Charity</motion.button>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {/* Charity fallback row */}
                                <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.red}40`, padding: ''16px 24px'', display: ''flex'', alignItems: ''center'', gap: 20 }}>
                                    <div style={{ padding: ''3px 10px'', background: `${COLORS.red}15`, border: `1px solid ${COLORS.red}50`, fontSize: 10, color: COLORS.red, letterSpacing: 1 }}>CHARITY</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, color: COLORS.red }}>Lagos Children''s Foundation</div>
                                        <div style={{ fontSize: 11, color: COLORS.muted }}>Fallback - receives failed appeals</div>
                                    </div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>Address locked at deployment</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === ''will'' && (
                        <motion.div key="will" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''40px'' }}>
                            <div style={{ fontSize: 13, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 24 }}>Decrypted Will - Death Confirmed</div>
                            <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr'', gap: 24, marginBottom: 32 }}>
                                {MOCK.transfers.map((t) => (
                                    <div key={t.name} style={{ padding: ''20px'', background: COLORS.mid, border: `1px solid ${COLORS.border}` }}>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.ivory, marginBottom: 8 }}>{t.name}</div>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.gold, marginBottom: 4 }}>{t.amount}</div>
                                        <div style={{ fontSize: 12, color: COLORS.muted }}>{t.share}% of net estate</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: ''16px 20px'', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, fontSize: 12, color: COLORS.muted, lineHeight: 1.7 }}>
                                Will hash verified on-chain. Document decrypted with executor private key after fee payment. Conditional clause reviewed per beneficiary.
                            </div>
                        </motion.div>
                    )}

                    {activeTab === ''audit'' && (
                        <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {[
                                { date: ''2025-12-14'', action: ''Death certificate uploaded'', by: ''Adaeze Johnson'', hash: ''0x8f2a...'' },
                                { date: ''2025-12-14'', action: ''Death confirmed on-chain'', by: ''Executor'', hash: ''0x4c1d...'' },
                                { date: ''2025-12-16'', action: ''72-hour window closed'', by: ''Contract'', hash: ''0xb9e0...'' },
                                { date: ''2025-12-16'', action: ''Executor fee transferred (2%)'', by: ''Contract'', hash: ''0x3a7f...'' },
                                { date: ''2025-12-16'', action: ''Will decryption authorized'', by: ''Contract'', hash: ''0x9c2e...'' },
                            ].map((entry, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: ''16px 24px'', background: COLORS.slate, border: `1px solid ${COLORS.border}`, display: ''flex'', alignItems: ''center'', gap: 24, marginBottom: 2 }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'', minWidth: 100 }}>{entry.date}</div>
                                    <div style={{ fontSize: 13, color: COLORS.ivory, flex: 1 }}>{entry.action}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted }}>by {entry.by}</div>
                                    <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: ''monospace'' }}>{entry.hash}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\ExecutorDashboardScreen.tsx'), $content, $enc)

# --- LandingScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { useNavigate } from ''react-router-dom'';
import { motion, AnimatePresence } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

type ConnectStep = ''idle'' | ''connecting'' | ''connected'';
const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export function LandingScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [connectStep, setConnectStep] = useState<ConnectStep>(''idle'');
    const [showConnect, setShowConnect] = useState(false);

    const handleConnect = () => {
        setConnectStep(''connecting'');
        setTimeout(() => { setConnectStep(''connected''); setTimeout(() => navigate(''/owner''), 1400); }, 2000);
    };

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, overflowX: ''hidden'' }}>
            <div style={{ position: ''fixed'', inset: 0, pointerEvents: ''none'', zIndex: 0, backgroundImage: `linear-gradient(${COLORS.border}18 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border}18 1px, transparent 1px)`, backgroundSize: ''80px 80px'' }} />

            {/* Nav */}
            <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: ''fixed'', top: 0, left: 0, right: 0, zIndex: 100, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'', background: `${COLORS.obsidian}e8`, backdropFilter: ''blur(12px)'', borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: ''flex'', alignItems: ''center'', gap: 32 }}>
                    {[[''How It Works'', ''#how''], [''Features'', ''#features''], [''Security'', ''#security'']].map(([label, href]) => (
                        <a key={label} href={href} style={{ fontSize: 11, color: COLORS.muted, textDecoration: ''none'', letterSpacing: 1.5, textTransform: ''uppercase'' }}>{label}</a>
                    ))}
                    <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => setShowConnect(true)} style={{ padding: ''10px 24px'', background: COLORS.gold, color: COLORS.obsidian, border: ''none'', fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                        Connect Wallet
                    </motion.button>
                </div>
            </motion.nav>

            {/* Hero */}
            <section style={{ position: ''relative'', zIndex: 1, minHeight: ''100vh'', display: ''flex'', alignItems: ''center'', padding: ''120px 48px 80px'', maxWidth: 1200, margin: ''0 auto'' }}>
                <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 640 }}>
                    <motion.div variants={fade} style={{ display: ''inline-flex'', alignItems: ''center'', gap: 10, padding: ''6px 16px'', border: `1px solid ${COLORS.goldDim}`, marginBottom: 32, fontSize: 11, color: COLORS.gold, letterSpacing: 2, textTransform: ''uppercase'' }}>
                        <span style={{ width: 6, height: 6, borderRadius: ''50%'', background: COLORS.green, display: ''inline-block'' }} />
                        OP_NET Testnet - Bitcoin Layer 1
                    </motion.div>
                    <motion.h1 variants={fade} style={{ fontFamily: FONTS.heading, fontSize: ''clamp(48px, 6vw, 84px)'', fontWeight: 600, lineHeight: 1.05, color: COLORS.ivory, marginBottom: 24, letterSpacing: -1, margin: ''0 0 24px'' }}>
                        Your Bitcoin.<br />Your Legacy.<br /><span style={{ color: COLORS.gold }}>On-Chain.</span>
                    </motion.h1>
                    <motion.p variants={fade} style={{ fontSize: 17, color: COLORS.muted, lineHeight: 1.9, marginBottom: 48, fontWeight: 300, maxWidth: 520 }}>
                        A death-triggered Bitcoin inheritance vault. Deploy a smart contract, register your lawyer and beneficiaries, encrypt your will. Your estate executes exactly as written - trustlessly, on Bitcoin.
                    </motion.p>
                    <motion.div variants={fade} style={{ display: ''flex'', gap: 16, flexWrap: ''wrap'' }}>
                        <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={() => setShowConnect(true)} style={{ padding: ''16px 40px'', background: COLORS.gold, color: COLORS.obsidian, border: ''none'', fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                            Create Your Vault
                        </motion.button>
                        <a href="#how" style={{ padding: ''16px 40px'', background: ''transparent'', color: COLORS.ivory, border: `1px solid ${COLORS.border}`, fontFamily: FONTS.body, fontSize: 12, fontWeight: 400, letterSpacing: 1.5, textTransform: ''uppercase'', textDecoration: ''none'', display: ''inline-block'' }}>
                            Learn More
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.7 }} style={{ position: ''absolute'', right: 48, top: ''50%'', transform: ''translateY(-50%)'', display: ''flex'', flexDirection: ''column'', gap: 2 }} className="hero-stats">
                    {[{ label: ''Built on'', value: ''Bitcoin'', suffix: '' L1'' }, { label: ''Max beneficiaries'', value: ''7'', suffix: '''' }, { label: ''Unlock trigger'', value: ''Death'', suffix: '' only'' }, { label: ''Fiat conversion'', value: ''None'', suffix: '''' }].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }} style={{ padding: ''20px 24px'', border: `1px solid ${COLORS.border}`, background: COLORS.slate, minWidth: 200 }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.gold }}>{s.value}<span style={{ color: COLORS.muted, fontSize: 18 }}>{s.suffix}</span></div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* How It Works */}
            <section id="how" style={{ position: ''relative'', zIndex: 1, padding: ''100px 48px'', maxWidth: 1200, margin: ''0 auto'' }}>
                <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
                    <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>The Process</div>
                    <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600, margin: 0 }}>How It Works</h2>
                </motion.div>
                <div style={{ display: ''grid'', gridTemplateColumns: ''repeat(auto-fit, minmax(240px, 1fr))'', gap: 2 }}>
                    {[
                        { num: ''01'', title: ''Deploy Your Vault'', desc: ''Connect your Bitcoin wallet, register your lawyer-executor with a locked fee percentage, and add up to 7 beneficiaries with share percentages.'' },
                        { num: ''02'', title: ''Encrypt Your Will'', desc: "Upload your will and conditional clause documents. They are encrypted client-side with your lawyer''s public key. Only the SHA-256 hash is stored on-chain." },
                        { num: ''03'', title: ''Stay Active'', desc: "Check in every 3 or 6 months to prove you are alive. One tap resets the dead man''s switch. Miss 3 check-ins and the executor is automatically notified." },
                        { num: ''04'', title: ''Death Triggers Execution'', desc: ''Any party uploads a death certificate. A 72-hour dispute window opens. After confirmation, your lawyer decrypts the will and executes independent transfers.'' },
                    ].map((step, i) => (
                        <motion.div key={step.num} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ borderColor: COLORS.goldDim }} style={{ padding: ''40px 32px'', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 64, color: `${COLORS.gold}20`, lineHeight: 1, marginBottom: 24, fontWeight: 700 }}>{step.num}</div>
                            <h3 style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 12, fontWeight: 600 }}>{step.title}</h3>
                            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8, margin: 0 }}>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ position: ''relative'', zIndex: 1, padding: ''100px 48px'', borderTop: `1px solid ${COLORS.border}`, background: COLORS.slate }}>
                <div style={{ maxWidth: 1200, margin: ''0 auto'' }}>
                    <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
                        <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Built Different</div>
                        <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600, margin: 0 }}>Every Detail Matters</h2>
                    </motion.div>
                    <div style={{ display: ''grid'', gridTemplateColumns: ''repeat(auto-fit, minmax(300px, 1fr))'', gap: 16 }}>
                        {[
                            { tag: ''LAW'', title: ''Lawyer-Executor Model'', desc: ''Your lawyer is a registered on-chain executor. Their fee is locked at vault creation and paid automatically before any child receives anything.'' },
                            { tag: ''TXN'', title: ''Independent Transfers'', desc: "Each beneficiary''s transfer is a separate on-chain transaction. One disputed heir never blocks another. Completely asynchronous." },
                            { tag: ''INT'', title: ''Remote Signer Support'', desc: ''Overseas beneficiaries get a secure signing link. Hardware wallet support via PSBT. No simultaneous online requirement.'' },
                            { tag: ''IF'', title: ''Conditional Inheritance'', desc: ''Define conditions per beneficiary. Lawyer suspends, child appeals, lawyer decides. Failed appeals auto-redirect to charity after 30 days.'' },
                            { tag: ''DMS'', title: "Dead Man''s Switch", desc: ''Check in every 3 or 6 months. Miss 3 consecutive check-ins and the executor is notified automatically. One tap to reset.'' },
                            { tag: ''ENC'', title: ''Encrypted Will on Bitcoin'', desc: "Documents encrypted with your lawyer''s public key. Only SHA-256 hashes on-chain. Tamper-proof. Decryptable only after confirmed death." },
                        ].map((f, i) => (
                            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ borderColor: COLORS.goldDim, background: COLORS.obsidian }} style={{ padding: ''28px 24px'', border: `1px solid ${COLORS.border}`, background: COLORS.mid, transition: ''background 0.2s, border-color 0.2s'' }}>
                                <div style={{ fontSize: 10, color: COLORS.gold, letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>{f.tag}</div>
                                <h3 style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.ivory, marginBottom: 8, fontWeight: 600 }}>{f.title}</h3>
                                <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security */}
            <section id="security" style={{ position: ''relative'', zIndex: 1, padding: ''100px 48px'', maxWidth: 1200, margin: ''0 auto'' }}>
                <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 1fr'', gap: 64, alignItems: ''center'' }}>
                    <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Security Architecture</div>
                        <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600, marginBottom: 24 }}>Trustless by Design</h2>
                        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.9, marginBottom: 32 }}>VaultLegacy never holds your keys. Every critical action requires multiple on-chain signatures. The smart contract enforces all rules - no exceptions.</p>
                        <div style={{ display: ''flex'', flexDirection: ''column'', gap: 12 }}>
                            {[''AES-256 + RSA client-side encryption before any upload'', ''SHA-256 document hashes stored on Bitcoin Layer 1'', ''2-of-2 multisig per child transfer (lawyer + child)'', ''72-hour fraud dispute window on every death confirmation'', ''Charity fallback address locked at deployment'', ''No unlock date - death is the only trigger''].map((item, i) => (
                                <motion.div key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} style={{ display: ''flex'', gap: 12, alignItems: ''flex-start'' }}>
                                    <span style={{ color: COLORS.green, flexShrink: 0, fontSize: 12, fontWeight: 700, marginTop: 1 }}>OK</span>
                                    <span style={{ fontSize: 13, color: COLORS.ivory }}>{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: ''flex'', flexDirection: ''column'', gap: 2 }}>
                        {[{ role: ''Owner'', sees: ''Full balance, all parties, all history'', color: COLORS.gold }, { role: ''Executor'', sees: ''Full balance, will (after death), all transfers'', color: COLORS.goldLight }, { role: ''Beneficiary'', sees: ''Share percentage only while owner is alive'', color: COLORS.green }, { role: ''At Distribution'', sees: ''Each child sees only their own BTC amount'', color: COLORS.muted }].map((r) => (
                            <div key={r.role} style={{ padding: ''20px 24px'', background: COLORS.slate, border: `1px solid ${COLORS.border}`, display: ''flex'', justifyContent: ''space-between'', alignItems: ''flex-start'', gap: 16 }}>
                                <div style={{ fontSize: 13, color: r.color, fontWeight: 500, minWidth: 120 }}>{r.role}</div>
                                <div style={{ fontSize: 12, color: COLORS.muted, textAlign: ''right'' }}>{r.sees}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ position: ''relative'', zIndex: 1, padding: ''80px 48px'', background: `${COLORS.gold}10`, borderTop: `1px solid ${COLORS.gold}40`, borderBottom: `1px solid ${COLORS.gold}40`, textAlign: ''center'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, marginBottom: 16 }}>Secure Your Legacy Today</div>
                <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32 }}>Deploy to OP_NET Testnet. Testnet BTC only. No mainnet risk.</div>
                <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={() => setShowConnect(true)} style={{ padding: ''18px 56px'', background: COLORS.gold, color: COLORS.obsidian, border: ''none'', fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                    Connect Wallet and Begin
                </motion.button>
            </motion.section>

            {/* Footer */}
            <footer style={{ position: ''relative'', zIndex: 1, padding: ''40px 48px'', borderTop: `1px solid ${COLORS.border}`, display: ''flex'', justifyContent: ''space-between'', alignItems: ''center'', flexWrap: ''wrap'', gap: 16 }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 18, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>Built on Bitcoin - OP_NET Testnet - BTC only</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>No fiat. No dates. No compromise.</div>
            </footer>

            {/* Wallet Modal */}
            <AnimatePresence>
                {showConnect && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: ''fixed'', inset: 0, zIndex: 200, background: ''rgba(0,0,0,0.88)'', display: ''flex'', alignItems: ''center'', justifyContent: ''center'', padding: 24 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.gold}`, padding: 48, maxWidth: 480, width: ''100%'', position: ''relative'' }}>
                            <button onClick={() => { setShowConnect(false); setConnectStep(''idle''); }} style={{ position: ''absolute'', top: 16, right: 20, background: ''none'', border: ''none'', color: COLORS.muted, cursor: ''pointer'', fontSize: 22 }}>X</button>

                            {connectStep === ''idle'' && (<>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 8 }}>Connect Wallet</div>
                                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>VaultLegacy uses self-sovereign identity. No email, no password. Your Bitcoin wallet is your key.</div>
                                <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={handleConnect} style={{ width: ''100%'', padding: ''20px 24px'', background: COLORS.mid, border: `1px solid ${COLORS.goldDim}`, color: COLORS.ivory, display: ''flex'', alignItems: ''center'', gap: 16, cursor: ''pointer'', marginBottom: 12, textAlign: ''left'' }}>
                                    <div style={{ width: 36, height: 36, border: `1px solid ${COLORS.gold}`, display: ''flex'', alignItems: ''center'', justifyContent: ''center'', flexShrink: 0 }}><div style={{ width: 14, height: 14, background: COLORS.gold }} /></div>
                                    <div><div style={{ fontSize: 14, fontWeight: 500, color: COLORS.ivory, marginBottom: 2 }}>OP_WALLET</div><div style={{ fontSize: 11, color: COLORS.muted }}>Official OPNet wallet - Recommended</div></div>
                                    <span style={{ marginLeft: ''auto'', fontSize: 10, color: COLORS.obsidian, background: COLORS.gold, padding: ''3px 8px'', fontWeight: 600 }}>REQUIRED</span>
                                </motion.button>
                                <div style={{ padding: ''12px 16px'', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, fontSize: 11, color: COLORS.muted, lineHeight: 1.7 }}>OP_NET Testnet only. Connects to Bitcoin testnet - no real BTC is used or at risk.</div>
                            </>)}

                            {connectStep === ''connecting'' && (
                                <div style={{ textAlign: ''center'', padding: ''24px 0'' }}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: ''linear'' }} style={{ width: 48, height: 48, margin: ''0 auto 24px'', border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: ''50%'' }} />
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.ivory, marginBottom: 8 }}>Connecting...</div>
                                    <div style={{ fontSize: 13, color: COLORS.muted }}>Approve the connection in your wallet</div>
                                </div>
                            )}

                            {connectStep === ''connected'' && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: ''center'', padding: ''24px 0'' }}>
                                    <div style={{ width: 56, height: 56, margin: ''0 auto 20px'', border: `2px solid ${COLORS.green}`, borderRadius: ''50%'', display: ''flex'', alignItems: ''center'', justifyContent: ''center'' }}>
                                        <div style={{ fontSize: 20, color: COLORS.green, fontWeight: 700, fontFamily: FONTS.heading }}>OK</div>
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 8 }}>Wallet Connected</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: ''monospace'', marginBottom: 8 }}>bc1powner123abc456def789...</div>
                                    <div style={{ fontSize: 13, color: COLORS.green }}>Redirecting to dashboard...</div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`@media (max-width: 768px) { .hero-stats { display: none !important; } }`}</style>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\LandingScreen.tsx'), $content, $enc)

# --- OwnerDashboardScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { useNavigate } from ''react-router-dom'';
import { motion, AnimatePresence } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

const MOCK_VAULT = {
    id: ''vault-001'',
    name: ''Johnson Family Estate'',
    status: ''ACTIVE'',
    balance: ''1.842 BTC'',
    beneficiaryCount: 3,
    lastCheckIn: 42,
    nextCheckInDays: 48,
    checkInFrequencyDays: 90,
    executor: { name: ''James Okafor, Esq.'', fee: 2 },
    pendingTopUp: true,
    willAttached: true,
    allPartiesRegistered: true,
    executorConfirmed: true,
    beneficiaries: [
        { name: ''Adaeze Johnson'', share: 35, location: ''Lagos, Nigeria'', isRemote: false, status: ''ACTIVE'' },
        { name: ''Chukwuemeka Johnson'', share: 35, location: ''London, UK'', isRemote: true, status: ''ACTIVE'' },
        { name: ''Ngozi Johnson'', share: 30, location: ''Lagos, Nigeria'', isRemote: false, status: ''ACTIVE'' },
    ],
    depositHistory: [
        { type: ''Deposit'', date: ''2025-11-14'', amount: ''1.500 BTC'', lawyerAck: true },
        { type: ''Top-up'', date: ''2025-12-02'', amount: ''0.342 BTC'', lawyerAck: false },
    ],
};

export function OwnerDashboardScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkedIn, setCheckedIn] = useState(false);
    const vault = MOCK_VAULT;
    const progressPct = Math.round(((vault.checkInFrequencyDays - vault.nextCheckInDays) / vault.checkInFrequencyDays) * 100);

    const handleCheckIn = () => {
        setCheckingIn(true);
        setTimeout(() => { setCheckingIn(false); setCheckedIn(true); }, 1500);
    };

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'', background: COLORS.obsidian }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: ''flex'', gap: 24, alignItems: ''center'' }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>Owner Dashboard</span>
                    <div style={{ width: 8, height: 8, borderRadius: ''50%'', background: COLORS.green }} />
                    <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'' }}>bc1p...f789</span>
                    <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={() => navigate(''/create'')} style={{ padding: ''8px 20px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                        New Vault
                    </motion.button>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: ''0 auto'', padding: ''40px 48px'' }}>
                {/* Dead Man''s Switch Banner */}
                <AnimatePresence>
                    {!checkedIn && (
                        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} style={{ marginBottom: 32, padding: ''20px 28px'', background: `${COLORS.gold}12`, border: `1px solid ${COLORS.gold}60`, display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'', gap: 24, flexWrap: ''wrap'' }}>
                            <div>
                                <div style={{ fontSize: 11, color: COLORS.gold, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 6 }}>Dead Man''s Switch</div>
                                <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 8 }}>
                                    Check-in due in <strong style={{ color: COLORS.gold }}>{vault.nextCheckInDays} days</strong> - Last confirmed {vault.lastCheckIn} days ago
                                </div>
                                <div style={{ width: 300, height: 3, background: COLORS.border, borderRadius: 2 }}>
                                    <div style={{ height: ''100%'', width: `${progressPct}%`, background: progressPct > 70 ? COLORS.red : COLORS.gold, borderRadius: 2, transition: ''width 0.5s'' }} />
                                </div>
                            </div>
                            <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.97 }} onClick={handleCheckIn} disabled={checkingIn} style={{ padding: ''14px 32px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                                {checkingIn ? ''Confirming...'' : ''Check In Now''}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {checkedIn && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32, padding: ''20px 28px'', background: `${COLORS.green}12`, border: `1px solid ${COLORS.green}60`, display: ''flex'', alignItems: ''center'', gap: 16 }}>
                        <div style={{ fontSize: 11, color: COLORS.green, textTransform: ''uppercase'', letterSpacing: 2 }}>Checked In</div>
                        <div style={{ fontSize: 14, color: COLORS.ivory }}>Check-in confirmed on-chain. Next check-in due in 90 days.</div>
                    </motion.div>
                )}

                {/* Pending Top-Up Alert */}
                {vault.pendingTopUp && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32, padding: ''16px 24px'', background: `${COLORS.red}10`, border: `1px solid ${COLORS.red}50`, display: ''flex'', alignItems: ''center'', gap: 16 }}>
                        <div style={{ width: 8, height: 8, borderRadius: ''50%'', background: COLORS.red, flexShrink: 0 }} />
                        <div style={{ fontSize: 13, color: COLORS.ivory }}>Top-up of <strong style={{ color: COLORS.gold }}>0.342 BTC</strong> pending executor acknowledgment</div>
                        <button onClick={() => navigate(''/deposits'')} style={{ marginLeft: ''auto'', fontSize: 11, color: COLORS.gold, background: ''none'', border: `1px solid ${COLORS.goldDim}`, padding: ''6px 14px'', cursor: ''pointer'', textTransform: ''uppercase'', letterSpacing: 1 }}>View</button>
                    </motion.div>
                )}

                <div style={{ display: ''grid'', gridTemplateColumns: ''1fr 340px'', gap: 32 }}>
                    {/* Left */}
                    <div style={{ display: ''flex'', flexDirection: ''column'', gap: 24 }}>
                        {/* Vault Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''32px'' }}>
                            <div style={{ display: ''flex'', justifyContent: ''space-between'', alignItems: ''flex-start'', marginBottom: 28 }}>
                                <div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 8 }}>Estate Vault</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>{vault.name}</div>
                                </div>
                                <div style={{ padding: ''4px 12px'', background: `${COLORS.green}20`, border: `1px solid ${COLORS.green}50`, fontSize: 11, color: COLORS.green, letterSpacing: 1.5 }}>ACTIVE</div>
                            </div>
                            <div style={{ display: ''grid'', gridTemplateColumns: ''repeat(3, 1fr)'', gap: 2 }}>
                                {[
                                    { label: ''BTC Balance'', value: vault.balance, color: COLORS.gold },
                                    { label: ''Beneficiaries'', value: vault.beneficiaryCount.toString(), color: COLORS.ivory },
                                    { label: ''Executor Fee'', value: `${vault.executor.fee}%`, color: COLORS.goldLight },
                                ].map((s) => (
                                    <div key={s.label} style={{ padding: ''16px 20px'', background: COLORS.mid }}>
                                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: s.color }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Beneficiaries */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''28px 32px'' }}>
                            <div style={{ fontSize: 13, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 20 }}>Beneficiaries</div>
                            <div style={{ display: ''flex'', flexDirection: ''column'', gap: 10 }}>
                                {vault.beneficiaries.map((b) => (
                                    <div key={b.name} style={{ display: ''flex'', alignItems: ''center'', gap: 16, padding: ''14px 18px'', background: COLORS.mid, border: `1px solid ${COLORS.border}` }}>
                                        <div style={{ padding: ''3px 10px'', background: b.isRemote ? `${COLORS.green}20` : `${COLORS.gold}20`, border: `1px solid ${b.isRemote ? COLORS.green : COLORS.goldDim}`, fontSize: 10, color: b.isRemote ? COLORS.green : COLORS.gold, letterSpacing: 1, flexShrink: 0 }}>
                                            {b.isRemote ? ''REMOTE'' : ''LOCAL''}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, color: COLORS.ivory, marginBottom: 2 }}>{b.name}</div>
                                            <div style={{ fontSize: 11, color: COLORS.muted }}>{b.location}</div>
                                        </div>
                                        <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.gold }}>{b.share}%</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Executor */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''24px 32px'', display: ''flex'', alignItems: ''center'', gap: 24 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 6 }}>Executor</div>
                                <div style={{ fontSize: 15, color: COLORS.ivory }}>{vault.executor.name}</div>
                            </div>
                            <div style={{ padding: ''4px 14px'', background: `${COLORS.gold}15`, border: `1px solid ${COLORS.goldDim}`, fontSize: 12, color: COLORS.goldLight }}>
                                {vault.executor.fee}% fee locked
                            </div>
                        </motion.div>
                    </div>

                    {/* Right - Health + Actions */}
                    <div style={{ display: ''flex'', flexDirection: ''column'', gap: 16 }}>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''28px 24px'' }}>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 20 }}>Vault Health</div>
                            {[
                                { label: ''Will Attached'', ok: vault.willAttached },
                                { label: ''All Parties Registered'', ok: vault.allPartiesRegistered },
                                { label: ''Executor Confirmed'', ok: vault.executorConfirmed },
                                { label: ''Beneficiaries Signed'', ok: true },
                                { label: ''Charity Address Set'', ok: true },
                            ].map((item) => (
                                <div key={item.label} style={{ display: ''flex'', alignItems: ''center'', gap: 12, padding: ''10px 0'', borderBottom: `1px solid ${COLORS.border}` }}>
                                    <div style={{ width: 6, height: 6, borderRadius: ''50%'', background: item.ok ? COLORS.green : COLORS.red, flexShrink: 0 }} />
                                    <span style={{ fontSize: 13, color: item.ok ? COLORS.ivory : COLORS.muted }}>{item.label}</span>
                                    <span style={{ marginLeft: ''auto'', fontSize: 11, color: item.ok ? COLORS.green : COLORS.red }}>{item.ok ? ''OK'' : ''MISSING''}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.border}`, padding: ''24px'' }}>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1.5, marginBottom: 16 }}>Actions</div>
                            <div style={{ display: ''flex'', flexDirection: ''column'', gap: 8 }}>
                                {[{ label: ''Deposit History'', path: ''/deposits'' }, { label: ''Vault Certificate'', path: ''/certificate'' }, { label: ''Death Confirmation'', path: ''/death'' }].map((action) => (
                                    <motion.button key={action.label} whileHover={{ borderColor: COLORS.gold, color: COLORS.ivory }} onClick={() => navigate(action.path)} style={{ width: ''100%'', padding: ''12px 16px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, letterSpacing: 1, textTransform: ''uppercase'', cursor: ''pointer'', textAlign: ''left'', transition: ''all 0.2s'' }}>
                                        {action.label}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\OwnerDashboardScreen.tsx'), $content, $enc)

# --- SignTransferScreen.tsx ---
$content = @'
import { useState } from ''react'';
import { motion, AnimatePresence } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

export function SignTransferScreen(): React.ReactElement {
    const [step, setStep] = useState<''review'' | ''signing'' | ''done''>(''review'');
    const transfer = { beneficiary: ''Chukwuemeka Johnson'', amount: ''0.632 BTC'', share: 35, executor: ''James Okafor, Esq.'', estate: ''Johnson Family Estate'', address: ''bc1pchukwu789...k12d'', txId: null as string | null };

    const handleSign = () => {
        setStep(''signing'');
        setTimeout(() => setStep(''done''), 2200);
    };

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, display: ''flex'', alignItems: ''center'', justifyContent: ''center'', padding: 24 }}>
            <div style={{ maxWidth: 560, width: ''100%'' }}>
                <div style={{ textAlign: ''center'', marginBottom: 48 }}>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2 }}>Inheritance Transfer Signing</div>
                </div>

                <AnimatePresence mode="wait">
                    {step === ''review'' && (
                        <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ background: COLORS.slate, border: `1px solid ${COLORS.gold}`, padding: ''40px'', marginBottom: 24 }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 8 }}>Transfer For</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 32 }}>{transfer.beneficiary}</div>

                                <div style={{ textAlign: ''center'', padding: ''32px'', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, marginBottom: 32 }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Your Inheritance</div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 64, color: COLORS.gold, lineHeight: 1 }}>{transfer.amount}</div>
                                    <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 8 }}>{transfer.share}% of net estate after executor fee</div>
                                </div>

                                <div style={{ display: ''flex'', flexDirection: ''column'', gap: 2, marginBottom: 32 }}>
                                    {[
                                        { label: ''Estate'', value: transfer.estate },
                                        { label: ''Executor'', value: transfer.executor },
                                        { label: ''Destination Wallet'', value: transfer.address },
                                        { label: ''Network'', value: ''OP_NET Testnet - Bitcoin L1'' },
                                    ].map((row) => (
                                        <div key={row.label} style={{ padding: ''12px 16px'', background: COLORS.mid, display: ''flex'', justifyContent: ''space-between'', alignItems: ''center'', gap: 16 }}>
                                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 1 }}>{row.label}</div>
                                            <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: row.label === ''Destination Wallet'' ? ''monospace'' : FONTS.body, textAlign: ''right'', maxWidth: 240, wordBreak: ''break-all'' }}>{row.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.7, marginBottom: 28, padding: ''14px 16px'', background: COLORS.mid, border: `1px solid ${COLORS.border}` }}>
                                    By signing, you authorize this transfer from the estate vault to your wallet. This is a 2-of-2 multisig transaction - your signature completes the co-sign with your executor.
                                </div>

                                <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={handleSign} style={{ width: ''100%'', padding: ''20px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                                    Approve and Sign Transfer
                                </motion.button>
                            </div>

                            <div style={{ textAlign: ''center'', fontSize: 12, color: COLORS.muted, lineHeight: 1.7 }}>
                                This is a one-time action. Your signature is irreversible once submitted on-chain.
                            </div>
                        </motion.div>
                    )}

                    {step === ''signing'' && (
                        <motion.div key="signing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: ''center'', padding: ''80px 40px'', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: ''linear'' }} style={{ width: 56, height: 56, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: ''50%'', margin: ''0 auto 32px'' }} />
                            <div style={{ fontFamily: FONTS.heading, fontSize: 26, color: COLORS.ivory, marginBottom: 12 }}>Broadcasting Signature</div>
                            <div style={{ fontSize: 13, color: COLORS.muted }}>Submitting your co-signature to Bitcoin Layer 1...</div>
                        </motion.div>
                    )}

                    {step === ''done'' && (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: ''center'', padding: ''60px 40px'', background: COLORS.slate, border: `1px solid ${COLORS.green}` }}>
                            <div style={{ width: 64, height: 64, border: `2px solid ${COLORS.green}`, borderRadius: ''50%'', margin: ''0 auto 28px'', display: ''flex'', alignItems: ''center'', justifyContent: ''center'' }}>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.green, fontWeight: 700 }}>OK</div>
                            </div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory, marginBottom: 12 }}>Transfer Signed</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 40, color: COLORS.gold, marginBottom: 8 }}>{transfer.amount}</div>
                            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 32 }}>Transferring to your wallet on Bitcoin Layer 1</div>
                            <div style={{ padding: ''14px 20px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'', wordBreak: ''break-all'' }}>
                                TX: 0xa2f4c8d1e9b3...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\SignTransferScreen.tsx'), $content, $enc)

# --- VaultCertificateScreen.tsx ---
$content = @'
import { useRef } from ''react'';
import { motion } from ''framer-motion'';
import { COLORS, FONTS } from ''../utils/constants'';

const VAULT = {
    name: ''Johnson Family Estate'',
    contractAddress: ''bc1pq8k2l5mn3r7sv9tx0uw4xy6za8b1cd2ef3gh4ij5kl6mn7op8qr9st0uv1wx2yz3a4f7'',
    deployDate: ''2025-10-04'',
    txHash: ''0x8f2a4c1d9e3b5f7a2c4e6d8b0f2a4c1d9e3b5f7a2c4e6d8b0f2a4c1d'',
    executor: { name: ''James Okafor, Esq.'', fee: 2, address: ''bc1pe34a...k89j'' },
    beneficiaries: [
        { name: ''Adaeze Johnson'', share: 35, location: ''Lagos, Nigeria'' },
        { name: ''Chukwuemeka Johnson'', share: 35, location: ''London, UK'' },
        { name: ''Ngozi Johnson'', share: 30, location: ''Lagos, Nigeria'' },
    ],
    charity: { name: ''Lagos Children\''s Foundation'', address: ''bc1pcharity...x4z7'' },
    network: ''OP_NET Testnet - Bitcoin Layer 1'',
};

export function VaultCertificateScreen(): React.ReactElement {
    const certRef = useRef<HTMLDivElement>(null);

    return (
        <div style={{ minHeight: ''100vh'', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body }}>
            <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: ''20px 48px'', display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: ''flex'', gap: 12 }}>
                    <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} style={{ padding: ''10px 28px'', background: COLORS.gold, border: ''none'', color: COLORS.obsidian, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                        Download PDF
                    </motion.button>
                    <motion.button whileHover={{ borderColor: COLORS.gold }} style={{ padding: ''10px 20px'', background: ''none'', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 12, letterSpacing: 1.5, textTransform: ''uppercase'', cursor: ''pointer'' }}>
                        Share
                    </motion.button>
                </div>
            </div>

            <div style={{ maxWidth: 860, margin: ''0 auto'', padding: ''48px'' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 12 }}>Estate Documentation</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.ivory }}>Vault Certificate</div>
                    <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 8 }}>This certificate confirms the on-chain deployment of your inheritance vault. Include with your traditional will for estate readiness.</div>
                </motion.div>

                {/* Certificate */}
                <motion.div ref={certRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.gold}`, padding: ''56px'' }}>
                    {/* Certificate header */}
                    <div style={{ textAlign: ''center'', marginBottom: 48, paddingBottom: 40, borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 13, letterSpacing: 6, color: COLORS.muted, textTransform: ''uppercase'', marginBottom: 16 }}>Certificate of Estate Vault Deployment</div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 40, color: COLORS.ivory, marginBottom: 8 }}>{VAULT.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.gold, letterSpacing: 2 }}>Deployed {VAULT.deployDate} - {VAULT.network}</div>
                    </div>

                    {/* Contract */}
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 10 }}>Contract Address</div>
                        <div style={{ fontSize: 12, color: COLORS.gold, fontFamily: ''monospace'', padding: ''14px 18px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, wordBreak: ''break-all'', lineHeight: 1.6 }}>{VAULT.contractAddress}</div>
                    </div>

                    <div style={{ marginBottom: 36 }}>
                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 10 }}>Deployment Transaction</div>
                        <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'', padding: ''12px 18px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, wordBreak: ''break-all'' }}>{VAULT.txHash}</div>
                    </div>

                    {/* Executor */}
                    <div style={{ marginBottom: 36, padding: ''24px'', background: COLORS.mid, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 14 }}>Executor</div>
                        <div style={{ display: ''flex'', justifyContent: ''space-between'', alignItems: ''center'' }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.ivory }}>{VAULT.executor.name}</div>
                            <div style={{ padding: ''4px 14px'', background: `${COLORS.gold}18`, border: `1px solid ${COLORS.goldDim}`, fontSize: 12, color: COLORS.goldLight }}>{VAULT.executor.fee}% fee - locked at deployment</div>
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'', marginTop: 8 }}>{VAULT.executor.address}</div>
                    </div>

                    {/* Beneficiaries */}
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 14 }}>Beneficiaries</div>
                        <div style={{ display: ''flex'', flexDirection: ''column'', gap: 2 }}>
                            {VAULT.beneficiaries.map((b) => (
                                <div key={b.name} style={{ padding: ''16px 20px'', background: COLORS.mid, border: `1px solid ${COLORS.border}`, display: ''flex'', alignItems: ''center'', justifyContent: ''space-between'' }}>
                                    <div>
                                        <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 2 }}>{b.name}</div>
                                        <div style={{ fontSize: 11, color: COLORS.muted }}>{b.location}</div>
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.gold }}>{b.share}%</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Charity */}
                    <div style={{ marginBottom: 40, padding: ''16px 20px'', background: COLORS.mid, border: `1px solid ${COLORS.red}40` }}>
                        <div style={{ fontSize: 10, color: COLORS.red, textTransform: ''uppercase'', letterSpacing: 2, marginBottom: 8 }}>Charity Fallback</div>
                        <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 4 }}>{VAULT.charity.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: ''monospace'' }}>{VAULT.charity.address}</div>
                    </div>

                    {/* Footer seal */}
                    <div style={{ textAlign: ''center'', paddingTop: 32, borderTop: `1px solid ${COLORS.border}` }}>
                        <div style={{ width: 64, height: 64, border: `2px solid ${COLORS.gold}`, borderRadius: ''50%'', margin: ''0 auto 16px'', display: ''flex'', alignItems: ''center'', justifyContent: ''center'' }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 11, color: COLORS.gold, letterSpacing: 1, textAlign: ''center'', lineHeight: 1.4 }}>VL<br />SEAL</div>
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1.5 }}>VAULTLEGACY - TRUSTLESS INHERITANCE ON BITCOIN</div>
                        <div style={{ fontSize: 11, color: COLORS.mutedDark, marginTop: 6 }}>This certificate is cryptographically bound to Bitcoin Layer 1. Verify at any time using the contract address above.</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

'@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src\screens\VaultCertificateScreen.tsx'), $content, $enc)

Write-Host 'All 10 screens written successfully' -ForegroundColor Green