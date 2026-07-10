import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

const PLATFORMS = [
  { id: "meta", name: "Meta", logo: "🎮", status: "passing" },
  { id: "discord", name: "Discord", logo: "💬", status: "failing" },
  { id: "telegram", name: "Telegram", logo: "✈️", status: "passing" },
  { id: "tiktok", name: "TikTok", logo: "🎵", status: "failing" },
  { id: "youtube", name: "YouTube", logo: "▶️", status: "testing" },
  { id: "poki", name: "Poki", logo: "🎲", status: "passing" },
  { id: "crazygames", name: "CrazyGames", logo: "🎯", status: "testing" },
  { id: "snap", name: "Snap", logo: "👻", status: "failing" },
];

const STATUS_CONFIG = {
  passing: {
    label: "Passing",
    color: "#00FF88",
    bg: "rgba(0,255,136,0.12)",
    border: "rgba(0,255,136,0.3)",
    icon: CheckCircle2,
    description: "Build meets all platform requirements"
  },
  failing: {
    label: "Failing",
    color: "#EE1D52",
    bg: "rgba(238,29,82,0.12)",
    border: "rgba(238,29,82,0.3)",
    icon: XCircle,
    description: "Critical issues blocking deployment"
  },
  testing: {
    label: "Testing",
    color: "#FF6B00",
    bg: "rgba(255,107,0,0.12)",
    border: "rgba(255,107,0,0.3)",
    icon: AlertCircle,
    description: "Under review - results pending"
  },
};

export default function PlatformComplianceHeatmap() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [hoveredPlatform, setHoveredPlatform] = useState(null);

  const statusCounts = PLATFORMS.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
          <span className="text-xs font-mono text-primary uppercase tracking-wider">Live Compliance Scan</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-3">
          Platform Compliance Heatmap
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real-time view of your build's compliance status across all major platforms.
          Each tile shows pass/fail status and specific blockers.
        </p>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div
              key={key}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
              style={{ borderColor: config.border, background: config.bg }}
            >
              <Icon className="w-4 h-4" style={{ color: config.color }} />
              <span className="text-sm font-semibold" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                ({statusCounts[key] || 0})
              </span>
            </div>
          );
        })}
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {PLATFORMS.map((platform, i) => {
          const config = STATUS_CONFIG[platform.status];
          const Icon = config.icon;
          const isHovered = hoveredPlatform === platform.id;
          const isSelected = selectedPlatform?.id === platform.id;

          return (
            <motion.button
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPlatform(platform)}
              onMouseEnter={() => setHoveredPlatform(platform.id)}
              onMouseLeave={() => setHoveredPlatform(null)}
              className="relative p-6 rounded-2xl border text-left transition-all"
              style={{
                borderColor: isHovered || isSelected ? config.color : config.border,
                background: isHovered || isSelected 
                  ? `linear-gradient(135deg, ${config.bg}, ${config.bg}dd)`
                  : config.bg,
                transform: isHovered ? "scale(1.02)" : "scale(1)",
              }}
            >
              {/* Platform logo */}
              <div className="text-4xl mb-3">{platform.logo}</div>

              {/* Platform name */}
              <h3 className="text-lg font-bold text-foreground mb-2">
                {platform.name}
              </h3>

              {/* Status indicator */}
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: config.color }} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>

              {/* Hover glow */}
              {isHovered && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `0 0 30px ${config.color}40`,
                    opacity: 0.6,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected platform details */}
      {selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-6"
          style={{
            borderColor: STATUS_CONFIG[selectedPlatform.status].border,
            background: STATUS_CONFIG[selectedPlatform.status].bg,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedPlatform.logo}</span>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedPlatform.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {STATUS_CONFIG[selectedPlatform.status].description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPlatform(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mock diagnostic details */}
          <div className="space-y-3">
            {selectedPlatform.status === "failing" && (
              <>
                <div className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#EE1D52" }} />
                  <span className="text-foreground/80">SDK version deprecated — requires v8.0 migration by Sept 30</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#EE1D52" }} />
                  <span className="text-foreground/80">Undeclared PII transmission detected in analytics module</span>
                </div>
              </>
            )}
            {selectedPlatform.status === "passing" && (
              <>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#00FF88" }} />
                  <span className="text-foreground/80">All SDK requirements met</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#00FF88" }} />
                  <span className="text-foreground/80">Privacy compliance verified</span>
                </div>
              </>
            )}
            {selectedPlatform.status === "testing" && (
              <>
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#FF6B00" }} />
                  <span className="text-foreground/80">Mobile emulation test in progress</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#FF6B00" }} />
                  <span className="text-foreground/80">Bundle size analysis pending</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}