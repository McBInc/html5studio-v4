import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mic, Radio, Shield, Zap, Play, ChevronRight,
  Smartphone, Globe, Rocket, Heart, CheckCircle2, Volume2, Upload, FileArchive
} from "lucide-react";

// ─── ElevenLabs agent ID ──────────────────────────────────────────────────────
const ELEVENLABS_AGENT_ID = "agent_0301km6dz7baegxr1f0b42d717pq";

const PRE_CALL_STEPS = [
  {
    icon: Heart,
    color: "#EE1D52",
    title: "Tell us your story",
    desc: "Where are you right now? Platform rejection? SDK nightmare? Build that won't load on mobile? The more real, the better.",
  },
  {
    icon: Play,
    color: "#1e6ff0",
    title: "Preview your video report",
    desc: "Our agent will walk you through exactly what your free diagnostic video report will show — mobile emulation, SDK audit, deprecation flags.",
  },
  {
    icon: Zap,
    color: "#FF6B00",
    title: "Your compliance injection",
    desc: "We'll map out what you need right now — live mobile play testing, a platform launch fix, or a full WGL-CERT certification path.",
  },
  {
    icon: Shield,
    color: "#00FF88",
    title: "The Ambassador offer",
    desc: "If you qualify, we cover your entire compliance journey at zero upfront cost in exchange for a small equity stake.",
  },
];

const WHAT_TO_EXPECT = [
  { label: "Mobile emulation test recording", detail: "Live video of your game running on iOS/Android in a real browser environment — exactly what platform reviewers see." },
  { label: "SDK deprecation scan results", detail: "Every deprecated API call flagged, with a severity rating and estimated time-to-failure before platform enforcement." },
  { label: "PII & privacy leak audit", detail: "All undeclared data transmissions surfaced — GDPR/CCPA exposure mapped and remediation options outlined." },
  { label: "Platform compliance heatmap", detail: "Which of the 8 platforms your build currently passes, which it fails, and what's needed to fix each." },
  { label: "DCF valuation estimate", detail: "An ARPDAU-based NPV model showing your game's current market value and post-certification upside." },
];

const INJECTION_PATHS = [
  {
    icon: Smartphone,
    color: "#FF6B00",
    title: "Live Mobile Play & Testing",
    desc: "You need your game running properly on iOS and Android browsers today. We inject viewport fixes, touch-action CSS, safe area rules, and WASM memory optimisations.",
    timeline: "24–48 hours",
  },
  {
    icon: Globe,
    color: "#1e6ff0",
    title: "Platform Launch Fix",
    desc: "You're ready to launch on Meta, Discord, TikTok, Telegram, or YouTube but it's failing submission. We identify the exact failure vector and inject the platform-specific patch.",
    timeline: "24 hours",
  },
  {
    icon: Shield,
    color: "#00FF88",
    title: "Full WGL-CERT Certification",
    desc: "You want the full investor-grade certification — DIP seal, on-chain IP documentation, DCF valuation, TON smart contract deployment. The complete Ambassador path.",
    timeline: "5–7 days",
  },
];

const SITUATION_OPTIONS = [
  { id: "platform-rejection", label: "Platform rejection (Meta, Discord, TikTok, etc.)", color: "#EE1D52" },
  { id: "sdk-errors", label: "SDK errors / deprecated API calls", color: "#FF6B00" },
  { id: "mobile-broken", label: "Build won't load on mobile browsers", color: "#1e6ff0" },
  { id: "submission-failing", label: "Submission failing with no clear error", color: "#9B59B6" },
  { id: "investor-ready", label: "Need investor-grade certification", color: "#00FF88" },
];

const SERVICE_OPTIONS = [
  { id: "mobile-fix", label: "Live Mobile Play & Testing (24-48h)", icon: Smartphone, color: "#FF6B00" },
  { id: "platform-fix", label: "Platform Launch Fix (24h)", icon: Globe, color: "#1e6ff0" },
  { id: "full-cert", label: "Full WGL-CERT Certification (5-7 days)", icon: Shield, color: "#00FF88" },
];

export default function OnboardingAgentModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState("intro"); // intro | wizard-1 | wizard-2 | wizard-3 | agent
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    gameName: "",
    studioName: "",
    contactName: "",
    email: "",
    situations: [],
    service: "",
  });

  // Load saved form data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("html5studio_onboarding_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("html5studio_onboarding_form", JSON.stringify(formData));
  }, [formData]);

  // Reset to intro when modal reopens (but keep form data)
  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setUploadedFile(null);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Load ElevenLabs script when agent phase is active
  useEffect(() => {
    if (phase === "agent" && isOpen) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [phase, isOpen]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      alert('Please upload a .zip file containing your WebGL build');
      return;
    }

    setUploading(true);
    setUploadedFile(file);
    
    setTimeout(() => {
      setUploading(false);
    }, 1500);
  };

  const toggleSituation = (id) => {
    setFormData(prev => ({
      ...prev,
      situations: prev.situations.includes(id)
        ? prev.situations.filter(s => s !== id)
        : [...prev.situations, id]
    }));
  };

  const generateAgentGreeting = () => {
    const situationLabels = formData.situations
      .map(id => SITUATION_OPTIONS.find(opt => opt.id === id)?.label)
      .join(", ");
    const serviceLabel = SERVICE_OPTIONS.find(opt => opt.id === formData.service)?.label || "";
    
    return `Hi ${formData.contactName}, I have your details here. You're working on ${formData.gameName} from ${formData.studioName}. You mentioned you're dealing with: ${situationLabels}. And you're interested in: ${serviceLabel}. Is that all correct before we dive in?`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
              style={{
                pointerEvents: "auto",
                borderColor: "rgba(30,111,240,0.25)",
                background: "linear-gradient(135deg, hsl(240 10% 5%) 0%, hsl(240 10% 7%) 100%)",
                boxShadow: "0 0 80px rgba(30,111,240,0.12), 0 0 40px rgba(238,29,82,0.06)",
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
                style={{ background: "linear-gradient(90deg, transparent, rgba(30,111,240,0.6), rgba(238,29,82,0.4), transparent)" }} />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8">
                <AnimatePresence mode="wait">

                  {/* ── WIZARD STEP 1: BASIC INFO ──────────────────────── */}
                  {phase === "wizard-1" && (
                    <motion.div key="wizard-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Radio className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Step 1 of 3: Basic Info</span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">
                        Let's start with some basics
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        This helps our agent personalize the conversation and send your report to the right place.
                      </p>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Game Name *</label>
                          <input
                            type="text"
                            value={formData.gameName}
                            onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                            placeholder="e.g. Zombie Run Pro"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Studio / Owner Name *</label>
                          <input
                            type="text"
                            value={formData.studioName}
                            onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                            placeholder="e.g. Indie Games Co. or John Smith"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Your Name *</label>
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            placeholder="e.g. Sarah Johnson"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. sarah@indiegames.co"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                          <p className="text-[10px] text-muted-foreground/60 mt-1">We'll send your diagnostic video report here within 24 hours</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setPhase("wizard-2")}
                        disabled={!formData.gameName || !formData.studioName || !formData.contactName || !formData.email}
                        className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
                      >
                        Next: Tell Us Your Situation
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button onClick={() => setPhase("intro")}
                        className="w-full text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors py-2 mt-3">
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {/* ── WIZARD STEP 2: YOUR SITUATION ──────────────────── */}
                  {phase === "wizard-2" && (
                    <motion.div key="wizard-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4" style={{ color: "#EE1D52" }} />
                        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#EE1D52" }}>Step 2 of 3: Your Situation</span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">
                        Where are you stuck right now?
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        Select all that apply — this helps our agent understand your exact pain points.
                      </p>

                      <div className="space-y-3 mb-6">
                        {SITUATION_OPTIONS.map((option) => {
                          const selected = formData.situations.includes(option.id);
                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleSituation(option.id)}
                              className="w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left hover:scale-[1.02]"
                              style={{
                                borderColor: selected ? `${option.color}60` : "rgba(255,255,255,0.08)",
                                background: selected ? `${option.color}15` : "rgba(255,255,255,0.02)",
                                boxShadow: selected ? `0 0 30px ${option.color}20, 0 4px 12px rgba(0,0,0,0.3)` : "none"
                              }}
                            >
                              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all"
                                style={{
                                  borderColor: selected ? option.color : "rgba(255,255,255,0.2)",
                                  background: selected ? option.color : "transparent",
                                  boxShadow: selected ? `0 0 12px ${option.color}40` : "none"
                                }}>
                                {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <span className="text-sm text-foreground font-medium">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setPhase("wizard-3")}
                        disabled={formData.situations.length === 0}
                        className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
                      >
                        Next: What Service You Need
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button onClick={() => setPhase("wizard-1")}
                        className="w-full text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors py-2 mt-3">
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {/* ── WIZARD STEP 3: SERVICE SELECTION ───────────────── */}
                  {phase === "wizard-3" && (
                    <motion.div key="wizard-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4" style={{ color: "#FF6B00" }} />
                        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#FF6B00" }}>Compliance Injection Paths</span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">
                        What injection do you need?
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        The agent will map your exact path during the call. Here's a preview of the three injection types — tell the agent which matches your situation.
                      </p>

                      <div className="space-y-3 mb-6">
                        {SERVICE_OPTIONS.map((option) => {
                          const Icon = option.icon;
                          const selected = formData.service === option.id;
                          const timelineMap = {
                            "mobile-fix": "24-48 hours",
                            "platform-fix": "24 hours",
                            "full-cert": "5-7 days"
                          };
                          const descMap = {
                            "mobile-fix": "You need your game running properly on iOS and Android browsers today. We inject viewport fixes, touch-action CSS, safe area rules, and WASM memory optimisations.",
                            "platform-fix": "You're ready to launch on Meta, Discord, TikTok, Telegram, or YouTube but it's failing submission. We identify the exact failure vector and inject the platform-specific patch.",
                            "full-cert": "You want the full investor-grade certification — DIP seal, on-chain IP documentation, DCF valuation, TON smart contract deployment. The complete Ambassador path."
                          };
                          const titleMap = {
                            "mobile-fix": "Live Mobile Play & Testing",
                            "platform-fix": "Platform Launch Fix",
                            "full-cert": "Full WGL-CERT Certification"
                          };
                          return (
                            <button
                              key={option.id}
                              onClick={() => setFormData({ ...formData, service: option.id })}
                              className="w-full rounded-xl border transition-all text-left overflow-hidden hover:scale-[1.01]"
                              style={{
                                borderColor: selected ? `${option.color}60` : "rgba(255,255,255,0.1)",
                                background: selected ? `${option.color}12` : "rgba(255,255,255,0.02)",
                                boxShadow: selected ? `0 0 40px ${option.color}25, 0 4px 16px rgba(0,0,0,0.4)` : "none"
                              }}
                            >
                              <div className="flex items-start gap-4 p-5">
                                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                                  style={{
                                    background: `${option.color}15`,
                                    border: `1px solid ${option.color}30`
                                  }}>
                                  <Icon className="w-5 h-5" style={{ color: option.color }} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="text-base font-bold text-foreground">{titleMap[option.id]}</h3>
                                    <span className="text-[10px] font-mono font-bold px-2 py-1 rounded shrink-0"
                                      style={{ color: option.color, background: `${option.color}15` }}>
                                      {timelineMap[option.id]}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{descMap[option.id]}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setPhase("agent")}
                        disabled={!formData.service}
                        className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
                      >
                        <Mic className="w-5 h-5" />
                        Start Voice Onboarding
                      </button>

                      <button onClick={() => setPhase("wizard-2")}
                        className="w-full text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors py-2 mt-3">
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {/* ── OLD FORM PHASE (REMOVED) ──────────────────────── */}
                  {phase === "form" && (
                    <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Radio className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Step 1: Your Details</span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">
                        Before we connect...
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        Please fill in a few details so our agent has context and we can send your diagnostic report to the right place.
                      </p>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Game Name *</label>
                          <input
                            type="text"
                            value={formData.gameName}
                            onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                            placeholder="e.g. Zombie Run Pro"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Studio / Owner Name *</label>
                          <input
                            type="text"
                            value={formData.studioName}
                            onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                            placeholder="e.g. Indie Games Co. or John Smith"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Your Name *</label>
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            placeholder="e.g. Sarah Johnson"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. sarah@indiegames.co"
                            className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                          <p className="text-[10px] text-muted-foreground/60 mt-1">We'll send your diagnostic video report here within 24 hours</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setPhase("agent")}
                        disabled={!formData.gameName || !formData.studioName || !formData.contactName || !formData.email}
                        className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
                      >
                        <Mic className="w-5 h-5" />
                        Connect to Voice Agent
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button onClick={() => setPhase("intro")}
                        className="w-full text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors py-2 mt-3">
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {/* ── INTRO PHASE ─────────────────────────────────────── */}
                  {phase === "intro" && (
                    <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <Radio className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">HTML5STUDIO Voice Onboarding</span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">
                        Talk to Our Compliance Agent
                      </h2>
                      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                        A 10-minute voice conversation. Our agent will hear your story, walk you through your free diagnostic report, and map out your exact compliance path — whether that's a quick mobile fix or the full Ambassador certification.
                      </p>

                      {/* Pre-call steps */}
                      <div className="space-y-3 mb-8">
                        {PRE_CALL_STEPS.map((step, i) => {
                          const Icon = step.icon;
                          return (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border"
                              style={{ borderColor: `${step.color}20`, background: `${step.color}06` }}>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}>
                                <Icon className="w-4 h-4" style={{ color: step.color }} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[9px] font-mono font-black uppercase tracking-widest" style={{ color: step.color }}>
                                    Step {i + 1}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick preview links */}
                      <div className="flex gap-3 mb-6">
                        <button
                          onClick={() => setPhase("what-to-expect")}
                          className="flex-1 text-xs py-2.5 px-3 rounded-lg border border-white/10 bg-white/3 hover:bg-white/6 text-muted-foreground hover:text-foreground transition-all font-mono"
                        >
                          What's in my video report?
                        </button>
                        <button
                          onClick={() => setPhase("injection")}
                          className="flex-1 text-xs py-2.5 px-3 rounded-lg border border-white/10 bg-white/3 hover:bg-white/6 text-muted-foreground hover:text-foreground transition-all font-mono"
                        >
                          What injection do I need?
                        </button>
                      </div>

                      {/* Launch agent CTA */}
                      <button
                        onClick={() => setPhase("wizard-1")}
                        className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
                      >
                        <Mic className="w-5 h-5" />
                        Start Voice Onboarding
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <p className="text-center text-[10px] font-mono text-muted-foreground/40 mt-3">
                        ~10 minutes · No upfront cost · No pitch deck required
                      </p>
                    </motion.div>
                  )}

                  {/* ── AGENT PHASE ─────────────────────────────────────── */}
                  {phase === "agent" && (
                    <motion.div key="agent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Live Voice Session</span>
                      </div>
                      <h2 className="text-xl font-black mb-1">You're connected, {formData.contactName}!</h2>
                      <p className="text-sm text-muted-foreground mb-2">
                        Our agent has your details and will confirm everything before diving in.
                      </p>
                      <p className="text-xs text-muted-foreground/60 mb-4">
                        Report will be sent to: <span className="text-primary font-mono">{formData.email}</span>
                      </p>

                      {/* Context summary for agent */}
                      <div className="rounded-xl border p-4 mb-6"
                        style={{ borderColor: "rgba(30,111,240,0.2)", background: "rgba(30,111,240,0.04)" }}>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">Agent will confirm:</p>
                        <div className="text-xs space-y-1 text-foreground/80">
                          <p><strong>Game:</strong> {formData.gameName} ({formData.studioName})</p>
                          <p><strong>Issues:</strong> {formData.situations.map(id => 
                            SITUATION_OPTIONS.find(opt => opt.id === id)?.label
                          ).join(", ")}</p>
                          <p><strong>Service:</strong> {SERVICE_OPTIONS.find(opt => opt.id === formData.service)?.label}</p>
                        </div>
                      </div>

                      {/* Agent embed with custom greeting */}
                      <div className="rounded-2xl border border-white/10 overflow-hidden mb-6 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.4)", minHeight: 380 }}>
                        <elevenlabs-convai 
                          agent-id={ELEVENLABS_AGENT_ID}
                          custom-greeting={generateAgentGreeting()}
                        />
                      </div>

                      {/* What the agent covers */}
                      <div className="rounded-xl border border-white/8 p-4 mb-6">
                        <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-3">The agent will cover</p>
                        <div className="space-y-2">
                          {["Your current platform & build situation", "What your free video diagnostic report will show", "Which compliance injection matches your needs", "Whether you qualify for the Ambassador Program"].map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-primary" />
                              <span className="text-xs text-foreground/75">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button onClick={() => setPhase("wizard-1")}
                        className="text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                        ← Edit details
                      </button>

                      {/* File Upload Section */}
                      <div className="mt-6 pt-6 border-t border-white/8">
                        <div className="rounded-xl border p-6 text-center"
                          style={{ borderColor: "rgba(30,111,240,0.2)", background: "rgba(30,111,240,0.04)" }}>
                          <Upload className="w-6 h-6 mx-auto mb-3 text-primary" />
                          <h3 className="text-sm font-bold text-foreground mb-2">Upload Your WebGL Build</h3>
                          <p className="text-xs text-muted-foreground mb-4">
                            Submit your build.zip file now to start the diagnostic scan. Results delivered within 24 hours.
                          </p>

                          {!uploadedFile ? (
                            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer"
                              style={{ background: "#1e6ff0", color: "#fff" }}>
                              <FileArchive className="w-4 h-4" />
                              {uploading ? "Uploading..." : "Select ZIP File"}
                              <input
                                type="file"
                                accept=".zip"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={uploading}
                              />
                            </label>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border"
                              style={{ borderColor: "rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.08)" }}>
                              <CheckCircle2 className="w-4 h-4" style={{ color: "#00FF88" }} />
                              <span className="text-sm font-semibold" style={{ color: "#00FF88" }}>
                                {uploadedFile.name} uploaded
                              </span>
                            </div>
                          )}

                          <p className="text-[10px] font-mono text-muted-foreground/40 mt-3">
                            Max 500MB · WebGL build exports only · Secure upload
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── WHAT TO EXPECT PHASE ────────────────────────────── */}
                  {phase === "what-to-expect" && (
                    <motion.div key="expect" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Play className="w-4 h-4" style={{ color: "#1e6ff0" }} />
                        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#1e6ff0" }}>Your Free Diagnostic Video Report</span>
                      </div>
                      <h2 className="text-xl font-black mb-1">What's in your report</h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        Within 24 hours of your voice session, you receive a full video report of your build running under real platform conditions. Here's exactly what it contains:
                      </p>

                      <div className="space-y-3 mb-8">
                        {WHAT_TO_EXPECT.map((item, i) => (
                          <div key={i} className="rounded-xl border border-white/8 p-4 hover:border-primary/20 transition-all">
                            <div className="flex items-start gap-3">
                              <span className="text-[10px] font-black font-mono text-primary/60 mt-0.5 shrink-0">0{i + 1}</span>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.detail}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setPhase("wizard-1")}
                        className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 mb-3"
                        style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
                      >
                        <Mic className="w-5 h-5" />
                        Start Voice Onboarding
                      </button>
                      <button onClick={() => setPhase("intro")}
                        className="w-full text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors py-1">
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {/* ── INJECTION PATH PHASE ────────────────────────────── */}
                  {phase === "injection" && (
                    <motion.div key="injection" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4" style={{ color: "#FF6B00" }} />
                        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#FF6B00" }}>Compliance Injection Paths</span>
                      </div>
                      <h2 className="text-xl font-black mb-1">What injection do you need?</h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        The agent will map your exact path during the call. Here's a preview of the three injection types — tell the agent which matches your situation.
                      </p>

                      <div className="space-y-4 mb-8">
                        {INJECTION_PATHS.map((path, i) => {
                          const Icon = path.icon;
                          return (
                            <div key={i} className="rounded-xl border p-5"
                              style={{ borderColor: `${path.color}25`, background: `${path.color}06` }}>
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ background: `${path.color}18`, border: `1px solid ${path.color}30` }}>
                                  <Icon className="w-4 h-4" style={{ color: path.color }} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-bold text-foreground">{path.title}</h3>
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border ml-2 shrink-0"
                                      style={{ borderColor: `${path.color}30`, color: path.color, background: `${path.color}10` }}>
                                      {path.timeline}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{path.desc}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setPhase("wizard-1")}
                        className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 mb-3"
                        style={{ background: "linear-gradient(135deg, #1e6ff0, #EE1D52)", color: "#fff" }}
                      >
                        <Mic className="w-5 h-5" />
                        Start Voice Onboarding
                      </button>
                      <button onClick={() => setPhase("intro")}
                        className="w-full text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors py-1">
                        ← Back
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}