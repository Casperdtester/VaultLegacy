import { COLORS, FONTS, STATUS_LABELS } from '../../utils/constants';
import type { BeneficiaryStatus, VaultStatus } from '../../types/index';

interface BeneficiaryChipProps {
    readonly name: string;
    readonly isRemote: boolean;
    readonly status: BeneficiaryStatus;
}

export function BeneficiaryChip({ name, isRemote, status }: BeneficiaryChipProps): React.ReactElement {
    const suspended = status === 'SUSPENDED' || status === 'REDIRECTED';
    const complete = status === 'COMPLETE';
    const escrowed = status === 'ESCROWED';

    let bg = `${COLORS.gold}18`;
    let border = COLORS.goldDim;
    let color = COLORS.gold;

    if (isRemote && !suspended && !complete && !escrowed) {
        bg = `${COLORS.green}18`;
        border = COLORS.green;
        color = COLORS.green;
    }
    if (suspended) { bg = `${COLORS.red}18`; border = COLORS.red; color = COLORS.red; }
    if (complete) { bg = `${COLORS.muted}18`; border = COLORS.mutedDark; color = COLORS.muted; }
    if (escrowed) { bg = `${COLORS.goldLight}18`; border = COLORS.goldDim; color = COLORS.goldLight; }

    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            background: bg, border: `1px solid ${border}`,
            fontSize: 12, color, fontFamily: FONTS.body, fontWeight: 500,
        }}>
            {isRemote && !suspended && <span>🌍</span>}
            {suspended && <span>⚑</span>}
            {complete && <span>✓</span>}
            {escrowed && <span>◈</span>}
            {name}
        </div>
    );
}

interface StatusPillProps {
    readonly status: VaultStatus | BeneficiaryStatus;
}

export function StatusPill({ status }: StatusPillProps): React.ReactElement {
    const colorMap: Record<string, string> = {
        ACTIVE: COLORS.green,
        COMPLETE: COLORS.muted,
        SUSPENDED: COLORS.red,
        REDIRECTED: COLORS.red,
        ESCROWED: COLORS.goldLight,
        UNLOCK_INITIATED: COLORS.gold,
        WINDOW_OPEN: COLORS.gold,
        FEE_PAID: COLORS.goldLight,
        EXECUTING: COLORS.green,
    };
    const color = colorMap[status] ?? COLORS.muted;

    return (
        <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontFamily: FONTS.body,
            fontWeight: 500,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color,
            background: `${color}18`,
            border: `1px solid ${color}50`,
        }}>
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}

interface GoldButtonProps {
    readonly children: React.ReactNode;
    readonly onClick?: () => void;
    readonly disabled?: boolean;
    readonly variant?: 'primary' | 'ghost' | 'danger';
    readonly fullWidth?: boolean;
    readonly type?: 'button' | 'submit';
}

export function GoldButton({
    children, onClick, disabled = false, variant = 'primary', fullWidth = false, type = 'button',
}: GoldButtonProps): React.ReactElement {
    const styles: Record<string, React.CSSProperties> = {
        primary: {
            background: disabled ? COLORS.mutedDark : COLORS.gold,
            color: disabled ? COLORS.muted : COLORS.obsidian,
            border: `1px solid ${disabled ? COLORS.mutedDark : COLORS.gold}`,
        },
        ghost: {
            background: 'transparent',
            color: disabled ? COLORS.mutedDark : COLORS.gold,
            border: `1px solid ${disabled ? COLORS.mutedDark : COLORS.gold}`,
        },
        danger: {
            background: 'transparent',
            color: disabled ? COLORS.mutedDark : COLORS.red,
            border: `1px solid ${disabled ? COLORS.mutedDark : COLORS.red}`,
        },
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '12px 28px',
                fontFamily: FONTS.body,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: fullWidth ? '100%' : undefined,
                transition: 'all 0.15s ease',
                opacity: disabled ? 0.5 : 1,
                ...styles[variant],
            }}
        >
            {children}
        </button>
    );
}

interface CardProps {
    readonly children: React.ReactNode;
    readonly style?: React.CSSProperties;
    readonly accent?: 'gold' | 'red' | 'green' | 'none';
}

export function Card({ children, style, accent = 'none' }: CardProps): React.ReactElement {
    const borderColor = accent === 'gold' ? COLORS.gold : accent === 'red' ? COLORS.red : accent === 'green' ? COLORS.green : COLORS.border;
    return (
        <div style={{
            background: COLORS.slate,
            border: `1px solid ${borderColor}`,
            padding: 28,
            ...style,
        }}>
            {children}
        </div>
    );
}

interface SectionHeadingProps {
    readonly children: React.ReactNode;
    readonly subtitle?: string;
}

export function SectionHeading({ children, subtitle }: SectionHeadingProps): React.ReactElement {
    return (
        <div style={{ marginBottom: 32 }}>
            <h1 style={{
                fontFamily: FONTS.heading,
                fontSize: 36,
                fontWeight: 600,
                color: COLORS.ivory,
                letterSpacing: 1,
            }}>
                {children}
            </h1>
            {subtitle && (
                <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, marginTop: 8 }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

interface FieldProps {
    readonly label: string;
    readonly value: React.ReactNode;
    readonly mono?: boolean;
}

export function Field({ label, value, mono = false }: FieldProps): React.ReactElement {
    return (
        <div>
            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                {label}
            </div>
            <div style={{
                fontSize: mono ? 12 : 15,
                color: COLORS.ivory,
                fontFamily: mono ? 'monospace' : FONTS.body,
                wordBreak: mono ? 'break-all' : 'normal',
            }}>
                {value}
            </div>
        </div>
    );
}

interface DividerProps { readonly style?: React.CSSProperties; }
export function Divider({ style }: DividerProps): React.ReactElement {
    return <div style={{ height: 1, background: COLORS.border, margin: '24px 0', ...style }} />;
}

interface CharityRowProps {
    readonly name: string;
    readonly address: string;
}

export function CharityRow({ name, address }: CharityRowProps): React.ReactElement {
    return (
        <div style={{
            padding: '12px 16px',
            border: `1px solid ${COLORS.red}`,
            background: `${COLORS.red}08`,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        }}>
            <div style={{ fontSize: 10, color: COLORS.red, textTransform: 'uppercase', letterSpacing: 1 }}>
                Charity Fallback
            </div>
            <div style={{ fontSize: 14, color: COLORS.ivory, fontFamily: FONTS.body, fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace', wordBreak: 'break-all' }}>{address}</div>
        </div>
    );
}

