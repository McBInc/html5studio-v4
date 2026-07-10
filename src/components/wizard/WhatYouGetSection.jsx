import React, { useState } from "react";
import { Check, Zap, Star, Shield, ArrowRight } from "lucide-react";

const OUTCOMES = [
  "Exact file path — not 'somewhere in your project', the precise file",
  "Before/After code diff — see your file before and after the change",
  "EU DMA Article 7 consent gate for every platform",
  "GDPR TCF 2.0 signal wired into your ad and analytics calls",
  "COPPA age gate — protects you from under-13 data liability",
  "Platform-specific SDK migration (Meta v8, TikTok, Discord scope split)",
  "CSP headers that stop WebGL from silently dying on Discord",
  "Touch-action CSS that stops TikTok stealing your input",
  "Tested against all major engines: Unity, Phaser, Godot, Construct, Cocos, PlayCanvas",
  "Lifetime access — all future platform updates included",
];

const TIERS = [
  {
    id: "single",
    label: "Single Platform",
    price: 17,
    was: 49,
    paymentLink: "https://buy.stripe.com/7sY28r0wn2BA7ak2Id7bW00",
    icon: Zap,
    color: "#1e6ff0",
    who: "You deploy to one platform only",
    includes: "Full guide for 1 platform × all engines",
  },
  {
    id: "multi",
    label: "Multi Platform",
    price: 37,
    was: 97,
    paymentLink: "https://buy.stripe.com/8x28wPbb1a42eCM6Yt7bW01",
    icon: Star,
    color: "#FF6B00",
    badge: "POPULAR",
    who: "You're on 2–3 platforms",
    includes: "Full guides for 3 platforms × all engines",
  },
  {
    id: "all",
    label: "All Platforms",
    price: 69,
    was: 197,
    paymentLink: "https://buy.stripe.com/4gM5kDbb13FE9is82x7bW02",
    icon: Shield,
    color: "#9B59B6",
    badge: "BEST VALUE",
    who: "You're on multiple platforms or scaling fast",
    includes: "Every platform, every engine, every future update",
  },
];

export default function WhatYouGetSection({ onStartDemo, onDFY }) {
  const [hoveredTier, setHoveredTier] = useState(null);

  return (
    <div className="space-y-14">

      {/* WHAT YOU GET */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-foreground mb-3">What's inside the compliance guides</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Not documentation. Not a checklist. Exact code, exact file, exact location — for every engine.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(0,0,0,0.25)" }}>
          <div className="grid sm:grid-cols-2 gap-3">
            {OUTCOMES.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TIERS */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-foreground mb-3">Choose your stage</h2>
          <p className="text-muted-foreground text-sm">One-time payment. Lifetime access.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className="rounded-2xl border p-5 cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  borderColor: hoveredTier === tier.id ? tier.color : `${tier.color}30`,
                  background: hoveredTier === tier.id ? `${tier.color}10` : `${tier.color}05`,
                }}
                onMouseEnter={() => setHoveredTier(tier.id)}
                onMouseLeave={() => setHoveredTier(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: `${tier.color}15`, borderColor: `${tier.color}30` }}>
                    <Icon className="w-4 h-4" style={{ color: tier.color }} />
                  </div>
                  {tier.badge && (
                    <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded" style={{ background: `${tier.color}20`, color: tier.color }}>
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="font-black text-foreground mb-1">{tier.label}</p>
                <p className="text-xs text-muted-foreground mb-3">{tier.who}</p>
                <p className="text-xs font-mono mb-4" style={{ color: `${tier.color}99` }}>{tier.includes}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xs line-through text-muted-foreground/40 font-mono">${tier.was}</span>
                  <span className="text-2xl font-black text-foreground">${tier.price}</span>
                </div>
                <button
                  onClick={() => window.open(tier.paymentLink, '_blank')}
                  className="w-full py-2.5 rounded-lg font-bold text-xs text-white transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}
                >
                  Unlock → ${tier.price}
                </button>
              </div>
            );
          })}
        </div>

        {/* DFY Option */}
        <div className="rounded-2xl border p-5 text-center" style={{ borderColor: "rgba(155,89,182,0.3)", background: "rgba(155,89,182,0.05)" }}>
          <div className="text-2xl mb-2">🛡️</div>
          <h3 className="font-black text-foreground text-lg mb-2">Done For You — Results Based Outcome</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
            Don't want to touch your code at all? We implement the full compliance suite for you — consent gates, SDK migrations, CSP headers — and deliver a signed compliance report. You pay for the outcome, not the hours.
          </p>
          <button
            onClick={onDFY}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #9B59B6, #6C3483)" }}
          >
            Get a Free Compliance Scan First
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground/40 mt-2">Alpha-9 scanner — free, instant, no code required</p>
        </div>
      </div>

    </div>
  );
}