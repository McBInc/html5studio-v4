"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WizardStep3Guide from '@/components/wizard/WizardStep3Guide';
import LicenseRestore from '@/components/wizard/LicenseRestore';
import HeroDisturbSection from '@/components/wizard/HeroDisturbSection';
import WhatYouGetSection from '@/components/wizard/WhatYouGetSection';
import InteractiveDemoSection from '@/components/wizard/InteractiveDemoSection';
import Alpha9ScanSection from '@/components/wizard/Alpha9ScanSection';
import PricingTiers from '@/components/wizard/PricingTiers';
import { base44 } from "@/api/base44Client";

const TIER_DEFS = {
  single: { id: "single", label: "Single Platform Guide", price: 17 },
  multi:  { id: "multi",  label: "Multi Platform Bundle", price: 37 },
  all:    { id: "all",    label: "All Platforms Bundle",  price: 69 },
};

// Section anchor IDs
const SECTIONS = {
  HERO: "hero",
  DEMO: "demo",
  OUTCOMES: "outcomes",
  DFY: "dfy",
  GUIDE: "guide",
};

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      <span className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

export default function ComplianceWizard() {
  const [unlockedTier, setUnlockedTier] = useState(null);
  const [unlockedPlatforms, setUnlockedPlatforms] = useState([]);
  // For full-guide view (after demo unlock flow)
  const [guidePlatform, setGuidePlatform] = useState(null);
  const [guideEngine, setGuideEngine] = useState(null);
  const [showFullGuide, setShowFullGuide] = useState(false);

  const demoRef = useRef(null);
  const dfyRef = useRef(null);
  const outcomesRef = useRef(null);
  const guideRef = useRef(null);

  const scrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Auto-unlock after Stripe redirect or from localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tierId = params.get("unlocked");
    const sessionId = params.get("session_id");

    if (tierId && TIER_DEFS[tierId]) {
      const tier = TIER_DEFS[tierId];
      setUnlockedTier(tier);
      if (sessionId) {
        const existing = localStorage.getItem("h5s_license");
        if (!existing || JSON.parse(existing).stripe_session_id !== sessionId) {
          const licenseData = { tier: tierId, stripe_session_id: sessionId, is_active: true };
          base44.entities.License.create(licenseData)
            .then(rec => localStorage.setItem("h5s_license", JSON.stringify(rec)))
            .catch(() => {});
        }
      }
      const url = new URL(window.location);
      url.searchParams.delete("unlocked");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url);
      // Scroll to demo after unlock
      setTimeout(() => scrollTo(demoRef), 600);
    } else {
      const saved = localStorage.getItem("h5s_license");
      if (saved) {
        const lic = JSON.parse(saved);
        if (lic.is_active && TIER_DEFS[lic.tier]) setUnlockedTier(TIER_DEFS[lic.tier]);
      }
    }
  }, []);

  const handleUnlock = (tier) => {
    setUnlockedTier(tier);
    if (tier.id === "single" && guidePlatform) {
      setUnlockedPlatforms([guidePlatform]);
    } else if (tier.id === "multi" && guidePlatform) {
      setUnlockedPlatforms(prev => [...new Set([...prev, guidePlatform])]);
    }
  };

  const isUnlocked = (platformId) => {
    if (!unlockedTier) return false;
    if (unlockedTier.id === "all") return true;
    if (unlockedTier.id === "multi") return unlockedPlatforms.includes(platformId);
    if (unlockedTier.id === "single") return unlockedPlatforms.includes(platformId);
    return false;
  };

  const handleRestore = (license) => {
    if (TIER_DEFS[license.tier]) setUnlockedTier(TIER_DEFS[license.tier]);
  };

  // When user clicks "Unlock Full Guide" from the demo
  const handleUnlockFromDemo = () => {
    scrollTo(outcomesRef);
  };

  const handleDFY = () => {
    scrollTo(dfyRef);
  };

  // When demo wants to surface a full guide
  const handleShowFullGuide = (platformId, engineId) => {
    setGuidePlatform(platformId ? { id: platformId } : null);
    setGuideEngine(engineId ? { id: engineId } : null);
    setShowFullGuide(true);
    setTimeout(() => scrollTo(guideRef), 300);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="relative">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-32 space-y-24">

          {/* 1. HERO — DISTURB */}
          <section id={SECTIONS.HERO}>
            <HeroDisturbSection onStartDemo={() => scrollTo(demoRef)} />
          </section>

          <SectionDivider label="Interactive Demo" />

          {/* 2. INTERACTIVE DEMO */}
          <section id={SECTIONS.DEMO} ref={demoRef}>
            <InteractiveDemoSection
              onUnlockAll={handleUnlockFromDemo}
              onDFY={handleDFY}
            />
          </section>

          <SectionDivider label="What You Get" />

          {/* 3. OUTCOMES + TIERS */}
          <section id={SECTIONS.OUTCOMES} ref={outcomesRef}>
            <WhatYouGetSection
              onStartDemo={() => scrollTo(demoRef)}
              onDFY={handleDFY}
            />
          </section>

          <SectionDivider label="Done For You — Alpha-9 Scanner" />

          {/* 4. DFY / ALPHA-9 SCAN */}
          <section id={SECTIONS.DFY} ref={dfyRef}>
            <Alpha9ScanSection />
          </section>

          {/* 5. FULL GUIDE — shown when user selects a combo and unlocks */}
          <AnimatePresence>
            {showFullGuide && guidePlatform && guideEngine && (
              <motion.section
                key="full-guide"
                id={SECTIONS.GUIDE}
                ref={guideRef}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SectionDivider label="Full Implementation Guide" />
                <div className="mt-8">
                  <WizardStep3Guide
                    platform={guidePlatform}
                    engine={guideEngine}
                    unlocked={isUnlocked(guidePlatform?.id)}
                    unlockedTier={unlockedTier}
                    onUnlock={handleUnlock}
                    onReset={() => { setShowFullGuide(false); setGuidePlatform(null); setGuideEngine(null); scrollTo(demoRef); }}
                  />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* License restore */}
          {!unlockedTier && (
            <div className="max-w-xl mx-auto">
              <LicenseRestore onRestore={handleRestore} />
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}