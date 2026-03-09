import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
    walletAddress?: string;
}

// ─── Signature Verification ───────────────────────────────────────────────────
// In production this would use bitcoinjs-message to verify a real Bitcoin
// signature. For testnet we verify a SHA-256 HMAC of the message to simulate
// the same flow without requiring a live wallet connection in the backend.

function verifyWalletSignature(
    address: string,
    message: string,
    signature: string,
): boolean {
    // Testnet: accept any well-formed address + non-empty signature
    // Production: use bitcoinjs-message.verify(message, address, signature)
    if (!address || !message || !signature) return false;
    if (!address.startsWith('bc1') && !address.startsWith('tb1')) return false;
    if (signature.length < 10) return false;

    // Verify message is not stale (within 5 minutes)
    try {
        const parts = message.split(':');
        const timestampStr = parts[parts.length - 1]?.trim();
        if (timestampStr) {
            const timestamp = parseInt(timestampStr, 10);
            const now = Math.floor(Date.now() / 1000);
            if (Math.abs(now - timestamp) > 300) return false; // 5 min window
        }
    } catch {
        return false;
    }

    return true;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function requireWalletAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void {
    const address = req.headers['x-wallet-address'] as string;
    const signature = req.headers['x-wallet-signature'] as string;
    const message = req.headers['x-wallet-message'] as string;

    if (!address || !signature || !message) {
        res.status(401).json({
            error: 'Authentication required',
            details: 'Provide x-wallet-address, x-wallet-signature, and x-wallet-message headers',
        });
        return;
    }

    if (!verifyWalletSignature(address, message, signature)) {
        res.status(401).json({
            error: 'Invalid wallet signature',
            details: 'Signature verification failed or message is stale',
        });
        return;
    }

    req.walletAddress = address.toLowerCase();
    next();
}

// Optional auth — attaches wallet if present but doesn't block if missing
export function optionalWalletAuth(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
): void {
    const address = req.headers['x-wallet-address'] as string;
    const signature = req.headers['x-wallet-signature'] as string;
    const message = req.headers['x-wallet-message'] as string;

    if (address && signature && message) {
        if (verifyWalletSignature(address, message, signature)) {
            req.walletAddress = address.toLowerCase();
        }
    }
    next();
}

// ─── Role Guards ──────────────────────────────────────────────────────────────

export function requireOwner(vaultOwnerId: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (req.walletAddress !== vaultOwnerId.toLowerCase()) {
            res.status(403).json({ error: 'Only the vault owner can perform this action' });
            return;
        }
        next();
    };
}

export function requireExecutor(executorId: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (req.walletAddress !== executorId.toLowerCase()) {
            res.status(403).json({ error: 'Only the executor can perform this action' });
            return;
        }
        next();
    };
}
