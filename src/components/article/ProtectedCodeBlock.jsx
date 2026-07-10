import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ProtectedCodeBlock({ code, requireAuth = false }) {
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setAttempts(prev => prev + 1);
      return false;
    };

    const handleCopy = (e) => {
      e.preventDefault();
      setAttempts(prev => prev + 1);
      return false;
    };

    const handleSelect = (e) => {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('selectstart', handleSelect);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('selectstart', handleSelect);
    };
  }, []);

  if (!revealed) {
    return (
      <div className="rounded-xl border border-white/8 overflow-hidden my-6">
        <div className="p-8 text-center" style={{ background: "rgba(30,111,240,0.04)" }}>
          <Lock className="w-8 h-8 mx-auto mb-4" style={{ color: "#1e6ff0" }} />
          <h3 className="text-lg font-bold text-foreground mb-2">Protected Technical Implementation</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            This code is proprietary to HTML5STUDIO. Reveal to view, but copying is disabled to protect our IP.
          </p>
          <button
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
            style={{ background: "#1e6ff0", color: "#fff" }}
          >
            <Eye className="w-4 h-4" />
            Reveal Code (View Only)
          </button>
          {requireAuth && (
            <p className="text-xs text-muted-foreground/60 mt-4">
              Full access with copy/paste requires certification subscription
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden my-6 relative select-none">
      {attempts > 0 && (
        <div className="absolute top-2 right-2 z-10 px-3 py-1.5 rounded-lg text-xs font-mono bg-destructive/90 text-white">
          Copy protection active
        </div>
      )}
      <div className="bg-black/40 px-2 py-1.5 border-b border-white/8 flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Protected Code</span>
        <button
          onClick={() => setRevealed(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <EyeOff className="w-3 h-3" />
          Hide
        </button>
      </div>
      <pre
        className="p-5 overflow-x-auto text-sm font-mono leading-relaxed pointer-events-none"
        style={{ background: "rgba(0,0,0,0.4)", color: "#00FF88", userSelect: "none" }}
      >
        <code>{code}</code>
      </pre>
      <div className="bg-black/40 px-4 py-2 border-t border-white/8 text-center">
        <p className="text-[10px] font-mono text-muted-foreground/50">
          © HTML5STUDIO Proprietary Implementation · No reproduction without license
        </p>
      </div>
    </div>
  );
}