"use client";

import React from "react";
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

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ComplianceHub />
      <PlatformHub />
      <DiagnosticsSection />
      <CertificationSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}