import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react";

const VSA_IMG = "https://media.base44.com/images/public/user_6861c38c47c16b00ec24a571/90a463bca_vsa-valuation-report.jpg";

const stats = [
  { icon: DollarSign, label: "Avg. IP Valuation", value: "$3.2M" },
  { icon: Users, label: "DAU Projection", value: "20,000" },
  { icon: TrendingUp, label: "Revenue Per User", value: "$0.15" },
  { icon: BarChart3, label: "Compliance Score", value: "85/100" },
];

export default function ValuationSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded-full mb-6 uppercase tracking-wider">
              Asset Valuation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Your Game Is a{" "}
              <span className="text-primary">Million Dollar Asset</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              Our VSA Valuation Report transforms how you see your game. Stop
              thinking about fixing bugs — start thinking about protecting a
              premium digital asset worth millions.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 bg-card border border-border rounded-xl"
                >
                  <stat.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src={VSA_IMG}
                alt="VSA Valuation Report"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}