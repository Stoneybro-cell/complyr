# Complyr Documentation

> Confidential audit infrastructure for onchain business finance.

---

## Table of Contents

1. [Introduction](#introduction)
2. [The Problem](#the-problem)
3. [How Complyr Works](#how-complyr-works)
4. [Architecture](#architecture)
   - [Smart Contract Layer — Flow EVM](#smart-contract-layer--flow-evm)
   - [Confidential Record Layer — Zama fhEVM](#confidential-record-layer--zama-fhevm)
   - [Data Layer — Envio Indexer](#data-layer--envio-indexer)
5. [Compliance Model & FHE](#compliance-model--fhe)
6. [Smart Contract Reference](#smart-contract-reference)
7. [Getting Started](#getting-started)
8. [Auditor Portal](#auditor-portal)
9. [Limitations & Known Constraints](#limitations--known-constraints)
10. [Roadmap](#roadmap)

---

## Introduction

Complyr is a compliance infrastructure layer for onchain business payments.

When a company sends money from a blockchain wallet, the public record shows *who* was paid and *how much*. It says nothing about *why*. That gap — between raw transaction data and structured financial records — is the problem Complyr solves.

Complyr attaches an encrypted, immutable compliance record to every payment. Each record captures the business context of a transaction: its regulatory jurisdiction, expense category, and entity identifiers. This metadata is protected by Fully Homomorphic Encryption (FHE), meaning it is provably present on-chain and selectively readable by authorised parties, without ever being exposed publicly.

The result is a dual ledger: one transparent, one confidential, permanently linked by a shared deterministic identifier.

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

The compliance liability compounds for businesses operating across jurisdictions. A payroll payment to a contractor in Nigeria, an invoice to a vendor in Germany, and a salary disbursement to an employee in California each carry different regulatory obligations — different withholding requirements, different reporting thresholds, different document retention rules. On-chain, these payments are indistinguishable.

### Why existing solutions fall short

The conventional responses to this problem — off-chain accounting software, manual reconciliation, centralised compliance databases — require trusting a third party with sensitive financial data and maintaining a separate system that must be kept in sync with the blockchain. They introduce the very fragility and opacity that onchain finance is meant to eliminate.

Complyr takes a different approach: the compliance record travels with the payment, is stored on-chain, and is protected by mathematics rather than access controls.

---

## How Complyr Works

At a high level, every Complyr payment follows a consistent sequence:

**1. Intent creation.** A business creates a payment intent through the Complyr interface or directly via contract call. Along with recipient addresses and amounts, they attach compliance metadata: an expense category and a jurisdiction code per recipient.

**2. Client-side encryption.** Before anything reaches the blockchain, the compliance metadata is encrypted in the user's browser using Zama's fhEVM JavaScript SDK. The resulting ciphertext handles and zero-knowledge proofs confirm that the encrypted values are well-formed, without revealing the underlying data.

**3. Payment execution on Flow EVM.** The smart wallet executes the payment. For single and batch transfers, funds move immediately. For recurring payments, the intent is registered with the on-chain scheduler and funds are locked until each payment cycle executes.

**4. Cross-chain compliance dispatch.** The Compliance Bridge, a LayerZero V2 OApp deployed on Flow EVM, encodes the compliance report — including encrypted category and jurisdiction handles — and sends it to the Zama Sepolia network.

**5. Encrypted record storage on Zama.** The Compliance Receiver on Zama decodes the incoming message and calls the Compliance Registry, which validates the zero-knowledge proofs, materialises the FHE ciphertext on-chain, and grants access to the company's master wallet.

**6. Selective decryption.** The company owner or an authorised auditor can decrypt their compliance records at any time by connecting their wallet and signing an EIP-712 request through the Zama decryption gateway.

---

## Architecture

Complyr spans three distinct layers. Each layer has a specific responsibility and communicates with the others through well-defined interfaces.

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                        │
│              Next.js · Privy · fhevmjs · Permissionless         │
└────────────────────────────┬────────────────────────────────────┘
                             │ UserOperations (ERC-4337)
┌────────────────────────────▼────────────────────────────────────┐
│                  SMART CONTRACT LAYER — Flow EVM                 │
│   SmartWallet · SmartWalletFactory · IntentRegistry             │
│   ComplianceBridge (LayerZero OApp) · VerifyingPaymaster        │
└────────────────────────────┬────────────────────────────────────┘
                             │ LayerZero V2 cross-chain message
┌────────────────────────────▼────────────────────────────────────┐
│              CONFIDENTIAL RECORD LAYER — Zama Sepolia           │
│         ComplianceReceiver (OApp) · ComplianceRegistry          │
│                    (euint8 FHE ciphertext)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ Event indexing
┌────────────────────────────▼────────────────────────────────────┐
│                    DATA LAYER — Envio Indexer                   │
│              GraphQL API · Transaction history                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Smart Contract Layer — Flow EVM

The Flow EVM layer handles payment execution and compliance metadata dispatch. It consists of four contracts.

#### SmartWallet

The SmartWallet is an ERC-4337 compliant smart account. Each business entity deploys exactly one smart wallet, created as a minimal proxy clone via the SmartWalletFactory using `Clones.cloneDeterministic`. The deterministic address means a wallet's address is known before deployment, enabling counterfactual wallets and gasless `initCode` deployment.

Key responsibilities:
- Validates user operations via `validateUserOp` using EIP-191 message hashing
- Executes single and batch native FLOW transfers
- Manages committed vs. available balance to prevent double-spending on scheduled payments
- Exposes `executeBatchIntentTransfer` — callable only by the IntentRegistry — for scheduled payment execution
- Routes compliance reports to the ComplianceBridge via `reportCompliance`

**Fund commitment model.** When a recurring payment intent is created, `increaseCommitment(totalCommitment)` is called on the wallet. The committed amount is subtracted from available balance, preventing the funds from being spent elsewhere. Each executed cycle calls `decreaseCommitment` by the cycle amount. Cancellation releases all remaining committed funds.

#### SmartWalletFactory

The factory deploys and tracks smart wallet clones. It accepts a single `owner` address, derives a deterministic salt, and deploys the clone using OpenZeppelin's `Clones` library.

For demo and testnet purposes, the factory is pre-funded and sends `100 FLOW` to each newly deployed wallet, making onboarding gasless and frictionless.

The factory also triggers automatic company registration on Zama Sepolia at wallet creation time by calling `ComplianceBridge.registerAccount`. This establishes the cross-chain identity link — mapping the Flow proxy address to the owner's EOA — at the earliest possible moment.

#### IntentRegistry

The IntentRegistry is the scheduling and compliance dispatch engine. It manages the full lifecycle of recurring payment intents.

**Creating an intent.** The caller provides:
- `name` — a human-readable label
- `recipients[]` and `amounts[]` — matched arrays; max 10 recipients per intent
- `duration` — total active time in seconds
- `interval` — time between executions in seconds (minimum 30s)
- `transactionStartTime` — Unix timestamp for first execution (0 = immediate)
- Per-recipient FHE handles and proofs for category and jurisdiction

The registry validates fund availability, calculates total commitment (`amountPerCycle × totalCycles`), locks funds via `increaseCommitment`, and dispatches a compliance report to the bridge at creation time. The compliance report is sent once, at intent creation, not at each execution — this is an intentional architectural choice that avoids per-execution bridge fees while maintaining a permanent compliance record linked to the intent's identifier.

**Executing an intent.** The registry implements `checkUpkeep` and `performUpkeep`, the Chainlink Automation interface. A custom keeper script deployed on Railway polls `checkUpkeep` every 30 seconds across all registered wallets and calls `performUpkeep` when execution conditions are met. Execution is skipped (not reverted) if a recipient transfer fails, with the failed amount tracked in `intent.failedAmount` for recovery.

**Cancelling an intent.** The wallet owner can cancel any active intent at any time. The remaining committed funds are released immediately.

#### ComplianceBridge

The ComplianceBridge is a LayerZero V2 OApp that sends compliance payloads from Flow EVM to Zama Sepolia. It is self-funded: it uses its own FLOW balance to pay LayerZero fees, so callers never need to send `msg.value` when triggering compliance dispatch.

Two message types are supported:
- `MSG_REGISTER` — sent at wallet creation, maps proxy address to master EOA
- `MSG_REPORT` — sent at intent creation, carries the full per-recipient compliance payload

The bridge overrides `_payNative` to allow treasury-funded fees and implements a `_resolveOptions` helper that injects default executor gas options when callers pass empty bytes, preventing `LZ_ULN_InvalidWorkerOptions` errors.

---

### Confidential Record Layer — Zama fhEVM

The Zama layer stores compliance records in a form that is auditable without being publicly readable. It runs on Zama's Sepolia testnet, which implements Fully Homomorphic Encryption at the EVM level.

#### ComplianceReceiver

The ComplianceReceiver is a LayerZero V2 OApp deployed on Zama Sepolia. It receives inbound messages from the ComplianceBridge and decodes them based on the leading message type byte. It then routes each decoded payload to the ComplianceRegistry.

#### ComplianceRegistry

The ComplianceRegistry is the core privacy-preserving storage contract. It maintains an isolated ledger per company, keyed by the Flow proxy address.

Each compliance record stores:
- `flowTxHash` — the deterministic link to the Flow transaction or intent
- `recipients[]` and `amounts[]` — plaintext payment data
- `categories[]` — one `euint8` FHE ciphertext per recipient
- `jurisdictions[]` — one `euint8` FHE ciphertext per recipient
- `timestamp` — block timestamp at record creation

FHE values are created using `FHE.fromExternal(handle, proof)`, which validates the zero-knowledge proof and materialises the ciphertext handle. Access is immediately granted to the contract itself (`FHE.allowThis`) and the company's master EOA (`FHE.allow(value, masterEOA)`). If auditors have been added, they receive access retroactively across all historical records.

**Auditor management.** Companies can designate up to three external auditors by calling `addAuditor(proxyAccount, auditorAddress)` directly on Sepolia with their master EOA. Adding an auditor triggers a retroactive loop that grants FHE decryption access to every category and jurisdiction value in the company's entire historical ledger. Removing an auditor revokes access for future records but does not revoke access already granted to historical ciphertexts — this is a property of how Zama's ACL system works and is documented in [Limitations](#limitations--known-constraints).

---

### Data Layer — Envio Indexer

Complyr includes a custom Envio indexer that listens to events emitted by the SmartWallet, SmartWalletFactory, and IntentRegistry contracts on Flow EVM. The indexer normalises raw on-chain events into structured `Transaction` entities, each carrying a `transactionType` enum and a JSON `details` string that the frontend templates consume directly.

The indexer schema defines two primary entities:
- `Wallet` — created on `AccountCreated`, tracks owner, deployment metadata, and a derived transaction array
- `Transaction` — one record per indexed event, typed by activity and enriched with parsed details
- `Intent` — a helper entity that stores intent configuration for lookup during execution events (since the `IntentExecuted` event itself does not re-emit recipients and amounts)

The indexer is exposed as a GraphQL API (Envio hosted) and queried by the frontend via `graphql-request`.

---

## Compliance Model & FHE

### The compliance metadata schema

Complyr captures two dimensions of compliance metadata per recipient per payment:

**Jurisdiction** — the regulatory jurisdiction applicable to the recipient. Mapped to a `uint8` enum on-chain.

| Code | Value | Label |
|------|-------|-------|
| 0 | NONE | Not specified |
| 1 | US_CA | US — California |
| 2 | US_NY | US — New York |
| 3 | US_TX | US — Texas |
| 4 | US_FL | US — Florida |
| 5 | US_OTHER | US — Other |
| 6 | UK | United Kingdom |
| 7 | EU_DE | Germany |
| 8 | EU_FR | France |
| 9 | EU_OTHER | Other EU |
| 10 | NG | Nigeria |
| 11 | SG | Singapore |
| 12 | AE | UAE |
| 13 | OTHER | Other |

**Category** — the expense classification for the payment. Mapped to a `uint8` enum on-chain.

| Code | Value | Label |
|------|-------|-------|
| 0 | NONE | Not specified |
| 1 | PAYROLL_W2 | Payroll (W2) |
| 2 | PAYROLL_1099 | Payroll (1099) |
| 3 | CONTRACTOR | Contractor |
| 4 | BONUS | Bonus |
| 5 | INVOICE | Invoice |
| 6 | VENDOR | Vendor |
| 7 | GRANT | Grant |
| 8 | DIVIDEND | Dividend |
| 9 | REIMBURSEMENT | Reimbursement |
| 10 | OTHER | Other |

### How FHE encryption works in Complyr

Complyr uses Zama's `relayer-sdk-js` for client-side encryption. The encryption flow is:

**1. Instance creation.** The SDK is loaded from Zama's CDN and initialised with `SepoliaConfig`, which contains the correct KMS, ACL, and gateway addresses for Zama Sepolia.

**2. Input encryption.** For each recipient's category and jurisdiction values, the frontend creates an `EncryptedInput` targeting the ComplianceRegistry contract address and the relay wallet address as the authorised caller:

```typescript
const input = fhevm.createEncryptedInput(REGISTRY_ADDRESS, RELAY_ADDRESS);
input.add8(categoryValue); // uint8 enum value
const encrypted = await input.encrypt();
// Returns: { handles: Uint8Array[], inputProof: Uint8Array }
```

**3. Handle and proof extraction.** The resulting ciphertext handle (32 bytes) and zero-knowledge proof are encoded as hex strings and sent to the relay API, which calls `recordTransaction` on the registry.

**4. On-chain validation.** `FHE.fromExternal(handle, proof)` validates the proof and returns a live `euint8` handle bound to the Zama coprocessor.

**5. ACL permission grant.** The registry calls `FHE.allow(value, address)` to grant decryption rights to the master EOA and any active auditors.

**6. Decryption.** An authorised party decrypts their records by generating a keypair, creating an EIP-712 token scoped to the registry contract, signing it with their wallet, and calling `fhevm.userDecrypt(handles, privateKey, publicKey, signature, ...)`. The Zama KMS validates the signature, checks ACL permissions, and returns plaintext values.

### The trust model

Complyr does not enforce the accuracy of the metadata a company submits. A company self-reports its categories and jurisdictions, consistent with how traditional accounting works — accountants self-report but bear legal liability for what they commit. What Complyr does enforce is **existence** and **immutability**: once a compliance record is committed, it cannot be altered or deleted. The combination of a deterministic intent identifier and an immutable on-chain record provides the same accountability primitive as a signed accounting entry in traditional finance.

The system is designed to give regulators a credible audit trail, not to replace the legal obligations of the business.

---

## Smart Contract Reference

### Deployed addresses

#### Flow EVM Testnet (Chain ID: 545)

| Contract | Address |
|---|---|
| `SmartWalletFactory` | `0x6D39aE04C757aE3658c957b240835Cc040923105` |
| `SmartWallet` (implementation) | `0x738DAF8cb17b3EB9a09C8d996420Ec4c0C4532D9` |
| `IntentRegistry` | `0x8Bd539Be7554752DC16B4d96AC857F3752B39cc1` |
| `ComplianceBridge` | `0x48898Dc7186b5AbD6028D12810CdeFf8eD8cb46B` |
| `VerifyingPaymaster` | `0x722aD9117477Ad4Cb345F1419bd60FAFEACAfB00` |

#### Zama Sepolia (Chain ID: 11155111)

| Contract | Address |
|---|---|
| `ComplianceRegistry` | `0x231Fcd3ae69f723B3AeFfe7B9B876Bb37C4Db4D6` |
| `ComplianceReceiver` | `0xE1A3dd302709Fb0f1E957D1F6A68870c50E2c68a` |

---

### IntentRegistry — Key Functions

#### `createIntent`

Creates a new recurring payment intent and dispatches a compliance report to Zama.

```solidity
function createIntent(
    string memory name,
    address[] memory recipients,
    uint256[] memory amounts,
    uint256 duration,
    uint256 interval,
    uint256 transactionStartTime,
    bytes32[] calldata categoryHandles,
    bytes[] calldata categoryProofs,
    bytes32[] calldata jurisdictionHandles,
    bytes[] calldata jurisdictionProofs
) external returns (bytes32 intentId)
```

**Parameters**

| Name | Type | Description |
|---|---|---|
| `name` | `string` | Human-readable label for the intent |
| `recipients` | `address[]` | Payment destination addresses (max 10) |
| `amounts` | `uint256[]` | Per-recipient amounts per execution cycle, in wei |
| `duration` | `uint256` | Total active duration in seconds (max 365 days) |
| `interval` | `uint256` | Seconds between executions (min 30s) |
| `transactionStartTime` | `uint256` | Unix timestamp for first execution; 0 = start immediately |
| `categoryHandles` | `bytes32[]` | Per-recipient FHE-encrypted category ciphertext handles |
| `categoryProofs` | `bytes[]` | Per-recipient ZK proofs for category handles |
| `jurisdictionHandles` | `bytes32[]` | Per-recipient FHE-encrypted jurisdiction ciphertext handles |
| `jurisdictionProofs` | `bytes[]` | Per-recipient ZK proofs for jurisdiction handles |

**Returns** `bytes32` — the generated intent ID, derived from a hash of wallet, recipients, amounts, timestamp, and a counter.

**Reverts**

| Error | Condition |
|---|---|
| `IntentRegistry__NoRecipients` | `recipients.length == 0` |
| `IntentRegistry__ArrayLengthMismatch` | Any input array length mismatch |
| `IntentRegistry__TooManyRecipients` | More than 10 recipients |
| `IntentRegistry__InvalidDuration` | `duration == 0` or `duration > 365 days` |
| `IntentRegistry__InvalidInterval` | `interval < 30` |
| `IntentRegistry__StartTimeInPast` | `transactionStartTime > 0` and `< block.timestamp` |
| `IntentRegistry__InsufficientFunds` | Available wallet balance < total commitment |

---

#### `cancelIntent`

Cancels an active intent and releases all remaining committed funds.

```solidity
function cancelIntent(bytes32 intentId) external
```

Can only be called by the wallet that owns the intent (i.e., `msg.sender == intent.wallet`).

---

#### `checkUpkeep` / `performUpkeep`

Chainlink Automation-compatible interface. The keeper script calls `checkUpkeep` with empty bytes and receives `(upkeepNeeded, performData)`. When `upkeepNeeded` is true, it calls `performUpkeep(performData)`, which decodes the target wallet and intent ID and executes one payment cycle.

---

### ComplianceRegistry — Key Functions

#### `recordTransaction`

Appends a per-recipient compliance record to a company's private ledger. Only callable by the authorised `lzReceiver`.

```solidity
function recordTransaction(
    bytes32 flowTxHash,
    address proxyAccount,
    address[] memory recipients,
    uint256[] memory amounts,
    externalEuint8[] memory categoryHandles,
    bytes[] memory categoryProofs,
    externalEuint8[] memory jurisdictionHandles,
    bytes[] memory jurisdictionProofs
) external onlyLzReceiver
```

---

#### `addAuditor`

Adds an external auditor and retroactively grants them FHE decryption access to all historical records.

```solidity
function addAuditor(address proxyAccount, address newAuditor) external
```

Callable only by the `companyMasters[proxyAccount]` address. Maximum 3 auditors per company.

---

#### `getEncryptedCategory` / `getEncryptedJurisdiction`

Returns the `euint8` FHE ciphertext handle for a specific recipient within a specific record. The caller must have ACL access to decrypt the returned handle.

```solidity
function getEncryptedCategory(
    address proxyAccount,
    uint256 recordIndex,
    uint256 recipientIndex
) external view returns (euint8)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Foundry (for contract development)

### Clone and install

```bash
git clone https://github.com/Stoneybro/complyr
cd complyr
pnpm install
```

### Run the web application

```bash
pnpm dev
```

The application runs at `http://localhost:3000`.

### Environment variables

Create `apps/web/.env.local`:

```bash
# Privy authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Neon PostgreSQL (for contacts)
COMPLYR_DATABASE_URL=postgresql://...

# Relay wallet private key (for Zama transactions)
RELAY_PRIVATE_KEY=0x...

# Envio GraphQL API
NEXT_PUBLIC_ENVIO_API_URL=https://indexer.dev.hyperindex.xyz/86c2f35/v1/graphql
```

### Build contracts

```bash
# Flow EVM contracts
pnpm forge:build

# Run tests
pnpm forge:test
```

### Run the keeper

The keeper script polls the IntentRegistry for executable intents and triggers execution.

```bash
cd packages/keeper
cp .env.example .env
# Fill in PRIVATE_KEY and RPC_URL
pnpm dev
```

The keeper runs on a 30-second poll interval. For production use, deploy it as a persistent service (Railway, Fly.io, or a self-hosted VM).

---

### Account abstraction setup

Complyr uses a self-hosted Skandha bundler deployed on Railway because no public bundler currently supports Flow EVM testnet. The bundler endpoint is configured in `apps/web/src/lib/bundler.ts`.

If you are deploying to a new environment, you will need to:

1. Fork [complyr-bundler](https://github.com/Stoneybro/complyr-bundler) and deploy it
2. Update `bundlerUrl` in `bundler.ts`
3. Fund the `VerifyingPaymaster` deposit on the EntryPoint

---

## Auditor Portal

The Auditor Portal is a dedicated interface that allows external auditors and regulators to verify a company's compliance records without accessing the company's main dashboard.

### How it works

**Sharing access.** A company owner navigates to **Compliance → Access** tab and clicks **Share Access Link**. This copies a URL of the form `https://usecomplyr.vercel.app/auditor/[proxyAddress]` to the clipboard.

**Adding an auditor.** Before sharing the link, the owner adds the auditor's wallet address via **Authorize Auditor**. This transaction is submitted on Zama Sepolia and retroactively grants the auditor FHE decryption access to all existing records.

**Auditor login.** The auditor navigates to the shared URL and connects their wallet (MetaMask or any injected provider). If their address is on the authorised list, the session is established.

**Decryption.** The auditor clicks **Decrypt Compliance Data**. The portal generates a temporary keypair, creates an EIP-712 token scoped to the ComplianceRegistry and signed with a 1-day validity window, and calls `fhevm.userDecrypt`. The Zama KMS validates the signature, checks ACL permissions, and returns plaintext values for every accessible record.

**What auditors can see.** Authorised auditors have full read access to:
- All plaintext record metadata (transaction hash, date, recipients, amounts)
- Decrypted expense category per recipient
- Decrypted jurisdiction per recipient
- Compliance health score and summary statistics

Auditors cannot modify records, authorise other auditors, or access any company data beyond what was explicitly shared.

### Auditor portal URL format

```
https://usecomplyr.vercel.app/auditor/{proxyAccountAddress}
```

Where `proxyAccountAddress` is the company's Flow EVM smart wallet address.

---

## Limitations & Known Constraints

This section documents the honest edges of the current implementation. We are not a company hiding problems — we are builders who understand their own system.

### Testnet only

Complyr currently runs on Flow EVM testnet (chain ID 545) and Zama Sepolia. The infrastructure is not deployed to any mainnet. Contract security has not been audited. Do not use this for real financial transactions.

### LayerZero: no DVN coverage on the Flow EVM Testnet → Sepolia route

The cross-chain compliance bridge is fully implemented and deployed. The `ComplianceBridge` contract on Flow EVM correctly encodes and dispatches messages via LayerZero V2. However, the **Flow EVM Testnet → Sepolia route has no DVN (Decentralised Verifier Network) configured in LayerZero's current testnet infrastructure**. This means messages reach the LayerZero endpoint and are accepted, but are never picked up and forwarded — because no verifier network exists for this specific path on testnet.

This is not a limitation of the bridge implementation. The Flow EVM → Sepolia route is supported on mainnet, which is the reason it was selected for the architecture. The same contracts and message encoding will work correctly in a mainnet deployment where DVNs are active. LayerZero support has been contacted to request DVN coverage for this testnet route.

As a functional substitute, Complyr's relay API (`/api/relay/compliance-record`) submits compliance records directly to the Zama registry with the correct payload structure — demonstrating the full end-to-end integration without depending on the missing testnet infrastructure. The bridge path remains the canonical design for any network where the route has DVN coverage.

### Auditor FHE access revocation is partial

When an auditor is removed, their address is revoked from new records going forward. However, FHE ACL permissions already granted to historical records persist — this is a property of how Zama's on-chain ACL works and cannot be undone without a redesign of the ciphertext storage model. The practical implication is that removing an auditor should be understood as preventing future access, not retroactively restricting historical access.

### Recurring payment execution reliability

Recurring payments depend on a keeper service that must remain online. If the keeper goes offline, executions are simply skipped — there is no catch-up mechanism or queuing. The `shouldExecuteIntent` function checks whether the current time falls within the valid execution window; missed windows are not backfilled. For production use, this would need to be replaced with Chainlink Automation or an equivalent decentralised execution network.

### Maximum recipients per intent

The IntentRegistry enforces a hard limit of 10 recipients per intent. This is sufficient for most payroll and subscription use cases but is not suitable for large-scale airdrop-style distributions.

### Gas limits on `addAuditor` for large ledgers

The retroactive FHE access grant loop in `addAuditor` iterates over all historical records for a company. For companies with hundreds or thousands of records, this call may approach or exceed block gas limits on Zama Sepolia. This is a known limitation of the current architecture and would need to be addressed with a paginated batching mechanism in production.

### fhEVM client-side encryption performance

Encrypting compliance metadata in the browser using Zama's WASM SDK is computationally intensive and can take 2–10 seconds per transaction, during which the browser tab may appear frozen. This is an inherent property of the current fhEVM client-side toolkit. Future versions of the Zama SDK are expected to improve this significantly.

### Single jurisdiction + category per recipient

The current schema supports one jurisdiction and one category code per recipient per transaction. Multi-jurisdiction or multi-category payments — where a single payment has mixed compliance implications — are not supported in this version.

---

## Roadmap

The following capabilities are planned for development after the current release.

### Near term

**Recurring payments stabilisation.** The recurring payment flow (intent creation → scheduled execution via keeper → compliance record linking) is fully designed and implemented but requires additional testing and edge case handling before it can be considered production-ready.

**Dedicated auditor dashboard.** A purpose-built interface for external auditors and regulators to browse, filter, and export compliance records. The current auditor portal is functional but minimal.

### Medium term

**Tax reporting interface.** Aggregation of encrypted compliance records into jurisdiction-specific report formats (e.g., IRS Schedule C summaries, HMRC categorisation, FIRS-compatible formats for Nigeria). The report generator infrastructure is already in place in the frontend; this extends it with structured export formats.

**Multi-jurisdiction and multi-category support.** Extending the compliance schema to allow a single recipient to have multiple applicable jurisdictions or categories, necessary for cross-border contractor payments with split reporting obligations.

**Compliance health scoring.** A richer scoring model that incorporates completeness of metadata, consistency with prior periods, anomaly detection, and jurisdiction-specific threshold checks.

**Paginated auditor grant.** A batching mechanism for `addAuditor` that allows safe retroactive access grants on ledgers with large numbers of records, without risk of hitting block gas limits.

### Long term

**Mainnet deployment.** A security-audited deployment to Flow EVM mainnet once the testnet implementation is validated.

**On-chain compliance proofs.** Rather than relying on auditors to manually decrypt and verify records, generate ZK proofs that attest to specific compliance properties (e.g., "all payments in Q3 were categorised" or "no payments were made to sanctioned jurisdictions") without requiring full decryption.

**DAO treasury integration.** Support for multi-sig governance over compliance metadata, allowing DAOs to attach compliance records to grant distributions and contributor payments through their existing governance flows.

**Programmable compliance rules.** Allow companies to define on-chain compliance policy (minimum metadata completeness, jurisdiction whitelists/blacklists, category budget caps) that the smart wallet enforces at transaction time.

---

*Built for PL Genesis: Frontiers of Collaboration. Powered by Flow EVM, Zama fhEVM, LayerZero V2, and Envio.*