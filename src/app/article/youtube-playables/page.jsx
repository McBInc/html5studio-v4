"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "YouTube Playables: 15MB Bundle Limit, Path Fixes & Submission Guide",
  pillar: "Platform Ecosystems",
  cluster: "YouTube Playables",
  lastVerified: "March 2026",
  color: "#FF6B00",
  urgency: "active",
  tldr: [
    "YouTube Playables enforces a strict 15MB compressed bundle limit — builds over this are blocked at ingestion with no error message to the player.",
    "All asset paths must be relative — absolute paths (<code>https://</code> or <code>/</code> prefixed) cause silent 404s inside the YouTube iframe sandbox.",
    "No external network requests are permitted — all game assets must be bundled. External CDN calls are blocked by the platform's CSP.",
    "Playables run in a sandboxed iframe with <code>allow-scripts allow-same-origin</code> — localStorage and cookies are not available; use the YouTube Playables SDK for state persistence.",
  ],
  relatedSiblings: [
    { slug: "tiktok-mini-games", title: "TikTok Mini-Games", urgency: "hot" },
    { slug: "telegram-mini-apps", title: "Telegram Mini Apps SDK 7.0", urgency: "hot" },
  ],
  relatedCrossPillar: [
    { slug: "unity-webgl-build-troubleshooting", title: "Build Troubleshooting & Fixes" },
    { slug: "api-deprecation-tracker", title: "API Deprecation Tracker 2026" },
  ],
  faqs: [
    { q: "How do I check if my build is under 15MB?", a: "Compress your entire build directory as gzip or brotli and check the output size. In Unity: Build Settings → Player Settings → Publishing Settings, check the compressed build size in the build report. Target 12MB to leave headroom." },
    { q: "What happens if my build exceeds 15MB?", a: "The build is rejected silently at the YouTube ingestion stage — the Playable simply won't appear to users. There's no error message displayed. You'll see a failed status in YouTube Studio's Playables dashboard." },
    { q: "Can I use Unity for YouTube Playables?", a: "Yes. Build to WebGL, ensure compression is set appropriately, convert all absolute paths to relative in your index.html template, and strip all external fetch/XMLHttpRequest calls. YouTube provides a Playables SDK for score submission and session tracking." },
    { q: "Is localStorage available?", a: "No — the sandboxed iframe blocks localStorage and sessionStorage. Use the YouTube Playables SDK's <code>yt.saveData()</code> and <code>yt.loadData()</code> for state persistence." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">The 15MB Limit: What Counts</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        The 15MB limit applies to the total compressed size of all files in your build — including WASM, JavaScript loader, data file, and all media assets. YouTube measures the brotli-compressed size of the entire bundle.
      </p>
      <DataTable
        headers={["Asset Type", "Typical Size", "Optimisation"]}
        rows={[
          ["WASM binary", "5–12MB", "Enable IL2CPP, strip unused code, set Exception Support to None"],
          ["Game data (.data)", "2–8MB", "Compress textures (ASTC/ETC2), use audio compression"],
          ["JavaScript loader", "100–300KB", "Minify, use Brotli"],
          ["External assets (CDN)", "Blocked", "Must be bundled or excluded"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Fixing Absolute Paths in Unity Builds</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Unity's default <code>index.html</code> template uses absolute paths for the Build folder. You must patch these to relative paths:
      </p>
      <CodeBlock code={`<!-- WRONG — absolute path (blocked in YouTube sandbox) -->
<script src="/Build/game.loader.js"></script>
<link rel="stylesheet" href="https://mysite.com/style.css">

<!-- CORRECT — relative paths -->
<script src="Build/game.loader.js"></script>

<!-- In UnityLoader config: -->
var config = {
  dataUrl: "Build/game.data",       // relative, no leading slash
  frameworkUrl: "Build/game.framework.js",
  codeUrl: "Build/game.wasm",
  streamingAssetsUrl: "StreamingAssets",  // relative
};`} />

      <IntelligenceNote>
        YouTube Playables runs your <code>index.html</code> from a non-predictable base URL within their CDN. Any hardcoded domain or absolute path will 404 silently. Run HTML5STUDIO's path scanner as part of your pre-submission checklist — it detects all absolute references in under 10 seconds.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">YouTube Playables SDK: Score & State</h2>
      <CodeBlock code={`// Include the YouTube Playables SDK
<script src="https://www.youtube.com/playables/playables.js"></script>

// Initialise
yt.playables.ready().then(() => {
  console.log('YouTube Playables SDK ready');

  // Load saved state
  yt.playables.loadData().then((data) => {
    if (data) {
      restoreGameState(JSON.parse(data));
    }
  });
});

// Submit score (called at game over)
function submitScore(score) {
  yt.playables.saveScore(score);
  yt.playables.saveData(JSON.stringify(getGameState()));
}`} />
    </>
  ),
};

export default function YouTubePlayables() {
  return <ArticleLayout article={article} />;
}