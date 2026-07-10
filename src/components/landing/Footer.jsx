import React from "react";
import Link from 'next/link';

import { base44 } from "@/api/base44Client";

export default function Footer() {
  const handleAdminLogin = () => {
    base44.auth.redirectToLogin(window.location.origin + "/control-panel");
  };

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-foreground">HTML</span>
            <span className="text-lg font-bold" style={{ color: "#1e6ff0" }}>5</span>
            <span className="text-lg font-bold" style={{ color: "#FF6B00" }}>STUDIO</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            WebGLive Deployment Certification Authority
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link to="/about" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">Contact</Link>
            <button
              onClick={handleAdminLogin}
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              Admin
            </button>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HTML5STUDIO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}