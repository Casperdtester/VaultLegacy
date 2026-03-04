import { createContext, useContext, useState, useCallback } from 'react';
import { getAuthHeaders } from '../api/client';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
    const [wallet, setWallet] = useState({ connected: false, address: '', role: null, vaultId: null });
    const currentBlock = 890000;

    const connect = useCallback((address, role, vaultId) => {
        setWallet({ connected: true, address, role, vaultId: vaultId ?? null });
        sessionStorage.setItem('vl_wallet', JSON.stringify({ address, role, vaultId }));
    }, []);

    const disconnect = useCallback(() => {
        setWallet({ connected: false, address: '', role: null, vaultId: null });
        sessionStorage.removeItem('vl_wallet');
    }, []);

    const getHeaders = useCallback(() => {
        if (!wallet.connected) return { 'Content-Type': 'application/json' };
        const sig = `sig_${wallet.address.slice(0, 10)}_${Math.floor(Date.now() / 1000)}`;
        return getAuthHeaders(wallet.address, sig);
    }, [wallet]);

    return (
        <WalletContext.Provider value={{ ...wallet, connect, disconnect, getHeaders, currentBlock }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const ctx = useContext(WalletContext);
    if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
    return ctx;
}
