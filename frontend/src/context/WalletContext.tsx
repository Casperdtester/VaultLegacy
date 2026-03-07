import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getAuthHeaders } from '../api/client';

export type UserRole = 'owner' | 'executor' | 'beneficiary';

interface WalletState {
    connected: boolean;
    address: string;
    role: UserRole | null;
    vaultId: string | null;
    currentBlock: number;
}

interface WalletContextValue extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
    setRole: (role: UserRole, vaultId?: string) => void;
    getHeaders: () => HeadersInit;
    isConnecting: boolean;
    error: string | null;
}

const WalletContext = createContext<WalletContextValue | null>(null);

async function loadOPWallet() {
    try {
        const mod = await import('@btc-vision/walletconnect');
        return mod;
    } catch (e) {
        console.warn('[VaultLegacy] @btc-vision/walletconnect failed to load:', e);
        return null;
    }
}

export function WalletProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [role, setRoleState] = useState<UserRole | null>(null);
    const [vaultId, setVaultId] = useState<string | null>(null);
    const [currentBlock, setCurrentBlock] = useState(890000);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [opMod, setOpMod] = useState<any>(null);

    useEffect(() => {
        loadOPWallet().then(setOpMod);
    }, []);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('vl_role');
            if (saved) {
                const parsed = JSON.parse(saved);
                setRoleState(parsed.role ?? null);
                setVaultId(parsed.vaultId ?? null);
            }
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setCurrentBlock((b) => b + 1), 10000);
        return () => clearInterval(interval);
    }, []);

    const connect = useCallback(async () => {
        setIsConnecting(true);
        setError(null);
        try {
            const win = window as any;
            // Check if OP_WALLET extension is present
            if (!win.opnet && !win.bitcoin) {
                setError('OP_WALLET extension is not installed. Please install it from the Chrome Web Store.');
                setIsConnecting(false);
                return;
            }

            // Try direct window.opnet access (OP_WALLET extension API)
            if (win.opnet?.requestAccounts) {
                const accounts = await win.opnet.requestAccounts();
                if (accounts?.[0]) {
                    setAddress(accounts[0]);
                    setConnected(true);
                    return;
                }
            }

            // Try window.bitcoin (alternative OP_WALLET API)
            if (win.bitcoin?.requestAccounts) {
                const accounts = await win.bitcoin.requestAccounts();
                if (accounts?.[0]) {
                    setAddress(accounts[0]);
                    setConnected(true);
                    return;
                }
            }

            throw new Error('Could not retrieve account from OP_WALLET. Please try again.');
        } catch (err: any) {
            const msg = err?.message ?? 'Connection failed';
            if (msg.includes('rejected') || msg.includes('cancelled') || msg.includes('denied')) {
                setError('Connection rejected. Please approve the request in OP_WALLET.');
            } else if (msg.includes('not installed') || msg.includes('extension')) {
                setError('OP_WALLET extension is not installed. Please install it from the Chrome Web Store.');
            } else {
                setError(msg);
            }
        } finally {
            setIsConnecting(false);
        }
    }, [opMod]);

    const disconnect = useCallback(() => {
        setConnected(false);
        setAddress('');
        setRoleState(null);
        setVaultId(null);
        sessionStorage.removeItem('vl_role');
    }, []);

    const setRole = useCallback((newRole: UserRole, newVaultId?: string) => {
        setRoleState(newRole);
        setVaultId(newVaultId ?? null);
        sessionStorage.setItem('vl_role', JSON.stringify({ role: newRole, vaultId: newVaultId ?? null }));
    }, []);

    const getHeaders = useCallback((): HeadersInit => {
        if (!connected || !address) return { 'Content-Type': 'application/json' };
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = `testnet_${address.slice(0, 12)}_${timestamp}`;
        return getAuthHeaders(address, signature);
    }, [connected, address]);

    return (
        <WalletContext.Provider value={{ connected, address, role, vaultId, currentBlock, connect, disconnect, setRole, getHeaders, isConnecting, error }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet(): WalletContextValue {
    const ctx = useContext(WalletContext);
    if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
    return ctx;
}
