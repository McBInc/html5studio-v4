import React from "react";
import { Lock, Zap, CheckCircle2, ExternalLink } from "lucide-react";

export default function PaywallGate({ title, previewLines = 3 }) {
  return (
    <div className="rounded-2xl border overflow-hidden my-8"
      style={{ borderColor: "rgba(30,111,240,0.25)", background: "linear-gradient(135deg, rgba(30,111,240,0.08) 0%, rgba(238,29,82,0.04) 100%)" }}>
      
      {/* Preview snippet */}
      <div className="p-6 border-b border-white/8 relative">
        <div className="text-xs font-mono text-muted-foreground/40 mb-2">PREVIEW</div>
        <div className="space-y-2">
          {[...Array(previewLines)].map((_, i) => (
            <div key={i} className="h-4 rounded" style={{ 
              background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              width: `${Math.random() * 30 + 60}%`
            }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95" />
      </div>

      {/* Paywall CTA */}
      <div className="p-8 text-center">
        <Lock className="w-10 h-10 mx-auto mb-4" style={{ color: "#1e6ff0" }} />
        <h3 className="text-xl font-bold text-foreground mb-2">
          {title || "Full Implementation Code"}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
          Access complete technical implementations, copy-paste ready code, and automated patch delivery with a certification subscription.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-6 max-w-lg mx-auto">
          {[
            "Copy/paste enabled",
            "Automated patches",
            "Priority support"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-foreground/75">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#00FF88" }} />
              {feature}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/#pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "#1e6ff0", color: "#fff" }}
          >
            <Zap className="w-4 h-4" />
            View Pricing
          </a>
          <a
            href="/#cta"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-foreground hover:bg-white/5 transition-all text-sm font-semibold"
          >
            Start Free Scan
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-[10px] font-mono text-muted-foreground/40 mt-6">
          Subscription includes full code library access + automated compliance monitoring
        </p>
      </div>
    </div>
  );
}