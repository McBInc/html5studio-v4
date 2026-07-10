import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Send, FlaskConical, AlertTriangle, CheckCircle2, Loader2, Mail, User, Globe } from "lucide-react";

const RISK_COLORS = {
  "LOW RISK": "#00FF88",
  "MODERATE RISK": "#F1C40F",
  "HIGH RISK": "#FF6B00",
  "CRITICAL EXPOSURE": "#EE1D52",
};

function ResultRow({ r }) {
  const statusConfig = {
    sent:     { color: "#00FF88", icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Sent" },
    dry_run:  { color: "#1e6ff0", icon: <FlaskConical className="w-3.5 h-3.5" />, label: "Preview" },
    failed:   { color: "#EE1D52", icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "Failed" },
  };
  const cfg = statusConfig[r.status] || statusConfig.failed;
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: `${cfg.color}20`, background: `${cfg.color}05` }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-foreground">{r.studio || "Unknown Studio"}</span>
          <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full"
            style={{ color: cfg.color, background: `${cfg.color}15` }}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0">{r.email}</span>
      </div>
      {r.subject && (
        <p className="text-[11px] font-mono text-muted-foreground mb-1">
          <span className="text-muted-foreground/50">Subject: </span>{r.subject}
        </p>
      )}
      {r.body_preview && (
        <p className="text-[11px] text-muted-foreground/70 leading-relaxed border-t border-white/5 pt-2 mt-2 italic">
          "{r.body_preview}"
        </p>
      )}
      {r.reason && (
        <p className="text-[11px] text-destructive/70 mt-1">Error: {r.reason}</p>
      )}
    </div>
  );
}

export default function DMAOutreachPanel() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    base44.entities.StudioSubmission.list('-created_date', 200)
      .then(data => {
        const eligible = data.filter(s => s.contact_email && s.contact_email.includes('@'));
        setStudios(eligible);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const alreadySent = studios.filter(s => s.raw_answers?.dma_outreach_sent);
  const pending = studios.filter(s => !s.raw_answers?.dma_outreach_sent);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectAll) { setSelectedIds([]); setSelectAll(false); }
    else { setSelectedIds(pending.map(s => s.id)); setSelectAll(true); }
  };

  const runOutreach = async (dry_run) => {
    setRunning(true);
    setResults(null);
    const payload = {
      dry_run,
      studio_ids: selectedIds.length > 0 ? selectedIds : undefined,
    };
    const res = await base44.functions.invoke('dmaOutreachAgent', payload);
    setResults(res.data);
    setRunning(false);
    if (!dry_run) {
      // Refresh studio list
      const data = await base44.entities.StudioSubmission.list('-created_date', 200);
      setStudios(data.filter(s => s.contact_email && s.contact_email.includes('@')));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div>
      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Studios w/ Email", value: studios.length, color: "#1e6ff0", icon: <User className="w-4 h-4" /> },
          { label: "Pending Outreach", value: pending.length, color: "#F1C40F", icon: <Mail className="w-4 h-4" /> },
          { label: "Already Contacted", value: alreadySent.length, color: "#00FF88", icon: <CheckCircle2 className="w-4 h-4" /> },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border p-4 text-center" style={{ borderColor: `${stat.color}20`, background: `${stat.color}06` }}>
            <div className="flex justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
            <div className="text-2xl font-black font-mono mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Context Block */}
      <div className="rounded-xl border p-5 mb-6" style={{ borderColor: "rgba(30,111,240,0.2)", background: "rgba(30,111,240,0.04)" }}>
        <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Campaign Brief</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The agent poses as a <strong className="text-foreground">research analyst</strong> running an industry benchmarking 
          report on <strong className="text-foreground">EU DMA Article 7 compliance readiness</strong> among WebGL and HTML5 
          game studios. Each email is personalised to the studio's platform stack and risk profile. 
          The ask is lightweight — 3 questions — with a soft CTA for a complimentary compliance audit.
        </p>
      </div>

      {/* Studio Selection */}
      {pending.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">
              Pending Studios <span className="text-muted-foreground font-normal">({pending.length})</span>
            </p>
            <button onClick={toggleAll}
              className="text-[10px] font-mono px-3 py-1 rounded-full border transition-all"
              style={{ borderColor: "rgba(30,111,240,0.4)", color: "#1e6ff0", background: selectAll ? "rgba(30,111,240,0.12)" : "transparent" }}>
              {selectAll ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {pending.map(studio => {
              const riskColor = RISK_COLORS[studio.risk_label] || "#888";
              const isSelected = selectedIds.includes(studio.id);
              return (
                <button key={studio.id} onClick={() => toggleSelect(studio.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                  style={{
                    borderColor: isSelected ? "rgba(30,111,240,0.4)" : "rgba(255,255,255,0.07)",
                    background: isSelected ? "rgba(30,111,240,0.08)" : "rgba(255,255,255,0.02)",
                  }}>
                  <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: isSelected ? "#1e6ff0" : "rgba(255,255,255,0.2)", background: isSelected ? "#1e6ff0" : "transparent" }}>
                    {isSelected && <div className="w-2 h-2 rounded-sm bg-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{studio.studio_name || "Unknown"}</span>
                      {studio.risk_label && (
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                          style={{ color: riskColor, background: `${riskColor}15` }}>
                          {studio.risk_label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-mono">{studio.contact_email}</span>
                      {studio.platforms?.length > 0 && (
                        <span className="text-[10px] text-muted-foreground/40">{studio.platforms.slice(0,2).join(", ")}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 p-6 text-center mb-6">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: "#00FF88" }} />
          <p className="text-sm text-muted-foreground">All studios with emails have been contacted.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => runOutreach(true)}
          disabled={running || (selectedIds.length === 0 && pending.length === 0)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm border transition-all hover:bg-white/5"
          style={{ borderColor: "rgba(30,111,240,0.4)", color: running ? "rgba(255,255,255,0.3)" : "#1e6ff0" }}>
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
          Preview Emails (Dry Run)
        </button>
        <button
          onClick={() => runOutreach(false)}
          disabled={running || (selectedIds.length === 0 && pending.length === 0)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all"
          style={{
            background: running ? "rgba(238,29,82,0.1)" : "#EE1D52",
            color: running ? "rgba(255,255,255,0.3)" : "#fff"
          }}>
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {running ? "Sending..." : `Send to ${selectedIds.length > 0 ? selectedIds.length : pending.length} Studio${(selectedIds.length || pending.length) !== 1 ? "s" : ""}`}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="rounded-xl border border-white/10 p-5">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <p className="text-sm font-bold text-foreground">{results.message}</p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,255,136,0.12)", color: "#00FF88" }}>
              {results.sent} sent
            </span>
            {results.failed > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: "rgba(238,29,82,0.12)", color: "#EE1D52" }}>
                {results.failed} failed
              </span>
            )}
          </div>
          <div className="space-y-3">
            {(results.results || []).map((r, i) => <ResultRow key={i} r={r} />)}
          </div>
        </div>
      )}

      {/* Already Sent */}
      {alreadySent.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-3">Already Contacted</p>
          <div className="space-y-2">
            {alreadySent.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/5 bg-white/2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#00FF88" }} />
                <span className="text-sm text-foreground">{s.studio_name || "Unknown"}</span>
                <span className="text-[10px] font-mono text-muted-foreground/40">{s.contact_email}</span>
                <span className="ml-auto text-[9px] font-mono text-muted-foreground/30">
                  {s.raw_answers?.dma_outreach_sent ? new Date(s.raw_answers.dma_outreach_sent).toLocaleDateString() : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}