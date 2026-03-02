import { useState } from 'react';
import { COLORS, FONTS, blocksToApproxDays } from '../utils/constants.js';
import { Card, SectionHeading, GoldButton } from '../components/layout/UI';
import { MOCK_APPEAL, MOCK_VAULT_EXECUTING, CURRENT_BLOCK } from '../data/mockData.js';

export function AppealScreen(): React.ReactElement {
    const appeal = MOCK_APPEAL;
    const vault = MOCK_VAULT_EXECUTING;
    const [evidenceFile, setEvidenceFile] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const deadlineBlock = appeal.deadlineBlock;
    const blocksLeft = deadlineBlock > CURRENT_BLOCK ? deadlineBlock - CURRENT_BLOCK : 0n;
    const daysLeft = blocksToApproxDays(blocksLeft);
    const isExpired = blocksLeft === 0n;

    if (submitted) {
        return (
            <div style={{ padding: '48px 40px', maxWidth: 680, margin: '0 auto' }}>
                <Card accent="gold">
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>â—ˆ</div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.gold, marginBottom: 12 }}>
                            Evidence Submitted
                        </div>
                        <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, maxWidth: 400, margin: '0 auto' }}>
                            Your evidence has been submitted on-chain and the executor has been notified. You will be contacted once a decision is made.
                        </div>
                        <div style={{ marginTop: 24, fontSize: 12, color: COLORS.muted }}>
                            File: <span style={{ color: COLORS.ivory }}>{evidenceFile}</span>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '48px 40px', maxWidth: 680, margin: '0 auto' }}>
            <SectionHeading subtitle="Submit evidence to contest your suspension">
                Inheritance Appeal
            </SectionHeading>

            {/* Suspension notice */}
            <Card accent="red" style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                    âš‘ Your Share Is Suspended
                </div>
                <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.ivory, marginBottom: 8 }}>
                    {appeal.beneficiaryName}
                </div>
                <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>
                    {appeal.suspensionReason}
                </div>
            </Card>

            {/* Countdown */}
            <div style={{
                padding: '20px 24px', marginBottom: 20,
                border: `1px solid ${isExpired ? COLORS.red : daysLeft < 7 ? COLORS.gold : COLORS.border}`,
                background: isExpired ? `${COLORS.red}08` : COLORS.mid,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
            }}>
                <div>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                        {isExpired ? 'Appeal Window' : 'Appeal Window Closes'}
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: isExpired ? COLORS.red : daysLeft < 7 ? COLORS.gold : COLORS.ivory }}>
                        {isExpired ? 'Expired' : `${daysLeft} days`}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                        Deadline Block
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory }}>
                        {deadlineBlock.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>
                        Current block: {CURRENT_BLOCK.toLocaleString()}
                    </div>
                </div>
            </div>

            {isExpired ? (
                <Card accent="red">
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ fontSize: 14, color: COLORS.red, marginBottom: 8 }}>Appeal Window Has Expired</div>
                        <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>
                            The 30-day appeal window has closed. Your share has been automatically redirected to the charity fallback address on-chain. This is irreversible.
                        </div>
                        <div style={{ marginTop: 16, fontSize: 12, color: COLORS.muted }}>
                            Charity: <span style={{ color: COLORS.ivory }}>{vault.charity.name}</span>
                        </div>
                    </div>
                </Card>
            ) : (
                <>
                    {/* What you can submit */}
                    <Card style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 13, color: COLORS.ivory, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                            Acceptable Evidence
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                'Court dismissal or acquittal documentation',
                                'Rehabilitation certificate',
                                'Character references from verified parties',
                                'Legal correspondence disproving the violation',
                                'Notarised statutory declaration',
                            ].map((item) => (
                                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <span style={{ color: COLORS.gold, marginTop: 1 }}>â—ˆ</span>
                                    <span style={{ fontSize: 13, color: COLORS.muted }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Upload */}
                    <Card accent="gold" style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 13, color: COLORS.ivory, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                            Upload Evidence Document
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <label style={{
                                padding: '12px 24px', border: `1px solid ${COLORS.gold}`,
                                color: COLORS.gold, fontFamily: FONTS.body, fontSize: 13, cursor: 'pointer',
                                background: `${COLORS.gold}10`,
                            }}>
                                Choose File (PDF, DOCX)
                                <input type="file" accept=".pdf,.docx" style={{ display: 'none' }}
                                    onChange={(e) => setEvidenceFile(e.target.files?.[0]?.name ?? '')} />
                            </label>
                            {evidenceFile && (
                                <span style={{ fontSize: 12, color: COLORS.green }}>âœ“ {evidenceFile}</span>
                            )}
                        </div>
                        {evidenceFile && (
                            <div style={{ marginTop: 16, padding: '12px 16px', background: COLORS.mid, border: `1px solid ${COLORS.border}` }}>
                                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                    Document Hash (SHA-256)
                                </div>
                                <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                    c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
                                </div>
                            </div>
                        )}
                    </Card>

                    <GoldButton
                        onClick={() => setSubmitted(true)}
                        disabled={!evidenceFile}
                        fullWidth
                    >
                        Submit Evidence On-Chain
                    </GoldButton>

                    <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: COLORS.mutedDark, lineHeight: 1.7 }}>
                        The evidence hash is recorded permanently on-chain. The executor will review and make a final decision. If no evidence is submitted before the deadline, your share is automatically redirected to charity.
                    </div>
                </>
            )}
        </div>
    );
}


