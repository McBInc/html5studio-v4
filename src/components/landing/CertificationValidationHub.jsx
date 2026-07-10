import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CERT_SEAL = "https://media.base44.com/images/public/user_6861c38c47c16b00ec24a571/3479ccf6a_WebGL_HTML5STUDIO_Certified_Seal.png";

const hubPlatforms = [
  {
    name: "META",
    tag: "public",
    tagColor: "#0082FB",
    color: "#0082FB",
    angle: -135,
    checks: [
      "SDK v8.0 upgrade for Sept 30 Sunset Protection.",
      "Zero-Permissions Handshake implementation.",
      "PII Leak Scrubbing: Migrate legacy .api('me') calls.",
    ],
  },
  {
    name: "DISCORD",
    tag: "forum",
    tagColor: "#5865F2",
    color: "#5865F2",
    angle: -45,
    checks: [
      "Feb 25 Nightmare Split: Refactor to granular scopes.",
      "Social SDK 1.0 upgrade for commerce stability.",
      "Handshake Recovery: WebSocket forensic analysis.",
    ],
  },
  {
    name: "TELEGRAM",
    tag: "send",
    tagColor: "#229ED9",
    color: "#229ED9",
    angle: 135,
    checks: [
      "WebApp SDK 7.0+ refactor for TMA compliance.",
      "Stars Payment Bridge integration for monetization.",
      "Storebridge.jslib injection for Producer tier.",
    ],
  },
  {
    name: "YOUTUBE",
    tag: "play_circle",
    tagColor: "#FF0000",
    color: "#FF0000",
    angle: -45 + 90,
    checks: [
      "15MB Bundle Limit Compliance (Asset Stripping).",
      "Relative Path Fix for internal routing integrity.",
      "Playables SDK injection for host communication.",
    ],
  },
  {
    name: "TIKTOK",
    tag: "movie",
    tagColor: "#EE1D52",
    color: "#EE1D52",
    angle: 180,
    checks: [
      "Touch-Action CSS patch for Swipe-to-Exit.",
      "Safe Area HUD integration for UI legibility.",
      "TikTok SDK Bridge for native overlay handling.",
    ],
  },
  {
    name: "LINKEDIN",
    tag: "work",
    tagColor: "#0A66C2",
    color: "#0A66C2",
    angle: 0,
    checks: [
      "Unwrapped Pixel protection via Content Bridge.",
      "Zero-Permissions Corporate Security Seal.",
      "B2B Auth Bridge integration for enterprise.",
    ],
  },
];

// Positions around center in a hex layout (image 3 style: 3 left, center, 3 right)
const gridPositions = [
  { col: 0, row: 0, platform: "META" },
  { col: 2, row: 0, platform: "DISCORD" },
  { col: 0, row: 1, platform: "TELEGRAM" },
  { col: 2, row: 1, platform: "YOUTUBE" },
  { col: 0, row: 2, platform: "TIKTOK" },
  { col: 2, row: 2, platform: "LINKEDIN" },
];

function PlatformCard({ platform, isSelected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="text-left p-4 rounded-xl border transition-all duration-300 w-full"
      style={{
        backgroundColor: isSelected ? `${platform.color}10` : "rgba(255,255,255,0.02)",
        borderColor: isSelected ? `${platform.color}50` : "rgba(255,255,255,0.07)",
        boxShadow: isSelected ? `0 0 24px ${platform.color}20` : "none",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-black tracking-widest" style={{ color: platform.color }}>
          {platform.name}
        </span>
        <span className="text-[10px] font-mono" style={{ color: platform.tagColor, opacity: 0.7 }}>
          {platform.tag}
        </span>
      </div>
      <div className="space-y-1.5">
        {platform.checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="font-mono text-[10px] mt-0.5 shrink-0" style={{ color: platform.color }}>
              0{i + 1}
            </span>
            <span className="text-[11px] text-white/50 leading-tight">{c}</span>
          </div>
        ))}
      </div>
    </motion.button>
  );
}

export default function CertificationValidationHub() {
  const [selected, setSelected] = useState(null);

  const left = hubPlatforms.filter((p) => ["META", "TELEGRAM", "TIKTOK"].includes(p.name));
  const right = hubPlatforms.filter((p) => ["DISCORD", "YOUTUBE", "LINKEDIN"].includes(p.name));

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded-full mb-4 uppercase tracking-wider">
            Certification Validation Layer
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Platform-Specific Compliance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our Diagnostic Overlay injects directly into your build to prove platform authenticity
            across the global compliance hub. Click a platform to see its checks.
          </p>
        </motion.div>

        {/* 3-column layout: left cards | center hub | right cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-8 items-center">
          {/* Left cards */}
          <div className="space-y-4">
            {left.map((p) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <PlatformCard
                  platform={p}
                  isSelected={selected === p.name}
                  onClick={() => setSelected(selected === p.name ? null : p.name)}
                />
              </motion.div>
            ))}
          </div>

          {/* Center hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col items-center justify-center"
          >
            {/* SVG lines from center to left/right */}
            <div className="relative" style={{ width: 220, height: 440 }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
                {/* Lines to left cards */}
                {left.map((p, i) => {
                  const y = 73 + i * 124;
                  return (
                    <line
                      key={`l-${p.name}`}
                      x1="0"
                      y1={y}
                      x2="110"
                      y2="220"
                      stroke={p.color}
                      strokeWidth={selected === p.name ? 1.5 : 0.6}
                      strokeOpacity={selected === p.name ? 0.6 : 0.15}
                      strokeDasharray={selected === p.name ? "none" : "4 4"}
                    />
                  );
                })}
                {/* Lines to right cards */}
                {right.map((p, i) => {
                  const y = 73 + i * 124;
                  return (
                    <line
                      key={`r-${p.name}`}
                      x1="220"
                      y1={y}
                      x2="110"
                      y2="220"
                      stroke={p.color}
                      strokeWidth={selected === p.name ? 1.5 : 0.6}
                      strokeOpacity={selected === p.name ? 0.6 : 0.15}
                      strokeDasharray={selected === p.name ? "none" : "4 4"}
                    />
                  );
                })}
              </svg>

              {/* Center badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div
                  className="rounded-full border-2 border-primary/60 flex flex-col items-center justify-center"
                  style={{
                    width: 110,
                    height: 110,
                    background: "radial-gradient(circle, rgba(30,111,240,0.15) 0%, rgba(8,8,18,0.98) 70%)",
                    boxShadow: "0 0 50px rgba(30,111,240,0.2), inset 0 0 30px rgba(30,111,240,0.05)",
                  }}
                >
                  <span className="text-[10px] font-black text-foreground leading-none">HTML5</span>
                  <span className="text-[10px] font-black leading-none" style={{ color: "#FF6B00" }}>STUDIO</span>
                  <p className="text-[6px] font-mono text-primary/60 tracking-widest mt-1">AUTHORITY</p>
                </div>
                <p
                  className="text-center text-[9px] font-mono mt-3 tracking-widest text-primary/60"
                >
                  CERTIFICATION
                  <br />
                  AUTHORITY
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right cards */}
          <div className="space-y-4">
            {right.map((p) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <PlatformCard
                  platform={p}
                  isSelected={selected === p.name}
                  onClick={() => setSelected(selected === p.name ? null : p.name)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: show all in grid */}
        <div className="lg:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hubPlatforms.map((p) => (
            <PlatformCard
              key={p.name}
              platform={p}
              isSelected={selected === p.name}
              onClick={() => setSelected(selected === p.name ? null : p.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}