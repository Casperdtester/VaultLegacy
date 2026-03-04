# VaultLegacy — Backend Service

Orchestration backend for the VaultLegacy Bitcoin inheritance vault. Handles dead man's switch monitoring, death confirmation flow, per-beneficiary transfer management, conditional inheritance appeals, and multi-channel notifications.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Scheduler:** node-cron
- **Email:** Nodemailer
- **SMS:** Twilio (optional)
- **Network:** OP_NET Testnet

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `SMTP_USER` and `SMTP_PASS` — Gmail App Password for email notifications
- `TWILIO_*` — Twilio credentials for SMS (optional, leave blank to disable)
- `FRONTEND_URL` — Your frontend URL (default: http://localhost:5173)

### 3. Start development server

```bash
npm run dev
```

Server starts at `http://localhost:3001`

### 4. Verify health

```
GET http://localhost:3001/health
```

## Authentication

Every API request (except `/api/sign/:token`) requires three headers:

```
x-wallet-address:   bc1p... (Bitcoin address)
x-wallet-signature: <signature of message>
x-wallet-message:   VaultLegacy auth — timestamp: <unix timestamp>
```

The backend verifies the signature cryptographically. No passwords. No JWTs.

## Background Jobs

| Job | Frequency | Purpose |
|-----|-----------|---------|
| Dead Man's Switch | every 10 min | Monitors check-in deadlines, notifies owner/executor |
| Death Window | every 5 min | Closes 72h dispute window, pays lawyer fee |
| Appeal Timeout | every 30 min | Auto-redirects to charity after 30-day window |
| Notification Dispatch | every 2 min | Sends pending email/SMS notifications |

## API Reference

### Vaults
```
POST   /api/vaults                          Create vault after on-chain deploy
GET    /api/vaults                          Get all vaults for authenticated wallet
GET    /api/vaults/:id                      Get vault state (role-based visibility)
PUT    /api/vaults/:id/balance              Sync balance from chain
```

### Check-ins
```
POST   /api/vaults/:id/checkin              Record owner check-in
GET    /api/vaults/:id/checkin/status       Get countdown status
```

### Deposits
```
POST   /api/vaults/:id/deposits             Record deposit
PUT    /api/vaults/:id/deposits/:i/acknowledge  Executor acknowledges
GET    /api/vaults/:id/deposits             Get history
```

### Death Confirmation
```
POST   /api/vaults/:id/death/initiate       Upload death certificate hash
POST   /api/vaults/:id/death/confirm        Executor co-confirms
POST   /api/vaults/:id/death/fraud          Flag fraud with evidence
GET    /api/vaults/:id/death/window         72h window status
```

### Transfers
```
POST   /api/vaults/:id/transfers/:benId/initiate    Executor initiates
POST   /api/vaults/:id/transfers/:benId/cosign      Beneficiary co-signs
GET    /api/vaults/:id/transfers                    All transfer statuses
```

### Appeals
```
POST   /api/vaults/:id/appeals/:benId/suspend       Executor suspends
POST   /api/vaults/:id/appeals/:benId/evidence      Beneficiary submits evidence
PUT    /api/vaults/:id/appeals/:benId/review        Executor decides: REINSTATE|REDIRECT
GET    /api/vaults/:id/appeals/:benId               Appeal status
```

### Signing
```
GET    /api/sign/:token     Get signing session (no auth — token IS auth)
POST   /api/sign/:token     Submit signed PSBT
POST   /api/vaults/:id/contacts    Register email/phone for notifications
```

## Security Notes

- Backend never holds private keys
- Backend never holds unencrypted will documents
- Will hash stored on-chain — backend only stores reference
- Signing tokens expire after 72 hours and are single-use
- CORS locked to frontend URL only
- Rate limiting: 100 req/min global, 30 req/min on vault endpoints
- All file uploads: SHA-256 hash computed, hash goes on-chain

## Folder Structure

```
src/
├── index.ts              Express app + startup
├── db/
│   └── database.ts       SQLite connection + schema
├── routes/
│   ├── vaults.ts         Vault CRUD
│   ├── operations.ts     Check-ins, deposits, death confirmation
│   ├── transfers.ts      Per-child transfers + appeals
│   └── signing.ts        PSBT sessions + contact registration
├── services/
│   ├── NotificationService.ts     Email + SMS dispatcher
│   ├── DeadMansSwitchService.ts   Check-in monitoring
│   └── WindowService.ts           Death window + appeal timeouts
├── jobs/
│   └── scheduler.ts      Cron job registration
├── middleware/
│   ├── auth.ts           Wallet signature verification
│   └── errors.ts         Error handler + rate limiter
└── types/
    └── index.ts          Shared TypeScript types
```
