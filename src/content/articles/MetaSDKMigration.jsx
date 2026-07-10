import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Meta Instant Games SDK v8.0 Migration — The Complete Sept 30 Compliance Guide",
  pillar: "Platform Ecosystems",
  cluster: "Meta Instant Games",
  lastVerified: "March 2026",
  color: "#0082FB",
  urgency: "critical",
  isProtected: true,
  tldr: [
    "Meta is sunsetting all SDK versions below v8.0 on <strong>September 30, 2026</strong> — legacy builds will be rejected at runtime, not just at submission",
    "The breaking change is the <strong>zero-permissions model</strong>: your game can no longer assume any user data is available on load",
    "Studios on GameDistribution, Poki, and Facebook Instant Games <strong>all need to migrate</strong>, even if they haven't touched their build in years",
    "Estimated migration time: <strong>4–16 hours</strong> depending on how deeply your game uses FBInstant APIs",
  ],
  relatedSiblings: [
    { slug: "discord-activities-api-split", title: "Discord Activities — The Feb 2025 API Split", urgency: "critical" },
    { slug: "tiktok-touch-action-css", title: "TikTok Mini-Games — Touch-Action CSS Fix", urgency: "hot" },
    { slug: "api-deprecation-tracker", title: "API Deprecation Tracker — Full 2026 Sunset Schedule", urgency: "hot" },
  ],
  relatedCrossPillar: [
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard (WGL-CERT)" },
    { slug: "platform-api-change-alerts", title: "Platform API Change Alerts — How We Monitor Upstream" },
  ],
  faqs: [
    {
      q: "Does the Meta SDK v8.0 sunset affect games on GameDistribution and Poki?",
      a: "Yes. The sunset applies to the <strong>SDK itself</strong>, not the distribution channel. If your game integrates FBInstant for any purpose — leaderboards, social sharing, payments — you are affected regardless of where the game is hosted or primarily distributed.",
    },
    {
      q: "What happens to my game on October 1, 2026 if I haven't migrated?",
      a: "Players will experience silent failures: broken load screens, empty leaderboards, and payment flows that never resolve. Meta will not show an error to the user — the game simply stops working for features that rely on the deprecated API calls.",
    },
    {
      q: "Can I just remove the FBInstant SDK entirely instead of migrating?",
      a: "Yes, if your Meta social features are non-critical to the core game loop (e.g., optional leaderboards). Stripping the SDK entirely is often faster than a full migration for older builds and removes all associated compliance risk.",
    },
    {
      q: "Does the zero-permissions change affect my context.getID() matchmaking calls?",
      a: "Yes. <code>FBInstant.context.getID()</code> now also requires an explicit permissions request before it will return data. Any matchmaking or room-sharing logic that fires on game load needs to be gated behind <code>requestPermissionsAsync</code>.",
    },
    {
      q: "Is Meta's v8.0 validator tool in the developer portal sufficient for testing?",
      a: "No. The validator flags deprecated API calls but does not simulate zero-permission cold starts. You must also test manually using a fresh Facebook account with no gaming permissions granted, loading your game and observing every data call.",
    },
    {
      q: "What is the WGL-CERT certification and does it cover Meta SDK compliance?",
      a: "The WGL-CERT standard from HTML5STUDIO covers SDK compliance as part of the Platform Ecosystem audit category. A certified build includes verified Meta SDK v8.0 compliance as a scored component of the overall health score.",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <div className="space-y-6 text-foreground/80 leading-relaxed">

      <h2 className="text-2xl font-bold text-foreground mt-10">What Is the Meta SDK v8.0 Sunset and Who Is Affected?</h2>
      <p>
        If your game is live on <strong>Facebook Instant Games</strong>, <strong>Meta Quest Browser</strong>, or distributed through any platform that uses the FBInstant SDK bridge, you are affected. This is not a minor version bump — it is a ground-up rearchitecture of how Meta handles user identity and permissions in embedded web experiences.
      </p>
      <p>
        The sunset date is <strong>September 30, 2026</strong>. After that date, any game still calling the v7.x FBInstant API will receive silent errors at runtime. Players will experience broken load screens, failed leaderboard calls, and payment flows that never resolve — with no error surfaced to the user.
      </p>
      <p>
        According to Meta's developer portal, approximately <strong>34% of active Instant Games</strong> as of Q1 2026 have not yet initiated migration. That represents tens of millions of daily active users who will hit broken experiences on October 1.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-10">The Zero-Permissions Breaking Change — Explained</h2>
      <p>
        The single biggest architectural shift in SDK v8.0 is the <strong>zero-permissions-by-default model</strong>. In v7.x, your game could call <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">FBInstant.player.getID()</code> or <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">FBInstant.player.getName()</code> immediately after <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">FBInstant.initializeAsync()</code> resolved, and data would be returned.
      </p>
      <p>
        In v8.0, <strong>no player data is accessible without an explicit permission grant</strong>. The new flow:
      </p>
      <CodeBlock code={`// v8.0 required pattern
await FBInstant.initializeAsync();

// Gate ALL player data behind explicit permissions
await FBInstant.player.requestPermissionsAsync(['user_id', 'display_name']);

// Only now can you safely call player methods
const playerId = FBInstant.player.getID();
const playerName = FBInstant.player.getName();`} />
      <p>
        This breaks every game that assumes player identity is available on load — which is the majority of games built before 2025. Leaderboards that populate on the main menu, social graphs on the title screen, payment flows that prefetch a user wallet — all of these break silently.
      </p>
      <p><strong>What to audit in your codebase:</strong></p>
      <ul className="list-none space-y-1.5 pl-4">
        {["Any call to FBInstant.player.* before a permissions request", "FBInstant.context.getID() calls used for matchmaking", "Payment initialisation that runs in startGameAsync()"].map((item) => (
          <li key={item} className="flex items-start gap-2"><span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-blue-400" />{item}</li>
        ))}
      </ul>

      <IntelligenceNote>
        Meta's official documentation states the sunset applies to "SDK versions prior to 8.0" — but buried in the developer forum, a Meta engineer clarified that <strong>hybrid builds using both v7 and v8 bridges simultaneously will also be rejected</strong>, even if the primary SDK declaration is v8.0. This is not in the main docs. Studios using legacy Unity plugin wrappers (very common in projects built 2021–2023) often end up in this hybrid state without realising it. Audit your <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">Plugins/WebGL</code> folder for any <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">fbinstant.jslib</code> files pinned to a specific version.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold text-foreground mt-10">Full Migration Checklist</h2>
      <DataTable
        headers={["Step", "Action", "Priority"]}
        rows={[
          ["1", "Update SDK script tag to v8.0 CDN URL", "<span style='color:#EE1D52'>Critical</span>"],
          ["2", "Add <code>requestPermissionsAsync</code> gate before all player calls", "<span style='color:#EE1D52'>Critical</span>"],
          ["3", "Audit <code>startGameAsync</code> for payment prefetch", "<span style='color:#EE1D52'>Critical</span>"],
          ["4", "Test leaderboard population with zero-permission cold start", "<span style='color:#FF6B00'>High</span>"],
          ["5", "Validate context sharing with new scope model", "<span style='color:#FF6B00'>High</span>"],
          ["6", "Check Unity Plugins/WebGL folder for legacy jslib files", "<span style='color:#EE1D52'>Critical</span>"],
          ["7", "Submit to Meta's v8.0 validation tool in developer portal", "<span style='color:#EE1D52'>Critical</span>"],
          ["8", "Manual test with fresh Facebook account (zero permissions granted)", "<span style='color:#EE1D52'>Critical</span>"],
        ]}
      />

      <h2 className="text-2xl font-bold text-foreground mt-10">Testing in the Meta Developer Portal</h2>
      <p>
        Meta provides a <strong>v8.0 compatibility checker</strong> in the developer portal under <em>Instant Games → Build Testing → SDK Validation</em>. This tool will flag all deprecated API calls in your uploaded build and surface exact line references in your compiled JavaScript.
      </p>
      <p>
        Do not rely solely on this tool. The validator catches deprecated calls but does not simulate zero-permission cold starts — meaning games can pass the tool and still fail at runtime for real users. Run your own test using a <strong>fresh Facebook account with no gaming permissions granted</strong>, load your game, and observe every data call in the browser console.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-10">How This Affects Studios on GameDistribution and Poki</h2>
      <p>
        Studios who distribute through GameDistribution, Poki, or CrazyGames and use the FBInstant SDK as a <strong>secondary integration</strong> — for social features rather than primary distribution — are equally affected. The sunset applies to the SDK, not the distribution channel.
      </p>
      <p>
        If you integrated FBInstant for leaderboards or social sharing and your primary platform is Poki, you still need to migrate or strip the SDK entirely. Stripping is often faster for studios where Meta social features are non-critical to the core game loop, and it eliminates the compliance risk entirely. It also reduces your build size, which matters for platforms like YouTube Playables with a hard 15MB bundle cap.
      </p>
    </div>
  ),
};

export default function MetaSDKMigration() {
  return <ArticleLayout article={article} />;
}
