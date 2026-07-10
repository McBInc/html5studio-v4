import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, Gamepad2, Cpu, Users, DollarSign } from "lucide-react";

const RISK_COLORS = {
  "LOW RISK":          { color: "#00FF88", bg: "rgba(0,255,136,0.12)" },
  "MODERATE RISK":     { color: "#F1C40F", bg: "rgba(241,196,15,0.12)" },
  "HIGH RISK":         { color: "#FF6B00", bg: "rgba(255,107,0,0.12)"  },
  "CRITICAL EXPOSURE": { color: "#EE1D52", bg: "rgba(238,29,82,0.12)"  },
};

const SEVERITY_COLORS = { critical: "#EE1D52", high: "#FF6B00", medium: "#F1C40F" };

function ScoreBadge({ score, label }) {
  const cfg = RISK_COLORS[label] || { color: "#888", bg: "rgba(136,136,136,0.1)" };
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black font-mono"
        style={{ background: cfg.bg, color: cfg.color }}>
        {score}
      </div>
      <span className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded hidden sm:block"
        style={{ color: cfg.color, background: cfg.bg }}>
        {label || "UNSCORED"}
      </span>
    </div>
  );
}

function GameCard({ game }) {
  const hasCompliance = game.compliance_notes && game.compliance_notes.trim().length > 0;
  return (
    <div className="rounded-lg border border-white/5 p-3"
      style={{ background: hasCompliance ? "rgba(238,29,82,0.03)" : "rgba(255,255,255,0.02)" }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Gamepad2 className="w-3 h-3 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground truncate">{game.title}</span>
          {game.genre && (
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full shrink-0"
              style={{ background: "rgba(30,111,240,0.15)", color: "#1e6ff0" }}>
              {game.genre}
            </span>
          )}
        </div>
        {hasCompliance && (
          <AlertTriangle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
        {game.engine && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Cpu className="w-2.5 h-2.5" />{game.engine}
          </span>
        )}
        {game.monetisation && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <DollarSign className="w-2.5 h-2.5" />{game.monetisation}
          </span>
        )}
        {game.mau_estimate && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users className="w-2.5 h-2.5" />{game.mau_estimate} MAU
          </span>
        )}
      </div>

      {game.platforms?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {game.platforms.map((p, i) => (
            <span key={i} className="text-[8px] font-mono px-1 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
              {p}
            </span>
          ))}
        </div>
      )}

      {hasCompliance && (
        <div className="rounded p-2 mt-1"
          style={{ background: "rgba(238,29,82,0.08)", borderLeft: "2px solid rgba(238,29,82,0.4)" }}>
          <p className="text-[9px] font-mono uppercase tracking-widest text-destructive/70 mb-0.5">Compliance Issue</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">{game.compliance_notes}</p>
        </div>
      )}
    </div>
  );
}

function StudioRow({ studio }) {
  const [open, setOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(true);

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/2 transition-colors"
      >
        <ScoreBadge score={studio.risk_score} label={studio.risk_label} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{studio.name}</p>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {studio.engine && (
              <span className="text-[9px] font-mono text-muted-foreground/50 flex items-center gap-1">
                <Cpu className="w-2.5 h-2.5" />{studio.engine}
              </span>
            )}
            {studio.games?.length > 0 && (
              <span className="text-[9px] font-mono text-primary/60 flex items-center gap-1">
                <Gamepad2 className="w-2.5 h-2.5" />{studio.games.length} game{studio.games.length !== 1 ? 's' : ''}
              </span>
            )}
            {studio.risk_flags?.length > 0 && (
              <span className="text-[9px] font-mono text-destructive/70">
                {studio.risk_flags.length} risk flag{studio.risk_flags.length !== 1 ? 's' : ''}
              </span>
            )}
            {studio.platforms?.length > 0 && (
              <span className="text-[9px] text-muted-foreground/40 truncate">
                {studio.platforms.slice(0, 3).join(", ")}{studio.platforms.length > 3 ? ` +${studio.platforms.length - 3}` : ""}
              </span>
            )}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-4">

          {/* Agent Reasoning */}
          {studio.notes && (
            <div className="rounded-lg p-3 bg-white/2 border border-white/5">
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-1.5">Agent Reasoning</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{studio.notes}</p>
            </div>
          )}

          {/* Risk Flags */}
          {studio.risk_flags?.length > 0 && (
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-2">Risk Flags</p>
              <div className="space-y-1.5">
                {studio.risk_flags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg p-2.5"
                    style={{ background: `${SEVERITY_COLORS[f.severity] || "#888"}08`, borderLeft: `2px solid ${SEVERITY_COLORS[f.severity] || "#888"}50` }}>
                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: SEVERITY_COLORS[f.severity] }} />
                    <div>
                      <p className="text-[10px] font-semibold text-foreground">{f.title}</p>
                      {f.detail && <p className="text-[9px] text-muted-foreground leading-relaxed mt-0.5">{f.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Catalogue */}
          {studio.games?.length > 0 && (
            <div>
              <button
                onClick={() => setGamesOpen(!gamesOpen)}
                className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors mb-2 w-full"
              >
                <Gamepad2 className="w-3 h-3" />
                Game Catalogue ({studio.games.length})
                {gamesOpen ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
              </button>
              {gamesOpen && (
                <div className="space-y-2">
                  {studio.games.map((game, i) => <GameCard key={i} game={game} />)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DirectorySection({ dir }) {
  const [open, setOpen] = useState(true);

  const riskCounts = { "CRITICAL EXPOSURE": 0, "HIGH RISK": 0, "MODERATE RISK": 0, "LOW RISK": 0 };
  dir.studios.forEach(s => { if (riskCounts[s.risk_label] !== undefined) riskCounts[s.risk_label]++; });

  const totalGames = dir.studios.reduce((sum, s) => sum + (s.games?.length || 0), 0);

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ borderColor: dir.error ? "rgba(238,29,82,0.2)" : "rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors"
        style={{ background: dir.error ? "rgba(238,29,82,0.04)" : "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-3">
          {dir.error
            ? <XCircle className="w-4 h-4 text-destructive shrink-0" />
            : <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#00FF88" }} />}
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">{dir.directory}</p>
            {dir.error
              ? <p className="text-[10px] text-destructive mt-0.5">{dir.error}</p>
              : <p className="text-[10px] text-muted-foreground mt-0.5">
                  {dir.studios.length} studios · {totalGames} games profiled
                </p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!dir.error && dir.studios.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {riskCounts["CRITICAL EXPOSURE"] > 0 && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: "#EE1D52", background: "rgba(238,29,82,0.12)" }}>{riskCounts["CRITICAL EXPOSURE"]}C</span>}
              {riskCounts["HIGH RISK"] > 0 && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: "#FF6B00", background: "rgba(255,107,0,0.12)" }}>{riskCounts["HIGH RISK"]}H</span>}
              {riskCounts["MODERATE RISK"] > 0 && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: "#F1C40F", background: "rgba(241,196,15,0.12)" }}>{riskCounts["MODERATE RISK"]}M</span>}
              {riskCounts["LOW RISK"] > 0 && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: "#00FF88", background: "rgba(0,255,136,0.12)" }}>{riskCounts["LOW RISK"]}L</span>}
            </div>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
        </div>
      </button>

      {open && !dir.error && dir.studios.length > 0 && (
        <div className="px-4 pb-4 pt-2 space-y-2 border-t border-white/5">
          {dir.studios
            .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
            .map((studio, i) => <StudioRow key={i} studio={studio} />)}
        </div>
      )}
    </div>
  );
}

export default function AgentRunReport({ result }) {
  const totalGames = result.report?.reduce((sum, dir) =>
    sum + dir.studios.reduce((s2, st) => s2 + (st.games?.length || 0), 0), 0) || 0;

  return (
    <div className="mt-5 space-y-3">
      {/* Summary bar */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-white/8 bg-white/2 items-center">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: "#00FF88" }} />
          <span className="text-xs font-bold text-foreground">Run Complete</span>
        </div>
        <span className="text-muted-foreground/30">|</span>
        <span className="text-xs text-muted-foreground">Directories: <strong className="text-foreground">{result.directories_scanned}</strong></span>
        <span className="text-xs text-muted-foreground">Studios: <strong className="text-foreground">{result.studios_found}</strong></span>
        <span className="text-xs text-muted-foreground">Games profiled: <strong className="text-primary">{totalGames}</strong></span>
        <span className="text-xs text-muted-foreground">Saved: <strong className="text-foreground">{result.saved}</strong></span>
        {result.errors?.length > 0 && (
          <span className="text-xs text-destructive">Errors: {result.errors.length}</span>
        )}
      </div>

      {/* Per-directory breakdown */}
      {result.report?.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 px-1">Directory Breakdown — click a studio to expand game intelligence</p>
          {result.report.map((dir, i) => <DirectorySection key={i} dir={dir} />)}
        </div>
      )}
    </div>
  );
}