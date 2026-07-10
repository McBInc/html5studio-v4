"use client";

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import NewsTicker from '@/components/landing/NewsTicker';
import { motion } from 'framer-motion';
import { Target, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';

/**
 * MARKETING DASHBOARD (V96)
 * Ported from V5 to V4 Next.js.
 * Features: Scaling Control Panel, Acquisition Analytics Hub.
 */

export default function MarketingDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white font-inter selection:bg-purple-500/30 overflow-x-hidden">
      <NewsTicker />
      <Navbar />

      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none"
             style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-purple-500/20">
               <Target className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                Marketing <span className="text-purple-500 italic">UA Engine.</span>
              </h1>
              <p className="text-lg text-purple-400/60 font-black uppercase tracking-[0.3em] mt-2">DIP Authority // Scale Protocol</p>
            </div>
          </motion.div>

          {/* Core Analytics Blocks */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
             <div className="p-12 lg:col-span-2 rounded-[48px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-3xl text-center flex flex-col items-center justify-center">
                <Target className="w-12 h-12 text-purple-500 mb-6" />
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 italic">Meta & TikTok Data Aggregation Ping</h3>
                <p className="text-gray-500 text-lg font-medium leading-relaxed italic max-w-2xl mb-8">
                   Channel-level tracking and Creative Production pipelines are initializing. 
                   Awaiting active API tokens for realtime CPI / LTV / CAC calculation. 
                   Bridging forensic compliance data to UA spend optimization.
                </p>
                <div className="px-8 py-3 border border-purple-500/30 bg-purple-500/5 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 animate-pulse">
                   Status: Operational Standby
                </div>
             </div>

             <div className="p-12 rounded-[48px] border border-white/5 bg-white/[0.01] flex flex-col justify-end">
                <div className="space-y-6">
                   <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                         <TrendingUp className="w-4 h-4 text-purple-500" />
                         <span className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Global ROAS</span>
                      </div>
                      <span className="text-white font-black font-mono">3.4x</span>
                   </div>
                   <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                         <BarChart3 className="w-4 h-4 text-purple-500" />
                         <span className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Avg CPI</span>
                      </div>
                      <span className="text-white font-black font-mono">$0.82</span>
                   </div>
                   <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                         <AlertTriangle className="w-4 h-4 text-gray-900" />
                         <span className="text-gray-700 font-bold uppercase text-[10px] tracking-widest leading-none">Creative Fatigue Alert</span>
                      </div>
                      <span className="text-red-500 font-black font-mono uppercase text-[9px]">High Priority</span>
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
