import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSchema } from './db/database.js';
import { startScheduler } from './jobs/scheduler.js';
import { errorHandler, notFound, rateLimit } from './middleware/errors.js';
import { vaultsRouter } from './routes/vaults.js';
import { checkInsRouter, depositsRouter, deathRouter } from './routes/operations.js';
import { transfersRouter, appealsRouter } from './routes/transfers.js';
import { contactsRouter, psbtRouter } from './routes/signing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 3001;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────

// CORS — only allow requests from the VaultLegacy frontend
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:3000',
        ];
        // Allow requests with no origin (mobile apps, Postman in dev)
        if (!origin || allowed.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-wallet-address',
        'x-wallet-signature',
        'x-wallet-message',
    ],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limit — 100 requests per minute per IP
app.use(rateLimit(100, 60 * 1000));

// Stricter rate limit on sensitive endpoints
app.use('/api/vaults', rateLimit(30, 60 * 1000));
app.use('/api/sign', rateLimit(20, 60 * 1000));

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'VaultLegacy Backend',
        network: process.env.OPNET_NETWORK ?? 'testnet',
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/vaults', vaultsRouter);

// Check-ins and deposits — mounted on vaults prefix
app.use('/api/vaults', checkInsRouter);
app.use('/api/vaults', depositsRouter);
app.use('/api/vaults', deathRouter);
app.use('/api/vaults', transfersRouter);
app.use('/api/vaults', appealsRouter);
app.use('/api/vaults', contactsRouter);

// PSBT signing — public token-based endpoint
app.use('/api', psbtRouter);

// ─── Error Handling ───────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─── Startup ──────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
    try {
        // Initialize SQLite schema
        initSchema();

        // Start background job scheduler
        startScheduler();

        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('╔══════════════════════════════════════════╗');
            console.log('║        VAULTLEGACY BACKEND SERVICE        ║');
            console.log('╠══════════════════════════════════════════╣');
            console.log(`║  Server:   http://localhost:${PORT}          ║`);
            console.log(`║  Network:  OP_NET ${(process.env.OPNET_NETWORK ?? 'testnet').padEnd(22)}║`);
            console.log(`║  Env:      ${(process.env.NODE_ENV ?? 'development').padEnd(30)}║`);
            console.log('╚══════════════════════════════════════════╝');
            console.log('');
            console.log('Routes registered:');
            console.log('  GET  /health');
            console.log('  POST /api/vaults');
            console.log('  GET  /api/vaults/:id');
            console.log('  POST /api/vaults/:id/checkin');
            console.log('  GET  /api/vaults/:id/checkin/status');
            console.log('  POST /api/vaults/:id/deposits');
            console.log('  PUT  /api/vaults/:id/deposits/:index/acknowledge');
            console.log('  POST /api/vaults/:id/death/initiate');
            console.log('  POST /api/vaults/:id/death/confirm');
            console.log('  POST /api/vaults/:id/death/fraud');
            console.log('  GET  /api/vaults/:id/death/window');
            console.log('  POST /api/vaults/:id/transfers/:benId/initiate');
            console.log('  POST /api/vaults/:id/transfers/:benId/cosign');
            console.log('  GET  /api/vaults/:id/transfers');
            console.log('  POST /api/vaults/:id/appeals/:benId/suspend');
            console.log('  POST /api/vaults/:id/appeals/:benId/evidence');
            console.log('  PUT  /api/vaults/:id/appeals/:benId/review');
            console.log('  GET  /api/vaults/:id/appeals/:benId');
            console.log('  POST /api/vaults/:id/contacts');
            console.log('  GET  /api/sign/:token');
            console.log('  POST /api/sign/:token');
            console.log('');
        });
    } catch (err) {
        console.error('Failed to start VaultLegacy backend:', err);
        process.exit(1);
    }
}

start();
