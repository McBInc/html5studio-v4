import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Facebook, MessageSquare, Send, Activity, 
  ExternalLink, FileUp, Loader2, Lock, Database, Terminal, 
  Globe, ChevronRight, BarChart3, Layers
} from 'lucide-react';

const styles = {
  section: { padding: '100px 8%', maxWidth: '1600px', margin: '0 auto' },
  glassCard: { 
    background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', 
    border: '1px solid rgba(255,255,255,0.08)', 
    borderRadius: '12px', 
    padding: '32px',
    transition: 'all 0.3s ease'
  },
  heroTitle: { fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em' },
  accent: { color: '#A855F7', textShadow: '0 0 20px rgba(168, 85, 247, 0.2)' },
  mono: { fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }
};

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [activeProtocol, setActiveProtocol] = useState('META');

  const handleForensicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    setStatusMsg("INITIALIZING SECURE INGESTION...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatusMsg("HASHING BUILD // ANALYZING WASM STRUCTURE...");
      const response = await fetch('https://html5studio-v4.vercel.app/api/scanbuild', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatusMsg("SCAN COMPLETE. REDIRECTING...");
        setTimeout(() => {
          window.location.href = `https://html5studio-v4.vercel.app/report/${data.certId}`;
        }, 1000);
      } else {
        setIsScanning(false);
        alert("Diagnostic Error: Invalid Zip Structure.");
      }
    } catch (err) {
      setIsScanning(false);
      alert("Bridge Timeout: Check local connection to aimationtech node.");
    }
  };

  return (
    <div style={{ backgroundColor: '#09090B', color: '#FFFFFF', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. AGENT LISTENER: LIVE INTEL TICKER */}
      <div style={{ background: '#111', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', padding: '12px 0', overflow: 'hidden' }}>
        <div className="animate-marquee" style={{ display: 'flex', gap: '80px', fontSize: '11px', fontWeight: '600', opacity: 0.7 }}>
          <span>[r/Unity3D] "iOS 18 WebGL Performance Drop" — Audit Protocol v5.1 Updated.</span>
          <span>[Agent Listener] New Meta Instant Games SDK v8.5 compliance alert detected.</span>
          <span>[Status] Registry Index: 432 Certified Assets Active on Digital Frontier.</span>
          <span>[Intel] Telegram Stars payment bridge latency successfully mitigated.</span>
        </div>
      </div>

      {/* 2. NAVIGATION: MASTER CONTROL */}
      <nav style={{ padding: '24px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(9, 9, 11, 0.9)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>HTML5<span style={{color: '#FF5722'}}>STUDIO</span></div>
        <div style={{ display: 'flex', gap: '40px', fontSize: '14px', fontWeight: '500', opacity: 0.6 }}>
          <span>Products</span><span>Solutions</span><span>Resources</span><span>Company</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', opacity: 0.5, cursor: 'pointer' }}>Sign In</span>
          <button style={{ background: '#FFF', color: '#000', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer' }}>Contact Sales</button>
        </div>
      </nav>

      {/* 3. HERO: INDUSTRIAL CERTIFICATION HUB */}
      <header style={styles.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <h1 style={styles.heroTitle}>HTML5 Studio: your trusty set of <br/><span style={styles.accent}>deployment tools.</span></h1>
            <p style={{ fontSize: '19px', opacity: 0.5, maxWidth: '580px', marginBottom: '40px', lineHeight: '1.6' }}>
              The definitive Unity WebGL Certification Authority. We bridge the gap between broken code and 2026 platform compliance.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => document.getElementById('audit').scrollIntoView()} style={{ background: '#A855F7', color: 'white', padding: '18px 36px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>Initialize Protocol</button>
              <button style={{ background: 'transparent', color: 'white', padding: '18px 36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontWeight: '700', fontSize: '15px' }}>Launch App</button>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
             <div style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', position: 'absolute' }}></div>
             <img src="/WebGL_HTML5STUDIO_Certified_Seal.png" style={{ width: '280px', filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))', borderRadius: '50%' }} alt="Authority Hub" />
          </div>
        </div>
      </header>

      {/* 4. FEATURED PRODUCTS (GIGS AS PRODUCTS) */}
      <section style={styles.section}>
        <h2 style={{ fontSize: '28px', marginBottom: '40px', fontWeight: '700' }}>Featured <span style={{opacity: 0.4}}>Certification Modules</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {[
            { title: "Meta Compliance", icon: <Facebook size={24} color="#A855F7"/>, desc: "Legacy asset recovery for the Sept 2026 Sunset." },
            { title: "Telegram Engine", icon: <Send size={24} color="#A855F7"/>, desc: "Stars economy & Mini-App deployment protocols." },
            { title: "Discord Activity", icon: <MessageSquare size={24} color="#A855F7"/>, desc: "EmbeddedActivity SDK v2 integration specialist." },
            { title: "WASM Guard", icon: <Activity size={24} color="#A855F7"/>, desc: "Memory heap optimization & iOS 18 fix-packs." }
          ].map((item, i) => (
            <div key={i} style={styles.glassCard} className="hover-card">
              <div style={{ marginBottom: '24px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', fontWeight: '700' }}>{item.title} Module</h3>
              <p style={{ fontSize: '14px', opacity: 0.4, marginBottom: '24px', lineHeight: '1.5' }}>{item.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#A855F7', cursor: 'pointer' }}>
                Review Protocol <ChevronRight size={14}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. THE COMPLIANCE PATHWAYS (INTERACTIVE DIAGRAM) */}
      <section style={{ background: '#050507', padding: '100px 0' }}>
        <div style={styles.section}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Unity Compliance <span style={styles.accent}>Pathways</span></h2>
            <p style={{ opacity: 0.5, marginTop: '12px' }}>How HTML5 Studio improves asset development and management.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '60px', alignItems: 'center' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Meta Sunset', 'WASM Memory', 'Zero Permission', 'Stars Economy', 'Security Audit'].map(tab => (
                  <div 
                    key={tab} 
                    onClick={() => setActiveProtocol(tab)} 
                    style={{ 
                      padding: '16px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
                      background: activeProtocol === tab ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                      color: activeProtocol === tab ? '#A855F7' : 'rgba(255,255,255,0.4)',
                      transition: '0.2s all'
                    }}
                  >
                    {tab}
                  </div>
                ))}
             </div>
             <div style={{ ...styles.glassCard, background: '#0D0D12' }}>
                <div style={{ display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
                   <div style={{ flex: 1 }}>
                      <div style={{ ...styles.mono, color: '#A855F7', marginBottom: '16px' }}>Protocol_Ref // 2026_INTEL</div>
                      <h3 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '800' }}>{activeProtocol} Analysis</h3>
                      <p style={{ opacity: 0.5, lineHeight: '1.8', fontSize: '15px' }}>
                        Executing deep forensic diagnostics for {activeProtocol}. We identify WASM memory leaks, 
                        header mismatches, and platform-specific blockers before they reach the deployment stage. 
                        Certified assets are guaranteed to run live on target nodes.
                      </p>
                   </div>
                   <div style={{ width: '240px', height: '240px', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(168, 85, 247, 0.05)' }}>
                      <Layers size={100} color="#A855F7" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. THE DIAGNOSTIC TERMINAL: THE BRIDGE (PURPLE/BLUE INTAKE) */}
      <section style={styles.section} id="audit">
        <div style={{ background: 'linear-gradient(90deg, #1E1B4B 0%, #0D0D12 100%)', borderRadius: '16px', border: '1px solid #312E81', padding: '80px', textAlign: 'center' }}>
           {isScanning ? (
              <div>
                 <Loader2 size={64} color="#39FF14" className="animate-spin" style={{ margin: '0 auto' }} />
                 <h2 style={{ color: '#39FF14', marginTop: '30px', fontWeight: '800' }}>{statusMsg}</h2>
              </div>
           ) : (
              <>
                 <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px' }}>Initiate Forensic <span style={{color: '#39FF14'}}>Diagnostic</span></h2>
                 <p style={{ opacity: 0.6, maxWidth: '600px', margin: '0 auto 40px', fontSize: '16px' }}>
                   Get any Unity WebGL build certified for a 2026 platform deployment. 
                   Free community audit includes HUD-enabled error analysis.
                 </p>
                 <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleForensicUpload} />
                 <label htmlFor="file-upload" style={{ background: '#FFF', color: '#000', padding: '18px 48px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '15px' }}>SELECT LOCAL ASSET</label>
                 <div style={{ marginTop: '30px', ...styles.mono, fontSize: '10px', opacity: 0.4 }}>SECURE VERCEL BRIDGE ACTIVE // AIMATIONTECH NODE</div>
              </>
           )}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ padding: '80px 8%', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
         <div>
            <div style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>HTML5<span style={{color: '#FF5722'}}>STUDIO</span></div>
            <p style={{ fontSize: '12px', opacity: 0.4, lineHeight: '1.6' }}>© 2026 HTML5 Studio. <br/>Aimationtech.com All rights reserved.</p>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', opacity: 0.5 }}>
            <span style={{fontWeight: '700', color: 'white'}}>Products</span>
            <span>Meta Compliance</span><span>Telegram Engine</span><span>Discord Activity</span>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', opacity: 0.5 }}>
            <span style={{fontWeight: '700', color: 'white'}}>Company</span>
            <span>About Us</span><span>Intelligence</span><span>Contact</span>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', opacity: 0.5 }}>
            <span style={{fontWeight: '700', color: 'white'}}>Legal</span>
            <span>Privacy Policy</span><span>Terms of Service</span><span>Audit Security</span>
         </div>
      </footer>

    </div>
  );
}