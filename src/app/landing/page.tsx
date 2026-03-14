"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Facebook, MessageSquare, Send, Activity, ExternalLink, AlertTriangle, Cpu, Globe } from 'lucide-react';

const styles = {
  section: { padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative' } as React.CSSProperties,
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '40px', position: 'relative', overflow: 'hidden' } as React.CSSProperties,
  h1: { fontSize: 'clamp(2.5rem, 8vw, 6.5rem)', fontWeight: '700', textTransform: 'uppercase', lineHeight: '0.85', marginBottom: '25px', letterSpacing: '-0.02em', color: 'white' } as React.CSSProperties,
  h2: { fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '40px', letterSpacing: '-0.01em', color: 'white' } as React.CSSProperties,
  mono: { fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' } as React.CSSProperties
};

export default function LandingPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleForensicUpload = async (file: File) => {
    if (!file) return;
    
    setIsScanning(true);
    setScanStatus('INITIALIZING SECURE INGESTION...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const projectName = file.name.replace('.zip', '') || 'Forensic Audit';
      formData.append('projectName', projectName);

      setScanStatus('EXECUTING SCAN ENGINE...');
      const response = await fetch('/api/scanbuild', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'SCAN_ENGINE_FAILURE';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setScanStatus('CERTIFICATION_SUCCESS. REDIRECTING...');
      
      if (data.certId) {
        window.location.href = `/report/${data.certId}`;
      } else {
        throw new Error('MISSING_CERT_ID');
      }
    } catch (err: any) {
      console.error('Audit Failure:', err);
      setScanStatus(`PROTOCOL_ERROR: ${String(err.message).toUpperCase()}`);
      setTimeout(() => setIsScanning(false), 5000);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleForensicUpload(file);
  };

  return (
    <div className="bg-[#0D0D12] text-white min-h-screen scroll-smooth">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".zip" 
        onChange={onFileChange}
      />
      
      {/* 1. INTELLIGENCE TICKER (LIVE PULSE) */}
      <div className="bg-[#FF5722] text-black overflow-hidden py-3 sticky top-0 z-[1000]">
        <div className="animate-marquee">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-[100px] font-[900] text-[11px] uppercase whitespace-nowrap">
              <span>[INTEL] SEPT 2026 META SUNSET COUNTDOWN ACTIVE</span>
              <span>[UNITY_FORUM] WASM HEAP LIMIT REACHED ON IOS 17.4</span>
              <span>[ALERT] VULTURE CLONE ACTIVITY DETECTED ON KEYWORD: &apos;UNITY WEBGL&apos;</span>
              <span>[STATUS] WEBGLIVE DEPLOYMENT CERTIFICATION AUTHORITY ACTIVE</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HERO: MISSION CRITICAL AUTHORITY */}
      <section style={{ ...styles.section }} className="pt-[100px] min-h-[70vh] flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-12 z-0 pointer-events-none">
           <img src="/Guaranteed_Live_Game_Link.jpg" className="w-full h-full object-cover" alt="Background Frontier Grid" />
        </div>
        <div className="relative z-[1]">
          <div className="flex items-center gap-[10px] color-[#39FF14] mb-5">
            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span style={styles.mono} className="text-[#39FF14]">Game Industry Intelligence Centre // Online Gaming</span>
          </div>
          <h1 style={styles.h1}>
            FIX YOUR <br />
            <span className="text-[#FF5722] italic font-['DM_Serif_Display']">UNITY WEBGL GAME.</span>
          </h1>
          <p className="max-w-[650px] text-[rgba(255,255,255,0.6)] text-xl mb-[45px] leading-[1.4]">
            The September 2026 Meta Sunset is not an ending—it is a pivot. We architecture high-fidelity transitions to 
            <span className="text-[#FF5722] font-bold"> certified business assets.</span>
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#FF5722] text-white px-12 py-6 rounded-[60px] border-none font-[900] uppercase cursor-pointer flex gap-[15px] items-center shadow-[0_10px_30px_rgba(255,87,34,0.3)] hover:scale-105 transition-transform"
            >
              Initialize Protocol <Zap size={20} />
            </button>
            <Link href="/" className="bg-[rgba(255,255,255,0.05)] text-white px-12 py-6 rounded-[60px] border border-[rgba(255,255,255,0.1)] font-[900] uppercase cursor-pointer flex gap-[15px] items-center hover:bg-[rgba(255,255,255,0.1)] transition-all">
              Launch App
            </Link>
          </div>
        </div>
      </section>

      {/* 3. COMMUNITY SIGNAL: THE PAIN POINTS (SEO INJECTION) */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Digital_Frontier: <span className="text-[#FF5722]">Community_Signal</span></h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
          {[
            { q: "My Unity WebGL build just hangs at 90%. Is the compression setting broken?", tag: "LOADING FOREVER", platform: "r/UNITY3D", url: "https://www.reddit.com/r/Unity3D/" },
            { q: "Critical memory allocation failure on iOS 17.4 Safari. WASM Heap is exhausted.", tag: "WASM ERROR", platform: "UNITY FORUM", url: "https://discussions.unity.com/" },
            { q: "Netlify deploy fails every time with 'Brotli not found' error. Any fix?", tag: "BUILD NOT WORKING", platform: "r/GAMEDEV", url: "https://www.reddit.com/r/gamedev/" }
          ].map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={styles.card} className="no-underline hover:border-[#FF5722] transition-colors">
              <div style={{ ...styles.mono }} className="opacity-30 mb-[25px]">{item.platform}</div>
              <p className="italic opacity-80 text-lg leading-[1.6] text-white">&quot;{item.q}&quot;</p>
              <div className="text-[#FF5722] text-[10px] font-[900] mt-[35px] border border-[#FF5722] px-[14px] py-1.5 rounded-lg inline-block">
                [ {item.tag} ]
              </div>
            </a>
          ))}
        </div>
        <div className="mt-[100px] text-center">
           <h3 className="text-[clamp(1.5rem,5vw,4.5rem)] font-[900] uppercase text-[rgba(255,255,255,0.08)] leading-none m-0">
             FROM FRUSTRATED DEVELOPER TO <br />
             <span className="text-white">CERTIFIED ASSET OWNER.</span>
           </h3>
        </div>
      </section>

      {/* 4. STRATEGIC COMPLIANCE HUBS (THE 2026 DEADLINE) */}
      <section style={styles.section}>
        <div className="flex justify-between items-end mb-[80px] flex-wrap gap-10">
          <h2 style={{ ...styles.h2, margin: 0 }} className="text-[clamp(2rem,5vw,4.5rem)]">
            STRATEGIC <br />
            <span className="text-[#39FF14]">COMPLIANCE HUBS</span>
          </h2>
          <div className="bg-[rgba(57,255,20,0.05)] p-[30px] rounded-[30px] max-w-[360px] border border-[rgba(57,255,20,0.1)]">
             <div className="flex items-center gap-3 text-[#39FF14] mb-3">
                <Activity size={18} /> <span style={{ ...styles.mono }} className="font-[900]">Intelligence Centre</span>
             </div>
             <p className="text-[13px] text-[rgba(255,255,255,0.5)] m-0 leading-[1.6]">
               The September 2026 Sunset is a mandatory transition. We ensure your digital equity survives the revenue migration.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-[30px]">
          <div style={styles.card} className="border-t-4 border-t-[#FF5722]">
            <Facebook color="#39FF14" size={40} className="mb-[25px]" />
            <h3 className="text-[26px] font-bold mb-3">META / FACEBOOK</h3>
            <p className="text-[15px] opacity-60 leading-[1.7] mb-[35px]">Revenue continuity for assets affected by the 2026 platform evolution. Legacy equity recovery specialists.</p>
            <div style={styles.mono} className="text-[#FF5722] font-[900]">[ DEADLINE: SEPT 2026 ]</div>
          </div>
          <div style={styles.card}>
            <MessageSquare color="#39FF14" size={40} className="mb-[25px]" />
            <h3 className="text-[26px] font-bold mb-3">DISCORD ACTIVITIES</h3>
            <p className="text-[15px] opacity-60 leading-[1.7] mb-[35px]">Instant-play integration. Launch directly into embedded activities with zero-latency WASM architecture.</p>
            <div style={styles.mono} className="text-[#39FF14] font-[900]">[ STATUS: REVENUE_READY ]</div>
          </div>
          <div style={styles.card}>
            <Send color="#39FF14" size={40} className="mb-[25px]" />
            <h3 className="text-[26px] font-bold mb-3">TELEGRAM GAMES</h3>
            <p className="text-[15px] opacity-60 leading-[1.7] mb-[35px]">Certified payment and deployment bridges for the Stars economy. Engineered for global mobile accessibility.</p>
            <div style={styles.mono} className="text-[#39FF14] font-[900]">[ ECONOMY: STARS_STUB ]</div>
          </div>
        </div>
      </section>

      {/* --- 5. THE INTELLIGENCE ARCHIVES (SEO DOMINATION) --- */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Intelligence_Archives: <span className="text-[#FF5722]">Strategic_Protocols</span></h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[30px]">
          
          {/* Article 1: Zero Permission */}
          <div style={styles.card}>
            <div style={styles.mono} className="text-[#39FF14] mb-[15px]">Protocol_01 // Privacy_Sandbox</div>
            <h3 className="text-xl mb-[15px]">The Zero-Permission Shift: Surviving the 2026 Privacy Sandbox</h3>
            <p className="text-sm opacity-60 leading-[1.6] mb-5">
              Modern browsers are migrating to a &quot;Zero-Permission&quot; model. We break down how Unity WebGL builds must adapt their data-handling and cookie-less tracking to maintain revenue status.
            </p>
            <Link href="/articles/zero-permission-shift" className="bg-transparent border-none text-[#FF5722] font-bold text-[12px] cursor-pointer p-0 no-underline hover:underline">READ FULL PROTOCOL →</Link>
          </div>

          {/* Article 2: WASM Memory */}
          <div style={styles.card}>
            <div style={styles.mono} className="text-[#39FF14] mb-[15px]">Protocol_02 // Heap_Optimization</div>
            <h3 className="text-xl mb-[15px]">Beyond the 2GB Limit: Solving WASM Heap Exhaustion</h3>
            <p className="text-sm opacity-60 leading-[1.6] mb-5">
              High-fidelity games often crash on mobile due to rigid memory allocation. Learn how our forensic audit identifies and fixes heap leaks before the user hits the infinite progress bar.
            </p>
            <Link href="/articles/wasm-memory-optimization" className="bg-transparent border-none text-[#FF5722] font-bold text-[12px] cursor-pointer p-0 no-underline hover:underline">READ FULL PROTOCOL →</Link>
          </div>

          {/* Article 3: Meta Sunset */}
          <div style={styles.card}>
            <div style={styles.mono} className="text-[#39FF14] mb-[15px]">Protocol_03 // Asset_Preservation</div>
            <h3 className="text-xl mb-[15px]">The Sept 2026 Meta Sunset: A Strategic Equity Recovery Guide</h3>
            <p className="text-sm opacity-60 leading-[1.6] mb-5">
              Don&apos;t let your legacy Meta Instant Games die. We outline the technical bridge required to transition legacy builds into modern, compliant assets.
            </p>
            <Link href="/articles/meta-sunset-recovery" className="bg-transparent border-none text-[#FF5722] font-bold text-[12px] cursor-pointer p-0 no-underline hover:underline">READ FULL PROTOCOL →</Link>
          </div>

        </div>
      </section>

      {/* --- 6. ASSET VAULT: THE PROOF --- */}
      <section style={styles.section} id="vault">
        <div className="text-center mb-[80px]">
           <img 
             src="/WebGL_HTML5STUDIO_Certified_Seal.jpg" 
             className="w-[220px] mb-[30px] drop-shadow-[0_0_20px_rgba(57,255,20,0.2)] mx-auto" 
             alt="WebGLive Deployment Certification Authority Seal" 
           />
           <p style={styles.mono} className="text-[#FF5722] font-[900] tracking-[6px]">
             Certification Authority // Live Asset Registry
           </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-6">
          {[
            { id: "000822", title: "Project Frontier: Survival", url: "#", fix: "WASM Memory Heap" },
            { id: "000823", title: "Game Title Two", url: "#", fix: "Meta v8.4 Bridge" },
            { id: "000824", title: "Game Title Three", url: "#", fix: "SharedBuffer Compliance" },
            { id: "000825", title: "Game Title Four", url: "#", fix: "Brotli Header Optimization" },
            { id: "000826", title: "Game Title Five", url: "#", fix: "Discord SDK v2 Integration" },
            { id: "000827", title: "Game Title Six", url: "#", fix: "Telegram Stars Economy" }
          ].map((game, i) => (
            <div key={i} style={styles.card} className="border-[#39FF14] bg-[rgba(57,255,20,0.02)] p-[30px] hover:bg-[rgba(57,255,20,0.05)] transition-colors">
               <div className="flex justify-between items-center flex-wrap gap-5">
                  <div className="flex-1">
                    <h3 className="text-[22px] font-bold mb-[5px] text-white">{game.title}</h3>
                    <p className="opacity-50 text-[11px] font-mono m-0">
                      ASSET_ID: #WGL-CERT-{game.id} // FIX: {game.fix}
                    </p>
                  </div>
                  <a 
                    href={game.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-transparent border border-[#39FF14] text-[#39FF14] px-5 py-2.5 rounded-xl font-bold text-[11px] cursor-pointer flex gap-2 items-center uppercase no-underline hover:bg-[#39FF14] hover:text-black transition-all"
                  >
                    View Asset <ExternalLink size={14} />
                  </a>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 7. TECHNICAL AUDIT: THE DIAGNOSTIC LAB --- */}
      <section style={styles.section}>
        <div style={styles.card} className="bg-[rgba(57,255,20,0.05)] border-[#39FF14]">
          <div className="flex gap-10 items-center flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <h2 className="text-[32px] font-bold uppercase mb-[15px] text-white">
                Technical <span className="text-[#39FF14]">Audit Terminal</span>
              </h2>
              <p className="text-sm opacity-60 leading-[1.6]">
                Initiate a **Forensic Compliance Diagnostic**. Our system will hash the build, check WASM memory allocation, and verify Meta 2026 header readiness.
                <br /><br />
                <span className="text-[#39FF14] font-bold">[ SECURE INGESTION ACTIVE ]</span> Your IP is protected by local encryption and build-hash verification.
              </p>
            </div>
            
            <div className={`flex-1 min-w-[300px] border-2 ${isScanning ? 'border-solid' : 'border-dashed'} border-[rgba(57,255,20,0.3)] rounded-3xl p-[60px] text-center bg-[rgba(0,0,0,0.3)] transition-all duration-300`}>
              {isScanning ? (
                <>
                  <Activity color="#39FF14" size={48} className="mb-5 animate-pulse" />
                  <p style={styles.mono} className="text-[10px] text-[#39FF14]">{scanStatus}</p>
                </>
              ) : (
                <>
                  <ShieldCheck color="#39FF14" size={48} className="mb-5 opacity-50 mx-auto" />
                  <p style={styles.mono} className="text-[10px] text-white">Drop .Zip Build Here for Diagnosis</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-5 bg-transparent border border-white text-white px-6 py-3 rounded-xl cursor-pointer font-bold text-[12px] hover:bg-white hover:text-black transition-all"
                  >
                    Select Local Asset
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="px-5 py-20 text-center border-t border-t-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
         <div className="text-xl font-bold tracking-[3px] text-[#FF5722]">HTML5 STUDIO.</div>
         <p className="opacity-30 text-[11px] mt-[15px] uppercase tracking-[2px]">© 2026 THE DIGITAL FRONTIER // GAME INDUSTRY INTELLIGENCE CENTRE</p>
      </footer>

    </div>
  );
}
