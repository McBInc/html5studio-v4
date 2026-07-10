import React from "react";
import { Shield, Zap, Lock, ChevronRight, Coins } from "lucide-react";

export default function SovereignForgeOffer() {
  return (
    <div
      className="rounded-2xl border p-6 mt-8"
      style={{
        borderColor: "rgba(155,89,182,0.35)",
        background: "linear-gradient(135deg, rgba(155,89,182,0.08), rgba(30,111,240,0.06))",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: "rgba(155,89,182,0.15)", borderColor: "rgba(155,89,182,0.3)" }}>
          <Shield className="w-6 h-6" style={{ color: "#9B59B6" }} />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase mb-1"
            style={{ background: "rgba(0,255,136,0.12)", color: "#00FF88" }}>
            ✦ Included with your purchase
          </div>
          <h3 className="text-lg font-black text-foreground">Sovereign Forge — Free Trial</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your game assets, registered on-chain. Built for developers serious about IP protection and investor-readiness.
          </p>
        </div>
      </div>

      {/* What it does */}
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          {
            icon: Lock,
            color: "#9B59B6",
            title: "On-Chain Asset Registry",
            desc: "Upload your game code, assets, and metadata — registered immutably on the TON blockchain with a timestamped proof of ownership.",
          },
          {
            icon: Coins,
            color: "#F1C40F",
            title: "TON IP Protection",
            desc: "Each asset gets a DIP certificate linking your studio identity to the registered work — critical for funding due diligence.",
          },
          {
            icon: Zap,
            color: "#1e6ff0",
            title: "Investor-Ready Dossier",
            desc: "Auto-generated asset report showing IP provenance, tech stack, and compliance status — shareable with any fund or publisher.",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="rounded-xl border p-4"
              style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${item.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <p className="text-xs font-bold text-foreground mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-white/6">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            After unlocking your compliance guide, you'll receive a <strong className="text-foreground">free trial invite</strong> to the Sovereign Forge — start registering your assets and protecting your IP today.
          </p>
        </div>
        <a
          href="/AmbassadorProgram"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90"
          style={{ background: "rgba(155,89,182,0.2)", color: "#9B59B6", border: "1px solid rgba(155,89,182,0.3)" }}
        >
          Learn more <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}