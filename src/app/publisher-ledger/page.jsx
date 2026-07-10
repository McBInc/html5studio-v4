"use client";

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import FinancialDashboard from '@/components/FinancialDashboard';
import { Briefcase } from 'lucide-react';

export default function PublisherLedger() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter pt-32">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Publisher's Operational Ledger</h1>
            <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">GAAP Compliant Financial Control Panel</p>
          </div>
        </div>
        <FinancialDashboard />
      </div>
      <Footer />
    </div>
  );
}
