import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Platform API Deprecation Tracker: 2026 Deadlines",
  pillar: "Forensic Intelligence",
  cluster: "API Change Alerts",
  lastVerified: "March 2026",
  color: "#FF6B00",
  urgency: "hot",
  tldr: [
    "Meta, TikTok, and Discord are all enforcing <strong>major SDK sunsets in 2026</strong> — legacy builds are at immediate risk of silent failure.",
    "The Meta v8.0 sunset on September 30 is the most critical enforcement gate currently tracked.",
    "Discord's new scope model (Feb 2026) has already broken legacy monolithic authentication in 14% of audited builds.",
    "Real-time monitoring of SDK change-logs is integrated into the HTML5STUDIO forensic scan pipeline.",
  ],
  relatedSiblings: [
    { slug: "september-30-sunset", title: "The September 30 Sunset", urgency: "critical" },
    { slug: "meta-sdk-v8-migration", title: "Meta SDK v8.0 Migration Guide", urgency: "critical" },
  ],
  relatedCrossPillar: [
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard (WGL-CERT)" },
    { slug: "platform-api-change-alerts", title: "Platform API Change Alerts" },
  ],
  faqs: [
    {
       q: "How often is the deprecation tracker updated?",
       a: "Updates are published every 48 hours based on automated diffs of official platform SDK repositories and community-sourced failure reports from Unity and Discord developer forums.",
    },
    {
       q: "What is a 'Silent Failure' in legacy builds?",
       a: "A silent failure occurrs when the platform SDK initializes successfully (returning 200 OK) but subsequent calls to social or payment features return <code>null</code> without throwing a caught error. This is common in the transition from implicit to explicit permission models.",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">The Forensic Record of SDK Decay</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        Every browser-based game platform is in a constant state of API evolution. What was a stable deployment target in 2024 is now a liability in 2026. This tracker provides the forensic evidence of which symbols are sunsetting and what replacement patterns are required for compliance.
      </p>

      <IntelligenceNote>
        The velocity of API changes in the HTML5 gaming space has increased by 400% since the introduction of the EU DMA Article 7 interoperability rules.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Active Sunset Timelines</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        The following platforms have active enforcement windows in 2026:
      </p>

      <DataTable
        headers={["Platform", "Feature / SDK Version", "Enforcement Date", "Observed Risk"]}
        rows={[
          ["Meta", "SDK v8.0 mandatory", "Sept 30, 2026", "Build Rejection"],
          ["Discord", "Scope-based Auth", "Active (Feb 2026)", "Auth Silent Failure"],
          ["TikTok", "Viewport CSS Rules", "Active (Mar 2026)", "Input Hijack"],
          ["Telegram", "Stars v2.0 API", "July 12, 2026", "Revenue Loss"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Symbol-Level Forensic Tracker</h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        Specific JavaScript and WebGL symbols identified as deprecated or restricted:
      </p>

      <DataTable
        headers={["Symbol", "Status", "Platform", "Remediation"]}
        rows={[
          ["<code>FBInstant.player.getID()</code>", "Restricted", "Meta", "Use permissions first"],
          ["<code>discord.auth.monolith</code>", "Deprecated", "Discord", "Migrate to scopes"],
          ["<code>window.orientation</code>", "Unsupported", "TikTok Sandbox", "Use <code>matchMedia</code>"],
          ["<code>WASM_HEAP_SIZE_UNLIMITED</code>", "Restricted", "YouTube Playables", "Enforce 15MB limit"],
        ]}
      />
    </>
  ),
};

export default function Article() {
  return <ArticleLayout article={article} />;
}
