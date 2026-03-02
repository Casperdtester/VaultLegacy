import { useState } from 'react';
import { COLORS, FONTS, formatSharePercent } from '../utils/constants';
import { Card, SectionHeading, GoldButton, Divider } from '../components/layout/UI';
import { MOCK_VAULT } from '../data/mockData';

export function VaultCertificateScreen(): React.ReactElement {
    const vault = MOCK_VAULT;
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleDownload = (): void => {
        setDownloading(true);
        setTimeout(() => { setDownloading(false); setDownloaded(true); }, 1800);
    };

    return (
        <div style={{ padding: '48px 48px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
                <SectionHeading subtitle="Estate-ready documentation for inclusion in a traditional will">
                    Vault Certificate
                </SectionHeading>
                <GoldButton onClick={handleDownload} disabled={downloading}>
                    {downloading ? 'âŸ³ Generating PDF...' : downloaded ? 'âœ“ Downloaded' : 'Download PDF'}
                </GoldButton>
            </div>

            {/* Certificate preview */}
            <div style={{
                border: `2px solid ${COLORS.gold}`,
                padding: 0,
                background: COLORS.slate,
                position: 'relative',
            }}>
                {/* Gold corner accents */}
                {[
                    { top: -1, left: -1 }, { top: -1, right: -1 },
                    { bottom: -1, left: -1 }, { bottom: -1, right: -1 },
                ].map((pos, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: 20, height: 20,
                        background: COLORS.gold, ...pos,
                    }} />
                ))}

                <div style={{ padding: '56px 64px' }}>
                    {/* Certificate header */}
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 13, color: COLORS.muted, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>
                            Certificate of Deployment
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 48, fontWeight: 700, color: COLORS.ivory, lineHeight: 1, marginBottom: 8 }}>
                            VAULT<span style={{ color: COLORS.gold }}>LEGACY</span>
                        </div>
                        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.muted, letterSpacing: 2 }}>
                            BITCOIN INHERITANCE VAULT Â· OP_NET TESTNET
                        </div>
                    </div>

                    <Divider />

                    {/* Vault identity */}
                    <div style={{ textAlign: 'center', margin: '40px 0' }}>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                            Vault Name
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.ivory }}>
                            {vault.name}
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                            Deployed {vault.deployedAt}
                        </div>
                    </div>

                    <Divider />

                    {/* Contract details */}
                    <div style={{ margin: '32px 0' }}>
                        <div style={{ display: 'grid', gap: 20 }}>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                                    Contract Address (OP_NET Testnet)
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: 13, color: COLORS.gold, wordBreak: 'break-all' }}>
                                    {vault.contractAddress}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                                    Deployment Transaction Hash
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: 13, color: COLORS.ivory, wordBreak: 'break-all' }}>
                                    a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Executor */}
                    <div style={{ margin: '32px 0' }}>
                        <div style={{ fontSize: 10, color: COLORS.goldLight, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
                            Executor / Lawyer
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>Name</div>
                                <div style={{ fontSize: 15, color: COLORS.ivory }}>{vault.executor.name}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>Fee</div>
                                <div style={{ fontSize: 15, color: COLORS.goldLight }}>{formatSharePercent(vault.executor.feePercent)}</div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>Bitcoin Address</div>
                                <div style={{ fontFamily: 'monospace', fontSize: 12, color: COLORS.ivory, wordBreak: 'break-all' }}>{vault.executor.address}</div>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Beneficiaries */}
                    <div style={{ margin: '32px 0' }}>
                        <div style={{ fontSize: 10, color: COLORS.goldLight, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
                            Registered Beneficiaries
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {vault.beneficiaries.map((b, i) => (
                                <div key={b.id} style={{
                                    display: 'grid', gridTemplateColumns: '32px 1fr 100px',
                                    alignItems: 'center', gap: 16,
                                    padding: '12px 16px', background: COLORS.mid,
                                    border: `1px solid ${COLORS.border}`,
                                }}>
                                    <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: FONTS.body }}>{i + 1}.</div>
                                    <div>
                                        <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 2 }}>{b.name}</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.muted, wordBreak: 'break-all' }}>{b.address}</div>
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.gold, textAlign: 'right' }}>
                                        {formatSharePercent(b.sharePercent)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Divider />

                    {/* Will hash */}
                    <div style={{ margin: '32px 0' }}>
                        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                            On-Chain Document Hashes
                        </div>
                        <div style={{ display: 'grid', gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 4 }}>Will Document (SHA-256)</div>
                                <div style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.ivory, wordBreak: 'break-all' }}>{vault.willHash}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 4 }}>Conditional Clause (SHA-256)</div>
                                <div style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.ivory, wordBreak: 'break-all' }}>{vault.clauseHash}</div>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Footer */}
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 13, color: COLORS.muted, lineHeight: 1.8 }}>
                            This certificate documents the on-chain deployment of a Bitcoin inheritance vault.<br />
                            Verify at any time using the contract address above on OP_NET Testnet.<br />
                            This document should be included with traditional estate documentation.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


