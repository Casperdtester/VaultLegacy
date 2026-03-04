import cron from 'node-cron';
import { runDeadMansSwitchCheck } from '../services/DeadMansSwitchService.js';
import { runDeathWindowCheck, runAppealTimeoutCheck } from '../services/WindowService.js';
import { sendPendingNotifications } from '../services/NotificationService.js';

// Simulated current block — in production this comes from OP_NET RPC
let simulatedBlock = 890000;

function getCurrentBlock(): number {
    // Increment by ~1 block every 10 minutes to simulate Bitcoin block production
    simulatedBlock += 1;
    return simulatedBlock;
}

export function startScheduler(): void {
    console.log('⏰ Starting VaultLegacy background job scheduler...');

    // ── Dead Man's Switch Monitor — every 10 minutes ──────────────────────────
    cron.schedule('*/10 * * * *', async () => {
        try {
            const block = getCurrentBlock();
            console.log(`[DMS] Running dead man's switch check at block ~${block}`);
            await runDeadMansSwitchCheck(block);
        } catch (err) {
            console.error('[DMS] Dead man\'s switch check failed:', err);
        }
    });

    // ── Death Window Monitor — every 5 minutes ────────────────────────────────
    cron.schedule('*/5 * * * *', async () => {
        try {
            const block = getCurrentBlock();
            console.log(`[WINDOW] Running death window check at block ~${block}`);
            await runDeathWindowCheck(block);
        } catch (err) {
            console.error('[WINDOW] Death window check failed:', err);
        }
    });

    // ── Appeal Timeout Monitor — every 30 minutes ─────────────────────────────
    cron.schedule('*/30 * * * *', async () => {
        try {
            const block = getCurrentBlock();
            console.log(`[APPEAL] Running appeal timeout check at block ~${block}`);
            await runAppealTimeoutCheck(block);
        } catch (err) {
            console.error('[APPEAL] Appeal timeout check failed:', err);
        }
    });

    // ── Notification Dispatcher — every 2 minutes ─────────────────────────────
    cron.schedule('*/2 * * * *', async () => {
        try {
            await sendPendingNotifications();
        } catch (err) {
            console.error('[NOTIFY] Notification dispatch failed:', err);
        }
    });

    console.log('✓ Scheduler started — 4 jobs registered');
    console.log('  · Dead man\'s switch monitor: every 10 min');
    console.log('  · Death window monitor:       every 5 min');
    console.log('  · Appeal timeout monitor:     every 30 min');
    console.log('  · Notification dispatcher:    every 2 min');
}
