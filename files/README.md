# VaultLegacy — Frontend

Bitcoin inheritance vault web app. OP_NET Testnet. All screens with full navigation.

## Run Locally

**Prerequisites:** Node.js 20+ required.

```bash
# Step 1 — install dependencies
npm install

# Step 2 — start dev server
npm run dev
```

Opens at: **http://localhost:5173**

---

## Screens

| Route | Screen | Role |
|-------|--------|------|
| `/owner` | Owner Dashboard | Owner |
| `/create` | Vault Creation Wizard (5 steps) | Owner |
| `/executor` | Executor / Lawyer Dashboard | Lawyer |
| `/beneficiary` | Beneficiary View (share % only) | Beneficiary |
| `/sign` | Remote Signing (standalone, no nav) | Beneficiary |
| `/appeal` | Suspended Beneficiary Appeal | Beneficiary |
| `/death` | Death Confirmation + 72h Window | All parties |
| `/deposits` | Deposit & Withdrawal History | Owner + Lawyer |
| `/certificate` | Vault Certificate PDF Export | Owner + Lawyer |

## Role Switcher

The sidebar includes a **Dev Mode role switcher** (Owner / Lawyer / Beneficiary) so you can view the navigation as each role sees it — without needing separate wallets.

## Design System

- Background: `#0a0a0a` (Obsidian)
- Cards: `#1e1e1e` (Slate)
- Accent: `#c9a84c` (Gold)
- Text: `#f5f1eb` (Ivory)
- Headings: Cormorant Garamond (serif)
- Body: Montserrat (300 weight)
- **No fiat. No dollar signs. BTC only. Always.**

## Mock Data

All screens run on mock data in `src/data/mockData.ts`. When the backend is ready, replace mock imports with real contract calls via the `opnet` SDK.

## Next Steps

1. Run locally, review all screens
2. Adjust design, copy, any UX issues
3. Push to repo on a feature branch
4. Backend service wired in Phase 2
