"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, Lightbulb, Edit3, Plus, Calendar, ChevronDown, ChevronUp, Download, Share2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const LOG_ENTRIES = [
  {
    date: "2026-03-20",
    category: "Created",
    items: [
      {
        type: "component",
        name: "PlatformComplianceHeatmap",
        path: "components/landing/PlatformComplianceHeatmap.jsx",
        description: "Interactive data visualization showing platform compliance status with color-coded tiles for Meta, Discord, Telegram, TikTok, YouTube, Poki, CrazyGames, and Snap. Displays passing/failing/testing states with detailed diagnostic info on click.",
        impact: "Provides visual dashboard for developers to instantly see which platforms their build can deploy to and what's blocking the rest."
      },
      {
        type: "page",
        name: "Landing2",
        path: "pages/Landing2.jsx",
        description: "New landing page featuring the Platform Compliance Heatmap as the centerpiece, with hero section and CTA for free diagnostic scans.",
        impact: "Alternative landing page design focused on compliance visualization."
      },
      {
        type: "page",
        name: "DevelopmentLog",
        path: "pages/DevelopmentLog.jsx",
        description: "Activity log and changelog component for daily review of all edits, creations, and suggestions. Exportable for board presentations.",
        impact: "Enables efficient daily review workflow and board reporting without reviewing individual items during development."
      }
    ]
  },
  {
    date: "2026-03-20",
    category: "Edited",
    items: [
      {
        type: "component",
        name: "OnboardingAgentModal",
        path: "components/ambassador/OnboardingAgentModal",
        description: "Updated to use ElevenLabs Web Component embed instead of iframe. Added file upload section below agent interface for WebGL build.zip submission during the call.",
        impact: "Agent now properly connects and allows developers to upload builds while on the call, as referenced in the agent script."
      },
      {
        type: "config",
        name: "App.jsx",
        path: "App.jsx",
        description: "Added route for Landing2 page at /landing2",
        impact: "Makes new compliance heatmap page accessible."
      }
    ]
  },
  {
    date: "2026-03-20",
    category: "Suggestions",
    items: [
      {
        type: "suggestion",
        name: "Build Diagnostic Dashboard",
        description: "Create a full developer dashboard that aggregates multiple diagnostic scans over time, showing compliance trends, regression alerts, and multi-build comparison views.",
        priority: "High",
        effort: "Medium",
        impact: "Would provide studios with ongoing compliance monitoring rather than one-time scans."
      },
      {
        type: "suggestion",
        name: "Interactive Compliance Roadmap",
        description: "Visual timeline component showing the developer's certification journey — from initial scan to platform-by-platform fixes to final WGL-CERT issuance. Tracks blockers, completed steps, and next actions.",
        priority: "High",
        effort: "Medium",
        impact: "Gamifies the compliance process and reduces drop-off by showing clear progress milestones."
      },
      {
        type: "suggestion",
        name: "Notification Center System",
        description: "Real-time alert system for platform SDK deprecations, new API requirements, and compliance risks detected in studio builds. Could integrate with email/Slack for critical alerts.",
        priority: "Medium",
        effort: "High",
        impact: "Proactive risk prevention — studios get warned before builds break in production."
      },
      {
        type: "suggestion",
        name: "Backend Functions Integration",
        description: "Three existing backend functions (contactStudio, compileStudioDirectory, studioIntelligenceAgent) require Builder+ subscription to access. These enable automated studio outreach, directory compilation, and AI-powered research.",
        priority: "Medium",
        effort: "Subscription upgrade",
        impact: "Unlocks automation capabilities for studio directory management and intelligence gathering."
      }
    ]
  }
];

function LogSection({ entry, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  const categoryConfig = {
    Created: { color: "#00FF88", icon: Plus },
    Edited: { color: "#1e6ff0", icon: Edit3 },
    Suggestions: { color: "#FF6B00", icon: Lightbulb }
  };

  const config = categoryConfig[entry.category];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border mb-4 overflow-hidden"
      style={{ borderColor: `${config.color}20`, background: `${config.color}04` }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" style={{ color: config.color }} />
          <div className="text-left">
            <h3 className="text-lg font-bold text-foreground">{entry.category}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Calendar className="w-3 h-3" />
              {entry.date}
              <span className="ml-2 px-2 py-0.5 rounded-full" style={{ background: `${config.color}15`, color: config.color }}>
                {entry.items.length} item{entry.items.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-6 pb-4 space-y-3 border-t border-white/5">
          {entry.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mt-3 p-4 rounded-lg border border-white/5 bg-white/2"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">{item.name}</span>
                </div>
                {item.priority && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: item.priority === "High" ? "rgba(238,29,82,0.15)" : "rgba(255,107,0,0.15)",
                      color: item.priority === "High" ? "#EE1D52" : "#FF6B00"
                    }}>
                    {item.priority.toUpperCase()}
                  </span>
                )}
              </div>
              {item.path && (
                <code className="text-[11px] font-mono text-muted-foreground/60 block mb-2">{item.path}</code>
              )}
              <p className="text-sm text-foreground/80 leading-relaxed mb-2">{item.description}</p>
              {item.impact && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">Impact:</span>
                  <p className="text-xs text-muted-foreground mt-1">{item.impact}</p>
                </div>
              )}
              {item.effort && (
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground/50">Effort: <span className="text-foreground font-semibold">{item.effort}</span></span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DevelopmentLog() {
  const handleExport = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `development-log-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
  };

  const generateMarkdown = () => {
    let md = `# HTML5STUDIO Development Log\n\n`;
    md += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    md += `---\n\n`;

    LOG_ENTRIES.forEach(entry => {
      md += `## ${entry.category} — ${entry.date}\n\n`;
      entry.items.forEach(item => {
        md += `### ${item.name}\n`;
        if (item.path) md += `**Path:** \`${item.path}\`\n\n`;
        if (item.priority) md += `**Priority:** ${item.priority} | **Effort:** ${item.effort}\n\n`;
        md += `${item.description}\n\n`;
        if (item.impact) md += `**Impact:** ${item.impact}\n\n`;
        md += `---\n\n`;
      });
    });

    return md;
  };

  const totalItems = LOG_ENTRIES.reduce((sum, entry) => sum + entry.items.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-3">Development Activity Log</h1>
                <p className="text-muted-foreground text-lg">
                  Daily review of all edits, creations, and suggestions — exportable for board presentations.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-foreground hover:bg-white/5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-semibold">Export MD</span>
                </button>
                <button
                  onClick={() => alert('Share functionality would integrate with email/Slack')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Share</span>
                </button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Total Items", value: totalItems, color: "#1e6ff0" },
                { label: "Created", value: LOG_ENTRIES.find(e => e.category === "Created")?.items.length || 0, color: "#00FF88" },
                { label: "Edited", value: LOG_ENTRIES.find(e => e.category === "Edited")?.items.length || 0, color: "#1e6ff0" },
                { label: "Suggestions", value: LOG_ENTRIES.find(e => e.category === "Suggestions")?.items.length || 0, color: "#FF6B00" }
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                  style={{ borderColor: `${stat.color}25`, background: `${stat.color}08` }}>
                  <span className="text-2xl font-black font-mono" style={{ color: stat.color }}>{stat.value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Log entries */}
          <div>
            {LOG_ENTRIES.map((entry, i) => (
              <LogSection key={i} entry={entry} index={i} />
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 p-4 rounded-xl border border-white/8 bg-white/2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Note:</strong> This log is manually curated for board review. 
              It tracks major features, components, and strategic suggestions made during development sessions. 
              For detailed commit history, refer to the project's version control system.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
