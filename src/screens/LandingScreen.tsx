import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../utils/constants';

type ConnectStep = 'idle' | 'connecting' | 'connected';

export function LandingScreen(): React.ReactElement {
    const navigate = useNavigate();
    const [connectStep, setConnectStep] = useState<ConnectStep>('idle');
    const [showConnect, setShowConnect] = useState(false);

    const handleConnect = (): void => {
        setConnectStep('connecting');
        setTimeout(() => {
            setConnectStep('connected');
            setTimeout(() => navigate('/owner'), 1200);
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: COLORS.obsidian,
            color: COLORS.ivory,
            fontFamily: FONTS.body,
            overflowX: 'hidden',
        }}>
            {/* Subtle grid texture */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                backgroundImage: `
                    linear-gradient(${COLORS.border}18 1px, transparent 1px),
                    linear-gradient(90deg, ${COLORS.border}18 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
            }} />

            {/* Top nav */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '20px 48px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: `${COLORS.obsidian}e0`,
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${COLORS.border}`,
            }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
                    VAULT<span style={{ color: COLORS.gold }}>LEGACY</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <a href="#how" style={{ fontSize: 12, color: COLORS.muted, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }}>How It Works</a>
                    <a href="#features" style={{ fontSize: 12, color: COLORS.muted, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }}>Features</a>
                    <a href="#security" style={{ fontSize: 12, color: COLORS.muted, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }}>Security</a>
                    <button
                        onClick={() => setShowConnect(true)}
                        style={{
                            padding: '10px 24px',
                            background: COLORS.gold,
                            color: COLORS.obsidian,
                            border: 'none',
                            fontFamily: FONTS.body,
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                        }}
                    >
                        Connect Wallet
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                position: 'relative', zIndex: 1,
                minHeight: '100vh',
                display: 'flex', alignItems: 'center',
                padding: '120px 48px 80px',
                maxWidth: 1200, margin: '0 auto',
            }}>
                <div style={{ maxWidth: 680 }}>
                    {/* Eyebrow */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '6px 14px',
                        border: `1px solid ${COLORS.goldDim}`,
                        marginBottom: 32,
                        fontSize: 11, color: COLORS.gold, letterSpacing: 2, textTransform: 'uppercase',
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.green, display: 'inline-block' }} />
                        OP_NET Testnet Â· Bitcoin Layer 1
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontFamily: FONTS.heading,
                        fontSize: 'clamp(48px, 6vw, 84px)',
                        fontWeight: 600,
                        lineHeight: 1.05,
                        color: COLORS.ivory,
                        marginBottom: 24,
                        letterSpacing: -1,
                    }}>
                        Your Bitcoin.<br />
                        Your Legacy.<br />
                        <span style={{ color: COLORS.gold }}>On-Chain.</span>
                    </h1>

                    <p style={{
                        fontSize: 18,
                        color: COLORS.muted,
                        lineHeight: 1.8,
                        marginBottom: 48,
                        fontWeight: 300,
                        maxWidth: 520,
                    }}>
                        A death-triggered Bitcoin inheritance vault. Deploy a smart contract, register your lawyer and beneficiaries, encrypt your will. Your estate executes exactly as written â€” trustlessly, on Bitcoin.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowConnect(true)}
                            style={{
                                padding: '16px 40px',
                                background: COLORS.gold,
                                color: COLORS.obsidian,
                                border: 'none',
                                fontFamily: FONTS.body,
                                fontSize: 13,
                                fontWeight: 600,
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                            }}
                        >
                            Create Your Vault â†’
                        </button>
                        <a
                            href="#how"
                            style={{
                                padding: '16px 40px',
                                background: 'transparent',
                                color: COLORS.ivory,
                                border: `1px solid ${COLORS.border}`,
                                fontFamily: FONTS.body,
                                fontSize: 13,
                                fontWeight: 400,
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                display: 'inline-block',
                            }}
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Right side â€” stats */}
                <div style={{
                    position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)',
                    display: 'flex', flexDirection: 'column', gap: 2,
                }}
                    className="hero-stats"
                >
                    {[
                        { label: 'Built on', value: 'Bitcoin', suffix: ' L1' },
                        { label: 'Max beneficiaries', value: '7', suffix: '' },
                        { label: 'Unlock trigger', value: 'Death', suffix: ' only' },
                        { label: 'Fiat conversion', value: 'None', suffix: '' },
                    ].map((s) => (
                        <div key={s.label} style={{
                            padding: '20px 24px',
                            border: `1px solid ${COLORS.border}`,
                            background: COLORS.slate,
                            minWidth: 200,
                        }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
                                {s.label}
                            </div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.gold }}>
                                {s.value}<span style={{ color: COLORS.muted, fontSize: 18 }}>{s.suffix}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how" style={{
                position: 'relative', zIndex: 1,
                padding: '100px 48px',
                maxWidth: 1200, margin: '0 auto',
            }}>
                <div style={{ marginBottom: 64 }}>
                    <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                        The Process
                    </div>
                    <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600 }}>
                        How It Works
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
                    {[
                        {
                            num: '01',
                            title: 'Deploy Your Vault',
                            desc: 'Connect your Bitcoin wallet, register your lawyer-executor with a locked fee percentage, and add up to 7 beneficiaries with share percentages.',
                        },
                        {
                            num: '02',
                            title: 'Encrypt Your Will',
                            desc: 'Upload your will and conditional clause documents. They are encrypted client-side with your lawyer\'s public key. Only the SHA-256 hash is stored on-chain.',
                        },
                        {
                            num: '03',
                            title: 'Stay Active',
                            desc: 'Check in every 3 or 6 months to prove you are alive. One tap resets the dead man\'s switch. Miss 3 check-ins and the executor is automatically notified.',
                        },
                        {
                            num: '04',
                            title: 'Death Triggers Execution',
                            desc: 'Any party uploads a death certificate. A 72-hour dispute window opens. After confirmation, your lawyer decrypts the will and executes independent transfers.',
                        },
                    ].map((step) => (
                        <div key={step.num} style={{
                            padding: '40px 32px',
                            background: COLORS.slate,
                            border: `1px solid ${COLORS.border}`,
                            position: 'relative',
                        }}>
                            <div style={{
                                fontFamily: FONTS.heading,
                                fontSize: 64,
                                color: `${COLORS.gold}20`,
                                lineHeight: 1,
                                marginBottom: 24,
                                fontWeight: 700,
                            }}>
                                {step.num}
                            </div>
                            <h3 style={{
                                fontFamily: FONTS.heading,
                                fontSize: 24,
                                color: COLORS.ivory,
                                marginBottom: 12,
                                fontWeight: 600,
                            }}>
                                {step.title}
                            </h3>
                            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8 }}>
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{
                position: 'relative', zIndex: 1,
                padding: '100px 48px',
                borderTop: `1px solid ${COLORS.border}`,
                background: COLORS.slate,
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ marginBottom: 64 }}>
                        <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                            Built Different
                        </div>
                        <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600 }}>
                            Every Detail Matters
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                        {[
                            { icon: 'âš–', title: 'Lawyer-Executor Model', desc: 'Your lawyer is a registered on-chain executor. Their fee is locked at vault creation and paid automatically before any child receives anything.' },
                            { icon: 'â—ˆ', title: 'Independent Transfers', desc: 'Each beneficiary\'s transfer is a separate on-chain transaction. One disputed heir never blocks another. Completely asynchronous.' },
                            { icon: 'ðŸŒ', title: 'Remote Signer Support', desc: 'Overseas beneficiaries get a secure signing link. Hardware wallet support via PSBT. No simultaneous online requirement.' },
                            { icon: 'âš‘', title: 'Conditional Inheritance', desc: 'Define conditions per beneficiary. Lawyer suspends, child appeals, lawyer decides. Failed appeals auto-redirect to charity after 30 days.' },
                            { icon: 'â—‰', title: 'Dead Man\'s Switch', desc: 'Check in every 3 or 6 months. Miss 3 consecutive check-ins and the executor is notified automatically. One tap to reset.' },
                            { icon: 'â—»', title: 'Encrypted Will on Bitcoin', desc: 'Documents encrypted with your lawyer\'s public key. Only SHA-256 hashes on-chain. Tamper-proof. Decryptable only after confirmed death.' },
                        ].map((f) => (
                            <div key={f.title} style={{
                                padding: '28px 24px',
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.mid,
                            }}>
                                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                                <h3 style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.ivory, marginBottom: 8, fontWeight: 600 }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security */}
            <section id="security" style={{
                position: 'relative', zIndex: 1,
                padding: '100px 48px',
                maxWidth: 1200, margin: '0 auto',
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                            Security Architecture
                        </div>
                        <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600, marginBottom: 24 }}>
                            Trustless by Design
                        </h2>
                        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.9, marginBottom: 32 }}>
                            VaultLegacy never holds your keys. Every critical action requires multiple on-chain signatures. The smart contract enforces all rules â€” no exceptions.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                'AES-256 + RSA client-side encryption before any upload',
                                'SHA-256 document hashes stored on Bitcoin Layer 1',
                                '2-of-2 multisig per child transfer (lawyer + child)',
                                '72-hour fraud dispute window on every death confirmation',
                                'Charity fallback address locked at deployment',
                                'No unlock date â€” death is the only trigger',
                            ].map((item) => (
                                <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <span style={{ color: COLORS.green, marginTop: 2, flexShrink: 0 }}>âœ“</span>
                                    <span style={{ fontSize: 13, color: COLORS.ivory }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                            { role: 'Owner', sees: 'Full balance, all parties, all history', color: COLORS.gold },
                            { role: 'Executor', sees: 'Full balance, will (after death), all transfers', color: COLORS.goldLight },
                            { role: 'Beneficiary', sees: 'Share % only while owner is alive', color: COLORS.green },
                            { role: 'At Distribution', sees: 'Each child sees only their own BTC amount', color: COLORS.muted },
                        ].map((r) => (
                            <div key={r.role} style={{
                                padding: '20px 24px',
                                background: COLORS.slate,
                                border: `1px solid ${COLORS.border}`,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
                            }}>
                                <div style={{ fontSize: 13, color: r.color, fontWeight: 500, minWidth: 100 }}>{r.role}</div>
                                <div style={{ fontSize: 12, color: COLORS.muted, textAlign: 'right' }}>{r.sees}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{
                position: 'relative', zIndex: 1,
                padding: '80px 48px',
                background: `${COLORS.gold}10`,
                borderTop: `1px solid ${COLORS.gold}40`,
                borderBottom: `1px solid ${COLORS.gold}40`,
                textAlign: 'center',
            }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, marginBottom: 16 }}>
                    Secure Your Legacy Today
                </div>
                <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32 }}>
                    Deploy to OP_NET Testnet. Testnet BTC only. No mainnet risk.
                </div>
                <button
                    onClick={() => setShowConnect(true)}
                    style={{
                        padding: '18px 56px',
                        background: COLORS.gold,
                        color: COLORS.obsidian,
                        border: 'none',
                        fontFamily: FONTS.body,
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                    }}
                >
                    Connect Wallet & Begin
                </button>
            </section>

            {/* Footer */}
            <footer style={{
                position: 'relative', zIndex: 1,
                padding: '40px 48px',
                borderTop: `1px solid ${COLORS.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
            }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 18, letterSpacing: 2 }}>
                    VAULT<span style={{ color: COLORS.gold }}>LEGACY</span>
                </div>
                <div style={{ fontSize: 12, color: COLORS.mutedDark }}>
                    Built on Bitcoin Â· OP_NET Testnet Â· BTC only
                </div>
                <div style={{ fontSize: 12, color: COLORS.mutedDark }}>
                    No fiat. No dates. No compromise.
                </div>
            </footer>

            {/* Wallet Connect Modal */}
            {showConnect && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: 'rgba(0,0,0,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 24,
                }}>
                    <div style={{
                        background: COLORS.slate,
                        border: `1px solid ${COLORS.gold}`,
                        padding: 48,
                        maxWidth: 480,
                        width: '100%',
                        position: 'relative',
                    }}>
                        <button
                            onClick={() => { setShowConnect(false); setConnectStep('idle'); }}
                            style={{
                                position: 'absolute', top: 16, right: 16,
                                background: 'none', border: 'none',
                                color: COLORS.muted, cursor: 'pointer', fontSize: 20,
                            }}
                        >
                            Ã—
                        </button>

                        {connectStep === 'idle' && (
                            <>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 8 }}>
                                    Connect Wallet
                                </div>
                                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>
                                    VaultLegacy uses self-sovereign identity. No email, no password. Your Bitcoin wallet is your key.
                                </div>

                                <button
                                    onClick={handleConnect}
                                    style={{
                                        width: '100%',
                                        padding: '20px 24px',
                                        background: COLORS.mid,
                                        border: `1px solid ${COLORS.gold}`,
                                        color: COLORS.ivory,
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        cursor: 'pointer',
                                        marginBottom: 12,
                                        textAlign: 'left',
                                    }}
                                >
                                    <span style={{ fontSize: 28 }}>â—ˆ</span>
                                    <div>
                                        <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 500, color: COLORS.ivory, marginBottom: 2 }}>
                                            OP_WALLET
                                        </div>
                                        <div style={{ fontSize: 11, color: COLORS.muted }}>
                                            Official OPNet wallet Â· Recommended
                                        </div>
                                    </div>
                                    <span style={{
                                        marginLeft: 'auto', fontSize: 10, color: COLORS.obsidian,
                                        background: COLORS.gold, padding: '2px 8px',
                                    }}>
                                        REQUIRED
                                    </span>
                                </button>

                                <div style={{
                                    padding: '12px 16px',
                                    background: `${COLORS.gold}08`,
                                    border: `1px solid ${COLORS.goldDim}`,
                                    fontSize: 11, color: COLORS.muted, lineHeight: 1.7,
                                }}>
                                    OP_NET Testnet only. This connects to Bitcoin testnet â€” no real BTC is used or at risk.
                                </div>
                            </>
                        )}

                        {connectStep === 'connecting' && (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <div style={{
                                    width: 56, height: 56, margin: '0 auto 24px',
                                    border: `2px solid ${COLORS.border}`,
                                    borderTop: `2px solid ${COLORS.gold}`,
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                }} />
                                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.ivory, marginBottom: 8 }}>
                                    Connecting...
                                </div>
                                <div style={{ fontSize: 13, color: COLORS.muted }}>
                                    Approve the connection in your wallet
                                </div>
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        )}

                        {connectStep === 'connected' && (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <div style={{ fontSize: 56, marginBottom: 16, color: COLORS.green }}>âœ“</div>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 8 }}>
                                    Wallet Connected
                                </div>
                                <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'monospace', marginBottom: 8 }}>
                                    bc1powner123abc456def789...
                                </div>
                                <div style={{ fontSize: 13, color: COLORS.green }}>
                                    Redirecting to dashboard...
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .hero-stats { display: none !important; }
                }
            `}</style>
        </div>
    );
}


