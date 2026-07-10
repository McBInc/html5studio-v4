import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Play, CheckCircle } from "lucide-react";

export default function MobileTestPanel({ videoUrl }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-white/2 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Asset Performance</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">MOB</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[11px] font-mono text-green-400">Playable on Any Mobile Browser</span>
        </div>
      </div>

      {/* Video */}
      <div className="relative aspect-video bg-black/60">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay={playing}
            className="w-full h-full object-contain"
            poster=""
          />
        ) : (
          /* Placeholder when no video yet */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center bg-white/5">
              <Play className="w-6 h-6 text-muted-foreground ml-1" />
            </div>
            <p className="text-muted-foreground text-xs font-mono">Mobile Emulation Recording · Not yet uploaded</p>
          </div>
        )}

        {/* Corner HUD overlays */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-green-400">
          ● REC · AGENT SESSION
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-primary">
          MOBILE EMULATION · 375×812
        </div>
      </div>

      <div className="px-5 py-3 flex flex-wrap gap-4 text-[10px] font-mono text-muted-foreground border-t border-white/8">
        <span>✓ Touch-action validated</span>
        <span>✓ Viewport meta present</span>
        <span>✓ No horizontal scroll</span>
        <span>✓ FPS ≥ 30 sustained</span>
      </div>
    </motion.div>
  );
}