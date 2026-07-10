'use client';

import React from 'react';
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import IntelligenceHero from '@/components/intelligenceCentre/IntelligenceHero';
import TopicalMapSection from '@/components/intelligenceCentre/TopicalMapSection';

/**
 * INTELLIGENCE CENTRE (V96)
 * Full Transplant from V5 to V4 Next.js.
 * Features: High-Fidelity Signal Map, Industry Hero, Global Integrity.
 */

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-black text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 0: Navigation Hub */}
      <NewsTicker />
      <Navbar />

      {/* 1: Intelligence Engine */}
      <IntelligenceHero />

      {/* 2: The Architecture Hub */}
      <TopicalMapSection />

      {/* 3: Legal Authority */}
      <Footer />

    </div>
  );
}
