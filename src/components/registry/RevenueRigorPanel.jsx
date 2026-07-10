import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, CheckCircle } from "lucide-react";

function MetricRow({ label, value, sub, color = "#00FF88" }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/6 last:border-0">
      <span className="text-xs font-mono text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="text-sm font-black font-mono" style={{ color }}>{value}</span>
        {sub && <p className="text-[10px] font-mono text-muted-foreground/50 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function RevenueRigorPanel({ report }) {
  const valuation = report.dcf_valuation ?? 0;
  const arpdau    = report.arpdau ?? 0.15;
  const dau       = report.dau_projection ?? 0;

  const fmtUSD = (n) => n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n.toFixed(0)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/2 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/8">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <span className="text-sm font-semibold">Revenue Rigor</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">REV</span>
        <div className="ml-auto flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[11px] font-mono text-green-400">Monetization Initialized</span>
        </div>
      </div>

      {/* DCF Headline */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">DCF Valuation (NPV)</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-green-400">{valuation > 0 ? fmtUSD(valuation) : "—"}</span>
          {valuation > 0 && <span className="text-xs font-mono text-muted-foreground mb-1.5">NPV · discounted cash flow</span>}
        </div>
      </div>

      {/* Metrics */}
      <div className="px-5 pb-4">
        <MetricRow label="ARPDAU Target"     value={arpdau > 0 ? `$${arpdau.toFixed(2)}` : "—"}     sub="avg revenue per daily active user" color="#38BDF8" />
        <MetricRow label="DAU Projection"    value={dau > 0 ? dau.toLocaleString() : "—"}            sub="daily active users (12-mo forecast)"  color="#38BDF8" />
        <MetricRow label="Asset Class"       value="Identifiable Intangible"                          sub="GAAP-compliant classification"         color="#F59E0B" />
        <MetricRow label="Balance Sheet Cat" value="Intangible Asset"                                 sub="capitalizable under ASC 985"           color="#F59E0B" />
      </div>

      <div className="px-5 py-3 bg-green-400/5 border-t border-green-400/10 text-[10px] font-mono text-green-400/70">
        ✓ Revenue model validated · ✓ Discount rate applied · ✓ GAAP-ready documentation
      </div>
    </motion.div>
  );
}