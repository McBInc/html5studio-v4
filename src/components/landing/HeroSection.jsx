import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap } from "lucide-react";

const CERT_SEAL = "https://media.base44.com/images/public/user_6861c38c47c16b00ec24a571/3479ccf6a_WebGL_HTML5STUDIO_Certified_Seal.png";


export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                <span className="text-xs font-mono text-primary uppercase tracking-wider">
                  WebGL Sunset: Sept 30, 2026
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="text-foreground">Your Game Is About</span>
                <br />
                <span className="text-foreground">To Go </span>
                <span className="text-primary">Dark.</span>
                <br />
                <span className="text-foreground/60 text-3xl sm:text-4xl lg:text-5xl font-bold">
                  We Have The Light.
                </span>
              </h1>

              <div className="mb-3">
                <span className="text-foreground text-xl font-black tracking-tight">HTML</span>
              <span className="text-xl font-black tracking-tight" style={{ color: "#1e6ff0" }}>5</span>
              <span className="text-xl font-black tracking-tight" style={{ color: "#FF6B00" }}>STUDIO</span>
              </div>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                The <strong className="text-foreground">Universal Compliance Engine</strong> that
                takes your WebGL files and makes them playable on{" "}
                <strong className="text-foreground">any mobile browser</strong>. The only
                industry-recognized standard for 2026 platform compliance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all group"
                >
                  <Zap className="w-5 h-5" />
                  Free Build Diagnosis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-all border border-border"
                >
                  <Shield className="w-5 h-5" />
                  See How It Works
                </a>
              </div>


            </motion.div>
          </div>

          {/* Right: Certification seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px]" />
              <img
                src={CERT_SEAL}
                alt="WebGLive Certified Seal"
                className="relative w-[480px] h-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}