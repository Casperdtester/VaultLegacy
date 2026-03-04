# VaultLegacy Frontend Setup Script
# Run this from inside: C:\Users\HP\Desktop\vaultlegacy-frontend

Write-Host 'Setting up VaultLegacy Frontend...' -ForegroundColor Cyan

# Create folder structure
New-Item -ItemType Directory -Force -Path 'src\screens' | Out-Null
New-Item -ItemType Directory -Force -Path 'src\components\layout' | Out-Null
New-Item -ItemType Directory -Force -Path 'src\data' | Out-Null
New-Item -ItemType Directory -Force -Path 'src\types' | Out-Null
New-Item -ItemType Directory -Force -Path 'src\utils' | Out-Null

Write-Host 'Creating index.html...' -ForegroundColor Yellow
@'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VaultLegacy — Bitcoin Inheritance Vault</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      body {
        background: #0a0a0a;
        color: #f5f1eb;
        font-family: 'Montserrat', sans-serif;
        font-weight: 300;
        -webkit-font-smoothing: antialiased;
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #0a0a0a; }
      ::-webkit-scrollbar-thumb { background: #c9a84c; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

'@ | Set-Content -Path 'index.html' -Encoding UTF8

Write-Host 'Creating vite.config.ts...' -ForegroundColor Yellow
@'
import { defineConfig } from 'vite';
import react from ''@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    base: '/',
    plugins: [
        nodePolyfills({
            globals: { Buffer: true, global: true, process: true },
            overrides: { crypto: 'crypto-browserify' },
        }),
        react(),
    ],
    resolve: {
        alias: { global: 'global' },
        mainFields: ['module', 'main', 'browser'],
        dedupe: ['react', 'react-dom'],
    },
    server: {
        port: 5173,
        open: true,
    },
});

'@ | Set-Content -Path 'vite.config.ts' -Encoding UTF8

Write-Host 'Creating tsconfig.json...' -ForegroundColor Yellow
@'
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

'@ | Set-Content -Path 'tsconfig.json' -Encoding UTF8

Write-Host 'Creating src/main.tsx...' -ForegroundColor Yellow
@'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

'@ | Set-Content -Path 'src\main.tsx' -Encoding UTF8

Write-Host 'Creating src/App.tsx...' -ForegroundColor Yellow
@'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.js';
import { OwnerDashboardScreen } from './screens/OwnerDashboardScreen.js';
import { CreateVaultScreen } from './screens/CreateVaultScreen.js';
import { ExecutorDashboardScreen } from './screens/ExecutorDashboardScreen.js';
import { BeneficiaryDashboardScreen } from './screens/BeneficiaryDashboardScreen.js';
import { SignTransferScreen } from './screens/SignTransferScreen.js';
import { AppealScreen } from './screens/AppealScreen.js';
import { DeathConfirmationScreen } from './screens/DeathConfirmationScreen.js';
import { DepositHistoryScreen } from './screens/DepositHistoryScreen.js';
import { VaultCertificateScreen } from './screens/VaultCertificateScreen.js';

export function App(): React.ReactElement {
    return (
        <BrowserRouter>
            <Routes>
                {/* Signing screen — standalone, no sidebar */}
                <Route path="/sign" element={<SignTransferScreen />} />

                {/* All other screens use the full layout */}
                <Route element={<AppLayout />}>
                    <Route index element={<Navigate to="/owner" replace />} />
                    <Route path="/owner" element={<OwnerDashboardScreen />} />
                    <Route path="/create" element={<CreateVaultScreen />} />
                    <Route path="/executor" element={<ExecutorDashboardScreen />} />
                    <Route path="/beneficiary" element={<BeneficiaryDashboardScreen />} />
                    <Route path="/appeal" element={<AppealScreen />} />
                    <Route path="/death" element={<DeathConfirmationScreen />} />
                    <Route path="/deposits" element={<DepositHistoryScreen />} />
                    <Route path="/certificate" element={<VaultCertificateScreen />} />
                    <Route path="*" element={<Navigate to="/owner" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

'@ | Set-Content -Path 'src\App.tsx' -Encoding UTF8

Write-Host 'Creating src/types/index.ts...' -ForegroundColor Yellow
@'
export type VaultStatus =
    | 'ACTIVE'
    | 'UNLOCK_INITIATED'
    | 'WINDOW_OPEN'
    | 'FEE_PAID'
    | 'EXECUTING'
    | 'COMPLETE';

export type BeneficiaryStatus =
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'COMPLETE'
    | 'ESCROWED'
    | 'REDIRECTED';

export type CheckInFrequency = '3months' | '6months';

export type UserRole = 'owner' | 'lawyer' | 'beneficiary';

export interface Beneficiary {
    readonly id: string;
    readonly name: string;
    readonly address: string;
    readonly country: string;
    readonly sharePercent: number;
    readonly status: BeneficiaryStatus;
    readonly isRemote: boolean;
    readonly suspensionBlock?: bigint;
    readonly appealEvidenceHash?: string;
    readonly transferTxHash?: string;
}

export interface Executor {
    readonly name: string;
    readonly address: string;
    readonly location: string;
    readonly feePercent: number;
}

export interface CharityFallback {
    readonly name: string;
    readonly address: string;
}

export interface DepositRecord {
    readonly index: number;
    readonly amountSatoshis: bigint;
    readonly blockNumber: bigint;
    readonly lawyerAcknowledged: boolean;
    readonly txHash: string;
}

export interface Vault {
    readonly id: string;
    readonly name: string;
    readonly contractAddress: string;
    readonly ownerAddress: string;
    readonly status: VaultStatus;
    readonly executor: Executor;
    readonly beneficiaries: readonly Beneficiary[];
    readonly charity: CharityFallback;
    readonly willHash: string;
    readonly clauseHash: string;
    readonly checkInFrequencyBlocks: bigint;
    readonly lastCheckInBlock: bigint;
    readonly missedCheckIns: number;
    readonly balanceSatoshis: bigint;
    readonly balanceAtDeathSatoshis: bigint;
    readonly deathConfirmedBlock: bigint;
    readonly willDecryptionAuthorized: boolean;
    readonly fraudFlagged: boolean;
    readonly deployedAt: string;
    readonly deposits: readonly DepositRecord[];
}

export interface WizardStep1Data {
    readonly walletConnected: boolean;
    readonly walletAddress: string;
}

export interface WizardStep2Data {
    readonly vaultName: string;
}

export interface WizardStep3Data {
    readonly executor: Executor;
    readonly beneficiaries: readonly Beneficiary[];
    readonly charity: CharityFallback;
}

export interface WizardStep4Data {
    readonly willFileName: string;
    readonly clauseFileName: string;
    readonly willHash: string;
    readonly clauseHash: string;
    readonly encryptionComplete: boolean;
}

export interface WizardStep5Data {
    readonly checkInFrequency: CheckInFrequency;
}

export interface VaultWizardState {
    readonly step: number;
    readonly step1: Partial<WizardStep1Data>;
    readonly step2: Partial<WizardStep2Data>;
    readonly step3: Partial<WizardStep3Data>;
    readonly step4: Partial<WizardStep4Data>;
    readonly step5: Partial<WizardStep5Data>;
}

export interface AppealCase {
    readonly beneficiaryId: string;
    readonly beneficiaryName: string;
    readonly suspensionReason: string;
    readonly deadlineBlock: bigint;
    readonly evidenceHash?: string;
    readonly evidenceSubmitted: boolean;
}

'@ | Set-Content -Path 'src\types\index.ts' -Encoding UTF8

Write-Host 'Creating src/utils/constants.ts...' -ForegroundColor Yellow
@'
export const COLORS = {
    obsidian: '#0a0a0a',
    slate: '#1e1e1e',
    mid: '#2a2a2a',
    border: '#333333',
    gold: '#c9a84c',
    goldLight: '#e8d08a',
    goldDim: '#8a6d28',
    green: '#5bab74',
    red: '#e05a5a',
    ivory: '#f5f1eb',
    muted: '#888888',
    mutedDark: '#555555',
} as const;

export const FONTS = {
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Montserrat', system-ui, sans-serif",
} as const;

export const BLOCKS = {
    per72Hours: 432n,
    per30Days: 4320n,
    per3Months: 13140n,
    per6Months: 26280n,
} as const;

export const formatBTC = (satoshis: bigint): string => {
    const btc = Number(satoshis) / 100_000_000;
    return btc.toFixed(8).replace(/\.?0+$/, '') + ' BTC';
};

export const formatSharePercent = (basisPoints: number): string => {
    return (basisPoints / 100).toFixed(2).replace(/\.00$/, '') + '%';
};

export const blocksToApproxDays = (blocks: bigint): number => {
    return Math.round(Number(blocks) / 144);
};

export const STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'Active',
    UNLOCK_INITIATED: 'Unlock Initiated',
    WINDOW_OPEN: 'Dispute Window Open',
    FEE_PAID: 'Fee Paid',
    EXECUTING: 'Executing Transfers',
    COMPLETE: 'Complete',
    SUSPENDED: 'Suspended',
    ESCROWED: 'Escrowed',
    REDIRECTED: 'Redirected to Charity',
};

'@ | Set-Content -Path 'src\utils\constants.ts' -Encoding UTF8

Write-Host 'Creating src/data/mockData.ts...' -ForegroundColor Yellow
@'
import type { Vault, AppealCase } from '../types/index.js';

export const MOCK_VAULT: Vault = {
    id: 'vault-001',
    name: 'Johnson Family Estate',
    contractAddress: 'bc1p4x9hq3z7k2m8n5t6w0y1a3b5c7d9e2f4g6h8j0k2l4m6n8p0q2r4s6t8u0v',
    ownerAddress: 'bc1powner123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890',
    status: 'ACTIVE',
    executor: {
        name: 'Adeyemi Okonkwo & Associates',
        address: 'bc1plawyer456def789ghi012jkl345mno678pqr901stu234vwx567yz890abc123',
        location: 'Lagos, Nigeria',
        feePercent: 200,
    },
    beneficiaries: [
        {
            id: 'bene-001',
            name: 'Chidi Johnson',
            address: 'bc1pchidi789ghi012jkl345mno678pqr901stu234vwx567yz890abc123def456',
            country: 'Nigeria',
            sharePercent: 3500,
            status: 'ACTIVE',
            isRemote: false,
        },
        {
            id: 'bene-002',
            name: 'Amara Johnson',
            address: 'bc1pamara012jkl345mno678pqr901stu234vwx567yz890abc123def456ghi789',
            country: 'United Kingdom',
            sharePercent: 3000,
            status: 'ACTIVE',
            isRemote: true,
        },
        {
            id: 'bene-003',
            name: 'Emeka Johnson',
            address: 'bc1pemeka345mno678pqr901stu234vwx567yz890abc123def456ghi789jkl012',
            country: 'Canada',
            sharePercent: 2000,
            status: 'SUSPENDED',
            isRemote: true,
            suspensionBlock: 890450n,
        },
        {
            id: 'bene-004',
            name: 'Ngozi Johnson',
            address: 'bc1pngozi678pqr901stu234vwx567yz890abc123def456ghi789jkl012mno345',
            country: 'Nigeria',
            sharePercent: 1500,
            status: 'ACTIVE',
            isRemote: false,
        },
    ],
    charity: {
        name: 'African Children Education Fund',
        address: 'bc1pcharity901stu234vwx567yz890abc123def456ghi789jkl012mno345pqr678',
    },
    willHash: 'a3f4b2c1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    clauseHash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    checkInFrequencyBlocks: 13140n,
    lastCheckInBlock: 887200n,
    missedCheckIns: 0,
    balanceSatoshis: 184200000n,
    balanceAtDeathSatoshis: 0n,
    deathConfirmedBlock: 0n,
    willDecryptionAuthorized: false,
    fraudFlagged: false,
    deployedAt: '2025-09-14',
    deposits: [
        {
            index: 0,
            amountSatoshis: 100000000n,
            blockNumber: 880100n,
            lawyerAcknowledged: true,
            txHash: 'tx001abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef',
        },
        {
            index: 1,
            amountSatoshis: 50000000n,
            blockNumber: 883500n,
            lawyerAcknowledged: true,
            txHash: 'tx002def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123456',
        },
        {
            index: 2,
            amountSatoshis: 34200000n,
            blockNumber: 886900n,
            lawyerAcknowledged: false,
            txHash: 'tx003ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123456def789',
        },
    ],
};

export const MOCK_VAULT_EXECUTING: Vault = {
    ...MOCK_VAULT,
    id: 'vault-002',
    status: 'EXECUTING',
    willDecryptionAuthorized: true,
    balanceAtDeathSatoshis: 184200000n,
    deathConfirmedBlock: 888000n,
    beneficiaries: [
        { ...MOCK_VAULT.beneficiaries[0]!, status: 'COMPLETE', transferTxHash: 'txcomp001' },
        { ...MOCK_VAULT.beneficiaries[1]!, status: 'ACTIVE' },
        { ...MOCK_VAULT.beneficiaries[2]!, status: 'SUSPENDED', suspensionBlock: 888200n },
        { ...MOCK_VAULT.beneficiaries[3]!, status: 'ACTIVE' },
    ],
};

export const MOCK_APPEAL: AppealCase = {
    beneficiaryId: 'bene-003',
    beneficiaryName: 'Emeka Johnson',
    suspensionReason:
        'Conditional clause violation: pending criminal charges as specified in the estate conditions document.',
    deadlineBlock: 892770n,
    evidenceSubmitted: false,
};

export const CURRENT_BLOCK = 889100n;

'@ | Set-Content -Path 'src\data\mockData.ts' -Encoding UTF8

Write-Host 'Creating src/components/layout/UI.tsx...' -ForegroundColor Yellow
@'
import { COLORS, FONTS, STATUS_LABELS } from '../../utils/constants.js';
import type { BeneficiaryStatus, VaultStatus } from '../../types/index.js';

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

'@ | Set-Content -Path 'src\components\layout\UI.tsx' -Encoding UTF8

Write-Host 'Creating src/components/layout/AppLayout.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { COLORS, FONTS } from '../../utils/constants.js';
import type { UserRole } from '../../types/index.js';

interface NavItem {
    readonly label: string;
    readonly path: string;
    readonly icon: string;
    readonly roles: readonly UserRole[];
}

const NAV_ITEMS: readonly NavItem[] = [
    { label: 'Owner Dashboard', path: '/owner', icon: '◈', roles: ['owner'] },
    { label: 'Create Vault', path: '/create', icon: '+', roles: ['owner'] },
    { label: 'Deposit History', path: '/deposits', icon: '≡', roles: ['owner', 'lawyer'] },
    { label: 'Executor Dashboard', path: '/executor', icon: '⚖', roles: ['lawyer'] },
    { label: 'My Inheritance', path: '/beneficiary', icon: '◉', roles: ['beneficiary'] },
    { label: 'Sign Transfer', path: '/sign', icon: '✎', roles: ['beneficiary'] },
    { label: 'Appeal', path: '/appeal', icon: '⚑', roles: ['beneficiary'] },
    { label: 'Death Confirmation', path: '/death', icon: '⚐', roles: ['owner', 'lawyer', 'beneficiary'] },
    { label: 'Vault Certificate', path: '/certificate', icon: '◻', roles: ['owner', 'lawyer'] },
];

const ROLE_LABELS: Record<UserRole, string> = {
    owner: 'Vault Owner',
    lawyer: 'Executor',
    beneficiary: 'Beneficiary',
};

export function AppLayout(): React.ReactElement {
    const [activeRole, setActiveRole] = useState<UserRole>('owner');
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const visibleNav = NAV_ITEMS.filter((n) => n.roles.includes(activeRole));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.obsidian }}>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                        zIndex: 40, display: 'none',
                    }}
                    className="mobile-overlay"
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: 260,
                background: COLORS.slate,
                borderRight: `1px solid ${COLORS.border}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                zIndex: 50,
                transition: 'transform 0.2s ease',
            }}
                className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
            >
                {/* Logo */}
                <div style={{
                    padding: '32px 24px 24px',
                    borderBottom: `1px solid ${COLORS.border}`,
                }}>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 24, fontWeight: 700, color: COLORS.ivory, letterSpacing: 2 }}>
                        VAULT<span style={{ color: COLORS.gold }}>LEGACY</span>
                    </div>
                    <div style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.muted, marginTop: 4, letterSpacing: 1 }}>
                        BITCOIN INHERITANCE VAULT
                    </div>
                </div>

                {/* Role switcher (dev tool) */}
                <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                        View As (Dev Mode)
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {(['owner', 'lawyer', 'beneficiary'] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                style={{
                                    flex: 1,
                                    padding: '5px 4px',
                                    fontSize: 10,
                                    fontFamily: FONTS.body,
                                    fontWeight: 500,
                                    letterSpacing: 0.5,
                                    textTransform: 'capitalize',
                                    background: activeRole === role ? COLORS.gold : COLORS.mid,
                                    color: activeRole === role ? COLORS.obsidian : COLORS.muted,
                                    border: `1px solid ${activeRole === role ? COLORS.gold : COLORS.border}`,
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
                    {visibleNav.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 24px',
                                fontFamily: FONTS.body,
                                fontSize: 13,
                                fontWeight: isActive ? 500 : 300,
                                color: isActive ? COLORS.gold : COLORS.ivory,
                                textDecoration: 'none',
                                borderLeft: `2px solid ${isActive ? COLORS.gold : 'transparent'}`,
                                background: isActive ? `${COLORS.gold}10` : 'transparent',
                                transition: 'all 0.15s ease',
                                letterSpacing: 0.5,
                            })}
                        >
                            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Connected wallet stub */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: `1px solid ${COLORS.border}`,
                    background: COLORS.obsidian,
                }}>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
                        {ROLE_LABELS[activeRole]}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.gold, fontFamily: FONTS.body, wordBreak: 'break-all' }}>
                        bc1powner...yz890
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        marginTop: 8, padding: '3px 8px',
                        background: `${COLORS.green}20`,
                        border: `1px solid ${COLORS.green}`,
                        borderRadius: 2,
                        fontSize: 10, color: COLORS.green, fontFamily: FONTS.body,
                    }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS.green, display: 'inline-block' }} />
                        OP_NET Testnet
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ marginLeft: 260, flex: 1, minHeight: '100vh' }} className="main-content">
                {/* Mobile header */}
                <div style={{
                    display: 'none',
                    padding: '16px 20px',
                    background: COLORS.slate,
                    borderBottom: `1px solid ${COLORS.border}`,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                    className="mobile-header"
                >
                    <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700, color: COLORS.ivory }}>
                        VAULT<span style={{ color: COLORS.gold }}>LEGACY</span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            background: 'none', border: `1px solid ${COLORS.border}`,
                            color: COLORS.ivory, padding: '6px 12px', cursor: 'pointer',
                            fontFamily: FONTS.body, fontSize: 18,
                        }}
                    >
                        ☰
                    </button>
                </div>

                <Outlet />
            </main>

            <style>{`
                @media (max-width: 768px) {
                    .sidebar { transform: translateX(-260px); }
                    .sidebar.sidebar-open { transform: translateX(0); }
                    .mobile-overlay { display: block !important; }
                    .mobile-header { display: flex !important; }
                    .main-content { margin-left: 0 !important; }
                }
            `}</style>
        </div>
    );
}

'@ | Set-Content -Path 'src\components\layout\AppLayout.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/OwnerDashboardScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, formatBTC, formatSharePercent, blocksToApproxDays } from '../utils/constants.js';
import { BeneficiaryChip, StatusPill, GoldButton, Card, SectionHeading, Field, Divider, CharityRow } from '../components/layout/UI.js';
import { MOCK_VAULT, CURRENT_BLOCK } from '../data/mockData.js';

function DeadMansBanner(): React.ReactElement {
    const vault = MOCK_VAULT;
    const nextDue = vault.lastCheckInBlock + vault.checkInFrequencyBlocks;
    const blocksLeft = nextDue > CURRENT_BLOCK ? nextDue - CURRENT_BLOCK : 0n;
    const daysLeft = blocksToApproxDays(blocksLeft);
    const isOverdue = blocksLeft === 0n;
    const isDueSoon = daysLeft < 14;

    const [checkedIn, setCheckedIn] = useState(false);

    return (
        <div style={{
            padding: '16px 24px',
            border: `1px solid ${isOverdue ? COLORS.red : isDueSoon ? COLORS.gold : COLORS.border}`,
            background: isOverdue ? `${COLORS.red}10` : isDueSoon ? `${COLORS.gold}08` : COLORS.mid,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 32,
            flexWrap: 'wrap',
        }}>
            <div>
                <div style={{ fontSize: 11, color: isOverdue ? COLORS.red : COLORS.gold, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                    {isOverdue ? '⚠ Dead Man\'s Switch — Overdue' : '◉ Dead Man\'s Switch'}
                </div>
                {checkedIn ? (
                    <div style={{ fontSize: 14, color: COLORS.green }}>
                        ✓ Checked in this session — timer reset
                    </div>
                ) : (
                    <div style={{ fontSize: 14, color: COLORS.ivory }}>
                        {isOverdue
                            ? 'Check-in overdue. Executor has been notified.'
                            : `Next check-in due in ${daysLeft} days (~${blocksLeft.toLocaleString()} blocks)`}
                    </div>
                )}
            </div>
            {!checkedIn && (
                <GoldButton
                    onClick={() => setCheckedIn(true)}
                    variant={isOverdue ? 'danger' : 'primary'}
                >
                    Check In Now
                </GoldButton>
            )}
        </div>
    );
}

function PendingAcknowledgment(): React.ReactElement | null {
    const pending = MOCK_VAULT.deposits.filter((d) => !d.lawyerAcknowledged);
    if (pending.length === 0) return null;

    return (
        <div style={{
            padding: '14px 20px',
            border: `1px solid ${COLORS.goldDim}`,
            background: `${COLORS.gold}08`,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <div>
                <span style={{ fontSize: 12, color: COLORS.gold }}>⏳ Pending Lawyer Acknowledgment</span>
                <span style={{ fontSize: 12, color: COLORS.muted, marginLeft: 12 }}>
                    {pending.length} deposit{pending.length > 1 ? 's' : ''} awaiting executor sign-off
                </span>
            </div>
            <a href="/deposits" style={{ fontSize: 12, color: COLORS.gold, textDecoration: 'none' }}>View →</a>
        </div>
    );
}

function VaultHealthChecklist(): React.ReactElement {
    const vault = MOCK_VAULT;
    const checks = [
        { label: 'Will document attached', ok: !!vault.willHash },
        { label: 'Conditional clause attached', ok: !!vault.clauseHash },
        { label: 'All beneficiaries registered', ok: vault.beneficiaries.length > 0 },
        { label: 'Executor confirmed', ok: !!vault.executor.address },
        { label: 'Charity fallback set', ok: !!vault.charity.address },
        { label: 'Dead man\'s switch active', ok: vault.missedCheckIns < 3 },
        { label: 'Vault funded', ok: vault.balanceSatoshis > 0n },
    ];

    const score = checks.filter((c) => c.ok).length;

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, fontFamily: FONTS.body, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Vault Health
                </div>
                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: score === checks.length ? COLORS.green : COLORS.gold }}>
                    {score}/{checks.length}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {checks.map((c) => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: c.ok ? COLORS.green : COLORS.red, fontSize: 14 }}>{c.ok ? '✓' : '✗'}</span>
                        <span style={{ fontSize: 13, color: c.ok ? COLORS.ivory : COLORS.muted }}>{c.label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function OwnerDashboardScreen(): React.ReactElement {
    const navigate = useNavigate();
    const vault = MOCK_VAULT;

    return (
        <div style={{ padding: '48px 48px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <SectionHeading subtitle="OP_NET Testnet · All amounts in BTC only">
                    {vault.name}
                </SectionHeading>
                <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                    <StatusPill status={vault.status} />
                    <GoldButton onClick={() => navigate('/create')} variant="ghost">+ New Vault</GoldButton>
                </div>
            </div>

            <DeadMansBanner />
            <PendingAcknowledgment />

            {/* Balance + Executor row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <Card accent="gold">
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Vault Balance
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 48, color: COLORS.gold, lineHeight: 1 }}>
                        {formatBTC(vault.balanceSatoshis)}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                        {vault.deposits.length} deposit{vault.deposits.length !== 1 ? 's' : ''} recorded
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <GoldButton onClick={() => navigate('/deposits')} variant="ghost">
                            View Deposit History
                        </GoldButton>
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
                        Executor
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 20, color: COLORS.ivory, marginBottom: 4 }}>
                        {vault.executor.name}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>{vault.executor.location}</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Field label="Fee" value={<span style={{ color: COLORS.goldLight }}>{formatSharePercent(vault.executor.feePercent)}</span>} />
                        <Field label="Wallet" value={vault.executor.address.slice(0, 18) + '...'} mono />
                    </div>
                </Card>
            </div>

            {/* Beneficiaries */}
            <Card style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>
                        Beneficiaries
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>
                        {vault.beneficiaries.length} of 7 registered
                    </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {vault.beneficiaries.map((b) => (
                        <BeneficiaryChip key={b.id} name={b.name} isRemote={b.isRemote} status={b.status} />
                    ))}
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {vault.beneficiaries.map((b) => (
                        <div key={b.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', background: COLORS.mid, border: `1px solid ${COLORS.border}`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 14, color: COLORS.ivory }}>{b.name}</div>
                                    <div style={{ fontSize: 11, color: COLORS.muted }}>{b.country}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.gold }}>
                                    {formatSharePercent(b.sharePercent)}
                                </div>
                                <StatusPill status={b.status} />
                            </div>
                        </div>
                    ))}
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <CharityRow name={vault.charity.name} address={vault.charity.address} />
            </Card>

            {/* Bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <VaultHealthChecklist />
                <Card>
                    <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 16 }}>
                        Quick Actions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <GoldButton onClick={() => navigate('/death')} variant="ghost" fullWidth>
                            Initiate Unlock (Death Certificate)
                        </GoldButton>
                        <GoldButton onClick={() => navigate('/certificate')} variant="ghost" fullWidth>
                            Download Vault Certificate
                        </GoldButton>
                        <GoldButton onClick={() => navigate('/deposits')} variant="ghost" fullWidth>
                            View Full Deposit History
                        </GoldButton>
                    </div>
                    <Divider />
                    <div style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.8 }}>
                        <div>Contract: <span style={{ color: COLORS.ivory, fontFamily: 'monospace', fontSize: 10 }}>{vault.contractAddress.slice(0, 28)}...</span></div>
                        <div>Deployed: {vault.deployedAt}</div>
                        <div>Network: OP_NET Testnet</div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

'@ | Set-Content -Path 'src\screens\OwnerDashboardScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/CreateVaultScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, formatSharePercent } from '../../utils/constants.js';
import { GoldButton, Card, Divider, CharityRow } from '../layout/UI.js';
import type {
    VaultWizardState, Beneficiary, WizardStep3Data, CheckInFrequency,
} from '../../types/index.js';

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
                                {done ? '✓' : stepNum}
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
                        <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
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
                Continue →
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
                <GoldButton onClick={onBack} variant="ghost">← Back</GoldButton>
                <GoldButton onClick={onNext} disabled={vaultName.trim().length === 0} fullWidth>
                    Continue →
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
                    {remaining === 0 ? '✓ 100% allocated' : `${(remaining / 100).toFixed(2)}% remaining`}
                </span>
            </div>

            {beneficiaries.map((b) => (
                <div key={b.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    background: COLORS.mid, border: `1px solid ${COLORS.border}`, marginBottom: 8,
                }}>
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: COLORS.ivory, marginRight: 8 }}>{b.name}</span>
                        {b.isRemote && <span style={{ fontSize: 11, color: COLORS.green }}>🌍 Remote Signer</span>}
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold }}>
                        {formatSharePercent(b.sharePercent)}
                    </div>
                    <button onClick={() => removeBeneficiary(b.id)} style={{
                        background: 'none', border: 'none', color: COLORS.red, cursor: 'pointer', fontSize: 16,
                    }}>×</button>
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
                <GoldButton onClick={onBack} variant="ghost">← Back</GoldButton>
                <GoldButton onClick={handleNext} disabled={!canProceed} fullWidth>
                    Continue →
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
                    {willFile && <span style={{ fontSize: 12, color: COLORS.green }}>✓ {willFile}</span>}
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
                    {clauseFile && <span style={{ fontSize: 12, color: COLORS.green }}>✓ {clauseFile}</span>}
                </div>
            </Card>

            {!encrypted && (
                <GoldButton
                    onClick={simulateEncrypt}
                    disabled={!willFile || !clauseFile || encrypting}
                    fullWidth
                >
                    {encrypting ? '🔒 Encrypting Client-Side...' : 'Encrypt & Hash Documents'}
                </GoldButton>
            )}

            {encrypted && (
                <Card accent="green" style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 12, color: COLORS.green, marginBottom: 12 }}>✓ Encryption Complete</div>
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
                <GoldButton onClick={onBack} variant="ghost">← Back</GoldButton>
                <GoldButton onClick={onNext} disabled={!encrypted} fullWidth>Continue →</GoldButton>
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
                Set your dead man's switch frequency, then deploy to OP_NET Testnet. Death is the only unlock trigger — no calendar date.
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
                    <GoldButton onClick={onBack} variant="ghost">← Back</GoldButton>
                    <GoldButton onClick={onDeploy} disabled={deploying} fullWidth>
                        {deploying ? '⟳ Deploying to Testnet...' : 'Deploy Vault Contract'}
                    </GoldButton>
                </div>
            )}

            {deployed && (
                <Card accent="gold">
                    <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.gold, marginBottom: 16 }}>
                        ✓ Vault Deployed
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
                            Go to Dashboard →
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
                    ← Back to Dashboard
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

'@ | Set-Content -Path 'src\screens\CreateVaultScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/ExecutorDashboardScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { COLORS, FONTS, formatBTC, formatSharePercent, blocksToApproxDays } from '../utils/constants.js';
import { BeneficiaryChip, StatusPill, GoldButton, Card, SectionHeading, Divider, CharityRow } from '../components/layout/UI.js';
import { MOCK_VAULT_EXECUTING, CURRENT_BLOCK } from '../data/mockData.js';
import type { Beneficiary } from '../types/index.js';

function TransferRow({ b, lawyerFee }: { readonly b: Beneficiary; readonly lawyerFee: bigint }): React.ReactElement {
    const [initiated, setInitiated] = useState(false);
    const vaultBalance = MOCK_VAULT_EXECUTING.balanceAtDeathSatoshis;
    const netBalance = vaultBalance - lawyerFee;
    const childAmount = (netBalance * BigInt(b.sharePercent)) / 10000n;

    const actionLabel = (): string => {
        if (b.status === 'COMPLETE') return 'Complete';
        if (b.status === 'SUSPENDED') return 'Suspended — Appeal Open';
        if (b.status === 'ESCROWED') return 'Held in Escrow';
        if (b.status === 'REDIRECTED') return 'Redirected to Charity';
        if (initiated) return 'Transfer Initiated — Awaiting Signature';
        return 'Initiate Transfer';
    };

    const canInitiate = b.status === 'ACTIVE' && !initiated;
    const appealDaysLeft = b.suspensionBlock
        ? blocksToApproxDays(b.suspensionBlock + 4320n > CURRENT_BLOCK ? b.suspensionBlock + 4320n - CURRENT_BLOCK : 0n)
        : 0;

    return (
        <div style={{
            padding: '16px 20px',
            border: `1px solid ${b.status === 'SUSPENDED' ? COLORS.red : b.status === 'COMPLETE' ? COLORS.mutedDark : COLORS.border}`,
            background: b.status === 'COMPLETE' ? `${COLORS.muted}08` : COLORS.mid,
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
            <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <BeneficiaryChip name={b.name} isRemote={b.isRemote} status={b.status} />
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{b.country}</div>
                {b.status === 'SUSPENDED' && (
                    <div style={{ fontSize: 11, color: COLORS.red, marginTop: 4 }}>
                        ⚑ Appeal window: {appealDaysLeft} days remaining
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: b.status === 'COMPLETE' ? COLORS.muted : COLORS.gold }}>
                    {b.status === 'ACTIVE' || b.status === 'SUSPENDED' || b.status === 'ESCROWED'
                        ? formatBTC(childAmount)
                        : b.status === 'COMPLETE' ? '✓ Sent' : '→ Charity'}
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{formatSharePercent(b.sharePercent)} of net estate</div>
            </div>

            <div style={{ minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <StatusPill status={b.status} />
                {canInitiate && (
                    <GoldButton onClick={() => setInitiated(true)} variant="ghost">
                        Initiate Transfer
                    </GoldButton>
                )}
                {initiated && b.status === 'ACTIVE' && (
                    <div style={{ fontSize: 11, color: COLORS.gold }}>⟳ Awaiting child signature</div>
                )}
                {b.status === 'SUSPENDED' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <GoldButton variant="ghost">Reinstate</GoldButton>
                        <GoldButton variant="danger">→ Charity</GoldButton>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ExecutorDashboardScreen(): React.ReactElement {
    const vault = MOCK_VAULT_EXECUTING;
    const lawyerFeeSatoshis = (vault.balanceAtDeathSatoshis * BigInt(vault.executor.feePercent)) / 10000n;
    const netEstate = vault.balanceAtDeathSatoshis - lawyerFeeSatoshis;
    const canDecrypt = vault.willDecryptionAuthorized;

    return (
        <div style={{ padding: '48px 48px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <SectionHeading subtitle="Executor view — full balance visible">
                    {vault.name}
                </SectionHeading>
                <StatusPill status={vault.status} />
            </div>

            {/* Balance summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                <Card accent="gold">
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Balance at Death
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.gold }}>
                        {formatBTC(vault.balanceAtDeathSatoshis)}
                    </div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Your Fee ({formatSharePercent(vault.executor.feePercent)})
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.goldLight }}>
                        {formatBTC(lawyerFeeSatoshis)}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.green, marginTop: 6 }}>✓ Paid to executor wallet</div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        Net Estate (for distribution)
                    </div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 36, color: COLORS.ivory }}>
                        {formatBTC(netEstate)}
                    </div>
                </Card>
            </div>

            {/* Will decryption */}
            {canDecrypt && (
                <Card accent="gold" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 13, color: COLORS.gold, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                                ✓ Will Decryption Authorized
                            </div>
                            <div style={{ fontSize: 13, color: COLORS.muted }}>
                                You may now decrypt and read the will document from IPFS.
                            </div>
                        </div>
                        <GoldButton>Decrypt Will</GoldButton>
                    </div>
                    <Divider />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Will SHA-256 Hash</div>
                            <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>{vault.willHash}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Conditional Clause Hash</div>
                            <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all' }}>{vault.clauseHash}</div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Per-child transfer rows */}
            <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 16 }}>
                    Beneficiary Transfers — Independent Per Child
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {vault.beneficiaries.map((b) => (
                        <TransferRow key={b.id} b={b} lawyerFee={lawyerFeeSatoshis} />
                    ))}
                </div>
            </div>

            <Divider />
            <CharityRow name={vault.charity.name} address={vault.charity.address} />
        </div>
    );
}

'@ | Set-Content -Path 'src\screens\ExecutorDashboardScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/BeneficiaryDashboardScreen.tsx...' -ForegroundColor Yellow
@'
import { COLORS, FONTS, formatSharePercent } from '../utils/constants.js';
import { Card, SectionHeading, StatusPill, GoldButton } from '../components/layout/UI.js';
import { MOCK_VAULT } from '../data/mockData.js';

export function BeneficiaryDashboardScreen(): React.ReactElement {
    const vault = MOCK_VAULT;
    const me = vault.beneficiaries[1]!; // Amara — remote signer

    return (
        <div style={{ padding: '48px 40px', maxWidth: 720, margin: '0 auto' }}>
            <SectionHeading subtitle="Your inheritance summary — managed by VaultLegacy">
                My Inheritance
            </SectionHeading>

            {/* Identity card */}
            <Card accent="gold" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
                            Vault
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 24, color: COLORS.ivory, marginBottom: 4 }}>
                            {vault.name}
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted }}>
                            Executor: {vault.executor.name}
                        </div>
                    </div>
                    <StatusPill status={vault.status} />
                </div>
            </Card>

            {/* Your share — prominent, no total balance shown */}
            <Card style={{ marginBottom: 20, textAlign: 'center', padding: '48px 28px' }}>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                    Your Share of the Estate
                </div>
                <div style={{ fontFamily: FONTS.heading, fontSize: 80, color: COLORS.gold, lineHeight: 1, marginBottom: 8 }}>
                    {formatSharePercent(me.sharePercent)}
                </div>
                <div style={{ fontSize: 13, color: COLORS.muted, maxWidth: 380, margin: '0 auto', lineHeight: 1.7 }}>
                    Your exact BTC amount will only be shown when your individual transfer is initiated by the executor. The total vault balance is not visible to beneficiaries.
                </div>
            </Card>

            {/* Status explanation */}
            <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    What Happens Next
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        { step: '1', label: 'Owner passes away', done: false, note: 'Any party uploads a death certificate to initiate unlock.' },
                        { step: '2', label: 'Executor confirms death on-chain', done: false, note: 'A 72-hour dispute window opens. Fraud can be flagged during this period.' },
                        { step: '3', label: 'Executor pays fee, decrypts will', done: false, note: 'The executor receives their fee, then decrypts your share information.' },
                        { step: '4', label: 'Your transfer is initiated', done: false, note: 'You and the executor co-sign. You receive your BTC.' },
                    ].map((s) => (
                        <div key={s.step} style={{ display: 'flex', gap: 14 }}>
                            <div style={{
                                width: 28, height: 28, flexShrink: 0,
                                border: `1px solid ${s.done ? COLORS.green : COLORS.border}`,
                                background: s.done ? COLORS.green : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, color: s.done ? COLORS.obsidian : COLORS.muted,
                                fontFamily: FONTS.body,
                            }}>
                                {s.done ? '✓' : s.step}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, color: COLORS.ivory, marginBottom: 2 }}>{s.label}</div>
                                <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{s.note}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Executor info */}
            <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 12 }}>
                    Your Executor
                </div>
                <div style={{ fontSize: 16, color: COLORS.ivory, marginBottom: 4 }}>{vault.executor.name}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>{vault.executor.location}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {vault.executor.address}
                </div>
            </Card>

            {/* Remote signer badge */}
            {me.isRemote && (
                <div style={{
                    padding: '14px 20px',
                    border: `1px solid ${COLORS.green}`,
                    background: `${COLORS.green}10`,
                    fontSize: 13, color: COLORS.green,
                }}>
                    🌍 You are registered as a <strong>Remote Signer</strong>. When your transfer is ready, you will receive a secure signing link via email and SMS. You can sign from anywhere in the world.
                </div>
            )}
        </div>
    );
}

'@ | Set-Content -Path 'src\screens\BeneficiaryDashboardScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/SignTransferScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { COLORS, FONTS, formatBTC } from '../utils/constants.js';
import { Card, GoldButton } from '../components/layout/UI.js';
import { MOCK_VAULT_EXECUTING } from '../data/mockData.js';

export function SignTransferScreen(): React.ReactElement {
    const vault = MOCK_VAULT_EXECUTING;
    const executor = vault.executor;
    const lawyerFee = (vault.balanceAtDeathSatoshis * BigInt(executor.feePercent)) / 10000n;
    const netEstate = vault.balanceAtDeathSatoshis - lawyerFee;
    const me = vault.beneficiaries[1]!; // Amara — remote
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
                    <div style={{ fontSize: 64, marginBottom: 24 }}>✓</div>
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

                {/* BTC amount — large and prominent */}
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
                        <div style={{ fontSize: 24, color: COLORS.gold }}>⚖</div>
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
                    {signing ? '⟳ Submitting Signature...' : 'Approve & Sign'}
                </GoldButton>

                <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: COLORS.mutedDark }}>
                    This action is irreversible. Your signature authorises the BTC transfer.
                </div>
            </div>
        </div>
    );
}

'@ | Set-Content -Path 'src\screens\SignTransferScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/AppealScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { COLORS, FONTS, blocksToApproxDays } from '../utils/constants.js';
import { Card, SectionHeading, GoldButton } from '../components/layout/UI.js';
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
                        <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
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
                    ⚑ Your Share Is Suspended
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
                                    <span style={{ color: COLORS.gold, marginTop: 1 }}>◈</span>
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
                                <span style={{ fontSize: 12, color: COLORS.green }}>✓ {evidenceFile}</span>
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

'@ | Set-Content -Path 'src\screens\AppealScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/DeathConfirmationScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { COLORS, FONTS, blocksToApproxDays } from '../utils/constants.js';
import { Card, SectionHeading, GoldButton, StatusPill, Divider } from '../components/layout/UI.js';
import { MOCK_VAULT, CURRENT_BLOCK } from '../data/mockData.js';

type Stage = 'idle' | 'certificate_uploaded' | 'awaiting_confirmation' | 'window_open' | 'window_closed';

export function DeathConfirmationScreen(): React.ReactElement {
    const vault = MOCK_VAULT;
    const [stage, setStage] = useState<Stage>('idle');
    const [certFile, setCertFile] = useState('');
    const [fraudEvidence, setFraudEvidence] = useState('');
    const [fraudFlagged, setFraudFlagged] = useState(false);
    const [fraudFile, setFraudFile] = useState('');

    const simulateWindowOpen = (): void => {
        setStage('window_open');
    };

    const windowEndsAtBlock = CURRENT_BLOCK + 432n;
    const blocksLeft = windowEndsAtBlock - CURRENT_BLOCK;
    const hoursLeft = Math.round(Number(blocksLeft) * 10 / 60);

    return (
        <div style={{ padding: '48px 40px', maxWidth: 800, margin: '0 auto' }}>
            <SectionHeading subtitle="Death-triggered unlock — the only way to release the vault">
                Vault Unlock
            </SectionHeading>

            {/* Current status */}
            <Card style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                            {vault.name}
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 22, color: COLORS.ivory }}>
                            Current Vault Status
                        </div>
                    </div>
                    <StatusPill status={stage === 'window_open' ? 'WINDOW_OPEN' : stage === 'awaiting_confirmation' ? 'UNLOCK_INITIATED' : 'ACTIVE'} />
                </div>
            </Card>

            {/* Step 1 — Upload death certificate */}
            <Card style={{ marginBottom: 16, opacity: stage !== 'idle' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        border: `1px solid ${stage !== 'idle' ? COLORS.green : COLORS.gold}`,
                        background: stage !== 'idle' ? COLORS.green : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: stage !== 'idle' ? COLORS.obsidian : COLORS.gold,
                    }}>
                        {stage !== 'idle' ? '✓' : '1'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                            Upload Death Certificate
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.6 }}>
                            Any registered party (beneficiary or executor) can initiate unlock by uploading the death certificate. The document hash is stored on-chain.
                        </div>
                        {stage === 'idle' && (
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                <label style={{
                                    padding: '10px 20px', border: `1px solid ${COLORS.border}`,
                                    color: COLORS.ivory, fontFamily: FONTS.body, fontSize: 13, cursor: 'pointer',
                                    background: COLORS.mid,
                                }}>
                                    Select Certificate (PDF)
                                    <input type="file" accept=".pdf" style={{ display: 'none' }}
                                        onChange={(e) => setCertFile(e.target.files?.[0]?.name ?? '')} />
                                </label>
                                {certFile && <span style={{ fontSize: 12, color: COLORS.green }}>✓ {certFile}</span>}
                                <GoldButton
                                    onClick={() => setStage('certificate_uploaded')}
                                    disabled={!certFile}
                                >
                                    Submit Certificate
                                </GoldButton>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Step 2 — Executor co-confirms */}
            <Card style={{ marginBottom: 16, opacity: stage === 'idle' ? 0.4 : stage !== 'idle' && stage !== 'certificate_uploaded' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        border: `1px solid ${stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? COLORS.green : COLORS.border}`,
                        background: stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? COLORS.green : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                        color: stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? COLORS.obsidian : COLORS.muted,
                    }}>
                        {stage === 'awaiting_confirmation' || stage === 'window_open' || stage === 'window_closed' ? '✓' : '2'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                            Executor Co-Confirms On-Chain
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.6 }}>
                            The lawyer independently verifies the death certificate and confirms on-chain. This opens the 72-hour dispute window.
                        </div>
                        {stage === 'certificate_uploaded' && (
                            <GoldButton onClick={() => { setStage('awaiting_confirmation'); setTimeout(simulateWindowOpen, 1200); }}>
                                Confirm Death (Executor)
                            </GoldButton>
                        )}
                        {(stage === 'window_open' || stage === 'window_closed') && (
                            <div style={{ fontSize: 12, color: COLORS.green }}>✓ Confirmed at block {CURRENT_BLOCK.toLocaleString()}</div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Step 3 — 72-hour dispute window */}
            {(stage === 'window_open' || stage === 'window_closed') && (
                <Card accent={fraudFlagged ? 'red' : 'gold'} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{
                            width: 36, height: 36, flexShrink: 0,
                            border: `1px solid ${stage === 'window_closed' ? COLORS.green : COLORS.gold}`,
                            background: stage === 'window_closed' ? COLORS.green : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, color: stage === 'window_closed' ? COLORS.obsidian : COLORS.gold,
                        }}>
                            {stage === 'window_closed' ? '✓' : '3'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                                72-Hour Dispute Window
                            </div>

                            {/* Countdown */}
                            <div style={{
                                padding: '16px 20px', background: COLORS.mid, border: `1px solid ${COLORS.border}`,
                                marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
                            }}>
                                <div>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                        Window Closes At Block
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.gold }}>
                                        {windowEndsAtBlock.toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                        Approx. Time Remaining
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>
                                        ~{hoursLeft}h / {blocksToApproxDays(blocksLeft)}d
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                        Blocks Remaining
                                    </div>
                                    <div style={{ fontFamily: FONTS.heading, fontSize: 28, color: COLORS.ivory }}>
                                        {blocksLeft.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Fraud flag section */}
                            {!fraudFlagged ? (
                                <div>
                                    <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12, lineHeight: 1.6 }}>
                                        Any registered signer may flag fraud during this window. Evidence is required — this is not a tap-to-dispute.
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <label style={{
                                            padding: '8px 16px', border: `1px solid ${COLORS.red}50`,
                                            color: COLORS.red, fontFamily: FONTS.body, fontSize: 12, cursor: 'pointer',
                                            background: `${COLORS.red}08`,
                                        }}>
                                            Upload Evidence
                                            <input type="file" style={{ display: 'none' }}
                                                onChange={(e) => setFraudFile(e.target.files?.[0]?.name ?? '')} />
                                        </label>
                                        {fraudFile && (
                                            <GoldButton
                                                variant="danger"
                                                onClick={() => setFraudFlagged(true)}
                                            >
                                                ⚑ Flag as Fraud
                                            </GoldButton>
                                        )}
                                        {!fraudFile && (
                                            <div style={{ fontSize: 11, color: COLORS.mutedDark }}>
                                                Evidence document required to flag fraud
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '12px 16px', border: `1px solid ${COLORS.red}`, background: `${COLORS.red}10` }}>
                                    <div style={{ fontSize: 12, color: COLORS.red, marginBottom: 4 }}>⚑ Fraud Flag Active</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>
                                        Evidence uploaded. The executor has been notified. The window will not auto-close until this is resolved.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Step 4 — What happens after */}
            <Card style={{ opacity: stage === 'window_open' || stage === 'window_closed' ? 1 : 0.4 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        border: `1px solid ${COLORS.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: COLORS.muted,
                    }}>
                        4
                    </div>
                    <div>
                        <div style={{ fontSize: 15, color: COLORS.ivory, marginBottom: 6, fontWeight: 500 }}>
                            After Window Closes
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>
                            <div style={{ marginBottom: 6 }}>→ Balance snapshot taken at that exact moment</div>
                            <div style={{ marginBottom: 6 }}>→ Executor fee auto-transferred first ({MOCK_VAULT.executor.feePercent / 100}%)</div>
                            <div style={{ marginBottom: 6 }}>→ Executor authorised to decrypt the will</div>
                            <div>→ Per-child transfers initiated independently</div>
                        </div>
                    </div>
                </div>
            </Card>

            {fraudEvidence && <div style={{ display: 'none' }}>{fraudEvidence}</div>}
        </div>
    );
}

'@ | Set-Content -Path 'src\screens\DeathConfirmationScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/DepositHistoryScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { COLORS, FONTS, formatBTC } from '../utils/constants.js';
import { Card, SectionHeading, GoldButton, StatusPill } from '../components/layout/UI.js';
import { MOCK_VAULT } from '../data/mockData.js';

export function DepositHistoryScreen(): React.ReactElement {
    const vault = MOCK_VAULT;
    const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set());

    const handleAcknowledge = (index: number): void => {
        setAcknowledged((prev) => new Set([...prev, index]));
    };

    const allDeposits = vault.deposits.map((d) => ({
        ...d,
        lawyerAcknowledged: d.lawyerAcknowledged || acknowledged.has(d.index),
    }));

    const totalAcknowledged = allDeposits.filter((d) => d.lawyerAcknowledged).reduce((s, d) => s + d.amountSatoshis, 0n);
    const totalPending = allDeposits.filter((d) => !d.lawyerAcknowledged).reduce((s, d) => s + d.amountSatoshis, 0n);

    return (
        <div style={{ padding: '48px 48px', maxWidth: 1000, margin: '0 auto' }}>
            <SectionHeading subtitle="On-chain log of all vault deposits and withdrawals">
                Deposit & Withdrawal History
            </SectionHeading>

            {/* Summary row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                <Card accent="gold">
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Total Deposited</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.gold }}>
                        {formatBTC(vault.balanceSatoshis)}
                    </div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Acknowledged</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: COLORS.green }}>
                        {formatBTC(totalAcknowledged)}
                    </div>
                </Card>
                <Card>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Pending Acknowledgment</div>
                    <div style={{ fontFamily: FONTS.heading, fontSize: 32, color: totalPending > 0n ? COLORS.gold : COLORS.muted }}>
                        {formatBTC(totalPending)}
                    </div>
                </Card>
            </div>

            {/* Deposit log */}
            <Card>
                <div style={{ fontSize: 13, color: COLORS.ivory, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 20 }}>
                    Transaction Log
                </div>

                {/* Header row */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 180px 140px',
                    padding: '8px 14px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5,
                    gap: 12,
                }}>
                    <div>#</div>
                    <div>Transaction Hash</div>
                    <div>Amount</div>
                    <div>Block</div>
                    <div>Lawyer Status</div>
                    <div></div>
                </div>

                {allDeposits.map((deposit) => (
                    <div
                        key={deposit.index}
                        style={{
                            display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 180px 140px',
                            padding: '16px 14px',
                            borderBottom: `1px solid ${COLORS.border}`,
                            alignItems: 'center', gap: 12,
                            background: !deposit.lawyerAcknowledged ? `${COLORS.gold}05` : 'transparent',
                        }}
                    >
                        <div style={{ fontSize: 13, color: COLORS.muted }}>#{deposit.index + 1}</div>
                        <div style={{ fontSize: 11, color: COLORS.ivory, fontFamily: 'monospace', wordBreak: 'break-all', minWidth: 0 }}>
                            {deposit.txHash.slice(0, 20)}...{deposit.txHash.slice(-8)}
                        </div>
                        <div style={{ fontFamily: FONTS.heading, fontSize: 18, color: COLORS.gold }}>
                            {formatBTC(deposit.amountSatoshis)}
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: 'monospace' }}>
                            {deposit.blockNumber.toLocaleString()}
                        </div>
                        <div>
                            {deposit.lawyerAcknowledged ? (
                                <StatusPill status="COMPLETE" />
                            ) : (
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '3px 10px', borderRadius: 999,
                                    fontSize: 11, color: COLORS.gold,
                                    background: `${COLORS.gold}18`,
                                    border: `1px solid ${COLORS.gold}50`,
                                    fontFamily: FONTS.body, fontWeight: 500,
                                    textTransform: 'uppercase', letterSpacing: 0.5,
                                }}>
                                    ⏳ Pending
                                </div>
                            )}
                        </div>
                        <div>
                            {!deposit.lawyerAcknowledged && (
                                <GoldButton
                                    onClick={() => handleAcknowledge(deposit.index)}
                                    variant="ghost"
                                >
                                    Acknowledge
                                </GoldButton>
                            )}
                        </div>
                    </div>
                ))}
            </Card>

            <div style={{ marginTop: 16, fontSize: 12, color: COLORS.mutedDark, lineHeight: 1.8 }}>
                All deposits are recorded on-chain. Lawyer acknowledgment creates a permanent audit trail documenting each addition to the estate. BTC only — no fiat conversions.
            </div>
        </div>
    );
}

'@ | Set-Content -Path 'src\screens\DepositHistoryScreen.tsx' -Encoding UTF8

Write-Host 'Creating src/screens/VaultCertificateScreen.tsx...' -ForegroundColor Yellow
@'
import { useState } from 'react';
import { COLORS, FONTS, formatSharePercent } from '../utils/constants.js';
import { Card, SectionHeading, GoldButton, Divider } from '../components/layout/UI.js';
import { MOCK_VAULT } from '../data/mockData.js';

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
                    {downloading ? '⟳ Generating PDF...' : downloaded ? '✓ Downloaded' : 'Download PDF'}
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
                            BITCOIN INHERITANCE VAULT · OP_NET TESTNET
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

'@ | Set-Content -Path 'src\screens\VaultCertificateScreen.tsx' -Encoding UTF8

Write-Host '' 
Write-Host 'Done! Now run: npm run dev' -ForegroundColor Green