"use client";

import React from "react";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import IntelligenceHero from '@/components/intelligenceCentre/IntelligenceHero';
import TopicalMapSection from '@/components/intelligenceCentre/TopicalMapSection';
import Footer from '@/components/landing/Footer';

export default function IntelligenceCentre() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />
      <IntelligenceHero />
      <TopicalMapSection />
      <Footer />
    </div>
  );
}