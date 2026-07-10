import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Ban, Radio, ExternalLink } from "lucide-react";
import Link from 'next/link';


const problems = [
  {
    icon: Clock,
    title: "September 30 Sunset",
    description:
      "Major platforms are deprecating legacy WebGL pipelines. Games that aren't compliant will simply stop loading.",
    color: "#1e6ff0",
    slug: "september-30-sunset",
  },
  {
    icon: Ban,
    title: "Deprecated API Calls",
    description:
      "Hidden PII calls, illegal memory operations, and outdated SDK handshakes silently break your builds on mobile.",
    color: "#EE1D52",
    slug: "deprecated-api-calls",
  },
  {
    icon: AlertTriangle,
    title: "EU DMA Compliance",
    description:
      "New interoperability mandates require certified compliance proofs. Non-compliant titles face platform delisting.",
    color: "#FF6B00",
    slug: "eu-dma-article7",
  },
];

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

export default function ProblemSection() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(238,29,82,0.04)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/20 rounded-full mb-4 uppercase tracking-wider">
            ⚠ Critical Alert
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            The WebGL Sunset Is Real
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Thousands of live games are at risk. If your build isn't certified
            compliant, it's only a matter of time before it goes dark.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">

          {/* LEFT: 3 problem cards */}
          <div className="flex flex-col gap-5">
            {problems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <Link
                      to={`/article/${item.slug}`}
                      className="inline-block mt-3 text-xs font-mono underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: item.color }}
                    >
                      Read full article →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pull-quote */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-sm font-semibold text-foreground/50 leading-relaxed pt-2"
            >
              These aren't warnings. They're already active.{" "}
              <span className="text-foreground/80">
                If your build hasn't been audited against 2026 standards, it's already failing.
              </span>
            </motion.p>
          </div>

          {/* RIGHT: Live Intelligence Feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Feed header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border border-destructive/30 rounded-full">
                <Radio className="w-3 h-3 text-destructive animate-pulse" />
                <span className="text-[9px] font-mono text-destructive uppercase tracking-widest">Live Intelligence Feed</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-destructive/30 to-transparent" />
            </div>

            {/* Articles */}
            <div className="space-y-2">
              {headlines.map((item, i) => (
                <motion.div
                  key={item.headline}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="group cursor-pointer border rounded-xl px-4 py-3.5 transition-all duration-300"
                  style={{
                    borderColor: expanded === i ? `${item.color}50` : "rgba(255,255,255,0.07)",
                    backgroundColor: expanded === i ? `${item.color}06` : "rgba(255,255,255,0.01)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Source */}
                    <div className="hidden sm:flex flex-col items-end shrink-0 w-24 pt-0.5">
                      <span className="text-[9px] font-mono font-bold leading-tight text-right" style={{ color: item.color }}>
                        {item.source}
                      </span>
                      <span className="text-[8px] text-muted-foreground font-mono mt-0.5">{item.date}</span>
                    </div>
                    <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: `${item.color}25` }} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-0.5">
                        <span
                          className="shrink-0 mt-0.5 text-[8px] font-black font-mono px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${item.tagColor}20`, color: item.tagColor }}
                        >
                          {item.tag}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-white transition-colors">
                          {item.headline}
                        </h3>
                      </div>
                      {expanded === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-muted-foreground leading-relaxed mt-2"
                        >
                          {item.excerpt}
                        </motion.p>
                      )}
                    </div>

                    <ExternalLink
                      className="shrink-0 w-3.5 h-3.5 mt-0.5 transition-colors"
                      style={{ color: expanded === i ? item.color : "rgba(255,255,255,0.2)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}