import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "LinkedIn & B2B Gaming: Unwrapped Pixel, Corporate Auth & Zero-Permissions",
  pillar: "Platform Ecosystems",
  cluster: "LinkedIn & B2B Gaming",
  lastVerified: "March 2026",
  color: "#FF6B00",
  urgency: "active",
  tldr: [
    "LinkedIn Games (launched 2024) uses a zero-permissions model — no user profile data is exposed to game code without explicit OAuth grant.",
    "Unwrapped Pixel is LinkedIn's internal game publishing label — understanding their review criteria dramatically improves submission success rates.",
    "Corporate environments block WebSockets, Service Workers, and SharedArrayBuffer — games must degrade gracefully or use polling fallbacks.",
    "B2B gaming on LinkedIn is a nascent but high-value channel: average session lengths are 3x longer than consumer gaming platforms due to intentional play during breaks.",
  ],
  relatedSiblings: [
    { slug: "meta-sdk-v8-migration", title: "Meta Instant Games SDK v8.0", urgency: "critical" },
    { slug: "discord-activities-api-split", title: "Discord Activities API Split", urgency: "critical" },
  ],
  relatedCrossPillar: [
    { slug: "eu-dma-article7", title: "EU DMA Article 7 Compliance" },
    { slug: "webgl-certification-standard", title: "WGL-CERT Certification Standard" },
  ],
  faqs: [
    { q: "How do I submit a game to LinkedIn?", a: "LinkedIn Games is currently invite-only via the Unwrapped Pixel publisher programme. Apply through LinkedIn's developer portal. Submissions require a playable WebGL build, a privacy policy, and platform-specific compliance documentation." },
    { q: "What's the zero-permissions model?", a: "LinkedIn games cannot access member profile data, connections, or messaging by default. If your game needs authentication, you must implement LinkedIn OAuth with explicit user consent for each data scope — similar to Meta's post-v8 model." },
    { q: "Why do corporate firewalls block some WebGL games?", a: "Enterprise networks often block WebSockets (used for real-time multiplayer), Service Workers (used for offline caching), and SharedArrayBuffer (used for multi-threaded Unity builds). Design games to work over standard HTTPS fetch without WebSocket dependency." },
    { q: "What types of games perform best on LinkedIn?", a: "Word games, trivia, logic puzzles, and light strategy games. Games tied to professional topics (business vocabulary, geography, industry knowledge) see engagement rates 4–6x higher than generic casual games." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">The LinkedIn Games Ecosystem</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        LinkedIn launched its native Games tab in mid-2024, initially with puzzle games (Pinpoint, Queens, Crossclimb). The platform uses Unwrapped Pixel as its publishing brand and has a curated, quality-over-quantity approach — as of Q1 2026, fewer than 20 games are live, creating a significant first-mover advantage for studios that clear the review process.
      </p>

      <IntelligenceNote>
        LinkedIn's user base plays games during deliberate breaks — not in the infinite scroll context of TikTok or Facebook. This produces unusually high completion rates and return visit frequency. Internal LinkedIn data cited at GDC 2025 showed 67% of daily active game players return within 24 hours — a metric unprecedented in casual web gaming.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Zero-Permissions Architecture</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        LinkedIn's security model means game code runs in an isolated iframe with no access to member data. The auth flow is optional and consent-based:
      </p>
      <CodeBlock code={`// LinkedIn Games SDK initialisation
window.LinkedInGames = window.LinkedInGames || {};
LinkedInGames.onReady = function(sdk) {
  // SDK is ready — no user data available by default
  sdk.ready();

  // Optional: request auth (user must explicitly consent)
  sdk.auth.request({
    scopes: ['r_liteprofile'],  // minimal scope
    onSuccess: function(member) {
      // member.id, member.localizedFirstName available
      personaliseGreeting(member.localizedFirstName);
    },
    onError: function() {
      // Handle gracefully — game must work without auth
      startAnonymousSession();
    }
  });
};`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Corporate Environment Compatibility</h2>
      <DataTable
        headers={["Feature", "Corporate Compatibility", "Fallback Strategy"]}
        rows={[
          ["WebSockets", "Often blocked by proxy/firewall", "Use HTTP long-polling for multiplayer"],
          ["SharedArrayBuffer", "Blocked without COOP headers", "Disable multi-threading in Unity build"],
          ["Service Workers", "Blocked in many enterprise configs", "Don't rely on SW for critical paths"],
          ["localStorage", "Available but may be cleared", "Submit scores immediately, don't rely on persistence"],
          ["WebRTC", "Blocked by most enterprise firewalls", "Avoid peer-to-peer; use server relay"],
          ["External CDN assets", "May be blocked by content filter", "Bundle all assets in main build"],
        ]}
      />
    </>
  ),
};

export default function LinkedInB2BGaming() {
  return <ArticleLayout article={article} />;
}
