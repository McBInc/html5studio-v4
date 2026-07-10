import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Directory", href: "/studiodirectory", isPage: true },
    { label: "Intelligence", href: "/intelligencecentre", isPage: true },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-0">
          <span className="text-xl font-bold tracking-tight text-foreground">HTML</span>
          <span className="text-xl font-bold tracking-tight" style={{ color: "#1e6ff0" }}>5</span>
          <span className="text-xl font-bold tracking-tight" style={{ color: "#FF6B00" }}>STUDIO</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                link.isPage
                  ? "text-primary font-semibold hover:text-primary/80 border border-primary/25 px-3 py-1.5 rounded-lg bg-primary/8 hover:bg-primary/12"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#cta"
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all"
          >
            Free Diagnosis
          </a>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm transition-colors ${
                link.isPage ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#cta"
            onClick={() => setMobileOpen(false)}
            className="inline-block mt-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg"
          >
            Free Diagnosis
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}