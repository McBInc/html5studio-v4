import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Unity WebGL Build System: Templates, MemorySize, Gzip/Brotli & 2026 Best Practices",
  pillar: "Dev Tools & Engines",
  cluster: "Unity WebGL Build System",
  lastVerified: "March 2026",
  color: "#5865F2",
  urgency: "hot",
  isProtected: true,
  tldr: [
    "Unity's WebGL template system is fully customisable — replacing the default template is the single highest-impact change for perceived performance and brand quality.",
    "MemorySize defaults to 256MB — insufficient for most games above 50MB build size. Mobile OOM crashes are almost always a MemorySize configuration error.",
    "Brotli compression reduces bundle size by 15–25% over gzip, but requires correct server headers — incorrect headers cause a silent decompress hang.",
    "Unity 2022 LTS onwards supports WASM SIMD and multi-threading by default — enabling these requires COOP/COEP response headers but delivers 2–4x performance improvement.",
  ],
  relatedSiblings: [
    { slug: "godot-alternative-engines", title: "Godot & Alternative Engines", urgency: "active" },
    { slug: "sdk-integration-guides", title: "SDK Integration Guides", urgency: "hot" },
    { slug: "performance-profiling", title: "Performance Profiling", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "unity-webgl-build-troubleshooting", title: "Build Troubleshooting & Fixes", urgency: "critical" },
    { slug: "unity-webgl-deploy-hosting", title: "Unity WebGL Deploy & Hosting", urgency: "hot" },
  ],
  faqs: [
    { q: "How do I set a custom WebGL template in Unity?", a: "Place your template folder in <code>Assets/WebGLTemplates/YourTemplateName/</code>. It must contain an <code>index.html</code>. In Player Settings → WebGL → Publishing Settings → WebGL Template, select your template. Unity provides template variables like <code>%UNITY_WIDTH%</code>, <code>%UNITY_HEIGHT%</code>, and <code>%UNITY_BUILD_NAME%</code>." },
    { q: "What MemorySize should I use?", a: "256MB is the Unity default and minimum. For games up to ~30MB build size: 256MB is usually fine. For 30–100MB: use 512MB. For large games or games with dynamic audio/textures: 1024MB. Always test on low-end mobile (2GB RAM devices) — these can only allocate ~400MB to a single WebView." },
    { q: "Which compression format should I use — gzip or Brotli?", a: "Brotli for production builds on properly configured servers (Vercel, Nginx, Apache with Brotli module). Gzip for servers where you can't control compression headers (some shared hosting). None for itch.io and platforms with strict MIME enforcement. Decompression Fallback ON always as a safety net." },
    { q: "How do I enable WASM multi-threading in Unity?", a: "In Player Settings → WebGL → Other Settings → Enable <strong>WebAssembly Threading</strong>. Your host must serve <code>Cross-Origin-Opener-Policy: same-origin</code> and <code>Cross-Origin-Embedder-Policy: require-corp</code> headers. Without these headers, the browser blocks SharedArrayBuffer and the build will fall back to single-threaded execution." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Custom WebGL Template Structure</h2>
      <CodeBlock code={`Assets/WebGLTemplates/MyTemplate/
├── index.html          (required)
├── style.css
├── logo.png
└── thumbnail.png       (Unity Editor preview)

<!-- Minimal index.html template -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%UNITY_WEB_NAME%</title>
  <style>
    body { margin: 0; background: #000; }
    #unity-canvas {
      width: %UNITY_WIDTH%px;
      height: %UNITY_HEIGHT%px;
      touch-action: none;  /* TikTok/mobile swipe prevention */
    }
    #loading {
      /* Your custom loading screen */
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: #0A0D1A; color: #fff; font-family: Inter, sans-serif;
    }
  </style>
</head>
<body>
  <div id="loading">
    <div>
      <img src="logo.png" width="120" alt="Game Logo" />
      <div id="progress">Loading... <span id="pct">0</span>%</div>
    </div>
  </div>
  <canvas id="unity-canvas" tabindex="-1"></canvas>
  <script src="Build/%UNITY_BUILD_NAME%.loader.js"></script>
  <script>
    createUnityInstance(document.querySelector('#unity-canvas'), {
      dataUrl: 'Build/%UNITY_BUILD_NAME%.data',
      frameworkUrl: 'Build/%UNITY_BUILD_NAME%.framework.js',
      codeUrl: 'Build/%UNITY_BUILD_NAME%.wasm',
      streamingAssetsUrl: 'StreamingAssets',
      companyName: '%UNITY_COMPANY_NAME%',
      productName: '%UNITY_PRODUCT_NAME%',
      productVersion: '%UNITY_PRODUCT_VERSION%',
    }, (progress) => {
      document.getElementById('pct').textContent = Math.round(progress * 100);
    }).then((instance) => {
      document.getElementById('loading').style.display = 'none';
    });
  </script>
</body>
</html>`} />

      <IntelligenceNote>
        Unity's default loading bar is recognisable and unprofessional for commercial releases. Studios that replace the loading screen with a branded experience report 15–25% lower bounce rates during the loading phase. The loading screen is also the correct place to pre-check for browser compatibility and show targeted messages (e.g. "For best performance, use Chrome on desktop").
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Build Configuration Reference</h2>
      <DataTable
        headers={["Setting", "Path", "Recommended", "Notes"]}
        rows={[
          ["Compression Format", "Player Settings → Publishing Settings", "Brotli (or None)", "None = safest; Brotli = smallest"],
          ["MemorySize (MB)", "Player Settings → Publishing Settings", "512 (games >30MB)", "OOM on mobile if too low"],
          ["WebAssembly Threading", "Player Settings → Other Settings", "ON (if COOP/COEP set)", "2–4x perf, requires headers"],
          ["WASM SIMD", "Player Settings → Other Settings", "ON", "Auto-detected in Unity 2022+"],
          ["Decompression Fallback", "Player Settings → Publishing Settings", "ON", "Safety net for header issues"],
          ["Code Optimisation", "Player Settings → Other Settings", "Speed", "Improves runtime perf"],
          ["Exception Support", "Player Settings → Other Settings", "None or Explicitly Thrown", "Reduces WASM binary size"],
          ["IL2CPP Code Gen", "Player Settings → Other Settings", "Faster (smaller) in builds", "Reduces output size"],
        ]}
      />
    </>
  ),
};

export default function UnityWebGLBuildSystem() {
  return <ArticleLayout article={article} />;
}
