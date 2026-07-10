import React from "react";

const PLATFORMS = [
  {
    id: "meta",
    name: "Meta Instant Games",
    subtitle: "Facebook / Messenger",
    urgency: "DEADLINE SEPT 30",
    urgencyColor: "#EE1D52",
    description: "SDK v8.0 mandatory. Zero-permissions model required. Legacy builds rejected after Sept 30.",
    icon: "📘",
  },
  {
    id: "tiktok",
    name: "TikTok Mini Games",
    subtitle: "TikTok GameDev Platform",
    urgency: "TOUCH-ACTION BUG",
    urgencyColor: "#FF6B00",
    description: "Touch-action CSS requirement causing mass swipe-to-exit failures. SDK integration overhaul needed.",
    icon: "🎵",
  },
  {
    id: "discord",
    name: "Discord Activities",
    subtitle: "Discord GameSDK",
    urgency: "SCOPE SPLIT ACTIVE",
    urgencyColor: "#5865F2",
    description: "Monolithic OAuth scope broken for new users. Granular permission scopes now required across all Activities.",
    icon: "🎮",
  },
  {
    id: "youtube",
    name: "YouTube Playables",
    subtitle: "YouTube GamesDev",
    urgency: "15MB BUNDLE LIMIT",
    urgencyColor: "#FF0000",
    description: "Strict 15MB compressed bundle limit enforced at ingestion. Oversized builds blocked silently.",
    icon: "▶️",
  },
  {
    id: "poki",
    name: "Poki",
    subtitle: "Poki Developer Platform",
    urgency: "SDK REQUIRED",
    urgencyColor: "#00C896",
    description: "Poki SDK integration mandatory for all distributed games. PokiSDK.gameLoadingFinished() lifecycle required.",
    icon: "🟢",
  },
  {
    id: "crazygames",
    name: "CrazyGames",
    subtitle: "CrazyGames SDK",
    urgency: "SDK v3 MIGRATION",
    urgencyColor: "#F39C12",
    description: "CrazyGames SDK v3 required. Ad request lifecycle and gameplay hooks must be implemented correctly.",
    icon: "🎯",
  },
  {
    id: "linkedin",
    name: "LinkedIn Playables",
    subtitle: "LinkedIn B2B Gaming",
    urgency: "NEW PLATFORM",
    urgencyColor: "#0A66C2",
    description: "LinkedIn Playables for B2B lead gen. Strict bundle size, no external network calls, MRAID-compatible builds.",
    icon: "💼",
  },
];

export default function WizardStep1Platform({ onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-black mb-2">Select your deployment platform</h2>
      <p className="text-sm text-muted-foreground mb-6">Which platform are you deploying to?</p>
      <div className="space-y-3">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full text-left rounded-2xl border p-5 transition-all hover:border-primary/40 hover:bg-primary/5 group"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl mt-0.5">{p.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground/60">{p.subtitle}</span>
                  <span
                    className="text-[8px] font-black font-mono px-2 py-0.5 rounded"
                    style={{ color: p.urgencyColor, background: `${p.urgencyColor}18` }}
                  >
                    {p.urgency}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
              <div className="text-muted-foreground/30 group-hover:text-primary transition-colors text-lg">→</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}