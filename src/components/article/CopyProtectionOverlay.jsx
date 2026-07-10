import React, { useEffect, useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CopyProtectionOverlay() {
  const [violations, setViolations] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let violationCount = 0;

    const handleContextMenu = (e) => {
      e.preventDefault();
      violationCount++;
      logViolation('right-click');
      return false;
    };

    const handleCopy = (e) => {
      e.preventDefault();
      e.stopPropagation();
      violationCount++;
      logViolation('copy-attempt');
      // Replace clipboard content with warning
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '[Protected content — HTML5STUDIO subscription required]');
      }
      return false;
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'a', 's', 'u', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        violationCount++;
        logViolation('keyboard-shortcut');
        return false;
      }
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        violationCount++;
        logViolation('devtools-attempt');
        return false;
      }
    };

    const logViolation = (type) => {
      setViolations(prev => [...prev, { type, time: Date.now() }]);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      if (violationCount > 5) {
        console.warn('HTML5STUDIO: Multiple copy protection violations detected');
      }
    };

    // Inject a style tag for stronger CSS-level selection blocking
    const style = document.createElement('style');
    style.id = 'copy-protect-style';
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      const s = document.getElementById('copy-protect-style');
      if (s) s.remove();
    };
  }, []);

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 rounded-xl border p-4 shadow-2xl max-w-sm"
          style={{ borderColor: "rgba(238,29,82,0.4)", background: "rgba(238,29,82,0.15)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#EE1D52" }} />
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">Copy Protection Active</h4>
              <p className="text-xs text-foreground/80 leading-relaxed">
                This content is protected. For full code access with copy/paste, upgrade to a certification subscription.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}