import React from "react";
import { Check, Zap, Star, Shield } from "lucide-react";

// Replace these with your actual Stripe Payment Link URLs
const TIERS = [
  {
    id: "single",
    label: "Single Platform Guide",
    price: 17,
    was: 49,
    paymentLink: "https://buy.stripe.com/7sY28r0wn2BA7ak2Id7bW00",
    icon: Zap,
    color: "#1e6ff0",
    description: "Full implementation guide for one platform across all engines.",
    features: [
      "All steps unlocked for your chosen platform",
      "Every engine variant (Unity, Phaser, Godot, etc.)",
      "Copy-paste code with exact file locations",
      "Lifetime access — updates included",
    ],
    cta: "Unlock This Platform — $17",
  },
  {
    id: "multi",
    label: "Multi Platform Bundle",
    price: 37,
    was: 97,
    paymentLink: "https://buy.stripe.com/8x28wPbb1a42eCM6Yt7bW01",
    icon: Star,
    color: "#FF6B00",
    badge: "POPULAR",
    description: "Pick any 3 platforms. Full guides for all.",
    features: [
      "All steps for 3 platforms of your choice",
      "Every engine variant for all 3",
      "Copy-paste code with exact file locations",
      "Lifetime access — updates included",
    ],
    cta: "Unlock 3 Platforms — $37",
  },
  {
    id: "all",
    label: "All Platforms Bundle",
    price: 69,
    was: 197,
    paymentLink: "https://buy.stripe.com/4gM5kDbb13FE9is82x7bW02",
    icon: Shield,
    color: "#9B59B6",
    badge: "BEST VALUE",
    description: "Every platform, every engine. The complete compliance toolkit.",
    features: [
      "All platforms: Meta, TikTok, Discord, YouTube, Poki, CrazyGames, LinkedIn",
      "Every engine variant",
      "Copy-paste code with exact file locations",
      "Lifetime access — all future platforms included",
    ],
    cta: "Unlock Everything — $69",
  },
];

export default function PricingTiers({ onSelect }) {
  const handleSelect = (tier) => {
    window.open(tier.paymentLink, '_blank');
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-5">
        <p className="text-sm font-bold text-foreground">Stuck in a deployment sandbox?</p>
        <p className="text-xs text-muted-foreground mt-1">
          Get the exact code, exact file, exact location. No more guessing.
        </p>
      </div>

      {TIERS.map((tier) => {
        const Icon = tier.icon;
        return (
          <div
            key={tier.id}
            className="rounded-2xl border p-5 transition-all cursor-pointer hover:scale-[1.01]"
            style={{
              borderColor: `${tier.color}30`,
              background: `${tier.color}06`,
            }}
            onClick={() => handleSelect(tier)}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ background: `${tier.color}15`, borderColor: `${tier.color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color: tier.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-black text-sm text-foreground">{tier.label}</span>
                  {tier.badge && (
                    <span
                      className="text-[9px] font-mono font-black px-2 py-0.5 rounded"
                      style={{ background: `${tier.color}20`, color: tier.color }}
                    >
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{tier.description}</p>
                <ul className="space-y-1 mb-4">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: tier.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs line-through text-muted-foreground/40 font-mono">${tier.was}</span>
                    <span className="text-2xl font-black text-foreground">${tier.price}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/50">one-time</span>
                  </div>
                  <button
                    className="ml-auto px-4 py-2 rounded-lg font-black text-xs text-white transition-all hover:opacity-90 flex items-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}
                    onClick={(e) => { e.stopPropagation(); handleSelect(tier); }}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}