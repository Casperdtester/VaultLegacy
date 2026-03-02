# VaultLegacy

> **The world's first will-based Bitcoin inheritance vault.**
> Death-triggered. Multi-beneficiary. Lawyer-executed. Built on OP_NET Bitcoin Layer 1.

## Overview

VaultLegacy is a Bitcoin inheritance vault built on **OP_NET Testnet** — Bitcoin's programmable layer. It solves the most underserved problem in crypto: what happens to your Bitcoin when you die?

Traditional estate planning does not account for self-custodied digital assets. No will covers a hardware wallet. No lawyer holds a seed phrase. No bank recovers a private key. Billions in Bitcoin disappear every year because no tool existed to transfer it faithfully.

VaultLegacy changes this.

## Repository Structure

| Branch | Contents |
|--------|---------|
| main | Project documentation, architecture, smart contract specs |
| eature/vault-frontend | React frontend — 10 screens, full routing, design system |
| eature/backend-service | Backend orchestration — dead man's switch, notifications, PSBT |

## The Problem

Over **\ billion in Bitcoin** has been permanently lost — most of it at death.

| Problem | Why It Matters |
|---------|---------------|
| No inheritance tooling exists | Traditional wills don't cover private keys |
| Multi-child complexity | Real families have multiple children, often across countries |
| No conditional logic | No tool lets an owner redirect a share to charity based on conduct |
| No lawyer integration | No Bitcoin product integrates a lawyer as a co-signing fiduciary |
| Single point of failure | One lost seed phrase erases a lifetime of savings |
| No audit trail | Owners can drain their estate secretly with no documentation |

## How It Works

An owner deposits Bitcoin into a smart contract vault, attaches an encrypted will defining each child's percentage share, registers a lawyer as executor with an agreed fee, and optionally attaches a conditional clause. Everything is deployed as an OP_NET smart contract on Bitcoin Layer 1 — immutable, auditable, and permanent.

The vault unlocks **only when the owner dies.** Not on a calendar date. Not on a timer. On a confirmed life event — exactly like real estate law.

### Phase 1 — Vault Creation
Owner connects wallet → Names vault → Adds lawyer + children + charity → Uploads encrypted will → Sets dead man's switch → Deploys to OP_NET Testnet → Certificate generated → All parties notified

### Phase 2 — While Owner is Alive
Owner deposits BTC → Lawyer acknowledges on-chain. Owner withdrawals → Lawyer co-signs. Owner checks in periodically → Dead man's switch resets.

### Phase 3 — Death Confirmation
Any party initiates unlock → uploads death certificate → Lawyer verifies → co-confirms on-chain → 72-hour dispute window → Lawyer fee auto-paid → Will decrypted → Per-child independent transfers

### Phase 4 — Distribution
For each child: Lawyer reviews conditional clause → If clear: transfer initiated → Child co-signs → BTC received. If suspended: 30-day appeal window → Sufficient evidence: reinstated. Insufficient or no evidence: redirected to charity permanently.

## Core Features

- **Will on Bitcoin** — Encrypted client-side with lawyer's public key. SHA-256 hash on-chain. Tamper-proof.
- **Death-Triggered Unlock** — No calendar dates. 72-hour dispute window. Fraud flags require evidence.
- **Lawyer as Executor** — Co-signing authority for every action. Fee locked at creation. Paid first.
- **Per-Child Independent Transfers** — 2-of-2 multisig per child. One child never blocks another.
- **Conditional Inheritance** — Define conditions per child. 30-day appeal. Failed appeals redirect to charity.
- **Dead Man's Switch** — 3 or 6 month check-in frequency. Miss 3 → executor notified automatically.
- **Remote Signer Support** — Overseas beneficiaries sign via secure link. PSBT abstracted. Hardware wallet supported.
- **Deposit Audit Trail** — Every top-up acknowledged by lawyer on-chain. Every withdrawal co-signed.

## Architecture

\\\
MASTER VAULT — OP_NET CONTRACT
        │
        ├── Encrypted Will (SHA-256 on-chain, lawyer key only)
        ├── Conditional Clause (SHA-256 on-chain, charity addr locked)
        │
        AT DEATH CONFIRMATION
        │
        ├── 72-hour window → Lawyer fee paid → Will read
        │
        DISTRIBUTION (per child, fully independent)
        ├── Child 1 — Local — Lawyer + child 2-of-2
        ├── Child 2 — Remote 🌍 — PSBT signing link
        └── Child 3 — Suspended — Appeal open → Charity fallback
\\\

## Smart Contract

Deployed on **OP_NET Testnet**.

### Key State Variables
\\\
vaultName, ownerPublicKey, executorPublicKey, executorFeePercent
beneficiaries[] → { name, address, sharePercent, status }
willHash (SHA-256), conditionalClauseHash (SHA-256)
charityAddress, checkInFrequency, lastCheckIn, missedCheckIns
vaultStatus: ACTIVE | UNLOCK_INITIATED | WINDOW_OPEN | FEE_PAID | EXECUTING | COMPLETE
vaultBalanceAtDeath (snapshot at death confirmation)
\\\

### Key Functions
\\\
createVault(), deposit(), acknowledgeTopUp(), initiateWithdrawal(), coSignWithdrawal()
checkIn(), missedCheckInAlert()
initiateUnlock(), confirmDeath(), flagFraud(), snapshotBalanceAtDeath()
payLawyerFee(), authorizeWillDecryption()
suspendBeneficiary(), submitAppealEvidence(), reviewAppeal(), autoRedirectToCharity()
initiateTransfer(), coSignTransfer(), executeTransfer()
\\\

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | OP_NET Testnet — Bitcoin Layer 1 |
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + SQLite |
| Wallet Connection | OP_NET wallet connect |
| Will Encryption | AES-256 + RSA client-side |
| Document Storage | IPFS — SHA-256 hash on OP_NET |
| Notifications | Email + SMS + Push |
| PSBT Handling | Backend abstraction |

## Balance Visibility Rules

| Party | What They See |
|-------|--------------|
| Owner | Full BTC balance — always |
| Executor | Full BTC balance — always |
| Beneficiary (alive) | Share percentage + vault status only |
| Beneficiary (distribution) | Their own BTC amount only |

No fiat conversion. No dollar values. **BTC only — everywhere — always.**

## Security

- AES-256 + RSA client-side encryption before any upload
- SHA-256 document hashes stored on Bitcoin Layer 1
- 2-of-2 multisig per child transfer (lawyer + child)
- 72-hour fraud dispute window on every death confirmation
- Charity fallback address locked at deployment
- No unlock date — death is the only trigger
- Full on-chain audit trail for every action

## Competitive Landscape

| Feature | VaultLegacy | Casa | Unchained | Safe (ETH) |
|---------|------------|------|-----------|-----------|
| Death trigger | ✓ | ✗ | ✗ | ✗ |
| Will on-chain | ✓ | ✗ | ✗ | ✗ |
| Multi-beneficiary | ✓ | ✗ | ✗ | ~ |
| Lawyer + fee | ✓ | ✗ | ✗ | ✗ |
| Conditional clause | ✓ | ✗ | ✗ | ✗ |
| Charity redirect | ✓ | ✗ | ✗ | ✗ |
| OP_NET / BTC L1 | ✓ | ✗ | ✗ | ✗ |

## Roadmap

**Phase 1 — OP_NET Testnet (Current)**
Frontend, smart contract, death-triggered unlock, per-child transfers, conditional inheritance, dead man's switch, vault certificate

**Phase 2 — Backend + Integration**
Orchestration service, dead man's switch automation, notification system, PSBT handling, OP_NET contract wiring

**Phase 3 — Mainnet**
OP_NET Mainnet, mobile app, multi-language support, hardware wallet deep integration, lawyer partner network

## Built For

**OP_NET Vibecoding Challenge 2026**

VaultLegacy was conceived and built for the OP_NET Vibecoding Challenge — demonstrating what is possible when programmability meets Bitcoin Layer 1.

The inheritance problem is real. Over \ billion in Bitcoin has been permanently lost. VaultLegacy is what Bitcoin programmability looks like when applied to the most important financial event in a family's life.

---

*Your Bitcoin. Their future. Built on OP_NET · Bitcoin Layer 1 · Testnet*
