"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

import {
  Shield, Zap, TrendingUp, Users, Globe, Star, ChevronDown, ChevronUp,
  ArrowRight, ChevronRight, Radio, CheckCircle2, Lock, Coins, BarChart3, BookOpen,
  Rocket, Heart, Award, ExternalLink, AlertTriangle, DollarSign, Mic
} from "lucide-react";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import OnboardingAgentModal from '@/components/ambassador/OnboardingAgentModal';

// ─── DATA ──────────────────────────────────────────────────────────────────

const INVESTORS = [
  { name: "BITKRAFT Ventures", aum: "$1.05B", focus: "Studios, AI×Gaming, UGC", checkRange: "$3M–$30M+", stage: "Seed–B", dealSignal: "19 deals in 2025", dipCompatible: true, notes: "Thesis: 'synthetic reality' — compliance-first builds align directly." },
  { name: "Griffin Gaming Partners", aum: "$1.5B", focus: "Studios, Platforms, Infra", checkRange: "$7M–$50M+", stage: "Seed–C", dealSignal: "8 deals in 2025", dipCompatible: true, notes: "Led Discord investment. DIP certification directly addresses their platform compliance requirement." },
  { name: "a16z Games / Speedrun", aum: "$1.2B", focus: "Distribution, Creator Tools", checkRange: "$750K–$30M+", stage: "Pre-seed–Growth", dealSignal: "120+ via Speedrun", dipCompatible: true, notes: "Speedrun cohort. Certified builds qualify for accelerated distribution diligence." },
  { name: "Makers Fund", aum: "$960M", focus: "F2P Content, UGC, Services", checkRange: "$5M–$22M+", stage: "Seed–Growth", dealSignal: "6 deals in 2025", dipCompatible: true, notes: "Backed Playco (HTML5 gaming). DIP seal maps to their F2P platform deployment standards." },
  { name: "Play Ventures", aum: "$450M", focus: "F2P, Mobile-first, Web3", checkRange: "$4.5M–$30M", stage: "Pre-seed–A", dealSignal: "8 deals in 2025", dipCompatible: true, notes: "Singapore-based, Asia-Pacific reach. Web3 gaming portfolio — TON revenue bridge is additive." },
  { name: "Konvoy Ventures", aum: "$258M", focus: "Infrastructure, Analytics, Dev Tools", checkRange: "$3M–$11M", stage: "Pre-seed–A", dealSignal: "Thesis-driven", dipCompatible: false, notes: "Infrastructure focus — pitch the DIP as developer tooling infrastructure, not just compliance." },
];

const JOURNEY_STAGES = [
  { icon: "😤", label: "Game Dev Hell", desc: "SDK errors. Platform rejections. WASM crashes. No revenue. No path forward.", color: "#EE1D52" },
  { icon: "🤝", label: "Ambassador Accepted", desc: "HTML5STUDIO covers your full compliance journey — scan, fix, certify. Zero upfront cost.", color: "#FF6B00" },
  { icon: "🛡️", label: "WGL-CERT Issued", desc: "DIP seal granted. Full audit trail. Investor-grade IP documentation. Platform-ready.", color: "#1e6ff0" },
  { icon: "⛓️", label: "TON Bridge Activated", desc: "Revenue-share smart contract deployed. Every transaction auto-splits — no trust required.", color: "#9B59B6" },
  { icon: "📈", label: "Investor Deal Presented", desc: "Pre-certified build + live revenue stream + TON smart contract = bankable asset.", color: "#F1C40F" },
  { icon: "🚀", label: "Game Publishing Heaven", desc: "Live on Meta, Discord, TikTok, Telegram, YouTube. Revenue flowing. Equity documented.", color: "#00FF88" },
];

const TON_MECHANICS = [
  { title: "Per-Transaction Split", desc: "Every Stars/TON payment hits the smart contract first. It auto-routes: X% to studio, Y% to investor, Z% to HTML5STUDIO — simultaneously, on-chain, irrevocably.", icon: Coins },
  { title: "No Trust Required", desc: "The investor never has to trust the publisher's revenue reports. The blockchain IS the revenue report. Real-time, auditable, immutable.", icon: Lock },
  { title: "No Wait for Dividends", desc: "Traditional game investing: wait 12–24 months for quarterly statements. TON: investor wallet receives revenue within seconds of every player transaction.", icon: Zap },
  { title: "No Sale Required", desc: "Unlike exit-dependent equity, this model pays continuously. Studios don't need to sell. Investors don't need an M&A event. Revenue streams forever.", icon: TrendingUp },
  { title: "DIP Seal as Collateral", desc: "The WGL-CERT and DIP seal are on-chain IP records. They serve as verifiable collateral proving the asset's compliance status and valuation tier.", icon: Shield },
  { title: "Transferable Revenue Rights", desc: "Investor's revenue-share token is transferable. They can sell their stream. Secondary market for game revenue rights — a first in the industry.", icon: Globe },
];

const DIP_INVESTOR_CHECKLIST = [
  { item: "Platform SDK compliance verified (Meta v8.0, Discord Activities, TikTok, Telegram 7.0)", pass: true },
  { item: "GDPR/CCPA data minimization audit completed", pass: true },
  { item: "IP ownership chain documented and timestamped", pass: true },
  { item: "DCF valuation model with ARPDAU and DAU projections", pass: true },
  { item: "No illegal PII calls or third-party data leakage", pass: true },
  { item: "Multi-platform deployment verified with mobile emulation recording", pass: true },
  { item: "Revenue bridge smart contract audited", pass: true },
  { item: "Investor revenue-share token minted on TON", pass: true },
];

const DISRUPTION_POINTS = [
  {
    title: "The VC funding gap",
    stat: "−80%",
    statLabel: "VC gaming funding since 2021 peak",
    insight: "Total gaming VC dropped from $12.5B (2021) to $2.54B (2024). The funds still writing checks are more thesis-driven than ever — but 95% of indie WebGL studios can't clear diligence. We fix that.",
    color: "#EE1D52",
  },
  {
    title: "The compliance bottleneck",
    stat: "Sept 30",
    statLabel: "Meta SDK v8.0 sunset — mass non-compliance incoming",
    insight: "Most studios are building on deprecated SDKs. They'll be rejected or delisted. We certify them before they hit the wall — and turn that compliance event into an investor pitch moment.",
    color: "#FF6B00",
  },
  {
    title: "The trust problem",
    stat: "0%",
    statLabel: "of traditional publisher deals are trustless",
    insight: "Every publisher-developer deal runs on trust. Revenue statements. Quarterly reports. Audit rights buried in contracts. The TON smart contract eliminates trust as a variable entirely.",
    color: "#9B59B6",
  },
  {
    title: "The valuation premium",
    stat: "2–3×",
    statLabel: "valuation premium for AI + IP-first studios (AlixPartners 2026)",
    insight: "Studios with certified IP and compliance documentation command 2-3x higher valuations in M&A and investment rounds. The DIP seal IS the documentation investors need.",
    color: "#1e6ff0",
  },
];

const FAQS = [
  { q: "What equity stake does HTML5STUDIO take?", a: "Equity is negotiated individually per studio based on complexity, revenue potential, and platform footprint. Typical range is 3–8% for the compliance journey. This is codified in a simple SAFE note with a revenue-share rider attached to the TON smart contract." },
  { q: "How does the TON smart contract actually work?", a: "When a player makes any payment (Telegram Stars, TON, IAP), the transaction is routed through a pre-deployed FunC smart contract on the TON blockchain. The contract automatically splits the incoming payment into pre-set percentages — studio, investor, HTML5STUDIO — and executes the transfers atomically in the same block. No intermediary. No delay." },
  { q: "What if the game isn't on Telegram / TON?", a: "The TON bridge handles cross-platform revenue. Games earning on Meta, Discord, or YouTube funnel revenue into a treasury contract. Distributions are made from the treasury on a weekly settlement cycle, still on-chain and auditable." },
  { q: "Who are the target investors for this programme?", a: "Three tiers: (1) Gaming VCs — BITKRAFT, Griffin, a16z Speedrun, Makers Fund, Play Ventures. (2) Crypto-native investors familiar with TON/Web3 game mechanics. (3) Angel investors from the Telegram/TON ecosystem who already hold TON and want gaming exposure with real-time yield." },
  { q: "How does DIP certification satisfy investor due diligence?", a: "DIP certification covers IP chain of title, platform SDK compliance, privacy law adherence, and DCF valuation. These are the exact four categories gaming VCs run in their own diligence. A DIP-certified build replaces weeks of due diligence with a single verifiable document." },
  { q: "Can the investor sell their revenue share?", a: "Yes. The revenue-share position is represented as a TON token. It can be transferred, sold on secondary markets, or used as collateral in DeFi protocols. This is a first in the game industry — it creates genuine liquidity for an otherwise illiquid asset class." },
  { q: "What's the story pitch — game dev hell to game publishing heaven?", a: "That's the Ambassador narrative arc. We want studios to tell their real story: the rejection emails, the SDK nightmares, the platform bans. Then we show the transformation — certified, funded, live. User-generated authenticity is more powerful than any marketing campaign." },
];

function StatCard({ disruption }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border p-6"
      style={{ borderColor: `${disruption.color}25`, background: `${disruption.color}06` }}
    >
      <div className="text-4xl font-black font-mono mb-1" style={{ color: disruption.color, textShadow: `0 0 30px ${disruption.color}50` }}>
        {disruption.stat}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">{disruption.statLabel}</div>
      <h3 className="text-sm font-bold text-foreground mb-2">{disruption.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{disruption.insight}</p>
    </motion.div>
  );
}

function InvestorRow({ investor, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/2 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="text-sm font-bold text-foreground">{investor.name}</div>
        <div className="text-[10px] font-mono text-muted-foreground">{investor.aum} AUM</div>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{investor.focus}</td>
      <td className="px-4 py-3 text-xs font-mono text-foreground">{investor.checkRange}</td>
      <td className="px-4 py-3">
        <span className="text-[10px] font-mono px-2 py-1 rounded-full border" style={{
          borderColor: investor.dipCompatible ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)",
          color: investor.dipCompatible ? "#00FF88" : "#888",
          background: investor.dipCompatible ? "rgba(0,255,136,0.06)" : "transparent"
        }}>
          {investor.dipCompatible ? "✓ DIP-ready" : "Partial"}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground leading-snug max-w-xs">{investor.notes}</td>
    </motion.tr>
  );
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl border overflow-hidden transition-all"
      style={{ borderColor: open ? "rgba(30,111,240,0.3)" : "rgba(255,255,255,0.07)" }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground"
        onClick={() => setOpen(!open)}
      >
        <span>{faq.q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0 text-primary" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5" style={{ background: "rgba(30,111,240,0.04)" }}>
          <p className="pt-3">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function AmbassadorProgram() {
  const [activeStage, setActiveStage] = useState(0);
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(30,111,240,0.12) 0%, rgba(238,29,82,0.06) 40%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs font-mono text-primary uppercase tracking-wider">HTML5STUDIO Compliance Ambassador Program</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-foreground">From</span>{" "}
              <span style={{ color: "#EE1D52" }}>Game Dev<br />Hell</span>{" "}
              <span className="text-foreground">to</span>{" "}
              <span style={{ color: "#00FF88" }}>Game<br />Publishing Heaven</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              We pay for your entire compliance journey. You give us a small equity stake.
              We wire your revenue into a TON smart contract that pays investors
              <strong className="text-foreground"> every single transaction</strong> — no trust, no waiting, no sale required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => setAgentOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}>
                <Mic className="w-5 h-5" />
                Apply as Ambassador
              </button>
              <a href="#how-it-works" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border border-white/15 text-foreground hover:border-white/30 transition-all">
                <BookOpen className="w-5 h-5" />
                How It Works
              </a>
            </div>
          </motion.div>

          {/* Live stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {[
              { value: "$0", label: "Upfront cost to studio", color: "#00FF88" },
              { value: "24h", label: "Compliance scan turnaround", color: "#1e6ff0" },
              { value: "100%", label: "Revenue tracked on-chain", color: "#9B59B6" },
              { value: "8", label: "Platforms certified", color: "#FF6B00" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-4 text-center" style={{ borderColor: `${s.color}20`, background: `${s.color}06` }}>
                <div className="text-3xl font-black font-mono" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DISRUPTION STATS ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border border-destructive/20 rounded-full mb-4">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs font-mono text-destructive uppercase tracking-wider">The Market Dislocation We're Exploiting</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">Why This Disrupts Everything</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DISRUPTION_POINTS.map((d) => <StatCard key={d.title} disruption={d} />)}
          </div>
        </div>
      </section>

      {/* ── JOURNEY ──────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight mb-3">The Ambassador Journey</h2>
            <p className="text-muted-foreground text-lg">Six stages. Zero cost to you. A transformation every investor can see.</p>
          </div>

          {/* Stage selector */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
            {JOURNEY_STAGES.map((stage, i) => (
              <button key={i} onClick={() => setActiveStage(i)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                style={{
                  borderColor: activeStage === i ? `${stage.color}50` : "rgba(255,255,255,0.07)",
                  background: activeStage === i ? `${stage.color}10` : "transparent"
                }}>
                <span className="text-2xl">{stage.icon}</span>
                <span className="text-[9px] font-mono text-center leading-tight" style={{ color: activeStage === i ? stage.color : "rgba(255,255,255,0.4)" }}>
                  {stage.label}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeStage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border p-8 text-center"
              style={{ borderColor: `${JOURNEY_STAGES[activeStage].color}30`, background: `${JOURNEY_STAGES[activeStage].color}06` }}>
              <div className="text-6xl mb-4">{JOURNEY_STAGES[activeStage].icon}</div>
              <h3 className="text-2xl font-black mb-3" style={{ color: JOURNEY_STAGES[activeStage].color }}>
                Stage {activeStage + 1}: {JOURNEY_STAGES[activeStage].label}
              </h3>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">{JOURNEY_STAGES[activeStage].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TON SMART CONTRACT MECHANICS ─────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(155,89,182,0.12)", border: "1px solid rgba(155,89,182,0.25)" }}>
              <Coins className="w-3.5 h-3.5" style={{ color: "#9B59B6" }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9B59B6" }}>TON Blockchain Revenue Bridge</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-3">The Trustless Revenue Engine</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on Telegram's TON blockchain. Every player transaction triggers an automatic, immutable, multi-party split — no intermediary, no delay, no disputes.
            </p>
          </div>

          {/* Visual split diagram */}
          <div className="rounded-2xl border p-6 mb-10 text-center"
            style={{ borderColor: "rgba(155,89,182,0.2)", background: "rgba(155,89,182,0.04)" }}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-4">Live Transaction Flow</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-mono">
              <div className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-foreground font-bold">Player Payment<br /><span className="text-xs text-muted-foreground">(Stars / TON / IAP)</span></div>
              <ArrowRight className="w-5 h-5 text-muted-foreground/40" />
              <div className="px-4 py-2 rounded-lg border font-bold" style={{ borderColor: "rgba(155,89,182,0.4)", color: "#9B59B6", background: "rgba(155,89,182,0.08)" }}>
                TON Smart Contract<br /><span className="text-xs opacity-60">Atomic Split</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground/40" />
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 rounded-lg border text-xs font-bold" style={{ borderColor: "rgba(0,255,136,0.3)", color: "#00FF88", background: "rgba(0,255,136,0.06)" }}>Studio<br />~70–80%</div>
                <div className="px-3 py-2 rounded-lg border text-xs font-bold" style={{ borderColor: "rgba(241,196,15,0.3)", color: "#F1C40F", background: "rgba(241,196,15,0.06)" }}>Investor<br />~10–20%</div>
                <div className="px-3 py-2 rounded-lg border text-xs font-bold" style={{ borderColor: "rgba(30,111,240,0.3)", color: "#1e6ff0", background: "rgba(30,111,240,0.06)" }}>HTML5STUDIO<br />~5–10%</div>
              </div>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/40 mt-4">All splits execute atomically in the same TON block · Immutable · Publicly auditable · Transferable</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TON_MECHANICS.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border p-5" style={{ borderColor: "rgba(155,89,182,0.15)", background: "rgba(155,89,182,0.04)" }}>
                  <Icon className="w-5 h-5 mb-3" style={{ color: "#9B59B6" }} />
                  <h3 className="text-sm font-bold text-foreground mb-2">{m.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DIP INVESTOR CHECKLIST ────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(0,255,136,0.10)", border: "1px solid rgba(0,255,136,0.25)" }}>
              <Shield className="w-3.5 h-3.5" style={{ color: "#00FF88" }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#00FF88" }}>DIP Certification vs Investor Due Diligence</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-3">DIP Replaces the Diligence Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every item a gaming VC checks in due diligence is covered by the DIP certification standard. Certified studios skip weeks of friction.
            </p>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(0,255,136,0.15)" }}>
            {DIP_INVESTOR_CHECKLIST.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#00FF88" }} />
                <span className="text-sm text-foreground/85">{item.item}</span>
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>CERTIFIED</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTOR LANDSCAPE ────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(241,196,15,0.10)", border: "1px solid rgba(241,196,15,0.25)" }}>
              <DollarSign className="w-3.5 h-3.5" style={{ color: "#F1C40F" }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#F1C40F" }}>Target Investor Landscape — 2026</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-3">Who We're Bringing Ambassador Studios To</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              $6B+ in dedicated gaming capital. All actively deploying. DIP certification directly addresses their diligence standards.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                    {["Fund", "Focus", "Check Size", "DIP Status", "Why They Care"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-black font-mono uppercase tracking-widest text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INVESTORS.map((inv, i) => <InvestorRow key={inv.name} investor={inv} index={i} />)}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] font-mono text-muted-foreground/40">Source: Peony.ink, GamesBeat, TechCrunch · March 2026 · Combined AUM $6.2B+</p>
          </div>
        </div>
      </section>

      {/* ── THE THREE INVESTOR TIERS ──────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-3">Three Investor Tiers, One Deal Structure</h2>
            <p className="text-muted-foreground text-lg">We package the same certified asset for three distinct capital pools simultaneously.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { tier: "Tier 1", label: "Gaming VCs", color: "#1e6ff0", icon: TrendingUp, desc: "BITKRAFT, Griffin, a16z, Makers, Play Ventures. They get certified IP + compliance proof + verified revenue metrics. No diligence friction.", deal: "Equity SAFE + revenue data room" },
              { tier: "Tier 2", label: "TON / Crypto Investors", color: "#9B59B6", icon: Coins, desc: "Already hold TON. Want gaming yield without CEX exposure. They receive a revenue-share token that earns from every player transaction.", deal: "TON Revenue Token (transferable)" },
              { tier: "Tier 3", label: "Angel Operators", color: "#F1C40F", icon: Users, desc: "Game industry angels — ex-platform PMs, ex-Zynga, ex-King. They know what a DIP seal means. They want to back studios they can help distribute.", deal: "Equity + advisory board + distribution intro" },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.tier} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="rounded-2xl border p-6" style={{ borderColor: `${t.color}25`, background: `${t.color}06` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: t.color }}>{t.tier}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5" style={{ color: t.color }} />
                    <h3 className="text-base font-black text-foreground">{t.label}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
                  <div className="pt-3 border-t border-white/8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">Deal structure</span>
                    <p className="text-xs font-semibold mt-1" style={{ color: t.color }}>{t.deal}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── APPLY CTA ────────────────────────────────────────────────────── */}
      <section id="apply" className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-3xl border p-10 relative overflow-hidden"
            style={{ borderColor: "rgba(30,111,240,0.25)", background: "linear-gradient(135deg, rgba(30,111,240,0.08) 0%, rgba(238,29,82,0.04) 100%)" }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(30,111,240,0.6), rgba(238,29,82,0.4), transparent)" }} />

            <Award className="w-10 h-10 mx-auto mb-4" style={{ color: "#1e6ff0" }} />
            <h2 className="text-3xl font-black mb-3">Tell Us Your Story</h2>
            <p className="text-muted-foreground text-lg mb-2">
              Where are you right now? Platform rejection? SDK nightmare? Build that won't load?
            </p>
            <p className="text-muted-foreground mb-8">
              The more real your story, the more powerful your Ambassador arc. We want the truth — not a pitch deck.
            </p>
            <button onClick={() => setAgentOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}>
              <Mic className="w-5 h-5" />
              Start Your Onboarding Call
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-muted-foreground/50 mt-4 font-mono">No upfront cost · Equity-based · Smart contract revenue share · 24h scan turnaround</p>
          </div>
        </div>
      </section>

      <Footer />

      <OnboardingAgentModal isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}