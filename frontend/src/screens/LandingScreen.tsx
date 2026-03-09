import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../utils/constants';
import { useWallet } from '../context/WalletContext';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export function LandingScreen(): React.ReactElement {
    const navigate = useNavigate();
    const { connect, connected, address, isConnecting, error, setRole } = useWallet();
    const [showModal, setShowModal] = useState(false);

    // If already connected — offer role selection
    const handleConnected = (role: 'owner' | 'executor' | 'beneficiary') => {
        setRole(role);
        const routes = { owner: '/owner', executor: '/executor', beneficiary: '/beneficiary' };
        navigate(routes[role]);
    };

    const handleConnect = async () => {
        await connect();
    };

    return (
        <div style={{ minHeight: '100vh', background: COLORS.obsidian, color: COLORS.ivory, fontFamily: FONTS.body, overflowX: 'hidden' }}>
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${COLORS.border}18 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border}18 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />

            {/* Nav */}
            <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${COLORS.obsidian}e8`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    {[['How It Works', '#how'], ['Features', '#features'], ['Security', '#security']].map(([label, href]) => (
                        <a key={label} href={href} style={{ fontSize: 11, color: COLORS.muted, textDecoration: 'none', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</a>
                    ))}
                    {connected ? (
                        <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => setShowModal(true)} style={{ padding: '10px 24px', background: COLORS.gold, color: COLORS.obsidian, border: 'none', fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                            Enter App
                        </motion.button>
                    ) : (
                        <motion.button whileHover={{ background: COLORS.goldLight }} onClick={() => setShowModal(true)} style={{ padding: '10px 24px', background: COLORS.gold, color: COLORS.obsidian, border: 'none', fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                            Connect Wallet
                        </motion.button>
                    )}
                </div>
            </motion.nav>

            {/* Hero */}
            <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
                <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 640 }}>
                    <motion.div variants={fade} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', border: `1px solid ${COLORS.goldDim}`, marginBottom: 32, fontSize: 11, color: COLORS.gold, letterSpacing: 2, textTransform: 'uppercase' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.green, display: 'inline-block' }} />
                        OP_NET Testnet - Bitcoin Layer 1
                    </motion.div>
                    <motion.h1 variants={fade} style={{ fontFamily: FONTS.heading, fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 600, lineHeight: 1.05, color: COLORS.ivory, marginBottom: 24, letterSpacing: -1, margin: '0 0 24px' }}>
                        Your Bitcoin.<br />Your Legacy.<br /><span style={{ color: COLORS.gold }}>On-Chain.</span>
                    </motion.h1>
                    <motion.p variants={fade} style={{ fontSize: 17, color: COLORS.muted, lineHeight: 1.9, marginBottom: 48, fontWeight: 300, maxWidth: 520 }}>
                        A death-triggered Bitcoin inheritance vault. Deploy a smart contract, register your lawyer and beneficiaries, encrypt your will. Your estate executes exactly as written - trustlessly, on Bitcoin.
                    </motion.p>
                    <motion.div variants={fade} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} style={{ padding: '16px 40px', background: COLORS.gold, color: COLORS.obsidian, border: 'none', fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
                            Create Your Vault
                        </motion.button>
                        <a href="#how" style={{ padding: '16px 40px', background: 'transparent', color: COLORS.ivory, border: `1px solid ${COLORS.border}`, fontFamily: FONTS.body, fontSize: 12, fontWeight: 400, letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
                            Learn More
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.7 }} style={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 2 }} className="hero-stats">
                    {[{ label: 'Built on', value: 'Bitcoin', suffix: ' L1' }, { label: 'Max beneficiaries', value: '7', suffix: '' }, { label: 'Unlock trigger', value: 'Death', suffix: ' only' }, { label: 'Fiat conversion', value: 'None', suffix: '' }].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }} style={{ padding: '20px 24px', border: `1px solid ${COLORS.border}`, background: COLORS.slate, minWidth: 200 }}>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.gold }}>{s.value}<span style={{ color: COLORS.muted, fontSize: 18 }}>{s.suffix}</span></div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* How It Works */}
            <section id="how" style={{ position: 'relative', zIndex: 1, padding: '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
                    <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>The Process</div>
                    <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600, margin: 0 }}>How It Works</h2>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
                    {[
                        { num: '01', title: 'Deploy Your Vault', desc: 'Connect your Bitcoin wallet, register your lawyer-executor with a locked fee percentage, and add up to 7 beneficiaries with share percentages.' },
                        { num: '02', title: 'Encrypt Your Will', desc: "Upload your will and conditional clause. Encrypted client-side with your lawyer's public key. Only the SHA-256 hash is stored on-chain." },
                        { num: '03', title: 'Stay Active', desc: "Check in every 3 or 6 months to prove you are alive. One tap resets the dead man's switch. Miss 3 check-ins and the executor is automatically notified." },
                        { num: '04', title: 'Death Triggers Execution', desc: 'Any party uploads a death certificate. A 72-hour dispute window opens. After confirmation, your lawyer decrypts the will and executes independent transfers.' },
                    ].map((step, i) => (
                        <motion.div key={step.num} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ borderColor: COLORS.goldDim }} style={{ padding: '40px 32px', background: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: 64, color: `${COLORS.gold}20`, lineHeight: 1, marginBottom: 24, fontWeight: 700 }}>{step.num}</div>
                            <h3 style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 12, fontWeight: 600 }}>{step.title}</h3>
                            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8, margin: 0 }}>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Security */}
            <section id="security" style={{ position: 'relative', zIndex: 1, padding: '100px 48px', maxWidth: 1200, margin: '0 auto', borderTop: `1px solid ${COLORS.border}` }}>
                <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div style={{ fontSize: 11, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Security Architecture</div>
                    <h2 style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, fontWeight: 600, marginBottom: 24 }}>Trustless by Design</h2>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2, marginTop: 32 }}>
                    {['AES-256 + RSA client-side encryption before any upload', 'SHA-256 document hashes stored on Bitcoin Layer 1', '2-of-2 multisig per child transfer (lawyer + child)', '72-hour fraud dispute window on every death confirmation', 'Charity fallback address locked at deployment', 'No unlock date - death is the only trigger'].map((item) => (
                        <div key={item} style={{ padding: '20px 24px', background: COLORS.slate, border: `1px solid ${COLORS.border}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <span style={{ color: COLORS.green, fontSize: 11, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>OK</span>
                            <span style={{ fontSize: 13, color: COLORS.ivory }}>{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ position: 'relative', zIndex: 1, padding: '80px 48px', background: `${COLORS.gold}10`, borderTop: `1px solid ${COLORS.gold}40`, borderBottom: `1px solid ${COLORS.gold}40`, textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.ivory, marginBottom: 16 }}>Secure Your Legacy Today</div>
                <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32 }}>Deploy to OP_NET Testnet. Testnet BTC only. No mainnet risk.</div>
                <motion.button whileHover={{ background: COLORS.goldLight }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} style={{ padding: '18px 56px', background: COLORS.gold, color: COLORS.obsidian, border: 'none', fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
                    Connect Wallet and Begin
                </motion.button>
            </motion.section>

            {/* Footer */}
            <footer style={{ position: 'relative', zIndex: 1, padding: '40px 48px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 18, letterSpacing: 3 }}>VAULT<span style={{ color: COLORS.gold }}>LEGACY</span></div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>Built on Bitcoin - OP_NET Testnet - BTC only</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>No fiat. No dates. No compromise.</div>
            </footer>

            {/* Wallet Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22 }} style={{ background: COLORS.slate, border: `1px solid ${COLORS.gold}`, padding: 48, maxWidth: 480, width: '100%', position: 'relative' }}>
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', fontSize: 22 }}>X</button>

                            {!connected ? (
                                <>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 8 }}>Connect Wallet</div>
                                    <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 32, lineHeight: 1.7 }}>
                                        VaultLegacy uses self-sovereign identity. Your OP_NET Bitcoin wallet is your key. No email, no password.
                                    </div>

                                    {error && (
                                        <div style={{ padding: '12px 16px', background: `${COLORS.red}12`, border: `1px solid ${COLORS.red}50`, fontSize: 12, color: COLORS.red, marginBottom: 16, lineHeight: 1.6 }}>
                                            {error}
                                            {error.includes('not installed') && (
                                                <div style={{ marginTop: 8 }}>
                                                    <a href="https://chromewebstore.google.com/detail/opwallet/pmbjpcmaaladnfpacpmhmnfmpklgbdjb" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, textDecoration: 'underline', fontSize: 11 }}>
                                                        Install OP_WALLET from Chrome Web Store
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <motion.button whileHover={{ borderColor: COLORS.gold }} onClick={handleConnect} disabled={isConnecting} style={{ width: '100%', padding: '20px 24px', background: COLORS.mid, border: `1px solid ${COLORS.goldDim}`, color: COLORS.ivory, display: 'flex', alignItems: 'center', gap: 16, cursor: isConnecting ? 'wait' : 'pointer', marginBottom: 12, textAlign: 'left' }}>
                                        {isConnecting ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 28, height: 28, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.gold}`, borderRadius: '50%', flexShrink: 0 }} />
                                        ) : (
                                            <div style={{ width: 36, height: 36, border: `1px solid ${COLORS.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <div style={{ width: 14, height: 14, background: COLORS.gold }} />
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.ivory, marginBottom: 2 }}>
                                                {isConnecting ? 'Connecting...' : 'OP_WALLET'}
                                            </div>
                                            <div style={{ fontSize: 11, color: COLORS.muted }}>
                                                {isConnecting ? 'Approve the connection in your wallet' : 'Official OP_NET wallet - Recommended'}
                                            </div>
                                        </div>
                                        {!isConnecting && <span style={{ marginLeft: 'auto', fontSize: 10, color: COLORS.obsidian, background: COLORS.gold, padding: '3px 8px', fontWeight: 600 }}>REQUIRED</span>}
                                    </motion.button>

                                    <div style={{ padding: '12px 16px', background: `${COLORS.gold}08`, border: `1px solid ${COLORS.goldDim}`, fontSize: 11, color: COLORS.muted, lineHeight: 1.7 }}>
                                        OP_NET Testnet only. Connects to Bitcoin testnet - no real BTC is used or at risk.
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 8 }}>Wallet Connected</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'monospace', marginBottom: 28, padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, wordBreak: 'break-all' }}>{address}</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>Enter as</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {([['owner', 'Owner - Create and manage vaults'], ['executor', 'Executor - Lawyer managing estates'], ['beneficiary', 'Beneficiary - View your inheritance']] as const).map(([r, desc]) => (
                                            <motion.button key={r} whileHover={{ borderColor: COLORS.gold, color: COLORS.ivory }} onClick={() => { setShowModal(false); handleConnected(r); }} style={{ padding: '16px 20px', background: COLORS.mid, border: `1px solid ${COLORS.border}`, color: COLORS.muted, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, textTransform: 'capitalize' }}>{r}</div>
                                                <div style={{ fontSize: 11 }}>{desc}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`@media (max-width: 768px) { .hero-stats { display: none !important; } }`}</style>
        </div>
    );
}
