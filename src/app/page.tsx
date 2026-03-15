'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, Facebook, MessageSquare, Send, Activity, 
  ChevronRight, Lock, Layers, Zap, Database, Terminal, 
  Search, Menu, Cpu, Layout, Github, Twitter, Linkedin, Plus, Loader2
} from 'lucide-react';

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('Meta Compliance');

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-300 font-sans selection:bg-blue-500/30">
      
      {/* 1. AGENT LISTENER TICKER */}
      <div className="bg-black/50 border-b border-white/5 py-2 overflow-hidden">
        <div className="flex gap-20 animate-marquee whitespace-nowrap text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">
          <span>[INTEL] SEPT 2026 META SUNSET COUNTDOWN ACTIVE</span>
          <span>[STATUS] REGISTRY INDEX: 432 CERTIFIED ASSETS ACTIVE</span>
          <span>[AGENT] NEW META INSTANT GAMES SDK V8.5 COMPLIANCE DETECTED</span>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white uppercase italic">HTML5<span className="text-blue-500 not-italic font-black">STUDIO</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors">Products</a>
              <a href="#" className="hover:text-white transition-colors">Compliance</a>
              <a href="#" className="hover:text-white transition-colors">Intelligence</a>
              <a href="#" className="hover:text-white transition-colors">Registry</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded text-xs font-bold hover:bg-white/10 transition-all">
                <Lock size={14} className="text-blue-500" /> Master Panel
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* 3. HERO SECTION */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                HTML5 Studio: your trusty set of <br className="hidden md:block" /> <span className="text-blue-500">deployment tools.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
                The definitive Unity WebGL Certification Authority. We bridge the gap between legacy code and 2026 platform compliance.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button onClick={() => document.getElementById('audit')?.scrollIntoView({behavior:'smooth'})} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                  Initialize Protocol
                </button>
                <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold transition-all">
                  View Registry
                </button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all"></div>
              <img src="/WebGL_HTML5STUDIO_Certified_Seal.png" className="relative z-10 w-full drop-shadow-2xl" alt="Certified Seal" />
            </div>
          </div>
        </section>

        {/* 4. FEATURED MODULES */}
        <section className="py-20 bg-[#0f131a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12">Strategic compliance modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Meta Compliance', icon: <Facebook className="text-purple-500" />, bg: 'bg-purple-500/10' },
                { name: 'Telegram Engine', icon: <Send className="text-blue-400" />, bg: 'bg-blue-400/10' },
                { name: 'Discord Activities', icon: <MessageSquare className="text-orange-500" />, bg: 'bg-orange-500/10' }
              ].map((product, i) => (
                <div key={i} className="group bg-[#161b22] border border-white/5 p-8 rounded-xl hover:border-blue-500/30 transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 ${product.bg} rounded-lg flex items-center justify-center mb-6`}>
                    {product.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    Authoritative certification and deployment bridges for high-fidelity 2026 platform readiness.
                  </p>
                  <a href="#" className="inline-flex items-center text-blue-500 text-sm font-semibold group-hover:gap-2 transition-all">
                    Review Protocol <ChevronRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. DIAGRAM SECTION */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Authoritative Unity <br /> Forensic Intelligence</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Meta Compliance', 'WASM Audit', 'Stars Economy', 'Zero Permission'].map((tab, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded text-sm font-medium transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="bg-[#161b22] border border-white/10 rounded-2xl p-8 relative overflow-hidden group min-h-[300px] flex flex-col justify-center">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all"></div>
                  <h3 className="text-2xl font-bold text-white mb-4">{activeTab} Protocol</h3>
                  <p className="text-gray-400 leading-relaxed mb-8 italic">
                    "Executing deep forensic diagnostics for {activeTab}. We identify WASM memory leaks and platform blockers to ensure live deployment."
                  </p>
                </div>
              </div>

              {/* Visual Hierarchy Diagram */}
              <div className="relative aspect-square flex items-center justify-center scale-90 lg:scale-100">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 w-24 h-24 bg-[#0b0e14] border-2 border-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-pulse">
                  <Layers className="text-blue-500 w-10 h-10" />
                  <div className="absolute top-1/2 left-full w-24 h-[1px] bg-gradient-to-r from-blue-600 to-transparent"></div>
                  <div className="absolute top-1/2 right-full w-24 h-[1px] bg-gradient-to-l from-blue-600 to-transparent"></div>
                  <div className="absolute bottom-full left-1/2 w-[1px] h-24 bg-gradient-to-t from-blue-600 to-transparent"></div>
                  <div className="absolute top-full left-1/2 w-[1px] h-24 bg-gradient-to-b from-blue-600 to-transparent"></div>
                </div>
                <div className="absolute top-20 right-0 bg-[#161b22] border border-white/10 px-4 py-2 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest">WASM Fix</div>
                <div className="absolute top-20 left-0 bg-[#161b22] border border-white/10 px-4 py-2 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest">Payload Hashing</div>
                <div className="absolute bottom-20 right-0 bg-[#161b22] border border-white/10 px-4 py-2 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest">Header Audit</div>
                <div className="absolute bottom-20 left-0 bg-[#161b22] border border-white/10 px-4 py-2 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest">Heap Fix</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. DIAGNOSTIC TERMINAL */}
        <section id="audit" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              {isScanning ? (
                <div className="py-10">
                  <Loader2 size={64} className="animate-spin text-white mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Initializing Forensic Diagnostic...</h2>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Initiate Forensic <span className="text-black/30">Diagnostic</span></h2>
                  <p className="text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed text-lg italic">
                    "Upload your Unity WebGL build for an authoritative 2026 compliance report and live deployment link."
                  </p>
                  <button 
                    onClick={() => setIsScanning(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 rounded-xl font-black text-lg transition-all shadow-xl hover:scale-105"
                  >
                    SELECT LOCAL ASSET (.ZIP)
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 7. ASSET REGISTRY (Success Stories) */}
        <section className="py-24 bg-[#0f131a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-12">Certified Asset Registry // 2026 Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  company: 'PROJECT FRONTIER', 
                  quote: '"HTML5 Studio solved our WASM heap issues on Safari iOS in seconds. Our Meta Instant Game launch was flawless. Authoritative certification is a game changer."',
                  author: 'Greg Rhind',
                  title: 'Development Lead'
                },
                { 
                  company: 'WGL-CERT-000822', 
                  quote: '"Managing multiple builds across Telegram and Discord was a nightmare until we integrated the HTML5 Studio deployment bridge. Zero-latency handshakes guaranteed."',
                  author: 'Sarah Jenkins',
                  title: 'Technical Director'
                }
              ].map((t, i) => (
                <div key={i} className="bg-[#161b22] p-10 rounded-2xl border border-white/5">
                  <div className="text-blue-500 font-black tracking-tighter text-xl mb-8">{t.company}</div>
                  <p className="text-gray-300 italic mb-8 leading-relaxed text-lg">{t.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center"><ShieldCheck size={20} className="text-blue-500"/></div>
                    <div>
                      <div className="text-white font-bold">{t.author}</div>
                      <div className="text-xs text-gray-500">{t.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="bg-[#0b0e14] border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em]">
            AIMATIONTECH.COM // HTML5STUDIO v5.0 // THE DIGITAL FRONTIER
          </div>
        </div>
      </footer>
    </div>
  );
}