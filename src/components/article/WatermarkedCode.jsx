import React from "react";

export default function WatermarkedCode({ code, userId = "UNLICENSED" }) {
  // Inject watermark comments into code
  const watermarkedCode = `// ──────────────────────────────────────────────────────
// HTML5STUDIO Proprietary Implementation
// Licensed to: ${userId}
// Generated: ${new Date().toISOString().split('T')[0]}
// Unauthorized distribution violates license terms
// ──────────────────────────────────────────────────────

${code}

// ──────────────────────────────────────────────────────
// © HTML5STUDIO ${new Date().getFullYear()} · All Rights Reserved
// This code is traceable to license: ${userId}
// ──────────────────────────────────────────────────────`;

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden my-6 select-none">
      <div className="bg-black/40 px-4 py-2 border-b border-white/8 flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          Licensed Code · Traceable Distribution
        </span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(238,29,82,0.15)", color: "#EE1D52" }}>
          ID: {userId}
        </span>
      </div>
      <pre
        className="p-5 overflow-x-auto text-sm font-mono leading-relaxed"
        style={{ background: "rgba(0,0,0,0.4)", color: "#00FF88" }}
      >
        <code>{watermarkedCode}</code>
      </pre>
    </div>
  );
}