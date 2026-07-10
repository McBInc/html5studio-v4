"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "TON Revenue-Share Tokens: The Trustless Investor Structure for Game Studios",
  pillar: "Monetization & Business",
  cluster: "Game Investing",
  lastVerified: "March 2026",
  color: "#9B59B6",
  urgency: "hot",
  tldr: [
    "TON blockchain smart contracts enable <strong>per-transaction revenue splits</strong> that execute atomically — investor, studio, and operator shares settle in the same block as the player payment.",
    "Revenue-share tokens are <strong>transferable</strong> — investors can sell their stream on secondary markets without requiring a studio exit or M&A event.",
    "Telegram already runs ad revenue sharing via TON toncoin — the infrastructure exists and is battle-tested at 900M+ user scale.",
    "The trustless model eliminates the core risk in traditional publishing deals: studios no longer need to trust revenue reports, and investors no longer need to trust publishers.",
    "This is the first investment structure in game history that pays investors in real-time, per-session, without requiring a fund cycle or dividend timeline.",
  ],
  relatedSiblings: [
    { slug: "game-investing-guide", title: "Game Investing 101", urgency: "active" },
    { slug: "iap-stars-ton-payments", title: "IAP & Stars / TON Payments", urgency: "hot" },
    { slug: "game-valuations-ma", title: "Game Valuations & M&A", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "telegram-mini-apps", title: "Telegram Mini Apps SDK 7.0" },
    { slug: "web3-play-to-earn", title: "Web3 & Play-to-Earn" },
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard" },
  ],
  faqs: [
    {
      q: "How does a TON revenue-share smart contract actually work?",
      a: "A FunC smart contract is deployed on the TON blockchain with pre-configured split percentages (e.g., 75% studio / 15% investor / 10% HTML5STUDIO). Every payment — Telegram Stars, direct TON, or cross-platform treasury — routes through the contract first. It atomically executes all transfers in the same block. No manual settlement, no intermediary.",
    },
    {
      q: "What happens to revenue from non-Telegram platforms?",
      a: "Non-TON revenue (Meta IAP, Discord subscriptions, YouTube ad revenue) flows into a cross-platform treasury contract. The treasury executes weekly settlement cycles, converting fiat and other tokens to TON and distributing according to the same split percentages. The on-chain record is maintained for all settlements.",
    },
    {
      q: "Can an investor really sell their revenue-share position?",
      a: "Yes. The investor's revenue-share position is represented as a TEP-66 compliant token on TON. It can be transferred to any TON wallet, listed on TON-native DEXes, or used as collateral in DeFi protocols. This creates genuine liquidity for what was previously an entirely illiquid asset class.",
    },
    {
      q: "What's the difference between a revenue token and traditional equity?",
      a: "Traditional equity requires an exit event (M&A, IPO) to realise returns — often 5–10 years. A revenue token pays continuously from day one of game launch. Equity gives voting rights and proportional ownership. A revenue token gives only economic rights (the revenue stream) with no governance claim. For most game investors, the economics are what matters.",
    },
    {
      q: "Is this legally compliant in all jurisdictions?",
      a: "Revenue-share tokens structured as contractual payment rights (not as securities or investment contracts) have been structured successfully in multiple jurisdictions. However, legal classification varies by country. Studios and investors should obtain jurisdiction-specific legal advice. HTML5STUDIO provides a model term sheet reviewed by Web3 legal specialists.",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Why the Traditional Publishing Deal Is Broken</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        The standard game publisher-developer deal is built on trust. The developer trusts the publisher to report revenue accurately. The investor trusts the publisher's quarterly statements. The publisher trusts the platform's payment records. Every layer in this chain is a potential point of dispute, delay, or fraud.
      </p>
      <p className="text-foreground/80 leading-relaxed mb-4">
        In the traditional model, a game studio that signs with a publisher might wait 90 days for first payment, 6 months to see full revenue transparency, and 5+ years for any meaningful return on the publisher's equity. Investors backing that studio face the same timeline — compounded by the opacity of the publisher's own financial reporting.
      </p>
      <p className="text-foreground/80 leading-relaxed mb-4">
        The TON smart contract model eliminates trust as a variable. The blockchain IS the revenue report. Every transaction is public, immutable, and settled in seconds.
      </p>

      <IntelligenceNote>
        Telegram already runs ad revenue sharing through TON at scale — channel owners receive 50% of ad revenue in toncoin, automatically, per campaign. The technical infrastructure for trustless per-transaction revenue distribution is proven and live at 900M+ user scale. We're extending the same mechanism to game revenue splits.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">The Smart Contract Architecture</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        The TON revenue-share contract is a FunC smart contract with three core components:
      </p>

      <DataTable
        headers={["Component", "Function", "Tech Stack"]}
        rows={[
          ["Split Logic Contract", "Receives incoming payment, calculates percentages, executes transfers atomically", "FunC on TON, TEP-62 compatible"],
          ["Treasury Contract", "Holds cross-platform fiat revenue for settlement; executes weekly TON distribution", "FunC + Jetton wallet integration"],
          ["Revenue Token (jetton)", "Represents investor's share — transferable, auditable, DeFi-composable", "TEP-74 Jetton standard (TON fungible token)"],
        ]}
      />

      <CodeBlock code={`;; Simplified FunC revenue split contract
;; Splits incoming TON payment between studio, investor, operator

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ;; Parse payment message
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    slice sender = cs~load_msg_addr();

    ;; Define split percentages (basis points, out of 1000)
    int studio_bps = 750;    ;; 75.0% to studio
    int investor_bps = 150;  ;; 15.0% to investor
    int operator_bps = 100;  ;; 10.0% to operator (HTML5STUDIO)

    ;; Calculate amounts
    int studio_amount = msg_value * studio_bps / 1000;
    int investor_amount = msg_value * investor_bps / 1000;
    int operator_amount = msg_value * operator_bps / 1000;

    ;; Execute atomic transfers
    send_raw_message(make_payment(studio_address, studio_amount), 0);
    send_raw_message(make_payment(investor_address, investor_amount), 0);
    send_raw_message(make_payment(operator_address, operator_amount), 0);
    ;; All three execute in the same TON block — atomic, irrevocable
}`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">The Revenue Token as Tradeable Asset</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        The investor's position is minted as a TEP-74 Jetton (TON's fungible token standard). This means it behaves like any other TON token:
      </p>

      <DataTable
        headers={["Capability", "Traditional Equity", "Revenue Token"]}
        rows={[
          ["When does it pay?", "On exit event (M&A / IPO) or declared dividend", "Every player transaction, from day one"],
          ["Liquidity", "Illiquid until exit — often 5–10 years", "Transferable immediately — trade on TON DEX"],
          ["Revenue transparency", "Quarterly statements from publisher", "Real-time on-chain — public and immutable"],
          ["Governance rights", "Voting rights proportional to equity", "None — pure economic rights only"],
          ["Cross-studio composability", "Single asset, single company", "Multiple game tokens can be held in one wallet"],
          ["DeFi utility", "None", "Usable as collateral in TON DeFi protocols"],
        ]}
      />

      <IntelligenceNote>
        The secondary market for game revenue tokens does not yet exist at scale — but the infrastructure does. TON's DEX ecosystem (DeDust, STON.fi) already supports custom Jetton pairs. The first game studio to publicly list a revenue-share token on a TON DEX will create a new asset class. This is a first-mover opportunity.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Cross-Platform Revenue Bridge</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        Games don't only earn on Telegram. A typical WebGL studio earns across Meta Instant Games, Discord Activities, YouTube Playables, and direct browser play simultaneously. Connecting these revenue streams to the TON settlement layer requires a treasury bridge:
      </p>

      <DataTable
        headers={["Platform", "Payment Type", "Bridge Mechanism", "Settlement Frequency"]}
        rows={[
          ["Telegram", "Stars / direct TON", "Direct to split contract", "Per-transaction (seconds)"],
          ["Meta Instant Games", "Facebook Credits / IAP", "Treasury contract via Meta Payments API", "Weekly settlement"],
          ["Discord Activities", "Discord Nitro credits / IAP", "Treasury contract via Discord monetisation API", "Weekly settlement"],
          ["YouTube Playables", "Ad revenue share", "Treasury contract via Google AdSense API", "Monthly settlement"],
          ["Direct browser (Poki/CrazyGames)", "Ad revenue CPM", "Treasury contract via ad network API", "Monthly settlement"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">The HTML5STUDIO Ambassador Deal Structure</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        The HTML5STUDIO Compliance Ambassador Program packages this infrastructure for studios who can't afford the compliance journey upfront:
      </p>
      <ul className="space-y-2 mb-6 text-foreground/80 text-sm leading-relaxed">
        <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">▸</span><span><strong>HTML5STUDIO covers:</strong> Full WGL-CERT compliance scan, DIP certification, remediation patches, multi-platform verification, TON smart contract deployment.</span></li>
        <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">▸</span><span><strong>Studio provides:</strong> 3–8% equity stake (SAFE note) + operator slot in the revenue split contract (5–10%).</span></li>
        <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">▸</span><span><strong>Investor receives:</strong> 10–20% revenue token — transferable, paying from day one of launch.</span></li>
        <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">▸</span><span><strong>All parties benefit from:</strong> Certified build, faster VC diligence, trustless revenue accounting.</span></li>
      </ul>
    </>
  ),
};

export default function TONInvestorStructure() {
  return <ArticleLayout article={article} />;
}