"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import Link from 'next/link';


export default function TONBriefing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(155,89,182,0.12)", border: "1px solid rgba(155,89,182,0.25)" }}>
              <Shield className="w-3.5 h-3.5" style={{ color: "#9B59B6" }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9B59B6" }}>Internal / Board Use Only</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              TON Blockchain & Telegram Stars Payment Infrastructure
            </h1>
            <p className="text-sm text-muted-foreground font-mono">Prepared for Board of Directors · March 20, 2026</p>
          </div>

          {/* Executive Summary */}
          <section className="mb-12 rounded-2xl border p-6" style={{ borderColor: "rgba(30,111,240,0.2)", background: "rgba(30,111,240,0.04)" }}>
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Executive Summary
            </h2>
            <ul className="space-y-3 text-sm text-foreground/85 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                <span><strong>TON blockchain achieves transaction finality in 5 seconds</strong> — fastest in the industry, enabling real-time payment settlement for game monetization with irreversible confirmation after a single masterchain block.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                <span><strong>Current TON price: $1.23–$1.32 USD</strong> (March 2026) — down from $8–9 peak in mid-2024 but stabilizing with deflationary tokenomics (50% of all fees burned). Conservative 2026 projections: $4.50–$6.50 by year-end.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                <span><strong>Transaction costs are negligible: ~$0.001–$0.01 per payment</strong> — enabling micro-transaction business models. Telegram Stars integration allows developers to withdraw earnings directly to TON wallets with transparent, on-chain settlement.</span>
              </li>
            </ul>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4">1. TON Blockchain Transaction Registration Process</h2>
            <h3 className="text-lg font-bold mb-3 text-foreground/90">How a Transaction is Recorded (Non-Technical Overview)</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              When a player makes a payment (Telegram Stars, in-app purchase, or direct TON transfer), the following sequence occurs:
            </p>
            
            <div className="space-y-4">
              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-bold mb-1">Step 1: Transaction Submission</h4>
                <p className="text-sm text-muted-foreground">The payment is broadcast to the TON network as a "message" containing sender/recipient wallets, amount, and optional metadata.</p>
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-bold mb-1">Step 2: Shard Processing</h4>
                <p className="text-sm text-muted-foreground">TON uses a "sharded" architecture — the network splits into parallel processing lanes called shardchains for validation.</p>
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-bold mb-1">Step 3: Masterchain Finalization</h4>
                <p className="text-sm text-muted-foreground">All shardchain activity consolidates into a single masterchain block every ~5 seconds. Once recorded, the transaction is irreversible and final.</p>
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-bold mb-1">Step 4: Smart Contract Execution (Optional)</h4>
                <p className="text-sm text-muted-foreground">If the payment triggers a smart contract (e.g., automatic revenue split), all distributions happen atomically in the same block — no intermediary required.</p>
              </div>
            </div>
          </section>

          {/* Section 2 - Fees */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4">2. Transaction Costs & Fee Structure</h2>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <th className="text-left px-4 py-3 font-bold">Fee Type</th>
                    <th className="text-left px-4 py-3 font-bold">Purpose</th>
                    <th className="text-left px-4 py-3 font-bold">Typical Cost (TON)</th>
                    <th className="text-left px-4 py-3 font-bold">Cost (USD @ $1.30)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold">Storage Fee</td>
                    <td className="px-4 py-3 text-muted-foreground">Storing data on-chain over time</td>
                    <td className="px-4 py-3 font-mono">0.0001–0.001</td>
                    <td className="px-4 py-3 font-mono">$0.0001–$0.001</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold">Compute Fee</td>
                    <td className="px-4 py-3 text-muted-foreground">Executing smart contract logic (gas)</td>
                    <td className="px-4 py-3 font-mono">0.001–0.01</td>
                    <td className="px-4 py-3 font-mono">$0.001–$0.013</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold">Forward Fee</td>
                    <td className="px-4 py-3 text-muted-foreground">Routing message between addresses</td>
                    <td className="px-4 py-3 font-mono">0.0005–0.005</td>
                    <td className="px-4 py-3 font-mono">$0.0006–$0.0065</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold">Import Fee</td>
                    <td className="px-4 py-3 text-muted-foreground">Processing inbound external messages</td>
                    <td className="px-4 py-3 font-mono">0.0005–0.002</td>
                    <td className="px-4 py-3 font-mono">$0.0006–$0.0026</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm font-bold mt-4" style={{ color: "#00FF88" }}>
              Total Typical Transaction Cost: 0.002–0.02 TON (~$0.003–$0.026 USD)
            </p>
          </section>

          {/* Section 3 - Telegram Stars */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4">3. Telegram Stars Payment System</h2>
            <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "rgba(155,89,182,0.2)", background: "rgba(155,89,182,0.04)" }}>
              <h3 className="text-base font-bold mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4" style={{ color: "#9B59B6" }} />
                What Are Telegram Stars?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Telegram Stars is a virtual currency built into Telegram. Users purchase Stars with fiat (credit card, Apple Pay, Google Pay) and spend them inside bots and Mini Apps — including games.
              </p>
            </div>
            <h3 className="text-base font-bold mb-2">Developer Flow:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside mb-4">
              <li>Player buys 100 Stars for $1.00 (example pricing)</li>
              <li>Player spends 50 Stars on in-game item</li>
              <li>Developer receives 50 Stars in their balance</li>
              <li>Developer withdraws Stars to TON wallet (1 Star = X TON, variable exchange rate)</li>
              <li>Developer converts TON to USD via exchange</li>
            </ol>
            <h3 className="text-base font-bold mb-2">Revenue Split Model</h3>
            <p className="text-sm text-muted-foreground mb-2">Telegram does not publish official revenue splits for Stars, but industry analysis suggests:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ background: "#00FF88" }} />
                <span><strong style={{ color: "#00FF88" }}>Developer receives: 70–85%</strong> of gross Stars revenue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ background: "#FF6B00" }} />
                <span><strong style={{ color: "#FF6B00" }}>Telegram platform fee: 15–30%</strong></span>
              </li>
            </ul>
          </section>

          {/* Section 4 - Price History */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4">4. TON Price History & Growth Trajectory</h2>
            <div className="overflow-x-auto rounded-xl border border-white/8 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <th className="text-left px-4 py-3 font-bold">Period</th>
                    <th className="text-left px-4 py-3 font-bold">TON Price (USD)</th>
                    <th className="text-left px-4 py-3 font-bold">Event</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-mono">Mid-2024</td>
                    <td className="px-4 py-3 font-mono font-bold" style={{ color: "#00FF88" }}>$8.00–$9.00</td>
                    <td className="px-4 py-3 text-muted-foreground">Peak driven by Telegram Mini Apps launch</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-mono">Q4 2024</td>
                    <td className="px-4 py-3 font-mono">$5.00–$6.00</td>
                    <td className="px-4 py-3 text-muted-foreground">Correction after initial hype cycle</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-mono">Jan 2025</td>
                    <td className="px-4 py-3 font-mono">$1.60–$1.70</td>
                    <td className="px-4 py-3 text-muted-foreground">Stabilization with increased developer adoption</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold">Mar 2026 (Current)</td>
                    <td className="px-4 py-3 font-mono font-bold" style={{ color: "#1e6ff0" }}>$1.23–$1.32</td>
                    <td className="px-4 py-3 text-muted-foreground">Consolidation phase; deflationary mechanism active</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "rgba(241,196,15,0.2)", background: "rgba(241,196,15,0.04)" }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#F1C40F" }}>2026 Analyst Projections</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Conservative (CoinCodex): $1.56 by March 30, 2026</li>
                <li>• Moderate (Changelly): $3.61–$5.84 by April 2026</li>
                <li>• Aggressive (CryptoRank): $4.50–$6.50 by December 2026</li>
              </ul>
            </div>
          </section>

          {/* Section 7 - Worked Example */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4">7. Financial Mechanics: Worked Example</h2>
            <p className="text-sm text-muted-foreground mb-4"><strong>Scenario:</strong> Game generates $100,000 in monthly revenue via Telegram Stars</p>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <th className="text-left px-4 py-3 font-bold">Stage</th>
                    <th className="text-left px-4 py-3 font-bold">Amount</th>
                    <th className="text-left px-4 py-3 font-bold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">Gross Player Spending</td>
                    <td className="px-4 py-3 font-mono font-bold">$100,000</td>
                    <td className="px-4 py-3 text-muted-foreground">Players purchase Stars with fiat</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">Telegram Platform Fee (20%)</td>
                    <td className="px-4 py-3 font-mono" style={{ color: "#FF6B00" }}>-$20,000</td>
                    <td className="px-4 py-3 text-muted-foreground">Industry-standard estimate</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold">Developer Receives (Stars)</td>
                    <td className="px-4 py-3 font-mono font-bold">$80,000</td>
                    <td className="px-4 py-3 text-muted-foreground">Withdrawn as TON</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">TON Conversion (at $1.30/TON)</td>
                    <td className="px-4 py-3 font-mono">61,538 TON</td>
                    <td className="px-4 py-3 text-muted-foreground">Stars → TON wallet</td>
                  </tr>
                  <tr className="border-b border-white/5" style={{ background: "rgba(155,89,182,0.03)" }}>
                    <td className="px-4 py-3 font-semibold" colSpan="3">Smart Contract Split Execution (Atomic)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 pl-8">• Studio (70%)</td>
                    <td className="px-4 py-3 font-mono">43,077 TON</td>
                    <td className="px-4 py-3 font-mono">$56,000</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 pl-8">• Investor (20%)</td>
                    <td className="px-4 py-3 font-mono">12,308 TON</td>
                    <td className="px-4 py-3 font-mono">$16,000</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 pl-8">• Platform (10%)</td>
                    <td className="px-4 py-3 font-mono">6,154 TON</td>
                    <td className="px-4 py-3 font-mono">$8,000</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">Transaction Fees (0.01 TON/tx)</td>
                    <td className="px-4 py-3 font-mono" style={{ color: "#FF6B00" }}>-150 TON</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">~15,000 transactions @ $0.013 each</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">Exchange Fees (0.3% to USD)</td>
                    <td className="px-4 py-3 font-mono" style={{ color: "#FF6B00" }}>-185 TON</td>
                    <td className="px-4 py-3 text-muted-foreground">Converting TON → USD via Binance</td>
                  </tr>
                  <tr style={{ background: "rgba(0,255,136,0.06)" }}>
                    <td className="px-4 py-3 font-bold">Net Studio Revenue (USD)</td>
                    <td className="px-4 py-3 font-mono font-black text-xl" style={{ color: "#00FF88" }}>$55,760</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">After all fees (55.76% of gross)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-4 p-4 rounded-lg" style={{ background: "rgba(30,111,240,0.06)", border: "1px solid rgba(30,111,240,0.2)" }}>
              <strong className="text-primary">Key Insight:</strong> Developer retains 55.76% of gross revenue — comparable to traditional app stores (Apple/Google take 30%, leaving 70%). The advantage: real-time settlement, on-chain transparency, and programmable revenue splits.
            </p>
          </section>

          {/* Risks */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" style={{ color: "#EE1D52" }} />
              Strategic Risks
            </h2>
            <div className="space-y-3">
              {[
                { label: "Price Volatility", desc: "TON fluctuated from $9 to $1.30 in 18 months — revenue projections require hedging strategies" },
                { label: "Regulatory Uncertainty", desc: "Cryptocurrency regulations vary by jurisdiction; compliance burden on developers" },
                { label: "No Platform Certification", desc: "Telegram does not vet or endorse developers — quality control is self-managed" },
                { label: "Exchange Risk", desc: "Converting TON to USD requires third-party exchanges with varying fees (0.1–0.5%)" },
                { label: "Smart Contract Risk", desc: "Bugs in revenue-split contracts could lock funds; requires professional audit" },
              ].map((risk, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border" style={{ borderColor: "rgba(238,29,82,0.2)", background: "rgba(238,29,82,0.04)" }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#EE1D52" }} />
                  <div>
                    <h4 className="text-sm font-bold mb-1">{risk.label}</h4>
                    <p className="text-xs text-muted-foreground">{risk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-border pt-6 mt-12">
            <p className="text-xs text-muted-foreground/40 font-mono text-center">
              Document Classification: Internal / Board Use Only · Next Review Date: Q2 2026 (post-pilot implementation)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}