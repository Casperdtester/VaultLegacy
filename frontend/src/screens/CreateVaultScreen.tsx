import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, formatSharePercent } from '../utils/constants';
import { GoldButton, Card, Divider, CharityRow } from '../components/layout/UI';
import type {
    VaultWizardState, Beneficiary, WizardStep3Data, CheckInFrequency,
} from '../types/index.js';

const STEPS = [
    'Connect Wallet',
    'Name Vault',
    'Add Parties',
    'Upload Will',
    'Deploy',
] as const;

const INITIAL_STATE: VaultWizardState = {
    step: 1,
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
};

function StepIndicator({ current }: { readonly current: number }): React.ReactElement {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 48 }}>
            {STEPS.map((label, i) => {
                const stepNum = i + 1;
                const done = stepNum < current;
                const active = stepNum === current;
                return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 36, height: 36,
                                border: `1px solid ${done || active ? COLORS.gold : COLORS.border}`,
                                background: done ? COLORS.gold : active ? `${COLORS.gold}20` : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14,
                                color: done ? COLORS.obsidian : active ? COLORS.gold : COLORS.muted,
                                fontFamily: FONTS.body, fontWeight: 500,
                                flexShrink: 0,
                            }}>
                                {done ? 'âœ“' : stepNum}
                            </div>
                            <div style={{
                                fontSize: 10, color: active ? COLORS.gold : COLORS.muted,
                                textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap',
                                fontFamily: FONTS.body,
                            }}>
                                {label}
                            </div>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{
                                flex: 1, height: 1, background: done ? COLORS.gold : COLORS.border,
                                marginBottom: 28,
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function InputField({
    label, value, onChange, placeholder, type = 'text', hint,
}: {
    readonly label: string;
    readonly value: string;
    readonly onChange: (v: string) => void;
    readonly placeholder?: string;
    readonly type?: string;
    readonly hint?: string;
}): React.ReactElement {
    return (
        <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%', padding: '12px 16px',
                    background: COLORS.mid, border: `1px solid ${COLORS.border}`,
                    color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 14,
                    outline: 'none',
                }}
            />
            {hint && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}>{hint}</div>}
        </div>
    );
}

function Step1({ onNext }: { readonly onNext: () => void }): React.ReactElement {
    const [connected, setConnected] = useState(false);

    return (
        <div style={{ maxWidth: 480 }}>
            <h2 style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 12 }}>
                Connect Your Wallet
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, marginBottom: 36, lineHeight: 1.7 }}>
                VaultLegacy uses your Bitcoin wallet for self-sovereign identity. No email, no password. You are your key.
            </p>

            {!connected ? (
                <Card style={{ marginBottom: 24 }}>
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>â—ˆ</div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.ivory, marginBottom: 8 }}>
                            OP_WALLET
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 24 }}>
                            The official OPNet wallet. Required for testnet interaction.
                        </div>
                        <GoldButton onClick={() => setConnected(true)}>
                            Connect OP_WALLET
                        </GoldButton>
                    </div>
                </Card>
            ) : (
                <Card accent="green" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.green, flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 12, color: COLORS.green, marginBottom: 4 }}>Wallet Connected</div>
                            <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                bc1powner123abc456def789ghi012jkl345mno678pqr901stu234...
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <GoldButton onClick={onNext} disabled={!connected} fullWidth>
                Continue â†’
            </GoldButton>
        </div>
    );
}

function Step2({
    vaultName, setVaultName, onNext, onBack,
}: {
    readonly vaultName: string;
    readonly setVaultName: (v: string) => void;
    readonly onNext: () => void;
    readonly onBack: () => void;
}): React.ReactElement {
    return (
        <div style={{ maxWidth: 480 }}>
            <h2 style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 12 }}>
                Name Your Vault
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, marginBottom: 36, lineHeight: 1.7 }}>
                This name appears on your vault certificate and all party communications. Make it clear and formal.
            </p>
            <InputField
                label="Vault Name"
                value={vaultName}
                onChange={setVaultName}
                placeholder="e.g. Johnson Family Estate"
            />
            <div style={{ display: 'flex', gap: 12 }}>
                <GoldButton onClick={onBack} variant="ghost">â† Back</GoldButton>
                <GoldButton onClick={onNext} disabled={vaultName.trim().length === 0} fullWidth>
                    Continue â†’
                </GoldButton>
            </div>
        </div>
    );
}

function Step3({
    data, onChange, onNext, onBack,
}: {
    readonly data: Partial<WizardStep3Data>;
    readonly onChange: (d: Partial<WizardStep3Data>) => void;
    readonly onNext: () => void;
    readonly onBack: () => void;
}): React.ReactElement {
    const [lawyerName, setLawyerName] = useState(data.executor?.name ?? '');
    const [lawyerAddr, setLawyerAddr] = useState(data.executor?.address ?? '');
    const [lawyerLoc, setLawyerLoc] = useState(data.executor?.location ?? '');
    const [lawyerFee, setLawyerFee] = useState(String(data.executor?.feePercent ?? ''));
    const [charityName, setCharityName] = useState(data.charity?.name ?? '');
    const [charityAddr, setCharityAddr] = useState(data.charity?.address ?? '');
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(
        data.beneficiaries ? [...data.beneficiaries] : [],
    );
    const [bName, setBName] = useState('');
    const [bAddr, setBAddr] = useState('');
    const [bCountry, setBCountry] = useState('');
    const [bShare, setBShare] = useState('');

    const totalShare = beneficiaries.reduce((sum, b) => sum + b.sharePercent, 0);
    const remaining = 10000 - totalShare;

    const addBeneficiary = (): void => {
        if (!bName || !bAddr || !bCountry || !bShare) return;
        const shareNum = Math.round(parseFloat(bShare) * 100);
        if (shareNum <= 0 || totalShare + shareNum > 10000) return;
        const isRemote = bCountry.toLowerCase() !== 'nigeria';
        const newBene: Beneficiary = {
            id: `bene-${Date.now()}`,
            name: bName, address: bAddr, country: bCountry,
            sharePercent: shareNum, status: 'ACTIVE', isRemote,
        };
        setBeneficiaries((prev) => [...prev, newBene]);
        setBName(''); setBAddr(''); setBCountry(''); setBShare('');
    };

    const removeBeneficiary = (id: string): void => {
        setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    };

    const handleNext = (): void => {
        onChange({
            executor: { name: lawyerName, address: lawyerAddr, location: lawyerLoc, feePercent: Number(lawyerFee) },
            beneficiaries,
            charity: { name: charityName, address: charityAddr },
        });
        onNext();
    };

    const canProceed =
        lawyerName && lawyerAddr && lawyerFee && charityName && charityAddr &&
        beneficiaries.length > 0 && totalShare === 10000;

    return (
        <div style={{ maxWidth: 680 }}>
            <h2 style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 12 }}>
                Add Parties
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, marginBottom: 36, lineHeight: 1.7 }}>
                Register your executor (lawyer) and up to 7 beneficiaries. Share percentages must total exactly 100%.
            </p>

            <div style={{ fontSize: 13, color: COLORS.goldLight, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
                Executor / Lawyer
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
                <InputField label="Full Name / Firm" value={lawyerName} onChange={setLawyerName} placeholder="Adeyemi Okonkwo & Associates" />
                <InputField label="Bitcoin Address" value={lawyerAddr} onChange={setLawyerAddr} placeholder="bc1p..." />
                <InputField label="Location" value={lawyerLoc} onChange={setLawyerLoc} placeholder="Lagos, Nigeria" />
                <InputField label="Fee %" value={lawyerFee} onChange={setLawyerFee} type="number" placeholder="2" hint="Percentage of vault at time of death. E.g. 2 = 2%" />
            </div>

            <Divider />

            <div style={{ fontSize: 13, color: COLORS.goldLight, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
                Beneficiaries
                <span style={{ marginLeft: 16, color: remaining === 0 ? COLORS.green : COLORS.gold, fontFamily: FONTS.body, fontSize: 12 }}>
                    {remaining === 0 ? 'âœ“ 100% allocated' : `${(remaining / 100).toFixed(2)}% remaining`}
                </span>
            </div>

            {beneficiaries.map((b) => (
                <div key={b.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    background: COLORS.mid, border: `1px solid ${COLORS.border}`, marginBottom: 8,
                }}>
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: COLORS.ivory, marginRight: 8 }}>{b.name}</span>
                        {b.isRemote && <span style={{ fontSize: 11, color: COLORS.green }}>ðŸŒ Remote Signer</span>}
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold }}>
                        {formatSharePercent(b.sharePercent)}
                    </div>
                    <button onClick={() => removeBeneficiary(b.id)} style={{
                        background: 'none', border: 'none', color: COLORS.red, cursor: 'pointer', fontSize: 16,
                    }}>Ã—</button>
                </div>
            ))}

            {beneficiaries.length < 7 && (
                <div style={{ padding: 16, border: `1px dashed ${COLORS.border}`, marginBottom: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px auto', gap: 8, alignItems: 'end' }}>
                        <div>
                            <label style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>Name</label>
                            <input value={bName} onChange={(e) => setBName(e.target.value)} placeholder="Full name" style={{ width: '100%', padding: '8px 10px', background: COLORS.obsidian, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>Bitcoin Address</label>
                            <input value={bAddr} onChange={(e) => setBAddr(e.target.value)} placeholder="bc1p..." style={{ width: '100%', padding: '8px 10px', background: COLORS.obsidian, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>Country</label>
                            <input value={bCountry} onChange={(e) => setBCountry(e.target.value)} placeholder="Nigeria" style={{ width: '100%', padding: '8px 10px', background: COLORS.obsidian, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>Share %</label>
                            <input value={bShare} onChange={(e) => setBShare(e.target.value)} type="number" placeholder="35" style={{ width: '100%', padding: '8px 10px', background: COLORS.obsidian, border: `1px solid ${COLORS.border}`, color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, outline: 'none' }} />
                        </div>
                        <button onClick={addBeneficiary} style={{
                            padding: '9px 14px', background: COLORS.gold, border: 'none', color: COLORS.obsidian,
                            fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>+</button>
                    </div>
                </div>
            )}

            <Divider />

            <div style={{ fontSize: 13, color: COLORS.red, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                Charity Fallback
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
                <InputField label="Charity Name" value={charityName} onChange={setCharityName} placeholder="African Children Education Fund" />
                <InputField label="Bitcoin Address" value={charityAddr} onChange={setCharityAddr} placeholder="bc1p..." hint="Locked at deployment. Cannot change without both signatures." />
            </div>

            {charityAddr && <CharityRow name={charityName || 'Unnamed Charity'} address={charityAddr} />}

            <Divider />

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <GoldButton onClick={onBack} variant="ghost">â† Back</GoldButton>
                <GoldButton onClick={handleNext} disabled={!canProceed} fullWidth>
                    Continue â†’
                </GoldButton>
            </div>
        </div>
    );
}

function Step4({
    onNext, onBack,
}: {
    readonly onNext: () => void;
    readonly onBack: () => void;
}): React.ReactElement {
    const [willFile, setWillFile] = useState('');
    const [clauseFile, setClauseFile] = useState('');
    const [encrypting, setEncrypting] = useState(false);
    const [encrypted, setEncrypted] = useState(false);

    const simulateEncrypt = (): void => {
        setEncrypting(true);
        setTimeout(() => {
            setEncrypting(false);
            setEncrypted(true);
        }, 2200);
    };

    return (
        <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 12 }}>
                Upload Will & Conditions
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, marginBottom: 36, lineHeight: 1.7 }}>
                Documents are encrypted client-side with the executor's public key before upload. Only the SHA-256 hash is stored on-chain. The executor cannot decrypt until death is confirmed and the dispute window closes.
            </p>

            <Card style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Will Document</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <label style={{
                        padding: '10px 20px', border: `1px solid ${COLORS.border}`,
                        color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, cursor: 'pointer',
                        background: COLORS.mid,
                    }}>
                        Select PDF / DOCX
                        <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={(e) => setWillFile(e.target.files?.[0]?.name ?? '')} />
                    </label>
                    {willFile && <span style={{ fontSize: 12, color: COLORS.green }}>âœ“ {willFile}</span>}
                </div>
            </Card>

            <Card style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Conditional Clause Document</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <label style={{
                        padding: '10px 20px', border: `1px solid ${COLORS.border}`,
                        color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, cursor: 'pointer',
                        background: COLORS.mid,
                    }}>
                        Select PDF / DOCX
                        <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={(e) => setClauseFile(e.target.files?.[0]?.name ?? '')} />
                    </label>
                    {clauseFile && <span style={{ fontSize: 12, color: COLORS.green }}>âœ“ {clauseFile}</span>}
                </div>
            </Card>

            {!encrypted && (
                <GoldButton
                    onClick={simulateEncrypt}
                    disabled={!willFile || !clauseFile || encrypting}
                    fullWidth
                >
                    {encrypting ? 'ðŸ”’ Encrypting Client-Side...' : 'Encrypt & Hash Documents'}
                </GoldButton>
            )}

            {encrypted && (
                <Card accent="green" style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 12, color: COLORS.green, marginBottom: 12 }}>âœ“ Encryption Complete</div>
                    <div style={{ display: 'grid', gap: 8 }}>
                        <div>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Will SHA-256 Hash</div>
                            <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                a3f4b2c1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Clause SHA-256 Hash</div>
                            <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <GoldButton onClick={onBack} variant="ghost">â† Back</GoldButton>
                <GoldButton onClick={onNext} disabled={!encrypted} fullWidth>Continue â†’</GoldButton>
            </div>
        </div>
    );
}

function Step5({
    freq, setFreq, onDeploy, onBack, deploying, deployed,
}: {
    readonly freq: CheckInFrequency;
    readonly setFreq: (f: CheckInFrequency) => void;
    readonly onDeploy: () => void;
    readonly onBack: () => void;
    readonly deploying: boolean;
    readonly deployed: boolean;
}): React.ReactElement {
    return (
        <div style={{ maxWidth: 540 }}>
            <h2 style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 12 }}>
                Deploy Vault
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, marginBottom: 36, lineHeight: 1.7 }}>
                Set your dead man's switch frequency, then deploy to OP_NET Testnet. Death is the only unlock trigger â€” no calendar date.
            </p>

            <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
                    Check-In Frequency
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {(['3months', '6months'] as const).map((f) => (
                        <div
                            key={f}
                            onClick={() => setFreq(f)}
                            style={{
                                padding: '20px', cursor: 'pointer',
                                border: `1px solid ${freq === f ? COLORS.gold : COLORS.border}`,
                                background: freq === f ? `${COLORS.gold}10` : COLORS.mid,
                            }}
                        >
                            <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: freq === f ? COLORS.gold : COLORS.ivory, marginBottom: 4 }}>
                                {f === '3months' ? '3 Months' : '6 Months'}
                            </div>
                            <div style={{ fontSize: 12, color: COLORS.muted }}>
                                ~{f === '3months' ? '13,140' : '26,280'} blocks
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}>
                                {f === '3months' ? 'More frequent check-ins, earlier alert.' : 'Less frequent, more flexibility.'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {!deployed && (
                <div style={{ display: 'flex', gap: 12 }}>
                    <GoldButton onClick={onBack} variant="ghost">â† Back</GoldButton>
                    <GoldButton onClick={onDeploy} disabled={deploying} fullWidth>
                        {deploying ? 'âŸ³ Deploying to Testnet...' : 'Deploy Vault Contract'}
                    </GoldButton>
                </div>
            )}

            {deployed && (
                <Card accent="gold">
                    <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.gold, marginBottom: 16 }}>
                        âœ“ Vault Deployed
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Contract Address</div>
                        <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            bc1p4x9hq3z7k2m8n5t6w0y1a3b5c7d9e2f4g6h8j0k2l4m6n8p0q2r4s6t8u0v
                        </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Transaction Hash</div>
                        <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <GoldButton onClick={() => window.location.href = '/certificate'} variant="ghost">
                            Download Certificate
                        </GoldButton>
                        <GoldButton onClick={() => window.location.href = '/owner'} fullWidth>
                            Go to Dashboard â†’
                        </GoldButton>
                    </div>
                </Card>
            )}
        </div>
    );
}

export function CreateVaultScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [state, setState] = useState<VaultWizardState>(INITIAL_STATE);
    const [deploying, setDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [freq, setFreq] = useState<CheckInFrequency>('3months');

    const setStep = (step: number): void => setState((s) => ({ ...s, step }));

    const simulateDeploy = (): void => {
        setDeploying(true);
        setTimeout(() => { setDeploying(false); setDeployed(true); }, 3000);
    };

    return (
        <div style={{ padding: '48px 48px', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 12 }}>
                <button
                    onClick={() => navigate('/owner')}
                    style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', fontFamily: FONTS.body, fontSize: 12 }}
                >
                    â† Back to Dashboard
                </button>
            </div>

            <div style={{ fontFamily: FONTS.heading, fontSize: 42, fontWeight: 600, color: COLORS.ivory, marginBottom: 6 }}>
                Create Vault
            </div>
            <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 48 }}>
                Deploy a Bitcoin inheritance vault to OP_NET Testnet
            </div>

            <StepIndicator current={state.step} />

            {state.step === 1 && <Step1 onNext={() => setStep(2)} />}
            {state.step === 2 && (
                <Step2
                    vaultName={state.step2.vaultName ?? ''}
                    setVaultName={(v) => setState((s) => ({ ...s, step2: { vaultName: v } }))}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                />
            )}
            {state.step === 3 && (
                <Step3
                    data={state.step3}
                    onChange={(d) => setState((s) => ({ ...s, step3: d }))}
                    onNext={() => setStep(4)}
                    onBack={() => setStep(2)}
                />
            )}
            {state.step === 4 && <Step4 onNext={() => setStep(5)} onBack={() => setStep(3)} />}
            {state.step === 5 && (
                <Step5
                    freq={freq}
                    setFreq={setFreq}
                    onDeploy={simulateDeploy}
                    onBack={() => setStep(4)}
                    deploying={deploying}
                    deployed={deployed}
                />
            )}
        </div>
    );
}


