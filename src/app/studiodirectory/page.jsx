"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Database, Radio, RefreshCw, AlertTriangle } from "lucide-react";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import StudioCard from '@/components/directory/StudioCard';
import ContactModal from '@/components/directory/ContactModal';
import DirectoryFilters from '@/components/directory/DirectoryFilters';

const RISK_STATS_ORDER = ["critical", "high", "medium", "low", "unknown"];
const RISK_COLORS = {
  critical: "#EE1D52", high: "#FF6B00", medium: "#F1C40F", low: "#00FF88", unknown: "#666",
};

export default function StudioDirectory() {
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    platform: "All Platforms",
    riskLevel: "All Risks",
    size: "All Sizes",
    outreachStatus: "all",
  });

  const { data: studios = [], isLoading, refetch } = useQuery({
    queryKey: ["game-studios"],
    queryFn: () => base44.entities.GameStudio.list("-created_date", 200),
  });

  const pollRef = useRef(null);
  const seedStartCountRef = useRef(0);

  // Poll studio count while seeding to detect progress & completion
  useEffect(() => {
    if (seeding) {
      seedStartCountRef.current = studios.length;
      pollRef.current = setInterval(async () => {
        await refetch();
      }, 5000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [seeding]);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    // Fire and forget — the agent runs for several minutes and the gateway will time out.
    // We poll the studio count to detect progress. The result banner shows when done.
    base44.functions.invoke("studioIntelligenceAgent", {})
      .then((res) => {
        setSeedResult(res.data);
        refetch();
        setSeeding(false);
      })
      .catch((e) => {
        // 502 timeout is expected — the agent keeps running server-side.
        // Show a "running in background" message instead of an error.
        const isTimeout = e.message?.includes("502") || e.message?.includes("timeout") || e.message?.includes("Network Error");
        if (isTimeout) {
          setSeedResult({ background: true });
        } else {
          setSeedResult({ error: e.message });
        }
        setSeeding(false);
      });
  };

  const filteredStudios = useMemo(() => {
    return studios.filter((s) => {
      const q = filters.search.toLowerCase();
      if (q && !(
        s.name?.toLowerCase().includes(q) ||
        s.games?.some((g) => g.toLowerCase().includes(q)) ||
        s.platforms?.some((p) => p.toLowerCase().includes(q)) ||
        s.country?.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q))
      )) return false;

      if (filters.platform !== "All Platforms" && !s.platforms?.includes(filters.platform)) return false;
      if (filters.riskLevel !== "All Risks" && s.risk_level !== filters.riskLevel) return false;
      if (filters.size !== "All Sizes" && s.studio_size !== filters.size) return false;
      if (filters.outreachStatus === "contacted" && !s.outreach_sent) return false;
      if (filters.outreachStatus === "not_contacted" && s.outreach_sent) return false;

      return true;
    });
  }, [studios, filters]);

  const riskCounts = useMemo(() => {
    const counts = {};
    studios.forEach((s) => {
      counts[s.risk_level] = (counts[s.risk_level] || 0) + 1;
    });
    return counts;
  }, [studios]);

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(30,111,240,0.08) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-wider">Game Studio Intelligence Registry</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              The WebGL Game Studio<br />
              <span style={{ color: "#1e6ff0" }}>Directory</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              The only directory cross-referencing HTML5 & WebGL game studios with live platform compliance status.
              Every studio tagged with risk flags, SDK deadlines, and deployment platforms.
            </p>

            {/* Risk stat bar */}
            <div className="flex flex-wrap gap-3">
              {RISK_STATS_ORDER.map((level) => (
                <div
                  key={level}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-all hover:opacity-90"
                  style={{
                    borderColor: `${RISK_COLORS[level]}30`,
                    background: `${RISK_COLORS[level]}08`,
                    color: RISK_COLORS[level],
                  }}
                  onClick={() => setFilters((f) => ({ ...f, riskLevel: level }))}
                >
                  <span className="font-black">{riskCounts[level] || 0}</span>
                  <span className="opacity-70 uppercase text-[9px]">{level}</span>
                </div>
              ))}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "#888" }}
              >
                <span className="font-black">{studios.filter((s) => s.outreach_sent).length}</span>
                <span className="opacity-70 uppercase text-[9px]">contacted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Seed button (admin tool) */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-muted-foreground/40 animate-pulse" />
              <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                {studios.length} studios indexed · sourced from Poki, CrazyGames, GameDistribution, itch.io, Meta, Discord, TikTok, Telegram
              </span>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-3 h-3 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Researching (this takes a few minutes)…" : "Run Intelligence Agent"}
            </button>
          </div>

          {seedResult && (
            <div
              className="mb-6 p-4 rounded-xl border text-sm font-mono"
              style={{
                borderColor: seedResult.error ? "rgba(238,29,82,0.3)" : seedResult.background ? "rgba(30,111,240,0.3)" : "rgba(0,255,136,0.3)",
                background: seedResult.error ? "rgba(238,29,82,0.07)" : seedResult.background ? "rgba(30,111,240,0.07)" : "rgba(0,255,136,0.07)",
                color: seedResult.error ? "#EE1D52" : seedResult.background ? "#1e6ff0" : "#00FF88",
              }}
            >
              {seedResult.error
                ? `Error: ${seedResult.error}`
                : seedResult.background
                  ? `⚡ Agent is running in the background — studios are updating live. This page will refresh automatically.`
                  : `✓ Agent complete — ${seedResult.studios_researched} researched, ${seedResult.upserted} upserted${seedResult.errors?.length ? `, ${seedResult.errors.length} errors` : ''}`}
            </div>
          )}

          {/* Filters */}
          <DirectoryFilters
            filters={filters}
            onChange={setFilters}
            totalCount={studios.length}
            filteredCount={filteredStudios.length}
          />

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 rounded-xl border border-white/5 bg-white/2 animate-pulse" />
              ))}
            </div>
          ) : filteredStudios.length === 0 ? (
            <div className="text-center py-24">
              <AlertTriangle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground/50 text-sm font-mono">
                {studios.length === 0
                  ? 'No studios indexed yet. Click "Run Directory Agent" above to seed the directory.'
                  : "No studios match your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStudios.map((studio, i) => (
                <StudioCard
                  key={studio.id}
                  studio={studio}
                  index={i}
                  onContact={setSelectedStudio}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {selectedStudio && (
        <ContactModal
          studio={selectedStudio}
          onClose={() => setSelectedStudio(null)}
        />
      )}
    </div>
  );
}