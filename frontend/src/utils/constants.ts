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

