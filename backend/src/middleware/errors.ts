import type { Request, Response, NextFunction } from 'express';

// ─── Error Handler ────────────────────────────────────────────────────────────

export interface AppError extends Error {
    statusCode?: number;
    details?: string;
}

export function errorHandler(
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Internal server error';

    console.error(`[ERROR] ${statusCode} — ${message}`, err.stack);

    res.status(statusCode).json({
        error: message,
        details: err.details,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

export function notFound(_req: Request, res: Response): void {
    res.status(404).json({ error: 'Route not found' });
}

// ─── Simple In-Memory Rate Limiter ────────────────────────────────────────────

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const key = req.ip ?? 'unknown';
        const now = Date.now();
        const entry = requestCounts.get(key);

        if (!entry || now > entry.resetAt) {
            requestCounts.set(key, { count: 1, resetAt: now + windowMs });
            next();
            return;
        }

        if (entry.count >= maxRequests) {
            res.status(429).json({
                error: 'Too many requests',
                details: `Rate limit: ${maxRequests} requests per ${windowMs / 1000}s`,
                retryAfter: Math.ceil((entry.resetAt - now) / 1000),
            });
            return;
        }

        entry.count++;
        next();
    };
}

// Clean up rate limit map every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of requestCounts.entries()) {
        if (now > entry.resetAt) requestCounts.delete(key);
    }
}, 5 * 60 * 1000);
