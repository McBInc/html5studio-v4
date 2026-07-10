"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink } from "lucide-react";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import RegistryHeader from '@/components/registry/RegistryHeader';
import MobileTestPanel from '@/components/registry/MobileTestPanel';
import RevenueRigorPanel from '@/components/registry/RevenueRigorPanel';
import IPProtectionPanel from '@/components/registry/IPProtectionPanel';
import AuditTrailPanel from '@/components/registry/AuditTrailPanel';

// Demo fallback so the page is useful even without DB data
const DEMO_REPORT = {
  cert_id: "WGL-CERT-2026-AAA-8801",
  studio_name: "Famobi",
  game_title: "Stack Jump Pro",
  health_score: 95,
  tier: "AAA",
  status: "live",
  dcf_valuation: 2642800,
  arpdau: 0.15,
  dau_projection: 48200,
  platforms: ["Meta", "Poki", "CrazyGames", "Discord", "TikTok"],
  dip_patent_status: "certified",
  dip_copyright_status: "certified",
  dip_cert_standard: "DIP-S2",
  issued_date: "2026-03-15",
  expires_date: "2027-03-15",
  video_report_url: null,
  audit_checks: [],
};

export default function Registry() {
  // Read cert ID from URL query param: /Registry?certId=WGL-CERT-2026-AAA-8801
  const certId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("certId")
    : null;

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["cert-report", certId],
    queryFn: () => certId
      ? base44.entities.CertReport.filter({ cert_id: certId })
      : Promise.resolve([]),
    enabled: !!certId,
  });

  const report = reports[0] || (certId ? null : DEMO_REPORT);

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">

        {/* Page label */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Universal Certification Registry
          </span>
          <span className="text-muted-foreground/20 text-xs">·</span>
          <span className="text-[10px] font-mono text-muted-foreground/40">Source of Truth</span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-7 h-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}

        {/* Not found */}
        {!isLoading && certId && !report && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <AlertTriangle className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-muted-foreground font-mono text-sm">No certification found for <strong>{certId}</strong></p>
            <a href="/CertBadgePreview" className="text-primary text-xs font-mono flex items-center gap-1 hover:underline">
              View badge preview <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        )}

        {/* Report */}
        {!isLoading && report && (
          <>
            {!certId && (
              <div className="mb-6 px-4 py-2.5 rounded-lg border border-amber-400/20 bg-amber-400/5 text-[11px] font-mono text-amber-400/80">
                Demo mode — no certId in URL. Append <code>?certId=WGL-CERT-2026-AAA-8801</code> to load a real record.
              </div>
            )}

            <RegistryHeader report={report} />

            {/* Two-column grid: video + revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MobileTestPanel videoUrl={report.video_report_url} />
              <RevenueRigorPanel report={report} />
            </div>

            {/* IP Protection */}
            <div className="mb-6">
              <IPProtectionPanel report={report} />
            </div>

            {/* Audit trail */}
            <AuditTrailPanel checks={report.audit_checks} />

            {/* Balance Sheet Asset Certificate */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 rounded-2xl border border-white/10 bg-white/2 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/8">
                <h2 className="text-sm font-bold">Certified Balance Sheet Asset Certificate</h2>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">Formatted as a formal financial document for GAAP intangible asset classification</p>
              </div>
              <div className="divide-y divide-white/6">
                {[
                  { label: "Certification ID",   value: report.cert_id,           note: "Unique database anchor" },
                  { label: "Asset Class",         value: "Identifiable Intangible Asset", note: "GAAP ASC 985" },
                  { label: "Valuation (DCF NPV)", value: report.dcf_valuation ? `$${report.dcf_valuation.toLocaleString()}` : "—", note: `ARPDAU $${report.arpdau ?? 0.15}` },
                  { label: "Rigor Rating",        value: `${report.tier || "—"} — Forensic Grade`, note: "Alpha-9 test standard" },
                  { label: "Legal Seal",          value: `${report.dip_cert_standard || "DIP"} Certified Standard`, note: "Patent + copyright validated" },
                  { label: "Issuing Authority",   value: "HTML5STUDIO · WebGL Certification Authority", note: "" },
                  { label: "Valid Until",         value: report.expires_date ? new Date(report.expires_date).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "2-digit" }) : "—", note: "" },
                ].map(({ label, value, note }) => (
                  <div key={label} className="flex items-start justify-between px-5 py-3.5">
                    <span className="text-xs font-mono text-muted-foreground w-44 flex-shrink-0">{label}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-foreground">{value}</span>
                      {note && <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">{note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}