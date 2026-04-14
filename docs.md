# Complyr Documentation

> Confidential audit infrastructure for onchain business finance, built on HashKey Chain.

---

## Table of Contents

1. [Introduction](#introduction)
2. [The Problem](#the-problem)
3. [How Complyr Works](#how-complyr-works)
4. [Architecture](#architecture)
   - [Smart Contract Layer — HashKey Chain](#smart-contract-layer--hashkey-chain)
   - [Confidential Record Layer — AES-256-GCM & ECIES](#confidential-record-layer--aes-256-gcm--ecies)
   - [Data Layer — Envio Indexer](#data-layer--envio-indexer)
5. [Compliance Model & Encryption](#compliance-model--encryption)
6. [Smart Contract Reference](#smart-contract-reference)
7. [Getting Started](#getting-started)
8. [Auditor Portal](#auditor-portal)
9. [Limitations & Known Constraints](#limitations--known-constraints)
10. [Roadmap](#roadmap)

---

## Introduction

Complyr is a compliance infrastructure layer for onchain business payments.

When a company sends money from a blockchain wallet, the public record shows *who* was paid and *how much*. It says nothing about *why*. That gap — between raw transaction data and structured financial records — is the problem Complyr solves.

Complyr attaches an encrypted, immutable compliance record to every payment. Each record captures the business context of a transaction: its regulatory jurisdiction, expense category, and entity identifiers. This metadata is encrypted client-side, meaning it is provably present on-chain and selectively readable by authorised parties via ECIES, without ever being exposed publicly.

The result is a unified dual payment engine for HashKey Chain: an ERC-4337 Smart Treasury for outbound corporate payouts, and HashKey Settlement Protocol (HSP) Checkout integration for inbound customer payments, both routing through an AES-256 compliance layer.

**Live demo:** [usecomplyr.vercel.app](https://usecomplyr.vercel.app)

---

## The Problem

### The regulatory gap in onchain finance

Traditional finance has always required businesses to explain their spending, not just record it. Tax authorities need proof of business purpose. Auditors need traceable documentation. Regulators expect structured records that can be inspected on demand and retained for five to seven years in most jurisdictions.

Blockchain payments, as they currently work, produce none of this.

Consider a company that makes three payments in a single week:

- $2,000 to a contractor
- $500 for a SaaS subscription
- $1,000 for a marketing agency

Each transaction executes correctly on-chain. The amounts are correct. The recipients are correct. But the public record contains no indication that these are business expenses. Without structured documentation linking each payment to its purpose, those deductions may be disallowed by a tax authority. Unexplained outflows can be reclassified as personal income or, in more severe cases, flagged as evidence of financial misconduct.

The compliance liability compounds for businesses operating across jurisdictions. A payroll payment to a contractor in Nigeria, an invoice to a vendor in Germany, and a salary disbursement to an employee in California each carry different regulatory obligations — different withholding requirements, different reporting thresholds, different document retention rules. On-chain, these payments are indistinguishable. The problem applies just as much to inbound revenue checkout lacking context.

### Why existing solutions fall short

The conventional responses to this problem — off-chain accounting software, manual reconciliation, centralised compliance databases — require trusting a third party with sensitive financial data and maintaining a separate system that must be kept in sync with the blockchain. They introduce the very fragility and opacity that onchain finance is meant to eliminate.

Complyr takes a different approach: the compliance record travels with the payment, is stored on-chain, and is protected by cryptography rather than access controls.

---

## How Complyr Works

At a high level, every Complyr payment follows a consistent sequence through its Dual Payment Engine:

### 1. Onchain Treasury (Outbound)

**1. Intent creation.** A business creates a payment intent through the Complyr interface. Along with recipient addresses and amounts, they attach compliance metadata: an expense category and a jurisdiction code per recipient.

**2. Client-side encryption.** Before anything reaches the blockchain, the compliance metadata is encrypted in the user's browser using AES-256-GCM. 

**3. Payment execution on HashKey Chain.** The ERC-4337 smart wallet executes the payment. For single and batch transfers, funds move immediately. For recurring payments, the intent is registered with the IntentRegistry scheduler and funds are locked until each payment cycle executes.

**4. Encrypted record storage.** The ciphertext is submitted to the HashKey Chain `ComplianceRegistry` and cryptographically linked to the transaction hash.

**5. Selective decryption.** The company owner or an authorised auditor can decrypt their compliance records at any time by connecting their wallet via the ECIES key management portal.

### 2. HSP Checkout (Inbound & External)

For external customer payments, Complyr integrates directly with the **HashKey Settlement Protocol (HSP)**.

When a merchant generates an HSP checkout link, the customer's payment intent is combined with the merchant's predefined compliance rules. Once the customer completes the payment via the hosted checkout, the encrypted compliance record is automatically logged, marrying web2-style e-commerce with web3-native compliance.

---

## Architecture

Complyr spans three distinct layers.

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                        │
│                Next.js · Privy · AES-256-GCM · HSP              │
└────────────────────────────┬────────────────────────────────────┘
                             │ UserOperations / Direct Tx
┌────────────────────────────▼────────────────────────────────────┐
│                SMART CONTRACT LAYER — HashKey Chain             │
│   SmartWallet · SmartWalletFactory · IntentRegistry             │
│   ComplianceRegistry · VerifyingPaymaster                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ Event indexing
┌────────────────────────────▼────────────────────────────────────┐
│                    DATA LAYER — Envio Indexer                   │
│              GraphQL API · Transaction history                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Smart Contract Layer — HashKey Chain

The HashKey Chain layer handles payment execution and compliance metadata storage.

#### SmartWallet

The SmartWallet is an ERC-4337 compliant smart account. Each business entity deploys exactly one smart wallet, created as a minimal proxy clone via the SmartWalletFactory using `Clones.cloneDeterministic`. The deterministic address means a wallet's address is known before deployment, enabling counterfactual wallets and gasless `initCode` deployment.

Key responsibilities:
- Validates user operations via `validateUserOp` using EIP-191 message hashing
- Executes single and batch transfers on HashKey Testnet
- Manages committed vs. available balance to prevent double-spending on scheduled payments
- Gasless transactions sponsored through a self-hosted Skandha bundler

**Fund commitment model.** When a recurring payment intent is created, `increaseCommitment(totalCommitment)` is called on the wallet. The committed amount is subtracted from available balance, preventing the funds from being spent elsewhere. Each executed cycle calls `decreaseCommitment` by the cycle amount. Cancellation releases all remaining committed funds.

#### SmartWalletFactory

The factory deploys and tracks smart wallet clones. It accepts a single `owner` address, derives a deterministic salt, and deploys the clone using OpenZeppelin's `Clones` library.

For testnet purposes, the factory is pre-funded and sends `100 HSK` to each newly deployed wallet. It also triggers automatic company registration on the ComplianceRegistry at wallet creation time.

#### IntentRegistry

The IntentRegistry is the scheduling and compliance engine logic. It manages the full lifecycle of recurring payment intents. It utilizes the Chainlink Automation interface (`checkUpkeep` / `performUpkeep`), polled by a custom keeper every 30 seconds. Implementation uses a skip-on-fail execution where if a transfer fails, it records the `failedAmount` and moves to the next recipient.

#### ComplianceRegistry

The ComplianceRegistry is the core privacy-preserving storage contract. It maintains an isolated compliance ledger per company. Each record stores:
- `txHash` — deterministic link to the HashKey transaction or intent ID
- `recipients[]` and `amounts[]` — plaintext (already public on the payment ledger).
- `encryptedPayload` — AES-256-GCM ciphertext containing the expense categories, jurisdictions, and reference IDs.
- `timestamp` — block timestamp at record creation

---

### Confidential Record Layer — AES-256-GCM & ECIES

Unlike early prototypes that relied on FHE, Complyr utilizes standard Client-Side Encryption with ECIES (Elliptic Curve Integrated Encryption Scheme) for practical performance and strict control over data readability.

1. **Company Keys**: A symmetric master AES key is generated for the company. Data is encrypted client-side using this key before landing on-chain.
2. **Auditor Portal**: When granting access to an auditor, the company's master AES key is encrypted using the auditor's Ethereum public key (ECIES) and stored in the registry.

This hybrid crypto approach ensures performance while allowing auditable and revokable visibility into compliance metadata.

---

### Data Layer — Envio Indexer

Complyr includes a custom Envio indexer that listens to all relevant events on HashKey Chain and normalises them into typed `Transaction` entities with structured JSON details, exposed via a hosted GraphQL API.

The schema and handlers are written specifically for Complyr to trace wallet creation, batch transfers, intent executions, and HSP Checkout settlements. A helper `Intent` entity stores configuration so execution handlers can reconstruct correct payloads.

---

## Compliance Model & Encryption

### The compliance metadata schema

Complyr captures two dimensions of compliance metadata per recipient per payment:

**Jurisdiction** — the regulatory jurisdiction applicable to the recipient.
Includes options for US states, EU countries, UK, Singapore, UAE, etc.

**Category** — the expense classification for the payment.
Includes Payroll (W2/1099), Contractor, Invoice, Dividend, Reimbursement, Vendor, etc.

### The trust model

Complyr enforces three properties of every compliance record — **existence** (created at the time of the payment), **immutability** (cannot be altered or deleted), and **cryptographic linkage** (permanently tied to the underlying transaction). It does not enforce the accuracy of the metadata a company submits. Businesses self-report their categories and jurisdictions, consistent with how traditional accounting works.

---

## Smart Contract Reference

### Deployed addresses

#### HashKey Chain Testnet

| Contract | Address |
|---|---|
| `SmartWalletFactory` | [Refer to deploy logs] |
| `SmartWallet` (impl) | [Refer to deploy logs] |
| `IntentRegistry` | [Refer to deploy logs] |
| `ComplianceRegistry` | [Refer to deploy logs] |
| `VerifyingPaymaster` | [Refer to deploy logs] |

*(For accurate deployed addresses on HashKey Chain testnet, refer to recent deployment logs).*

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Foundry

### Clone and install

```bash
git clone https://github.com/Stoneybro/complyr
cd complyr
pnpm install
```

### Environment variables

Create `apps/web/.env.local`:

```bash
# Privy authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Neon PostgreSQL (for contacts)
COMPLYR_DATABASE_URL=postgresql://...

# Envio GraphQL API
NEXT_PUBLIC_ENVIO_API_URL=https://indexer.dev.hyperindex.xyz/86c2f35/v1/graphql
```

### Build contracts

```bash
# HashKey Chain contracts
pnpm forge:build
pnpm forge:test
```

### Run the web & keeper

```bash
pnpm dev
# Keeper
cd packages/keeper
cp .env.example .env
pnpm dev
```

---

## Auditor Portal

The Auditor Portal is a dedicated interface that allows external auditors and regulators to verify a company's compliance records without accessing the company's main dashboard.

### The Simple Flow

1. **Authorization:** A company explicitly authorizes their external auditor's wallet address in the Complyr dashboard.
2. **Sharing Access:** The company generates a secure **Auditor Access Link** (`/auditor/[proxyAddress]`) and shares it with the auditor.
3. **Auditor Login:** The auditor navigates to the portal and connects their authorized wallet (MetaMask or any injected provider).
4. **Visibility:** The auditor clicks **Decrypt Compliance Data**, and successfully views all records and downloads compliance reports without having actual login access to the company's bank account.

### Under the Hood (ECIES)

This system is powered by cryptography, not traditional software access controls.

**Key Wrapping:** When the business authorizes the auditor, their browser takes the company's master AES compliance key and securely encrypts it using the auditor's *public* Ethereum key (a process known as ECIES). This encrypted key is uploaded to HashKey Chain.

**Local Decryption:** When the auditor logs into the portal and interacts with the page, their browser uses their wallet's *private* key to decrypt the AES key client-side. The browser then fetches ciphertext payloads from the blockchain and decrypts them locally.

**What auditors can see:** 
- Plaintext payment metadata (transaction hash, date, recipients, amounts)
- Decrypted expense category per recipient
- Decrypted regulatory jurisdiction per recipient
- Compliance summary statistics

Auditors cannot modify records, authorise additional parties, or access data beyond what they explicitly have the key for.

---

## Limitations & Known Constraints

### Testnet only
Complyr currently runs on HashKey Chain testnet. The infrastructure is not deployed to any mainnet. Contract security has not been audited. Do not use this for real financial transactions.

### Key Retrieval
If a company loses all access to the local browser state or instances where the symmetric AES key is maintained in sync with the privy wallet, they may lose decryption capability for past records.

### Recurring payment execution reliability
Recurring payments depend on a keeper service that must remain online. Missed windows are not backfilled currently.

---

## Roadmap

### Near term
**Recurring payments stabilisation.** Further edge-case handling for onchain scheduler.
**Dedicated auditor dashboard.** Richer filtering and exporting.

### Medium term
**Tax reporting interface.** Aggregation into Schedule C summaries, HMRC formats, etc.
**Multi-jurisdiction and multi-category support.** Split reporting.
**Compliance health scoring.** 

### Long term
**Mainnet deployment.**
**DAO treasury integration.** 
**Programmable compliance rules.** 

---

*Built for the HashKey Chain Horizon Hackathon. Powered by HashKey Chain, Envio, and AES/ECIES Encryption.*