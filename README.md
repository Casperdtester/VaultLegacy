# VaultLegacy

> **The world's first will-based Bitcoin inheritance vault.**
> Death-triggered. Multi-beneficiary. Lawyer-executed. Built on OP_NET Bitcoin Layer 1.

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [How It Works](#how-it-works)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [User Flows](#user-flows)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Vault Lifecycle](#vault-lifecycle)
- [Design System](#design-system)
- [Competitive Landscape](#competitive-landscape)
- [Security](#security)
- [Roadmap](#roadmap)
- [Built For](#built-for)
- [License](#license)

---

## Overview

VaultLegacy is a Bitcoin inheritance vault built on **OP_NET Testnet** — Bitcoin's programmable layer. It solves the most underserved problem in crypto: what happens to your Bitcoin when you die?

Traditional estate planning does not account for self-custodied digital assets. No will covers a hardware wallet. No lawyer holds a seed phrase. No bank recovers a private key. Billions in Bitcoin disappear every year because no tool existed to transfer it faithfully.

VaultLegacy changes this.

An owner deposits Bitcoin into a smart contract vault, attaches an encrypted will defining each child's percentage share, registers a lawyer as executor with an agreed fee, and optionally attaches a conditional clause that can redirect a child's share to charity if they fail to meet defined standards of character. Everything is deployed as an OP_NET smart contract on Bitcoin Layer 1 — immutable, auditable, and permanent.

The vault unlocks **only when the owner dies.** Not on a calendar date. Not on a timer. On a confirmed life event — exactly like real estate law.

---

## The Problem

Over **$140 billion in Bitcoin** has been permanently lost — most of it at death.

| Problem | Why It Matters |
|---|---|
| No inheritance tooling exists | Traditional wills don't cover private keys. Crypto custody platforms don't have beneficiary management. |
| Multi-child complexity | Real families have multiple children, often across countries. No product handles percentage-based splits independently on Bitcoin. |
| No conditional logic | A father should be able to say: if my child has serious criminal charges, their share goes to charity. No tool supports this. |
| No lawyer integration | Estate law requires a neutral executor. No Bitcoin product integrates a lawyer as a co-signing fiduciary with a documented fee. |
| Single point of failure | One lost seed phrase erases a lifetime of savings — permanently and irrecoverably. |
| No audit trail | Owners can drain their estate secretly with no documentation. Families discover nothing remains. |

---

## The Solution

VaultLegacy is the first product designed from the ground up for Bitcoin inheritance — not custody, not wallet management, not DeFi. Inheritance.

```
One master vault → Encrypted will → Lawyer as executor → Per-child independent transfers
```

Key innovations:

- **Will on Bitcoin** — the owner's instructions are encrypted and stored on OP_NET. Immutable. Readable only by the lawyer after death confirmation.
- **Death-triggered unlock** — no calendar date. The vault opens when death is confirmed on-chain.
- **Lawyer fee on-chain** — agreed at creation, paid automatically before any child receives funds.
- **Conditional inheritance** — a child with criminal charges or conduct violations can have their share redirected to charity. With a 30-day appeal window.
- **Per-child independence** — each child's transfer is completely separate. One child cannot block another.
- **Global signing** — overseas family members sign remotely via abstracted PSBT. One tap. From anywhere.

---

## How It Works

### Phase 1 — Vault Creation (Owner is alive)

```
Owner connects wallet
        ↓
Names the vault ("Johnson Family Estate")
        ↓
Adds lawyer (name, address, fee %) + children (name, address, share %) + charity fallback
        ↓
Uploads encrypted will + conditional clause
        ↓
Sets dead man's switch check-in frequency (every 3 or 6 months)
        ↓
Deploys to OP_NET Testnet → Certificate generated → All parties notified
```

### Phase 2 — While Owner is Alive

```
Owner deposits BTC → Lawyer acknowledges on-chain
Owner withdrawals → Lawyer co-signs (full audit trail)
Owner updates will/conditions → Lawyer co-signs each time
Owner checks in periodically → Dead man's switch resets
```

### Phase 3 — Death Confirmation

```
Any party initiates unlock → uploads death certificate
        ↓
Lawyer independently verifies → co-confirms on-chain
        ↓
72-hour dispute window (fraud flag available with evidence)
        ↓
Lawyer fee auto-paid from vault before any child receives funds
        ↓
Will decrypted → Lawyer reads shares + reviews conditional clause per child
        ↓
Per-child independent transfers initiated
```

### Phase 4 — Distribution

```
For each child:
    Lawyer reviews conditional clause
    If clear → Lawyer initiates transfer → Child co-signs → BTC received
    If suspended → 30-day appeal window → Lawyer reviews evidence
        → Sufficient evidence: transfer reinstated
        → Insufficient / no evidence: share redirects to charity on-chain
```

---

## Core Features

### 1. Will on Bitcoin
The owner's will is encrypted client-side with the lawyer's public key. Only the SHA-256 hash is stored on the OP_NET contract. The document is unreadable by anyone — including VaultLegacy — until death is confirmed on-chain and the 72-hour window closes. Any tampering is detectable on-chain.

### 2. Death-Triggered Unlock
No calendar dates. The vault unlocks when death is confirmed — verified by the lawyer, recorded on-chain, with a mandatory 72-hour dispute window before any funds move. This mirrors exactly how real-world probate law handles estate activation.

### 3. Lawyer as Executor
The lawyer is the central co-signing authority. They acknowledge every top-up, co-sign every withdrawal, verify death, receive their fee first, decrypt the will, and initiate individual transfers to each child. Every action they take is logged permanently on-chain.

### 4. Lawyer Fee — On-Chain
The executor fee percentage is agreed and locked in the smart contract at vault creation. It cannot be changed without both signatures. The fee is calculated against the **vault balance at the moment of death confirmation** — not at creation — and paid automatically before any child receives a satoshi.

```
Example:
Vault balance at death confirmation: 1.842 BTC
Lawyer fee (2%): 0.037 BTC → transferred automatically to lawyer wallet
Net estate: 1.805 BTC → distributed to children per will percentages
```

### 5. Per-Child Independent Transfers
Each beneficiary's transfer is a completely separate on-chain transaction requiring:
- Lawyer's key
- That specific child's key

No child can block another. A child in Lagos receiving their share has no bearing on a child in London. Disputed or unreachable shares are held in escrow without freezing the entire estate.

### 6. Conditional Inheritance
At vault creation, the owner writes a conditional clause (co-signed with the lawyer) defining what disqualifies a beneficiary. If triggered:

- Child's share is suspended (others proceed normally)
- Child has **30 days** to submit evidence
- Lawyer reviews and decides: reinstate or redirect to charity
- After 30 days with no submission: **automatic redirect to charity**
- Charity redirect is permanent and irreversible on-chain

The charity wallet address is registered at vault creation and cannot be changed without both owner + lawyer signatures.

### 7. Deposit Architecture
- **Initial deposit**: BTC deposited directly into the vault contract address
- **Top-ups**: Owner can add more BTC at any time — like attaching more assets to an estate. Every top-up is acknowledged on-chain by the lawyer for full estate documentation.
- **Withdrawals**: Owner can withdraw while alive. Requires owner initiation + lawyer co-signature. Prevents silent estate draining. Creates a permanent audit trail.

### 8. Balance Visibility

| Party | What They See |
|---|---|
| Owner | Full BTC balance — always |
| Lawyer | Full BTC balance — always |
| Children (while owner alive) | Share percentage + vault status only |
| Children (at distribution) | Their own specific BTC amount only |

No fiat conversion. No dollar values. No price display. **BTC only — everywhere — always.**

### 9. Remote / Overseas Signing
Geography is irrelevant in Bitcoin multi-sig. An overseas beneficiary's address is registered at vault creation. When their transfer is ready:
- Push notification + email + SMS
- App abstracts all PSBT complexity completely
- Signer sees: their name, their BTC amount, executor name, one "Approve & Sign" button
- Hardware wallet support (Ledger, Trezor, Coldcard) — fully air-gapped if needed
- Signatures collected asynchronously — no simultaneous online requirement

### 10. Dead Man's Switch
Owner sets a check-in frequency (every 3 or 6 months). If the owner misses 3 consecutive check-ins:
- Executor automatically notified
- Unlock process begins — even before a death certificate is submitted
- Dashboard shows a persistent countdown reminder for the owner

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              MASTER VAULT — OP_NET CONTRACT              │
│                   Johnson Family Estate                  │
│         Direct BTC deposit · Auditable movements        │
└─────────────────┬───────────────────────┬───────────────┘
                  │                       │
         ┌────────▼────────┐    ┌─────────▼──────────┐
         │  Encrypted Will  │    │ Conditional Clause  │
         │  SHA-256 on-chain│    │ SHA-256 on-chain    │
         │  Lawyer key only │    │ Charity addr locked │
         └────────┬─────────┘    └─────────┬───────────┘
                  │                        │
    ┌─────────────▼────────────────────────▼────────────┐
    │                  AT DEATH CONFIRMATION              │
    │     72-hour window → Lawyer fee paid → Will read   │
    └──────┬─────────────────────────────────────────────┘
           │
    ┌──────▼──────────────────────────────────────────────┐
    │                   DISTRIBUTION                       │
    ├─────────────────┬──────────────────┬────────────────┤
    │   Emmanuel 40%  │   Adaeze 35%     │   Chidi 25%    │
    │   Lagos, NG     │   London, UK 🌍  │   Toronto 🌍   │
    │   Local signing │   Remote PSBT    │   Suspended    │
    │   Lawyer + him  │   Lawyer + her   │   Appeal open  │
    └─────────────────┴──────────────────┴────────┬───────┘
                                                   │
                                          ┌────────▼───────┐
                                          │ Charity Fallback│
                                          │ Red Cross NG    │
                                          │ If appeal fails │
                                          └────────────────┘
```

---

## Smart Contract

Deployed on **OP_NET Testnet**.

### State Variables

```typescript
vaultName: string
ownerPublicKey: PublicKey
executorPublicKey: PublicKey
executorFeePercent: number
beneficiaries: Beneficiary[]
  // { name, address, sharePercent, status: ACTIVE|SUSPENDED|COMPLETE|ESCROWED }
willHash: SHA256
conditionalClauseHash: SHA256
charityAddress: BitcoinAddress
checkInFrequency: number        // in seconds
lastCheckIn: timestamp
missedCheckIns: number
vaultStatus: ACTIVE | UNLOCK_INITIATED | WINDOW_OPEN | FEE_PAID | EXECUTING | COMPLETE
deathConfirmedTimestamp: timestamp
vaultBalanceAtDeath: satoshis   // snapshot at death confirmation
depositHistory: Deposit[]
  // { amount, timestamp, lawyerAcknowledged }
```

### Functions

```typescript
// Vault Setup
createVault(name, executorKey, executorFeePercent, beneficiaries[], willHash, conditionalClauseHash, charityAddress, checkInFrequency)

// Deposit Management
deposit()                                    // payable — owner adds BTC
acknowledgeTopUp(depositIndex)               // lawyer documents deposit
initiateWithdrawal(amount)                   // owner requests withdrawal
coSignWithdrawal(withdrawalId)               // lawyer co-signs
executeWithdrawal(withdrawalId)              // executes after both signatures

// Document Management
updateWill(newWillHash)                      // owner + lawyer co-sign
updateConditionalClause(newClauseHash)       // owner + lawyer co-sign

// Dead Man's Switch
checkIn()                                    // owner resets timer
missedCheckInAlert()                         // auto-triggered at 3 missed check-ins

// Death & Unlock
initiateUnlock(deathCertificateHash)         // any party initiates
confirmDeath()                               // lawyer co-confirms
flagFraud(evidenceHash)                      // any signer during 72-hour window
snapshotBalanceAtDeath()                     // called when window closes
payLawyerFee()                               // auto-transfers fee to executor
authorizeWillDecryption()                    // unlocks lawyer decryption after fee paid

// Conditional Logic
suspendBeneficiary(beneficiaryAddress)       // lawyer flags violation
submitAppealEvidence(evidenceHash)           // suspended child submits
reviewAppeal(beneficiaryAddress, decision)   // REINSTATE | REDIRECT
autoRedirectToCharity(beneficiaryAddress)    // auto after 30-day timeout

// Distribution
initiateTransfer(beneficiaryAddress, amount) // lawyer calls per child
coSignTransfer(beneficiaryAddress)           // child co-signs their transfer
executeTransfer(beneficiaryAddress)          // runs when both signatures collected
holdInEscrow(beneficiaryAddress)             // lawyer holds disputed share
```

---

## User Flows

### Owner
```
Connect OP_NET wallet
→ Name vault
→ Add lawyer (fee %), children (share %), charity address
→ Upload encrypted will + conditional clause
→ Set check-in frequency
→ Deploy to OP_NET Testnet
→ Download vault certificate
→ All parties receive invites
→ [Ongoing] Top-ups → lawyer acknowledges
→ [Ongoing] Withdrawals → lawyer co-signs
→ [Ongoing] Periodic check-ins → dead man's switch resets
```

### Lawyer / Executor
```
Receive vault brief + PDF certificate
→ Register executor key (hardware wallet recommended)
→ [Ongoing] Acknowledge top-ups
→ [Ongoing] Co-sign withdrawals
→ [Ongoing] Monitor dashboard (sees full BTC balance)
→ [Event] Death initiated → verify certificate → co-confirm on-chain
→ Receive 2% fee automatically → decrypt will
→ Review conditional clause per child
→ Initiate per-child transfers independently
→ Handle appeals (reinstate or redirect to charity)
→ Archive vault on completion
```

### Overseas Beneficiary (e.g. London)
```
Receive email invite
→ Guided Bitcoin wallet creation in app (no prior knowledge needed)
→ View vault summary: name, share %, executor name — NO BTC amount shown
→ One-time participation signature
→ Receive periodic vault health notifications
→ [Event] Notified of death → sees their BTC amount for the first time
→ One tap approval (PSBT abstracted)
→ BTC received in London wallet
```

### Local Beneficiary (e.g. Lagos)
```
[Event] Father passes
→ Initiate unlock → upload death certificate
→ 72-hour window → lawyer verifies
→ Lawyer initiates transfer for this child
→ Co-sign → BTC received
→ Siblings' transfers proceed completely independently
```

### Suspended Beneficiary
```
Lawyer flags conditional clause violation
→ Child notified: "Submit evidence within 30 days"
→ Child uploads evidence (court dismissal, rehab cert, character references)
→ Lawyer reviews evidence
→ Sufficient: transfer reinstated → BTC received
→ Insufficient: share redirects to charity → permanent and irreversible
→ No submission in 30 days: auto-redirect to charity
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | OP_NET Testnet — Bitcoin Layer 1 |
| Smart Contract | OP_NET contract language |
| Frontend | React / HTML + CSS + JS |
| Wallet Connection | OP_NET wallet connect |
| Will Encryption | AES-256 + RSA client-side (lawyer's public key) |
| Document Storage | IPFS — SHA-256 hash stored on OP_NET |
| PSBT Handling | Backend abstraction — user never sees raw PSBT |
| Notifications | Push + Email + SMS |
| PDF Generation | Vault certificate export |

---

## Getting Started

### Prerequisites
- Node.js v18+
- OP_NET Testnet wallet
- Testnet BTC (from OP_NET faucet)

### Installation

```bash
git clone https://github.com/yourhandle/vaultlegacy
cd vaultlegacy
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

```env
OPNET_NETWORK=testnet
OPNET_RPC_URL=https://testnet.opnet.org
IPFS_GATEWAY=https://ipfs.infura.io
```

### Run Locally

```bash
npm run dev
```

### Deploy Contract to OP_NET Testnet

```bash
npm run deploy:testnet
```

### Run Tests

```bash
npm run test
```

---

## Vault Lifecycle

Every action in VaultLegacy requires the correct combination of signatures and is permanently logged on OP_NET Bitcoin Layer 1.

| Action | Initiator | Co-signer | On-chain | Notes |
|---|---|---|---|---|
| Vault creation | Owner | Lawyer acknowledges | ✓ | Will hash + conditions locked |
| Top-up deposit | Owner | Lawyer co-documents | ✓ | Estate documentation |
| Withdrawal | Owner | Lawyer co-signs | ✓ | Full audit trail |
| Will update | Owner | Lawyer co-signs | ✓ | Previous version archived |
| Condition update | Owner | Lawyer co-signs | ✓ | Child can be reinstated/added |
| Dead man's check-in | Owner only | — | ✓ | Resets 3/6 month timer |
| Death confirmation | Any party | Lawyer verifies | ✓ | Starts 72-hour window |
| Lawyer fee payment | Auto | — | ✓ | Before any child transfer |
| Will decryption | Auto authorizes | Lawyer key | ✓ | After window closes |
| Per-child transfer | Lawyer | That child only | ✓ | Fully independent |
| Conditional suspension | Lawyer | — | ✓ | 30-day appeal starts |
| Appeal submission | Suspended child | — | ✓ | Evidence logged |
| Appeal outcome | Lawyer decides | — | ✓ | Reinstate or charity |
| Charity redirect | Auto | — | ✓ | Permanent, irreversible |

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Obsidian | `#0a0a0a` | Primary background |
| Slate | `#1e1e1e` | Card backgrounds |
| Mid | `#2a2a2a` | Secondary surfaces |
| Gold | `#c9a84c` | Primary accent, amounts |
| Gold Light | `#e8d08a` | Lawyer fee accent |
| Remote Green | `#5bab74` | Overseas signers |
| Conditional Red | `#e05a5a` | Suspended, warnings |
| Ivory | `#f5f1eb` | Primary text |
| Muted | `#888888` | Secondary text |

### Typography
- **Headings / Amounts**: Cormorant Garamond — elegant serif
- **Body / UI**: Montserrat — clean, weight 300

### Visual Rules
- No gradients
- No blue or purple
- No rounded cards — sharp edges only
- Generous negative space
- BTC only — no fiat conversion anywhere

---

## Competitive Landscape

| Feature | VaultLegacy | Casa | Unchained | Safe (ETH) | Electrum |
|---|---|---|---|---|---|
| Multi-sig | ✓ | ✓ | ✓ | ✓ | ✓ |
| Death trigger | ✓ | ✗ | ✗ | ✗ | ✗ |
| Will on-chain | ✓ | ✗ | ✗ | ✗ | ✗ |
| Multi-beneficiary | ✓ | ✗ | ✗ | ~ | ✗ |
| Lawyer + fee | ✓ | ✗ | ✗ | ✗ | ✗ |
| Conditional clause | ✓ | ✗ | ✗ | ✗ | ✗ |
| Charity redirect | ✓ | ✗ | ✗ | ✗ | ✗ |
| Remote signing | ✓ | ~ | ✗ | ~ | ✗ |
| OP_NET / BTC L1 | ✓ | ✗ | ✗ | ✗ | ✗ |

Casa, Unchained, Safe, and Electrum are custody tools that happen to support multi-sig. VaultLegacy is the only product designed from the ground up for inheritance.

---

## Security

### Key Architecture
- All three key types (owner, executor, beneficiary) are standard Bitcoin keypairs
- No key is ever held or seen by VaultLegacy
- Lawyer key is recommended to be stored on a hardware wallet (Ledger, Trezor, Coldcard)
- PSBT signing is abstracted but never custodied

### Will Encryption
- Documents encrypted client-side with the lawyer's RSA public key before leaving the browser
- VaultLegacy servers never receive the unencrypted will
- Only SHA-256 hashes stored on OP_NET
- Decryption only possible with lawyer's private key

### Fraud Prevention
- 72-hour dispute window after death confirmation
- Fraud flags require uploaded evidence — not just a tap
- All fraud flags logged permanently on-chain
- Dead man's switch provides a secondary death signal independent of any party's claim

### Audit Trail
Every action — deposit, withdrawal, acknowledgment, signature, appeal, outcome — is permanently logged on OP_NET Bitcoin Layer 1. The estate's full history is publicly verifiable on-chain by any party at any time.

### Conditional Clause Protection
- Charity address locked at vault creation
- Cannot be changed without owner + lawyer co-signature
- Prevents last-minute substitution of charity beneficiary
- All redirect transactions are irreversible by design

---

## Roadmap

### Phase 1 — OP_NET Testnet (Current)
- [x] Vault creation wizard
- [x] Will + conditional clause encryption and upload
- [x] Death-triggered unlock flow
- [x] Lawyer executor dashboard
- [x] Per-child independent transfers
- [x] Remote PSBT signing (abstracted)
- [x] Dead man's switch
- [x] Conditional inheritance + appeal flow
- [x] Charity redirect
- [x] Vault certificate PDF export

### Phase 2 — Mainnet Launch
- [ ] OP_NET Mainnet deployment
- [ ] Multi-language support (English, French, Yoruba, Igbo, Hausa)
- [ ] Mobile app (iOS + Android)
- [ ] Hardware wallet deep integration
- [ ] Lawyer partner network onboarding

### Phase 3 — Ecosystem
- [ ] Multi-asset support (other Bitcoin L1 assets via OP_NET)
- [ ] Jurisdiction-specific legal templates
- [ ] API for law firm integration
- [ ] Cross-border executor network

---

## Built For

**OP_NET Vibecoding Challenge 2026**

VaultLegacy was conceived and built for the OP_NET Vibecoding Challenge — a 3-week competition to demonstrate what is possible when programmability meets Bitcoin Layer 1.

The inheritance problem is real. Over $140 billion in Bitcoin has been permanently lost. The tools to solve it have not existed — until OP_NET made Bitcoin programmability possible for everyone.

VaultLegacy is what that programmability looks like when applied to the most important financial event in a family's life.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**VaultLegacy**

*Your Bitcoin. Their future.*

Built on OP_NET · Bitcoin Layer 1 · Testnet

</div>
