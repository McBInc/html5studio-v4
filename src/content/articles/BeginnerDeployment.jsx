import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "How to Publish a Unity Game Online: Beginner's Guide 2026",
  pillar: "Deployment & Publishing",
  cluster: "Beginner Deployment Guides",
  lastVerified: "March 2026",
  color: "#1e6ff0",
  urgency: "active",
  isProtected: true,
  tldr: [
    "Publishing a Unity WebGL game online takes under 30 minutes using Vercel — no server knowledge required.",
    "Build from Unity: File → Build Settings → WebGL → Switch Platform → Build.",
    "The three beginner-friendly platforms are itch.io (game-focused), Vercel (technical, free), and CrazyGames/Poki (audience reach, review required).",
    "Common first-time mistakes: forgetting to switch platform before building, leaving Development Build ON, and using absolute asset paths.",
  ],
  relatedSiblings: [
    { slug: "unity-webgl-build-troubleshooting", title: "Build Troubleshooting & Fixes", urgency: "critical" },
    { slug: "unity-webgl-deploy-hosting", title: "Unity WebGL Deploy & Hosting", urgency: "hot" },
  ],
  relatedCrossPillar: [],
  faqs: [
    { q: "What's the easiest way to publish a Unity game online?", a: "itch.io is the easiest — upload your WebGL build folder as a ZIP, mark it as HTML/WebGL, and it's live in minutes. No custom headers required." },
    { q: "Can I publish for free?", a: "Yes — itch.io, GitHub Pages, and Vercel all have free tiers. itch.io takes an optional revenue share from sales but hosting itself is free." },
    { q: "Do I need a web server?", a: "No. Static hosting platforms like Vercel and Netlify handle all the server infrastructure. You just upload your build files." },
    { q: "My game works in the Unity editor but not in the browser — why?", a: "The most common causes are: (1) using APIs not available in WebGL like <code>System.Threading</code>, (2) the build platform wasn't switched to WebGL before building, (3) compression header mismatch. Check the browser console (F12) for the exact error." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Step 1: Build Your Game for WebGL</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Open <strong>File → Build Settings</strong>. Select <strong>WebGL</strong> from the platform list and click <strong>Switch Platform</strong>. Wait for Unity to reimport assets for the WebGL target. Then click <strong>Build</strong> and choose an output folder like <code>Builds/WebGL/</code>.
      </p>
      <IntelligenceNote>
        Always disable <strong>Development Build</strong> before your final build. It adds ~10MB of debug overhead and exposes internal profiler endpoints. In 2025, several games were rejected from Poki and CrazyGames specifically because development build metadata was detected in the bundle.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Step 2: Choose Your Platform</h2>
      <DataTable
        headers={["Platform", "Audience", "Difficulty", "Revenue Share", "Review Process"]}
        rows={[
          ["<strong>itch.io</strong>", "Indie gamers", "⭐ Easy", "Optional (you set %)", "None — instant"],
          ["<strong>Vercel</strong>", "Direct link sharing", "⭐⭐ Medium", "None", "None"],
          ["<strong>Newgrounds</strong>", "Flash-era nostalgia", "⭐ Easy", "Ad rev share", "Content review"],
          ["<strong>CrazyGames</strong>", "50M+ monthly players", "⭐⭐⭐ Hard", "Revenue share", "2–4 week review"],
          ["<strong>Poki</strong>", "90M+ monthly players", "⭐⭐⭐ Hard", "Revenue share", "4–8 week review"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Deploying to itch.io (Fastest Path)</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        ZIP your entire WebGL build output folder. On itch.io, create a new project, set Kind to <strong>HTML</strong>, upload the ZIP, and check <strong>This file will be played in the browser</strong>. Set the viewport size to match your game's canvas dimensions (e.g. 960×540).
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Deploying to Vercel (Recommended for Sharing)</h2>
      <CodeBlock code={`# Option 1: Vercel CLI
npm i -g vercel
cd path/to/your/WebGL/build
vercel --prod

# Option 2: Drag-and-drop
# Go to vercel.com/new → "Deploy" tab
# Drag your build folder into the browser window
# Vercel detects static site automatically — no config needed`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Common First-Time Mistakes</h2>
      <DataTable
        headers={["Mistake", "Symptom", "Fix"]}
        rows={[
          ["Platform not switched to WebGL", "Build succeeds but game crashes immediately", "File → Build Settings → Switch Platform → WebGL"],
          ["Development Build left ON", "Large bundle, profiler exposed", "Uncheck Development Build in Build Settings"],
          ["Absolute asset paths", "Missing textures/audio on live host", "Use <code>Resources.Load()</code> or Addressables"],
          ["Compression mismatch", "Black screen or 'decompressing' hang", "Set Compression to None, or fix server MIME headers"],
          ["Hardcoded localhost references", "API calls fail in production", "Use relative URLs or environment config"],
        ]}
      />
    </>
  ),
};

export default function BeginnerDeployment() {
  return <ArticleLayout article={article} />;
}
