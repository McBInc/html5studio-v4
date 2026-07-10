import React from "react";
import { motion } from "framer-motion";
import { Upload, Search, ShieldCheck, Play } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload",
    description:
      "Drag your Unity WebGL .zip into our secure drop zone. We accept any standard WebGL build output.",
  },
  {
    icon: Search,
    step: "02",
    title: "Diagnose",
    description:
      "Our Alpha-9 Forensic Scanner runs 200+ compliance checks against every major platform's 2026 requirements.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Certify",
    description:
      "We inject compliance patches, optimize WASM heaps, and issue your DIP Certified deployment package.",
  },
  {
    icon: Play,
    step: "04",
    title: "Deploy & Play",
    description:
      "One-click deploy to Meta, Discord, Telegram, or any target platform. Your game goes live instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-full mb-4 uppercase tracking-wider">
            Simple Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Upload → Deploy → Play
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Four steps from a broken build to a certified, live game on every platform.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
              )}

              <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-black text-muted-foreground/20 font-mono">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}