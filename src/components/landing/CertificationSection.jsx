import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Copy, CheckCheck, ExternalLink, Clock, Hash, Layers, Cpu, Globe } from "lucide-react";

const CERT_SEAL = "https://media.base44.com/images/public/user_6861c38c47c16b00ec24a571/3479ccf6a_WebGL_HTML5STUDIO_Certified_Seal.png";

const TX_HASH = "0xA3F9E8D24C71B605...9F2A";
const BLOCK = "48,291,043";
const TIMESTAMP = "2026-03-18 · 14:22:07 UTC";
const FROM = "EQBx9kF…mP7R";
const CONTRACT = "EQD_TON…H5S_REG";
const GAS = "0.0042 TON";
const CERT_ID = "WGL-2026-94F3-A812";

const features = [
  { icon: ShieldCheck, label: "DIP Certified deployment package", color: "#00FF88" },
  { icon: Globe,       label: "META 2026 / EU DMA compliant",     color: "#0082FB" },
  { icon: Layers,      label: "TON Registry verified title",       color: "#229ED9" },
  { icon: Cpu,         label: "Mobile-optimized WASM output",      color: "#FF6B00" },
  { icon: ShieldCheck, label: "Apple Pay & Google Pay ready",      color: "#00FF88" },
  { icon: Globe,       label: "Cross-platform one-click deploy",   color: "#0082FB" },
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={handleCopy} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
      {copied
        ? <CheckCheck className="w-3 h-3" style={{ color: "#00FF88" }} />
        : <Copy className="w-3 h-3 text-white" />}
    </button>
  );
}

function TxRow({ label, value, mono = true, accent, children }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 py-2.5" style={{ borderBottom: "1px solid rgba(34,158,217,0.08)" }}>
      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(34,158,217,0.5)" }}>{label}</span>
      <div className="flex items-center min-w-0">
        {children ?? (
          <span
            className={`text-xs truncate ${mono ? "font-mono" : "font-medium"}`}
            style={{ color: accent || "rgba(255,255,255,0.85)" }}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

function TonExplorer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0b1120 0%, #080e1a 100%)",
        border: "1px solid rgba(34,158,217,0.3)",
        boxShadow: "0 0 60px rgba(34,158,217,0.08), 0 40px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Top bar — TON Explorer chrome */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "linear-gradient(90deg, rgba(34,158,217,0.12) 0%, rgba(0,130,251,0.08) 100%)",
          borderBottom: "1px solid rgba(34,158,217,0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* TON diamond logo */}
          <div className="flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 56 56" fill="none">
              <path d="M28 4L52 16V40L28 52L4 40V16L28 4Z" fill="rgba(34,158,217,0.2)" stroke="#229ED9" strokeWidth="2"/>
              <path d="M28 4L52 16L28 28L4 16L28 4Z" fill="rgba(34,158,217,0.35)"/>
              <path d="M4 16L28 28V52L4 40V16Z" fill="rgba(34,158,217,0.15)"/>
              <path d="M52 16L28 28V52L52 40V16Z" fill="rgba(34,158,217,0.25)"/>
            </svg>
            <span className="text-xs font-bold" style={{ color: "#229ED9" }}>TON Explorer</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(34,158,217,0.12)", color: "rgba(34,158,217,0.7)", border: "1px solid rgba(34,158,217,0.2)" }}>Mainnet</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00FF88", boxShadow: "0 0 6px #00FF88" }} />
          <span className="text-[9px] font-mono" style={{ color: "rgba(0,255,136,0.7)" }}>CONFIRMED</span>
          <a href="#" className="ml-2 opacity-40 hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </a>
        </div>
      </div>

      {/* Transaction badge */}
      <div className="px-6 pt-5 pb-3 flex items-start gap-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }}
        >
          <ShieldCheck className="w-5 h-5" style={{ color: "#00FF88" }} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-white">Certification Registry Entry</span>
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "#00FF88" }}
            >
              SUCCESS
            </span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
            HTML5STUDIO · DIP Compliance Protocol v2.4
          </span>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[9px] font-mono mb-0.5" style={{ color: "rgba(34,158,217,0.5)" }}>Block</div>
          <div className="text-xs font-mono font-bold" style={{ color: "#229ED9" }}>#{BLOCK}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-1" style={{ height: 1, background: "rgba(34,158,217,0.12)" }} />

      {/* TX fields */}
      <div className="px-6 pb-2">
        <TxRow label="Tx Hash">
          <span className="text-xs font-mono truncate" style={{ color: "#4A9EFF" }}>{TX_HASH}</span>
          <CopyButton value={TX_HASH} />
        </TxRow>
        <TxRow label="Timestamp">
          <Clock className="w-3 h-3 mr-1.5" style={{ color: "rgba(255,255,255,0.3)" }} />
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.7)" }}>{TIMESTAMP}</span>
        </TxRow>
        <TxRow label="From">
          <span className="text-xs font-mono" style={{ color: "#4A9EFF" }}>{FROM}</span>
          <CopyButton value={FROM} />
        </TxRow>
        <TxRow label="Contract">
          <span className="text-xs font-mono" style={{ color: "#4A9EFF" }}>{CONTRACT}</span>
          <CopyButton value={CONTRACT} />
        </TxRow>
        <TxRow label="Cert ID">
          <Hash className="w-3 h-3 mr-1.5" style={{ color: "rgba(255,255,255,0.3)" }} />
          <span className="text-xs font-mono font-bold" style={{ color: "#00FF88" }}>{CERT_ID}</span>
          <CopyButton value={CERT_ID} />
        </TxRow>
        <TxRow label="Gas Used" value={GAS} accent="rgba(255,107,0,0.9)" />
        <TxRow label="Platforms">
          <div className="flex gap-1.5 flex-wrap">
            {["Meta","Discord","TikTok","Telegram","YouTube","LinkedIn"].map((p) => (
              <span key={p} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(34,158,217,0.1)", border: "1px solid rgba(34,158,217,0.2)", color: "rgba(34,158,217,0.85)" }}>{p}</span>
            ))}
          </div>
        </TxRow>
      </div>

      {/* Compliance payload */}
      <div className="mx-6 mb-6 mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(34,158,217,0.12)", background: "rgba(0,0,0,0.35)" }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(34,158,217,0.1)", background: "rgba(34,158,217,0.05)" }}>
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "rgba(34,158,217,0.5)" }}>Input Data · Compliance Payload</span>
        </div>
        <div className="px-4 py-3 font-mono text-[10px] leading-relaxed" style={{ color: "rgba(0,255,136,0.7)" }}>
          <span style={{ color: "rgba(34,158,217,0.5)" }}>{"{"}</span><br />
          <span className="pl-4"><span style={{ color: "#4A9EFF" }}>"cert_id"</span>: <span style={{ color: "#FFB347" }}>"{CERT_ID}"</span>,</span><br />
          <span className="pl-4"><span style={{ color: "#4A9EFF" }}>"score"</span>: <span style={{ color: "#00FF88" }}>97</span>,</span><br />
          <span className="pl-4"><span style={{ color: "#4A9EFF" }}>"standard"</span>: <span style={{ color: "#FFB347" }}>"DIP-v2.4"</span>,</span><br />
          <span className="pl-4"><span style={{ color: "#4A9EFF" }}>"eu_dma"</span>: <span style={{ color: "#00FF88" }}>true</span>,</span><br />
          <span className="pl-4"><span style={{ color: "#4A9EFF" }}>"meta_2026"</span>: <span style={{ color: "#00FF88" }}>true</span>,</span><br />
          <span className="pl-4"><span style={{ color: "#4A9EFF" }}>"wasm_hash"</span>: <span style={{ color: "#FFB347" }}>"0xF3A9...D812"</span></span><br />
          <span style={{ color: "rgba(34,158,217,0.5)" }}>{"}"}</span>
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)" }} />
    </motion.div>
  );
}

export default function CertificationSection() {
  return (
    <section id="certification" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(34,158,217,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-full mb-4 uppercase tracking-wider">
            Blockchain Certified
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Immutable TON Registry Entry
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every certified build is written permanently to the TON blockchain — an immutable proof of compliance that lives forever on-chain.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: TON Explorer simulation */}
          <TonExplorer />

          {/* RIGHT: copy + features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl" style={{ background: "rgba(0,255,136,0.25)" }} />
                <img src={CERT_SEAL} alt="Cert Seal" className="relative w-20 h-20 object-contain" style={{ filter: "drop-shadow(0 0 16px rgba(0,255,136,0.5))" }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">The DIP Certified Standard</h3>
                <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "#00FF88" }}>
                  On-Chain · Permanent · Verifiable
                </span>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Every certified build receives a unique immutable TON registry entry,
              a compliance score, and a deployment package ready for every major
              platform. Your game is transformed from a liability into a{" "}
              <strong className="text-foreground">million-dollar asset</strong>.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {features.map(({ icon: Icon, label, color }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}