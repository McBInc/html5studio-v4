// src/app/layout.tsx
import React from "react";
import Providers from "./providers";
import "./globals.css";

/**
 * ALPHA-9 GLOBAL LAYOUT (V81)
 * Flattened to act as a blank canvas for Cinematic Hybrid UI.
 */

export const metadata = {
  title: "ALPHA-9 | HTML5 STUDIO",
  description: "Advanced Forensic Certification for WebGL builds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased selection:bg-red-500/30">
        <Providers>
          {/* V81: Removed hard-coded container and header to allow full-width cinematic pages */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
