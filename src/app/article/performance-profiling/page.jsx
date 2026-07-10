"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "WebGL Performance Profiling: WASM Heap, Draw Calls & Frame Budget Optimisation",
  pillar: "Dev Tools & Engines",
  cluster: "Performance Profiling",
  lastVerified: "March 2026",
  color: "#5865F2",
  urgency: "active",
  tldr: [
    "The 60fps frame budget is 16.67ms — on mobile WebGL, your game logic + rendering must complete in this window or the frame rate drops.",
    "Draw calls are the #1 GPU bottleneck in WebGL games — target under 100 draw calls per frame; each batched sprite/mesh uses one call.",
    "WASM heap overflow causes a hard crash with no recovery — always monitor heap usage in development and set MemorySize 50% above your observed peak.",
    "Chrome DevTools' Performance tab is the most practical profiling tool for WebGL — enable the <code>?unity-webgl-profilewindow</code> parameter to overlay Unity's profiler in browser builds.",
  ],
  relatedSiblings: [
    { slug: "unity-webgl-build-system", title: "Unity WebGL Build System", urgency: "hot" },
    { slug: "sdk-integration-guides", title: "SDK Integration Guides", urgency: "hot" },
    { slug: "godot-alternative-engines", title: "Godot & Alternative Engines", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "unity-webgl-build-troubleshooting", title: "Build Troubleshooting & Fixes", urgency: "critical" },
    { slug: "cloud-streaming-browser-tech", title: "Cloud Streaming & Browser Tech" },
  ],
  faqs: [
    { q: "How do I profile a Unity WebGL build in the browser?", a: "Build with Development Build and Autoconnect Profiler enabled. Open the Unity Profiler window in the Editor while the browser game is running — it will connect over the local network. For production profiling, use Chrome DevTools Performance tab and look for long JavaScript tasks." },
    { q: "What causes the most frame rate drops in WebGL games?", a: "In order of frequency: (1) Too many draw calls, (2) Large texture atlas not being batched, (3) Garbage collection spikes (GC.Collect in C#), (4) Physics simulation with too many rigid bodies, (5) Main thread blocking on WASM SIMD operations without threading." },
    { q: "How do I reduce draw calls in Unity WebGL?", a: "Enable GPU instancing for repeated objects, use sprite atlases for 2D games, combine meshes that use the same material, and use static batching for non-moving scene elements. The Frame Debugger (Window → Analysis → Frame Debugger) shows exactly which draw calls are happening." },
    { q: "What's a good benchmark for mobile WebGL performance?", a: "Test on a 2–3 year old mid-range Android (Snapdragon 720G equivalent). Target: 60fps consistent with <5ms CPU frame time and <10ms GPU frame time. If GPU time exceeds 11ms, you'll drop to 45fps on these devices." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Frame Budget Breakdown</h2>
      <DataTable
        headers={["System", "Budget (60fps)", "Budget (30fps)", "What Goes Here"]}
        rows={[
          ["Game Logic (C# Update)", "4ms", "8ms", "AI, physics queries, input processing"],
          ["Physics Simulation", "2ms", "4ms", "Rigidbody simulation, collision detection"],
          ["Rendering (CPU)", "3ms", "6ms", "Culling, batching, draw call submission"],
          ["Rendering (GPU)", "6ms", "14ms", "Vertex processing, fragment shading"],
          ["JavaScript / GC", "1ms", "2ms", "GC collection, jslib calls"],
          ["<strong>Total</strong>", "<strong>16ms</strong>", "<strong>33ms</strong>", "Hard limit for display sync"],
        ]}
      />

      <IntelligenceNote>
        The single most impactful optimisation for Unity WebGL games is reducing GC (garbage collection) pressure. C# allocations in Update() — creating new lists, strings, or objects every frame — trigger GC.Collect() which causes visible stutter spikes. Use object pooling for bullets, enemies, and particles. The Unity Memory Profiler (in 2022.2+) shows exactly which allocations are causing GC pressure.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Monitoring WASM Heap Usage</h2>
      <CodeBlock code={`// Add this to a debug UI in development builds
// Monitor WASM heap usage to set optimal MemorySize

#if UNITY_WEBGL && !UNITY_EDITOR
using System.Runtime.InteropServices;

[DllImport("__Internal")]
extern static long GetHeapUsed();

[DllImport("__Internal")]
extern static long GetHeapTotal();
#endif

// In Assets/Plugins/WebGL/HeapMonitor.jslib:
mergeInto(LibraryManager.library, {
  GetHeapUsed: function() {
    return performance.memory ? performance.memory.usedJSHeapSize : 0;
  },
  GetHeapTotal: function() {
    return performance.memory ? performance.memory.totalJSHeapSize : 0;
  }
});

// In your debug UI:
void OnGUI() {
#if UNITY_WEBGL && !UNITY_EDITOR && DEVELOPMENT_BUILD
    long used = GetHeapUsed();
    long total = GetHeapTotal();
    float usedMB = used / (1024f * 1024f);
    float totalMB = total / (1024f * 1024f);
    GUI.Label(new Rect(10, 10, 300, 30),
      $"Heap: {usedMB:F0}MB / {totalMB:F0}MB ({(usedMB/totalMB*100):F0}%)");
#endif
}`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Draw Call Reduction Checklist</h2>
      <DataTable
        headers={["Technique", "Typical Reduction", "Implementation"]}
        rows={[
          ["Sprite Atlases (2D)", "50–80% reduction", "Sprite Atlas asset, Pack on Build enabled"],
          ["GPU Instancing", "60–90% for repeated objects", "Enable on Material, add <code>[PerRendererData]</code>"],
          ["Static Batching", "30–60% for static geometry", "Mark static objects as Static in Inspector"],
          ["Dynamic Batching", "20–40% for small meshes", "Enabled by default, requires same material"],
          ["Occlusion Culling", "Variable (scene-dependent)", "Window → Rendering → Occlusion Culling, Bake"],
          ["LOD Groups", "Reduces GPU vertex load", "Add LOD Group component to complex meshes"],
        ]}
      />
    </>
  ),
};

export default function PerformanceProfiling() {
  return <ArticleLayout article={article} />;
}