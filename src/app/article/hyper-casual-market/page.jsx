"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "Hyper-Casual & CrazyGames Market: Economics, Trends & Developer Opportunities 2026",
  pillar: "Industry Trends",
  cluster: "Hyper-Casual & Crazy Games Market",
  lastVerified: "March 2026",
  color: "#9B59B6",
  urgency: "active",
  tldr: [
    "CrazyGames and Poki together serve 150M+ monthly active users — the largest addressable audience for WebGL games outside of Meta.",
    "The hyper-casual model is bifurcating: low-quality clones are being delisted while high-quality, original mechanics are receiving premium placement and revenue share.",
    "Average ARPDAU on Poki is $0.002–$0.008 for ad-only games; studios with direct SDK integrations (Poki SDK score submission) average 40% higher engagement and better placement.",
    "CrazyGames introduced a quality score system in 2025 — games below 7/10 are progressively deprioritised in discovery; above 8.5 receive homepage featuring.",
  ],
  relatedSiblings: [
    { slug: "web3-play-to-earn", title: "Web3 & Play-to-Earn", urgency: "active" },
    { slug: "ai-in-game-dev", title: "AI in Game Dev", urgency: "active" },
    { slug: "cloud-streaming-browser-tech", title: "Cloud Streaming & Browser Tech", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "ad-network-integrations", title: "Ad Network Integrations" },
    { slug: "game-valuations-ma", title: "Game Valuations & M&A" },
    { slug: "ua-growth-strategy", title: "UA & Growth Strategy" },
  ],
  faqs: [
    { q: "What's the minimum quality bar for Poki or CrazyGames approval?", a: "Both platforms have become significantly more selective since 2024. You need: original mechanics (not a clone), mobile-responsive design, load time under 10 seconds on 4G, no copyright-infringing assets, and a complete game with progression. Expect 4–8 weeks for review." },
    { q: "How does revenue share work on these platforms?", a: "Revenue share varies by studio size and game performance, but typical splits are 70% platform / 30% studio for new studios, improving to 50/50 for studios with proven titles. Ad revenue is based on CPM for the platform's ad inventory — you don't directly integrate ad networks." },
    { q: "Are .io games still viable?", a: "The .io game genre peaked in 2020–2022 and is now saturated. New .io games require a significant differentiator (unique mechanic, IP license, or social feature) to gain traction. Existing successful .io games continue to perform well — it's a question of new market entry." },
    { q: "What genres are growing in 2026?", a: "Puzzle games with daily challenges (Wordle-style), collaborative casual games, and games with AI-generated daily content are the three fastest-growing categories. Platform executives at GDC 2026 specifically called out 'retention mechanics over pure hypercasual' as the priority for publisher deals." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Platform Landscape 2026</h2>
      <DataTable
        headers={["Platform", "MAU", "Revenue Model", "Review Time", "Genre Focus"]}
        rows={[
          ["<strong>Poki</strong>", "90M+", "Ad rev share (no IAP)", "4–8 weeks", "Casual, arcade, puzzle"],
          ["<strong>CrazyGames</strong>", "60M+", "Ad rev share + premium placement", "2–4 weeks", "All genres, quality-scored"],
          ["<strong>GameDistribution</strong>", "300M+ (syndication)", "Ad rev share via syndication", "1–2 weeks", "All genres"],
          ["<strong>itch.io</strong>", "10M+", "Direct sales + optional donation", "None (self-publish)", "Indie, experimental"],
          ["<strong>Newgrounds</strong>", "5M+", "Ad rev share", "Content review", "Creative, adult"],
          ["<strong>Kongregate</strong>", "Declining", "Ad rev share", "2–4 weeks", "Strategy, RPG"],
        ]}
      />

      <IntelligenceNote>
        GameDistribution's syndication model is under-utilised by studios who focus exclusively on Poki/CrazyGames. GameDistribution distributes to 300M+ users across thousands of portal sites — a single integration provides 10x the reach of any single platform deal. The downside is lower CPM ($0.3–0.8 vs $1–3 on premium platforms), but the volume often compensates.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">CrazyGames Quality Score Breakdown</h2>
      <DataTable
        headers={["Factor", "Weight", "How to Improve"]}
        rows={[
          ["Session length (avg)", "25%", "Add daily challenges, progression, unlockables"],
          ["Day 1 retention", "25%", "Strong tutorial, clear value prop in first 60 seconds"],
          ["Technical quality (load, fps)", "20%", "Optimise bundle, target 60fps on mid-range mobile"],
          ["Originality / concept", "15%", "Novel mechanic or strong IP — avoid genre clones"],
          ["Visual quality", "10%", "Consistent art direction, no placeholder assets"],
          ["Content depth", "5%", "Multiple levels/modes, not a one-trick demo"],
        ]}
      />
    </>
  ),
};

export default function HyperCasualMarket() {
  return <ArticleLayout article={article} />;
}