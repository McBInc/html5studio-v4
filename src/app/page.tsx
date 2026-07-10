'use client';

import React from 'react';
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import ComplianceHub from '@/components/landing/ComplianceHub';
import PlatformHub from '@/components/landing/PlatformHub';
import DiagnosticsSection from '@/components/landing/DiagnosticsSection';
import CertificationSection from '@/components/landing/CertificationSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

/**
 * ALPHA-9 MASTER LANDING SEQUENCE (V90)
 * Re-aligned to exact V5 project order.
 * Purge: Legacy Gemini Skills.
 * Restore: High-Fidelity Aesthetic & Octagon Hub.
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 0: Global Ticker */}
      <NewsTicker />

      {/* 1: Navigation */}
      <Navbar />

      {/* 2: The Hook */}
      <HeroSection />

      {/* 3: The Threat (Sunset) */}
      <ProblemSection />

      {/* 4: The Proof (Certification Validation Layer) */}
      <ComplianceHub />

      {/* 5: The Interface (Octagon Hub) */}
      <PlatformHub />

      {/* 6: The Engine (Forensic Ingestion) */}
      <DiagnosticsSection />

      {/* 7: The Certification (Registry Proof) */}
      <CertificationSection />

      {/* 8: The Tiers (Pricing) */}
      <PricingSection />

      {/* 9: Final Protocol (CTA) */}
      <CTASection />

      {/* 10: Legal Authority & Nav */}
      <Footer />

    </div>
  );
}