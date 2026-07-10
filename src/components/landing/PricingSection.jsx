import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown } from "lucide-react";

const tiers = [
  {
    name: "Free Diagnosis",
    price: "$0",
    period: "",
    description: "See exactly what's wrong with your build. No commitment.",
    icon: Zap,
    features: [
      "Alpha-9 Forensic Scan",
      "Compliance score report",
      "Critical failure alerts",
      "Platform compatibility check",
      "Upgrade credit applied",
    ],
    cta: "Start Free Diagnosis",
    highlight: false,
  },
  {
    name: "Certified Migration",
    price: "$350",
    period: "per title",
    description: "Full compliance patching + DIP Certified deployment.",
    icon: Shield,
    features: [
      "Everything in Free Diagnosis",
      "Automated compliance patching",
      "WASM heap optimization",
      "DIP Certified package",
      "One-click multi-platform deploy",
      "TON Registry entry",
      "90-day compliance guarantee",
    ],
    cta: "Upgrade to Certified",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For studios with multiple titles and custom requirements.",
    icon: Crown,
    features: [
      "Everything in Certified",
      "Unlimited title migrations",
      "VSA Valuation Report",
      "Priority support channel",
      "Custom platform integrations",
      "Dedicated compliance engineer",
      "White-label deployment",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded-full mb-4 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Choose Your Certification Level
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Start with a free diagnosis. Your scan fee applies as credit toward
            any upgrade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-xl p-6 ${
                tier.highlight
                  ? "bg-card border-2 border-primary shadow-[0_0_40px_rgba(255,107,0,0.1)]"
                  : "bg-card border border-border"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <tier.icon
                  className={`w-8 h-8 mb-4 ${
                    tier.highlight ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-black">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tier.description}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="#cta"
                className={`block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}