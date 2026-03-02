import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { COLORS, FONTS } from '../../utils/constants';
import type { UserRole } from '../../types/index';

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

