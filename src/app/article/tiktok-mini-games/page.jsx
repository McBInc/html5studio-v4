"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "TikTok Mini-Games: SDK Integration, Touch Issues & 2026 Requirements",
  pillar: "Platform Ecosystems",
  cluster: "TikTok Mini-Games",
  lastVerified: "March 2026",
  color: "#FF6B00",
  urgency: "hot",
  tldr: [
    "TikTok's swipe-to-exit gesture conflicts with in-game vertical swipes — the fix is a single CSS property: <code>touch-action: none</code> on the game canvas.",
    "The TikTok Mini-Game SDK requires explicit <code>tt.ready()</code> initialisation before any API call — race conditions cause silent failures on low-end Android.",
    "Bundle size limit is 20MB compressed. Exceeding this causes a rejection at the TikTok Developer Console review stage.",
    "All analytics, payment, and social calls must go through the TikTok SDK bridge — direct fetch() calls to external APIs are blocked by the platform CSP.",
  ],
  relatedSiblings: [
    { slug: "meta-sdk-v8-migration", title: "Meta Instant Games SDK v8.0", urgency: "critical" },
    { slug: "discord-activities-api-split", title: "Discord Activities API Split", urgency: "critical" },
    { slug: "telegram-mini-apps", title: "Telegram Mini Apps SDK 7.0", urgency: "hot" },
  ],
  relatedCrossPillar: [
    { slug: "api-deprecation-tracker", title: "API Deprecation Tracker 2026" },
    { slug: "platform-api-change-alerts", title: "Platform API Change Alerts" },
  ],
  faqs: [
    { q: "Why does swiping up close my game instead of scrolling?", a: "TikTok's native swipe-up-for-next-video gesture captures touch events before your game canvas. Fix: add <code>touch-action: none</code> to your canvas CSS and call <code>tt.disableSwipe()</code> from the SDK in your init function." },
    { q: "My game works on mobile browser but fails in TikTok — why?", a: "TikTok Mini-Games run in an isolated WebView with a strict CSP that blocks external network requests. Any fetch to a non-whitelisted domain will silently return nothing. All external comms must go through the TikTok SDK bridge APIs." },
    { q: "Is there a TikTok Unity SDK?", a: "Yes — TikTok provides a Unity plugin via the Developer Console. It wraps the JS bridge and exposes C# methods for auth, payments, and social features. The plugin requires Unity 2021.3 LTS or later." },
    { q: "How long does TikTok review take?", a: "Typically 5–14 business days for initial submission. Updates are reviewed faster (2–5 days). Critical bug patches can be expedited through the developer support channel." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">The Swipe-to-Exit Bug: Root Cause & Fix</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        TikTok's container intercepts vertical touch events at the WebView level to support its signature swipe-up-for-next-video UX. Any game using upward swipe gestures (menus, card tosses, vertical scrollers) is affected.
      </p>
      <CodeBlock code={`/* CSS fix — apply to your game canvas element */
canvas#unity-canvas {
  touch-action: none;  /* Prevents all default touch behaviours */
}

/* If using a container div wrapper */
#game-container {
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}`} />
      <CodeBlock code={`// JavaScript: call in your init sequence BEFORE tt.ready()
tt.disableSwipe({ direction: 'vertical' });

// Full init sequence
tt.onShow(() => {
  tt.disableSwipe({ direction: 'all' });
  tt.ready();
});`} />

      <IntelligenceNote>
        As of Q4 2025, TikTok changed the timing of its gesture capture — <code>tt.disableSwipe()</code> called after <code>tt.ready()</code> now occasionally fails on low-end Android devices due to a race in the WebView initialisation. Always call <code>disableSwipe</code> before <code>ready()</code>.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">SDK Initialisation Pattern</h2>
      <CodeBlock code={`// Correct TikTok Mini-Game SDK initialisation order
(function initTikTok() {
  // 1. Disable gestures FIRST
  if (tt && tt.disableSwipe) {
    tt.disableSwipe({ direction: 'all' });
  }

  // 2. Set up event listeners
  tt.onShow(function() {
    console.log('TikTok container visible');
    resumeGame();
  });

  tt.onHide(function() {
    pauseGame();
  });

  // 3. Signal readiness LAST
  tt.ready();
})();`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Platform Requirements 2026</h2>
      <DataTable
        headers={["Requirement", "Limit / Rule", "Consequence of Breach"]}
        rows={[
          ["Bundle size", "20MB compressed max", "Rejected at Developer Console"],
          ["External API calls", "Blocked by CSP", "Silent failure — no error thrown"],
          ["touch-action", "Must be set on canvas", "Swipe-to-exit captures game input"],
          ["SDK bridge for payments", "Required for all IAP", "Payment flow bypassed, no revenue"],
          ["Age rating metadata", "Required in submission", "Review rejection"],
          ["Unity version", "2021.3 LTS minimum for official plugin", "Plugin won't compile"],
        ]}
      />
    </>
  ),
};

export default function TikTokMiniGames() {
  return <ArticleLayout article={article} />;
}