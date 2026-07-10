"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Radio, Globe, Zap, ShieldCheck, TrendingUp,
  Code2, BookOpen, BarChart3, Layers, ArrowLeft, ArrowRight
} from "lucide-react";
import NewsTicker from "@/components/landing/NewsTicker";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PILLARS = [
  {
    id: "deployment",
    label: "Deployment & Publishing",
    icon: Zap,
    color: "#1e6ff0",
    badge: "TIER 1–3 KEYWORDS",
    badgeColor: "#1e6ff0",
    description: "The core pipeline — from build to live. Covers Unity WebGL deploy, hosting, and launch.",
    topics: [
      { title: "Unity WebGL Deploy & Hosting", tags: ["unity webgl deploy", "unity webgl hosting", "unity webgl vercel"], urgency: "hot" },
      { title: "Build Troubleshooting & Fixes", tags: ["unity webgl error", "wasm error", "compression error"], urgency: "critical" },
      { title: "Beginner Deployment Guides", tags: ["publish unity game online", "unity game browser"], urgency: "active" },
      { title: "CI/CD Pipelines for WebGL", tags: ["github pages", "netlify", "itch.io"], urgency: "active" },
    ],
    linkedPillars: ["platforms", "compliance"],
  },
  {
    id: "platforms",
    label: "Platform Ecosystems",
    icon: Layers,
    color: "#FF6B00",
    badge: "TIER 4 KEYWORDS",
    badgeColor: "#FF6B00",
    description: "Deep dives into every platform's SDK, API rules, and 2026 compliance requirements.",
    topics: [
      { title: "Meta Instant Games", tags: ["SDK v8.0", "Sept 30 sunset", "zero-permissions"], urgency: "critical" },
      { title: "Discord Activities", tags: ["Feb 25 API split", "granular scopes", "Activities SDK"], urgency: "critical" },
      { title: "TikTok Mini-Games", tags: ["touch-action CSS", "swipe-to-exit", "SDK bridge"], urgency: "hot" },
      { title: "Telegram Mini Apps", tags: ["SDK 7.0", "Stars Payment", "Storebridge.jslib"], urgency: "hot" },
      { title: "YouTube Playables", tags: ["15MB limit", "relative path fix", "bundle ingestion"], urgency: "active" },
      { title: "LinkedIn & B2B Gaming", tags: ["Unwrapped Pixel", "corporate auth", "zero-permissions"], urgency: "active" },
    ],
    linkedPillars: ["compliance", "intelligence"],
  },
  {
    id: "compliance",
    label: "Compliance & Certification",
    icon: ShieldCheck,
    color: "#00FF88",
    badge: "CORE SERVICE",
    badgeColor: "#00FF88",
    description: "The certification engine. Standards, forensic scanning, remediation patches and DIP certification.",
    topics: [
      { title: "WebGL Certification Standard", tags: ["WGL-CERT", "DIP seal", "2026 compliance"], urgency: "critical" },
      { title: "EU DMA Interoperability", tags: ["Article 7", "EU storefronts", "certified proof"], urgency: "critical" },
      { title: "PII & Privacy Compliance", tags: ["GDPR", "illegal PII calls", "data minimization"], urgency: "hot" },
      { title: "API Deprecation Tracker", tags: ["sunset dates", "migration patches", "SDK audits"], urgency: "hot" },
    ],
    linkedPillars: ["deployment", "platforms", "legal"],
  },
  {
    id: "intelligence",
    label: "Live Intelligence Feed",
    icon: Radio,
    color: "#EE1D52",
    badge: "AGENT-POWERED",
    badgeColor: "#EE1D52",
    description: "Real-time signal monitoring across all platforms, dev portals, regulatory bodies, and forums.",
    topics: [
      { title: "Platform API Change Alerts", tags: ["breaking changes", "deprecation notices", "dev portals"], urgency: "critical" },
      { title: "Regulatory Bulletins", tags: ["EU DMA", "GDPR updates", "age rating changes"], urgency: "hot" },
      { title: "Developer Forum Signals", tags: ["Stack Overflow", "Unity forums", "Reddit gamedev"], urgency: "active" },
      { title: "Build Error Pattern Tracking", tags: ["wasm errors", "compression bugs", "SDK fails"], urgency: "hot" },
    ],
    linkedPillars: ["platforms", "compliance", "trends"],
  },
  {
    id: "trends",
    label: "Industry Trends",
    icon: TrendingUp,
    color: "#9B59B6",
    badge: "UPSTREAM",
    badgeColor: "#9B59B6",
    description: "Macro movements — Web3 gaming, AI tooling, cloud streaming, casual & hyper-casual game economics.",
    topics: [
      { title: "Hyper-Casual & Crazy Games Market", tags: ["Crazy Games", "Poki", "hyper-casual economics"], urgency: "active" },
      { title: "Web3 & Play-to-Earn", tags: ["TON Network", "crypto gaming", "NFT mechanics"], urgency: "active" },
      { title: "AI in Game Dev", tags: ["AI asset gen", "procedural content", "LLM NPCs"], urgency: "active" },
      { title: "Cloud Streaming & Browser Tech", tags: ["WebGPU", "WASM advances", "cloud rendering"], urgency: "active" },
    ],
    linkedPillars: ["intelligence", "monetization"],
  },
  {
    id: "monetization",
    label: "Monetization & Business",
    icon: BarChart3,
    color: "#F1C40F",
    badge: "DOWNSTREAM",
    badgeColor: "#F1C40F",
    description: "Revenue models, user acquisition, ad networks, IAP strategies, and platform economics.",
    topics: [
      { title: "Ad Network Integrations", tags: ["Meta Audience Network", "AdMob", "ironsource"], urgency: "active" },
      { title: "IAP & Stars / TON Payments", tags: ["Telegram Stars", "in-app purchase", "payment bridge"], urgency: "hot" },
      { title: "UA & Growth Strategy", tags: ["cost per install", "viral loops", "social sharing"], urgency: "active" },
      { title: "Game Valuations & M&A", tags: ["VSA reports", "DAU valuation", "acquisition multiples"], urgency: "active" },
    ],
    linkedPillars: ["trends", "platforms"],
  },
  {
    id: "legal",
    label: "Legal & Regulatory",
    icon: BookOpen,
    color: "#229ED9",
    badge: "REGULATORY",
    badgeColor: "#229ED9",
    description: "Privacy law, IP, content moderation, and the evolving regulatory landscape for browser gaming.",
    topics: [
      { title: "GDPR & CCPA Compliance", tags: ["data privacy", "consent flows", "cookie law"], urgency: "hot" },
      { title: "EU Digital Markets Act", tags: ["Article 7", "gatekeeper rules", "interoperability"], urgency: "critical" },
      { title: "Content Moderation & Age Ratings", tags: ["PEGI", "ESRB", "content policies"], urgency: "active" },
      { title: "IP & Licensing for WebGL Games", tags: ["open source", "asset licensing", "trademark"], urgency: "active" },
    ],
    linkedPillars: ["compliance", "platforms"],
  },
  {
    id: "devtools",
    label: "Dev Tools & Engines",
    icon: Code2,
    color: "#5865F2",
    badge: "UPSTREAM",
    badgeColor: "#5865F2",
    description: "The toolchain — Unity, Godot, Cocos, custom engines — and the SDKs that make them platform-ready.",
    topics: [
      { title: "Unity WebGL Build System", tags: ["WebGL template", "MemorySize", "gzip/brotli"], urgency: "hot" },
      { title: "Godot & Alternative Engines", tags: ["Godot Web export", "Cocos Creator", "Construct 3"], urgency: "active" },
      { title: "SDK Integration Guides", tags: ["Facebook SDK", "Discord SDK", "TikTok SDK"], urgency: "hot" },
      { title: "Performance Profiling", tags: ["WASM heap", "draw calls", "frame budget"], urgency: "active" },
    ],
    linkedPillars: ["deployment", "compliance"],
  },
];

const URGENCY_CONFIG = {
  critical: { label: "CRITICAL", color: "#EE1D52", bg: "rgba(238,29,82,0.12)" },
  hot:      { label: "HOT",      color: "#FF6B00", bg: "rgba(255,107,0,0.12)" },
  active:   { label: "ACTIVE",   color: "#1e6ff0", bg: "rgba(30,111,240,0.12)" },
};

export default function PillarDetail() {
  const { pillarId } = useParams();
  const pillar = PILLARS.find((p) => p.id === pillarId);
  const pillarIndex = PILLARS.findIndex((p) => p.id === pillarId);
  const prevPillar = pillarIndex > 0 ? PILLARS[pillarIndex - 1] : null;
  const nextPillar = pillarIndex < PILLARS.length - 1 ? PILLARS[pillarIndex + 1] : null;

  if (!pillar) {
    return (
      <div className="min-h-screen bg-background text-foreground font-inter flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Pillar not found.</p>
          <Link href="/IntelligenceCentre" className="text-primary underline">Back to Intelligence Centre</Link>
        </div>
      </div>
    );
  }

  const Icon = pillar.icon;
  const linkedPillars = PILLARS.filter((p) => pillar.linkedPillars.includes(p.id));

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080b14 0%, #0a0d1a 100%)" }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${pillar.color}12 0%, transparent 70%)`, filter: "blur(40px)" }}
        />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)` }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Link
              href="/IntelligenceCentre"
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-10 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Intelligence Centre / Topical Map
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `${pillar.color}18`, border: `1.5px solid ${pillar.color}35` }}
              >
                <Icon className="w-7 h-7" style={{ color: pillar.color }} />
              </div>
              <div>
                <span
                  className="text-[9px] font-black font-mono px-2 py-0.5 rounded mb-1 inline-block"
                  style={{ background: `${pillar.badgeColor}18`, color: pillar.badgeColor }}
                >
                  {pillar.badge}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{pillar.label}</h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{pillar.description}</p>

            <div className="flex items-center gap-4 mt-5 text-xs font-mono text-muted-foreground/50">
              <span>{pillar.topics.length} topic clusters</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{pillar.linkedPillars.length} pillar connections</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{pillar.topics.reduce((a, t) => a + t.tags.length, 0)} keywords tracked</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topic Clusters */}
      <section className="relative py-12">
        <div className="absolute inset-0" style={{ background: "#0a0d1a" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-6">
            Topic Clusters — {pillar.topics.length} total
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {pillar.topics.map((topic, i) => {
              const urgency = URGENCY_CONFIG[topic.urgency];
              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border p-5 transition-all duration-200 hover:border-white/20"
                  style={{ borderColor: `${pillar.color}20`, background: `${pillar.color}04` }}
                >
                  {/* Top accent */}
                  <div className="w-full h-0.5 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${pillar.color}60, transparent)` }} />

                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-bold text-foreground leading-snug">{topic.title}</h3>
                    <span
                      className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: urgency.bg, color: urgency.color }}
                    >
                      {urgency.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                        style={{ borderColor: `${pillar.color}25`, color: `${pillar.color}90`, background: `${pillar.color}08` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Linked Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/5"
          >
            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-5">
              Connected Pillars
            </p>
            <div className="flex flex-wrap gap-3">
              {linkedPillars.map((lp) => {
                const LPIcon = lp.icon;
                return (
                  <Link
                    key={lp.id}
                    href={`/pillar/${lp.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:scale-105"
                    style={{ borderColor: `${lp.color}30`, color: lp.color, background: `${lp.color}08` }}
                  >
                    <LPIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{lp.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Prev / Next Pillar nav */}
          <div className="mt-12 flex items-center justify-between gap-4">
            {prevPillar ? (
              <Link
                href={`/pillar/${prevPillar.id}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/8 hover:border-white/20 transition-all text-sm text-muted-foreground hover:text-foreground group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>{prevPillar.label}</span>
              </Link>
            ) : <div />}
            {nextPillar ? (
              <Link
                href={`/pillar/${nextPillar.id}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/8 hover:border-white/20 transition-all text-sm text-muted-foreground hover:text-foreground group"
              >
                <span>{nextPillar.label}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
