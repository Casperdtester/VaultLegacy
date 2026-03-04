import { useState, useEffect, useCallback } from 'react';
import { getVault, getMyVaults, getCheckInStatus, getDeathWindow, getTransfers } from '../api/client';
import { useWallet } from '../context/WalletContext';

export function useVault(vaultId) {
    const { getHeaders } = useWallet();
    const [vault, setVault] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        if (!vaultId) return;
        setLoading(true);
        try {
            const data = await getVault(vaultId, getHeaders());
            setVault(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [vaultId, getHeaders]);

    useEffect(() => { fetch(); }, [fetch]);
    return { vault, loading, error, refetch: fetch };
}

export function useBackendHealth() {
    const [online, setOnline] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3001/health')
            .then(r => r.json())
            .then(d => setOnline(d.status === 'ok'))
            .catch(() => setOnline(false));
    }, []);
    return online;
}
