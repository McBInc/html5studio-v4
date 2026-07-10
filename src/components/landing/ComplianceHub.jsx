import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CERT_SEAL = "https://media.base44.com/images/public/user_6861c38c47c16b00ec24a571/3479ccf6a_WebGL_HTML5STUDIO_Certified_Seal.png";

const complianceNodes = [
  {
    label: "Memory Analysis",
    protocol: "WASM Heap",
    angle: -90,
    color: "#00FF88",
    checks: ["Heap overflow detection", "Memory leak auditing", "Stack trace validation"],
  },
  {
    label: "API Auth Layer",
    protocol: "SDK Handshake",
    angle: -30,
    color: "#0082FB",
    checks: ["META SDK V8.5 auth", "OAuth token scopes", "Error 403 remediation"],
  },
  {
    label: "Data Privacy",
    protocol: "PII Scrubbing",
    angle: 30,
    color: "#FF6B00",
    checks: ["Illegal PII call removal", "GDPR compliance", "Data minimization"],
  },
  {
    label: "Sunset Detection",
    protocol: "Deprecated APIs",
    angle: 90,
    color: "#EE1D52",
    checks: ["Sept 30 sunset risk", "API version mapping", "Auto-migration patches"],
  },
  {
    label: "Viewport & Touch",
    protocol: "Mobile Compat",
    angle: 150,
    color: "#FF9500",
    checks: ["Touch-action events", "Safe area injection", "Viewport meta fix"],
  },
  {
    label: "Interoperability",
    protocol: "EU DMA",
    angle: 210,
    color: "#5865F2",
    checks: ["Interoperability proof", "DMA article 7 audit", "Cross-platform routing"],
  },
];

function NodeDot({ node, isSelected, onClick, radius = 155 }) {
  const rad = (node.angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.button
      onClick={onClick}
      style={{ left: `calc(50% + ${x}px - 50px)`, top: `calc(50% + ${y}px - 28px)` }}
      className="absolute w-[100px] h-[56px] flex flex-col items-center justify-center"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
    >
      <div
        className="absolute inset-0 rounded-lg opacity-20 blur-sm transition-opacity duration-300"
        style={{ backgroundColor: node.color, opacity: isSelected ? 0.5 : 0.15 }}
      />
      <div
        className="relative w-full h-full rounded-lg border flex flex-col items-center justify-center px-1"
        style={{
          backgroundColor: `${node.color}12`,
          borderColor: isSelected ? node.color : `${node.color}40`,
          boxShadow: isSelected ? `0 0 16px ${node.color}50` : "none",
        }}
      >
        <span className="text-[9px] font-bold leading-tight text-center" style={{ color: node.color }}>
          {node.label}
        </span>
      </div>
    </motion.button>
  );
}

function SpokeLine({ node, isSelected, radius = 155 }) {
  const rad = (node.angle * Math.PI) / 180;
  const innerR = 70;
  const outerR = radius;
  const x1 = Math.cos(rad) * innerR;
  const y1 = Math.sin(rad) * innerR;
  const x2 = Math.cos(rad) * outerR;
  const y2 = Math.sin(rad) * outerR;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
      <line
        x1={`calc(50% + ${x1}px)`}
        y1={`calc(50% + ${y1}px)`}
        x2={`calc(50% + ${x2}px)`}
        y2={`calc(50% + ${y2}px)`}
        stroke={node.color}
        strokeWidth={isSelected ? 1.5 : 0.8}
        strokeOpacity={isSelected ? 0.7 : 0.2}
        strokeDasharray={isSelected ? "none" : "4 4"}
      />
      {/* Animated dot on selected */}
      {isSelected && (
        <motion.circle
          cx={`calc(50% + ${x1}px)`}
          cy={`calc(50% + ${y1}px)`}
          r={3}
          fill={node.color}
          animate={{ cx: [`calc(50% + ${x1}px)`, `calc(50% + ${x2}px)`] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      )}
    </svg>
  );
}

export default function ComplianceHub() {
  const [selected, setSelected] = useState(null);

  const activeNode = complianceNodes.find((n) => n.label === selected);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded-full mb-4 uppercase tracking-wider">
            200+ Compliance Checks
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Certification Validation Layer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our diagnostic overlay injects directly into your build to prove platform authenticity across
            every compliance domain. Click a node to inspect.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hub diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex-shrink-0"
            style={{ width: 420, height: 420 }}
          >
            {/* Spoke lines */}
            {complianceNodes.map((n) => (
              <SpokeLine key={n.label} node={n} isSelected={selected === n.label} />
            ))}

            {/* Outer orbit ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/20"
              style={{ width: 330, height: 330 }}
            />
            {/* Inner ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
              style={{ width: 160, height: 160 }}
            />

            {/* Nodes */}
            {complianceNodes.map((n) => (
              <NodeDot
                key={n.label}
                node={n}
                isSelected={selected === n.label}
                onClick={() => setSelected(selected === n.label ? null : n.label)}
              />
            ))}

            {/* Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="relative flex items-center justify-center rounded-full border-2 border-primary/50"
                style={{
                  width: 110,
                  height: 110,
                  background: "radial-gradient(circle, rgba(255,107,0,0.12) 0%, rgba(10,10,20,0.95) 70%)",
                  boxShadow: "0 0 40px rgba(255,107,0,0.15)",
                }}
              >
                <div className="text-center">
                  <img src={CERT_SEAL} alt="H5S" className="w-14 h-14 object-contain mx-auto" />
                  <p className="text-[7px] font-mono text-primary/60 tracking-widest mt-0.5">AUTHORITY</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeNode.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="p-6 rounded-2xl border"
                    style={{
                      backgroundColor: `${activeNode.color}08`,
                      borderColor: `${activeNode.color}30`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: activeNode.color, boxShadow: `0 0 10px ${activeNode.color}` }}
                        />
                        <h3 className="text-lg font-bold" style={{ color: activeNode.color }}>
                          {activeNode.protocol}
                        </h3>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded-full border" style={{ color: activeNode.color, borderColor: `${activeNode.color}40`, backgroundColor: `${activeNode.color}12` }}>
                        {activeNode.label}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {activeNode.checks.map((c, i) => (
                        <motion.div
                          key={c}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="font-mono text-xs mt-0.5" style={{ color: activeNode.color }}>
                            0{i + 1}
                          </span>
                          <span className="text-sm text-foreground/80">{c}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {complianceNodes.map((n) => (
                      <button
                        key={n.label}
                        onClick={() => setSelected(n.label)}
                        className="p-3 rounded-xl border text-left transition-all hover:scale-[1.02]"
                        style={{ borderColor: `${n.color}30`, backgroundColor: `${n.color}08` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold" style={{ color: n.color }}>
                            {n.label}
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground">{n.protocol}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click any node on the hub — or the cards above — to inspect compliance checks.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}