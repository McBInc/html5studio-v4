"use client";

import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import NewsTicker from '@/components/landing/NewsTicker';

const RISK_CONFIG = {
  "LOW RISK":          { color: "#00FF88", bg: "rgba(0,255,136,0.12)"  },
  "MODERATE RISK":     { color: "#F1C40F", bg: "rgba(241,196,15,0.12)" },
  "HIGH RISK":         { color: "#FF6B00", bg: "rgba(255,107,0,0.12)"  },
  "CRITICAL EXPOSURE": { color: "#EE1D52", bg: "rgba(238,29,82,0.12)"  },
};

const RISK_ORDER = ["LOW RISK", "MODERATE RISK", "HIGH RISK", "CRITICAL EXPOSURE"];

function StatCard({ label, value, color, sub }) {
  return (
    <div className="rounded-xl border p-5 text-center" style={{ borderColor: `${color}25`, background: `${color}06` }}>
      <div className="text-3xl font-black font-mono mb-1" style={{ color }}>{value}</div>
      <div className="text-xs font-bold text-foreground mb-0.5">{label}</div>
      {sub && <div className="text-[10px] text-muted-foreground font-mono">{sub}</div>}
    </div>
  );
}

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/30" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3 h-3 text-primary" />
    : <ChevronDown className="w-3 h-3 text-primary" />;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground mb-0.5">{d.label}</p>
      <p className="text-muted-foreground">{d.count} studio{d.count !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default function RiskDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("risk_score");
  const [sortDir, setSortDir] = useState("desc");
  const [labelFilter, setLabelFilter] = useState("ALL");
  const navigate = useRouter();

  useEffect(() => {
    const init = async () => {
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
      } catch {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      base44.entities.StudioSubmission.list('-created_date', 200)
        .then(data => { setSubmissions(data); setLoading(false); })
        .catch(() => setLoading(false));
    };
    init();
  }, [navigate]);

  const stats = useMemo(() => {
    const counts = { "LOW RISK": 0, "MODERATE RISK": 0, "HIGH RISK": 0, "CRITICAL EXPOSURE": 0 };
    let totalScore = 0;
    submissions.forEach(s => {
      if (s.risk_label && counts[s.risk_label] !== undefined) counts[s.risk_label]++;
      totalScore += typeof s.risk_score === "number" ? s.risk_score : 0;
    });
    return { counts, avgScore: submissions.length ? Math.round(totalScore / submissions.length) : 0 };
  }, [submissions]);

  const barData = RISK_ORDER.map(label => ({
    label,
    count: stats.counts[label],
    color: RISK_CONFIG[label].color,
  }));

  const scoreDistData = useMemo(() => {
    const buckets = [
      { label: "0–20", min: 0,  max: 20,  count: 0 },
      { label: "21–40", min: 21, max: 40, count: 0 },
      { label: "41–60", min: 41, max: 60, count: 0 },
      { label: "61–80", min: 61, max: 80, count: 0 },
      { label: "81–100", min: 81, max: 100, count: 0 },
    ];
    submissions.forEach(s => {
      const score = s.risk_score || 0;
      const bucket = buckets.find(b => score >= b.min && score <= b.max);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [submissions]);

  const sorted = useMemo(() => {
    let filtered = labelFilter === "ALL" ? [...submissions] : submissions.filter(s => s.risk_label === labelFilter);
    return filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortField === "risk_score") {
        aVal = typeof a.risk_score === "number" ? a.risk_score : 0;
        bVal = typeof b.risk_score === "number" ? b.risk_score : 0;
      } else {
        aVal = (a[sortField] ?? "").toString().toLowerCase();
        bVal = (b[sortField] ?? "").toString().toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [submissions, sortField, sortDir, labelFilter]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const thClass = "px-3 py-2.5 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors select-none";
  const tdClass = "px-3 py-3 text-sm";

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8 mb-5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Risk Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">Studio Risk Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              {loading ? "Loading submissions..." : `${submissions.length} studios assessed across all directories`}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
                <StatCard label="Avg Risk Score" value={stats.avgScore} color="#1e6ff0" sub="out of 100" />
                <StatCard label="Low Risk" value={stats.counts["LOW RISK"]} color="#00FF88" sub="studios" />
                <StatCard label="Moderate Risk" value={stats.counts["MODERATE RISK"]} color="#F1C40F" sub="studios" />
                <StatCard label="High Risk" value={stats.counts["HIGH RISK"]} color="#FF6B00" sub="studios" />
                <StatCard label="Critical Exposure" value={stats.counts["CRITICAL EXPOSURE"]} color="#EE1D52" sub="studios" />
              </motion.div>

              {/* Charts Row */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="grid sm:grid-cols-2 gap-6 mb-10">

                {/* Risk Label Distribution */}
                <div className="rounded-2xl border border-white/8 bg-card p-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/50 mb-4">Risk Category Distribution</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} barCategoryGap="30%">
                      <XAxis dataKey="label" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Score Range Distribution */}
                <div className="rounded-2xl border border-white/8 bg-card p-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/50 mb-4">Score Range Distribution</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={scoreDistData} barCategoryGap="30%">
                      <XAxis dataKey="label" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {scoreDistData.map((_, i) => (
                          <Cell key={i} fill="#1e6ff0" fillOpacity={0.4 + i * 0.12} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Table */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <p className="text-sm font-bold text-foreground">All Studios <span className="text-muted-foreground font-normal">({sorted.length})</span></p>
                  <div className="flex gap-2 flex-wrap">
                    {["ALL", ...RISK_ORDER].map(label => {
                      const cfg = RISK_CONFIG[label];
                      return (
                        <button key={label} onClick={() => setLabelFilter(label)}
                          className="text-[10px] font-mono px-3 py-1 rounded-full border transition-all"
                          style={{
                            borderColor: labelFilter === label ? (cfg?.color || "rgba(30,111,240,0.5)") : "rgba(255,255,255,0.1)",
                            background:  labelFilter === label ? (cfg ? cfg.bg : "rgba(30,111,240,0.12)") : "transparent",
                            color:       labelFilter === label ? (cfg?.color || "#1e6ff0") : "rgba(255,255,255,0.5)",
                          }}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <tr>
                          <th className={thClass} onClick={() => handleSort("studio_name")}>
                            <span className="flex items-center gap-1">Studio <SortIcon field="studio_name" sortField={sortField} sortDir={sortDir} /></span>
                          </th>
                          <th className={thClass + " hidden sm:table-cell"}>Engine</th>
                          <th className={thClass + " hidden md:table-cell"}>Platforms</th>
                          <th className={thClass} onClick={() => handleSort("risk_score")}>
                            <span className="flex items-center gap-1">Score <SortIcon field="risk_score" sortField={sortField} sortDir={sortDir} /></span>
                          </th>
                          <th className={thClass} onClick={() => handleSort("risk_label")}>
                            <span className="flex items-center gap-1">Label <SortIcon field="risk_label" sortField={sortField} sortDir={sortDir} /></span>
                          </th>
                          <th className={thClass + " hidden lg:table-cell"}>Flags</th>
                          <th className={thClass + " hidden sm:table-cell"}>Source</th>
                          <th className={thClass}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((sub, i) => {
                          const cfg = RISK_CONFIG[sub.risk_label] || { color: "#888", bg: "rgba(136,136,136,0.1)" };
                          const isCritical = sub.risk_label === "CRITICAL EXPOSURE";
                          return (
                            <tr key={sub.id}
                              className="border-t border-white/5 hover:bg-white/2 transition-colors"
                              style={isCritical ? { background: "rgba(238,29,82,0.02)" } : {}}>
                              <td className={tdClass}>
                                <div className="font-semibold text-foreground">{sub.studio_name || "—"}</div>
                                {sub.game_title && <div className="text-[10px] text-muted-foreground mt-0.5">{sub.game_title}</div>}
                              </td>
                              <td className={tdClass + " hidden sm:table-cell"}>
                                <span className="text-xs text-muted-foreground">{sub.engine || "—"}</span>
                              </td>
                              <td className={tdClass + " hidden md:table-cell"}>
                                <div className="flex flex-wrap gap-1">
                                  {(sub.platforms || []).slice(0, 3).map((p, pi) => (
                                    <span key={pi} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                                      {p}
                                    </span>
                                  ))}
                                  {(sub.platforms || []).length > 3 && (
                                    <span className="text-[9px] text-muted-foreground/40">+{sub.platforms.length - 3}</span>
                                  )}
                                </div>
                              </td>
                              <td className={tdClass}>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono"
                                    style={{ background: cfg.bg, color: cfg.color }}>
                                    {sub.risk_score ?? "—"}
                                  </div>
                                  <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden hidden sm:block">
                                    <div className="h-full rounded-full transition-all"
                                      style={{ width: `${sub.risk_score || 0}%`, background: cfg.color }} />
                                  </div>
                                </div>
                              </td>
                              <td className={tdClass}>
                                <span className="text-[9px] font-black font-mono px-2 py-1 rounded whitespace-nowrap"
                                  style={{ color: cfg.color, background: cfg.bg }}>
                                  {sub.risk_label || "UNSCORED"}
                                </span>
                              </td>
                              <td className={tdClass + " hidden lg:table-cell"}>
                                {(Array.isArray(sub.risk_flags) && sub.risk_flags.filter(f => f && Object.keys(f).length > 0).length > 0) ? (
                                  <div className="flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" style={{ color: "#FF6B00" }} />
                                    <span className="text-xs text-muted-foreground">{sub.risk_flags.filter(f => f && Object.keys(f).length > 0).length}</span>
                                  </div>
                                ) : <span className="text-xs text-muted-foreground/30">—</span>}
                              </td>
                              <td className={tdClass + " hidden sm:table-cell"}>
                                <span className="text-[9px] font-mono text-muted-foreground/40">{sub.source}</span>
                              </td>
                              <td className={tdClass}>
                                {sub.website && (
                                  <a href={sub.website} target="_blank" rel="noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors inline-flex">
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-muted-foreground" />
                                  </a>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {sorted.length === 0 && (
                          <tr><td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">No studios match this filter.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}