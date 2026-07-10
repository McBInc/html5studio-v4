import React from "react";
import { motion } from "framer-motion";
import { Radio, Shield, CheckCircle, XCircle, Clock } from "lucide-react";
import UniversalCertBadge from "../UniversalCertBadge";

const STATUS_CONFIG = {
  live:    { label: "LIVE",    color: "#00FF88", Icon: CheckCircle },
  pending: { label: "PENDING", color: "#F59E0B", Icon: Clock },
  revoked: { label: "REVOKED", color: "#EE1D52", Icon: XCircle },
};

export default function RegistryHeader({ report }) {
  const s = STATUS_CONFIG[report.status] || STATUS_CONFIG.live;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mb-16"
    >
      {/* Badge */}
      <div className="flex-shrink-0">
        <UniversalCertBadge
          certId={report.cert_id}
          healthScore={report.health_score}
          studioName={report.studio_name}
          size={260}
        />
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        {/* Live pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border"
          style={{ borderColor: `${s.color}30`, background: `${s.color}10` }}>
          <Radio className="w-3 h-3 animate-pulse" style={{ color: s.color }} />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest" style={{ color: s.color }}>
            {s.label}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
          {report.game_title || report.studio_name}
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-5">{report.studio_name}</p>

        {/* ID row */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/3 font-mono text-xs">
            <span className="text-muted-foreground">CERT ID · </span>
            <span className="text-foreground font-bold">{report.cert_id}</span>
          </div>
          <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/3 font-mono text-xs">
            <span className="text-muted-foreground">TIER · </span>
            <span className="font-black" style={{ color: report.health_score >= 90 ? "#00FF88" : report.health_score >= 80 ? "#38BDF8" : "#F59E0B" }}>
              {report.tier || "—"}
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/3 font-mono text-xs">
            <span className="text-muted-foreground">ISSUED · </span>
            <span className="text-foreground">{report.issued_date ? new Date(report.issued_date).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "2-digit" }) : "—"}</span>
          </div>
        </div>

        {/* Platforms */}
        {report.platforms?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {report.platforms.map(p => (
              <span key={p} className="px-2 py-1 rounded text-[10px] font-mono border border-white/8 bg-white/3 text-muted-foreground">{p}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}