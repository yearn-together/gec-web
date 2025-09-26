import React from "react";
import { ArrowRight, Database, ShieldCheck, KeyRound, QrCode, Globe, Container, Network, LockKeyhole, Boxes, Cable, Cog, ReceiptText, Workflow, BadgeCheck, FileCheck2, CheckCircle2, XCircle } from "lucide-react";

/**
 * Blockchain Enabled Green Energy Certification – QR On-Chain Verification
 * Context: Green Energy Certificates (ADI chain)
 *
 * Updates in this revision:
 * - Fixed JSX escaping issues (removed stray backslashes like className=\"...\").
 * - Removed raw string in <pre> and generate JSON from an object to avoid escape errors.
 * - Added inline self-check tests (no external framework) to validate key assumptions.
 */

// --- Constants used across diagram and tests ---
const PROD_ENTITY = "producer:5";
const PROJ_ENTITY = "project:sol-101";
const CONS_ENTITY = "consumer:acme-1";
const MONTH = 202509; // E2E month per user instruction

// Example QR token used for display & tests (rendered as pretty JSON)
const qrExample = {
  iss: "onboard-vault",
  aud: "relay-api",
  typ: "qr-session",
  nonce: "0x...",
  exp: 1699999999,
  scope: ["verify:gec"],
  refs: {
    consumerId: CONS_ENTITY,
    tokenId: "0x...",
    monthId: MONTH,
    tx: "0x...", // optional: last settlement/consumption tx ref
  },
  redirect: "/verify?qr=...",
};

const Card = ({ title, subtitle, icon, children, className = "" }: any) => (
  <div className={`group relative rounded-2xl border bg-white/70 dark:bg-zinc-900/70 shadow-sm hover:shadow-md transition p-4 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">{icon}</div>
      <div>
        <div className="text-sm text-zinc-500">{subtitle}</div>
        <div className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</div>
      </div>
    </div>
    {children && <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{children}</div>}
  </div>
);

const Arrow = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-xs text-zinc-500">
    <ArrowRight className="w-4 h-4" />
    <span className="font-medium">{label}</span>
  </div>
);

const TestBadge = ({ pass, children }: { pass: boolean; children: React.ReactNode }) => (
  <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full border ${pass ? "border-emerald-500 text-emerald-700 bg-emerald-50" : "border-rose-500 text-rose-700 bg-rose-50"}`}>
    {pass ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
    <span>{children}</span>
  </div>
);

export default function Diagram() {
  // --- Inline tests (lightweight) ---
  const tests: Array<{name: string; pass: boolean; detail?: string}> = [];
  try {
    const s = JSON.stringify(qrExample);
    tests.push({ name: "QR example is serializable", pass: typeof s === "string" && s.includes("\"refs\"" ) });
  } catch (e) {
    tests.push({ name: "QR example is serializable", pass: false, detail: String(e) });
  }
  tests.push({ name: "refs.monthId matches MONTH", pass: qrExample.refs.monthId === MONTH });
  tests.push({ name: "scope includes verify:gec", pass: Array.isArray(qrExample.scope) && qrExample.scope.includes("verify:gec") });
  tests.push({ name: "redirect starts with /verify?qr=", pass: typeof qrExample.redirect === "string" && qrExample.redirect.startsWith("/verify?qr=") });
  tests.push({ name: "Entities present", pass: PROD_ENTITY === "producer:5" && PROJ_ENTITY === "project:sol-101" && CONS_ENTITY === "consumer:acme-1" });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Blockchain Enabled Green Energy Certification – QR On-Chain Verification</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Highlights container responsibilities, request flow, and trust boundaries — with emphasis that the consume record is validated directly on-chain when the QR is scanned.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500">
            <BadgeCheck className="w-4 h-4" />
            <span>ADI Testnet Ready</span>
          </div>
        </header>

        {/* Legend */}
        <section className="grid md:grid-cols-3 gap-4">
          <Card title="Client / Edge" subtitle="Zone" icon={<Globe className="w-5 h-5" />}>Green Energy Certificate Web Application, certificate scanner, and edge gateway (Nginx/Traefik). Outside cluster boundary.</Card>
          <Card title="Platform Core" subtitle="Docker Services" icon={<Container className="w-5 h-5" />}>APIs, Orchestrators, Off-chain services, KMS/Web3Signer, DBs, Object storage.</Card>
          <Card title="Chain & Registries" subtitle="External" icon={<Network className="w-5 h-5" />}>ADI RPC, smart contracts (GEC1155, SettlementRegistry), event logs.</Card>
        </section>

        {/* Grid Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Client & Edge */}
          <div className="lg:col-span-3 space-y-4">
            <Card title="Green Energy Certificate Web Application" subtitle="Client" icon={<FileCheck2 className="w-5 h-5" />}>
              - Portal for certificate viewing & verification
              <br/>- Requests and scans QR verification links
              <br/>- Displays verified consumption records on-chain
            </Card>
          </div>

          {/* Center: Platform Core */}
          <div className="lg:col-span-6 space-y-4">
            <Card title="relay-api" subtitle="Service :4200 (public)" icon={<Workflow className="w-5 h-5" />}>
              - Public REST for scan/verify/read
              <br/>- Aggregates Vault, DDB, and RPC via rpc-sign-proxy
              <br/>- Validates QR token (nonce, expiry, signature)
              <div className="mt-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs">
                Ports: <span className="font-mono">4200:4200</span> · Depends: rpc-sign-proxy, onboard-vault, dynamodb
              </div>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card title="onboard-vault" subtitle="Service :4000 (internal)" icon={<ShieldCheck className="w-5 h-5" />}>
                - Issues short-lived QR tokens (JWS)
                <br/>- Stores QR session state (nonce) in DDB
                <div className="mt-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs">
                  Depends: vault, web3signer · Expose: 4000
                </div>
              </Card>
              <Card title="rpc-sign-proxy" subtitle=":8545 (internal)" icon={<Cog className="w-5 h-5" />}>
                - Forwards JSON-RPC → ADI RPC
                <br/>- Uses Web3Signer for eth_sign / tx signing when required
                <div className="mt-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs">
                  Depends: web3signer · Expose: 8545
                </div>
              </Card>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Card title="web3signer" subtitle=":9000 (internal)" icon={<KeyRound className="w-5 h-5" />}>
                - Signs on-chain payloads & attestations (Eth1 mode)
                <br/>- Chain ID: 36900
                <div className="mt-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs">
                  Ports: <span className="font-mono">9000:9000</span> · Key store: /keys/config
                </div>
              </Card>
              <Card title="Object Storage" subtitle="MinIO / S3" icon={<Boxes className="w-5 h-5" />}>
                - QR images, static artifacts, receipts
                <br/>- Pre-signed URLs for client
              </Card>
              <Card title="dynamodb" subtitle=":8000 (internal)" icon={<Database className="w-5 h-5" />}>
                - Tables: entities, sessions, proofs, audits
                <br/>- TTL for QR nonces & expiries
                <div className="mt-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs">Ports: 8000:8000 · Mode: inMemory, sharedDb</div>
              </Card>
            </div>
          </div>

          {/* Right: Chain */}
          <div className="lg:col-span-3 space-y-4">
            <Card title="ADI RPC" subtitle="Chain Node / Provider" icon={<Network className="w-5 h-5" />}>
              - JSON-RPC: <span className="font-mono">RPC_URL</span>
              <br/>- Reads: balances, logs, token URIs
              <br/>- Optional: fallback providers
            </Card>
            <Card title="GEC Registry" subtitle="ERC-1155" icon={<ReceiptText className="w-5 h-5" />}>
              - Address: <span className="font-mono">GEC_ADDR</span>
              <br/>- Minted daily energy units
              <br/>- Ownership & transfers
            </Card>
            <Card title="SettlementRegistry" subtitle="Contract" icon={<LockKeyhole className="w-5 h-5" />}>
              - Address: <span className="font-mono">SR_ADDR</span>
              <br/>- Anchored month commits
              <br/>- Merkle roots for consumption
            </Card>
          </div>
        </section>

        {/* Flow Diagram */}
        <section className="rounded-2xl border bg-white/60 dark:bg-zinc-900/60 p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Cable className="w-5 h-5"/> End-to-End Flow – PROD_ENTITY, PROJ_ENTITY, CONS_ENTITY ({PROD_ENTITY}, {PROJ_ENTITY}, {CONS_ENTITY})</h2>
          <div className="rounded-xl border p-3 bg-emerald-50/60 dark:bg-emerald-900/20 text-xs mb-3">
            <div className="font-semibold mb-1">Preconditions</div>
            <ul className="list-disc ml-5 space-y-1">
              <li>Keep <span className="font-mono">PROD_ENTITY={PROD_ENTITY}</span>, <span className="font-mono">PROJ_ENTITY={PROJ_ENTITY}</span>, <span className="font-mono">CONS_ENTITY={CONS_ENTITY}</span>.</li>
              <li>Ensure each entity's <span className="font-mono">ethAddress</span> is saved in <span className="font-mono">GEC_Entities</span> before running.</li>
              <li>Run E2E with <span className="font-mono">MONTH={MONTH}</span>.</li>
            </ul>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <Arrow label="1) User opens Green Energy Certificate Web App and taps ‘Verify’" />
              <div className="mt-2">Web app requests a new QR session from <span className="font-mono">relay-api:4200</span>.</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <Arrow label="2) relay-api → onboard-vault" />
              <div className="mt-2">Vault creates one-time QR token (nonce+exp) and stores session in <span className="font-mono">dynamodb</span>.</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <Arrow label="3) relay-api → (optional) rpc-sign-proxy → web3signer" />
              <div className="mt-2">If required, signs attestation/JWS; otherwise proceeds with unsigned QR JWS from onboard-vault.</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <Arrow label="4) Web App displays QR" />
              <div className="mt-2">QR encodes <span className="font-mono">/verify?qr=...</span> with short expiry; image or payload generated by relay-api.</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <Arrow label="5) Scanner → relay-api /verify" />
              <div className="mt-2">relay-api validates: JWS signature (onboard-vault key), nonce unused, not expired, audience/scope ok.</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <Arrow label="6) relay-api → rpc-sign-proxy → ADI RPC (On-Chain Consume Validation)" />
              <div className="mt-2">Reads GEC (ERC-1155) ownership and validates consume record directly on-chain using SettlementRegistry root/logs; web3signer used if signing needed.</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <Arrow label="7) relay-api → Green Energy Certificate Web App (result)" />
              <div className="mt-2">Returns verification status + metadata (entity, units, monthId, tx refs). Web app renders green/red certificate state.</div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border p-4 bg-white/60 dark:bg-zinc-900/60">
            <h3 className="font-semibold mb-2">E2E Operations (API sequence for MONTH={MONTH})</h3>
            <ol className="list-decimal ml-5 text-sm space-y-1">
              <li><span className="font-medium">add-producer (admin)</span> — register <span className="font-mono">{PROD_ENTITY}</span> with <span className="font-mono">ethAddress</span> in <span className="font-mono">GEC_Entities</span>.</li>
              <li><span className="font-medium">producer/add-project</span> — link <span className="font-mono">{PROJ_ENTITY}</span> under producer with its <span className="font-mono">ethAddress</span>.</li>
              <li><span className="font-medium">project/mint</span> — mint daily GEC units for <span className="font-mono">MONTH={MONTH}</span> to project address.</li>
              <li><span className="font-medium">project/consume ×3</span> — record three consumption entries for <span className="font-mono">{CONS_ENTITY}</span> (creates Merkle leaves in DB).</li>
              <li><span className="font-medium">settlement/build-from-db</span> — build Merkle tree from DB leaves for <span className="font-mono">{MONTH}</span>.</li>
              <li><span className="font-medium">settlement/anchor-from-db</span> — anchor the Merkle <em>root</em> on-chain in <span className="font-mono">SettlementRegistry</span> (tx hash returned).</li>
              <li><span className="font-medium">settlement/qr</span> — issue QR (JWS) with <span className="font-mono">refs</span> (tokenId, monthId={MONTH}, consumerId) and a nonce/exp.</li>
              <li><span className="font-medium">settlement/verify-qr</span> — scan triggers on-chain verification against the anchored root; result returned to the web app.</li>
            </ol>
            <p className="text-xs text-zinc-500 mt-2">Note: Flow step 6 “On-Chain Consume Validation” corresponds to <span className="font-mono">settlement/verify-qr</span> validating inclusion against the anchored root from <span className="font-mono">settlement/anchor-from-db</span>.</p>
          </div>
        </section>

        {/* Trust Boundaries & Notes */}
        <section className="grid md:grid-cols-3 gap-4">
          <Card title="Trust Boundary #1" subtitle="Public ↔ relay-api" icon={<ShieldCheck className="w-5 h-5" />}>
            Only <span className="font-mono">relay-api:4200</span> is on the <em>public</em> network; others remain on <em>internal</em>.
          </Card>
          <Card title="Trust Boundary #2" subtitle="Signer" icon={<KeyRound className="w-5 h-5" />}>
            web3signer isolated; only rpc-sign-proxy (and onboard-vault if needed) can reach it.
          </Card>
          <Card title="Trust Boundary #3" subtitle="Chain" icon={<Network className="w-5 h-5" />}>
            Outbound to ADI RPC via rpc-sign-proxy; rate-limit & egress-allowlist at the host firewall.
          </Card>
        </section>

        {/* QR Token Schema */}
        <section className="rounded-2xl border bg-white/60 dark:bg-zinc-900/60 p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><QrCode className="w-5 h-5"/> QR Token (JWS) – Claims wired to onboard-vault</h2>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <pre className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 overflow-auto">{JSON.stringify(qrExample, null, 2)}</pre>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
              <ul className="list-disc ml-5 space-y-1">
                <li><span className="font-mono">nonce</span>: single-use, stored with TTL in DynamoDB</li>
                <li><span className="font-mono">exp</span>: 60–120s</li>
                <li><span className="font-mono">iss/aud</span>: onboard-vault → relay-api</li>
                <li><span className="font-mono">refs.tokenId/monthId</span>: lookup keys only — <strong>no trust in QR data</strong></li>
                <li><strong>On-chain validation</strong>: relay-api verifies consumption on ADI chain (GEC balance/owner + <span className="font-mono">SettlementRegistry</span> Merkle root & proof)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Inline Self-Checks */}
        <section className="rounded-2xl border bg-white/60 dark:bg-zinc-900/60 p-4">
          <h2 className="text-lg font-semibold mb-3">Inline Self-Checks</h2>
          <div className="flex flex-wrap gap-2">
            {tests.map((t, i) => (
              <TestBadge key={i} pass={t.pass}>{t.name}</TestBadge>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-xs text-zinc-500 pt-2">
          Tip: This view matches your compose services (vault, web3signer, dynamodb, rpc-sign-proxy, onboard-vault, relay-api, init-ddb). Add your contract addresses (GEC_ADDR, SR_ADDR) and RPC_URL via .env for completeness.
        </footer>
      </div>
    </div>
  );
}
