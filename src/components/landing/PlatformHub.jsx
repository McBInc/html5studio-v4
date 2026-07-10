import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, Search, FileText, ShieldCheck, ChevronDown } from "lucide-react";

const CERT_SEAL = "https://media.base44.com/images/public/user_6861c38c47c16b00ec24a571/3479ccf6a_WebGL_HTML5STUDIO_Certified_Seal.png";

const platforms = [
  { name: "Meta",     color: "#0082FB", icon: "M",  angle: -90,
    checks: ["SDK v8.0 upgrade for Sept 30 Sunset Protection.", "Zero-Permissions Handshake implementation.", "PII Leak Scrubbing: Migrate legacy .api('me') calls."] },
  { name: "Discord",  color: "#5865F2", icon: "D",  angle: -30,
    checks: ["Feb 25 Nightmare Split: Refactor to granular scopes.", "Social SDK 1.0 upgrade for commerce stability.", "Handshake Recovery: WebSocket forensic analysis."] },
  { name: "YouTube",  color: "#FF0000", icon: "YT", angle: 30,
    checks: ["15MB Bundle Limit Compliance (Asset Stripping).", "Relative Path Fix for internal routing integrity.", "Playables SDK injection for host communication."] },
  { name: "Telegram", color: "#229ED9", icon: "T",  angle: 90,
    checks: ["WebApp SDK 7.0+ refactor for TMA compliance.", "Stars Payment Bridge integration for monetization.", "Storebridge.jslib injection for Producer tier."] },
  { name: "TikTok",   color: "#EE1D52", icon: "Tt", angle: 150,
    checks: ["Touch-Action CSS patch for Swipe-to-Exit.", "Safe Area HUD integration for UI legibility.", "TikTok SDK Bridge for native overlay handling."] },
  { name: "LinkedIn", color: "#0A66C2", icon: "Li", angle: 210,
    checks: ["Unwrapped Pixel protection via Content Bridge.", "Zero-Permissions Corporate Security Seal.", "B2B Auth Bridge integration for enterprise."] },
];

const walkthrough = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your WebGL Build",
    description: "Drag & drop your Unity WebGL .zip. We accept any standard output — no pre-processing needed.",
    detail: "Your file is encrypted in transit and scanned in an isolated sandbox environment.",
  },
  {
    step: "02",
    icon: Search,
    title: "Alpha-9 Forensic Scan",
    description: "200+ automated compliance checks run against every platform's 2026 API requirements.",
    detail: "WASM heap analysis, deprecated API detection, PII call auditing, SDK handshake verification.",
  },
  {
    step: "03",
    icon: FileText,
    title: "Your Compliance Report",
    description: "A full diagnostic report is generated with your build's data — named, scored, and timestamped.",
    detail: "Shows exact failure points, severity levels, platform-specific risks, and your compliance score out of 100.",
  },
  {
    step: "04",
    icon: ShieldCheck,
    title: "Certified & Deployed",
    description: "We inject compliance patches and issue your DIP Certified package ready for any platform.",
    detail: "TON Registry entry, unique WGL-CERT ID, Apple Pay / Google Pay enabled, one-click deploy.",
  },
];

// Octagon clip path
const octagonClip = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";

function PlatformNode({ platform, isSelected, onClick, size = 140 }) {
  const rad = (platform.angle * Math.PI) / 180;
  const r = size;
  const x = Math.cos(rad) * r;
  const y = Math.sin(rad) * r;

  return (
    <motion.button
      onClick={onClick}
      style={{ left: `calc(50% + ${x}px - 36px)`, top: `calc(50% + ${y}px - 36px)` }}
      className="absolute w-[72px] h-[72px] flex flex-col items-center justify-center rounded-xl transition-all duration-300"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-30 blur-md transition-opacity duration-300"
        style={{ backgroundColor: platform.color, opacity: isSelected ? 0.6 : 0.2 }}
      />
      {/* Box */}
      <div
        className="relative w-full h-full rounded-xl border-2 flex flex-col items-center justify-center gap-0.5"
        style={{
          backgroundColor: `${platform.color}18`,
          borderColor: isSelected ? platform.color : `${platform.color}50`,
          boxShadow: isSelected ? `0 0 20px ${platform.color}60` : "none",
        }}
      >
        <span className="text-sm font-black" style={{ color: platform.color }}>
          {platform.icon}
        </span>
        <span className="text-[9px] font-bold text-white/70">{platform.name}</span>
      </div>
    </motion.button>
  );
}

function PipelineLine({ platform, isSelected, size = 140 }) {
  const rad = (platform.angle * Math.PI) / 180;
  const r = size;
  const x2 = Math.cos(rad) * r;
  const y2 = Math.sin(rad) * r;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <marker id={`arrow-${platform.name}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={platform.color} opacity={isSelected ? 0.9 : 0.3} />
        </marker>
      </defs>
      <line
        x1="50%"
        y1="50%"
        x2={`calc(50% + ${x2}px)`}
        y2={`calc(50% + ${y2}px)`}
        stroke={platform.color}
        strokeWidth={isSelected ? 2 : 1}
        strokeOpacity={isSelected ? 0.8 : 0.25}
        strokeDasharray={isSelected ? "none" : "5 4"}
        markerEnd={`url(#arrow-${platform.name})`}
      />
    </svg>
  );
}

export default function PlatformHub() {
  const [selected, setSelected] = useState("Meta");
  const [activeStep, setActiveStep] = useState(0);

  const selectedPlatform = platforms.find((p) => p.name === selected);

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-full mb-4 uppercase tracking-wider">
            Universal Compliance Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            <span className="text-foreground">HTML</span><span style={{ color: "#1e6ff0" }}>5</span><span style={{ color: "#FF6B00" }}>STUDIO</span>
            <span className="text-foreground"> Is the Hub</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Select your target platform to see exactly what compliance checks and
            patches are applied — then walk through the full process.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Octagon Hub */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="relative" style={{ width: 380, height: 380 }}>
              {/* Pipeline lines — rendered first (behind) */}
              {platforms.map((p) => (
                <PipelineLine key={p.name} platform={p} isSelected={selected === p.name} size={155} />
              ))}

              {/* Platform nodes */}
              {platforms.map((p) => (
                <PlatformNode
                  key={p.name}
                  platform={p}
                  isSelected={selected === p.name}
                  onClick={() => setSelected(p.name)}
                  size={155}
                />
              ))}

              {/* Center octagon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="relative"
                  style={{ clipPath: octagonClip, width: 110, height: 110 }}
                >
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(circle, rgba(30,111,240,0.15) 0%, transparent 70%)",
                    }}
                  />
                  {/* Background */}
                  <div className="absolute inset-0 bg-card border-2 border-primary/60" />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-foreground">HTML</span>
                    <span className="text-sm font-black" style={{ color: "#1e6ff0" }}>5</span>
                    <span className="text-sm font-black" style={{ color: "#FF6B00" }}>STUDIO</span>
                  </div>
                </div>
                {/* Blue ring glow */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width: 130,
                    height: 130,
                    background: "radial-gradient(circle, rgba(30,111,240,0.12) 0%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
              </div>


            </div>
          </motion.div>

          {/* RIGHT: Compliance checks for selected platform */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {selectedPlatform && (
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedPlatform.color, boxShadow: `0 0 10px ${selectedPlatform.color}` }}
                    />
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      Compliance Checks Applied
                    </p>
                    <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full border" style={{ color: selectedPlatform.color, borderColor: `${selectedPlatform.color}40`, backgroundColor: `${selectedPlatform.color}10` }}>
                      {selectedPlatform.name}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {selectedPlatform.checks.map((check, i) => (
                      <motion.div
                        key={check}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl border bg-card/50"
                        style={{ borderColor: `${selectedPlatform.color}25` }}
                      >
                        <span className="font-mono text-sm font-black shrink-0 mt-0.5" style={{ color: selectedPlatform.color }}>
                          0{i + 1}
                        </span>
                        <p className="text-sm text-foreground/80 leading-relaxed">{check}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Process steps row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest text-center mb-8">
            What You're About To Experience
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {walkthrough.map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/50">{item.step}</span>
                <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}