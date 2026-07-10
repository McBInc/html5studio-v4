import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Regulatory Bulletins: EU DMA Updates, GDPR Enforcement & Age Rating Changes 2026",
  pillar: "Live Intelligence Feed",
  cluster: "Regulatory Bulletins",
  lastVerified: "March 2026",
  color: "#EE1D52",
  urgency: "hot",
  tldr: [
    "The EU DMA's first formal enforcement actions against Apple and Meta were issued in March 2026 — game publishers on these platforms face indirect compliance obligations.",
    "GDPR enforcement in gaming accelerated in Q4 2025: three mid-size game studios received those fines for non-consensual analytics collection in WebGL titles.",
    "PEGI and ESRB are introducing AI-generated content flags in 2026 — games using procedural or LLM-generated content will require additional rating classification.",
    "The UK's Online Safety Act age verification requirements take effect June 2026 — platforms distributing games to UK users must implement verified age gating for 18+ content.",
  ],
  relatedSiblings: [
    { slug: "platform-api-change-alerts", title: "Platform API Change Alerts", urgency: "critical" },
    { slug: "build-error-pattern-tracking", title: "Build Error Pattern Tracking", urgency: "hot" },
  ],
  relatedCrossPillar: [
    { slug: "eu-dma-article7", title: "EU DMA Article 7 Compliance", urgency: "critical" },
    { slug: "gdpr-ccpa-compliance", title: "GDPR & CCPA Compliance" },
    { slug: "content-moderation-age-ratings", title: "Content Moderation & Age Ratings" },
  ],
  faqs: [
    { q: "How does the DMA enforcement affect WebGL game studios?", a: "Directly: studios on Meta Instant Games, Apple Web Platform, and Google Play Instant must ensure their games don't block interoperability features required under DMA. Indirectly: the DMA is forcing platforms to open APIs, which may create new distribution opportunities for studios." },
    { q: "Which studios were fined for GDPR violations in gaming?", a: "Enforcement bodies don't always name studios in bulletins, but publicly known cases involve studios operating casual WebGL games with Google Analytics and Meta Pixel enabled without valid consent mechanisms. Fines ranged from €15K to €120K." },
    { q: "When do the new PEGI AI content flags take effect?", a: "PEGI's AI content descriptor is currently in consultation (as of March 2026). Implementation is expected Q3 2026. Studios using AI-generated characters, dialogue, or art should monitor PEGI's developer portal for the classification requirements." },
    { q: "How do I comply with the UK Online Safety Act for games?", a: "For 18+ games distributed to UK users: implement an age verification mechanism approved by Ofcom (third-party ID verification, credit card verification, or digital identity wallet). Self-declaration (users typing their birth year) does not meet the standard." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Active Regulatory Timeline — 2026</h2>
      <DataTable
        headers={["Date", "Regulation", "Jurisdiction", "Impact on Games", "Action Required"]}
        rows={[
          ["March 2026", "DMA first enforcement actions", "EU", "Meta & Apple compliance mandates", "Review platform integration obligations"],
          ["June 2026", "UK Online Safety Act age verification", "UK", "18+ content must have verified age gates", "Implement Ofcom-approved age verification"],
          ["Q3 2026", "PEGI AI Content Descriptor", "EU/UK", "AI-generated content requires new classification", "Audit AI usage in game content"],
          ["Ongoing", "GDPR enforcement in gaming sector", "EU", "Analytics without consent = fine risk", "Run consent audit immediately"],
          ["Sept 2026", "Meta SDK v8.0 sunset", "Global (Meta)", "Legacy builds rejected", "Complete SDK migration"],
          ["Dec 2026", "California Age-Appropriate Design Code", "California/US", "Games accessed by minors need design review", "Conduct AADC impact assessment"],
        ]}
      />

      <IntelligenceNote>
        The EU DMA is creating an unusual secondary effect for game studios: as gatekeepers are forced to open their platforms to third-party distribution, studios that have invested in cross-platform WebGL builds are seeing new inbound partnership opportunities from alternative storefronts seeking compliant, certified content.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">GDPR Enforcement Pattern in Gaming (2025–2026)</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Enforcement actions against gaming companies have followed a consistent pattern: regulators start with the analytics layer, specifically looking for Google Analytics, Meta Pixel, and Unity Analytics deployed without valid consent. The investigation trigger is typically a complaint from a user or a pro-privacy NGO like noyb or the Irish Council for Civil Liberties.
      </p>
      <p className="text-foreground/75 leading-relaxed mb-4">
        The defence of "we didn't know the SDK collected data" is consistently rejected. Courts have held that deploying a third-party SDK constitutes accepting responsibility for its data practices.
      </p>
    </>
  ),
};

export default function RegulatoryBulletins() {
  return <ArticleLayout article={article} />;
}
