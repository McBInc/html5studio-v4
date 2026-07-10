"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "Investor Due Diligence for Game Studios: What Gets Checked and How to Pass",
  pillar: "Monetization & Business",
  cluster: "Game Investing",
  lastVerified: "March 2026",
  color: "#F1C40F",
  urgency: "active",
  tldr: [
    "Gaming VCs run a four-category diligence process: IP & Legal, Platform Compliance, Privacy & Data, and Financial Metrics — the DIP certification covers all four.",
    "The most common diligence failure point in 2026 is <strong>platform SDK compliance</strong> — non-certified builds with deprecated APIs are automatic passes regardless of revenue metrics.",
    "A complete investor data room for a WebGL studio requires 9 core documents — most studios have 2 or 3. The gap is where deals die.",
    "ARPDAU, D30 retention, and platform diversification index are the three numbers that determine whether a gaming VC takes a second meeting.",
    "Certified builds compress deal timelines from 6–8 weeks to 2–3 weeks because the compliance and IP diligence is pre-done.",
  ],
  relatedSiblings: [
    { slug: "game-investing-guide", title: "Game Investing 101", urgency: "active" },
    { slug: "ton-investor-structure", title: "TON Revenue-Share Tokens", urgency: "hot" },
    { slug: "game-valuations-ma", title: "Game Valuations & M&A", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard (WGL-CERT)" },
    { slug: "pii-privacy-compliance", title: "PII & Privacy Compliance" },
    { slug: "eu-dma-article7", title: "EU DMA Article 7 Interoperability" },
  ],
  faqs: [
    {
      q: "How long does gaming VC due diligence typically take?",
      a: "Standard gaming VC diligence takes 6–10 weeks from first meeting to term sheet. Compliance and IP diligence alone accounts for 2–4 weeks. DIP-certified studios typically compress to 2–3 weeks because the compliance and IP work is pre-done and verifiable on-chain.",
    },
    {
      q: "What is the single most common diligence failure for WebGL studios?",
      a: "Platform SDK compliance. Investors run a basic technical review of the live build and immediately flag deprecated APIs, missing permission wrappers, and non-compliant SDK versions. A build running on Meta SDK v7.x in March 2026 signals a team that isn't monitoring platform requirements — an immediate red flag.",
    },
    {
      q: "Do VCs check the game itself or just the business metrics?",
      a: "Both, but the sequence matters. The first filter is metrics (DAU, retention, ARPDAU). If you pass that, they do a build audit (platform compliance, IP, privacy). If you pass that, they assess team and go-to-market. Most studios fail at the build audit — not because their game is bad, but because their compliance is incomplete.",
    },
    {
      q: "What's a data room and do WebGL studios need one?",
      a: "A data room is a secure document repository you share with investors during diligence. For a WebGL studio, the core data room includes: incorporation docs, IP ownership chain, DIP/WGL-CERT report, DAU/retention cohort data, P&L (even if pre-revenue), platform agreements, and a DCF model. Without these, diligence stalls indefinitely.",
    },
    {
      q: "What happens if IP ownership is disputed during diligence?",
      a: "Disputed IP ownership is a deal-killer. It doesn't matter how good the revenue metrics are — an investor cannot acquire a stake in an asset with unclear ownership. Common disputes: asset store content used without commercial license, contractor-created code without IP assignment clauses, and team co-founder IP not properly vested. The DIP process resolves all three.",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Why Diligence Is Where Deals Die</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        The majority of gaming investment conversations that get to term sheet stage still fail during due diligence. Not because the game is bad. Not because the metrics are wrong. But because the documentation doesn't exist, the build has compliance issues the founders weren't aware of, or the IP chain of title has gaps that create legal uncertainty.
      </p>
      <p className="text-foreground/80 leading-relaxed mb-4">
        For WebGL and HTML5 studios specifically, the 2026 platform compliance environment has added a new diligence failure point that didn't exist two years ago: deprecated SDK patterns. An investor running a technical review of a live Meta Instant Games build can see immediately whether it's running on the current SDK. A v7.x build in March 2026 signals a team that isn't monitoring platform requirements — it's an automatic pass for most thesis-driven funds.
      </p>

      <IntelligenceNote>
        HTML5STUDIO's audit data: <strong>73% of WebGL studio builds presented to investors in Q1 2026 contained at least one diligence-blocking compliance issue</strong> — deprecated SDK patterns, undeclared PII transmission, or unresolved IP ownership gaps. All three are resolvable with the WGL-CERT process before the investor conversation begins.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">The Four Diligence Categories</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        Every gaming VC — regardless of fund size or investment thesis — runs the same four-category diligence process:
      </p>

      <DataTable
        headers={["Category", "What Gets Checked", "Common Failure Points", "DIP Coverage"]}
        rows={[
          ["IP & Legal", "Chain of title, trademarks, asset licenses, contractor IP assignments, no third-party claims", "Asset store content, unlicensed fonts, contractor code without IP clauses", "✓ Full IP chain documented on-chain"],
          ["Platform Compliance", "SDK versions, deprecated API patterns, platform agreement compliance, submission status", "Deprecated SDKs, missing permission wrappers, expired platform tokens", "✓ All 8 platforms audited + remediated"],
          ["Privacy & Data", "GDPR/CCPA compliance, PII data flows, consent mechanisms, third-party data sharing", "Undeclared analytics SDKs, missing consent gates, illegal device fingerprinting", "✓ PII audit + data flow documentation"],
          ["Financial", "DCF model, ARPDAU, DAU trajectory, platform diversification, unit economics", "No revenue data, single-platform dependency, no retention cohorts", "✓ DCF NPV + revenue tier included in DIP"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">The Complete Investor Data Room</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        A complete data room for a WebGL studio investment conversation requires nine documents. Most studios arrive with two or three. The gap is where deals stall or die:
      </p>

      <DataTable
        headers={["Document", "Contents", "DIP Provides?"]}
        rows={[
          ["Corporate Structure", "Incorporation docs, cap table, founder equity, vesting schedule", "No — legal counsel required"],
          ["WGL-CERT / DIP Report", "Full compliance scan, platform audit, remediation status", "Yes — core DIP deliverable"],
          ["IP Ownership Register", "All IP chain of title, asset licenses, contractor IP assignments", "Yes — included in DIP"],
          ["Revenue Analytics Report", "DAU/MAU, D1/D7/D30 retention cohorts, ARPDAU, LTV/CAC", "Partial — DCF model included"],
          ["Platform Agreement Summary", "Active platform relationships, revenue share terms, submission status", "No — studio provides"],
          ["Privacy & Data Flow Audit", "All PII transmissions documented, consent mechanisms verified", "Yes — included in DIP"],
          ["DCF Financial Model", "3-year revenue projection, ARPDAU assumptions, DAU growth model", "Yes — included in DIP"],
          ["Technical Architecture Doc", "Engine, build pipeline, WASM specs, platform SDKs in use", "Partial — SDK audit included"],
          ["Go-to-Market Plan", "UA strategy, platform distribution plan, partnership pipeline", "No — studio provides"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">The Three Numbers That Get You a Second Meeting</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        When a gaming VC reviews a WebGL studio deck, three metrics determine whether you get a second meeting. Everything else is context:
      </p>

      <DataTable
        headers={["Metric", "Minimum for Interest", "Strong Signal", "How to Improve It"]}
        rows={[
          ["ARPDAU", "$0.03+", "$0.15+", "Improve IAP conversion, add ad network, TON Stars integration"],
          ["D30 Retention", "6%+", "15%+", "Core loop tightening, daily quests, social features"],
          ["Platform Diversification", "2+ platforms, no single >70%", "3+ platforms, balanced spread", "WGL-CERT enables multi-platform simultaneously"],
        ]}
      />

      <IntelligenceNote>
        Platform diversification is increasingly weighted by investors post-2024. The gaming VC community watched studios lose 60–80% of revenue when single platforms changed terms (TikTok US ban risk, Meta algorithm changes, Discord monetisation policy updates). A build certified for all 8 platforms with live revenue on 3+ is a fundamentally different risk profile.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Pre-Diligence Checklist: What to Fix Before the Conversation</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        Studios that complete these steps before approaching investors compress their diligence timeline from 6–8 weeks to 2–3 weeks and materially increase deal probability:
      </p>
      <ul className="space-y-2 mb-6 text-foreground/80 text-sm leading-relaxed">
        <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">01</span><span><strong>Get WGL-CERT certified:</strong> Eliminates the platform compliance and IP diligence categories entirely. Investors accept it as pre-verified.</span></li>
        <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">02</span><span><strong>Document your IP chain:</strong> Every asset, font, audio file, and third-party SDK must have a verifiable license. DIP covers this as part of certification.</span></li>
        <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">03</span><span><strong>Pull 90 days of retention cohorts:</strong> D1/D7/D30 data from your analytics platform. If you don't have 90 days of data, soft-launch somewhere to build it.</span></li>
        <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">04</span><span><strong>Launch on a second platform:</strong> Being live on two platforms before the conversation demonstrates execution and reduces concentration risk visibly.</span></li>
        <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">05</span><span><strong>Build a simple DCF model:</strong> Even a conservative one with documented assumptions demonstrates financial literacy and gives the investor something to react to rather than build from scratch.</span></li>
      </ul>
    </>
  ),
};

export default function InvestorDueDiligenceGuide() {
  return <ArticleLayout article={article} />;
}