import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const ALL_ENGINES = [
  { id: "unity",      name: "Unity WebGL",           icon: "🎮", note: "Most common. Requires SDK template update + bridge refactor." },
  { id: "phaser",     name: "Phaser 3 / Vanilla JS",  icon: "⚡", note: "Direct JS integration. Cleanest migration path." },
  { id: "godot",      name: "Godot 4 / HTML5 Export", icon: "🔷", note: "Godot export with JS bridge. Custom SDK loader needed." },
  { id: "construct",  name: "Construct 3",            icon: "🧱", note: "Plugin-based SDK. Requires custom plugin update." },
  { id: "cocos",      name: "Cocos Creator",           icon: "🥥", note: "Cocos template modification + SDK bridge." },
  { id: "playcanvas", name: "PlayCanvas",              icon: "🌐", note: "Cloud-based engine. SDK wired via script asset or custom plugin." },
  { id: "unreal",     name: "Unreal Engine (HTML5)",   icon: "⚙️", note: "Pixel Streaming / HTML5 export. Large bundle — see size warnings.", sizeWarning: true },
];

// Size-constrained platforms (strict MB limits)
const SIZE_CONSTRAINED = ["youtube", "linkedin"];

const ENGINES = {
  meta:       ["unity","phaser","godot","construct","playcanvas","unreal"],
  tiktok:     ["unity","phaser","godot","construct","cocos","playcanvas","unreal"],
  discord:    ["unity","phaser","godot","construct","cocos","playcanvas","unreal"],
  youtube:    ["unity","phaser","godot","construct","cocos","playcanvas","unreal"],
  poki:       ["unity","phaser","godot","construct","cocos","playcanvas","unreal"],
  crazygames: ["unity","phaser","godot","construct","cocos","playcanvas","unreal"],
  linkedin:   ["unity","phaser","godot","construct","playcanvas","unreal"],
};

function UnrealWarningModal({ platform, onDismiss, onContinue }) {
  const isConstrained = SIZE_CONSTRAINED.includes(platform?.id);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="relative w-full max-w-md rounded-2xl border p-6"
        style={{ borderColor: "rgba(255,107,0,0.4)", background: "hsl(240 8% 7%)" }}>
        <button onClick={onDismiss} className="absolute top-4 right-4 text-muted-foreground/40 hover:text-muted-foreground">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,107,0,0.15)" }}>
            <AlertTriangle className="w-5 h-5" style={{ color: "#FF6B00" }} />
          </div>
          <div>
            <h3 className="font-black text-foreground">Unreal Engine Size Warning</h3>
            <p className="text-xs text-muted-foreground">for {platform?.name}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Unreal HTML5 exports typically produce <strong className="text-foreground">150MB–500MB+ bundles</strong>. 
          {isConstrained
            ? <> <strong className="text-destructive">{platform?.name} enforces a strict size limit</strong> — standard Unreal builds will be rejected at ingestion.</>
            : <> {platform?.name} doesn't have a hard limit, but large bundles significantly impact load time and user drop-off.</>
          }
        </p>

        <div className="rounded-xl border p-4 mb-5"
          style={{ borderColor: "rgba(30,111,240,0.25)", background: "rgba(30,111,240,0.06)" }}>
          <p className="text-xs font-bold text-foreground mb-1">Our Compliance Package can help</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Run a free compliance scan to get a full report on what's causing bloat — then our team will package an optimised, platform-ready build for you.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href="/sept30-risk-assessor"
            className="w-full text-center py-3 rounded-lg font-black text-sm text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1e6ff0, #1458c0)" }}
          >
            Run Free Compliance Scan →
          </a>
          <button
            onClick={onContinue}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground border border-white/8 hover:border-white/20 transition-all"
          >
            Continue anyway — show me the guide
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WizardStep2Engine({ platform, onSelect, onBack }) {
  const [unrealWarning, setUnrealWarning] = useState(false);

  const engineIds = ENGINES[platform?.id] || [];
  const engines = ALL_ENGINES.filter(e => engineIds.includes(e.id));

  const handleSelect = (e) => {
    if (e.id === "unreal") {
      setUnrealWarning(true);
    } else {
      onSelect(e);
    }
  };

  const unrealEngine = ALL_ENGINES.find(e => e.id === "unreal");

  return (
    <div>
      {unrealWarning && (
        <UnrealWarningModal
          platform={platform}
          onDismiss={() => setUnrealWarning(false)}
          onContinue={() => { setUnrealWarning(false); onSelect(unrealEngine); }}
        />
      )}

      <button onClick={onBack} className="text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground mb-6 flex items-center gap-1 transition-colors">
        ← Back
      </button>
      <h2 className="text-xl font-black mb-1">Select your game engine</h2>
      <p className="text-sm text-muted-foreground mb-6">
        For <span className="text-foreground font-semibold">{platform?.name}</span> — pick your engine to get a tailored guide.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {engines.map((e) => (
          <button
            key={e.id}
            onClick={() => handleSelect(e)}
            className="text-left rounded-2xl border p-4 transition-all hover:border-primary/40 hover:bg-primary/5 group"
            style={{
              borderColor: e.sizeWarning ? "rgba(255,107,0,0.2)" : "rgba(255,255,255,0.1)",
              background: e.sizeWarning ? "rgba(255,107,0,0.03)" : "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{e.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{e.name}</span>
                  {e.sizeWarning && (
                    <span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded flex items-center gap-1"
                      style={{ color: "#FF6B00", background: "rgba(255,107,0,0.12)" }}>
                      <AlertTriangle className="w-2.5 h-2.5" /> SIZE WARNING
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{e.note}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}