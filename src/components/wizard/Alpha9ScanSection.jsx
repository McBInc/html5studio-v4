import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Loader2 } from "lucide-react";

const MOCK_SCAN_RESULTS = [
  { label: "EU DMA Article 7 consent gate", status: "fail", detail: "No consent signal detected before SDK init" },
  { label: "GDPR TCF 2.0 signal", status: "fail", detail: "Ad network initialised without consent state" },
  { label: "COPPA age gate", status: "warn", detail: "No age verification layer found" },
  { label: "Meta SDK version", status: "fail", detail: "Legacy v6.3 detected — Sept 30 deadline" },
  { label: "Touch-action CSS", status: "warn", detail: "Missing on canvas element" },
  { label: "Content Security Policy", status: "pass", detail: "Headers present" },
  { label: "Bundle size", status: "pass", detail: "Within platform limits" },
];

const STATUS_CONFIG = {
  fail:  { icon: XCircle,       color: "#ef4444", bg: "rgba(220,38,38,0.08)",  label: "FAIL" },
  warn:  { icon: AlertTriangle, color: "#f97316", bg: "rgba(255,107,0,0.08)",  label: "WARN" },
  pass:  { icon: CheckCircle2,  color: "#22c55e", bg: "rgba(0,255,136,0.06)", label: "PASS" },
};

const RISK_SCORE = 71; // mock

export default function Alpha9ScanSection() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | scanning | results
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    if (!url.trim()) return;
    setPhase("scanning");
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) { clearInterval(interval); setPhase("results"); return 100; }
        return p + Math.random() * 18;
      });
    }, 220);
  };

  const fails = MOCK_SCAN_RESULTS.filter(r => r.status === "fail").length;
  const warns = MOCK_SCAN_RESULTS.filter(r => r.status === "warn").length;

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 mb-4" style={{ background: "rgba(155,89,182,0.1)", borderColor: "rgba(155,89,182,0.25)" }}>
          <Search className="w-3.5 h-3.5" style={{ color: "#9B59B6" }} />
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9B59B6" }}>Alpha-9 Compliance Scanner — Free</span>
        </div>
        <h2 className="text-3xl font-black text-foreground mb-3">Don't want to touch the code yourself?</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Run a free scan on your live game URL. We surface every compliance gap. Then, if you want, we fix all of it for you — Results Based Outcome, you pay when it's done.
        </p>
      </div>

      {/* Scanner UI */}
      <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(155,89,182,0.25)", background: "rgba(155,89,182,0.05)" }}>
        <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider mb-3">Enter your live game URL</p>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://your-game.com or platform deep link..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && startScan()}
            className="flex-1 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-white/20"
          />
          <button
            onClick={startScan}
            disabled={phase === "scanning" || !url.trim()}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #9B59B6, #6C3483)" }}
          >
            {phase === "scanning" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {phase === "scanning" ? "Scanning..." : "Free Scan"}
          </button>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground/40 mb-1.5">
                <span>Scanning compliance signals...</span>
                <span>{Math.min(100, Math.round(scanProgress))}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #9B59B6, #1e6ff0)", width: `${Math.min(100, scanProgress)}%` }}
                  animate={{ width: `${Math.min(100, scanProgress)}%` }}
                />
              </div>
              <div className="flex gap-4 mt-3 flex-wrap">
                {["EU DMA consent", "GDPR signals", "SDK versions", "CSP headers", "COPPA gate", "Bundle size"].map((check, i) => (
                  <span key={i} className="text-[9px] font-mono text-muted-foreground/30 flex items-center gap-1">
                    {scanProgress > (i + 1) * 16 ? <CheckCircle2 className="w-2.5 h-2.5 text-green-400" /> : <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                    {check}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence>
        {phase === "results" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Score summary */}
            <div className="rounded-2xl border p-5 flex items-center gap-6 flex-wrap" style={{ borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)" }}>
              <div className="text-center">
                <div className="text-5xl font-black" style={{ color: "#ef4444" }}>{RISK_SCORE}</div>
                <div className="text-[10px] font-mono text-muted-foreground/50 uppercase mt-1">Risk Score</div>
              </div>
              <div className="flex-1">
                <p className="font-black text-foreground text-lg mb-1">HIGH RISK — {fails} critical failures</p>
                <p className="text-sm text-muted-foreground">Your game is non-compliant with EU DMA Article 7 and GDPR requirements. EU users will be blocked or your game could be removed.</p>
                <div className="flex gap-4 mt-3">
                  <span className="text-xs font-mono text-red-400">{fails} FAIL</span>
                  <span className="text-xs font-mono text-orange-400">{warns} WARN</span>
                  <span className="text-xs font-mono text-green-400">{MOCK_SCAN_RESULTS.length - fails - warns} PASS</span>
                </div>
              </div>
            </div>

            {/* Check list */}
            <div className="space-y-2">
              {MOCK_SCAN_RESULTS.map((result, i) => {
                const cfg = STATUS_CONFIG[result.status];
                const Icon = cfg.icon;
                return (
                  <div key={i} className="rounded-xl border border-white/8 p-3 flex items-center gap-3" style={{ background: cfg.bg }}>
                    <Icon className="w-4 h-4 shrink-0" style={{ color: cfg.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{result.label}</p>
                      <p className="text-xs text-muted-foreground">{result.detail}</p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded font-black" style={{ color: cfg.color, background: `${cfg.color}20` }}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* DFY CTA */}
            <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "rgba(155,89,182,0.3)", background: "rgba(155,89,182,0.06)" }}>
              <h3 className="font-black text-foreground text-xl mb-2">We'll fix all {fails + warns} issues — you pay for the outcome</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-5">
                Done For You compliance implementation. We add the consent gates, migrate the SDKs, fix the CSP headers, and deliver a signed compliance report. Results Based Outcome — you don't pay until it's live and passing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #9B59B6, #6C3483)" }}
                >
                  Get DFY Compliance Quote
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPhase("idle")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-muted-foreground hover:text-foreground transition-all"
                >
                  I'll Fix It Myself — Show Me How
                </button>
              </div>
              <p className="text-xs text-muted-foreground/30 mt-3">Alpha-9 scan results are illustrative. Full production scan available with DFY engagement.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No URL yet hint */}
      {phase === "idle" && (
        <div className="text-center text-xs text-muted-foreground/30 font-mono">
          ↑ Enter your game URL above to run the free scan · No account required
        </div>
      )}
    </div>
  );
}