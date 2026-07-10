"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "Godot & Alternative Engines for WebGL: Godot 4, Cocos Creator, Construct 3 & Phaser",
  pillar: "Dev Tools & Engines",
  cluster: "Godot & Alternative Engines",
  lastVerified: "March 2026",
  color: "#5865F2",
  urgency: "active",
  tldr: [
    "Godot 4's Web export produces significantly smaller bundles than Unity WebGL — a simple 2D game exports to ~8–15MB vs Unity's 30–50MB baseline.",
    "Cocos Creator is the dominant engine for Chinese web game distribution (Toutiao, WeChat Mini Games) and has the best TikTok and WeChat SDK integration.",
    "Construct 3 and GDevelop require no programming knowledge and export clean WebGL builds — ideal for rapid prototyping and hyper-casual games.",
    "Phaser 3 remains the gold standard for JavaScript-native 2D WebGL games — direct DOM control, minimal overhead, and the widest platform compatibility.",
  ],
  relatedSiblings: [
    { slug: "unity-webgl-build-system", title: "Unity WebGL Build System", urgency: "hot" },
    { slug: "sdk-integration-guides", title: "SDK Integration Guides", urgency: "hot" },
    { slug: "performance-profiling", title: "Performance Profiling", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "unity-webgl-build-troubleshooting", title: "Build Troubleshooting & Fixes", urgency: "critical" },
    { slug: "tiktok-mini-games", title: "TikTok Mini-Games", urgency: "hot" },
  ],
  faqs: [
    { q: "Is Godot a viable alternative to Unity for WebGL games?", a: "Yes, particularly for 2D games and studios that want to avoid Unity's licensing costs. Godot 4's web export is fast, produces small bundles, and has no revenue-based licensing. The main limitation is weaker third-party SDK support compared to Unity — you may need custom JavaScript bridge plugins." },
    { q: "What's Cocos Creator best for?", a: "Chinese market distribution (Toutiao, Douyin, WeChat Mini Games) where Cocos has official platform SDK integrations. Also strong for 2D casual games targeting CrazyGames/Poki where bundle size and load time are critical." },
    { q: "Can Construct 3 games be submitted to Poki or CrazyGames?", a: "Yes — Construct 3's HTML5 export is a clean WebGL build compatible with all major platforms. Poki and CrazyGames accept Construct 3 games. The SDK integrations (Poki SDK, CrazyGames SDK) require adding JavaScript snippets to the event sheet." },
    { q: "Is Phaser 3 still relevant in 2026?", a: "Yes — for JavaScript-native development. Phaser is used by studios who want full control over the runtime without a game engine's overhead. It's also the most compatible with progressive web app architectures. The Phaser Discord is very active and the community is large." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Engine Comparison for WebGL Distribution</h2>
      <DataTable
        headers={["Engine", "Language", "Bundle Size (2D game)", "Platform SDK Support", "Best For"]}
        rows={[
          ["Unity (WebGL)", "C#", "30–80MB", "Excellent (official plugins)", "Complex 3D/2D, established studios"],
          ["Godot 4 (Web)", "GDScript / C#", "8–20MB", "Manual JS bridge needed", "Indie, small teams, 2D games"],
          ["Cocos Creator", "TypeScript/JS", "5–15MB", "Excellent (Cocos/Tencent partners)", "Chinese market, casual 2D"],
          ["Construct 3", "Event Sheets (no-code)", "3–10MB", "Good (JS snippets)", "No-code, rapid prototyping"],
          ["GDevelop", "Event Sheets (no-code)", "5–15MB", "Moderate", "Beginners, hyper-casual"],
          ["Phaser 3", "JavaScript/TypeScript", "1–5MB", "Excellent (direct JS)", "JS developers, performance-critical"],
        ]}
      />

      <IntelligenceNote>
        Godot's MIT licence has made it increasingly popular since Unity's controversial licensing announcement in September 2023. The Godot community grew by ~200% in 2024, and several studios that previously built on Unity have shipped successful WebGL games using Godot 4. The main barrier remains the smaller ecosystem of third-party tools and assets compared to Unity's Asset Store.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Godot 4 Web Export Configuration</h2>
      <CodeBlock code={`# Godot 4: Recommended Web Export Settings
# Project → Export → Add Web Preset

[preset.0]
name="Web"
platform="Web"
runnable=true
custom_features=""
export_filter="all_resources"
include_filter="*.png, *.ogg, *.wav"
exclude_filter=""
export_path="export/index.html"

[preset.0.options]
custom_template/debug=""
custom_template/release=""
variant/export_type=0         # 0=regular, 2=threads (requires COOP/COEP)
vram_texture_compression/for_desktop=true
vram_texture_compression/for_mobile=false
html/export_icon=true
html/custom_html_shell=""     # custom template path
html/head_include=""
script/export_mode=0
progressive_web_app/enabled=false`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Phaser 3: Minimal WebGL Game Setup</h2>
      <CodeBlock code={`import Phaser from 'phaser';

const config = {
  type: Phaser.WEBGL,  // Use WebGL renderer (fallback to Canvas automatically)
  width: 800,
  height: 600,
  backgroundColor: '#0A0D1A',
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.audio('bgm', 'assets/bgm.mp3');
}

function create() {
  this.player = this.physics.add.sprite(400, 300, 'player');
  this.sound.add('bgm', { loop: true, volume: 0.3 }).play();
}

function update() {
  // Game loop
}`} />
    </>
  ),
};

export default function GodotAlternativeEngines() {
  return <ArticleLayout article={article} />;
}