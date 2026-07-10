import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function CTASection() {
  return (
    <section id="cta" className="relative py-24 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            Don't Wait for the{" "}
            <span className="text-primary">Sunset</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Get your free build diagnosis now. In under 60 seconds, you'll know
            exactly where your game stands — and what it takes to keep it live.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 transition-all group shadow-[0_0_30px_rgba(255,107,0,0.3)]"
            >
              <Zap className="w-5 h-5" />
              Free Build Diagnosis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required · Scan fee applies as upgrade credit · Results in 60 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}