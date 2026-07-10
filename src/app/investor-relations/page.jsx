"use client";

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Handshake } from 'lucide-react';

export default function InvestorRelations() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter pt-32">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pb-24">
         <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Handshake className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Investor CRM & Intelligence</h1>
            <p className="text-emerald-400/80 text-sm font-mono uppercase tracking-widest">Partnership Management Pipeline</p>
          </div>
        </div>

        <div className="h-64 rounded-xl border border-white/5 bg-card flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Deal Flow Matrix</h3>
            <p className="text-muted-foreground text-sm max-w-lg mb-6">Centralized deal flow tracking from Outreach to Term Sheet. AI interaction nudges require the base44 Mail plugin activation.</p>
            <div className="px-4 py-2 border border-white/10 rounded-full text-xs font-mono text-muted-foreground/50">SYNCHRONIZATION: PENDING</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
