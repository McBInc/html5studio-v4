import React from "react";
import { motion } from "framer-motion";
import { Globe, AlertTriangle, CheckCircle, Mail, ExternalLink } from "lucide-react";

const RISK_CONFIG = {
  critical: { label: "CRITICAL RISK", color: "#EE1D52", bg: "rgba(238,29,82,0.1)", border: "rgba(238,29,82,0.25)" },
  high:     { label: "HIGH RISK",     color: "#FF6B00", bg: "rgba(255,107,0,0.1)",  border: "rgba(255,107,0,0.25)" },
  medium:   { label: "MED RISK",      color: "#F1C40F", bg: "rgba(241,196,15,0.1)", border: "rgba(241,196,15,0.25)" },
  low:      { label: "LOW RISK",      color: "#00FF88", bg: "rgba(0,255,136,0.1)",  border: "rgba(0,255,136,0.25)" },
  unknown:  { label: "UNSCANNED",     color: "#666",    bg: "rgba(100,100,100,0.1)", border: "rgba(100,100,100,0.2)" },
};

const PLATFORM_COLORS = {
  "Meta Instant Games": "#1877F2",
  "Facebook Instant Games": "#1877F2",
  "Discord Activities": "#5865F2",
  "TikTok Mini-Games": "#EE1D52",
  "Telegram Mini Apps": "#229ED9",
  "YouTube Playables": "#FF0000",
  "Poki": "#FF6B35",
  "CrazyGames": "#FF4C00",
  "GameDistribution": "#6C5CE7",
  "itch.io": "#FA5C5C",
  "Newgrounds": "#FF9900",
  "Kongregate": "#7B68EE",
  "Yandex Games": "#FF0000",
  "Web Browser": "#00FF88",
  "Coolmath": "#4CAF50",
  "Miniclip": "#E91E63",
  "Kizi": "#9C27B0",
};

export default function StudioCard({ studio, index, onContact }) {
  const risk = RISK_CONFIG[studio.risk_level] || RISK_CONFIG.unknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border overflow-hidden group hover:border-white/15 transition-all duration-300"
      style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
    >
      {/* Top risk bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${risk.color}, transparent)` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-bold text-foreground truncate">{studio.name}</h3>
              {studio.outreach_sent && (
                <span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>
                  CONTACTED
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {studio.country && <span>{studio.country}</span>}
              {studio.country && studio.studio_size && <span>·</span>}
              {studio.studio_size && <span className="capitalize">{studio.studio_size}</span>}
            </div>
          </div>
          {/* Risk badge */}
          <span
            className="text-[9px] font-black font-mono px-2 py-1 rounded shrink-0"
            style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.border}` }}
          >
            {risk.label}
          </span>
        </div>

        {/* Platforms */}
        {studio.platforms?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {studio.platforms.slice(0, 4).map((p) => (
              <span
                key={p}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                style={{
                  color: PLATFORM_COLORS[p] || "#888",
                  borderColor: `${PLATFORM_COLORS[p] || "#888"}30`,
                  background: `${PLATFORM_COLORS[p] || "#888"}0d`,
                }}
              >
                {p}
              </span>
            ))}
            {studio.platforms.length > 4 && (
              <span className="text-[9px] font-mono text-muted-foreground px-1.5 py-0.5">+{studio.platforms.length - 4}</span>
            )}
          </div>
        )}

        {/* Compliance risks */}
        {studio.compliance_risks?.length > 0 && (
          <div className="mb-3 space-y-1">
            {studio.compliance_risks.slice(0, 2).map((risk_item) => (
              <div key={risk_item} className="flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: risk.color }} />
                <span className="text-[10px] font-mono" style={{ color: risk.color + "cc" }}>{risk_item}</span>
              </div>
            ))}
            {studio.compliance_risks.length > 2 && (
              <span className="text-[10px] text-muted-foreground/50 font-mono">+{studio.compliance_risks.length - 2} more risks</span>
            )}
          </div>
        )}

        {/* Games */}
        {studio.games?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {studio.games.slice(0, 3).map((g) => (
              <span key={g} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                {g}
              </span>
            ))}
            {studio.games.length > 3 && (
              <span className="text-[9px] px-1.5 py-0.5 text-muted-foreground/50">+{studio.games.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <button
            onClick={() => onContact(studio)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90"
            style={{ background: "rgba(30,111,240,0.15)", color: "#1e6ff0", border: "1px solid rgba(30,111,240,0.25)" }}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact About Listing
          </button>
          {studio.website && (
            <a
              href={studio.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-white/8 text-muted-foreground hover:text-foreground hover:border-white/15 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}