import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Radio } from "lucide-react";

const headlines = [
  {
    source: "Meta Developer Blog",
    date: "Jan 2026",
    color: "#0082FB",
    headline: "Instant Games WebGL SDK v8.0 Mandatory by September 30 — Legacy Builds Will Be Rejected",
    excerpt: "All Instant Games must migrate to SDK v8.0 or face automatic delisting. Zero-permissions handshake is now enforced at the platform level.",
    tag: "DEADLINE",
    tagColor: "#EE1D52",
  },
  {
    source: "Discord Developer Portal",
    date: "Feb 2026",
    color: "#5865F2",
    headline: "The Activities Nightmare Split: Granular Permission Scopes Now Required for All Embedded Apps",
    excerpt: "Discord's Feb 25 API overhaul splits monolithic permissions into granular scopes. Apps using legacy auth will break silently with no error returned.",
    tag: "BREAKING",
    tagColor: "#FF9500",
  },
  {
    source: "EU Digital Markets Act",
    date: "Mar 2026",
    color: "#00FF88",
    headline: "DMA Article 7 Interoperability Mandates: Game Publishers Must Provide Certified Compliance Proof",
    excerpt: "The European Commission confirms platforms must enforce interoperability compliance. Non-certified titles face removal across all EU storefronts.",
    tag: "REGULATORY",
    tagColor: "#5865F2",
  },
  {
    source: "YouTube PlayAbles",
    date: "Feb 2026",
    color: "#FF0000",
    headline: "YouTube Playables Enforces Strict 15MB Bundle Limit — Oversized Builds Blocked at Ingestion",
    excerpt: "YouTube's ingestion pipeline now hard-blocks uploads exceeding 15MB. Relative path errors in WebGL builds cause silent load failure on mobile.",
    tag: "ENFORCEMENT",
    tagColor: "#FF6B00",
  },
  {
    source: "TikTok For Developers",
    date: "Jan 2026",
    color: "#EE1D52",
    headline: "TikTok Mini-Game SDK: Touch-Action CSS Requirement Causing Mass Swipe-to-Exit Failures",
    excerpt: "Missing touch-action CSS declarations cause the native swipe gesture to fire inside the WebGL canvas, triggering unintended app exits mid-session.",
    tag: "BUG ALERT",
    tagColor: "#EE1D52",
  },
  {
    source: "Telegram Web Apps",
    date: "Mar 2026",
    color: "#229ED9",
    headline: "Telegram Mini Apps SDK 7.0 Enforced — Older WebApp Bridges Produce Silent Payment Failures",
    excerpt: "The Telegram Stars Payment Bridge requires Storebridge.jslib injection. Builds on WebApp SDK below 7.0 will silently fail all in-app transactions.",
    tag: "CRITICAL",
    tagColor: "#EE1D52",
  },
];

export default function NewsSection() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      {/* Red alert ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-destructive/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-full">
            <Radio className="w-3.5 h-3.5 text-destructive animate-pulse" />
            <span className="text-xs font-mono text-destructive uppercase tracking-widest">Live Intelligence Feed</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-destructive/30 to-transparent" />
        </motion.div>

        {/* Big headline cards */}
        <div className="space-y-4">
          {headlines.map((item, i) => (
            <motion.div
              key={item.headline}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="group cursor-pointer border rounded-xl px-6 py-5 transition-all duration-300 hover:border-opacity-60"
              style={{
                borderColor: expanded === i ? `${item.color}50` : "rgba(255,255,255,0.07)",
                backgroundColor: expanded === i ? `${item.color}06` : "rgba(255,255,255,0.01)",
              }}
            >
              <div className="flex items-start gap-5">
                {/* Source + date */}
                <div className="hidden sm:flex flex-col items-end shrink-0 w-28 pt-0.5">
                  <span className="text-[10px] font-mono font-bold" style={{ color: item.color }}>
                    {item.source}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono mt-0.5">{item.date}</span>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: `${item.color}30` }} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-1">
                    <span
                      className="shrink-0 mt-0.5 text-[9px] font-black font-mono px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${item.tagColor}20`, color: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-white transition-colors">
                      {item.headline}
                    </h3>
                  </div>

                  {expanded === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-muted-foreground leading-relaxed mt-3 pl-[calc(9px+0.75rem)]"
                    >
                      {item.excerpt}
                    </motion.p>
                  )}
                </div>

                {/* Expand indicator */}
                <ExternalLink
                  className="shrink-0 w-4 h-4 mt-1 transition-colors"
                  style={{ color: expanded === i ? item.color : "rgba(255,255,255,0.2)" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom pull-quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-lg sm:text-xl font-semibold text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            These aren't warnings. They're already active.{" "}
            <span className="text-foreground">
              If your build hasn't been audited against 2026 standards, it's already failing.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}