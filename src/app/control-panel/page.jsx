"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Shield, Lock, FileText, Database, Radio, TrendingUp, ExternalLink, Search, AlertTriangle, ChevronDown, ChevronUp, Globe, Link as LinkIcon, Tag, Copy, CheckCheck, Play, Loader2, Send } from "lucide-react";
import { useRouter } from 'next/navigation';

import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AgentRunReport from '@/components/controlPanel/AgentRunReport';
import DMAOutreachPanel from '@/components/controlPanel/DMAOutreachPanel';

const DIRECTORY_TARGETS = [
  {
    name: "Poki",
    url: "https://poki.com/en/developers",
    category: "Portal / Aggregator",
    notes: "Large HTML5 portal. Browse /en/g/ game listings. Studio names appear in game metadata.",
    priority: "high",
  },
  {
    name: "CrazyGames",
    url: "https://www.crazygames.com/developers",
    category: "Portal / Aggregator",
    notes: "Developer portal lists studios and their games. Good for engine detection via job listings.",
    priority: "high",
  },
  {
    name: "GameDistribution",
    url: "https://gamedistribution.com/games",
    category: "Portal / Aggregator",
    notes: "Game catalog includes publisher/studio attribution. High FBInstant SDK prevalence.",
    priority: "high",
  },
  {
    name: "itch.io — HTML5 Games",
    url: "https://itch.io/games/html5",
    category: "Indie / Self-Hosted",
    notes: "Public listing of HTML5 games. Filter by top-rated or recent. Studio page links directly.",
    priority: "medium",
  },
  {
    name: "Meta Instant Games Directory",
    url: "https://www.facebook.com/games/",
    category: "Platform Native",
    notes: "Facebook Instant Games catalog. All studios here are subject to the Sept 30 deadline.",
    priority: "critical",
  },
  {
    name: "Discord Activities Directory",
    url: "https://discord.com/application-directory",
    category: "Platform Native",
    notes: "Lists Activities by category. Studios using old monolithic scope are broken for new users now.",
    priority: "high",
  },
  {
    name: "TikTok Mini-Games Showcase",
    url: "https://www.tiktok.com/gamedev/",
    category: "Platform Native",
    notes: "TikTok developer showcase. Smaller catalog but high-growth platform with touch-action issues.",
    priority: "medium",
  },
  {
    name: "Telegram Mini Apps Catalog",
    url: "https://t.me/gamebot",
    category: "Platform Native",
    notes: "Telegram bot catalog for Mini Apps. SDK 6.x games are live and silently failing payments.",
    priority: "high",
  },
  {
    name: "Y8 Games",
    url: "https://www.y8.com/html5",
    category: "Portal / Aggregator",
    notes: "Long-established HTML5 portal. Many legacy Unity builds — high probability of pre-2022 SDKs.",
    priority: "medium",
  },
  {
    name: "Kongregate / Kartridge",
    url: "https://www.kongregate.com/html5-games",
    category: "Portal / Aggregator",
    notes: "Archive of Flash-era games now ported to HTML5. Very high legacy SDK risk cohort.",
    priority: "medium",
  },
  {
    name: "Armor Games",
    url: "https://armorgames.com/html5-games",
    category: "Portal / Aggregator",
    notes: "Mid-tier portal with studio attribution. Good source for mid-size indie studios.",
    priority: "low",
  },
  {
    name: "Newgrounds",
    url: "https://www.newgrounds.com/games/",
    category: "Community / Indie",
    notes: "Community-driven. Studios self-identify. Useful for solo devs and small indie cohort.",
    priority: "low",
  },
];

const PRIORITY_CONFIG = {
  critical: { label: "CRITICAL", color: "#EE1D52", bg: "rgba(238,29,82,0.12)" },
  high:     { label: "HIGH",     color: "#FF6B00", bg: "rgba(255,107,0,0.12)"  },
  medium:   { label: "MEDIUM",   color: "#1e6ff0", bg: "rgba(30,111,240,0.12)" },
  low:      { label: "LOW",      color: "#888",    bg: "rgba(136,136,136,0.1)" },
};

function DirectoryTargetsPanel() {
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState("all");
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);

  const runAgent = async (priorityFilter = null) => {
    setRunning(true);
    setRunResult(null);
    const payload = priorityFilter ? { priority_filter: priorityFilter } : {};
    const res = await base44.functions.invoke('studioIntelligenceAgent', payload);
    setRunResult(res.data);
    setRunning(false);
  };

  const filtered = filter === "all" ? DIRECTORY_TARGETS : DIRECTORY_TARGETS.filter(d => d.priority === filter);

  const copyUrl = (url, name) => {
    navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  DIRECTORY_TARGETS.forEach(d => counts[d.priority]++);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
          <div key={key} className="rounded-xl border p-3 text-center" style={{ borderColor: `${cfg.color}20`, background: `${cfg.color}06` }}>
            <div className="text-xl font-black font-mono mb-0.5" style={{ color: cfg.color }}>{counts[key]}</div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{cfg.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { id: "all", label: `All (${DIRECTORY_TARGETS.length})` },
          ...Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => ({ id: key, label: `${cfg.label} (${counts[key]})`, color: cfg.color }))
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="text-[10px] font-mono px-3 py-1 rounded-full border transition-all"
            style={{
              borderColor: filter === f.id ? "rgba(30,111,240,0.5)" : "rgba(255,255,255,0.1)",
              background: filter === f.id ? "rgba(30,111,240,0.12)" : "transparent",
              color: filter === f.id ? "#1e6ff0" : "rgba(255,255,255,0.5)",
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((dir) => {
          const cfg = PRIORITY_CONFIG[dir.priority];
          return (
            <div key={dir.name} className="rounded-xl border p-4"
              style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-foreground">{dir.name}</span>
                    <span className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/50 flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{dir.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{dir.notes}</p>
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                    <a href={dir.url} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-primary/70 hover:text-primary truncate transition-colors">{dir.url}</a>
                  </div>
                </div>
                <button onClick={() => copyUrl(dir.url, dir.name)}
                  className="shrink-0 p-2 rounded-lg border border-white/8 hover:bg-white/5 transition-all"
                  title="Copy URL">
                  {copied === dir.name
                    ? <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                    : <Copy className="w-3.5 h-3.5 text-muted-foreground/40" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Run Agent Controls */}
      <div className="mt-6 rounded-xl border p-5" style={{ borderColor: "rgba(30,111,240,0.25)", background: "rgba(30,111,240,0.05)" }}>
        <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Run Research Agent</p>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Results land in <strong className="text-foreground">Studio Submissions</strong> with <span className="font-mono">source: research_agent</span> — not pushed to the public directory until reviewed.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => runAgent(null)} disabled={running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all"
            style={{ background: running ? "rgba(30,111,240,0.1)" : "#1e6ff0", color: running ? "rgba(255,255,255,0.4)" : "#fff" }}>
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? "Running..." : "Run Top 3 Targets"}
          </button>
          <button onClick={() => runAgent("critical")} disabled={running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm border transition-all hover:bg-white/5"
            style={{ borderColor: "rgba(238,29,82,0.4)", color: "#EE1D52" }}>
            <Play className="w-4 h-4" />
            Critical Only
          </button>
          <button onClick={() => runAgent("high")} disabled={running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm border transition-all hover:bg-white/5"
            style={{ borderColor: "rgba(255,107,0,0.4)", color: "#FF6B00" }}>
            <Play className="w-4 h-4" />
            High Priority Only
          </button>
        </div>
        {runResult && <AgentRunReport result={runResult} />}
      </div>
    </div>
  );
}

const RISK_COLORS = {
  "LOW RISK": "#00FF88",
  "MODERATE RISK": "#F1C40F",
  "HIGH RISK": "#FF6B00",
  "CRITICAL EXPOSURE": "#EE1D52",
};

function SubmissionsPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    base44.entities.StudioSubmission.list('-created_date', 100).then(data => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? submissions
    : filter === "listing" ? submissions.filter(s => s.listing_requested)
    : filter === "ambassador" ? submissions.filter(s => s.ambassador_interested)
    : filter === "high_risk" ? submissions.filter(s => s.risk_score >= 40)
    : submissions;

  if (loading) return <div className="py-8 text-center text-muted-foreground text-sm">Loading submissions...</div>;
  if (!submissions.length) return (
    <div className="py-8 text-center rounded-xl border border-white/8 bg-white/2">
      <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
      <p className="text-muted-foreground text-sm">No submissions yet. Share the Risk Assessor to start collecting data.</p>
    </div>
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: "all", label: `All (${submissions.length})` },
          { id: "listing", label: `Listing Requested (${submissions.filter(s => s.listing_requested).length})` },
          { id: "ambassador", label: `Ambassador Interest (${submissions.filter(s => s.ambassador_interested).length})` },
          { id: "high_risk", label: `High Risk (${submissions.filter(s => s.risk_score >= 40).length})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="text-[10px] font-mono px-3 py-1 rounded-full border transition-all"
            style={{
              borderColor: filter === f.id ? "rgba(30,111,240,0.5)" : "rgba(255,255,255,0.1)",
              background: filter === f.id ? "rgba(30,111,240,0.12)" : "transparent",
              color: filter === f.id ? "#1e6ff0" : "rgba(255,255,255,0.5)",
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((sub, i) => {
          const color = RISK_COLORS[sub.risk_label] || "#888";
          const isOpen = expanded === sub.id;
          return (
            <div key={sub.id} className="rounded-xl border overflow-hidden"
              style={{ borderColor: isOpen ? `${color}30` : "rgba(255,255,255,0.07)", background: isOpen ? `${color}05` : "rgba(255,255,255,0.02)" }}>
              <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setExpanded(isOpen ? null : sub.id)}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono shrink-0"
                  style={{ background: `${color}15`, color }}>
                  {sub.risk_score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{sub.studio_name || "Anonymous Studio"}</span>
                    {sub.game_title && <span className="text-xs text-muted-foreground">· {sub.game_title}</span>}
                    {sub.listing_requested && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary">LISTING REQ</span>}
                    {sub.ambassador_interested && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(155,89,182,0.15)", color: "#9B59B6" }}>AMBASSADOR</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] font-mono" style={{ color }}>{sub.risk_label || "UNSCORED"}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/40">{sub.source}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/40">{new Date(sub.created_date).toLocaleDateString()}</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2 text-xs text-muted-foreground">
                  {sub.contact_email && <p><span className="text-foreground/60">Email:</span> {sub.contact_email}</p>}
                  {sub.website && <p><span className="text-foreground/60">Website:</span> <a href={sub.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{sub.website}</a></p>}
                  {sub.platforms?.length > 0 && <p><span className="text-foreground/60">Platforms:</span> {sub.platforms.join(", ")}</p>}
                  {sub.engine && <p><span className="text-foreground/60">Engine:</span> {sub.engine}</p>}
                  {sub.risk_flags?.length > 0 && (
                    <div>
                      <p className="text-foreground/60 mb-1">Risk Flags ({sub.risk_flags.length}):</p>
                      <div className="space-y-1">
                        {sub.risk_flags.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: { critical: "#EE1D52", high: "#FF6B00", medium: "#1e6ff0" }[f.severity] }} />
                            <span>{f.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ControlPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resources");
  const navigate = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthed = await base44.auth.isAuthenticated();
        if (!isAuthed) {
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        const currentUser = await base44.auth.me();
        if (!currentUser || currentUser.role !== 'admin') {
          navigate('/');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const internalResources = [
    {
      title: "TON Blockchain & Telegram Stars Briefing",
      description: "Board-level briefing on TON transaction mechanics, costs, Telegram Stars integration, and investor structure",
      href: "/internal/ton-briefing",
      icon: TrendingUp,
      color: "#9B59B6",
      tags: ["Board Use Only", "March 2026"]
    },
    {
      title: "Studio Intelligence Registry",
      description: "Complete database of WebGL game studios with compliance risk flags and platform status",
      href: "/StudioDirectory",
      icon: Database,
      color: "#1e6ff0",
      tags: ["Live Data", "Auto-Updated"]
    },
    {
      title: "Certification Registry",
      description: "Public-facing WGL-CERT certification database with DIP seals and audit trails",
      href: "/Registry",
      icon: Shield,
      color: "#00FF88",
      tags: ["Public", "Investor-Facing"]
    },
    {
      title: "Intelligence Centre",
      description: "Technical documentation library tracking 40+ platform API sources and compliance requirements",
      href: "/IntelligenceCentre",
      icon: Radio,
      color: "#FF6B00",
      tags: ["Developer Resource", "Live Updates"]
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full mb-6">
              <Lock className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs font-mono text-destructive uppercase tracking-wider">Admin Access Only</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Control Panel
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, <span className="text-foreground font-semibold">{user.full_name}</span>. 
              Internal resources, board briefings, and operational dashboards.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          >
            {[
              { label: "Internal Docs", value: "4", color: "#1e6ff0" },
              { label: "Board Briefings", value: "1", color: "#9B59B6" },
              { label: "Live Registries", value: "2", color: "#00FF88" },
              { label: "Access Level", value: "ADMIN", color: "#EE1D52" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 text-center"
                style={{ borderColor: `${stat.color}20`, background: `${stat.color}06` }}
              >
                <div className="text-2xl font-black font-mono mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 rounded-xl border border-white/8 bg-white/2 w-fit">
            {[
              { id: "resources", label: "Internal Resources", icon: FileText },
              { id: "submissions", label: "Studio Submissions", icon: Search },
              { id: "targets", label: "Directory Targets", icon: Globe },
              { id: "outreach", label: "DMA Outreach", icon: Send },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: activeTab === tab.id ? "rgba(30,111,240,0.15)" : "transparent",
                    color: activeTab === tab.id ? "#1e6ff0" : "rgba(255,255,255,0.4)",
                    border: activeTab === tab.id ? "1px solid rgba(30,111,240,0.3)" : "1px solid transparent",
                  }}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Studio Submissions Panel */}
          {activeTab === "submissions" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black">Studio Discovery Submissions</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-2xl">
                Self-submitted studio profiles from the Risk Assessor wizard. Each entry includes the full risk score, flags, and whether the studio requested a directory listing or expressed interest in the Ambassador program.
              </p>
              <SubmissionsPanel />
            </motion.div>
          )}

          {/* DMA Outreach Panel */}
          {activeTab === "outreach" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black">DMA Article 7 Outreach Agent</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-2xl">
                The agent contacts game studios on behalf of the <strong className="text-foreground">HTML5STUDIO Research Team</strong>, 
                posing as researchers conducting an industry benchmarking survey on EU DMA Article 7 compliance readiness. 
                Each email is personalised, professional, and ends with a soft CTA for a complimentary audit.
              </p>
              <DMAOutreachPanel />
            </motion.div>
          )}

          {/* Directory Targets Panel */}
          {activeTab === "targets" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black">Directory Targets</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-2xl">
                Curated list of game portals and platform directories for the research agent to visit. Results will appear in Studio Submissions — not pushed to the public directory until reviewed.
              </p>
              <DirectoryTargetsPanel />
            </motion.div>
          )}

          {/* Internal Resources Grid */}
          {activeTab === "resources" && <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Internal Resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {internalResources.map((resource, i) => {
                const Icon = resource.icon;
                return (
                  <motion.a
                    key={i}
                    href={resource.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="group rounded-2xl border p-6 transition-all hover:border-opacity-50"
                    style={{ borderColor: `${resource.color}25`, background: `${resource.color}06` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="rounded-lg p-2.5" style={{ background: `${resource.color}15` }}>
                        <Icon className="w-5 h-5" style={{ color: resource.color }} />
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:opacity-80 transition-opacity">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: `${resource.color}30`,
                            color: resource.color,
                            background: `${resource.color}08`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>}

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,255,136,0.2)", background: "rgba(0,255,136,0.04)" }}
          >
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 animate-pulse" style={{ color: "#00FF88" }} />
              System Status
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Platform Monitoring", status: "Online", count: "40+ sources" },
                { label: "Studio Intelligence Agent", status: "Active", count: "Auto-refresh 24h" },
                { label: "Certification Registry", status: "Operational", count: "Public API live" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 animate-pulse" style={{ background: "#00FF88" }} />
                  <div>
                    <div className="text-sm font-bold text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.status} · {item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/40 font-mono">
              Authenticated as {user.email} · Admin Role · Session Secured
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}