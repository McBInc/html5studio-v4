import React from "react";
import { AlertTriangle, XCircle, CheckCircle2, ArrowDown, CreditCard, Trophy, Users, Flame } from "lucide-react";

const COMPLY_OR_DIE = [
  { label: "EU DMA Article 7", detail: "No consent gate = your game is blocked in the EU. Full stop.", critical: true },
  { label: "GDPR / TCF 2.0", detail: "Personalised ads without consent = regulatory fine. No exceptions.", critical: true },
  { label: "COPPA Age Gate", detail: "Under-13 data collection without gate = app removal + liability.", critical: true },
  { label: "Meta SDK v8.0", detail: "Sept 30, 2026 deadline. Old SDK = game delisted from Instant Games.", critical: false },
  { label: "TikTok Touch-Action", detail: "Missing CSS = gesture layer hijacks all input. Game unplayable.", critical: false },
  { label: "Discord CSP Headers", detail: "Wrong headers = WebGL context silently fails. Nothing loads.", critical: false },
];

const WHAT_BREAKS = [
  "Game loads but consent popup never fires",
  "EU users get a blank screen — no error shown",
  "Ad SDK initialises before consent = instant violation",
  "WebGL context destroyed by missing CSP directive",
  "Touch input stolen by platform gesture layer",
  "SDK auth fails silently — leaderboards gone",
];

export default function HeroDisturbSection({ onStartDemo }) {
  return (
    <div className="space-y-16">

      {/* HERO */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border" style={{ background: "rgba(220,38,38,0.1)", borderColor: "rgba(220,38,38,0.25)" }}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono text-red-400 uppercase tracking-wider">Comply or Die — No Middle Ground</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-6">
          Your game is live.<br />
          <span style={{ color: "#ef4444" }}>It's not compliant.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
          Without the right consent code in place, your game doesn't just risk a fine —<br />
          <strong className="text-foreground">it doesn't load at all for EU users.</strong>
        </p>
        <p className="text-sm text-muted-foreground/60 max-w-xl mx-auto">
          EU DMA Article 7 and GDPR TCF 2.0 require a consent gate to fire before any SDK initialises, any ad loads, or any player data is touched. This isn't a legal grey area. It's a hard technical requirement.
        </p>
      </div>

      {/* COMPLY OR DIE GRID */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-foreground mb-2">The compliance requirements killing deployments right now</h2>
          <p className="text-sm text-muted-foreground">Red = your game fails to load. Orange = your game gets removed.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {COMPLY_OR_DIE.map((item, i) => (
            <div key={i} className="rounded-xl border p-4 flex items-start gap-3"
              style={{
                borderColor: item.critical ? "rgba(220,38,38,0.3)" : "rgba(255,165,0,0.25)",
                background: item.critical ? "rgba(220,38,38,0.05)" : "rgba(255,165,0,0.04)",
              }}>
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: item.critical ? "#ef4444" : "#f97316" }} />
              <div>
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT BREAKS */}
      <div className="rounded-2xl border border-white/8 p-6" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="flex items-center gap-3 mb-5">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-foreground">What actually happens when compliance is missing</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {WHAT_BREAKS.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-red-500 font-mono text-xs mt-0.5">✕</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* EU DMA CONSENT SPOTLIGHT */}
      <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(30,111,240,0.35)", background: "rgba(30,111,240,0.06)" }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background: "rgba(30,111,240,0.15)" }}>⚖️</div>
          <div>
            <h3 className="font-black text-foreground text-lg mb-2">EU DMA Article 7 — the one that matters most</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Under DMA Article 7, gatekeepers (Meta, TikTok, Google) must present a consent layer <strong className="text-foreground">before</strong> any tracking, ad personalisation, or cross-platform data processing occurs. As a developer distributing on their platforms, your game inherits this obligation.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              {[
                { icon: "🚫", title: "No consent gate", desc: "Game blocked for all EU users. Platform must enforce this." },
                { icon: "⚡", title: "Wrong timing", desc: "Consent must fire before SDK init — not after. Order matters." },
                { icon: "📋", title: "No documented signal", desc: "You must log the consent state. Verbal compliance isn't enough." },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-white/8 p-3" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <div className="text-lg mb-1">{item.icon}</div>
                  <p className="text-xs font-bold text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60 italic">
              The consent code isn't just about the popup UI — it's about the signal flowing into every SDK call that follows. Our guides show you the exact code architecture required.
            </p>
          </div>
        </div>
      </div>

      {/* PLAYER TRUST / CHARGEBACK CRISIS */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(220,38,38,0.35)", background: "rgba(0,0,0,0.4)" }}>
        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.08)" }}>
          <Flame className="w-5 h-5 text-red-400" />
          <h3 className="font-black text-foreground text-lg">The crisis nobody is talking about yet</h3>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            A player downloads your game. They pay for a weapon upgrade, a battle pass, extra lives. They grind the leaderboard for weeks. They're in a guild. They have teammates who depend on them.
          </p>
          <p className="text-foreground font-bold text-sm">
            Then one morning — the game is gone.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Removed for non-compliance. No warning. The platform enforced DMA Article 7 or COPPA and the app was delisted overnight. The player's progress, their team, their purchases — wiped. And if the game refreshes its session without a proper consent state, even a live game can silently lose a player's data and status mid-session.
          </p>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: CreditCard, color: "#ef4444", title: "Chargeback cascade", desc: "Player paid real money. Game gone. Every IAP becomes a chargeback dispute. Stripe and PayPal will close the account." },
              { icon: Trophy,     color: "#f97316", title: "Leaderboard wipe", desc: "Non-compliant session refresh clears player state. Top players lose their rank with no recourse and nowhere to report it." },
              { icon: Users,      color: "#f59e0b", title: "Team abandonment", desc: "Guild and team mechanics collapse. Players who depended on each other lose weeks of coordination with zero notice." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl border border-white/8 p-4" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <Icon className="w-5 h-5 mb-2" style={{ color: item.color }} />
                  <p className="text-sm font-bold text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: "rgba(30,111,240,0.3)", background: "rgba(30,111,240,0.06)" }}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">This is why we built the Studio Directory.</strong> There is currently no public place where players can check whether a game is compliant before they spend money on it. No registry. No badge. No verification. A player has no way to know if their investment is safe.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              The WGL-CERT certification and Studio Directory exist precisely to solve this — so players can look up a game before they commit, and studios can prove their compliance status publicly.
            </p>
            <a href="/Registry" className="inline-flex items-center gap-2 mt-3 text-xs font-mono text-primary hover:underline">
              View the Compliance Registry →
            </a>
          </div>
        </div>
      </div>

      {/* CTA TO DEMO */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">See exactly what needs to change in your code — interactive, engine-specific, free preview</p>
        <button
          onClick={onStartDemo}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #1e6ff0, #1e6ff0cc)" }}
        >
          Show Me What's Missing In My Code
          <ArrowDown className="w-5 h-5" />
        </button>
        <p className="text-xs text-muted-foreground/40 mt-3">Select your engine → select your platform → see the exact fix</p>
      </div>

    </div>
  );
}