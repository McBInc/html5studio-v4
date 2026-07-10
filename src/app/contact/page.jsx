"use client";

import React, { useState } from "react";
import NewsTicker from "@/components/landing/NewsTicker";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:hello@html5studio.app?subject=Message from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${encodeURIComponent(form.email)}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">Contact</div>
        <h1 className="text-4xl font-black tracking-tight mb-6">Get in Touch</h1>
        <div className="h-px bg-border mb-8" />

        <p className="text-foreground/70 leading-relaxed mb-10">
          Have a question about the Compliance Wizard, WGL-CERT certification, or the Intelligence Centre? Reach out via email or fill in the form below and we'll get back to you promptly.
        </p>

        {/* Direct email */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/2 mb-10">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(30,111,240,0.15)" }}>
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-0.5">Email</p>
            <a
              href="mailto:hello@html5studio.app"
              className="text-sm font-semibold text-primary hover:underline"
            >
              hello@html5studio.app
            </a>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">Send a Message</span>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(0,255,136,0.12)" }}>
                <span className="text-green-400 text-xl">✓</span>
              </div>
              <p className="font-semibold text-foreground mb-1">Message prepared</p>
              <p className="text-sm text-muted-foreground">Your email client should have opened. If not, email us directly at hello@html5studio.app</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground/60 uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/4 text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground/60 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/4 text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground/60 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/4 text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: "#1e6ff0" }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}