"use client";

import React, { useState } from "react";
import Link from 'next/link';

import { motion } from "framer-motion";
import { Globe, FileText, Database, Shield, Radio, ChevronRight, ExternalLink } from "lucide-react";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const SITE_STRUCTURE = [
  {
    section: "Core Pages",
    icon: Globe,
    color: "#1e6ff0",
    pages: [
      { title: "Landing", path: "/Landing", desc: "Main marketing homepage — diagnosis, certification, pricing" },
      { title: "Intelligence Centre", path: "/IntelligenceCentre", desc: "32-topic industry intelligence dashboard" },
      { title: "Studio Directory", path: "/StudioDirectory", desc: "WebGL game studio registry with compliance risk flags" },
      { title: "Registry", path: "/Registry", desc: "Public WGL-CERT certification lookup" },
      { title: "Cert Badge Preview", path: "/CertBadgePreview", desc: "Interactive badge configurator and export tool" },
    ],
  },
  {
    section: "Articles — Platform & SDK",
    icon: Radio,
    color: "#EE1D52",
    badge: "CRITICAL",
    pages: [
      { title: "Meta SDK v8.0 Migration Guide", path: "/article/meta-sdk-v8-migration", desc: "Mandatory Sept 30 deadline — zero-permissions architecture", urgency: "critical" },
      { title: "Discord Activities API Split", path: "/article/discord-activities-api-split", desc: "Granular OAuth2 scope migration — Feb 2025 breaking change", urgency: "critical" },
      { title: "API Deprecation Tracker 2026", path: "/article/api-deprecation-tracker", desc: "Full-year calendar of platform SDK sunsets", urgency: "critical" },
      { title: "Platform API Change Alerts", path: "/article/platform-api-change-alerts", desc: "How HTML5STUDIO monitors 40+ sources for breaking changes", urgency: "hot" },
    ],
  },
  {
    section: "Articles — Build & Deploy",
    icon: FileText,
    color: "#FF6B00",
    pages: [
      { title: "Unity WebGL Build Troubleshooting", path: "/article/unity-webgl-build-troubleshooting", desc: "WASM streaming, CORS, OOM, SDK race conditions — 2026 fixes", urgency: "hot" },
    ],
  },
  {
    section: "Articles — Certification & Legal",
    icon: Shield,
    color: "#00C896",
    pages: [
      { title: "WGL-CERT Certification Standard", path: "/article/webgl-certification-standard", desc: "Scoring methodology, tiers, DIP seal, commercial value", urgency: "active" },
      { title: "EU DMA Article 7 Compliance", path: "/article/eu-dma-article7", desc: "Gatekeeper obligations for game publishers on Meta, Google, Apple", urgency: "critical" },
    ],
  },
  {
    section: "Intelligence Centre — Pillars",
    icon: Database,
    color: "#8B5CF6",
    desc: "Navigate via /IntelligenceCentre → pillar cards",
    pages: [
      { title: "Deployment & Distribution", path: "/IntelligenceCentre", desc: "Meta, Discord, TikTok, Telegram, YouTube, Poki, CrazyGames" },
      { title: "Platform API Ecosystems", path: "/IntelligenceCentre", desc: "SDK lifecycles, breaking changes, deprecation timelines" },
      { title: "Monetisation & Growth", path: "/IntelligenceCentre", desc: "Ad networks, IAP, Stars/TON payments, UA strategy, M&A" },
      { title: "Legal & Compliance", path: "/IntelligenceCentre", desc: "GDPR, CCPA, DMA, IP licensing, age ratings" },
      { title: "Tech Stack & Engines", path: "/IntelligenceCentre", desc: "Unity, Godot, SDK integrations, WASM performance profiling" },
      { title: "Market Intelligence", path: "/IntelligenceCentre", desc: "Hyper-casual market, Web3, AI in game dev, cloud streaming" },
    ],
  },
];

const URGENCY_COLORS = {
  critical: { label: "CRITICAL", color: "#EE1D52", bg: "rgba(238,29,82,0.12)" },
  hot: { label: "HOT", color: "#FF6B00", bg: "rgba(255,107,0,0.12)" },
  active: { label: "ACTIVE", color: "#1e6ff0", bg: "rgba(30,111,240,0.12)" },
};

function PageRow({ page, color }) {
  const urg = URGENCY_COLORS[page.urgency];
  return (
    <Link
      to={page.path}
      className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-white/4 transition-colors group"
    >
      <ChevronRight className="w-3.5 h-3.5 mt-1 shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" style={{ color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground group-hover:text-white transition-colors">{page.title}</span>
          {urg && (
            <span className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded" style={{ background: urg.bg, color: urg.color }}>
              {urg.label}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{page.desc}</p>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground/30 shrink-0 mt-1 hidden sm:block">{page.path}</span>
    </Link>
  );
}

export default function Sitemap() {
  const totalPages = SITE_STRUCTURE.reduce((acc, s) => acc + s.pages.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-wider">Site Map</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-3">HTML5STUDIO Sitemap</h1>
            <p className="text-muted-foreground text-sm">
              {totalPages} pages across {SITE_STRUCTURE.length} sections — click any item to navigate.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {SITE_STRUCTURE.map((section, si) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.section}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.08 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: `${section.color}20` }}
                >
                  {/* Section header */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 border-b"
                    style={{ background: `${section.color}08`, borderColor: `${section.color}15` }}
                  >
                    <Icon className="w-4 h-4 shrink-0" style={{ color: section.color }} />
                    <span className="font-bold text-sm text-foreground">{section.section}</span>
                    {section.badge && (
                      <span className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(238,29,82,0.15)", color: "#EE1D52" }}>
                        {section.badge}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] font-mono text-muted-foreground/40">{section.pages.length} pages</span>
                  </div>
                  {/* Pages */}
                  <div className="divide-y divide-white/4">
                    {section.pages.map((page) => (
                      <PageRow key={page.path + page.title} page={page} color={section.color} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Coming Soon notice */}
          <div
            className="mt-8 rounded-xl border p-5 text-center"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">Coming Soon</p>
            <p className="text-sm text-muted-foreground">
              25 additional article pages across GDPR/CCPA, Unity Build System, Ad Network Integrations, Web3 & Play-to-Earn, and more — currently marked <span className="font-mono text-muted-foreground/60">SOON</span> in the Intelligence Centre.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}