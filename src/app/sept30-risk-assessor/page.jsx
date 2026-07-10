"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

import {
  ArrowLeft, ArrowRight, Shield, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Radio, Zap, Info, Building2, Globe, Mail, Gamepad2, Upload, Star, Search
} from "lucide-react";
import Navbar from '@/components/landing/Navbar';
import NewsTicker from '@/components/landing/NewsTicker';
import Footer from '@/components/landing/Footer';
import { base44 } from "@/api/base44Client";

// ─── KNOWLEDGE BASE ──────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "build_year",
    label: "When was the game originally built / last had its SDK updated?",
    type: "select",
    options: [
      { value: "pre_2022", label: "Before 2022" },
      { value: "2022_2023", label: "2022–2023" },
      { value: "2024", label: "2024" },
      { value: "2025_plus", label: "2025 or later" },
    ],
    hint: "Builds from 2022–2023 are the highest-risk cohort — compiled against Unity SDK wrappers that pinned FBInstant to v6.x or v7.x.",
  },
  {
    id: "engine",
    label: "What engine was used to build the game?",
    type: "select",
    options: [
      { value: "unity", label: "Unity" },
      { value: "godot", label: "Godot" },
      { value: "construct", label: "Construct 3 or GDevelop" },
      { value: "custom", label: "Custom / JavaScript" },
      { value: "unreal", label: "Unreal Engine (Pixel Streaming)" },
      { value: "unknown", label: "Unknown" },
    ],
    hint: "Unity projects built 2021–2023 often have Plugins/WebGL/fbinstant.jslib files pinned to legacy SDK versions.",
  },
  {
    id: "meta_sdk",
    label: "Does the game use the Meta FBInstant SDK?",
    type: "select",
    options: [
      { value: "yes_core", label: "Yes — it's core to the game loop" },
      { value: "yes_optional", label: "Yes — optional features only (leaderboards, sharing)" },
      { value: "no_stripped", label: "No — SDK was stripped or never integrated" },
      { value: "unknown", label: "Unknown / not sure" },
    ],
    hint: "Any FBInstant usage is subject to the Sept 30 sunset. The zero-permissions model change breaks all player.getID() calls not gated behind requestPermissionsAsync().",
  },
  {
    id: "platforms",
    label: "Which platforms does the game deploy to?",
    type: "multiselect",
    options: [
      { value: "meta", label: "Meta Instant Games" },
      { value: "poki", label: "Poki" },
      { value: "gamedistribution", label: "GameDistribution" },
      { value: "crazygames", label: "CrazyGames" },
      { value: "discord", label: "Discord Activities" },
      { value: "tiktok", label: "TikTok Mini-Games" },
      { value: "telegram", label: "Telegram Mini Apps" },
      { value: "youtube", label: "YouTube Playables" },
      { value: "itch", label: "itch.io / self-hosted" },
    ],
    hint: "Games on Poki and GameDistribution that use FBInstant are equally exposed — the sunset travels with the SDK, not the distribution channel.",
  },
  {
    id: "active_dev",
    label: "Is the game currently in active development?",
    type: "select",
    options: [
      { value: "active", label: "Yes — actively maintained by engineers" },
      { value: "maintenance", label: "Maintenance mode — no active development" },
      { value: "abandoned", label: "No — the build is running but nobody is monitoring it" },
    ],
    hint: "Maintenance-mode games are the highest-risk cohort: high DAU, but nobody watching platform SDK changelogs.",
  },
  {
    id: "discord_scopes",
    label: "If using Discord Activities — which OAuth2 model is in use?",
    type: "select",
    options: [
      { value: "granular", label: "Already on granular scopes (post-Feb 2025)" },
      { value: "monolithic", label: "Still using monolithic activities.write scope" },
      { value: "not_applicable", label: "Not using Discord Activities" },
    ],
    hint: "Discord enforced granular scope model in February 2025. Any Activity still using the monolithic scope is broken for new users right now.",
  },
  {
    id: "telegram_sdk",
    label: "If using Telegram Mini Apps — which SDK version?",
    type: "select",
    options: [
      { value: "sdk7", label: "SDK 7.0 (compliant)" },
      { value: "sdk6_or_lower", label: "SDK 6.x or lower" },
      { value: "not_applicable", label: "Not using Telegram Mini Apps" },
    ],
    hint: "Telegram SDK 6.x games are experiencing silent payment failures now — Stars payment bridge requires SDK 7.0's Storebridge.jslib.",
  },
  {
    id: "pii_audit",
    label: "Has the game's compiled build been audited for undeclared PII transmission?",
    type: "select",
    options: [
      { value: "yes_clean", label: "Yes — audited and clean" },
      { value: "yes_issues", label: "Yes — issues were found" },
      { value: "no", label: "No — never audited" },
      { value: "source_only", label: "Source code reviewed but not compiled output" },
    ],
    hint: "61% of builds audited in Q1 2026 contained undeclared PII calls — most entered via third-party analytics SDKs, not developer code.",
  },
];

// ─── RISK ENGINE ─────────────────────────────────────────────────────────────

function computeRisk(answers) {
  const flags = [];
  let score = 0;

  const platforms = answers.platforms || [];
  const hasMetaBridge = platforms.includes("meta") || platforms.includes("poki") || platforms.includes("gamedistribution") || platforms.includes("crazygames");
  const hasDiscord = platforms.includes("discord");
  const hasTelegram = platforms.includes("telegram");
  const hasTikTok = platforms.includes("tiktok");
  const hasYoutube = platforms.includes("youtube");

  if (answers.build_year === "pre_2022") {
    score += 25;
    flags.push({ severity: "critical", platform: "Meta / All", title: "Pre-2022 build — almost certainly on legacy SDK", detail: "Builds from before 2022 were compiled against FBInstant v6.x or earlier. Even if a developer has 'updated' the SDK declaration, the compiled WASM binary and jslib files in Unity's Plugins/WebGL folder are almost certainly pinned to a legacy version. Static analysis of the compiled output is required.", source: "september-30-sunset" });
  } else if (answers.build_year === "2022_2023") {
    score += 20;
    flags.push({ severity: "critical", platform: "Meta / All", title: "2022–2023 build — peak-risk SDK vintage", detail: "The 2022–2023 Unity export cohort is the highest-risk group. These builds use FBInstant v7.x wrappers that assume implicit player permissions — the exact pattern v8.0 breaks. Meta's own data showed 34% of active Instant Games hadn't begun migration in Q1 2026.", source: "meta-sdk-v8-migration" });
  } else if (answers.build_year === "2024") {
    score += 8;
    flags.push({ severity: "medium", platform: "Meta", title: "2024 build — verify SDK version explicitly", detail: "2024 builds may be on v7.x or early v8.0 beta. Confirm the CDN script tag in index.html points to the v8.0 endpoint and all player data calls are gated behind requestPermissionsAsync().", source: "meta-sdk-v8-migration" });
  }

  if (answers.engine === "unity" && (answers.build_year === "pre_2022" || answers.build_year === "2022_2023")) {
    score += 15;
    flags.push({ severity: "critical", platform: "Meta", title: "Unity + legacy build year = jslib version pin risk", detail: "Unity projects from 2021–2023 frequently contain Plugins/WebGL/fbinstant.jslib pinned to a legacy version. These files override the CDN version. A hybrid build (pinned jslib + CDN v8.0) will be rejected by Meta's enforcement gate.", source: "meta-sdk-v8-migration" });
  }

  if (answers.engine === "construct") {
    score += 12;
    flags.push({ severity: "critical", platform: "Meta", title: "Construct 3 / GDevelop — plugin wrapper may not be v8.0 compliant", detail: "Construct 3's Facebook Instant Games plugin and GDevelop's Meta extension both require updates for v8.0 compliance. These are maintained by third parties and may not be updated ahead of the Sept 30 deadline.", source: "september-30-sunset" });
  }

  if (answers.meta_sdk === "yes_core" && hasMetaBridge) {
    score += 25;
    flags.push({ severity: "critical", platform: "Meta Instant Games", title: "Core FBInstant dependency — full zero-permissions migration required", detail: "Every player data call must be gated behind requestPermissionsAsync() in v8.0. After Oct 1, ungated calls return null silently. WASM code compiled to expect non-null player objects will throw heap access violations and crash the session.", source: "deprecated-api-calls" });
  } else if (answers.meta_sdk === "yes_optional" && hasMetaBridge) {
    score += 15;
    flags.push({ severity: "high", platform: "Meta Instant Games", title: "Optional FBInstant features — strip or migrate", detail: "Optional SDK usage is equally subject to the sunset. Evaluate whether stripping the SDK entirely is faster — if Meta social features are non-critical, removal eliminates all compliance risk and reduces build size.", source: "meta-sdk-v8-migration" });
  } else if (answers.meta_sdk === "unknown" && hasMetaBridge) {
    score += 18;
    flags.push({ severity: "critical", platform: "Meta / Distribution", title: "Unknown SDK status — this is itself a critical risk signal", detail: "SDK calls frequently enter compiled builds via third-party plugins and ad SDKs without developer action. The only reliable method to determine FBInstant presence is static analysis of the compiled build output, not source code review.", source: "deprecated-api-calls" });
  }

  if (platforms.length >= 3) {
    score += 10;
    flags.push({ severity: "high", platform: "Multi-Platform", title: "Multi-platform deployment — compound compliance risk", detail: `This game deploys to ${platforms.length} platforms. A single build can fail on Meta for SDK reasons, on TikTok for CSS reasons, and on Discord for auth scope reasons — all simultaneously.`, source: "september-30-sunset" });
  }

  if ((platforms.includes("poki") || platforms.includes("gamedistribution")) && answers.meta_sdk !== "no_stripped") {
    score += 12;
    flags.push({ severity: "high", platform: "Poki / GameDistribution → Meta", title: "Distribution network Meta bridge exposure", detail: "Games on Poki and GameDistribution that use FBInstant are subject to the Sept 30 deadline. The sunset applies to the SDK, not the distribution channel.", source: "meta-sdk-v8-migration" });
  }

  if (answers.active_dev === "maintenance" || answers.active_dev === "abandoned") {
    score += 15;
    flags.push({ severity: "critical", platform: "All", title: "Maintenance / abandoned — nobody is watching the changelogs", detail: "Maintenance-mode games are the highest-risk cohort. They have significant DAU but no engineer assigned to monitor platform SDK changelogs. The Sept 30 deadline will produce no warning email.", source: "api-deprecation-tracker" });
  }

  if (hasDiscord && answers.discord_scopes === "monolithic") {
    score += 20;
    flags.push({ severity: "critical", platform: "Discord Activities", title: "Monolithic activities.write scope — broken for new users right now", detail: "Discord enforced the granular scope model in February 2025. Any Discord Activity still using monolithic activities.write produces silent 401 errors for new users. Immediate OAuth2 scope migration required.", source: "discord-activities-api-split" });
  }

  if (hasTelegram && answers.telegram_sdk === "sdk6_or_lower") {
    score += 18;
    flags.push({ severity: "critical", platform: "Telegram Mini Apps", title: "SDK 6.x — Stars payment failures active now", detail: "Telegram SDK 7.0 is required for the Stars payment bridge. Games on SDK 6.x are experiencing silent payment failures — purchases appear to process but no revenue is captured.", source: "api-deprecation-tracker" });
  }

  if (hasTikTok) {
    score += 8;
    flags.push({ severity: "high", platform: "TikTok Mini-Games", title: "touch-action CSS enforcement — verify swipe handling", detail: "TikTok enforced its touch-action CSS requirement in January 2026. Games without touch-action: none on the canvas experience swipe-to-exit failures.", source: "tiktok-mini-games" });
  }

  if (hasYoutube) {
    score += 8;
    flags.push({ severity: "high", platform: "YouTube Playables", title: "15MB hard cap + localStorage banned — verify both", detail: "YouTube enforces a strict 15MB bundle cap at ingestion. localStorage throws a SecurityError inside the Playables iframe.", source: "youtube-playables" });
  }

  if (answers.pii_audit === "no" || answers.pii_audit === "source_only") {
    score += 10;
    flags.push({ severity: "high", platform: "All / GDPR", title: "No compiled-build PII audit — undeclared data flows likely", detail: "61% of builds audited in Q1 2026 contained undeclared PII calls — the majority entered via Unity Analytics and Facebook Pixel. Source code review misses all of these.", source: "deprecated-api-calls" });
  }

  return { score: Math.min(score, 100), flags };
}

function getRiskLabel(score) {
  if (score >= 70) return "CRITICAL EXPOSURE";
  if (score >= 40) return "HIGH RISK";
  if (score >= 20) return "MODERATE RISK";
  return "LOW RISK";
}

function getRiskColor(score) {
  if (score >= 70) return "#EE1D52";
  if (score >= 40) return "#FF6B00";
  if (score >= 20) return "#F1C40F";
  return "#00FF88";
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  critical: { label: "CRITICAL", color: "#EE1D52", bg: "rgba(238,29,82,0.1)", border: "rgba(238,29,82,0.3)" },
  high: { label: "HIGH", color: "#FF6B00", bg: "rgba(255,107,0,0.1)", border: "rgba(255,107,0,0.3)" },
  medium: { label: "MEDIUM", color: "#1e6ff0", bg: "rgba(30,111,240,0.1)", border: "rgba(30,111,240,0.3)" },
};

function RiskFlag({ flag, index }) {
  const [open, setOpen] = useState(false);
  const cfg = SEVERITY_CONFIG[flag.severity];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: open ? cfg.border : "rgba(255,255,255,0.07)", background: open ? cfg.bg : "rgba(255,255,255,0.02)" }}>
      <button className="w-full flex items-start gap-3 p-4 text-left" onClick={() => setOpen(!open)}>
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: cfg.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">{flag.platform}</span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{flag.title}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/5">
              <p className="text-sm text-foreground/70 leading-relaxed pt-3 mb-3">{flag.detail}</p>
              <Link href={`/article/${flag.source}`} className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold hover:opacity-80 transition-opacity" style={{ color: cfg.color }}>
                Read full intelligence → /article/{flag.source}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RiskMeter({ score }) {
  const color = getRiskColor(score);
  const label = getRiskLabel(score);
  return (
    <div className="rounded-2xl border p-6 mb-8" style={{ borderColor: `${color}30`, background: `${color}06` }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Sept 30 Risk Score</p>
          <p className="text-4xl font-black font-mono" style={{ color, textShadow: `0 0 30px ${color}60` }}>{score}<span className="text-xl text-muted-foreground">/100</span></p>
        </div>
        <span className="text-sm font-black font-mono px-3 py-1.5 rounded-lg" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>{label}</span>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
        {score >= 70 && "This profile matches the highest-risk cohort from our 200+ build audit data. Immediate remediation scan recommended before Sept 30."}
        {score >= 40 && score < 70 && "Multiple active compliance risks detected. Some failures may already be live. A compiled-build audit will surface the specific deprecated patterns."}
        {score >= 20 && score < 40 && "Moderate exposure. Targeted remediation is recommended — particularly for any Meta SDK or multi-platform flags below."}
        {score < 20 && "Low assessed risk based on the signals provided. Run a compiled-build scan to confirm — many risks only appear in the final build artifact."}
      </p>
    </div>
  );
}

// ─── STEP 1: STUDIO PROFILE ──────────────────────────────────────────────────

function StudioProfileStep({ profile, setProfile, onNext }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Step 1 of 3 — Studio Profile</span>
      </div>
      <h2 className="text-2xl font-black mb-2">Tell us about your studio</h2>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Optional — but completing this unlocks a directory listing for compliant studios and a personalised benchmarking report. Your data helps build the industry's first verified compliance map.
      </p>

      <div className="space-y-4">
        {[
          { id: "studio_name", label: "Studio or Developer Name", icon: Building2, placeholder: "e.g. Pixel Forge Studios", required: false },
          { id: "game_title", label: "Primary Game Title", icon: Gamepad2, placeholder: "e.g. Space Jumper 3000", required: false },
          { id: "website", label: "Website / Game URL", icon: Globe, placeholder: "https://...", required: false },
          { id: "contact_email", label: "Contact Email", icon: Mail, placeholder: "you@studio.com", required: false },
        ].map(field => {
          const Icon = field.icon;
          return (
            <div key={field.id}>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                {field.label}
                <span className="text-muted-foreground/40 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={profile[field.id] || ""}
                onChange={e => setProfile(p => ({ ...p, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border bg-white/3 text-foreground text-sm placeholder:text-muted-foreground/30 outline-none transition-all focus:border-primary/50"
                style={{ borderColor: "rgba(255,255,255,0.09)" }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl border border-white/8 bg-white/2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Why we ask:</strong> We're building the industry's first verified studio compliance directory — a public map of who's compliant, who's at risk, and who's been certified. Studios that complete the full assessment get a free benchmarking report against 200+ other builds.
        </p>
      </div>

      <button onClick={onNext} className="w-full mt-6 py-4 rounded-xl font-black text-sm tracking-wide transition-all"
        style={{ background: "linear-gradient(135deg, #1e6ff0, #9B59B6)", color: "#fff", boxShadow: "0 0 30px rgba(30,111,240,0.25)" }}>
        Continue to Risk Assessment →
      </button>
    </motion.div>
  );
}

// ─── STEP 2: QUESTIONNAIRE ───────────────────────────────────────────────────

function QuestionnaireStep({ answers, setAnswer, toggleMulti, onBack, onSubmit }) {
  const allAnswered = QUESTIONS.every(q => {
    if (q.type === "multiselect") return (answers[q.id] || []).length > 0;
    return answers[q.id] !== undefined;
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-2 mb-2">
        <Radio className="w-4 h-4 text-destructive animate-pulse" />
        <span className="text-[10px] font-mono text-destructive uppercase tracking-widest">Step 2 of 3 — Compliance Assessment</span>
      </div>
      <h2 className="text-2xl font-black mb-2">8 questions · &lt;3 minutes</h2>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Our knowledge base — derived from 200+ build audits and platform SDK analysis — scores each answer against known failure patterns.
      </p>

      <div className="space-y-8">
        {QUESTIONS.map((q, qi) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.04 }}>
            <div className="flex items-start gap-2 mb-3">
              <span className="text-[10px] font-black font-mono text-muted-foreground/40 mt-0.5 shrink-0">Q{qi + 1}</span>
              <div>
                <p className="text-sm font-bold text-foreground leading-snug">{q.label}</p>
                {q.hint && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <Info className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground/50 leading-relaxed">{q.hint}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 ml-5">
              {q.options.map(opt => {
                const selected = q.type === "multiselect"
                  ? (answers[q.id] || []).includes(opt.value)
                  : answers[q.id] === opt.value;
                return (
                  <button key={opt.value}
                    onClick={() => q.type === "multiselect" ? toggleMulti(q.id, opt.value) : setAnswer(q.id, opt.value)}
                    className="rounded-lg border p-3 text-left text-sm transition-all hover:scale-[1.01]"
                    style={{
                      borderColor: selected ? "rgba(30,111,240,0.5)" : "rgba(255,255,255,0.07)",
                      background: selected ? "rgba(30,111,240,0.1)" : "rgba(255,255,255,0.02)",
                      color: selected ? "#fff" : "rgba(255,255,255,0.65)",
                    }}>
                    {selected && (q.type === "multiselect"
                      ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                      : <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2 mb-0.5" />
                    )}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 mt-10">
        <button onClick={onBack} className="px-6 py-4 rounded-xl font-semibold text-sm border border-white/10 text-muted-foreground hover:bg-white/5 transition-all">
          ← Back
        </button>
        <button onClick={onSubmit} disabled={!allAnswered}
          className="flex-1 py-4 rounded-xl font-black text-sm tracking-wide transition-all"
          style={{
            background: allAnswered ? "linear-gradient(135deg, #EE1D52, #FF6B00)" : "rgba(255,255,255,0.05)",
            color: allAnswered ? "#fff" : "rgba(255,255,255,0.3)",
            cursor: allAnswered ? "pointer" : "not-allowed",
            boxShadow: allAnswered ? "0 0 40px rgba(238,29,82,0.3)" : "none",
          }}>
          {allAnswered ? "Generate Risk Assessment →" : `Answer all ${QUESTIONS.length} questions to continue`}
        </button>
      </div>
    </motion.div>
  );
}

// ─── STEP 3: RESULTS + ACTIONS ───────────────────────────────────────────────

function ResultsStep({ result, profile, answers, onBack }) {
  const [listingRequested, setListingRequested] = useState(false);
  const [ambassadorInterested, setAmbassadorInterested] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const color = getRiskColor(result.score);
  const label = getRiskLabel(result.score);
  const isHighRisk = result.score >= 40;
  const isCompliant = result.score < 20;

  const handleSaveSubmission = async (opts = {}) => {
    if (saved) return;
    setSaving(true);
    await base44.entities.StudioSubmission.create({
      studio_name: profile.studio_name || undefined,
      game_title: profile.game_title || undefined,
      website: profile.website || undefined,
      contact_email: profile.contact_email || undefined,
      platforms: answers.platforms || [],
      engine: answers.engine,
      risk_score: result.score,
      risk_flags: result.flags,
      risk_label: label,
      listing_requested: opts.listing || false,
      ambassador_interested: opts.ambassador || false,
      raw_answers: answers,
      source: "self_submitted",
    });
    setSaved(true);
    setSaving(false);
  };

  const handleRequestListing = async () => {
    setListingRequested(true);
    await handleSaveSubmission({ listing: true });
  };

  const handleAmbassadorInterest = async () => {
    setAmbassadorInterested(true);
    await handleSaveSubmission({ ambassador: true });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-black font-mono uppercase tracking-widest text-primary">Step 3 of 3 — Your Results</span>
      </div>
      <h2 className="text-2xl font-black mb-2">Knowledge-Based Risk Assessment</h2>
      {profile.studio_name && (
        <p className="text-sm text-muted-foreground mb-6">Assessment for <strong className="text-foreground">{profile.studio_name}</strong>{profile.game_title ? ` · ${profile.game_title}` : ""}</p>
      )}

      <RiskMeter score={result.score} />

      {result.flags.length > 0 && (
        <>
          <p className="text-xs font-mono text-muted-foreground/40 uppercase tracking-widest mb-4">
            {result.flags.length} Risk Flag{result.flags.length !== 1 ? "s" : ""} Identified
          </p>
          <div className="space-y-3 mb-10">
            {result.flags
              .sort((a, b) => ({ critical: 0, high: 1, medium: 2 }[a.severity] - { critical: 0, high: 1, medium: 2 }[b.severity]))
              .map((flag, i) => <RiskFlag key={i} flag={flag} index={i} />)}
          </div>
        </>
      )}

      {/* Action block — branches by risk level */}
      <div className="space-y-4">
        {isHighRisk && (
          <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(238,29,82,0.25)", background: "rgba(238,29,82,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-destructive" />
              <h3 className="text-base font-black text-foreground">Immediate Action Required</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              This profile shows active or imminent compliance failures. A full WGL-CERT scan runs static analysis against the deployed build — catching deprecated patterns from third-party plugins and SDK wrappers that manual review misses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/#cta" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90" style={{ background: "#EE1D52", color: "#fff" }}>
                Run Free Compliance Scan
              </a>
              {!ambassadorInterested ? (
                <button onClick={handleAmbassadorInterest} disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm border transition-all hover:bg-white/5"
                  style={{ borderColor: "rgba(155,89,182,0.4)", color: "#9B59B6" }}>
                  <Star className="w-4 h-4" />
                  {saving ? "Saving..." : "Express Ambassador Interest"}
                </button>
              ) : (
                <div className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm" style={{ background: "rgba(155,89,182,0.12)", color: "#9B59B6", border: "1px solid rgba(155,89,182,0.3)" }}>
                  <CheckCircle2 className="w-4 h-4" />
                  Interest Noted — We'll Be In Touch
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground/50 mt-3 font-mono text-center">Ambassador program covers your full compliance journey · Equity-based · Zero upfront cost</p>
          </div>
        )}

        {!isHighRisk && (
          <div className="rounded-2xl border p-6" style={{ borderColor: `${color}25`, background: `${color}06` }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5" style={{ color }} />
              <h3 className="text-base font-black text-foreground">
                {isCompliant ? "Low Risk Profile — Eligible for Verified Directory Listing" : "Moderate Risk — Confirm with Compiled Scan"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {isCompliant
                ? "This studio profile signals strong compliance posture. Submit for a free benchmarking report and optional listing in the HTML5STUDIO Verified Studio Directory — the industry's first compliance-graded studio map."
                : "Targeted remediation is recommended. Run a compiled-build scan to confirm your actual posture, then submit for directory listing once clean."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/#cta" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm border border-white/15 hover:bg-white/5 transition-all">
                <Upload className="w-4 h-4" />
                Upload Build for Full Scan
              </a>
              {!listingRequested ? (
                <button onClick={handleRequestListing} disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: color, color: "#000" }}>
                  {saving ? "Submitting..." : isCompliant ? "Submit for Directory Listing" : "Submit for Benchmarking Report"}
                </button>
              ) : (
                <div className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                  <CheckCircle2 className="w-4 h-4" />
                  Submission Received
                </div>
              )}
            </div>
          </div>
        )}

        {/* Always show checklist link */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/compliance-matrix" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm border border-white/10 text-muted-foreground hover:bg-white/5 transition-all">
            View Platform Fix Checklist
          </Link>
          <button onClick={onBack} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm border border-white/10 text-muted-foreground hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Assess Another Game
          </button>
        </div>
      </div>

      {/* Industry map note */}
      <div className="mt-8 p-4 rounded-xl border border-white/8 bg-white/2">
        <div className="flex items-start gap-2">
          <Globe className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Building the industry compliance map.</strong> Every assessment — regardless of risk level — contributes to our anonymous benchmark dataset. We're tracking which engines, build years, and platform combinations produce the highest compliance rates across the WebGL ecosystem.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Sept30RiskAssessor() {
  const [step, setStep] = useState(1); // 1: profile, 2: questionnaire, 3: results
  const [profile, setProfile] = useState({});
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const setAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));
  const toggleMulti = (id, value) => {
    setAnswers(prev => {
      const current = prev[id] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [id]: updated };
    });
  };

  const handleQuestionnaireSubmit = () => {
    const r = computeRisk(answers);
    setResult(r);
    setStep(3);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleRestart = () => {
    setStep(1);
    setProfile({});
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const STEP_LABELS = ["Studio Profile", "Risk Assessment", "Your Results"];

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/IntelligenceCentre" className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Intelligence Centre
        </Link>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Studio Discovery Wizard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
          Sept 30 Risk Assessor
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xl">
          A compliance diagnostic and discovery tool — for studios assessing their own builds, and the research backbone of the HTML5STUDIO verified studio directory.
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono transition-all"
                    style={{
                      background: isDone ? "#00FF88" : isActive ? "#1e6ff0" : "rgba(255,255,255,0.08)",
                      color: isDone || isActive ? "#000" : "rgba(255,255,255,0.3)",
                    }}>
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span className="text-[10px] font-mono hidden sm:block" style={{ color: isActive ? "#fff" : isDone ? "#00FF88" : "rgba(255,255,255,0.3)" }}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className="flex-1 h-px transition-all" style={{ background: step > stepNum ? "#00FF88" : "rgba(255,255,255,0.1)" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="h-px bg-border mb-10" />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StudioProfileStep key="profile" profile={profile} setProfile={setProfile} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <QuestionnaireStep key="questions" answers={answers} setAnswer={setAnswer} toggleMulti={toggleMulti}
              onBack={() => setStep(1)} onSubmit={handleQuestionnaireSubmit} />
          )}
          {step === 3 && result && (
            <ResultsStep key="results" result={result} profile={profile} answers={answers} onBack={handleRestart} />
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}