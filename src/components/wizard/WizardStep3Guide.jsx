import React, { useState } from "react";
import { Copy, CheckCheck, ChevronDown, ChevronUp, Lock, FileCode, MapPin, ArrowRight } from "lucide-react";
import { getGuide } from "./guideContent";
import PaywallOverlay from "./PaywallOverlay";
import SovereignForgeOffer from "./SovereignForgeOffer";
import PricingTiers from "./PricingTiers";

function CodeBlock({ code, language, file, where, insertAfter }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Build a simple "after" string: insertAfter context + new code merged
  const beforeCode = insertAfter || null;
  const afterCode = insertAfter ? `${insertAfter}\n\n// ↓ YOUR NEW CODE ADDED HERE:\n${code}` : code;

  return (
    <div className="space-y-2">
      {/* File location banner */}
      {file && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8" style={{ background: "rgba(30,111,240,0.07)" }}>
          <FileCode className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono text-primary/80 font-bold">📄 {file}</span>
            {where && (
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                <MapPin className="w-2.5 h-2.5 inline mr-1 opacity-60" />
                {where}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Before / After / New Code — always-visible stacked cards */}
      {insertAfter ? (
        <div className="space-y-2">
          {/* BEFORE card */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(255,100,100,0.2)", background: "rgba(0,0,0,0.35)" }}>
            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,100,100,0.15)", background: "rgba(255,100,100,0.05)" }}>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider" style={{ color: "rgba(255,120,120,0.8)" }}>📄 BEFORE — find this section in your file</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre" style={{ color: "rgba(255,255,255,0.45)" }}>
              <code>{beforeCode}</code>
            </pre>
          </div>

          {/* Arrow connector */}
          <div className="flex items-center justify-center py-1">
            <div className="flex items-center gap-2">
              <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>add below ↓</span>
              <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>
          </div>

          {/* NEW CODE card */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(30,111,240,0.35)", background: "rgba(0,0,0,0.4)" }}>
            <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(30,111,240,0.2)", background: "rgba(30,111,240,0.07)" }}>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider" style={{ color: "rgba(100,160,255,0.9)" }}>📋 NEW CODE — copy and paste this in</span>
              <button onClick={copy} className="flex items-center gap-1.5 text-[10px] font-mono transition-colors" style={{ color: copied ? "#86efac" : "rgba(100,160,255,0.6)" }}>
                {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre" style={{ color: "rgba(255,255,255,0.75)" }}>
              <code>{code}</code>
            </pre>
          </div>

          {/* AFTER card */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(0,255,136,0.2)", background: "rgba(0,0,0,0.35)" }}>
            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(0,255,136,0.15)", background: "rgba(0,255,136,0.04)" }}>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider" style={{ color: "rgba(0,220,110,0.8)" }}>✅ AFTER — your file should look like this</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre" style={{ color: "rgba(255,255,255,0.45)" }}>
              {afterCode.split('\n').map((line, i) => {
                const isNew = line.includes('↓ YOUR NEW CODE') || (insertAfter && !insertAfter.split('\n').includes(line) && line.trim() !== '');
                return (
                  <code key={i} className="block" style={{ color: isNew ? "#86efac" : "rgba(255,255,255,0.4)", background: isNew ? "rgba(0,255,136,0.06)" : "transparent" }}>
                    {line || ' '}
                  </code>
                );
              })}
            </pre>
          </div>
        </div>
      ) : (
        /* No insertAfter — just show the code block as before */
        <div className="relative rounded-xl overflow-hidden border border-white/8" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/6">
            <span className="text-[10px] font-mono text-muted-foreground/50 uppercase">{language}</span>
            <button onClick={copy} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              {copied ? <CheckCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function StepCard({ step, unlocked, onUnlock }) {
  const [open, setOpen] = useState(step.free);
  const isLocked = !step.free && !unlocked;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{
        borderColor: open ? "rgba(30,111,240,0.3)" : "rgba(255,255,255,0.08)",
        background: open ? "rgba(30,111,240,0.04)" : "rgba(255,255,255,0.02)",
      }}
    >
      <button
        className="w-full flex items-center gap-4 p-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
          style={{
            background: open ? "#1e6ff0" : "rgba(255,255,255,0.06)",
            color: open ? "#fff" : "rgba(255,255,255,0.4)",
          }}
        >
          {step.id}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground">{step.title}</span>
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(30,111,240,0.12)", color: "#1e6ff0" }}>
                <Lock className="w-2.5 h-2.5" /> LOCKED
              </span>
            )}
            {step.free && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>
                FREE PREVIEW
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/30 shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5">
          {isLocked ? (
            <PaywallOverlay onUnlock={onUnlock} />
          ) : (
            <CodeBlock
            code={step.code}
            language={step.language}
            file={step.file}
            where={step.where}
            insertAfter={step.insertAfter}
          />
          )}
        </div>
      )}
    </div>
  );
}

export default function WizardStep3Guide({ platform, engine, unlocked, unlockedTier, onUnlock, onReset }) {
  const [showPricing, setShowPricing] = useState(false);
  const guide = getGuide(platform?.id, engine?.id);

  // Dev bypass — ?devUnlock=1 in URL unlocks everything without payment
  const isDevUnlock = new URLSearchParams(window.location.search).get("devUnlock") === "1";
  const effectivelyUnlocked = unlocked || isDevUnlock;

  if (!guide) {
    return (
      <div className="text-center py-12 rounded-2xl border border-white/8">
        <p className="text-muted-foreground mb-4">No guide available yet for this combination.</p>
        <button onClick={onReset} className="text-sm text-primary hover:underline">Try another combination</button>
      </div>
    );
  }

  const freeCount = guide.steps.filter(s => s.free).length;
  const lockedCount = guide.steps.filter(s => !s.free).length;

  return (
    <div>
      {/* Guide header */}
      <div className="rounded-2xl border p-5 mb-6" style={{ borderColor: `${guide.deadlineColor}25`, background: `${guide.deadlineColor}06` }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-1 rounded text-[9px] font-mono font-black uppercase"
              style={{ color: guide.deadlineColor, background: `${guide.deadlineColor}18` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: guide.deadlineColor }} />
              {guide.deadline}
            </div>
            <h2 className="text-lg font-black text-foreground mb-2">{guide.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{guide.intro}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/6">
          <div className="text-xs font-mono text-muted-foreground">
            <span style={{ color: "#00FF88" }}>{freeCount} steps free</span>
            {" · "}
            <span style={{ color: "#1e6ff0" }}>{lockedCount} steps locked</span>
          </div>
          {!effectivelyUnlocked && (
            <button
              onClick={() => setShowPricing(!showPricing)}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs text-white transition-all hover:opacity-90"
              style={{ background: "#1e6ff0" }}
            >
              Unlock Full Guide ↓
            </button>
          )}
          {effectivelyUnlocked && (
            <span className="ml-auto text-xs font-mono text-green-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {isDevUnlock ? "DEV UNLOCK" : unlockedTier?.label + " unlocked"}
            </span>
          )}
        </div>
      </div>

      {/* Inline pricing panel */}
      {showPricing && !effectivelyUnlocked && (
        <div className="rounded-2xl border border-white/10 bg-white/2 p-5 mb-6">
          <PricingTiers onSelect={(tier) => { onUnlock(tier); setShowPricing(false); }} />
        </div>
      )}

      {/* Dev unlock banner */}
      {isDevUnlock && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-2 mb-4 flex items-center gap-2">
          <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider">🔧 DEV MODE — all steps unlocked (remove ?devUnlock=1 to test paywall)</span>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3 mb-8">
        {guide.steps.map((step) => (
          <StepCard key={step.id} step={step} unlocked={effectivelyUnlocked} onUnlock={onUnlock} />
        ))}
      </div>

      {/* Sovereign Forge offer — shown after unlock */}
      {effectivelyUnlocked && <SovereignForgeOffer />}

      {/* Footer actions */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-white/8">
        <button onClick={onReset} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Try another platform
        </button>
        <a
          href="/IntelligenceCentre"
          className="text-sm text-primary hover:underline"
        >
          Full Intelligence Centre →
        </a>
      </div>
    </div>
  );
}