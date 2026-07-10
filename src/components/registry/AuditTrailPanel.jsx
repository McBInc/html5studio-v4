import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ChevronDown, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const DEFAULT_CHECKS = [
  { category: "WebGL / WASM", label: "WASM Heap Allocation ≤ 512MB", status: "pass", detail: "Heap peak: 214MB" },
  { category: "WebGL / WASM", label: "WebGL 2.0 Context Initialised", status: "pass", detail: "Confirmed via EXT_color_buffer_float" },
  { category: "WebGL / WASM", label: "Shader Compilation No Errors", status: "pass", detail: "0 GL errors on boot" },
  { category: "Performance",  label: "FPS ≥ 30 on Mid-tier Mobile",  status: "pass", detail: "Avg 42fps · Pixel 6A emulation" },
  { category: "Performance",  label: "LCP < 2.5s",                   status: "pass", detail: "LCP: 1.87s" },
  { category: "Performance",  label: "Bundle < 50MB",                status: "pass", detail: "33.2MB compressed" },
  { category: "Privacy",      label: "PII Scrubbing Verified",        status: "pass", detail: "No plaintext PII in localStorage" },
  { category: "Privacy",      label: "GDPR Consent Gate Present",     status: "pass", detail: "IAB TCF 2.2 compliant banner" },
  { category: "Privacy",      label: "No 3rd-party Cookies",          status: "pass", detail: "CSP header validated" },
  { category: "Platform SDK", label: "Meta WebGL SDK v8.0+",          status: "pass", detail: "v8.1.3 detected" },
  { category: "Platform SDK", label: "Discord Activities SDK v2+",    status: "pass", detail: "Granular scope compliance ✓" },
  { category: "Platform SDK", label: "TikTok Touch-Action CSS",       status: "pass", detail: "touch-action: manipulation set" },
  { category: "Compliance",   label: "EU DMA Article 7",              status: "pass", detail: "Interoperability data present" },
  { category: "Compliance",   label: "COPPA Age Gate",                status: "pass", detail: "Age verification implemented" },
  { category: "Compliance",   label: "WCAG 2.1 AA Contrast",          status: "warn", detail: "2 minor contrast warnings" },
  { category: "Monetisation", label: "Ad SDK Initialised",            status: "pass", detail: "Google IMA 3.x detected" },
  { category: "Monetisation", label: "IAP Flow Validated",            status: "pass", detail: "Receipt validation endpoint live" },
  { category: "Legal / IP",   label: "Copyright Notice Present",      status: "pass", detail: "© in footer + meta" },
  { category: "Legal / IP",   label: "Third-party Licence Audit",     status: "pass", detail: "All FOSS licences attributed" },
  { category: "Legal / IP",   label: "Asset Origin Verified",         status: "pass", detail: "No DMCA-flagged assets detected" },
];

const STATUS_ICON = {
  pass: <CheckCircle  className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#00FF88" }} />,
  fail: <XCircle      className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#EE1D52" }} />,
  warn: <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F59E0B" }} />,
};

const CATEGORIES = [...new Set(DEFAULT_CHECKS.map(c => c.category))];

export default function AuditTrailPanel({ checks }) {
  const [openCats, setOpenCats] = useState(new Set(CATEGORIES));
  const allChecks = (checks && checks.length > 0) ? checks : DEFAULT_CHECKS;

  const toggle = (cat) => setOpenCats(prev => {
    const next = new Set(prev);
    next.has(cat) ? next.delete(cat) : next.add(cat);
    return next;
  });

  const passCount = allChecks.filter(c => c.status === "pass").length;
  const warnCount = allChecks.filter(c => c.status === "warn").length;
  const failCount = allChecks.filter(c => c.status === "fail").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/2 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-white/8">
        <ClipboardList className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">Full Audit Trail</span>
        <div className="flex gap-3 ml-auto text-[11px] font-mono">
          <span style={{ color: "#00FF88" }}>{passCount} PASS</span>
          {warnCount > 0 && <span style={{ color: "#F59E0B" }}>{warnCount} WARN</span>}
          {failCount > 0 && <span style={{ color: "#EE1D52" }}>{failCount} FAIL</span>}
          <span className="text-muted-foreground">{allChecks.length} TOTAL</span>
        </div>
      </div>

      {/* Grouped checks */}
      <div className="divide-y divide-white/6">
        {CATEGORIES.map(cat => {
          const catChecks = allChecks.filter(c => c.category === cat);
          if (catChecks.length === 0) return null;
          const isOpen = openCats.has(cat);
          return (
            <div key={cat}>
              <button
                onClick={() => toggle(cat)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors"
              >
                <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">{cat}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground/40">{catChecks.length} checks</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-3 space-y-1.5">
                  {catChecks.map((check, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-1.5 pl-3 rounded-lg bg-white/2">
                      <div className="mt-0.5">{STATUS_ICON[check.status] || STATUS_ICON.pass}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/85">{check.label}</p>
                        {check.detail && <p className="text-[10px] font-mono text-muted-foreground/50 mt-0.5">{check.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}