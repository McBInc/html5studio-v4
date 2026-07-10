"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "EU Digital Markets Act Article 7 — What 'Certified Compliance Proof' Means for Game Publishers",
  pillar: "Compliance & Certification",
  cluster: "EU DMA Interoperability",
  lastVerified: "March 2026",
  color: "#00FF88",
  urgency: "critical",
  tldr: [
    "The EU Digital Markets Act (DMA) Article 7 requires designated 'gatekeepers' — Apple, Google, Meta, TikTok — to provide <strong>interoperability with third-party services</strong>, and game publishers on those platforms now need certified compliance proof to access this",
    "The enforcement deadline for Article 7 interoperability was <strong>March 2024</strong> — penalties of up to 10% of global annual revenue are now actively being applied",
    "For game studios, the practical impact is that publishing on gatekeeper platforms without documented compliance documentation creates <strong>contract risk and distribution liability</strong>",
    "HTML5STUDIO's WGL-CERT certification includes a dedicated DMA compliance module that produces the required documented proof",
  ],
  relatedSiblings: [
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard (WGL-CERT)", urgency: "critical" },
    { slug: "pii-privacy-compliance", title: "PII & Privacy Compliance for WebGL Games", urgency: "hot" },
    { slug: "gdpr-ccpa-compliance", title: "GDPR & CCPA Compliance for Game Studios", urgency: "hot" },
  ],
  relatedCrossPillar: [
    { slug: "meta-sdk-v8-migration", title: "Meta Instant Games SDK v8.0 Migration" },
    { slug: "platform-api-change-alerts", title: "Platform API Change Alerts" },
    { slug: "eu-dma-gatekeeper-rules", title: "EU DMA — Gatekeeper Rules for Indie Developers" },
  ],
  faqs: [
    {
      q: "Does the EU DMA apply to game studios, or only to the platforms themselves?",
      a: "The DMA primarily regulates the designated gatekeepers (Apple, Google, Meta, TikTok, Amazon, Microsoft, Booking.com). However, studios publishing on gatekeeper platforms have indirect obligations — they must demonstrate compliance with the interoperability requirements that their gatekeeper platform is now required to support. In practice, this means ensuring your game can function on alternative distribution channels and does not technically lock users to a single gatekeeper's ecosystem.",
    },
    {
      q: "What are the Article 7 interoperability requirements in plain terms?",
      a: "Article 7 requires gatekeepers to allow third-party messaging, communication, and interactive services to interoperate with the gatekeeper's platform. For game publishers, this specifically means: your game's social features (leaderboards, friend lists, chat) must be technically capable of working across platform boundaries, not only within one gatekeeper's walled garden.",
    },
    {
      q: "What is the maximum DMA penalty and has it been applied?",
      a: "The DMA allows penalties of <strong>up to 10% of global annual turnover</strong> for first violations and up to 20% for repeated violations. As of Q1 2026, the European Commission has opened formal proceedings against multiple designated gatekeepers. Penalties have been issued — the enforcement phase is active, not theoretical.",
    },
    {
      q: "How do I obtain 'certified compliance proof' as required by Article 7?",
      a: "Certified compliance proof requires documentation of: (1) technical interoperability capability for social and communication features, (2) absence of anti-competitive data practices (no illegal PII harvesting that creates lock-in), and (3) a published compliance statement. HTML5STUDIO's WGL-CERT certification includes all three as part of the DMA compliance module.",
    },
    {
      q: "Is the DMA relevant for a studio based outside the EU?",
      a: "Yes. The DMA applies to platforms operating in the EU, and therefore to any studio whose game is distributed to EU users through a designated gatekeeper. If your game is on the App Store, Google Play, Meta Instant Games, or TikTok and any meaningful portion of your players are in the EU, the DMA compliance chain applies to you.",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <div className="space-y-6 text-foreground/80 leading-relaxed">

      <h2 className="text-2xl font-bold text-foreground mt-10">What Is the EU Digital Markets Act and Which Platforms Does It Regulate?</h2>
      <p>
        The Digital Markets Act (DMA) is EU Regulation 2022/1925, which entered full enforcement in March 2024. It designates a set of <strong>"gatekeepers"</strong> — large platforms with significant market power — and imposes a specific set of obligations on how those platforms must operate in Europe.
      </p>
      <p>
        The designated gatekeepers as of 2026 are: <strong>Apple</strong> (App Store, iOS), <strong>Google</strong> (Search, Play Store, Maps, Chrome), <strong>Meta</strong> (Facebook, Instagram, WhatsApp, Meta Instant Games), <strong>Amazon</strong> (AWS, marketplace), <strong>Microsoft</strong> (LinkedIn, Teams, Windows), <strong>TikTok</strong> (ByteDance), and <strong>Booking.com</strong>.
      </p>
      <p>
        For game publishers, the relevant gatekeepers are Meta, TikTok, Apple, and Google — all of which are distribution channels or SDK providers for HTML5 and WebGL games.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-10">Article 7 Interoperability — The Specific Obligation That Affects Games</h2>
      <p>
        Article 7 of the DMA requires gatekeepers to provide <strong>technical interoperability</strong> for third-party communication and interactive services. In the context of gaming, this means that social and interactive features built on a gatekeeper's platform — friend lists, leaderboards, matchmaking, in-game chat — must be technically capable of interoperating with equivalent services on other platforms.
      </p>
      <p>
        The practical implication for studios: if your game's social features are implemented <em>exclusively</em> through a gatekeeper's proprietary API (e.g., you only use FBInstant's social graph with no alternative), your game is in technical violation of the DMA's anti-lock-in provisions. This is not a hypothetical risk — the European Commission has specifically flagged gaming social features as an area of active investigation.
      </p>

      <DataTable
        headers={["DMA Article", "Obligation", "Game Publisher Impact"]}
        rows={[
          ["Article 5", "No combining personal data across services without consent", "Cannot merge FBInstant user data with other Meta properties without explicit per-purpose consent"],
          ["Article 6", "Allow third-party app stores and sideloading", "Games must be technically distributable outside gatekeeper stores"],
          ["Article 7", "Interoperability for communication services", "Social features must not be exclusively locked to one gatekeeper's infrastructure"],
          ["Article 13", "Provide access to data generated by business users", "Studios can demand their own game analytics data from platforms in portable format"],
          ["Article 14", "Notify the Commission of concentrations", "Applies to studio acquisitions above certain revenue thresholds"],
        ]}
      />

      <IntelligenceNote>
        The European Commission's March 2025 interim report on DMA enforcement specifically mentioned <strong>embedded game social features as an under-investigated area</strong> where gatekeeper lock-in is occurring through technical design rather than explicit contractual terms. Legal advisors monitoring the DMA enforcement pipeline are indicating that formal investigations into Meta's Instant Games social graph and TikTok's Mini-Game leaderboard infrastructure are likely in 2026. Studios with a documented interoperability architecture — even a basic one — are significantly better positioned than those with no documentation at all.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold text-foreground mt-10">What 'Certified Compliance Proof' Means in Practice</h2>
      <p>
        The DMA does not prescribe a specific certification format for interoperability compliance. However, the European Commission's guidance documents indicate that compliance proof should include three components:
      </p>
      <ul className="list-none space-y-2 pl-4">
        {[
          "<strong>Technical documentation</strong> — evidence that the game's social/communication features are architecturally capable of interoperability (not hardcoded to one platform's API)",
          "<strong>Data practice statement</strong> — documented data flows showing no illegal cross-service PII combination without consent",
          "<strong>Published compliance assertion</strong> — a dated, signed statement that the build meets DMA Article 5–7 obligations, made available to the European Commission on request",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" dangerouslySetInnerHTML={{ __html: `<span style='margin-top:8px;flex-shrink:0;width:4px;height:4px;border-radius:50%;background:#00FF88'></span><span>${item}</span>` }} />
        ))}
      </ul>
      <p>
        HTML5STUDIO's WGL-CERT certification process produces all three of these components as part of the standard certification output. The DMA compliance module is included in all AA and AAA tier certifications.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-10">Enforcement Timeline and the Current Penalty Landscape</h2>
      <p>
        The DMA entered full enforcement on <strong>March 7, 2024</strong>. As of Q1 2026, the European Commission has:
      </p>
      <DataTable
        headers={["Action", "Gatekeeper", "Status"]}
        rows={[
          ["Formal investigation opened", "Apple (App Store)", "Active — March 2024"],
          ["Non-compliance finding", "Apple (browser choice)", "Penalty proceedings — 2025"],
          ["Formal investigation opened", "Meta (Facebook Marketplace)", "Active — 2024"],
          ["Preliminary findings issued", "TikTok (for-you-page)", "Under review — 2025"],
          ["Investigation opened", "Google (Search, Play)", "Active — ongoing"],
        ]}
      />
      <p>
        The key takeaway for studios: enforcement is not speculative. Gatekeepers are under active investigation, and the compliance burden they face cascades downstream to developers who build on their platforms. Studios who can demonstrate DMA-aware architecture are protected; those who cannot are exposed to the same compliance tail risk their gatekeeper platform carries.
      </p>
    </div>
  ),
};

export default function EUDMAArticle7() {
  return <ArticleLayout article={article} />;
}