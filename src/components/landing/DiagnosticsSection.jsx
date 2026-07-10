import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const CERT_SEAL = "https://media.base44.com/images/public/user_6861c38c47c16b00ec24a571/3479ccf6a_WebGL_HTML5STUDIO_Certified_Seal.png";

const scanLines = [
  { text: "INITIALIZING ALPHA-9 FORENSIC SCANNER...", type: "info", delay: 0 },
  { text: "MEMORY ANALYSIS » Heap overflow detection: [CLEAR]", type: "pass", delay: 1200 },
  { text: "MEMORY ANALYSIS » Memory leak audit: [2 MINOR LEAKS FOUND]", type: "warn", delay: 2200 },
  { text: "MEMORY ANALYSIS » Stack trace validation: [PASS]", type: "pass", delay: 3000 },
  { text: "API AUTH LAYER » META SDK V8.5 handshake: [ERROR 403 — REJECTED]", type: "fail", delay: 4200 },
  { text: "API AUTH LAYER » OAuth token scopes: [INSUFFICIENT PERMISSIONS]", type: "fail", delay: 5000 },
  { text: "API AUTH LAYER » Error 403 remediation patch: [QUEUED]", type: "warn", delay: 5800 },
  { text: "DATA PRIVACY » Illegal PII call removal: [12 CALLS FLAGGED]", type: "fail", delay: 7000 },
  { text: "DATA PRIVACY » GDPR compliance check: [PASS]", type: "pass", delay: 7800 },
  { text: "DATA PRIVACY » Data minimization audit: [PASS]", type: "pass", delay: 8600 },
  { text: "SUNSET DETECTION » Sept 30 sunset risk: [3 DEPRECATED CALLS]", type: "fail", delay: 9800 },
  { text: "SUNSET DETECTION » Auto-migration patches: [AVAILABLE]", type: "pass", delay: 10800 },
  { text: "VIEWPORT & TOUCH » Touch-action events: [CSS DECLARATION MISSING]", type: "fail", delay: 12000 },
  { text: "VIEWPORT & TOUCH » Safe area injection: [PASS]", type: "pass", delay: 12800 },
  { text: "VIEWPORT & TOUCH » Viewport meta fix: [PASS]", type: "pass", delay: 13600 },
  { text: "INTEROPERABILITY » DMA article 7 audit: [NON-COMPLIANT]", type: "fail", delay: 14800 },
  { text: "INTEROPERABILITY » Cross-platform routing: [PASS]", type: "pass", delay: 15800 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "info", delay: 17000 },
  { text: "SCAN COMPLETE — SCORE: 34/100 — 8 CRITICAL ISSUES FOUND", type: "warn", delay: 18000 },
  { text: "RECOMMENDATION: IMMEDIATE REMEDIATION REQUIRED", type: "fail", delay: 19000 },
];

const TOTAL = scanLines.length;

const statusColor = {
  pass: "#00FF88",
  fail: "#FF3B5C",
  warn: "#FF6B00",
  info: "#4A9EFF",
};

// Game preview with real Unsplash screenshot + certified overlay
function GamePreview() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Real game screenshot from Unsplash */}
      <img
        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
        alt="Game demo"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.85 }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />

      {/* Game HUD overlay */}
      <div className="absolute top-0 left-0 right-0 px-3 pt-2 flex items-start justify-between">
        <div>
          <div className="text-[8px] font-mono text-red-400/80 mb-0.5">HP</div>
          <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="h-full w-3/4 rounded-full" style={{ background: "linear-gradient(90deg, #FF3B5C, #FF6B00)", boxShadow: "0 0 4px #FF3B5C" }} />
          </div>
          <div className="text-[7px] font-mono text-white/40 mt-0.5">240 / 320</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-mono text-yellow-400/80">SCORE</div>
          <div className="text-sm font-black font-mono text-yellow-300" style={{ textShadow: "0 0 8px rgba(255,200,50,0.6)" }}>48,920</div>
        </div>
        <div className="text-right">
          <div className="text-[8px] font-mono text-blue-400/80 mb-0.5">MP</div>
          <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="h-full w-1/2 rounded-full" style={{ background: "linear-gradient(90deg, #0082FB, #5865F2)", boxShadow: "0 0 4px #0082FB" }} />
          </div>
          <div className="text-[7px] font-mono text-white/40 mt-0.5">80 / 160</div>
        </div>
      </div>

      {/* Platform label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="text-[8px] font-mono text-white/30 tracking-widest uppercase">WebGL Build · Meta Platform</div>
      </div>

    </div>
  );
}

export default function DiagnosticsSection() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [started, setStarted] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    setVisibleLines([]);
    setScanDone(false);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    scanLines.forEach((line, idx) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        setVisibleLines((prev) => [...prev, line]);
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        if (idx === scanLines.length - 1) {
          setTimeout(() => { if (!cancelled) setScanDone(true); }, 1200);
        }
      }, line.delay);
      timersRef.current.push(t);
    });

    return () => {
      cancelled = true;
      timersRef.current.forEach(clearTimeout);
    };
  }, [started]);

  const progress = Math.round((visibleLines.length / TOTAL) * 100);
  const passCount = visibleLines.filter(l => l.type === "pass").length;
  const failCount = visibleLines.filter(l => l.type === "fail").length;
  const warnCount = visibleLines.filter(l => l.type === "warn").length;

  return (
    <section id="diagnostics" ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Studio room background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080b14 0%, #0a0d1a 50%, #0d1020 100%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(30,111,240,0.15) 0%, transparent 70%)", filter: "blur(30px)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded-full mb-4 uppercase tracking-wider">
            Alpha-9 Scanner
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Forensic-Grade Diagnostics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We run your build live. Watch the scan happen in real time — and see your game get certified the moment it's done.
          </p>
        </motion.div>

        {/* Studio scene */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="relative">

            {/* Left speaker */}
            <div className="absolute -left-5 hidden lg:flex flex-col items-center gap-1 z-20" style={{ bottom: "60px" }}>
              <div className="w-10 h-20 rounded-lg" style={{ background: "linear-gradient(180deg, #1a1e2e, #0f1218)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 20px rgba(88,101,242,0.25)" }}>
                <div className="w-6 h-6 rounded-full mx-auto mt-3" style={{ background: "radial-gradient(circle, #2a2e45, #111520)", border: "1px solid rgba(88,101,242,0.4)" }} />
                <div className="w-4 h-0.5 rounded mx-auto mt-2" style={{ background: "rgba(88,101,242,0.4)" }} />
                <div className="w-4 h-0.5 rounded mx-auto mt-1" style={{ background: "rgba(88,101,242,0.3)" }} />
              </div>
              <div className="w-8 h-2 rounded" style={{ background: "#0a0d1a" }} />
            </div>

            {/* Right speaker */}
            <div className="absolute -right-5 hidden lg:flex flex-col items-center gap-1 z-20" style={{ bottom: "60px" }}>
              <div className="w-10 h-20 rounded-lg" style={{ background: "linear-gradient(180deg, #1a1e2e, #0f1218)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 20px rgba(238,29,82,0.25)" }}>
                <div className="w-6 h-6 rounded-full mx-auto mt-3" style={{ background: "radial-gradient(circle, #2a2e45, #111520)", border: "1px solid rgba(238,29,82,0.4)" }} />
                <div className="w-4 h-0.5 rounded mx-auto mt-2" style={{ background: "rgba(238,29,82,0.4)" }} />
                <div className="w-4 h-0.5 rounded mx-auto mt-1" style={{ background: "rgba(238,29,82,0.3)" }} />
              </div>
              <div className="w-8 h-2 rounded" style={{ background: "#0a0d1a" }} />
            </div>

            {/* Monitor bezel */}
            <div
              className="relative mx-auto rounded-2xl"
              style={{
                background: "linear-gradient(180deg, #222840 0%, #141824 100%)",
                border: "3px solid #0d1020",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.9), 0 0 100px rgba(30,111,240,0.18)",
                padding: "14px 14px 10px 14px",
              }}
            >
              {/* Bezel shine */}
              <div className="absolute top-0 left-0 right-0 h-4 rounded-t-2xl" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)" }} />
              {/* Bezel webcam dot */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-1 h-1 rounded-full m-auto mt-0.5" style={{ background: "rgba(0,255,136,0.4)" }} />
              </div>
              {/* Glass reflection */}
              <div className="absolute top-4 left-4 right-4 h-20 pointer-events-none z-30 rounded-t-xl" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.05) 0%, transparent 55%)" }} />

              {/* Screen — split layout */}
              <div
                className="relative rounded-xl overflow-hidden flex"
                style={{
                  border: "1px solid rgba(30,111,240,0.25)",
                  boxShadow: "inset 0 0 60px rgba(30,111,240,0.05), 0 0 40px rgba(30,111,240,0.12)",
                  minHeight: 520,
                }}
              >
                {/* CRT scanlines over both panels */}
                <div className="absolute inset-0 pointer-events-none z-20" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)" }} />

                {/* CERTIFIED full-screen overlay — covers both panels */}
                <AnimatePresence>
                  {scanDone && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 z-30 flex flex-col items-center justify-center"
                      style={{ background: "rgba(0,10,5,0.92)", backdropFilter: "blur(6px)" }}
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.1 }}
                        className="relative flex flex-col items-center gap-5"
                      >
                        {/* Radial glow */}
                        <div className="absolute pointer-events-none" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)", filter: "blur(30px)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

                        {/* Seal */}
                        <motion.img
                          src={CERT_SEAL}
                          alt="Certified"
                          className="relative w-56 h-56 object-contain"
                          style={{ filter: "drop-shadow(0 0 40px rgba(0,255,136,0.7)) drop-shadow(0 0 80px rgba(0,255,136,0.3))" }}
                          initial={{ scale: 0.5, rotate: -15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
                        />

                        {/* Text */}
                        <div className="text-center">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className="text-3xl font-black font-mono tracking-widest"
                            style={{ color: "#00FF88", textShadow: "0 0 30px #00FF8890, 0 0 60px #00FF8840" }}
                          >
                            BUILD CERTIFIED
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-xs font-mono text-white/40 mt-2 tracking-widest"
                          >
                            WGL-CERT · HTML5STUDIO · 2026
                          </motion.div>
                        </div>

                        {/* Badge */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.85 }}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-full"
                          style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.35)", boxShadow: "0 0 30px rgba(0,255,136,0.15)" }}
                        >
                          <ShieldCheck className="w-5 h-5" style={{ color: "#00FF88" }} />
                          <span className="text-sm font-mono font-bold" style={{ color: "#00FF88" }}>COMPLIANT · ALL PLATFORMS</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* === LEFT PANEL: Game === */}
                <div className="flex-1 relative flex flex-col" style={{ minWidth: 0, borderRight: "1px solid rgba(30,111,240,0.15)" }}>
                  {/* Panel label */}
                  <div className="px-3 py-2 flex items-center gap-2 shrink-0" style={{ background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FF6B00", boxShadow: "0 0 4px #FF6B00" }} />
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Game Preview · WebGL Build</span>
                  </div>
                  <div className="flex-1 relative">
                    <GamePreview />
                  </div>
                </div>

                {/* === RIGHT PANEL: Forensic HUD === */}
                <div className="flex flex-col" style={{ width: "45%", minWidth: 280, background: "rgba(4,7,18,0.98)" }}>
                  {/* HUD top bar */}
                  <div className="px-4 py-2 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid rgba(30,111,240,0.18)", background: "rgba(30,111,240,0.07)" }}>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <div className="absolute inset-0 w-4 h-4 -top-1 -left-1 rounded-full bg-primary/20 animate-ping" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-primary tracking-widest uppercase">
                        Alpha-9 Forensic HUD
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[8px] font-mono text-green-400/60">LIVE</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 shrink-0" style={{ borderBottom: "1px solid rgba(30,111,240,0.1)" }}>
                    {[
                      { label: "PROGRESS", value: `${progress}%`, color: "#4A9EFF" },
                      { label: "PASSED", value: passCount, color: "#00FF88" },
                      { label: "WARNINGS", value: warnCount, color: "#FF6B00" },
                      { label: "CRITICAL", value: failCount, color: "#FF3B5C" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col items-center py-2.5" style={{ borderRight: "1px solid rgba(30,111,240,0.1)", borderBottom: "1px solid rgba(30,111,240,0.08)" }}>
                        <span className="text-[7px] font-mono mb-0.5" style={{ color: "rgba(30,111,240,0.45)" }}>{stat.label}</span>
                        <span className="text-2xl font-black font-mono" style={{ color: stat.color, textShadow: `0 0 12px ${stat.color}60` }}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="px-4 pt-2 pb-1 shrink-0">
                    <div className="h-0.5 w-full bg-primary/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #1e6ff0, #00FF88)" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* Terminal body */}
                  <div
                    ref={scrollRef}
                    className="flex-1 px-4 pb-4 pt-2 font-mono text-[10px] space-y-1 overflow-y-auto"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <AnimatePresence>
                      {visibleLines.map((line, i) => {
                        const lineColor = statusColor[line.type] || "#8899aa";
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-start gap-1.5 leading-relaxed"
                          >
                            <span className="shrink-0 mt-px" style={{ color: "rgba(30,111,240,0.3)" }}>›</span>
                            <span style={{ color: lineColor, textShadow: `0 0 6px ${lineColor}40` }}>
                              {line.text}
                            </span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {visibleLines.length < TOTAL && (
                      <span className="inline-block w-1 h-3 ml-3" style={{ backgroundColor: "#1e6ff0", boxShadow: "0 0 5px #1e6ff0" }} />
                    )}
                  </div>

                  {/* Bottom bar */}
                  <div className="px-4 py-2 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid rgba(30,111,240,0.1)", background: "rgba(30,111,240,0.03)" }}>
                    <span className="text-[7px] font-mono text-primary/25">AES-256 · SANDBOXED</span>
                    <span className="text-[7px] font-mono text-primary/25">HTML5STUDIO v2.4.1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stand neck */}
            <div className="mx-auto" style={{ width: 56, height: 24, background: "linear-gradient(180deg, #1a1e2e 0%, #0f1218 100%)", borderLeft: "1px solid rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.04)" }} />
            {/* Stand base */}
            <div className="mx-auto rounded-lg" style={{ width: 150, height: 10, background: "linear-gradient(180deg, #1a1e2e 0%, #111520 100%)", border: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }} />

            {/* Desk */}
            <div className="relative rounded-b-xl" style={{ height: 44, background: "linear-gradient(180deg, #1a1d2b 0%, #13151f 100%)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(88,101,242,0.5) 30%, rgba(30,111,240,0.8) 50%, rgba(238,29,82,0.5) 70%, transparent 100%)" }} />
              <div className="absolute left-6 top-2 flex gap-2 items-end">
                <div className="w-5 h-6 rounded-b-sm" style={{ background: "linear-gradient(180deg, #2a2e40, #1c1f2e)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-full h-1 rounded-t" style={{ background: "rgba(139,90,43,0.6)" }} />
                </div>
                <div className="w-6 h-5 rounded-sm rotate-2" style={{ background: "rgba(255,200,50,0.15)", border: "1px solid rgba(255,200,50,0.2)" }} />
              </div>
              <div className="absolute right-6 top-3 flex gap-1">
                {["#00FF88","#0082FB","#FF6B00","#EE1D52"].map((c, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 4px ${c}`, opacity: 0.7 }} />
                ))}
              </div>
            </div>

            {/* Floor shadow */}
            <div className="h-6" style={{ background: "linear-gradient(180deg, #0d0f18 0%, #080a12 100%)" }} />

          </div>
        </motion.div>
      </div>
    </section>
  );
}