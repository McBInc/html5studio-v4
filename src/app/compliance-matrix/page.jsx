"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

import { ArrowLeft, CheckCircle2, Clock, Shield, Zap, Radio, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from '@/components/landing/Navbar';
import NewsTicker from '@/components/landing/NewsTicker';
import Footer from '@/components/landing/Footer';

const ENGINES = [
  { id: "unity", label: "Unity", version: "2021–2023 LTS / Unity 6" },
  { id: "godot", label: "Godot", version: "Godot 4.x" },
  { id: "unreal", label: "Unreal Engine", version: "UE 5.x — Pixel Streaming" },
];

const ENGINE_NOTES = {
  unity: null,
  godot: null,
  unreal: {
    title: "Unreal uses Pixel Streaming — not WebGL/WASM",
    body: "Unlike Unity and Godot, Unreal Engine does not compile to WebAssembly. Your game runs on a server and streams rendered frames to the browser as a video feed. This means: (1) platform SDK calls must be handled server-side or via JavaScript message-passing, (2) bundle size limits don't apply, (3) mobile performance depends on streaming latency not device GPU, and (4) most casual game platforms (Poki, CrazyGames, GameDistribution) do not support Pixel Streaming builds — only Meta, Discord, and Telegram have viable integration paths.",
    color: "#FF6B00",
  },
};

const PLATFORMS = [
  { id: "meta", label: "Meta Instant Games", color: "#0082FB", icon: "🟦" },
  { id: "discord", label: "Discord Activities", color: "#5865F2", icon: "🟣" },
  { id: "tiktok", label: "TikTok Mini Games", color: "#EE1D52", icon: "⬛" },
  { id: "telegram", label: "Telegram Mini Apps", color: "#2AABEE", icon: "🔵" },
  { id: "youtube", label: "YouTube Playables", color: "#FF0000", icon: "🔴" },
  { id: "poki", label: "Poki", color: "#FF6B00", icon: "🟠" },
  { id: "crazygames", label: "CrazyGames", color: "#00C853", icon: "🟢" },
  { id: "gamedistribution", label: "GameDistribution", color: "#9B59B6", icon: "🟤" },
];

// What WE do — framed as our service, not DIY instructions
const TASKS = {
  // ENGINE-SPECIFIC TASKS
  unity: {
    meta: [
      { id: "u-meta-1", category: "SDK Upgrade", effort: "critical", title: "Upgrade FBInstant SDK to v8.0", detail: "We audit your Unity Plugins/WebGL folder, replace any pinned fbinstant.jslib files, and update the CDN script tag in your index.html to the v8.0 endpoint — eliminating the Sept 30, 2026 sunset risk." },
      { id: "u-meta-2", category: "Permissions", effort: "critical", title: "Inject zero-permissions wrapper", detail: "We wrap every FBInstant.player.* and FBInstant.context.* call with the required requestPermissionsAsync gate — your game will load correctly for first-time users with zero pre-granted permissions." },
      { id: "u-meta-3", category: "Build", effort: "high", title: "Strip Development Build metadata", detail: "We verify your final build has Development Build disabled and remove any profiler endpoint exposure that triggers Meta's ingestion rejection." },
      { id: "u-meta-4", category: "Memory", effort: "high", title: "Set mobile-safe MemorySize", detail: "We profile your peak WASM heap usage and set MemorySize to peak + 20% headroom — preventing the OOM crashes that affect mid-range Android devices on Meta Quest Browser." },
    ],
    discord: [
      { id: "u-disc-1", category: "OAuth2", effort: "critical", title: "Migrate to granular Discord OAuth2 scopes", detail: "We update your Discord developer portal OAuth2 configuration and your SDK authorize() call to use the new granular scope model — fixing the silent 401 failures that only affect new users." },
      { id: "u-disc-2", category: "SDK", effort: "critical", title: "Validate Activities SDK v2.0 scope declarations", detail: "We decode your issued access tokens and verify every scope your Activity uses is explicitly declared — catching the silent scope-drop issue Discord's portal won't warn you about." },
      { id: "u-disc-3", category: "Testing", effort: "high", title: "Simulate zero-permission cold start", detail: "We run your Activity through a fresh Discord account with all tokens revoked, capturing every 401 and missing-data failure before they reach your users." },
    ],
    tiktok: [
      { id: "u-tik-1", category: "CSS", effort: "critical", title: "Inject touch-action: none on Unity canvas", detail: "We add touch-action: none to your Unity canvas element in the WebGL template — preventing TikTok's swipe gestures from hijacking your game's touch input." },
      { id: "u-tik-2", category: "SDK Init", effort: "critical", title: "Fix SDK initialisation order (disableSwipe before ready)", detail: "We reorder your TikTok SDK calls to call disableSwipe() before ready() — the most common cause of TikTok Mini Game submission failures." },
      { id: "u-tik-3", category: "CSP", effort: "high", title: "Audit window.location redirects for CSP violations", detail: "We scan your compiled build for any window.location.href redirects that TikTok's 2025 CSP enforcement will silently block." },
    ],
    telegram: [
      { id: "u-tel-1", category: "SDK", effort: "critical", title: "Upgrade to Telegram WebApp SDK 7.0", detail: "We update your Telegram SDK integration to v7.0, replacing any deprecated initDataUnsafe calls with the validated pattern required for payment flows." },
      { id: "u-tel-2", category: "Timing", effort: "critical", title: "Add 500ms ready() timeout guard", detail: "We wrap your Telegram.WebApp.ready() call with a 500ms timeout guard — fixing the silent hang on slow devices that causes games to freeze before the first frame." },
      { id: "u-tel-3", category: "Payments", effort: "high", title: "Migrate to openInvoice() payment method", detail: "We replace any deprecated payment patterns with openInvoice() — the only supported payment method in Telegram Mini Apps from Q4 2025 onwards." },
    ],
    youtube: [
      { id: "u-yt-1", category: "Storage", effort: "critical", title: "Replace localStorage with saveData/loadData", detail: "We replace all localStorage calls in your build with YouTube Playables' saveData/loadData API — localStorage throws a SecurityError inside the Playables iframe and freezes the game." },
      { id: "u-yt-2", category: "Bundle Size", effort: "critical", title: "Compress build to under 15MB cap", detail: "We apply Brotli compression, strip unused assets, and validate your bundle hits YouTube's hard 15MB ingestion cap — builds over this limit are rejected silently." },
      { id: "u-yt-3", category: "Build", effort: "high", title: "Verify no iframe-injected external scripts", detail: "We audit your index.html for any externally-loaded scripts that YouTube's Content Security Policy will block inside the Playables iframe." },
    ],
    poki: [
      { id: "u-poki-1", category: "Build", effort: "critical", title: "Clean index.html for Poki ingestion", detail: "We verify your index.html is at the root, all asset paths are relative, and there are zero localhost references — the three most common Poki submission rejections." },
      { id: "u-poki-2", category: "Build", effort: "high", title: "Remove Development Build metadata", detail: "We confirm Development Build is disabled — in 2025 Poki began rejecting builds with development profiler metadata in the bundle." },
      { id: "u-poki-3", category: "Performance", effort: "high", title: "Optimise first-scene load under 8MB", detail: "We split your addressables and validate your first-scene bundle is under 8MB — Poki's review team scores initial load time as a key acceptance criterion." },
    ],
    crazygames: [
      { id: "u-cg-1", category: "SDK", effort: "critical", title: "Integrate CrazyGames SDK v3", detail: "We integrate the CrazyGames SDK v3 into your Unity WebGL build, wiring up the required game-ready and ad-break callbacks that CrazyGames mandates for revenue share." },
      { id: "u-cg-2", category: "Build", effort: "high", title: "Validate relative asset paths and clean index.html", detail: "We audit your build output for absolute paths and localhost references that cause asset load failures on CrazyGames' hosting infrastructure." },
    ],
    gamedistribution: [
      { id: "u-gd-1", category: "SDK", effort: "critical", title: "Integrate GameDistribution SDK", detail: "We integrate the GameDistribution SDK and wire up the mandatory preroll ad gate — games without it are not monetised on the GameDistribution network." },
      { id: "u-gd-2", category: "Compliance", effort: "high", title: "Audit for FBInstant SDK conflicts", detail: "We check for conflicting Meta SDK calls that cause silent failures when your game is distributed via GameDistribution's Facebook channel bridge." },
    ],
  },
  godot: {
    meta: [
      { id: "g-meta-1", category: "Export", effort: "critical", title: "Configure Godot HTML5 export with correct MIME headers", detail: "We configure your Godot HTML5 export template and verify the hosting server serves .wasm as application/wasm — Godot exports are more susceptible to MIME misconfiguration than Unity builds." },
      { id: "g-meta-2", category: "SDK", effort: "critical", title: "Build GDScript ↔ FBInstant JavaScript bridge", detail: "We build a JavaScript bridge that connects your GDScript code to FBInstant v8.0 via JavaScriptBridge.eval() — Godot has no native FBInstant plugin, so we construct the integration layer for you." },
      { id: "g-meta-3", category: "Permissions", effort: "critical", title: "Inject v8.0 zero-permissions wrapper into bridge", detail: "We ensure every player data call in your bridge uses requestPermissionsAsync gating — required for Meta v8.0 compliance." },
    ],
    discord: [
      { id: "g-disc-1", category: "OAuth2", effort: "critical", title: "Build Godot ↔ Discord Activities OAuth2 bridge", detail: "We construct the JavaScript bridge between your Godot export and Discord's Activities SDK granular scope model, wiring up all required scopes for your specific game features." },
      { id: "g-disc-2", category: "Testing", effort: "high", title: "Validate token scopes via JWT decode", detail: "We decode your issued Discord access tokens and confirm every scope your game uses is present — catching the silent drop issue that causes random failures for new users." },
    ],
    tiktok: [
      { id: "g-tik-1", category: "CSS", effort: "critical", title: "Patch Godot canvas for TikTok touch-action", detail: "We modify your Godot HTML export template to add touch-action: none on the canvas — preventing TikTok swipe hijacking of Godot's input system." },
      { id: "g-tik-2", category: "SDK", effort: "critical", title: "Build TikTok SDK initialisation wrapper for Godot", detail: "We build a JavaScriptBridge wrapper that calls disableSwipe() before ready() — the required TikTok init order that Godot games frequently miss." },
    ],
    telegram: [
      { id: "g-tel-1", category: "SDK", effort: "critical", title: "Build Telegram WebApp SDK 7.0 bridge for Godot", detail: "We construct a JavaScriptBridge wrapper for Telegram WebApp SDK 7.0, including the validated initData pattern and openInvoice() payment integration." },
      { id: "g-tel-2", category: "Timing", effort: "high", title: "Add ready() timeout guard to Godot export", detail: "We patch your Godot HTML template to include a 500ms ready() timeout guard, preventing the silent freeze on slow Telegram clients." },
    ],
    youtube: [
      { id: "g-yt-1", category: "Storage", effort: "critical", title: "Patch Godot save system for YouTube Playables", detail: "We replace Godot's default File and ConfigFile save calls that write to localStorage with YouTube Playables' saveData/loadData API bridge." },
      { id: "g-yt-2", category: "Bundle Size", effort: "critical", title: "Optimise Godot export bundle for 15MB cap", detail: "We apply compression and strip unused Godot export modules to hit YouTube's 15MB hard cap — standard Godot exports often exceed this without optimisation." },
    ],
    poki: [
      { id: "g-poki-1", category: "Build", effort: "critical", title: "Configure Godot HTML export for Poki hosting", detail: "We validate your Godot HTML export has a clean index.html at root with relative paths and no localhost references — Poki's ingestion requirements are strict and Godot exports frequently fail them." },
      { id: "g-poki-2", category: "Performance", effort: "high", title: "Optimise Godot first-load bundle", detail: "We strip unused modules from your Godot export and target an initial load under 8MB — Poki's acceptance scoring heavily weights load performance." },
    ],
    crazygames: [
      { id: "g-cg-1", category: "SDK", effort: "critical", title: "Build CrazyGames SDK v3 bridge for Godot", detail: "We build a JavaScriptBridge integration for CrazyGames SDK v3 in your Godot export, wiring the required game-ready and ad-break callbacks." },
      { id: "g-cg-2", category: "Build", effort: "high", title: "Validate Godot export asset structure", detail: "We verify your Godot export directory structure meets CrazyGames' hosting requirements — index.html at root, relative paths only." },
    ],
    gamedistribution: [
      { id: "g-gd-1", category: "SDK", effort: "critical", title: "Build GameDistribution SDK bridge for Godot", detail: "We integrate the GameDistribution preroll ad SDK into your Godot HTML export via JavaScriptBridge — required for monetisation on the network." },
    ],
  },
  unreal: {
    meta: [
      { id: "ue-meta-1", category: "Pixel Streaming", effort: "critical", title: "Configure Pixel Streaming signalling server for Meta iframe sandbox", detail: "We configure your Unreal Pixel Streaming signalling server to operate within Meta Instant Games' strict iframe sandbox — WebRTC connections require specific STUN/TURN server configurations that Meta's CSP allows." },
      { id: "ue-meta-2", category: "SDK Bridge", effort: "critical", title: "Build FBInstant v8.0 + Pixel Streaming message bridge", detail: "We build a JavaScript message-passing layer that passes FBInstant v8.0 SDK events (player ID, permissions, leaderboard data) from the browser into your Unreal game via the Pixel Streaming data channel — the only way to get SDK data into a streaming UE build." },
      { id: "ue-meta-3", category: "Latency", effort: "high", title: "Optimise streaming latency for Meta mobile user base", detail: "We configure your Pixel Streaming encoder settings (bitrate, resolution scaling, frame rate caps) for Meta's predominantly mobile user base — unoptimised streams cause input lag that Meta reviewers flag as a gameplay defect." },
    ],
    discord: [
      { id: "ue-disc-1", category: "SDK Bridge", effort: "critical", title: "Build Discord Activities SDK + Pixel Streaming data channel bridge", detail: "We construct a bidirectional bridge between Discord's Activities SDK (granular OAuth2 scopes) and your Unreal game via the Pixel Streaming data channel — enabling user identity, voice state, and presence inside your streamed game." },
      { id: "ue-disc-2", category: "Network", effort: "critical", title: "Configure WebRTC for Discord Activities iframe restrictions", detail: "We configure your Pixel Streaming WebRTC stack to operate within Discord's iframe security model, including the specific TURN server allowlist that Discord's CSP permits." },
    ],
    telegram: [
      { id: "ue-tel-1", category: "SDK Bridge", effort: "critical", title: "Build Telegram WebApp SDK + Pixel Streaming bridge", detail: "We build a message-passing layer that routes Telegram WebApp SDK 7.0 events — including payment flows via openInvoice() — into your Unreal game's Pixel Streaming data channel." },
      { id: "ue-tel-2", category: "Latency", effort: "high", title: "Configure streaming quality for Telegram mobile-first audience", detail: "We tune your Pixel Streaming encoder for Telegram's mobile-dominant user base, balancing quality and latency for 4G/LTE connections." },
    ],
    tiktok: [
      { id: "ue-tik-1", category: "Compatibility", effort: "critical", title: "Assess TikTok Pixel Streaming viability", detail: "We audit whether your Unreal Pixel Streaming setup can meet TikTok Mini Games' technical requirements. TikTok's CSP is the most restrictive of all platforms — WebRTC signalling servers must be pre-approved. We flag incompatibilities before you invest in integration." },
    ],
    youtube: [
      { id: "ue-yt-1", category: "Compatibility", effort: "critical", title: "Assess YouTube Playables Pixel Streaming compatibility", detail: "YouTube Playables enforces a 15MB bundle cap designed for WASM builds — Pixel Streaming requires a server-side component outside this model. We assess whether a hybrid approach can meet YouTube's requirements for your specific game." },
    ],
    poki: [
      { id: "ue-poki-1", category: "Compatibility", effort: "critical", title: "Platform incompatibility assessment — Poki does not support Pixel Streaming", detail: "Poki requires self-contained WebGL builds hosted on their infrastructure. Pixel Streaming requires an external server, which Poki's hosting model does not support. We document this and recommend a Unity or Godot port path if Poki distribution is a priority." },
    ],
    crazygames: [
      { id: "ue-cg-1", category: "Compatibility", effort: "critical", title: "Platform incompatibility assessment — CrazyGames does not support Pixel Streaming", detail: "CrazyGames requires self-contained HTML5 builds. We assess whether a lightweight WebGL frontend wrapper with server-side Unreal rendering is feasible, or document the port recommendation to Unity/Godot." },
    ],
    gamedistribution: [
      { id: "ue-gd-1", category: "Compatibility", effort: "critical", title: "Platform incompatibility assessment — GameDistribution requires self-contained builds", detail: "GameDistribution's network distributes self-contained HTML5 games across 700+ publisher sites. Pixel Streaming's server dependency is incompatible with this model. We document the gap and provide a porting assessment." },
    ],
  },
};

// Universal tasks for any engine+platform combo
const UNIVERSAL_TASKS = {
  meta: [{ id: "uni-meta-1", category: "Scan", effort: "critical", title: "Static analysis of compiled build for deprecated FBInstant patterns", detail: "We scan your compiled, deployed build — not your source code — for all 200+ known deprecated Meta API patterns including those introduced by third-party plugins and asset store packages you didn't write." }],
  discord: [{ id: "uni-disc-1", category: "Scan", effort: "high", title: "Network traffic audit for undeclared PII transmission", detail: "We intercept all network calls from your running build and flag any data transmitted to undeclared third parties — the #1 GDPR enforcement risk in Discord-distributed games." }],
  tiktok: [{ id: "uni-tik-1", category: "Scan", effort: "high", title: "CSP compliance audit for TikTok sandbox restrictions", detail: "We test your build inside a simulated TikTok sandbox and capture every Content Security Policy violation that would silently break navigation, links, or redirects." }],
  telegram: [{ id: "uni-tel-1", category: "Scan", effort: "high", title: "Validate Telegram initData signature on all payment flows", detail: "We verify your payment flows validate the initData HMAC signature server-side — unvalidated initData is the leading cause of Telegram payment fraud and TOS violations." }],
  youtube: [{ id: "uni-yt-1", category: "Scan", effort: "critical", title: "Full YouTube Playables ingestion simulation", detail: "We run your build through a complete YouTube Playables ingestion simulation, capturing every rejection trigger before you submit — YouTube's review queue has a 2–4 week turnaround." }],
  poki: [{ id: "uni-poki-1", category: "Scan", effort: "high", title: "Poki submission pre-flight check", detail: "We run your build through Poki's documented acceptance criteria and score it against their known rejection patterns — saving you weeks in their 4–8 week review cycle." }],
  crazygames: [{ id: "uni-cg-1", category: "Scan", effort: "high", title: "CrazyGames submission pre-flight check", detail: "We validate your build against CrazyGames' review checklist and flag every known rejection trigger before you submit." }],
  gamedistribution: [{ id: "uni-gd-1", category: "Scan", effort: "high", title: "GameDistribution network compliance audit", detail: "We audit your build against GameDistribution's publisher requirements including SDK integration, ad gate timing, and content policy flags." }],
};

const EFFORT_CONFIG = {
  critical: { label: "Critical Fix", color: "#EE1D52", bg: "rgba(238,29,82,0.1)", border: "rgba(238,29,82,0.25)" },
  high: { label: "High Priority", color: "#FF6B00", bg: "rgba(255,107,0,0.1)", border: "rgba(255,107,0,0.25)" },
  medium: { label: "Recommended", color: "#1e6ff0", bg: "rgba(30,111,240,0.1)", border: "rgba(30,111,240,0.25)" },
};

function TaskCard({ task, index }) {
  const [open, setOpen] = useState(false);
  const cfg = EFFORT_CONFIG[task.effort];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border overflow-hidden transition-all"
      style={{ borderColor: open ? cfg.border : "rgba(255,255,255,0.07)", background: open ? cfg.bg : "rgba(255,255,255,0.02)" }}
    >
      <button
        className="w-full flex items-start gap-3 p-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: cfg.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[9px] font-black font-mono uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">{task.category}</span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{task.title}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-white/5">
              <p className="text-sm text-foreground/70 leading-relaxed pt-3">{task.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PlatformComplianceMatrix() {
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Build task list
  const allTasks = [];
  if (selectedEngine && selectedPlatforms.length > 0) {
    const engineTasks = TASKS[selectedEngine] || {};
    selectedPlatforms.forEach(pid => {
      const tasks = engineTasks[pid] || [];
      const universal = UNIVERSAL_TASKS[pid] || [];
      allTasks.push(...tasks, ...universal);
    });
  }

  const criticalCount = allTasks.filter(t => t.effort === "critical").length;
  const highCount = allTasks.filter(t => t.effort === "high").length;

  const isReady = selectedEngine && selectedPlatforms.length > 0;
  const engineNote = ENGINE_NOTES[selectedEngine];

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link to="/IntelligenceCentre" className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Intelligence Centre
        </Link>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Compliance Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
          Platform Compliance Matrix
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xl">
          Select your engine and target platforms. We'll show you exactly what our scan and fix service will handle for your specific combination — no DIY required.
        </p>

        <div className="h-px bg-border mb-10" />

        {/* Step 1: Engine */}
        <div className="mb-10">
          <p className="text-xs font-black font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Step 1 — Your Engine
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {ENGINES.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedEngine(e.id)}
                className="flex-1 rounded-xl border p-4 text-left transition-all hover:scale-[1.02]"
                style={{
                  borderColor: selectedEngine === e.id ? "rgba(30,111,240,0.5)" : "rgba(255,255,255,0.08)",
                  background: selectedEngine === e.id ? "rgba(30,111,240,0.1)" : "rgba(255,255,255,0.02)",
                  boxShadow: selectedEngine === e.id ? "0 0 30px rgba(30,111,240,0.15)" : "none",
                }}
              >
                <p className="font-bold text-foreground mb-0.5">{e.label}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{e.version}</p>
              </button>
            ))}
          </div>

          {/* Unreal engine notice */}
          <AnimatePresence>
            {engineNote && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-xl border p-4"
                style={{ borderColor: `${engineNote.color}30`, background: `${engineNote.color}08` }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: engineNote.color }}>{engineNote.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{engineNote.body}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 2: Platforms */}
        <div className="mb-10">
          <p className="text-xs font-black font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Step 2 — Target Platforms <span className="text-muted-foreground/40 normal-case font-normal">(select all that apply)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PLATFORMS.map(p => {
              const selected = selectedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className="rounded-xl border p-3 text-left transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: selected ? `${p.color}50` : "rgba(255,255,255,0.08)",
                    background: selected ? `${p.color}12` : "rgba(255,255,255,0.02)",
                    boxShadow: selected ? `0 0 20px ${p.color}20` : "none",
                  }}
                >
                  <span className="text-base mb-1 block">{p.icon}</span>
                  <p className="text-xs font-semibold text-foreground leading-tight">{p.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {isReady && allTasks.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="h-px bg-border mb-10" />

              {/* Summary bar */}
              <div className="rounded-2xl border p-6 mb-8"
                style={{ borderColor: "rgba(30,111,240,0.2)", background: "rgba(30,111,240,0.05)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black font-mono uppercase tracking-widest text-primary">What We Will Handle For You</span>
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed mb-4">
                  For a <strong>{ENGINES.find(e => e.id === selectedEngine)?.label}</strong> build targeting <strong>{selectedPlatforms.map(id => PLATFORMS.find(p => p.id === id)?.label).join(", ")}</strong>, our scan and fix service will action the following <strong>{allTasks.length} compliance tasks</strong>:
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#EE1D52" }} />
                    <span className="text-sm font-bold text-foreground">{criticalCount}</span>
                    <span className="text-xs text-muted-foreground">Critical fixes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#FF6B00" }} />
                    <span className="text-sm font-bold text-foreground">{highCount}</span>
                    <span className="text-xs text-muted-foreground">High priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Delivered within 24–48 hours</span>
                  </div>
                </div>
              </div>

              {/* Per-platform groups */}
              {selectedPlatforms.map(pid => {
                const platform = PLATFORMS.find(p => p.id === pid);
                const engineTasks = (TASKS[selectedEngine]?.[pid] || []);
                const universal = UNIVERSAL_TASKS[pid] || [];
                const platformTasks = [...engineTasks, ...universal];
                if (platformTasks.length === 0) return null;
                return (
                  <div key={pid} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm">{platform.icon}</span>
                      <h3 className="text-sm font-black text-foreground">{platform.label}</h3>
                      <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">{platformTasks.length} tasks</span>
                    </div>
                    <div className="space-y-2">
                      {platformTasks.map((task, i) => (
                        <TaskCard key={task.id} task={task} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* CTA */}
              <div className="rounded-2xl border p-8 text-center mt-10"
                style={{ borderColor: "rgba(30,111,240,0.25)", background: "rgba(30,111,240,0.06)" }}>
                <Zap className="w-7 h-7 mx-auto mb-3 text-primary" />
                <h3 className="text-lg font-bold mb-2">Ready to run this compliance scan?</h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                  Upload your build and we'll deliver a full report plus injected fixes for all {allTasks.length} tasks above within 24–48 hours.
                </p>
                <a href="/#cta"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "#1e6ff0", color: "#fff" }}>
                  Start Free Compliance Scan
                </a>
              </div>
            </motion.div>
          )}

          {isReady && allTasks.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground text-sm"
            >
              No specific tasks found for this combination — contact us for a custom audit.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}