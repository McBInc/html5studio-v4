"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "UA & Growth Strategy for WebGL Games: Viral Loops, CPI & Social Sharing in 2026",
  pillar: "Monetization & Business",
  cluster: "UA & Growth Strategy",
  lastVerified: "March 2026",
  color: "#F1C40F",
  urgency: "active",
  tldr: [
    "Organic distribution via platform stores (Poki, CrazyGames, GameDistribution) remains the highest-ROI user acquisition channel for WebGL games — zero CPI, high-intent audience.",
    "Viral loops in browser games work differently to mobile: URL sharing, score sharing on Twitter/X, and Telegram forward mechanics are the primary vectors.",
    "Paid UA for WebGL games has poor ROI unless you have IAP monetisation — ad-only games cannot support CPI above $0.10, which limits paid channels to Meta broad targeting and TikTok Spark Ads.",
    "SEO is a uniquely powerful channel for WebGL games — games embedded on your own domain can rank for high-intent queries like 'online puzzle game' and generate traffic for years.",
  ],
  relatedSiblings: [
    { slug: "ad-network-integrations", title: "Ad Network Integrations", urgency: "active" },
    { slug: "iap-stars-ton-payments", title: "IAP & Stars / TON Payments", urgency: "hot" },
    { slug: "game-valuations-ma", title: "Game Valuations & M&A", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "hyper-casual-market", title: "Hyper-Casual & CrazyGames Market" },
  ],
  faqs: [
    { q: "What's the most cost-effective way to grow a WebGL game's player base?", a: "Platform submission (Poki, CrazyGames, GameDistribution, itch.io) is free and reaches users who are actively looking for games. Combined with SEO on your own domain, this organic strategy outperforms paid UA for games without IAP monetisation." },
    { q: "What kind of viral mechanics work in browser games?", a: "Score sharing (generate a shareable image with the player's score), challenge links (URL that loads a specific game state), and Telegram group sharing (forward to a group to unlock a bonus) are the most effective. Simple copy-URL sharing works surprisingly well when the URL is short and descriptive." },
    { q: "Should I use TikTok for game promotion?", a: "TikTok organic content (gameplay clips, developer devlogs) can be highly effective if the game has visual appeal. Paid TikTok Spark Ads require ~$0.05–0.15 CPI to be viable, which works for Telegram mini games (where Stars revenue can offset). Doesn't work for ad-only games." },
    { q: "How important is SEO for a WebGL game?", a: "Very important if you host on your own domain. Games ranking on page 1 for queries like 'free online [genre] game' or '[game name] online' generate 5,000–50,000+ monthly organic players at zero cost. This is the compounding advantage of own-domain hosting over platform-only distribution." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">UA Channel ROI for WebGL Games</h2>
      <DataTable
        headers={["Channel", "CPI Range", "Viability (Ad-only)", "Viability (IAP)", "Effort"]}
        rows={[
          ["Platform submission (Poki/CG)", "$0 (free)", "✓ Excellent", "✓ Excellent", "Low (one-time)"],
          ["GameDistribution syndication", "$0 (rev share)", "✓ Good", "✓ Good", "Low (one-time)"],
          ["SEO (own domain)", "$0 (ongoing work)", "✓ Excellent long-term", "✓ Excellent", "Medium (ongoing)"],
          ["TikTok organic content", "$0 (time only)", "✓ If game is visual", "✓ If game is visual", "High (ongoing)"],
          ["Twitter/X score sharing", "$0", "✓ Good for competitive games", "✓", "Low (implementation)"],
          ["Meta paid ads", "$0.05–0.50", "✗ Too expensive for ad-only", "⚠ Marginal", "Medium"],
          ["Google UAC", "$0.10–1.00", "✗", "⚠ Only with strong LTV", "Medium"],
        ]}
      />

      <IntelligenceNote>
        Telegram viral loops have emerged as the most effective paid-zero growth mechanism for browser games in 2026. A simple mechanic — "invite 3 friends to unlock premium content" — leverages Telegram's frictionless group sharing. Studios reporting 40–60% of new users arriving via Telegram forward share, with day-1 retention 2x higher than platform-acquired users because they arrive with social context.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Implementing Score Sharing</h2>
      <CodeBlock code={`// Score share card generator
async function generateShareCard(score, playerName, gameName) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0A0D1A';
  ctx.fillRect(0, 0, 1200, 630);

  // Score
  ctx.font = 'bold 120px Inter';
  ctx.fillStyle = '#1e6ff0';
  ctx.textAlign = 'center';
  ctx.fillText(score.toString(), 600, 320);

  // Labels
  ctx.font = '36px Inter';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(\`\${playerName} scored \${score} in \${gameName}\`, 600, 420);
  ctx.fillText('Can you beat it? → your-game.com', 600, 490);

  // Convert to blob and create share URL
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, 'image/png');
  });
}

// Native share API (mobile) with fallback
async function shareScore(score) {
  const imageUrl = await generateShareCard(score, playerName, 'My Game');

  if (navigator.share) {
    await navigator.share({
      title: \`I scored \${score}!\`,
      text: \`Can you beat my score of \${score}?\`,
      url: window.location.href,
    });
  } else {
    // Fallback: open Twitter intent
    window.open(\`https://twitter.com/intent/tweet?text=I+scored+\${score}+in+MyGame!+Can+you+beat+it?+\${window.location.href}\`);
  }
}`} />
    </>
  ),
};

export default function UAGrowthStrategy() {
  return <ArticleLayout article={article} />;
}