import { useState } from 'react';
import { COLORS, FONTS, formatBTC } from '../utils/constants.js';
import { Card, GoldButton } from '../components/layout/UI';
import { MOCK_VAULT_EXECUTING } from '../data/mockData.js';

export function SignTransferScreen(): React.ReactElement {
    const vault = MOCK_VAULT_EXECUTING;
    const executor = vault.executor;
    const lawyerFee = (vault.balanceAtDeathSatoshis * BigInt(executor.feePercent)) / 10000n;
    const netEstate = vault.balanceAtDeathSatoshis - lawyerFee;
    const me = vault.beneficiaries[1]!; // Amara â€” remote
    const myAmount = (netEstate * BigInt(me.sharePercent)) / 10000n;

    const [signed, setSigned] = useState(false);
    const [signing, setSigning] = useState(false);

    const handleSign = (): void => {
        setSigning(true);
        setTimeout(() => { setSigning(false); setSigned(true); }, 2000);
    };

    if (signed) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>âœ“</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.gold, marginBottom: 12 }}>
                        Signature Confirmed
                    </div>
                    <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, marginBottom: 32 }}>
                        Your co-signature has been submitted on-chain. The executor will finalise the transfer. <strong style={{ color: COLORS.ivory }}>{formatBTC(myAmount)}</strong> will arrive in your Bitcoin wallet once the transaction is broadcast.
                    </div>
                    <Card>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                            Sending To
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {me.address}
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ maxWidth: 480, width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.ivory, letterSpacing: 2, marginBottom: 4 }}>
                        VAULT<span style={{ color: COLORS.gold }}>LEGACY</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1 }}>BITCOIN INHERITANCE VAULT</div>
                </div>

                {/* Identity */}
                <Card style={{ marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        For
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory, marginBottom: 4 }}>
                        {me.name}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{me.country}</div>
                </Card>

                {/* BTC amount â€” large and prominent */}
                <Card accent="gold" style={{ marginBottom: 16, textAlign: 'center', padding: '40px 28px' }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
                        Your Inheritance
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 64, color: COLORS.gold, lineHeight: 1, marginBottom: 8 }}>
                        {formatBTC(myAmount)}
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.muted }}>
                        from the estate of {vault.name}
                    </div>
                </Card>

                {/* Executor info */}
                <Card style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                Authorised by Executor
                            </div>
                            <div style={{ fontSize: 14, color: COLORS.ivory }}>{executor.name}</div>
                            <div style={{ fontSize: 12, color: COLORS.muted }}>{executor.location}</div>
                        </div>
                        <div style={{ fontSize: 24, color: COLORS.gold }}>âš–</div>
                    </div>
                </Card>

                {/* Receiving address */}
                <Card style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                        Sending To Your Wallet
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {me.address}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>
                        Verify this is your wallet address before approving.
                    </div>
                </Card>

                {/* Sign button */}
                <GoldButton onClick={handleSign} disabled={signing} fullWidth>
                    {signing ? 'âŸ³ Submitting Signature...' : 'Approve & Sign'}
                </GoldButton>

                <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: COLORS.mutedDark }}>
                    This action is irreversible. Your signature authorises the BTC transfer.
                </div>
            </div>
        </div>
    );
}


