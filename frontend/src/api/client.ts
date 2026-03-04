const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export function getAuthHeaders(walletAddress, signature) {
    const timestamp = Math.floor(Date.now() / 1000);
    return {
        'Content-Type': 'application/json',
        'x-wallet-address': walletAddress,
        'x-wallet-signature': signature,
        'x-wallet-message': `VaultLegacy auth — timestamp: ${timestamp}`,
    };
}

async function apiFetch(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Request failed');
    return data;
}

export async function checkHealth() {
    try { const d = await apiFetch('/health'); return d.status === 'ok'; } catch { return false; }
}
export async function getVault(vaultId, headers) { return apiFetch(`/api/vaults/${vaultId}`, { headers }); }
export async function getMyVaults(headers) { const d = await apiFetch('/api/vaults', { headers }); return d.vaults; }
export async function submitCheckIn(vaultId, blockNumber, txHash, headers) { return apiFetch(`/api/vaults/${vaultId}/checkin`, { method: 'POST', headers, body: JSON.stringify({ blockNumber, txHash }) }); }
export async function getCheckInStatus(vaultId, currentBlock, headers) { return apiFetch(`/api/vaults/${vaultId}/checkin/status?currentBlock=${currentBlock}`, { headers }); }
export async function recordDeposit(vaultId, payload, headers) { return apiFetch(`/api/vaults/${vaultId}/deposits`, { method: 'POST', headers, body: JSON.stringify(payload) }); }
export async function acknowledgeDeposit(vaultId, index, headers) { return apiFetch(`/api/vaults/${vaultId}/deposits/${index}/acknowledge`, { method: 'PUT', headers, body: JSON.stringify({}) }); }
export async function getDeposits(vaultId, headers) { return apiFetch(`/api/vaults/${vaultId}/deposits`, { headers }); }
export async function initiateDeath(vaultId, deathCertificateHash, blockNumber, headers) { return apiFetch(`/api/vaults/${vaultId}/death/initiate`, { method: 'POST', headers, body: JSON.stringify({ deathCertificateHash, blockNumber }) }); }
export async function confirmDeath(vaultId, blockNumber, headers) { return apiFetch(`/api/vaults/${vaultId}/death/confirm`, { method: 'POST', headers, body: JSON.stringify({ blockNumber }) }); }
export async function flagFraud(vaultId, evidenceHash, blockNumber, headers) { return apiFetch(`/api/vaults/${vaultId}/death/fraud`, { method: 'POST', headers, body: JSON.stringify({ evidenceHash, blockNumber }) }); }
export async function getDeathWindow(vaultId, currentBlock, headers) { return apiFetch(`/api/vaults/${vaultId}/death/window?currentBlock=${currentBlock}`, { headers }); }
export async function initiateTransfer(vaultId, benId, amountSatoshis, headers) { return apiFetch(`/api/vaults/${vaultId}/transfers/${benId}/initiate`, { method: 'POST', headers, body: JSON.stringify({ amountSatoshis }) }); }
export async function coSignTransfer(vaultId, benId, signingToken, signedPsbtHex, headers) { return apiFetch(`/api/vaults/${vaultId}/transfers/${benId}/cosign`, { method: 'POST', headers, body: JSON.stringify({ signingToken, signedPsbtHex }) }); }
export async function getTransfers(vaultId, headers) { return apiFetch(`/api/vaults/${vaultId}/transfers`, { headers }); }
export async function suspendBeneficiary(vaultId, benId, blockNumber, reason, headers) { return apiFetch(`/api/vaults/${vaultId}/appeals/${benId}/suspend`, { method: 'POST', headers, body: JSON.stringify({ blockNumber, reason }) }); }
export async function submitAppealEvidence(vaultId, benId, evidenceHash, evidenceDescription, blockNumber, headers) { return apiFetch(`/api/vaults/${vaultId}/appeals/${benId}/evidence`, { method: 'POST', headers, body: JSON.stringify({ evidenceHash, evidenceDescription, blockNumber }) }); }
export async function reviewAppeal(vaultId, benId, decision, blockNumber, txHash, headers) { return apiFetch(`/api/vaults/${vaultId}/appeals/${benId}/review`, { method: 'PUT', headers, body: JSON.stringify({ decision, blockNumber, txHash }) }); }
export async function getSigningSession(token) { return apiFetch(`/api/sign/${token}`); }
export async function submitSignedPsbt(token, signedPsbtHex) { return apiFetch(`/api/sign/${token}`, { method: 'POST', body: JSON.stringify({ signedPsbtHex }) }); }
export async function registerContact(vaultId, address, role, email, phone, headers) { return apiFetch(`/api/vaults/${vaultId}/contacts`, { method: 'POST', headers, body: JSON.stringify({ address, role, email, phone }) }); }
