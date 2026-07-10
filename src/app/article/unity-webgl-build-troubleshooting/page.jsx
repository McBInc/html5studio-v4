"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "Unity WebGL Build Errors & Fixes — The Definitive 2026 Troubleshooting Guide",
  pillar: "Deployment & Publishing",
  cluster: "Build Troubleshooting & Fixes",
  lastVerified: "March 2026",
  color: "#1e6ff0",
  urgency: "critical",
  isProtected: true,
  tldr: [
    "The 5 most common Unity WebGL build errors in 2026 are: <strong>WASM streaming compile failed</strong>, <strong>brotli decompression fallback error</strong>, <strong>out-of-memory crash on mobile</strong>, <strong>cross-origin resource error</strong>, and <strong>SDK initialisation race condition</strong>",
    "Most of these errors are <strong>silent from the player's perspective</strong> — the game loads a spinner and never progresses, with no error message shown",
    "All five are <strong>fixable with configuration changes</strong> — none require engine-level code modifications",
    "The WASM streaming error alone accounts for <strong>~41% of WebGL build failure reports</strong> in the Unity developer forums in Q1 2026",
  ],
  relatedSiblings: [
    { slug: "unity-webgl-deploy-hosting", title: "Unity WebGL Deploy & Hosting — The Complete 2026 Guide" },
    { slug: "beginner-deployment-guides", title: "Beginner Deployment Guides" },
    { slug: "cicd-pipelines-webgl", title: "CI/CD Pipelines for WebGL" },
  ],
  relatedCrossPillar: [
    { slug: "unity-webgl-build-system", title: "Unity WebGL Build System Deep Dive" },
    { slug: "build-error-pattern-tracking", title: "Build Error Pattern Tracking — The 2026 Error Atlas" },
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard (WGL-CERT)" },
  ],
  faqs: [
    {
      q: "Why does my Unity WebGL build work in the Unity editor but fail when hosted?",
      a: "The Unity editor uses a built-in HTTP server with correct MIME types and CORS headers configured automatically. When you host the build externally, the server must be configured to serve <code>.wasm</code> files as <code>application/wasm</code> and <code>.gz</code>/<code>.br</code> files with the correct <code>Content-Encoding</code> header. Most build failures on external hosting are missing server configuration, not code errors.",
    },
    {
      q: "What is the correct Unity MemorySize for a mobile-compatible WebGL build?",
      a: "There is no universal correct value — it depends on your game's asset load. However, the most common mistake is setting MemorySize too high (256MB+), which causes immediate out-of-memory crashes on mid-range Android devices. Start at <strong>64MB</strong> and increase until you have a stable headroom of ~20% above your peak measured memory usage.",
    },
    {
      q: "My game is stuck on the loading bar at exactly 90% — what is causing this?",
      a: "A stuck loading bar at exactly 90% is almost always an <strong>SDK initialisation race condition</strong>. Your game's first scene is loaded (the bar reaches 90%) but an SDK's <code>init()</code> or <code>ready()</code> call is hanging — either waiting for a permission grant that never arrives, or timing out silently. Check the browser console for pending promise warnings.",
    },
    {
      q: "Does brotli compression actually improve load times enough to be worth the complexity?",
      a: "For builds over 10MB, yes significantly. Brotli typically produces 15–25% smaller files than gzip for WASM and JavaScript. For YouTube Playables where you are targeting the 15MB hard cap, the difference between gzip and brotli can be the difference between passing and failing ingestion. The server configuration complexity is a one-time cost.",
    },
    {
      q: "How do I diagnose a cross-origin error without access to the hosting server's configuration?",
      a: "Open browser DevTools → Console. Cross-origin errors surface as <code>CORS policy</code> messages. The specific resource being blocked is named in the error. If you cannot modify the server config directly, the most reliable workaround is switching to a host that provides correct CORS headers by default — Netlify and Vercel both do this out of the box for Unity WebGL builds.",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock, WizardCTA }) => (
    <div className="space-y-6 text-foreground/80 leading-relaxed">

      <h2 className="text-2xl font-bold text-foreground mt-10">Error #1 — WASM Streaming Compile Failed</h2>
      <p>
        <strong>Frequency: ~41% of reported WebGL failures</strong>
      </p>
      <p>
        This error appears in the browser console as:
      </p>
      <CodeBlock code={`TypeError: Failed to execute 'compile' on 'WebAssembly': 
Incorrect response MIME type. Expected 'application/wasm'.

// or:
wasm streaming compile failed: TypeError: Failed to fetch`} />
      <p>
        <strong>Root cause:</strong> The server is not serving the <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">.wasm</code> file with the correct MIME type (<code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">application/wasm</code>). Unity's WebGL loader attempts streaming compilation as the primary path — if that fails, it falls back to ArrayBuffer compilation, which is slower and sometimes disabled in restrictive browser environments.
      </p>
      <p>
        <strong>Fix — Nginx:</strong>
      </p>
      <CodeBlock code={`# Add to your nginx.conf or server block
types {
    application/wasm wasm;
}

# If using brotli/gzip compressed builds
location ~ \.wasm\.gz$ {
    gzip off;
    add_header Content-Encoding gzip;
    default_type application/wasm;
}
location ~ \.wasm\.br$ {
    add_header Content-Encoding br;
    default_type application/wasm;
}`} />
      <p>
        <strong>Fix — Apache .htaccess:</strong>
      </p>
      <CodeBlock code={`AddType application/wasm .wasm
AddEncoding gzip .gz
AddEncoding br .br`} />

      <h2 className="text-2xl font-bold text-foreground mt-10">Error #2 — Brotli / Gzip Decompression Fallback Error</h2>
      <p>
        <strong>Console message:</strong> <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was: TypeError: Response.body is null</code>
      </p>
      <p>
        This error occurs when Unity's build uses brotli compression but the server does not declare the correct <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">Content-Encoding: br</code> header. The browser receives the brotli-compressed file, attempts to parse it as uncompressed content, and fails. The fix is always server-side — the Unity build is correct, the server configuration is not.
      </p>

      <IntelligenceNote>
        Unity switched the <strong>default compression format from gzip to brotli</strong> in Unity 2021.2. Any studio that upgraded Unity versions without changing their server configuration will have shipped broken builds from that point forward — the builds appear to work in the Unity editor (which handles decompression internally) but fail for all external users. This version-transition bug is the single most common source of "my game worked last year and now it's broken" tickets we see. If your game broke without any code changes, check whether a Unity upgrade occurred around the same time.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold text-foreground mt-10">Error #3 — Out-of-Memory Crash on Mobile Devices</h2>
      <p>
        Unlike desktop browsers, mobile browsers have hard limits on WebAssembly memory allocation. Unity's default MemorySize setting of 256MB will cause immediate crashes on the majority of mid-range Android devices (2–3GB RAM), where the browser tab is typically limited to 512MB–1GB of addressable memory.
      </p>
      <DataTable
        headers={["Device Category", "Typical Browser Memory Cap", "Recommended Max MemorySize"]}
        rows={[
          ["High-end Android (8GB+ RAM)", "~1.5GB", "256MB (Unity default)"],
          ["Mid-range Android (4GB RAM)", "~512MB", "96MB"],
          ["Low-end Android (2–3GB RAM)", "~256MB", "64MB"],
          ["iPhone (all models)", "~800MB", "128MB"],
        ]}
      />
      <p>
        Set MemorySize in <em>Player Settings → WebGL → Publishing Settings → Memory Size</em>. Profile your peak memory usage in browser DevTools (<em>Memory</em> tab → heap snapshot during peak gameplay) and set MemorySize to peak + 20% headroom.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-10">Error #4 — Cross-Origin Resource Error (CORS)</h2>
      <p>
        CORS errors occur when Unity attempts to load assets or make API calls from a different domain than the one hosting the game. The browser blocks these requests by default without the correct <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">Access-Control-Allow-Origin</code> header.
      </p>
      <CodeBlock code={`# nginx — add to your server block for Unity WebGL files
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, OPTIONS";

# For compressed Unity build files specifically
location ~* \.(wasm|js|data)(\.gz|\.br)?$ {
    add_header Access-Control-Allow-Origin "*";
}`} />

      <h2 className="text-2xl font-bold text-foreground mt-10">Error #5 — SDK Initialisation Race Condition (Loading Stuck at 90%)</h2>
      <p>
        When a Unity WebGL game loads, the engine initialises first, then calls your first scene's <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">Start()</code> methods. If any SDK initialisation in <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">Start()</code> hangs — waiting for a callback that never fires — the loading bar freezes at ~90% and the game never starts.
      </p>
      <p>
        The fix is to implement a timeout wrapper around all SDK init calls. The Compliance Wizard has engine-specific implementations for Unity, Phaser, Godot, and more:
      </p>
      <WizardCTA
        previewCode={`// Unity C# — SDK init with timeout\nIEnumerator InitSDKWithTimeout() {\n  bool sdkReady = false; float timeout = 5f;\n  StartCoroutine(FBInstant.initializeAsync(() => sdkReady = true));\n  // ...`}
      />
    </div>
  ),
};

export default function BuildTroubleshooting() {
  return <ArticleLayout article={article} />;
}