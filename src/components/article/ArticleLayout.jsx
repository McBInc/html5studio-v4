import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';

import { ChevronDown, ChevronUp, ArrowLeft, Radio, Shield, ExternalLink } from "lucide-react";
import NewsTicker from "../landing/NewsTicker";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import CopyProtectionOverlay from "./CopyProtectionOverlay";
import ProtectedCodeBlock from "./ProtectedCodeBlock";
import PaywallGate from "./PaywallGate";
import WatermarkedCode from "./WatermarkedCode";

function TLDRBox({ points, color }) {
  return (
    <div
      className="rounded-xl border p-5 mb-10"
      style={{ borderColor: `${color}35`, background: `${color}08` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
        <span className="text-[10px] font-black font-mono uppercase tracking-widest" style={{ color }}>TL;DR</span>
      </div>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
            <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: color }} />
            <span dangerouslySetInnerHTML={{ __html: p }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function IntelligenceNote({ children }) {
  return (
    <div
      className="rounded-xl border p-5 my-8"
      style={{ borderColor: "rgba(238,29,82,0.25)", background: "rgba(238,29,82,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Radio className="w-3.5 h-3.5" style={{ color: "#EE1D52" }} />
        <span className="text-[10px] font-black font-mono uppercase tracking-widest" style={{ color: "#EE1D52" }}>Intelligence Note</span>
      </div>
      <div className="text-sm text-foreground/80 leading-relaxed">{children}</div>
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-white/8">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-[10px] font-black font-mono uppercase tracking-widest text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-foreground/75 leading-snug" dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <pre
      className="rounded-xl border p-5 my-6 overflow-x-auto text-sm font-mono leading-relaxed"
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)", color: "#00FF88" }}
    >
      <code>{code}</code>
    </pre>
  );
}

function WizardCTA({ platform, engine, previewCode, language = "js" }) {
  return (
    <div className="my-8 rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(30,111,240,0.3)", background: "rgba(30,111,240,0.04)" }}>
      {/* Blurred preview */}
      {previewCode && (
        <div className="relative overflow-hidden" style={{ maxHeight: 120 }}>
          <pre className="p-5 text-xs font-mono leading-relaxed select-none pointer-events-none"
            style={{ background: "rgba(0,0,0,0.4)", color: "#00FF88", filter: "blur(4px)", userSelect: "none" }}>
            <code>{previewCode}</code>
          </pre>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(4,7,18,0.98) 80%)" }} />
        </div>
      )}
      {/* CTA */}
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-foreground mb-1">Get the full implementation guide</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Step-by-step code with exact file locations, context, and engine-specific variants — in the Compliance Wizard.
          </p>
        </div>
        <a
          href="/compliance-wizard"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "#1e6ff0" }}
        >
          Open Compliance Wizard →
        </a>
      </div>
    </div>
  );
}

function RelatedIntelligence({ siblings, crossPillar }) {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden my-10">
      <div className="px-5 py-3 border-b border-white/8" style={{ background: "rgba(255,255,255,0.02)" }}>
        <span className="text-[10px] font-black font-mono uppercase tracking-widest text-muted-foreground">Related Intelligence</span>
      </div>
      <div className="p-5 space-y-4">
        {siblings.length > 0 && (
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-2">Same Pillar</p>
            <div className="space-y-2">
              {siblings.map((s) => (
                <Link key={s.slug} href={`/article/${s.slug}`} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group">
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  {s.title}
                  {s.urgency && <span className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded ml-1" style={{ background: s.urgency === "critical" ? "rgba(238,29,82,0.15)" : "rgba(255,107,0,0.15)", color: s.urgency === "critical" ? "#EE1D52" : "#FF6B00" }}>{s.urgency.toUpperCase()}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
        {crossPillar.length > 0 && (
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-2">Cross-Pillar</p>
            <div className="space-y-2">
              {crossPillar.map((s) => (
                <Link key={s.slug} href={`/article/${s.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30 group-hover:bg-muted-foreground transition-colors" />
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FAQSection({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="my-10">
      <h2 className="text-xl font-bold mb-5">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border overflow-hidden transition-all"
            style={{ borderColor: open === i ? "rgba(30,111,240,0.3)" : "rgba(255,255,255,0.07)" }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{faq.q}</span>
              {open === i ? <ChevronUp className="w-4 h-4 shrink-0 text-primary" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5" style={{ background: "rgba(30,111,240,0.04)" }}>
                <p className="pt-3" dangerouslySetInnerHTML={{ __html: faq.a }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CTABlock({ color = "#1e6ff0" }) {
  return (
    <div
      className="rounded-2xl border p-8 text-center my-10"
      style={{ borderColor: `${color}30`, background: `${color}08` }}
    >
      <Shield className="w-8 h-8 mx-auto mb-3" style={{ color }} />
      <h3 className="text-lg font-bold mb-2">Certify Your Build</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
        HTML5STUDIO runs an automated compliance scan against your live build — no code access required. Get a full report and remediation patch within 24 hours.
      </p>
      <a
        href="/#cta"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
        style={{ background: color, color: "#fff" }}
      >
        Run Free Compliance Scan
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

export default function ArticleLayout({ article }) {
  const { title, pillar, cluster, lastVerified, color = "#1e6ff0", urgency, tldr, body, relatedSiblings = [], relatedCrossPillar = [], faqs = [], isProtected = false } = article;

  const urgencyConfig = {
    critical: { label: "CRITICAL", color: "#EE1D52", bg: "rgba(238,29,82,0.12)" },
    hot: { label: "HOT", color: "#FF6B00", bg: "rgba(255,107,0,0.12)" },
    active: { label: "ACTIVE", color: "#1e6ff0", bg: "rgba(30,111,240,0.12)" },
  };
  const urg = urgencyConfig[urgency];

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {isProtected && <CopyProtectionOverlay />}
      <NewsTicker />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* Back nav */}
        <Link href="/IntelligenceCentre" className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Intelligence Centre
        </Link>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">{pillar}</span>
          <span className="text-muted-foreground/25">·</span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">{cluster}</span>
          {urg && (
            <>
              <span className="text-muted-foreground/25">·</span>
              <span className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded" style={{ background: urg.bg, color: urg.color }}>{urg.label}</span>
            </>
          )}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3"
        >
          {title}
        </motion.h1>

        {/* Last verified */}
        <p className="text-[10px] font-mono text-muted-foreground/40 mb-8">
          Last verified against source documentation · {lastVerified} · HTML5STUDIO Intelligence Centre
        </p>

        <div className="h-px bg-border mb-8" />

        {/* TL;DR */}
        <TLDRBox points={tldr} color={color} />

        {/* Article body — rendered via render props pattern */}
        <div className="prose-custom">
          {body({ IntelligenceNote, DataTable, CodeBlock, WizardCTA })}
        </div>

        {/* Related */}
        <RelatedIntelligence siblings={relatedSiblings} crossPillar={relatedCrossPillar} />

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* CTA */}
        <CTABlock color={color} />

        {/* Footer stamp */}
        <p className="text-center text-[10px] font-mono text-muted-foreground/30 mt-8">
          Last verified · {lastVerified} · HTML5STUDIO Intelligence Centre
        </p>
      </div>

      <Footer />
    </div>
  );
}

export { TLDRBox, IntelligenceNote, DataTable, CodeBlock, WizardCTA, RelatedIntelligence, FAQSection, CTABlock, ProtectedCodeBlock, PaywallGate, WatermarkedCode };