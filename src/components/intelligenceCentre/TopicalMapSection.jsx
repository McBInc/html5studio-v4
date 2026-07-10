"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

import {
  Radio, Globe, Zap, ShieldCheck, TrendingUp, AlertTriangle,
  Code2, BookOpen, BarChart3, Layers, ChevronRight, ExternalLink, ArrowRight
} from "lucide-react";
import { useRouter } from 'next/navigation';


// ─── DATA ────────────────────────────────────────────────────────────────────

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
      { title: "Unity WebGL Deploy & Hosting", tags: ["unity webgl deploy", "unity webgl hosting", "unity webgl vercel"], urgency: "hot", slug: "unity-webgl-deploy-hosting" },
      { title: "Build Troubleshooting & Fixes", tags: ["unity webgl error", "wasm error", "compression error"], urgency: "critical", slug: "unity-webgl-build-troubleshooting" },
      { title: "Beginner Deployment Guides", tags: ["publish unity game online", "unity game browser"], urgency: "active", slug: "beginner-deployment-guide" },
      { title: "CI/CD Pipelines for WebGL", tags: ["github pages", "netlify", "itch.io"], urgency: "active", slug: "cicd-webgl-pipelines" },
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
      { title: "Meta Instant Games", tags: ["SDK v8.0", "Sept 30 sunset", "zero-permissions"], urgency: "critical", slug: "meta-sdk-v8-migration" },
      { title: "Discord Activities", tags: ["Feb 25 API split", "granular scopes", "Activities SDK"], urgency: "critical", slug: "discord-activities-api-split" },
      { title: "TikTok Mini-Games", tags: ["touch-action CSS", "swipe-to-exit", "SDK bridge"], urgency: "hot", slug: "tiktok-mini-games" },
      { title: "Telegram Mini Apps", tags: ["SDK 7.0", "Stars Payment", "Storebridge.jslib"], urgency: "hot", slug: "telegram-mini-apps" },
      { title: "YouTube Playables", tags: ["15MB limit", "relative path fix", "bundle ingestion"], urgency: "active", slug: "youtube-playables" },
      { title: "LinkedIn & B2B Gaming", tags: ["Unwrapped Pixel", "corporate auth", "zero-permissions"], urgency: "active", slug: "linkedin-b2b-gaming" },
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
      { title: "WebGL Certification Standard", tags: ["WGL-CERT", "DIP seal", "2026 compliance"], urgency: "critical", slug: "webgl-certification-standard" },
      { title: "EU DMA Interoperability", tags: ["Article 7", "EU storefronts", "certified proof"], urgency: "critical", slug: "eu-dma-article7" },
      { title: "PII & Privacy Compliance", tags: ["GDPR", "illegal PII calls", "data minimization"], urgency: "hot", slug: "pii-privacy-compliance" },
      { title: "API Deprecation Tracker", tags: ["sunset dates", "migration patches", "SDK audits"], urgency: "hot", slug: "api-deprecation-tracker" },
      { title: "Sept 30 Risk Assessor", tags: ["risk score", "studio compliance signal", "sunset exposure"], urgency: "critical", slug: null, internalPath: "/sept30-risk-assessor" },
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
      { title: "Platform API Change Alerts", tags: ["breaking changes", "deprecation notices", "dev portals"], urgency: "critical", slug: "platform-api-change-alerts" },
      { title: "Regulatory Bulletins", tags: ["EU DMA", "GDPR updates", "age rating changes"], urgency: "hot", slug: "regulatory-bulletins" },
      { title: "Developer Forum Signals", tags: ["Stack Overflow", "Unity forums", "Reddit gamedev"], urgency: "active", slug: "developer-forum-signals" },
      { title: "Build Error Pattern Tracking", tags: ["wasm errors", "compression bugs", "SDK fails"], urgency: "hot", slug: "build-error-pattern-tracking" },
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
      { title: "Hyper-Casual & Crazy Games Market", tags: ["Crazy Games", "Poki", "hyper-casual economics"], urgency: "active", slug: "hyper-casual-market" },
      { title: "Web3 & Play-to-Earn", tags: ["TON Network", "crypto gaming", "NFT mechanics"], urgency: "active", slug: "web3-play-to-earn" },
      { title: "AI in Game Dev", tags: ["AI asset gen", "procedural content", "LLM NPCs"], urgency: "active", slug: "ai-in-game-dev" },
      { title: "Cloud Streaming & Browser Tech", tags: ["WebGPU", "WASM advances", "cloud rendering"], urgency: "active", slug: "cloud-streaming-browser-tech" },
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
      { title: "Ad Network Integrations", tags: ["Meta Audience Network", "AdMob", "ironsource"], urgency: "active", slug: "ad-network-integrations" },
      { title: "IAP & Stars / TON Payments", tags: ["Telegram Stars", "in-app purchase", "payment bridge"], urgency: "hot", slug: "iap-stars-ton-payments" },
      { title: "UA & Growth Strategy", tags: ["cost per install", "viral loops", "social sharing"], urgency: "active", slug: "ua-growth-strategy" },
      { title: "Game Valuations & M&A", tags: ["VSA reports", "DAU valuation", "acquisition multiples"], urgency: "active", slug: "game-valuations-ma" },
      { title: "Game Investing for Start-ups", tags: ["gaming VC", "seed funding", "DIP diligence", "TON investor"], urgency: "hot", slug: "game-investing-guide" },
      { title: "TON Revenue-Share Tokens", tags: ["trustless investor", "smart contract split", "revenue token"], urgency: "hot", slug: "ton-investor-structure" },
      { title: "Investor Due Diligence Guide", tags: ["data room", "VC checklist", "IP ownership", "ARPDAU"], urgency: "active", slug: "investor-due-diligence-guide" },
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
      { title: "GDPR & CCPA Compliance", tags: ["data privacy", "consent flows", "cookie law"], urgency: "hot", slug: "gdpr-ccpa-compliance" },
      { title: "EU Digital Markets Act", tags: ["Article 7", "gatekeeper rules", "interoperability"], urgency: "critical", slug: "eu-dma-article7" },
      { title: "Content Moderation & Age Ratings", tags: ["PEGI", "ESRB", "content policies"], urgency: "active", slug: "content-moderation-age-ratings" },
      { title: "IP & Licensing for WebGL Games", tags: ["open source", "asset licensing", "trademark"], urgency: "active", slug: "ip-licensing-webgl" },
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
      { title: "Unity WebGL Build System", tags: ["WebGL template", "MemorySize", "gzip/brotli"], urgency: "hot", slug: "unity-webgl-build-system" },
      { title: "Godot & Alternative Engines", tags: ["Godot Web export", "Cocos Creator", "Construct 3"], urgency: "active", slug: "godot-alternative-engines" },
      { title: "SDK Integration Guides", tags: ["Facebook SDK", "Discord SDK", "TikTok SDK"], urgency: "hot", slug: "sdk-integration-guides" },
      { title: "Performance Profiling", tags: ["WASM heap", "draw calls", "frame budget"], urgency: "active", slug: "performance-profiling" },
    ],
    linkedPillars: ["deployment", "compliance"],
  },
];

const URGENCY_CONFIG = {
  critical: { label: "CRITICAL", color: "#EE1D52", bg: "rgba(238,29,82,0.12)" },
  hot:      { label: "HOT",      color: "#FF6B00", bg: "rgba(255,107,0,0.12)" },
  active:   { label: "ACTIVE",   color: "#1e6ff0", bg: "rgba(30,111,240,0.12)" },
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function PillarCard({ pillar, isSelected, onClick }) {
  const Icon = pillar.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-xl border p-5 transition-all duration-300 relative overflow-hidden group"
      style={{
        borderColor: isSelected ? `${pillar.color}60` : "rgba(255,255,255,0.07)",
        background: isSelected ? `${pillar.color}08` : "rgba(255,255,255,0.015)",
        boxShadow: isSelected ? `0 0 30px ${pillar.color}18` : "none",
      }}
    >
      {/* Accent line */}
      <div
        className="absolute top-0 left-0 w-full h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${pillar.color}, transparent)`,
          opacity: isSelected ? 1 : 0,
        }}
      />

      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${pillar.color}18`, border: `1px solid ${pillar.color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: pillar.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-foreground leading-snug">{pillar.label}</span>
            <span
              className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded shrink-0"
              style={{ background: `${pillar.badgeColor}18`, color: pillar.badgeColor }}
            >
              {pillar.badge}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{pillar.description}</p>
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.color }} />
            <span className="text-[10px] font-mono text-muted-foreground">{pillar.topics.length} topic clusters</span>
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 shrink-0 mt-2 transition-transform duration-200"
          style={{
            color: isSelected ? pillar.color : "rgba(255,255,255,0.2)",
            transform: isSelected ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      </div>
    </motion.button>
  );
}

function TopicCluster({ topic, pillarColor, index }) {
  const urgency = URGENCY_CONFIG[topic.urgency];
  const navigate = useRouter();
  const handleClick = () => {
    if (topic.internalPath) navigate(topic.internalPath);
    else if (topic.slug) navigate(`/article/${topic.slug}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={handleClick}
      className="group rounded-xl border p-4 transition-all duration-200 hover:border-white/20"
      style={{
        borderColor: topic.slug ? `${pillarColor}25` : "rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        cursor: (topic.slug || topic.internalPath) ? "pointer" : "default",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-1 h-full min-h-[40px] rounded-full shrink-0"
          style={{ background: pillarColor, opacity: 0.7 }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{topic.title}</span>
            <span
              className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded"
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
                style={{ borderColor: `${pillarColor}25`, color: `${pillarColor}80`, background: `${pillarColor}08` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {(topic.slug || topic.internalPath)
          ? <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-1 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: pillarColor }} />
          : <span className="text-[8px] font-mono text-muted-foreground/25 shrink-0 mt-1">SOON</span>
        }
      </div>
    </motion.div>
  );
}

function LinkBridge({ fromPillar, linkedIds }) {
  const linked = PILLARS.filter((p) => linkedIds.includes(p.id));
  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
      <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest self-center">Links to →</span>
      {linked.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold"
            style={{
              borderColor: `${p.color}35`,
              color: p.color,
              background: `${p.color}08`,
            }}
          >
            <Icon className="w-3 h-3" />
            {p.label}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function TopicalMapSection() {
  const [selected, setSelected] = useState("deployment");

  const activePillar = PILLARS.find((p) => p.id === selected);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080b14 0%, #0a0d1a 50%, #080b14 100%)" }} />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(30,111,240,0.07) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-wider">Intelligence Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            The Game Industry Topical Map
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every pillar, every cluster, every keyword — mapped and linked.
            Select a pillar to explore its topic clusters and upstream connections.
          </p>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-6 flex-wrap">
            {Object.entries(URGENCY_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">{cfg.label}</span>
              </div>
            ))}
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[10px] font-mono text-muted-foreground/40">{PILLARS.length} pillars · {PILLARS.reduce((a,p) => a + p.topics.length, 0)} topic clusters</span>
          </div>
        </motion.div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start">

          {/* LEFT: Pillar list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-2.5"
          >
            {PILLARS.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                isSelected={selected === pillar.id}
                onClick={() => setSelected(pillar.id)}
              />
            ))}
          </motion.div>

          {/* RIGHT: Topic detail panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="sticky top-8"
          >
            <AnimatePresence mode="wait">
              {activePillar && (
                <motion.div
                  key={activePillar.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    borderColor: `${activePillar.color}25`,
                    background: "rgba(10,13,26,0.9)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Panel header */}
                  <div
                    className="px-6 py-5 border-b"
                    style={{ borderColor: `${activePillar.color}18`, background: `${activePillar.color}06` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${activePillar.color}20`, border: `1px solid ${activePillar.color}35` }}
                      >
                        <activePillar.icon className="w-4 h-4" style={{ color: activePillar.color }} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{activePillar.label}</h3>
                        <span
                          className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded"
                          style={{ background: `${activePillar.badgeColor}18`, color: activePillar.badgeColor }}
                        >
                          {activePillar.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activePillar.description}</p>
                    <Link
                      to={`/PillarDetail/${activePillar.id}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-mono font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: activePillar.color }}
                    >
                      View full pillar page <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Topic clusters */}
                  <div className="p-5 space-y-3">
                    <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-4">
                      Topic Clusters ({activePillar.topics.length})
                    </p>
                    {activePillar.topics.map((topic, i) => (
                      <TopicCluster
                        key={topic.title}
                        topic={topic}
                        pillarColor={activePillar.color}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* Link bridges */}
                  <div className="px-5 pb-5">
                    <LinkBridge fromPillar={activePillar} linkedIds={activePillar.linkedPillars} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom connection summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 pt-10 border-t border-border"
        >
          <p className="text-xs font-mono text-muted-foreground/40 uppercase tracking-widest text-center mb-8">
            How the pillars connect — the full intelligence graph
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Agent-monitored sources", value: "40+", color: "#EE1D52" },
              { label: "Topic clusters mapped", value: PILLARS.reduce((a, p) => a + p.topics.length, 0), color: "#1e6ff0" },
              { label: "Platform ecosystems covered", value: "8", color: "#FF6B00" },
              { label: "Keyword intents tracked", value: "50+", color: "#00FF88" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border p-5 text-center"
                style={{ borderColor: `${stat.color}20`, background: `${stat.color}05` }}
              >
                <div
                  className="text-3xl font-black font-mono mb-1"
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}50` }}
                >
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}