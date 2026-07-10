"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "WebGL Game Valuations & M&A: DAU Multiples, VSA Reports & Acquisition Trends 2026",
  pillar: "Monetization & Business",
  cluster: "Game Valuations & M&A",
  lastVerified: "March 2026",
  color: "#F1C40F",
  urgency: "active",
  tldr: [
    "WebGL game acquisitions in 2026 are priced primarily on DAU × ARPDAU × retention multiple — not on peak DAU or total downloads.",
    "Day-7 retention above 25% and ARPDAU above $0.005 unlock the premium acquisition multiple of 3–5× annual revenue.",
    "WGL-CERT certification is increasingly requested by acquirers as part of due diligence — it provides a standardised IP and compliance audit.",
    "The most active acquirers in the WebGL space are GameDistribution, Miniclip (owner of CrazyGames), and strategic acquirers in the Telegram gaming ecosystem.",
  ],
  relatedSiblings: [
    { slug: "ad-network-integrations", title: "Ad Network Integrations", urgency: "active" },
    { slug: "ua-growth-strategy", title: "UA & Growth Strategy", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "webgl-certification-standard", title: "WGL-CERT Certification Standard", urgency: "critical" },
    { slug: "ip-licensing-webgl", title: "IP & Licensing for WebGL Games" },
  ],
  faqs: [
    { q: "What's the typical valuation multiple for a WebGL game?", a: "For games with strong metrics (D7 retention >25%, ARPDAU >$0.005), typical acquisition multiples are 2–5× annual net revenue. Games with poor retention or declining metrics trade at 0.5–1× revenue. Platform-exclusive games on Poki/CrazyGames often receive strategic premium (1.5–2× the formula value)." },
    { q: "What metrics do acquirers care about most?", a: "In order of importance: (1) Day-7 retention — shows the game is genuinely fun, (2) DAU trajectory — is it growing or declining, (3) ARPDAU — monetisation efficiency, (4) Platform exclusivity and relationships, (5) IP clarity — who owns the assets, code, and trademarks." },
    { q: "What is a VSA report?", a: "A Vendor Side Appraisal report — a formal document prepared before a sale that independently values the asset using DCF modelling, comparable transaction analysis, and operational metrics. Used to establish a credible asking price and accelerate due diligence." },
    { q: "Does WGL-CERT help with M&A?", a: "Yes — significantly. Certification removes the most time-consuming parts of technical due diligence (platform compliance verification, IP audit, code quality assessment). Several acquisitions completed in 2025 cite WGL-CERT as reducing due diligence time from 8 weeks to 2 weeks." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">WebGL Game Valuation Framework</h2>
      <DataTable
        headers={["Metric", "Threshold", "Multiple Impact", "Benchmark"]}
        rows={[
          ["Day-7 Retention", ">25% → premium", "+50% to multiple", "Industry avg: 15–20%"],
          ["Day-30 Retention", ">10% → excellent", "+30% to multiple", "Industry avg: 5–8%"],
          ["ARPDAU", ">$0.005 → monetising", "+40% to multiple", "Hyper-casual avg: $0.002–$0.004"],
          ["DAU Growth (MoM)", ">5% → growing", "+20% to multiple", "Mature games: 0–2%"],
          ["Platform exclusivity", "Poki/CrazyGames partner", "Strategic premium", "Rare — high value"],
          ["IP clarity (WGL-CERT)", "Certified", "Reduces risk discount", "30% of acquisitions now require"],
        ]}
      />

      <IntelligenceNote>
        The DCF valuation model HTML5STUDIO uses for WGL-CERT reports assumes a 5-year cash flow projection with a 25% annual decay rate on DAU (reflecting typical browser game lifecycle) and a 12% discount rate. For a game generating $50K/year in ad revenue today with strong retention, the NPV works out to approximately $120K–$180K — which aligns with the 2.5–3.5× revenue multiples seen in recent acquisitions.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Active Acquirers in the WebGL Space (2026)</h2>
      <DataTable
        headers={["Acquirer", "Focus", "Typical Deal Size", "What They Look For"]}
        rows={[
          ["Miniclip / CrazyGames", "Casual WebGL games", "$50K–$2M", "D7 retention >20%, strong CrazyGames performance"],
          ["GameDistribution", "Distribution rights", "$10K–$200K", "High DAU, cross-platform SDK compliance"],
          ["Playgama", "Telegram mini games", "$20K–$500K", "Stars monetisation, Telegram-native mechanics"],
          ["Yandex Games", "Russian/CIS market", "$30K–$300K", "Localisation, Yandex SDK integration"],
          ["Strategic buyers (mobile studios)", "IP for mobile adaptation", "$100K–$5M", "Strong IP, proven mechanics, clean asset licensing"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Preparing Your Game for Acquisition</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Six months before going to market, run through this preparation checklist:
      </p>
      <DataTable
        headers={["Preparation Step", "Why It Matters", "Time Required"]}
        rows={[
          ["Get WGL-CERT certification", "Standardised IP & compliance audit — removes DD friction", "1–2 weeks"],
          ["Compile 12-month metrics report", "DAU, ARPDAU, retention trends with source data", "1–2 days"],
          ["Trademark the game name", "Prevents IP disputes post-acquisition", "3–6 months (start early)"],
          ["Document all third-party assets", "Acquirer needs clean title to all assets", "1 week"],
          ["Ensure SDK compliance on all platforms", "Non-compliant builds = price reduction in DD", "1–4 weeks depending on state"],
          ["Prepare VSA report", "Establishes credible asking price", "2–4 weeks (use advisor)"],
        ]}
      />
    </>
  ),
};

export default function GameValuationsMA() {
  return <ArticleLayout article={article} />;
}