"use client";

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import NewsTicker from '@/components/landing/NewsTicker';
import { motion } from 'framer-motion';
import { Handshake, DatabaseZap } from 'lucide-react';

/**
 * INVESTOR RELATIONS HUB (V96)
 * Ported from V5 to V4 Next.js.
 * Features: Partnership Pipeline, Deal Flow Matrix Hub.
 */

export default function InvestorRelationsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      <NewsTicker />
      <Navbar />

      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none"
             style={{ background: "radial-gradient(ellipse, rgba(0,255,136,0.06) 0%, transparent 70%)" }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-emerald-500/20">
               <Handshake className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                Investor <span className="text-emerald-500 italic">Partnerships.</span>
              </h1>
              <p className="text-lg text-emerald-400/60 font-black uppercase tracking-[0.3em] mt-2">DIP Authority // Capital Pipeline</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
             <div className="p-12 rounded-[48px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-3xl flex flex-col items-center justify-center text-center">
                <DatabaseZap className="w-12 h-12 text-blue-500 mb-6" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Deal Flow Matrix</h3>
                <p className="text-gray-500 text-lg font-medium leading-relaxed italic max-w-sm mb-8">
                   Centralized deal flow tracking from Forensic Outreach to Terms Alpha. 
                   Synchronizing with base44 Mail plugin for automated interaction logic.
                </p>
                <div className="px-6 py-2 border border-blue-500/30 bg-blue-500/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">
                   Synchronization: In Progress
                </div>
             </div>

             <div className="p-12 rounded-[48px] border border-white/5 bg-white/[0.01] flex flex-col justify-end">
                <div className="space-y-4">
                   <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Active Leads</span>
                      <span className="text-white font-black font-mono">248</span>
                   </div>
                   <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Pipeline Value</span>
                      <span className="text-white font-black font-mono">$1.4M ARR</span>
                   </div>
                   <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Conversion Delta</span>
                      <span className="text-emerald-500 font-black font-mono">+12.4%</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
