import React from "react";
import { motion } from "framer-motion";
import { Radio, Globe, Zap, ShieldCheck, ArrowRight } from "lucide-react";

const LIVE_STATS = [
  { label: "Platforms Monitored", value: "8", color: "#1e6ff0" },
  { label: "Active Alerts", value: "14", color: "#EE1D52" },
  { label: "Topic Clusters", value: "32", color: "#FF6B00" },
  { label: "Certified Builds", value: "2.4k", color: "#00FF88" },
];

const FEED_PULSE = [
  { text: "META SDK v8.0 · Sept 30 deadline active", color: "#0082FB" },
  { text: "Discord Activities · granular scopes enforced", color: "#5865F2" },
  { text: "EU DMA Article 7 · non-compliant titles at risk", color: "#00FF88" },
  { text: "TikTok Mini-Game · touch-action CSS failures", color: "#EE1D52" },
  { text: "YouTube Playables · 15MB hard limit active", color: "#FF0000" },
  { text: "Telegram SDK 7.0 · Stars payment bridge required", color: "#229ED9" },
];

export default function IntelligenceHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(30,111,240,0.12) 0%, transparent 60%), #080b14",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,111,240,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,111,240,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
          style={{
            background: "rgba(238,29,82,0.08)",
            borderColor: "rgba(238,29,82,0.3)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#EE1D52" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#EE1D52" }} />
          </span>
          <Radio className="w-3.5 h-3.5" style={{ color: "#EE1D52" }} />
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#EE1D52" }}>
            Game Industry Intelligence Centre · Live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-foreground">Every Platform.</span>
          <br />
          <span className="text-foreground">Every Signal.</span>
          <br />
          <span style={{ color: "#1e6ff0" }}>All Intelligence</span>
          <span className="text-foreground"> In One Place.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The only industry-grade intelligence center tracking every upstream and downstream
          signal across the full game publishing ecosystem — from build to live.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#topical-map"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold transition-all"
            style={{ background: "#1e6ff0", color: "#fff" }}
          >
            <Globe className="w-5 h-5" />
            Explore the Topical Map
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#compliance-checker"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold border transition-all hover:border-white/20"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            <ShieldCheck className="w-5 h-5" />
            Check Your Build
          </a>
        </motion.div>

        {/* Live stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
        >
          {LIVE_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border py-4 px-3 text-center"
              style={{ borderColor: `${stat.color}25`, background: `${stat.color}06` }}
            >
              <div className="text-2xl font-black font-mono mb-1" style={{ color: stat.color, textShadow: `0 0 16px ${stat.color}50` }}>
                {stat.value}
              </div>
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scrolling signal feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto rounded-xl border overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
        >
          <div
            className="px-4 py-2 border-b flex items-center gap-2"
            style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(30,111,240,0.06)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">Live Signal Stream</span>
          </div>
          <div className="divide-y" style={{ divideColor: "rgba(255,255,255,0.04)" }}>
            {FEED_PULSE.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                <span className="text-xs font-mono" style={{ color: `${item.color}90` }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}