"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "API Deprecation Tracker 2026 — Every Platform SDK Sunset Date Game Developers Need to Know",
  pillar: "Compliance & Certification",
  cluster: "API Deprecation Tracker",
  lastVerified: "March 2026",
  color: "#00FF88",
  urgency: "hot",
  tldr: [
    "<strong>September 30, 2026</strong> — Meta Instant Games SDK v7.x sunset. All legacy FBInstant calls break at runtime.",
    "<strong>February 25, 2025</strong> — Discord Activities granular scopes enforced. Already live — if you haven't migrated, you're already broken for new users.",
    "<strong>Telegram SDK 7.0</strong> — Stars payment bridge and new back-button handler required. Studios on SDK 6.x seeing silent payment failures.",
    "This tracker is updated in real-time against official developer portals, changelogs, and engineer announcements.",
  ],
  relatedSiblings: [
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard (WGL-CERT)", urgency: "critical" },
    { slug: "pii-privacy-compliance", title: "PII & Privacy Compliance for WebGL Games", urgency: "hot" },
    { slug: "eu-dma-article7", title: "EU DMA Article 7 for Game Publishers", urgency: "critical" },
  ],
  relatedCrossPillar: [
    { slug: "meta-sdk-v8-migration", title: "Meta Instant Games SDK v8.0 Migration" },
    { slug: "discord-activities-api-split", title: "Discord Activities — The Feb 2025 API Split" },
    { slug: "platform-api-change-alerts", title: "Platform API Change Alerts — How We Monitor Upstream" },
  ],
  faqs: [
    {
      q: "How often is this deprecation tracker updated?",
      a: "The tracker is monitored continuously against 40+ upstream sources including official developer portals, SDK changelogs, platform engineering blogs, and developer support forum announcements. Major updates are reflected within 24 hours of official announcement. The 'Last Verified' date on this article reflects the most recent full audit.",
    },
    {
      q: "What happens if I miss a deprecation deadline?",
      a: "The consequence depends on the platform. Meta will produce silent runtime failures for affected API calls — your game loads but specific features stop working. Discord produced an immediate auth failure for new users. Telegram produces silent payment failures. YouTube Playables will reject builds at ingestion. None of these platforms guarantee advance error messages to the player.",
    },
    {
      q: "Is there a way to get automated alerts when a new deprecation is announced?",
      a: "Yes. HTML5STUDIO's intelligence agent monitors all tracked sources continuously. Studios with active WGL-CERT certification receive automated email alerts when a deprecation announcement affects their certified build's compliance status.",
    },
    {
      q: "Does this tracker cover Poki and CrazyGames SDK changes?",
      a: "Poki and CrazyGames SDK changes are tracked. However, both platforms operate on a rolling update model without hard sunset dates — they notify studios via their developer portals and typically provide 60–90 day migration windows. We track their changelog feeds for breaking changes.",
    },
    {
      q: "The Telegram SDK 7.0 requirement — does this affect all Mini Apps or just games?",
      a: "The SDK 7.0 requirements apply to all Telegram Mini Apps, but the game-specific breaking changes are the Stars payment bridge (Storebridge.jslib) and the revised back-button handler. Non-game Mini Apps that don't use payments or custom back navigation are largely unaffected.",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <div className="space-y-6 text-foreground/80 leading-relaxed">

      <h2 className="text-2xl font-bold text-foreground mt-10">Why Studios Get Blindsided by Platform Deprecations</h2>
      <p>
        Platform SDK deprecations have a lifecycle that almost guarantees studio teams will miss them. An announcement is made in a developer blog post. It is then referenced — but not repeated — in a changelog entry six weeks later. When the enforcement date arrives, it is treated as "already announced" by the platform, with no further notification.
      </p>
      <p>
        The breakage is compounding: the studios most likely to miss a deprecation are the ones with games that are "running fine" — no active development, no engineer reviewing changelogs, no automated monitoring. These are often the highest-DAU games in a portfolio, built two to four years ago and left in maintenance mode. The Sept 30 Meta deadline will affect a disproportionate number of these.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-10">The 2026 Deprecation Calendar — Full Timeline</h2>
      <DataTable
        headers={["Date", "Platform", "What Breaks", "Severity"]}
        rows={[
          ["<strong>Feb 25, 2025</strong>", "Discord Activities", "Monolithic auth scope deprecated — granular scopes required", "<span style='color:#EE1D52'>ENFORCED</span>"],
          ["<strong>Q1 2026</strong>", "Telegram Mini Apps", "SDK 6.x bridge silent payment failures — SDK 7.0 required for Stars", "<span style='color:#EE1D52'>ACTIVE</span>"],
          ["<strong>Q1 2026</strong>", "YouTube Playables", "Absolute path builds rejected at ingestion — relative paths required", "<span style='color:#EE1D52'>ACTIVE</span>"],
          ["<strong>Sept 30, 2026</strong>", "Meta Instant Games", "SDK v7.x all API calls fail at runtime — v8.0 zero-permissions required", "<span style='color:#EE1D52'>CRITICAL</span>"],
          ["<strong>Q3 2026</strong>", "TikTok Mini-Games", "Legacy touch-action CSS model unsupported — new bridge required", "<span style='color:#FF6B00'>PENDING</span>"],
          ["<strong>Q4 2026</strong>", "Poki SDK", "v2.x deprecation window opening — v3.x migration advised", "<span style='color:#FF6B00'>WATCH</span>"],
          ["<strong>2026 (ongoing)</strong>", "EU Platforms (DMA)", "Non-interoperability builds at risk of distribution block", "<span style='color:#FF6B00'>REGULATORY</span>"],
        ]}
      />

      <h2 className="text-2xl font-bold text-foreground mt-10">How to Set Up Your Own Deprecation Monitoring</h2>
      <p>
        While HTML5STUDIO provides automated monitoring for certified builds, every studio should have a baseline deprecation watch process. Here is the minimum viable monitoring stack:
      </p>
      <ul className="list-none space-y-2 pl-4">
        {[
          "<strong>Meta:</strong> Subscribe to the Meta for Developers newsletter + watch the Instant Games changelog in the developer portal",
          "<strong>Discord:</strong> Follow #announcements in the Discord Developers server (discord.gg/discord-developers)",
          "<strong>TikTok:</strong> Monitor the TikTok for Developers portal changelog — no RSS feed available, manual review required",
          "<strong>Telegram:</strong> Follow @BotNews on Telegram — official changelog channel for Mini Apps SDK updates",
          "<strong>YouTube:</strong> Monitor the Google for Developers blog + the Playables programme page",
          "<strong>Poki / CrazyGames:</strong> Both provide developer-facing changelog emails via their publisher portals",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" dangerouslySetInnerHTML={{ __html: `<span style='margin-top:8px;flex-shrink:0;width:4px;height:4px;border-radius:50%;background:#00FF88'></span><span>${item}</span>` }} />
        ))}
      </ul>

      <IntelligenceNote>
        Platform engineering teams routinely make deprecation announcements in developer forum replies rather than in official changelogs. This is not an accident — it reduces the volume of official communications and allows platforms to claim that deprecations were "documented". Our intelligence agent monitors Meta's developer support forums, the Discord Developers server, Stack Overflow tags for each SDK, and Unity forum threads for each platform integration. We have detected several deprecations from forum replies <strong>before they appeared in any official changelog</strong> — the Discord Feb 2025 API split was visible in a Discord staff reply 11 days before it was officially announced.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold text-foreground mt-10">Automated Patch Generation — How We Address Deprecations</h2>
      <p>
        For studios with active WGL-CERT certification, HTML5STUDIO's system does not just alert on deprecations — it generates <strong>remediation patches</strong> for the most common deprecated call patterns. These are code-level fixes targeted at the specific deprecated patterns identified in your certified build.
      </p>
      <p>
        Current auto-patch coverage includes:
      </p>
      <DataTable
        headers={["Deprecated Pattern", "Platform", "Auto-Patch Available"]}
        rows={[
          ["<code>FBInstant.player.getID()</code> without permissions gate", "Meta", "<span style='color:#00FF88'>Yes</span>"],
          ["<code>FBInstant.player.getName()</code> without permissions gate", "Meta", "<span style='color:#00FF88'>Yes</span>"],
          ["Monolithic <code>activities.write</code> scope declaration", "Discord", "<span style='color:#00FF88'>Yes</span>"],
          ["Absolute URL paths in build index.html", "YouTube Playables", "<span style='color:#00FF88'>Yes</span>"],
          ["Legacy <code>touch-action</code> CSS absence", "TikTok", "<span style='color:#00FF88'>Yes</span>"],
          ["Storebridge.jslib v6.x payment calls", "Telegram", "<span style='color:#FF6B00'>Partial</span>"],
        ]}
      />
    </div>
  ),
};

export default function APIDeprecationTracker() {
  return <ArticleLayout article={article} />;
}