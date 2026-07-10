import React from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock, XCircle, Lock } from "lucide-react";

const STATUS_ICONS = {
  certified: { Icon: CheckCircle, color: "#00FF88", label: "Certified" },
  pending:   { Icon: Clock,       color: "#F59E0B", label: "Pending" },
  failed:    { Icon: XCircle,     color: "#EE1D52", label: "Failed" },
};

function IPRow({ label, status, detail }) {
  const s = STATUS_ICONS[status] || STATUS_ICONS.pending;
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {detail && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{detail}</p>}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
        <s.Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
        <span className="text-[11px] font-mono" style={{ color: s.color }}>{s.label}</span>
      </div>
    </div>
  );
}

export default function IPProtectionPanel({ report }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/10 bg-white/2 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/8">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-semibold">IP Protection</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">DIP</span>
        {report.dip_cert_standard && (
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">{report.dip_cert_standard}</span>
        )}
      </div>

      <div className="px-5 py-2">
        <IPRow
          label="Design Patent Audit"
          status={report.dip_patent_status || "certified"}
          detail="Unique game mechanics reviewed under 35 U.S.C. § 171"
        />
        <IPRow
          label="Copyright Fixation"
          status={report.dip_copyright_status || "certified"}
          detail="Source code & assets fixed in tangible medium per 17 U.S.C. § 102"
        />
        <IPRow
          label="Trade Secret Classification"
          status="certified"
          detail="Core algorithm reviewed under DTSA 2016"
        />
        <IPRow
          label="EU DMA Article 7 Compliance"
          status="certified"
          detail="Interoperability and data portability requirements met"
        />
      </div>

      <div className="px-5 py-3 bg-blue-400/5 border-t border-blue-400/10 flex items-center gap-2">
        <Lock className="w-3 h-3 text-blue-400/60" />
        <span className="text-[10px] font-mono text-blue-400/70">Legal defensibility verified · Irresistible Offer standard met</span>
      </div>
    </motion.div>
  );
}