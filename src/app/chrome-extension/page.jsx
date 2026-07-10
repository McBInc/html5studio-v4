"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Chrome, Download, Shield, Zap, Eye, Code, Copy, CheckCheck, ExternalLink } from "lucide-react";
import NewsTicker from '@/components/landing/NewsTicker';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const FILES = [
  { name: "manifest.json",   desc: "Extension manifest (Manifest V3)" },
  { name: "popup.html",      desc: "Popup shell — 400px wide" },
  { name: "popup.css",       desc: "Dark theme styles" },
  { name: "popup.js",        desc: "Full wizard logic — vanilla JS, no deps" },
  { name: "background.js",   desc: "Service worker — badge management" },
  { name: "content.js",      desc: "Portal reminder injection" },
  { name: "content.css",     desc: "Scoped content script styles" },
  { name: "README.md",       desc: "Submission guide + file structure" },
];

const STEPS = [
  { n: "01", title: "Download the extension files",  desc: "All files are in the chrome-extension/ folder in the project. Download or copy them to a local folder." },
  { n: "02", title: "Add icons",                     desc: "Generate 3 PNG icons (16×16, 48×48, 128×128) with the HTML5STUDIO branding and place them in icons/." },
  { n: "03", title: "Load unpacked for testing",     desc: "Open chrome://extensions → Enable Developer Mode → Load Unpacked → select the folder." },
  { n: "04", title: "Zip and submit",                desc: "Zip the contents (not the folder) → submit at chrome.google.com/webstore/devconsole. $5 one-time fee." },
];

const FEATURES = [
  { icon: Zap,    color: "#1e6ff0", title: "Auto-detects dev portals",    desc: "Badge lights up when you visit Meta, TikTok, Discord, YouTube, Poki, CrazyGames or LinkedIn developer consoles." },
  { icon: Eye,    color: "#00C896", title: "Portal reminder injection",   desc: "A subtle compliance reminder appears on dev portals — links back to the full wizard." },
  { icon: Code,   color: "#F39C12", title: "Free code blocks in-popup",   desc: "Copy free implementation snippets directly from the popup. Locked steps link to the $17 unlock." },
  { icon: Shield, color: "#EE1D52", title: "Minimal permissions",         desc: "Only activeTab + storage. No browsing history. No data collection. Passes Chrome's low-risk review." },
];

function CopyableCode({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl border border-white/8 bg-[#0d1117] p-4 font-mono text-xs text-green-300 whitespace-pre overflow-x-auto">
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-white/8 hover:bg-white/15 text-muted-foreground hover:text-foreground transition-all text-[10px]"
      >
        {copied ? <><CheckCheck className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
      </button>
      {code}
    </div>
  );
}

export default function ChromeExtension() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <section className="relative pt-36 pb-20">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">

          {/* Hero */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Chrome className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-wider">Chrome Extension</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              HTML5STUDIO<br />
              <span className="text-primary">Compliance Wizard</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The full compliance wizard — right in your browser. Auto-detects which game dev portal you're on and shows the relevant SDK migration guide instantly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <a
                href="/compliance-wizard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <Chrome className="w-4 h-4" />
                View Extension Preview
              </a>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 rounded-xl font-bold text-sm text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Chrome Web Store (Coming Soon)
              </a>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.6 }} className="grid sm:grid-cols-2 gap-4 mb-16">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="rounded-2xl border p-5" style={{ borderColor:`${f.color}20`, background:`${f.color}06` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:`${f.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color:f.color }} />
                    </div>
                    <span className="font-bold text-sm text-foreground">{f.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </motion.div>

          {/* File structure */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.6 }} className="mb-16">
            <h2 className="text-2xl font-black mb-2">Extension Files</h2>
            <p className="text-sm text-muted-foreground mb-6">All files live in <code className="text-primary font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">chrome-extension/</code> in this project.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {FILES.map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/2 p-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Code className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-foreground">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How to load */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.6 }} className="mb-16">
            <h2 className="text-2xl font-black mb-6">From Project → Chrome Web Store</h2>
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-white/8 bg-white/2 p-5">
                  <div className="text-2xl font-black font-mono text-primary/30 flex-shrink-0 w-10">{s.n}</div>
                  <div>
                    <div className="font-bold text-foreground mb-1">{s.title}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Load unpacked snippet */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.6 }} className="mb-16">
            <h2 className="text-2xl font-black mb-2">Test Locally in 30 Seconds</h2>
            <p className="text-sm text-muted-foreground mb-4">Load the extension unpacked to test before submitting.</p>
            <CopyableCode code={`1. Copy chrome-extension/ folder to your local machine
2. Open Chrome → navigate to: chrome://extensions/
3. Toggle "Developer Mode" ON (top-right)
4. Click "Load unpacked"
5. Select the chrome-extension/ folder
6. Extension appears in toolbar — click to open wizard
7. Navigate to developers.facebook.com to test auto-detection`} />
          </motion.div>

          {/* Permissions callout */}
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6, duration:0.6 }}
            className="rounded-2xl border p-6 text-center"
            style={{ borderColor:"rgba(0,255,136,0.2)", background:"rgba(0,255,136,0.04)" }}
          >
            <Shield className="w-8 h-8 mx-auto mb-3" style={{ color:"#00ff88" }} />
            <h3 className="text-lg font-black mb-2">Privacy-First Permissions</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              The extension only requests <code className="text-primary font-mono text-xs">activeTab</code> (to detect which dev portal you're on) and <code className="text-primary font-mono text-xs">storage</code> (to remember your unlock status).
              No browsing history. No user data collected. No external API calls. This keeps it in Chrome's lowest-risk review tier.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}