import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Content Moderation & Age Ratings for WebGL Games: PEGI, ESRB & Platform Policies 2026",
  pillar: "Legal & Regulatory",
  cluster: "Content Moderation & Age Ratings",
  lastVerified: "March 2026",
  color: "#229ED9",
  urgency: "active",
  tldr: [
    "PEGI and ESRB ratings are not legally mandatory for WebGL games distributed via your own website — but are required by most platform partners (Poki, CrazyGames, Meta Instant Games).",
    "The IARC (International Age Rating Coalition) provides a single questionnaire that generates PEGI, ESRB, USK, ClassInd, and GSRR ratings simultaneously — it's free and takes 15 minutes.",
    "Platform content policies are more restrictive than rating systems — CrazyGames and Poki prohibit content rated above PEGI 16 regardless of age verification capabilities.",
    "AI-generated content will require new classification steps under PEGI's upcoming AI descriptor (expected Q3 2026) — plan ahead if your game uses procedural or LLM content.",
  ],
  relatedSiblings: [
    { slug: "gdpr-ccpa-compliance", title: "GDPR & CCPA Compliance", urgency: "hot" },
    { slug: "eu-dma-article7", title: "EU Digital Markets Act", urgency: "critical" },
    { slug: "ip-licensing-webgl", title: "IP & Licensing for WebGL Games", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "regulatory-bulletins", title: "Regulatory Bulletins", urgency: "hot" },
  ],
  faqs: [
    { q: "Do I need a PEGI rating for my WebGL game?", a: "Not legally, for own-website distribution. But if you're submitting to Poki, CrazyGames, Meta Instant Games, or Google Play Instant, they require an IARC or PEGI rating as part of the submission process. Getting one via IARC is free and quick — just do it." },
    { q: "What's the difference between PEGI and IARC?", a: "PEGI is a specific rating system (Europe). IARC is a meta-system where one questionnaire generates multiple regional ratings including PEGI, ESRB (US), USK (Germany), ClassInd (Brazil), and GSRR (Taiwan). For WebGL games with global audiences, IARC is the efficient choice." },
    { q: "What content gets a game rejected from Poki or CrazyGames?", a: "Both platforms prohibit: explicit violence (blood/gore), sexual content, gambling mechanics that simulate real money (without special approval), hate speech, copyright-infringing assets, and adult themes. Maximum content level is roughly PEGI 12 / ESRB E10+ for standard approval." },
    { q: "How does the upcoming PEGI AI descriptor affect my game?", a: "If your game generates content at runtime using AI (LLM dialogue, AI-generated art), the new PEGI AI descriptor will require additional disclosure during the rating questionnaire. PEGI is still determining exactly what additional scrutiny applies — monitor pegi.info for the consultation outcome expected Q2 2026." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Platform Content Requirements</h2>
      <DataTable
        headers={["Platform", "Max Rating", "Rating Required", "AI Content Policy", "Review Process"]}
        rows={[
          ["Poki", "PEGI 12 / E10+", "IARC or PEGI required", "Disclose AI usage", "Human review"],
          ["CrazyGames", "PEGI 16 / T (Teen)", "IARC preferred", "Flag for review", "Scored review"],
          ["Meta Instant Games", "PEGI 18 max (with age gate)", "IARC required", "Content policy review", "Automated + human"],
          ["YouTube Playables", "PEGI 12 equivalent", "Self-declaration", "Not yet defined", "Algorithm + human"],
          ["Telegram Mini Apps", "No formal rating system", "None required", "Terms of service", "Post-publication review"],
          ["GameDistribution", "PEGI 18 max", "IARC preferred", "Disclose in metadata", "Minimal review"],
        ]}
      />

      <IntelligenceNote>
        The IARC rating system takes 15–20 minutes via a questionnaire at globalratings.com and generates legally valid ratings for 37+ territories. There is no cost. This is one of the lowest-effort high-value compliance steps a studio can take — it removes the rating gap for all major platform submissions with a single afternoon of work.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">PEGI Content Descriptors Relevant to Games</h2>
      <DataTable
        headers={["Descriptor", "Definition", "Rating Impact", "Common in WebGL?"]}
        rows={[
          ["Violence", "Animated violence, fighting", "PEGI 7+ minimum", "Very common"],
          ["Fear", "Horror, scary imagery", "PEGI 7+ minimum", "Moderate"],
          ["Gambling", "Games simulating gambling", "PEGI 12+ minimum", "Rare (risky)"],
          ["In-game purchases", "Any IAP mechanism", "PEGI label required", "Common"],
          ["Language", "Mild profanity", "PEGI 12+ minimum", "Rare in casual"],
          ["AI Generated Content", "Runtime AI content (coming 2026)", "Additional disclosure", "Emerging"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Content Moderation for User-Generated Content</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        If your WebGL game includes any user-generated content (custom character names, chat, level sharing), you need a content moderation system. The minimum viable implementation:
      </p>
      <CodeBlock code={`// Minimum viable UGC moderation
const BANNED_PATTERNS = [
  /\\b(profanity-list)\\b/gi,  // your profanity list
  /[\\u0000-\\u001F]/g,        // control characters
];

const MAX_CONTENT_LENGTH = 100;

function moderateContent(content) {
  if (!content || typeof content !== 'string') return null;
  if (content.length > MAX_CONTENT_LENGTH) return null;

  let cleaned = content.trim();

  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(cleaned)) return null;  // reject entirely
  }

  return cleaned;  // approved
}

// For async AI moderation (recommended for chat)
async function moderateWithAI(content) {
  const response = await openai.moderations.create({ input: content });
  const result = response.results[0];
  if (result.flagged) {
    return { approved: false, categories: result.categories };
  }
  return { approved: true };
}`} />
    </>
  ),
};

export default function ContentModerationAgeRatings() {
  return <ArticleLayout article={article} />;
}
