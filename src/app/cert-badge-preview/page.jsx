"use client";

import React, { useState, useRef } from "react";
import UniversalCertBadge from "@/components/UniversalCertBadge";
import NewsTicker from "@/components/landing/NewsTicker";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const DEMO_TIERS = [
  { label: "AAA · Score 95", healthScore: 95, certId: "CERT-2026-AAA-0001", studioName: "Famobi" },
  { label: "AA · Score 84", healthScore: 84, certId: "CERT-2026-AA-0014", studioName: "Miniclip" },
  { label: "A · Score 73", healthScore: 73, certId: "CERT-2026-A-0022", studioName: "Kizi Games" },
];

export default function CertBadgePreview() {
  const [score, setScore] = useState(92);
  const [certId, setCertId] = useState("CERT-2026-AAA-0042");
  const [studioName, setStudioName] = useState("Voodoo");
  const [downloading, setDownloading] = useState(false);
  const badgeRef = useRef(null);

  const captureCanvas = async () => {
    const el = badgeRef.current;
    // Render at 2× for high-res
    return html2canvas(el, { scale: 2, backgroundColor: null, useCORS: true });
  };

  const downloadPNG = async () => {
    setDownloading(true);
    const canvas = await captureCanvas();
    const link = document.createElement("a");
    link.download = `${certId || "cert-badge"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloading(false);
  };

  const downloadPDF = async () => {
    setDownloading(true);
    const canvas = await captureCanvas();
    const imgData = canvas.toDataURL("image/png");
    const size = canvas.width / 2; // logical px (we upscaled by 2)
    const mmPerPx = 0.264583;
    const wMm = size * mmPerPx;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [wMm, wMm] });
    pdf.addImage(imgData, "PNG", 0, 0, wMm, wMm);
    pdf.save(`${certId || "cert-badge"}.pdf`);
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-3xl font-black mb-2">Universal Cert Badge</h1>
        <p className="text-muted-foreground text-sm font-mono mb-12">Dynamic SVG component — tier and cert ID driven by database values</p>

        {/* Live configurator */}
        <div className="mb-16 p-6 rounded-2xl border border-white/10 bg-white/2 max-w-xl">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-5">Live Configurator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Health Score: <span className="text-foreground">{score}</span></label>
              <input
                type="range"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>0 — No Cert</span>
                <span style={{ color: "#555" }}>70 — A</span>
                <span style={{ color: "#fff" }}>80 — AA</span>
                <span style={{ color: "#F97316" }}>90 — AAA</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Cert ID</label>
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-foreground outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Studio Name</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-foreground outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <div ref={badgeRef} style={{ display: "inline-block" }}>
              <UniversalCertBadge certId={certId} healthScore={score} studioName={studioName} size={300} />
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadPNG}
                disabled={downloading}
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold border border-white/15 bg-white/5 hover:bg-white/10 text-foreground transition-all disabled:opacity-40"
              >
                {downloading ? "Generating…" : "↓ PNG"}
              </button>
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold border border-white/15 bg-white/5 hover:bg-white/10 text-foreground transition-all disabled:opacity-40"
              >
                {downloading ? "Generating…" : "↓ PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* All three tiers */}
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-8">Tier Reference — Full Size</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEMO_TIERS.map((demo) => (
            <div key={demo.label} className="flex flex-col items-center gap-4">
              <UniversalCertBadge
                certId={demo.certId}
                healthScore={demo.healthScore}
                studioName={demo.studioName}
                size={320}
              />
              <div className="text-center">
                <p className="text-xs font-mono text-muted-foreground">{demo.label}</p>
                <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">{demo.certId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
