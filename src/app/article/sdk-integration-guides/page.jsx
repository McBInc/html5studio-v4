"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "SDK Integration Guides: Facebook, Discord, TikTok & Telegram in Unity WebGL",
  pillar: "Dev Tools & Engines",
  cluster: "SDK Integration Guides",
  lastVerified: "March 2026",
  color: "#5865F2",
  urgency: "hot",
  isProtected: true,
  tldr: [
    "Unity WebGL SDK integration requires a JavaScript bridge — C# code cannot call platform SDKs directly; all calls route through <code>.jslib</code> plugin files.",
    "The Facebook (Meta) SDK integration must use v8.0+ as of September 30, 2026 — the zero-permissions model requires explicit <code>FBInstant.player.requestPermissionsAsync()</code> calls.",
    "Discord's Activities SDK uses a new granular scope model — the old <code>activities.write</code> catch-all scope is deprecated; update to explicit scopes before building.",
    "TikTok and Telegram SDKs both require initialisation timing discipline — call their ready() equivalent before any SDK method or silent failures occur on slow devices.",
  ],
  relatedSiblings: [
    { slug: "unity-webgl-build-system", title: "Unity WebGL Build System", urgency: "hot" },
    { slug: "godot-alternative-engines", title: "Godot & Alternative Engines", urgency: "active" },
    { slug: "performance-profiling", title: "Performance Profiling", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "meta-sdk-v8-migration", title: "Meta SDK v8.0 Migration", urgency: "critical" },
    { slug: "discord-activities-api-split", title: "Discord Activities API Split", urgency: "critical" },
    { slug: "tiktok-mini-games", title: "TikTok Mini-Games", urgency: "hot" },
    { slug: "telegram-mini-apps", title: "Telegram Mini Apps SDK 7.0", urgency: "hot" },
  ],
  faqs: [
    { q: "How does a .jslib plugin work in Unity WebGL?", a: "A <code>.jslib</code> file contains JavaScript functions that are compiled directly into the Unity WebGL build's JavaScript layer. C# code calls them via <code>[DllImport(\"__Internal\")]</code> declarations. The jslib functions can access the global window scope and call any SDK loaded in index.html." },
    { q: "Can I test SDK integrations in the Unity Editor?", a: "Not directly — SDK calls will fail in Play Mode since the JavaScript layer doesn't exist in the Editor. Use <code>#if UNITY_WEBGL && !UNITY_EDITOR</code> preprocessor guards around SDK calls, and provide mock implementations for Editor testing." },
    { q: "What's the fastest way to debug a failing SDK call?", a: "Build to WebGL and open Chrome DevTools (F12). Unity console messages appear in the browser console. Add <code>Debug.Log()</code> calls before and after SDK calls. For jslib functions, add <code>console.log()</code> statements directly in the jslib JavaScript." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Unity WebGL SDK Integration Architecture</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Every SDK integration in Unity WebGL follows the same pattern: JavaScript SDK in <code>index.html</code> → jslib bridge plugin → C# wrapper class → game code.
      </p>
      <CodeBlock code={`// File: Assets/Plugins/WebGL/FacebookSDK.jslib
mergeInto(LibraryManager.library, {
  // Bridge function: called from C#, runs in JavaScript context
  FB_GetPlayerID: function() {
    if (typeof FBInstant === 'undefined') {
      return allocateUTF8('');
    }
    var playerId = FBInstant.player.getID();
    var bufferSize = lengthBytesUTF8(playerId) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(playerId, buffer, bufferSize);
    return buffer;
  },

  FB_RequestPermission: function(permissionPtr) {
    var permission = UTF8ToString(permissionPtr);
    FBInstant.player.requestPermissionsAsync([permission])
      .then(function() {
        // Use SendMessage to callback C#
        SendMessage('SDKManager', 'OnPermissionGranted', permission);
      })
      .catch(function(err) {
        SendMessage('SDKManager', 'OnPermissionDenied', permission);
      });
  }
});`} />

      <CodeBlock code={`// File: Assets/Scripts/FacebookSDKWrapper.cs
using System.Runtime.InteropServices;
using UnityEngine;

public class FacebookSDKWrapper : MonoBehaviour {
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern string FB_GetPlayerID();

    [DllImport("__Internal")]
    private static extern void FB_RequestPermission(string permission);
#endif

    public string GetPlayerID() {
#if UNITY_WEBGL && !UNITY_EDITOR
        return FB_GetPlayerID();
#else
        return "EDITOR_MOCK_ID";  // Mock for Editor testing
#endif
    }

    public void RequestPermission(string permission) {
#if UNITY_WEBGL && !UNITY_EDITOR
        FB_RequestPermission(permission);
#else
        Debug.Log($"[MOCK] Permission requested: {permission}");
        OnPermissionGranted(permission);  // Auto-grant in Editor
#endif
    }

    // Called from JavaScript via SendMessage
    public void OnPermissionGranted(string permission) {
        Debug.Log($"Permission granted: {permission}");
    }

    public void OnPermissionDenied(string permission) {
        Debug.Log($"Permission denied: {permission}");
    }
}`} />

      <IntelligenceNote>
        The <code>SendMessage()</code> function from JavaScript to C# is the correct way to handle async SDK callbacks in Unity WebGL. Avoid storing C# function pointers in jslib files — they become invalid after garbage collection. Always use the <code>gameObjectName, methodName, parameter</code> pattern with a persistent GameObject in the scene.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">SDK Version Requirements (2026)</h2>
      <DataTable
        headers={["Platform SDK", "Minimum Version", "Deadline", "Key Breaking Change"]}
        rows={[
          ["Meta Instant Games SDK", "v8.0", "Sept 30, 2026", "Zero-permissions model — explicit permission requests required"],
          ["Discord Activities SDK", "v2.0 (scope split)", "Feb 2025 (enforced)", "Granular OAuth2 scopes replace activities.write"],
          ["TikTok Mini-Game SDK", "Latest (auto-update)", "No hard deadline", "disableSwipe() must precede ready()"],
          ["Telegram WebApp SDK", "7.0", "Enforced Q4 2025", "ready() 500ms timeout, openInvoice() for payments"],
          ["YouTube Playables SDK", "v1 (current)", "No announced sunset", "saveData/loadData replaces localStorage"],
        ]}
      />
    </>
  ),
};

export default function SDKIntegrationGuides() {
  return <ArticleLayout article={article} />;
}