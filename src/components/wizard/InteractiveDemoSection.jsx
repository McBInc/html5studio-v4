import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Monitor, Gamepad2, ArrowRight, CheckCircle2, Copy, CheckCheck } from "lucide-react";
import { getGuide } from "./guideContent";

const ENGINES = [
  { id: "unity",      label: "Unity",          icon: "🎮" },
  { id: "phaser",     label: "Phaser 3",       icon: "⚡" },
  { id: "godot",      label: "Godot 4",        icon: "🤖" },
  { id: "unreal",     label: "Unreal Engine",  icon: "🛠️" },
  { id: "playcanvas", label: "PlayCanvas",     icon: "🎨" },
];

const PLATFORMS = [
  { id: "meta",        label: "Meta Instant Games", icon: "👾", color: "#EE1D52", urgency: "Sept 30 deadline" },
  { id: "tiktok",      label: "TikTok Mini Games",  icon: "🎵", color: "#FF6B00", urgency: "Active" },
  { id: "discord",     label: "Discord Activities", icon: "🎭", color: "#5865F2", urgency: "CSP critical" },
  { id: "youtube",     label: "YouTube Playables",  icon: "▶️", color: "#FF0000", urgency: "15MB limit" },
  { id: "poki",        label: "Poki",               icon: "🌐", color: "#00C896", urgency: "SDK required" },
  { id: "crazygames",  label: "CrazyGames",         icon: "🎲", color: "#F39C12", urgency: "SDK v3" },
  { id: "linkedin",    label: "LinkedIn Playables", icon: "💼", color: "#0A66C2", urgency: "2MB limit" },
];

// EU consent popup mockup
function EUConsentPopupDemo({ platform, engine }) {
  const [state, setState] = useState("idle"); // idle | accepting | done
  const platformName = PLATFORMS.find(p => p.id === platform)?.label || "Platform";

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="px-4 py-2 border-b border-white/8 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">EU DMA Art.7 Consent Popup — Live Preview</span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>INTERACTIVE</span>
      </div>

      {/* Mock game canvas */}
      <div className="relative" style={{ aspectRatio: "16/7", background: "linear-gradient(135deg, #0a0a1a, #1a0a2e)" }}>
        {/* Fake game BG */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="grid grid-cols-8 gap-2 opacity-30">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded" style={{ background: i % 3 === 0 ? "#1e6ff0" : "#ffffff10" }} />
            ))}
          </div>
        </div>
        <div className="absolute top-3 left-4 text-xs font-mono text-white/20">⬡ GAME RUNNING</div>
        <div className="absolute top-3 right-4 text-xs font-mono text-white/20">SCORE: 0</div>

        {/* Consent overlay */}
        <AnimatePresence>
          {state !== "done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="rounded-xl border border-white/15 p-5 max-w-xs mx-4 text-center"
                style={{ background: "rgba(15,15,25,0.95)" }}
              >
                <div className="text-2xl mb-2">🇪🇺</div>
                <h4 className="font-black text-sm text-white mb-1">Before you play</h4>
                <p className="text-xs text-white/50 mb-4 leading-relaxed">
                  {platformName} and our partners use cookies and data to personalise your experience and show relevant ads. EU law (DMA Art. 7) requires your consent before we can continue.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => { setState("accepting"); setTimeout(() => setState("done"), 800); }}
                    className="w-full py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "#1e6ff0" }}
                  >
                    {state === "accepting" ? "✓ Saving consent..." : "Accept & Play"}
                  </button>
                  <button className="w-full py-2 rounded-lg text-xs text-white/40 border border-white/10 hover:border-white/20 transition-all">
                    Manage Preferences
                  </button>
                </div>
                <p className="text-[9px] text-white/20 mt-3">Consent recorded per GDPR TCF 2.0 · DMA Art. 7</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post-consent — game "starts" */}
        {state === "done" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-xs font-mono text-green-400">Consent recorded — game loading...</p>
              <p className="text-[10px] text-white/30 mt-1">SDK now initialises safely ✓</p>
              <button onClick={() => setState("idle")} className="mt-3 text-[10px] font-mono text-white/30 hover:text-white/60 underline">Reset demo</button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-white/6" style={{ background: "rgba(0,255,136,0.03)" }}>
        <p className="text-[10px] font-mono text-green-400/70">
          ↑ This is what EU users see before your game loads. Without it: game is blocked under DMA Art.7.
        </p>
      </div>
    </div>
  );
}

// Rich code diff showing BEFORE → NEW CODE → AFTER
function FirstStepDiff({ platform, engine }) {
  const guide = getGuide(platform, engine);
  const firstStep = guide?.steps?.[0];
  const [view, setView] = useState("before");
  const [copied, setCopied] = useState(false);

  if (!firstStep) return null;

  const newCode = firstStep.code?.split('\n').slice(0, 8).join('\n') + (firstStep.code?.split('\n').length > 8 ? '\n// ... unlock to see full implementation' : '');
  const beforeCode = firstStep.insertAfter || `// ${firstStep.file || 'your file'}\n// → Find the location described below\n// → This is where your new code goes`;
  const afterCode = firstStep.insertAfter
    ? `${firstStep.insertAfter}\n\n// ↓ YOUR NEW CODE:\n${newCode}`
    : newCode;

  const copy = () => {
    navigator.clipboard.writeText(newCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const tabs = [
    { key: "before", label: "📄 Before", color: "rgba(255,100,100,0.7)" },
    { key: "new",    label: "📋 New Code", color: "rgba(100,160,255,0.9)" },
    { key: "after",  label: "✅ After",  color: "rgba(0,220,110,0.8)" },
  ];

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(0,0,0,0.45)" }}>
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-white/8 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div>
          <span className="text-[10px] font-mono text-primary/60 uppercase tracking-wider">Step 1 — </span>
          <span className="text-[10px] font-mono text-white/70 font-bold">{firstStep.title}</span>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>FREE PREVIEW</span>
      </div>

      {/* File + location */}
      {firstStep.file && (
        <div className="px-4 py-2 border-b border-white/6" style={{ background: "rgba(30,111,240,0.05)" }}>
          <p className="text-[10px] font-mono text-primary/60">📄 {firstStep.file}</p>
          {firstStep.where && <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">📍 {firstStep.where}</p>}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex border-b border-white/8" style={{ background: "rgba(0,0,0,0.2)" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)}
            className="px-4 py-2 text-[10px] font-mono uppercase tracking-wide transition-all"
            style={{
              color: view === t.key ? t.color : "rgba(255,255,255,0.25)",
              borderBottom: view === t.key ? `2px solid ${t.color}` : "2px solid transparent",
              background: view === t.key ? "rgba(255,255,255,0.03)" : "transparent",
            }}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center px-3">
          <button onClick={copy} className="flex items-center gap-1 text-[9px] font-mono transition-colors" style={{ color: copied ? "#86efac" : "rgba(255,255,255,0.2)" }}>
            {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ minHeight: 120 }}>
        {view === "before" && (
          <div>
            <div className="px-3 py-1.5 border-b border-white/6" style={{ background: "rgba(255,80,80,0.04)" }}>
              <span className="text-[9px] font-mono text-red-400/50 uppercase">Your file currently looks like this — find this section</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre" style={{ color: "rgba(255,255,255,0.45)" }}>
              <code>{beforeCode}</code>
            </pre>
          </div>
        )}
        {view === "new" && (
          <div>
            <div className="px-3 py-1.5 border-b border-white/6" style={{ background: "rgba(30,111,240,0.05)" }}>
              <span className="text-[9px] font-mono text-primary/50 uppercase">Copy this — paste it immediately after the BEFORE section</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre" style={{ color: "rgba(255,255,255,0.75)" }}>
              <code>{newCode}</code>
            </pre>
          </div>
        )}
        {view === "after" && (
          <div>
            <div className="px-3 py-1.5 border-b border-white/6" style={{ background: "rgba(0,255,136,0.03)" }}>
              <span className="text-[9px] font-mono text-green-400/50 uppercase">✅ Your file after the change — new lines highlighted</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
              {afterCode.split('\n').map((line, i) => {
                const isNew = line.includes('↓ YOUR NEW CODE') || (firstStep.insertAfter && !firstStep.insertAfter.split('\n').includes(line) && line.trim() !== '');
                return (
                  <code key={i} className="block" style={{ color: isNew ? "#86efac" : "rgba(255,255,255,0.38)", background: isNew ? "rgba(0,255,136,0.06)" : "transparent" }}>
                    {line || ' '}
                  </code>
                );
              })}
            </pre>
          </div>
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-white/6 flex items-center justify-between" style={{ background: "rgba(0,0,0,0.2)" }}>
        <span className="text-[10px] font-mono text-muted-foreground/35">{(guide.steps.length - 1)} more steps in the full guide</span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(220,38,38,0.12)", color: "#ef4444" }}>
          Remaining steps locked
        </span>
      </div>
    </div>
  );
}

// COPPA Age Gate demo
function COPPAAgeGateDemo() {
  const [state, setState] = useState("idle"); // idle | under | over
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(249,115,22,0.25)", background: "rgba(0,0,0,0.5)" }}>
      <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: "rgba(249,115,22,0.15)", background: "rgba(255,255,255,0.02)" }}>
        <span className="text-[10px] font-mono text-orange-400/70 uppercase">COPPA Age Gate — Interactive Demo</span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}>US + META + TIKTOK</span>
      </div>
      <div className="relative" style={{ aspectRatio: "16/7", background: "linear-gradient(135deg, #0a1a0a, #1a1a00)" }}>
        <div className="absolute top-3 left-4 text-xs font-mono text-white/15">⬡ GAME RUNNING</div>
        <div className="absolute top-3 right-4 text-xs font-mono text-white/15">LVL: 1</div>
        <AnimatePresence>
          {state === "idle" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                className="rounded-xl border border-white/15 p-5 max-w-xs mx-4 text-center"
                style={{ background: "rgba(15,15,10,0.97)" }}>
                <div className="text-2xl mb-2">🎂</div>
                <h4 className="font-black text-sm text-white mb-1">How old are you?</h4>
                <p className="text-xs text-white/45 mb-4 leading-relaxed">US law (COPPA) and platform policies require we verify your age before you play. We cannot collect any data from players under 13.</p>
                <div className="space-y-2">
                  <button onClick={() => setState("over")}
                    className="w-full py-2 rounded-lg text-xs font-bold text-white" style={{ background: "#f97316" }}>
                    I am 13 or older ✓
                  </button>
                  <button onClick={() => setState("under")}
                    className="w-full py-2 rounded-lg text-xs text-white/40 border border-white/10">
                    I am under 13
                  </button>
                </div>
                <p className="text-[9px] text-white/20 mt-3">Required under COPPA · Meta Policy · TikTok ToS</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {state === "over" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <CheckCircle2 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-xs font-mono text-orange-400">Age verified — no data restriction</p>
              <p className="text-[10px] text-white/25 mt-1">COPPA compliant session ✓</p>
              <button onClick={() => setState("idle")} className="mt-3 text-[10px] font-mono text-white/25 hover:text-white/50 underline">Reset</button>
            </div>
          </motion.div>
        )}
        {state === "under" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.9)" }}>
            <div className="text-center px-6">
              <div className="text-3xl mb-2">🚫</div>
              <p className="text-xs font-mono text-red-400 mb-1">Access restricted</p>
              <p className="text-[10px] text-white/30 leading-relaxed">This game is not available for players under 13. No data has been collected. Zero liability for the studio.</p>
              <button onClick={() => setState("idle")} className="mt-3 text-[10px] font-mono text-white/25 hover:text-white/50 underline">Reset</button>
            </div>
          </motion.div>
        )}
      </div>
      <div className="px-4 py-3 border-t border-white/6" style={{ background: "rgba(249,115,22,0.03)" }}>
        <p className="text-[10px] font-mono text-orange-400/60">↑ Without this: under-13 data collected = COPPA violation = app removal + personal liability.</p>
      </div>
    </div>
  );
}

export default function InteractiveDemoSection({ onUnlockAll, onDFY }) {
  const [engine, setEngine] = useState(null);
  const [platform, setPlatform] = useState(null);

  const showDemo = engine && platform;
  const guide = showDemo ? getGuide(platform, engine) : null;
  const platformData = PLATFORMS.find(p => p.id === platform);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 mb-5" style={{ background: "rgba(30,111,240,0.1)", borderColor: "rgba(30,111,240,0.3)" }}>
          <Monitor className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono font-bold text-primary">Interactive Demo — Select Your Stack</span>
        </div>
        <h2 className="text-4xl font-black text-foreground mb-4">See exactly what's missing in your code</h2>
        <p className="text-base text-muted-foreground max-w-xl mx-auto mb-2">
          First, choose which game engine you use — the code fixes are different for each one.
        </p>
        <p className="text-sm text-muted-foreground/60 max-w-lg mx-auto">
          Then pick your target platform. We'll show you the exact code change, the EU consent popup, and the COPPA age gate your game needs.
        </p>
      </div>

      {/* ENGINE SELECT */}
      <div className="rounded-2xl border-2 p-5" style={{ borderColor: engine ? "rgba(30,111,240,0.4)" : "rgba(30,111,240,0.2)", background: engine ? "rgba(30,111,240,0.06)" : "rgba(30,111,240,0.03)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(30,111,240,0.15)" }}>
            <Gamepad2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Step 1 — Which game engine are you using?</p>
            <p className="text-xs text-muted-foreground">Select your engine below — this determines the exact code you'll need.</p>
          </div>
          {engine && (
            <span className="ml-auto text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1" style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>
              ✓ {ENGINES.find(e => e.id === engine)?.label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {ENGINES.map((e) => (
            <button
              key={e.id}
              onClick={() => setEngine(e.id)}
              className="rounded-xl border-2 p-4 text-center transition-all hover:scale-105"
              style={{
                borderColor: engine === e.id ? "#1e6ff0" : "rgba(255,255,255,0.08)",
                background: engine === e.id ? "rgba(30,111,240,0.15)" : "rgba(255,255,255,0.02)",
              }}
            >
              <div className="text-2xl mb-1.5">{e.icon}</div>
              <div className="text-xs font-mono text-muted-foreground">{e.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* PLATFORM SELECT */}
      <AnimatePresence>
        {engine && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5" /> Step 2 — Your Target Platform
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className="rounded-xl border p-3 text-left transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: platform === p.id ? p.color : `${p.color}25`,
                    background: platform === p.id ? `${p.color}12` : `${p.color}04`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{p.icon}</span>
                    <span className="text-xs font-bold text-foreground">{p.label}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${p.color}20`, color: p.color }}>
                    {p.urgency}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEMO RESULT */}
      <AnimatePresence>
        {showDemo && guide && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-xl border border-white/10 px-4 py-3 flex items-center gap-3" style={{ background: "rgba(30,111,240,0.06)" }}>
              <span className="text-base">{platformData?.icon}</span>
              <div>
                <span className="text-sm font-bold text-foreground">{guide.title}</span>
                <p className="text-xs text-muted-foreground">{guide.intro?.slice(0, 120)}...</p>
              </div>
            </div>

            {/* Code diff — full width, most to show */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider mb-2">
                📋 The exact code change — before / new code / after
              </p>
              <FirstStepDiff platform={platform} engine={engine} />
            </div>

            {/* Two compliance popups side by side */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider mb-2">🇪🇺 EU DMA Art.7 + GDPR consent →</p>
                <EUConsentPopupDemo platform={platform} engine={engine} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider mb-2">🎂 COPPA age gate →</p>
                <COPPAAgeGateDemo />
              </div>
            </div>

            {/* Unlock CTAs */}
            <div className="rounded-2xl border border-white/10 p-5 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
              <p className="text-sm font-bold text-foreground mb-1">That's the preview. The full guide has {guide.steps.length} steps.</p>
              <p className="text-xs text-muted-foreground mb-5">Every step has the exact file, exact location, before/after code diff — for {ENGINES.find(e => e.id === engine)?.label}.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onUnlockAll}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #1e6ff0, #1e6ff0cc)" }}
                >
                  Unlock Full Guide — from $17
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onDFY}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
                >
                  Done For Me — Free Scan First
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}