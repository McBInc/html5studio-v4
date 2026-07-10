"use client";

import React from "react";
import { motion } from "framer-motion";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import PlatformComplianceHeatmap from '@/components/landing/PlatformComplianceHeatmap';

export default function Landing2() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(30,111,240,0.12) 0%, rgba(238,29,82,0.06) 40%, transparent 70%)",
            filter: "blur(60px)"
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
              Know Your <span style={{ color: "#1e6ff0" }}>Compliance</span>
              <br />
              <span style={{ color: "#00FF88" }}>Status</span> Instantly
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              See exactly which platforms your WebGL build can deploy to — and what's blocking the rest.
              Real-time compliance scanning across 8 major platforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Heatmap Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <PlatformComplianceHeatmap />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl border p-10 relative overflow-hidden"
            style={{
              borderColor: "rgba(30,111,240,0.25)",
              background: "linear-gradient(135deg, rgba(30,111,240,0.08) 0%, rgba(238,29,82,0.04) 100%)"
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(30,111,240,0.6), rgba(238,29,82,0.4), transparent)"
              }}
            />
            <h2 className="text-3xl font-black mb-3">Get Your Full Diagnostic Report</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Upload your WebGL build and receive a complete compliance scan within 24 hours — mobile emulation test,
              SDK audit, privacy check, and platform-specific remediation plan.
            </p>
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
            >
              Start Free Scan
            </button>
            <p className="text-xs text-muted-foreground/50 mt-4 font-mono">
              No payment required · Results in 24 hours · Covers all 8 platforms
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}