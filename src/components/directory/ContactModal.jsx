import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SERVICES = [
  "WebGL Compliance Audit",
  "SDK Migration (Meta Sept 30)",
  "Discord Activities API Split Fix",
  "TikTok Build Certification",
  "Telegram SDK 7.0 Upgrade",
  "EU DMA Compliance Package",
  "Full Platform Certification (DIP Seal)",
  "General Inquiry",
];

export default function ContactModal({ studio, onClose }) {
  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    serviceInterest: SERVICES[0],
    message: `Hi,\n\nI noticed ${studio?.name || "your studio"} is listed in the HTML5STUDIO Game Industry Directory and wanted to reach out about our WebGL compliance certification services.\n\nWe specialise in helping studios pass platform audits, fix SDK deprecations, and achieve DIP certification across Meta, Discord, TikTok and more.\n\nWould love to connect.`,
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const res = await base44.functions.invoke("contactStudio", {
      studioName: studio.name,
      studioWebsite: studio.website,
      ...form,
    });
    if (res.data?.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg rounded-2xl border overflow-hidden"
          style={{ background: "#0a0d1a", borderColor: "rgba(30,111,240,0.25)" }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(30,111,240,0.15)", background: "rgba(30,111,240,0.05)" }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" style={{ color: "#1e6ff0" }} />
                <span className="text-[9px] font-mono font-black uppercase tracking-widest" style={{ color: "#1e6ff0" }}>Directory Outreach</span>
              </div>
              <h3 className="text-base font-bold text-foreground">{studio?.name}</h3>
              {studio?.website && (
                <p className="text-xs text-muted-foreground mt-0.5">{studio.website}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {status === "success" ? (
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }}>
                <CheckCircle className="w-7 h-7" style={{ color: "#00FF88" }} />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Outreach Logged</h4>
              <p className="text-sm text-muted-foreground">Your message has been sent and this studio has been marked as contacted in the directory.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "rgba(30,111,240,0.15)", color: "#1e6ff0", border: "1px solid rgba(30,111,240,0.25)" }}>
                Back to Directory
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Risk context */}
              {studio?.compliance_risks?.length > 0 && (
                <div className="rounded-lg p-3 flex gap-2.5" style={{ background: "rgba(238,29,82,0.07)", border: "1px solid rgba(238,29,82,0.2)" }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#EE1D52" }} />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#EE1D52" }}>Detected compliance risks for this studio:</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{studio.compliance_risks.join(" · ")}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Your Name</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
                    placeholder="Jane Smith"
                    value={form.senderName}
                    onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Your Email *</label>
                  <input
                    required
                    type="email"
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
                    placeholder="you@html5studio.com"
                    value={form.senderEmail}
                    onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Service Interest</label>
                <select
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50"
                  value={form.serviceInterest}
                  onChange={(e) => setForm({ ...form, serviceInterest: e.target.value })}
                  style={{ background: "#0f1220" }}
                >
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">Message *</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 resize-none font-mono"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-destructive">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1e6ff0, #1558c4)", color: "#fff" }}
              >
                <Send className="w-4 h-4" />
                {status === "sending" ? "Sending..." : "Send Outreach Email"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}