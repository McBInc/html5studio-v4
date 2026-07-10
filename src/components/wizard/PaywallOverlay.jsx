import React from "react";
import PricingTiers from "./PricingTiers";

export default function PaywallOverlay({ onUnlock }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden border"
      style={{ borderColor: "rgba(30,111,240,0.3)", background: "rgba(30,111,240,0.04)" }}
    >
      {/* Blurred preview */}
      <div className="p-4 blur-sm select-none pointer-events-none font-mono text-xs text-muted-foreground leading-relaxed">
        <div className="text-green-400/60">// Full implementation code</div>
        <div>{"async function setup() {"}</div>
        <div className="pl-4">{"const sdk = await Platform.initializeAsync();"}</div>
        <div className="pl-4">{"const perms = await sdk.requestPermissions(["}</div>
        <div className="pl-8">{"'PROFILE', 'USER_DATA'"}</div>
        <div className="pl-4">{"]);"}</div>
        <div>{"}"}</div>
      </div>

      {/* Pricing overlay */}
      <div
        className="absolute inset-0 overflow-y-auto"
        style={{ background: "rgba(4,7,18,0.92)", backdropFilter: "blur(4px)" }}
      >
        <div className="p-4">
          <PricingTiers onSelect={(tier) => onUnlock(tier)} />
        </div>
      </div>
    </div>
  );
}