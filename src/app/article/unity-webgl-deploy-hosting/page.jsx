"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "Unity WebGL Deploy & Hosting: The Complete 2026 Guide",
  pillar: "Deployment & Publishing",
  cluster: "Unity WebGL Deploy & Hosting",
  lastVerified: "March 2026",
  color: "#1e6ff0",
  urgency: "hot",
  isProtected: true,
  tldr: [
    "Unity WebGL builds require specific server configuration — MIME types and compression headers must be explicitly set or builds silently fail.",
    "Vercel, Netlify, and GitHub Pages each require different header configs; Vercel is the most reliable zero-config option in 2026.",
    "Set <code>Player Settings → Publishing Settings → Compression Format</code> to Brotli for best performance; disable it entirely for platforms with strict MIME enforcement.",
    "The <code>index.html</code> template is fully customisable — always strip Unity's default loading bar and replace with a branded experience.",
  ],
  relatedSiblings: [
    { slug: "unity-webgl-build-troubleshooting", title: "Build Troubleshooting & Fixes", urgency: "critical" },
  ],
  relatedCrossPillar: [
    { slug: "api-deprecation-tracker", title: "API Deprecation Tracker 2026" },
    { slug: "webgl-certification-standard", title: "WGL-CERT Certification Standard" },
  ],
  faqs: [
    { q: "Can I host a Unity WebGL build on GitHub Pages for free?", a: "Yes — but GitHub Pages doesn't serve <code>.br</code> or <code>.gz</code> files with the correct MIME types by default. You must either disable compression in Unity's build settings or add a custom 404 redirect hack. Netlify or Vercel are simpler alternatives." },
    { q: "What's the minimum server config needed?", a: "At minimum your server must serve <code>application/wasm</code> for <code>.wasm</code> files. Without this, Chrome blocks the WASM instantiation entirely. Nginx users: add <code>types { application/wasm wasm; }</code> to the mime.types block." },
    { q: "How do I reduce initial load time?", a: "Enable Brotli compression, split your addressables, and use the Unity Loading Screen API to stream scenes. Aim for a first-scene bundle under 8MB for acceptable mobile load times." },
    { q: "Does Poki or CrazyGames have hosting requirements?", a: "Yes — both platforms host the build themselves after upload. They require a clean <code>index.html</code> at the root, relative asset paths only, and no <code>localhost</code> references in the build. Run HTML5STUDIO's compliance scan before submission." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Choosing Your Hosting Platform</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Unity WebGL builds are static sites — an <code>index.html</code>, a <code>Build/</code> folder containing <code>.wasm</code>, <code>.js</code>, <code>.data</code>, and optionally compressed variants. Any static host can serve them, but the devil is in the headers.
      </p>
      <DataTable
        headers={["Host", "Brotli Support", "WASM MIME", "Config Required", "Best For"]}
        rows={[
          ["<strong>Vercel</strong>", "✓ Auto", "✓ Auto", "Zero-config", "Most studios"],
          ["<strong>Netlify</strong>", "✓ Manual header", "✓ with _headers", "One <code>_headers</code> file", "CI/CD pipelines"],
          ["<strong>GitHub Pages</strong>", "✗ Blocked", "✗ Wrong MIME", "Workarounds needed", "Open source / demos"],
          ["<strong>itch.io</strong>", "✗ Not served", "✓ Auto", "Disable compression", "Indie distribution"],
          ["<strong>Self-hosted Nginx</strong>", "✓ Manual", "✓ Manual", "Full config control", "Enterprise / large games"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Netlify Header Configuration</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Create a <code>_headers</code> file in your build root (or repo root if deploying from source):
      </p>
      <CodeBlock code={`# _headers file for Netlify Unity WebGL
/Build/*.wasm
  Content-Type: application/wasm
  Content-Encoding: br

/Build/*.js.br
  Content-Type: application/javascript
  Content-Encoding: br

/Build/*.data.br
  Content-Type: application/octet-stream
  Content-Encoding: br

/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp`} />

      <IntelligenceNote>
        The <code>Cross-Origin-Opener-Policy</code> and <code>Cross-Origin-Embedder-Policy</code> headers are required for <code>SharedArrayBuffer</code> — which Unity 2022+ uses for multi-threaded builds. Without them, you'll see a silent hang at the Decompressing step. This is one of the most common unfiled support tickets in the Unity forums as of Q1 2026.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Nginx Server Block</h2>
      <CodeBlock code={`server {
  listen 443 ssl;
  root /var/www/game;

  # WASM MIME type — critical
  types {
    application/wasm  wasm;
  }
  include /etc/nginx/mime.types;

  # Brotli compressed files
  location ~ \\.br$ {
    add_header Content-Encoding br;
    gzip off;
  }
  location ~ \\.wasm\\.br$ {
    add_header Content-Type application/wasm;
    add_header Content-Encoding br;
  }
  location ~ \\.js\\.br$ {
    add_header Content-Type application/javascript;
    add_header Content-Encoding br;
  }

  # COOP/COEP for SharedArrayBuffer
  add_header Cross-Origin-Opener-Policy "same-origin";
  add_header Cross-Origin-Embedder-Policy "require-corp";
}`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Unity Build Settings Checklist</h2>
      <DataTable
        headers={["Setting", "Recommended Value", "Reason"]}
        rows={[
          ["Compression Format", "Brotli (or None for itch.io)", "Best compression ratio; None avoids MIME issues"],
          ["Development Build", "OFF in production", "Removes debug overhead"],
          ["Code Optimisation", "Speed", "Better runtime performance"],
          ["Exception Support", "None or Explicitly Thrown", "Reduces WASM binary size"],
          ["Memory Size", "256MB default; 512MB for large games", "OOM is the #1 mobile crash cause"],
          ["Decompression Fallback", "ON", "Safety net if server headers wrong"],
        ]}
      />
    </>
  ),
};

export default function UnityWebGLDeploy() {
  return <ArticleLayout article={article} />;
}