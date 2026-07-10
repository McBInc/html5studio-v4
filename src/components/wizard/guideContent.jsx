// Compliance guide content keyed by platform-engine
// Free steps: visible to all. Locked steps: require payment.

const GENERIC_STEP = (platform, engine, stepNum) => ({
  id: stepNum,
  title: `${platform} SDK integration — ${engine}`,
  free: false,
  description: `Full ${engine} implementation for ${platform} including SDK bridge, lifecycle hooks, and error handling.`,
  preview: `// ${platform} × ${engine} full integration — unlock to see`,
  code: `// Unlock to access the full ${platform} + ${engine} implementation guide.\n// Includes: SDK setup, lifecycle hooks, error handling, and test checklist.`,
  language: "js",
});

export const GUIDES = {

  // ─── META ─────────────────────────────────────────────────────────────────

  "meta-unity": {
    title: "Meta Instant Games SDK v8.0 — Unity WebGL",
    deadline: "September 30, 2026",
    deadlineColor: "#EE1D52",
    intro: "Unity WebGL games on Meta Instant Games must migrate to SDK v8.0 before Sept 30. The core change is moving from a passive permissions model to an explicit zero-permissions model. Note: Meta's developer docs are migrating to a new location by end of June 2026 — always check developers.facebook.com/docs/games for the latest.",
    steps: [
      {
        id: 1, title: "Update your SDK script tag", free: true,
        description: "Replace the legacy SDK loader in your Unity WebGL index.html template.",
        file: "Assets/WebGLTemplates/YourTemplate/index.html",
        where: "Inside <head>, before any other <script> tags",
        insertAfter: `<head>\n  <meta charset="utf-8">\n  <title>My Game</title>\n  <!-- ← add the new SDK script tag here -->`,
        preview: '<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>',
        code: `<!-- Unity WebGL Template — index.html -->\n<!-- REMOVE: -->\n<!-- <script src="https://connect.facebook.net/en_US/fbinstant.6.3.js"></script> -->\n\n<!-- ADD: -->\n<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>`,
        language: "html",
      },
      {
        id: 2, title: "Zero-permissions init pattern", free: true,
        description: "SDK v8.0 no longer passes player data during initializeAsync. You must request permissions explicitly after startGameAsync.",
        file: "Assets/WebGLTemplates/YourTemplate/index.html  (or your TemplateData/UnityLoader script block)",
        where: "Inside the existing FBInstant.initializeAsync() call — replace the whole block",
        insertAfter: `// You likely have something like this already:\nFBInstant.initializeAsync().then(function() {\n  // ← replace everything inside here`,
        preview: "FBInstant.initializeAsync().then(() => FBInstant.startGameAsync())",
        code: `// Old (BROKEN in v8.0):\nFBInstant.initializeAsync().then(() => {\n  const name = FBInstant.player.getName(); // null now\n});\n\n// New v8.0 pattern:\nFBInstant.initializeAsync()\n  .then(() => FBInstant.startGameAsync())\n  .then(() => FBInstant.player.requestPermissionsAsync(['USER_PHOTOS','PROFILE']))\n  .then((granted) => {\n    const name = granted.includes('PROFILE') ? FBInstant.player.getName() : 'Player';\n  });`,
        language: "js",
      },
      {
        id: 3, title: "Unity jslib bridge update", free: false,
        description: "Your Unity jslib bridge needs updating to handle async permission responses and null-safe player data.",
        file: "Assets/Plugins/WebGL/FBInstant.jslib",
        where: "Replace the entire file contents (or create this file if it doesn't exist yet)",
        insertAfter: `mergeInto(LibraryManager.library, {\n  // ← replace everything inside here with the new code below`,
        preview: "// jslib bridge — unlock to see full implementation",
        code: `// Assets/Plugins/WebGL/FBInstant.jslib\nmergeInto(LibraryManager.library, {\n  InitSDK: function() {\n    FBInstant.initializeAsync().then(function() {\n      return FBInstant.startGameAsync();\n    }).then(function() {\n      SendMessage('FBManager', 'OnSDKReady', '');\n    }).catch(function(err) {\n      SendMessage('FBManager', 'OnSDKError', err.message);\n    });\n  },\n  RequestPlayerData: function() {\n    FBInstant.player.requestPermissionsAsync(['USER_PHOTOS','PROFILE'])\n      .then(function(granted) {\n        var name = granted.includes('PROFILE') ? FBInstant.player.getName() : 'Player';\n        var photo = granted.includes('USER_PHOTOS') ? FBInstant.player.getPhoto() : '';\n        SendMessage('FBManager', 'OnPlayerData', JSON.stringify({name, photo}));\n      });\n  }\n});`,
        language: "js",
      },
      {
        id: 4, title: "Null-safe C# FBManager", free: false,
        description: "The MonoBehaviour that handles SDK callbacks with null-safe player data for all permission states.",
        file: "Assets/Scripts/FBManager.cs",
        where: "Create this file if it doesn't exist, then attach the FBManager component to a GameObject in your scene named 'FBManager'",
        insertAfter: `// Create a new C# script in Unity:\n// Assets → Create → C# Script → name it "FBManager"\n// ↓ paste the full contents below`,
        preview: "// FBManager.cs — unlock to see",
        code: `// FBManager.cs\nusing UnityEngine;\nusing System.Runtime.InteropServices;\n\npublic class FBManager : MonoBehaviour {\n  [DllImport("__Internal")] static extern void InitSDK();\n  [DllImport("__Internal")] static extern void RequestPlayerData();\n\n  public static string PlayerName = "Player";\n  public static string PlayerPhoto = "";\n\n  void Start() {\n    #if UNITY_WEBGL && !UNITY_EDITOR\n    InitSDK();\n    #endif\n  }\n\n  public void OnSDKReady(string _) => RequestPlayerData();\n\n  public void OnPlayerData(string json) {\n    var d = JsonUtility.FromJson<PData>(json);\n    PlayerName = string.IsNullOrEmpty(d.name) ? "Player" : d.name;\n    PlayerPhoto = d.photo ?? "";\n  }\n\n  public void OnSDKError(string e) => Debug.LogWarning("FBInstant: " + e);\n\n  [System.Serializable] class PData { public string name, photo; }\n}`,
        language: "csharp",
      },
      {
        id: 5, title: "Zero-permission test checklist", free: false,
        description: "Before submitting, test with all permissions denied. Here's the mock and checklist.",
        file: "Assets/WebGLTemplates/YourTemplate/index.html",
        where: "Inside <head>, BEFORE the fbinstant.8.0.js script tag — remove before going live",
        insertAfter: `<head>\n  ...\n  <!-- ↓ ADD this mock block temporarily, BEFORE the real fbinstant script -->\n  <!-- REMOVE this block before publishing to Meta! -->`,
        preview: "// Local permission denial simulation — unlock to see",
        code: `// Add to index.html for local zero-permission testing:\n<script>\nwindow.FBInstant = {\n  initializeAsync: () => Promise.resolve(),\n  startGameAsync: () => Promise.resolve(),\n  setLoadingProgress: (p) => {},\n  player: {\n    requestPermissionsAsync: () => Promise.resolve([]), // all denied\n    getName: () => null,\n    getPhoto: () => null,\n    getID: () => 'test_123',\n  }\n};\n</script>\n\n/* Checklist:\n   ✅ Loads without crash when getName() returns null\n   ✅ Default avatar shown when permissions denied\n   ✅ requestPermissionsAsync called AFTER startGameAsync\n   ✅ No PII sent without explicit consent\n   ✅ Tested on Facebook Developer Portal sandbox\n*/`,
        language: "js",
      },
    ],
  },

  "meta-phaser": {
    title: "Meta Instant Games SDK v8.0 — Phaser 3",
    deadline: "September 30, 2026",
    deadlineColor: "#EE1D52",
    intro: "Phaser 3 has the cleanest migration path to SDK v8.0 (confirmed latest as of June 2026). Direct JS — no bridge layer needed.",
    steps: [
      {
        id: 1, title: "Update SDK script tag", free: true,
        description: "Update your index.html to load the v8.0 SDK.",
        file: "index.html",
        where: "Inside <head>, before your main.js or bundle script tag",
        insertAfter: `<head>\n  <meta charset="utf-8">\n  <title>My Phaser Game</title>\n  <!-- ← paste new SDK script here -->`,
        preview: '<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>',
        code: `<!-- index.html -->\n<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>`,
        language: "html",
      },
      {
        id: 2, title: "Init before Phaser boot", free: true,
        description: "Run the SDK init flow before creating your Phaser.Game instance.",
        file: "src/main.js  (your entry point — the file that has 'new Phaser.Game(...)')",
        where: "At the very top of main.js, before the Phaser.Game constructor call",
        insertAfter: `// Your current main.js probably looks like this:\nconst config = { type: Phaser.AUTO, ... };\nconst game = new Phaser.Game(config); // ← wrap this inside the .then() below`,
        preview: "FBInstant.initializeAsync().then(() => FBInstant.startGameAsync())",
        code: `// main.js\nFBInstant.initializeAsync()\n  .then(() => { FBInstant.setLoadingProgress(10); return FBInstant.startGameAsync(); })\n  .then(() => { new Phaser.Game(config); });`,
        language: "js",
      },
      {
        id: 3, title: "Scene-level permission request", free: false,
        description: "Request permissions inside your first scene after the player has engaged — never on load.",
        file: "src/scenes/GameScene.js",
        where: "Inside your GameScene class — add requestProfile() as a method, and call it from create() on first input",
        insertAfter: `// In GameScene.js, find your create() method:\ncreate() {\n  // ↓ add this line at the top of create()\n  this.input.once('pointerdown', () => this.requestProfile());\n}`,
        preview: "// Scene permission request pattern — unlock to see",
        code: `// GameScene.js\ncreate() {\n  this.input.once('pointerdown', () => this.requestProfile());\n}\n\nasync requestProfile() {\n  const granted = await FBInstant.player.requestPermissionsAsync(['USER_PHOTOS','PROFILE']);\n  this.playerName = granted.includes('PROFILE') ? FBInstant.player.getName() ?? 'Player' : 'Player';\n  this.playerPhoto = granted.includes('USER_PHOTOS') ? FBInstant.player.getPhoto() ?? null : null;\n  this.events.emit('profileLoaded', { name: this.playerName, photo: this.playerPhoto });\n}`,
        language: "js",
      },
      {
        id: 4, title: "Null-safe leaderboard calls", free: false,
        description: "Leaderboard display names require PROFILE permission in v8.0 — must be null-safe.",
        file: "src/leaderboard.js  (or wherever you currently handle leaderboard calls)",
        where: "Replace your existing submitScore() and getTop10() functions with the null-safe versions below",
        insertAfter: `// Find your existing leaderboard functions — they'll look like:\nasync function submitScore(score) {\n  const lb = await FBInstant.getLeaderboardAsync('main');\n  // ← replace the full function body with the code below`,
        preview: "// Leaderboard update — unlock to see",
        code: `async function submitScore(score) {\n  const lb = await FBInstant.getLeaderboardAsync('main');\n  await lb.setScoreAsync(score, JSON.stringify({ name: FBInstant.player.getName() ?? 'Anon', score }));\n}\n\nasync function getTop10() {\n  const lb = await FBInstant.getLeaderboardAsync('main');\n  const entries = await lb.getEntriesAsync(10, 0);\n  return entries.map(e => ({\n    rank: e.getRank(),\n    score: e.getScore(),\n    name: e.getPlayer().getName() ?? 'Player #' + e.getRank(),\n    photo: e.getPlayer().getPhoto() ?? null,\n  }));\n}`,
        language: "js",
      },
    ],
  },

  "meta-godot": {
    title: "Meta Instant Games SDK v8.0 — Godot 4",
    deadline: "September 30, 2026",
    deadlineColor: "#EE1D52",
    intro: "Godot 4's HTML5 export requires a custom JavaScript singleton to bridge FBInstant SDK calls into GDScript.",
    steps: [
      {
        id: 1, title: "Add SDK to Godot HTML export template", free: true,
        description: "Override the HTML shell template and inject the v8.0 SDK before the Godot engine initialises.",
        preview: '<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>',
        code: `<!-- custom_html_shell.html — before godot.js -->\n<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>`,
        language: "html",
      },
      {
        id: 2, title: "GDScript JS bridge autoload", free: false,
        description: "Create a JavaScript singleton that GDScript can call to trigger SDK methods and receive callbacks.",
        file: "res://autoloads/FBInstantBridge.gd",
        where: "Create this file, then add it as an Autoload: Project → Project Settings → Autoload → click + and select this file",
        insertAfter: `# Godot: Project → Project Settings → Autoload\n# Add this file path: res://autoloads/FBInstantBridge.gd\n# ↓ paste the full file contents below`,
        preview: "// Godot JS autoload bridge — unlock to see",
        code: `// res://autoloads/FBInstantBridge.gd\nextends Node\n\nfunc _ready():\n  if OS.get_name() == "Web":\n    JavaScriptBridge.eval("""\n      window._godotFB = {\n        init: function() {\n          FBInstant.initializeAsync()\n            .then(() => FBInstant.startGameAsync())\n            .then(() => godot.emit_signal('fb_ready'))\n            .catch(e => godot.emit_signal('fb_error', e.message));\n        },\n        requestProfile: function() {\n          FBInstant.player.requestPermissionsAsync(['PROFILE','USER_PHOTOS'])\n            .then(granted => {\n              var name = granted.includes('PROFILE') ? FBInstant.player.getName() : 'Player';\n              var photo = granted.includes('USER_PHOTOS') ? FBInstant.player.getPhoto() : '';\n              godot.emit_signal('fb_profile', JSON.stringify({name, photo}));\n            });\n        }\n      };\n      window._godotFB.init();\n    """, true)\n\nsignal fb_ready\nsignal fb_profile(json_str)\nsignal fb_error(msg)`,
        language: "gdscript",
      },
    ],
  },

  "meta-construct": {
    title: "Meta Instant Games SDK v8.0 — Construct 3",
    deadline: "September 30, 2026",
    deadlineColor: "#EE1D52",
    intro: "Construct 3 uses a plugin-based SDK model. The FBInstant plugin must be updated to v8.0 and the permission flow refactored.",
    steps: [
      {
        id: 1, title: "Update the SDK loader in your project", free: true,
        description: "In Construct 3 Project Properties → Advanced → Script URLs, update the FBInstant URL.",
        preview: "https://connect.facebook.net/en_US/fbinstant.8.0.js",
        code: `// Project Properties → Scripts → External Scripts:\n// REMOVE: https://connect.facebook.net/en_US/fbinstant.6.3.js\n// ADD:    https://connect.facebook.net/en_US/fbinstant.8.0.js`,
        language: "js",
      },
      {
        id: 2, title: "Refactor permission calls in event sheets", free: false,
        description: "All FBInstant.player.getName() calls in your event sheets must be moved behind a permission request gate.",
        file: "Your Construct 3 project — JavaScript event block",
        where: "In your event sheet: find any 'On start of layout' JavaScript action and add this permission gate before any FBInstant.player calls",
        insertAfter: `// Event sheet → JavaScript action → paste at the TOP before any player.getName() calls`,
        preview: "// Event sheet permission gate pattern — unlock to see",
        code: `// In your Construct 3 JavaScript event or plugin action:\nasync function requestAndLoadProfile() {\n  const granted = await FBInstant.player.requestPermissionsAsync(['PROFILE']);\n  const name = granted.includes('PROFILE') ? FBInstant.player.getName() ?? 'Player' : 'Player';\n  // Set Construct variable:\n  runtime.globalVars.PlayerName = name;\n}`,
        language: "js",
      },
    ],
  },

  // ─── TIKTOK ───────────────────────────────────────────────────────────────

  "tiktok-unity": {
    title: "TikTok Mini Games — Unity WebGL",
    deadline: "Active (ongoing)",
    deadlineColor: "#FF6B00",
    intro: "Unity WebGL games on TikTok fail with swipe-to-exit issues because Unity's default template doesn't set touch-action CSS. Quick fix but requires template patch + SDK bridge.",
    steps: [
      {
        id: 1, title: "Fix touch-action CSS", free: true,
        description: "Add touch-action: none to your Unity canvas. Without this, TikTok's gesture layer hijacks input.",
        file: "Assets/WebGLTemplates/YourTemplate/style.css",
        where: "Add to the bottom of your existing CSS file (or create it if it doesn't exist)",
        insertAfter: `/* Your existing styles end here */\n/* ↓ Paste these new rules below */`,
        preview: "#unity-canvas { touch-action: none; }",
        code: `/* Unity WebGL template style.css */\n#unity-canvas, #unity-container {\n  touch-action: none;\n  -webkit-touch-callout: none;\n  user-select: none;\n}`,
        language: "css",
      },
      {
        id: 2, title: "Add TikTok SDK loader", free: true,
        description: "Include the TikTok Games SDK in your Unity WebGL template before UnityLoader.",
        file: "Assets/WebGLTemplates/YourTemplate/index.html",
        where: "Inside <head>, BEFORE the UnityLoader script tag",
        insertAfter: `<head>\n  ...\n  <!-- ← paste TikTok SDK script here, before UnityLoader below -->\n  <script src="Build/UnityLoader.js"></script>`,
        preview: '<script src="https://lf16-tiktok-web.ttwstatic.com/.../tt_games_sdk.js"></script>',
        code: `<!-- Unity Template index.html -->\n<script src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tt_games_sdk/tt_games_sdk.js"></script>`,
        language: "html",
      },
      {
        id: 3, title: "Unity jslib TikTok bridge", free: false,
        description: "Full jslib plugin bridging Unity C# to the TikTok Games SDK for login and ads.",
        file: "Assets/Plugins/WebGL/TikTokSDK.jslib",
        where: "Create this file (or replace existing contents) — Unity will automatically compile it into your WebGL build",
        insertAfter: `// Create file at: Assets/Plugins/WebGL/TikTokSDK.jslib\n// (create the WebGL folder if it doesn't exist)\n// ↓ paste the full file contents below`,
        preview: "// TikTokSDK.jslib — unlock to see",
        code: `// Assets/Plugins/WebGL/TikTokSDK.jslib\nmergeInto(LibraryManager.library, {\n  TT_Init: function() {\n    tt.isGameSDKReady(function(err, ready) {\n      if (!err && ready) {\n        tt.login({ success: r => SendMessage('TTManager','OnLogin', r.code||''), fail: e => SendMessage('TTManager','OnLoginFail','') });\n      }\n    });\n  },\n  TT_ShowRewardedAd: function(adUnitPtr) {\n    var id = UTF8ToString(adUnitPtr);\n    tt.showRewardedVideoAd({ adUnitId: id, success: () => SendMessage('TTManager','OnAdDone',''), fail: e => SendMessage('TTManager','OnAdFail','') });\n  }\n});`,
        language: "js",
      },
      {
        id: 4, title: "C# TikTok Manager", free: false,
        description: "MonoBehaviour handling all TikTok SDK events with editor fallback.",
        file: "Assets/Scripts/TikTokManager.cs",
        where: "Create this script, then attach the TikTokManager component to a persistent GameObject in your first scene",
        insertAfter: `// Unity: Assets → Create → C# Script → name it "TikTokManager"\n// Then drag it onto a GameObject that persists across scenes\n// ↓ paste the full file contents below`,
        preview: "// TikTokManager.cs — unlock to see",
        code: `// TikTokManager.cs\nusing UnityEngine;\nusing System.Runtime.InteropServices;\nusing System;\n\npublic class TikTokManager : MonoBehaviour {\n  [DllImport("__Internal")] static extern void TT_Init();\n  [DllImport("__Internal")] static extern void TT_ShowRewardedAd(string id);\n\n  public static event Action OnAdComplete;\n  public static TikTokManager Instance { get; private set; }\n\n  void Awake() { if (Instance == null) { Instance = this; DontDestroyOnLoad(gameObject); } else Destroy(gameObject); }\n  void Start() { #if UNITY_WEBGL && !UNITY_EDITOR TT_Init(); #endif }\n\n  public void ShowAd(string adUnitId) {\n    #if UNITY_WEBGL && !UNITY_EDITOR\n    TT_ShowRewardedAd(adUnitId);\n    #else\n    OnAdComplete?.Invoke();\n    #endif\n  }\n\n  public void OnLogin(string code) {}\n  public void OnAdDone(string _) => OnAdComplete?.Invoke();\n  public void OnAdFail(string _) => Debug.LogWarning("TikTok ad failed");\n}`,
        language: "csharp",
      },
    ],
  },

  "tiktok-phaser": {
    title: "TikTok Mini Games — Phaser 3",
    deadline: "Active (ongoing)",
    deadlineColor: "#FF6B00",
    intro: "Phaser 3 on TikTok is straightforward. Fix touch-action, wire the SDK before Phaser boots, add rewarded ads.",
    steps: [
      {
        id: 1, title: "Fix touch-action CSS", free: true,
        description: "Required CSS to prevent TikTok's gesture layer from intercepting game input.",
        file: "index.html",
        where: "Inside the <head> tag, in a <style> block",
        insertAfter: `<head>\n  <meta charset="utf-8">\n  <!-- ↓ add this style block here -->`,
        preview: "canvas { touch-action: none; }",
        code: `<style>\n  canvas, body { touch-action: none; margin: 0; overflow: hidden; }\n</style>`,
        language: "html",
      },
      {
        id: 2, title: "SDK init before Phaser boot", free: true,
        description: "Load and init TikTok SDK before creating your Phaser.Game instance.",
        file: "src/main.js  (your entry point — the file that calls 'new Phaser.Game(...)')",
        where: "Replace your existing 'new Phaser.Game(config)' call with the boot() wrapper below",
        insertAfter: `// Your current main.js:\nconst config = { ... };\nnew Phaser.Game(config); // ← replace this line with the boot() function below`,
        preview: "tt.isGameSDKReady(callback) → then new Phaser.Game(config)",
        code: `// main.js\nasync function boot() {\n  const ready = await new Promise(r => tt.isGameSDKReady((e,ok) => r(!e && ok)));\n  if (ready) await new Promise(r => tt.login({ success: r, fail: () => r() }));\n  new Phaser.Game(config);\n}\nboot();`,
        language: "js",
      },
      {
        id: 3, title: "Rewarded ad helper", free: false,
        description: "Reusable rewarded ad function for use in any Phaser scene.",
        file: "src/ads.js",
        where: "Create this file, then import showRewardedAd from it in any scene where you want to trigger a rewarded ad",
        insertAfter: `// Create src/ads.js\n// Then in your scene file add at the top:\n// import { showRewardedAd } from './ads.js';`,
        preview: "// showRewardedAd() — unlock to see",
        code: `// ads.js\nexport async function showRewardedAd(adUnitId) {\n  return new Promise((resolve) => {\n    tt.showRewardedVideoAd({\n      adUnitId,\n      success: () => resolve(true),\n      fail: (e) => { console.warn('Ad failed:', e); resolve(false); }\n    });\n  });\n}\n\n// Usage in scene:\n// const rewarded = await showRewardedAd('your_unit_id');\n// if (rewarded) givePlayerBonus();`,
        language: "js",
      },
    ],
  },

  "tiktok-godot": {
    title: "TikTok Mini Games — Godot 4", deadline: "Active (ongoing)", deadlineColor: "#FF6B00",
    intro: "Godot 4 HTML5 export on TikTok requires touch-action CSS in the export template and a JavaScript singleton bridge to the TikTok SDK.",
    steps: [
      { id: 1, title: "touch-action CSS in Godot export template", free: true, description: "Modify the Godot HTML export shell to add touch-action: none.", preview: "canvas { touch-action: none; }", code: `/* In your Godot custom HTML shell */\ncanvas { touch-action: none; }\nbody { margin: 0; overflow: hidden; touch-action: none; }`, language: "css" },
      { id: 2, title: "TikTok SDK + GDScript bridge", free: false, description: "JavaScriptBridge autoload wiring TikTok SDK login and ads to GDScript signals.", preview: "// Godot TikTok bridge — unlock to see", code: `# TTBridge.gd autoload\nfunc _ready():\n  if OS.get_name() == "Web":\n    JavaScriptBridge.eval("""\n      window._tt = {};\n      tt.isGameSDKReady(function(err, ok) {\n        if (ok) tt.login({ success: function(r) { godot.emit_signal('tt_login', r.code||''); } });\n      });\n    """, true)\nsignal tt_login(code)`, language: "gdscript" },
    ],
  },

  "tiktok-construct": {
    title: "TikTok Mini Games — Construct 3", deadline: "Active (ongoing)", deadlineColor: "#FF6B00",
    intro: "Construct 3 on TikTok requires a CSS template fix and script-based SDK init in your project's event sheet startup.",
    steps: [
      { id: 1, title: "touch-action CSS template fix", free: true, description: "Edit the Construct 3 HTML template to add touch-action: none.", preview: "canvas { touch-action: none; }", code: `/* Construct 3 HTML Template */\ncanvas { touch-action: none !important; }`, language: "css" },
      { id: 2, title: "SDK init in JavaScript event", free: false, description: "Full TikTok SDK init and ad handler inside a Construct 3 JavaScript event block.", preview: "// Construct 3 JS event — unlock to see", code: `// On Start of Layout → JavaScript:\nawait new Promise(r => tt.isGameSDKReady((e,ok) => r()));\nawait new Promise(r => tt.login({ success: r, fail: r }));\nruntime.globalVars.TT_Ready = true;`, language: "js" },
    ],
  },

  "tiktok-cocos": {
    title: "TikTok Mini Games — Cocos Creator", deadline: "Active (ongoing)", deadlineColor: "#FF6B00",
    intro: "Cocos Creator HTML5 builds on TikTok need touch-action patched in the build template and the TikTok SDK wired via a JSB script.",
    steps: [
      { id: 1, title: "Patch touch-action in Cocos build template", free: true, description: "Modify the Cocos web-mobile template CSS to prevent TikTok gesture hijacking.", preview: "canvas { touch-action: none; }", code: `/* build-templates/web-mobile/index.css */\n#GameCanvas { touch-action: none; }`, language: "css" },
      { id: 2, title: "TikTok SDK Cocos component", free: false, description: "TypeScript Cocos component for SDK init, login, and rewarded ads.", preview: "// Cocos TikTok component — unlock to see", code: `// TikTokSDK.ts\nimport { Component, _decorator } from 'cc';\nconst { ccclass } = _decorator;\n\n@ccclass('TikTokSDK')\nexport class TikTokSDK extends Component {\n  async onLoad() {\n    if (typeof tt === 'undefined') return;\n    await new Promise(r => (window as any).tt.isGameSDKReady((e: any, ok: boolean) => r(ok)));\n    await new Promise(r => (window as any).tt.login({ success: r, fail: r }));\n  }\n\n  async showRewardedAd(adUnitId: string): Promise<boolean> {\n    return new Promise(r => (window as any).tt.showRewardedVideoAd({ adUnitId, success: () => r(true), fail: () => r(false) }));\n  }\n}`, language: "ts" },
    ],
  },

  // ─── DISCORD ──────────────────────────────────────────────────────────────

  "discord-unity": {
    title: "Discord Activities — Unity WebGL", deadline: "Active (scope split enforced)", deadlineColor: "#5865F2",
    intro: "Discord's monolithic 'applications.commands' scope is broken for new users. Unity WebGL Activities must migrate to granular scopes and use the Embedded App SDK.",
    steps: [
      { id: 1, title: "Install Embedded App SDK", free: true, description: "Load the Discord Embedded App SDK in your Unity WebGL template.", file: "Assets/WebGLTemplates/YourTemplate/index.html", where: "Inside <head>, before the UnityLoader script", insertAfter: `<head>\n  ...\n  <!-- ↓ paste Discord SDK script tag here -->`, preview: '<script src="https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js"></script>', code: `<!-- Unity Template index.html -->\n<script src="https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js"></script>`, language: "html" },
      { id: 2, title: "Granular OAuth scope migration", free: true, description: "Update your OAuth scopes in the Discord Developer Portal and SDK init.", file: "Assets/WebGLTemplates/YourTemplate/index.html  (in the inline <script> block)", where: "Find your existing DiscordSDK init call and replace the scope array", insertAfter: `// Look for your current Discord auth call — it will look something like:\nawait sdk.commands.authorize({\n  scope: ['applications.commands'],  // ← this is the broken line to replace\n});`, preview: "scopes: ['identify','guilds.members.read']", code: `// Old (broken for new installs):\n// scopes: ['applications.commands']\n\n// New granular scopes:\nconst sdk = new DiscordSDK('YOUR_CLIENT_ID');\nawait sdk.ready();\nconst { code } = await sdk.commands.authorize({\n  client_id: 'YOUR_CLIENT_ID',\n  response_type: 'code',\n  state: '',\n  prompt: 'none',\n  scope: ['identify', 'guilds.members.read'],\n});`, language: "js" },
      { id: 3, title: "Unity jslib Discord bridge", free: false, description: "Full jslib bridge for Unity C# to call Discord SDK commands and receive auth callbacks.", file: "Assets/Plugins/WebGL/DiscordSDK.jslib", where: "Create this file — Unity auto-compiles jslib files in Plugins/WebGL into the WebGL build", insertAfter: `// Create file at: Assets/Plugins/WebGL/DiscordSDK.jslib\n// ↓ paste the full file contents below`, preview: "// DiscordSDK.jslib — unlock to see", code: `// Assets/Plugins/WebGL/DiscordSDK.jslib\nmergeInto(LibraryManager.library, {\n  Discord_Init: function() {\n    const sdk = new DiscordSDK(UTF8ToString(arguments[0]));\n    window._dsdk = sdk;\n    sdk.ready().then(() => SendMessage('DiscordManager','OnReady',''));\n  },\n  Discord_Authorize: function() {\n    window._dsdk.commands.authorize({\n      client_id: window._dsdk.clientId,\n      response_type: 'code',\n      state: '',\n      prompt: 'none',\n      scope: ['identify','guilds.members.read'],\n    }).then(r => SendMessage('DiscordManager','OnAuth', r.code||''));\n  }\n});`, language: "js" },
      { id: 4, title: "Server-side token exchange", free: false, description: "Your backend must exchange the auth code for a Discord access token. Never do this client-side.", file: "server.js  (your backend server file — Node/Express)", where: "Add this as a new POST route in your Express app, before app.listen()", insertAfter: `// In server.js, find your route definitions:\n// app.get('/...', ...)\n// ↓ add this new POST route here`, preview: "// Token exchange endpoint — unlock to see", code: `// server.js (Node/Express)\napp.post('/api/discord/token', async (req, res) => {\n  const { code } = req.body;\n  const response = await fetch('https://discord.com/api/oauth2/token', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },\n    body: new URLSearchParams({\n      client_id: process.env.DISCORD_CLIENT_ID,\n      client_secret: process.env.DISCORD_CLIENT_SECRET,\n      grant_type: 'authorization_code',\n      code,\n    }),\n  });\n  const data = await response.json();\n  res.json({ access_token: data.access_token });\n});`, language: "js" },
    ],
  },

  "discord-phaser": {
    title: "Discord Activities — Phaser 3", deadline: "Active", deadlineColor: "#5865F2",
    intro: "Phaser 3 on Discord Activities is clean — direct JS integration with the Embedded App SDK.",
    steps: [
      { id: 1, title: "Load Embedded App SDK", free: true, description: "Add the SDK to your index.html before main.js.", file: "index.html", where: "Inside <head>, before your bundle/main.js script tag", insertAfter: `<head>\n  <meta charset="utf-8">\n  <!-- ↓ add the Discord SDK script here, before your game's main script -->`, preview: '<script src="https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js"></script>', code: `<script src="https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js"></script>`, language: "html" },
      { id: 2, title: "SDK init + granular auth", free: true, description: "Init the SDK and request only the scopes you need.", file: "src/main.js  (your entry point, before new Phaser.Game(...))", where: "At the top of main.js — this must run before Phaser boots", insertAfter: `// Your current main.js starts something like:\nconst config = { type: Phaser.AUTO, ... };\n// ↓ paste the SDK init code ABOVE this line`, preview: "const sdk = new DiscordSDK(CLIENT_ID); await sdk.ready();", code: `import { DiscordSDK } from '@discord/embedded-app-sdk';\nconst sdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);\nawait sdk.ready();\nconst { code } = await sdk.commands.authorize({\n  client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,\n  response_type: 'code',\n  state: '',\n  prompt: 'none',\n  scope: ['identify'],\n});`, language: "js" },
      { id: 3, title: "Fetch user identity in Phaser scene", free: false, description: "After token exchange, get the authenticated user and load into your scene.", file: "src/scenes/GameScene.js  (or your first active game scene)", where: "Inside create() — after you receive the access_token back from your server's token exchange", insertAfter: `// In your GameScene.js create() method, after token exchange:\n// const access_token = await exchangeCodeForToken(code); // your server call\n// ↓ then add the code below`, preview: "// User identity in scene — unlock to see", code: `// After token exchange with your server:\nconst auth = await sdk.commands.authenticate({ access_token });\nconst user = auth.user;\n// user.username, user.avatar, user.id\nthis.registry.set('discordUser', user);`, language: "js" },
    ],
  },

  "discord-godot": { ...GENERIC_STEP("Discord Activities", "Godot 4", 1), title: "Discord Activities — Godot 4", deadline: "Active", deadlineColor: "#5865F2", intro: "Godot 4 HTML5 export with Discord Embedded App SDK via JavaScriptBridge.", steps: [{ id: 1, title: "SDK loader in Godot export template", free: true, description: "Add the Discord SDK script to your custom HTML shell.", preview: '<script src="https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js"></script>', code: `<!-- custom_shell.html -->\n<script src="https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js"></script>`, language: "html" }, GENERIC_STEP("Discord", "Godot", 2)] },
  "discord-construct": { title: "Discord Activities — Construct 3", deadline: "Active", deadlineColor: "#5865F2", intro: "Construct 3 Activities integration using JavaScript events and the Embedded App SDK.", steps: [{ id: 1, title: "SDK script in Construct project", free: true, description: "Add the Discord SDK URL to your project's external scripts.", preview: "https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js", code: `// Project Properties → Scripts → add:\n// https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js`, language: "js" }, GENERIC_STEP("Discord", "Construct 3", 2)] },
  "discord-cocos": { title: "Discord Activities — Cocos Creator", deadline: "Active", deadlineColor: "#5865F2", intro: "Cocos Creator TypeScript integration with the Discord Embedded App SDK.", steps: [{ id: 1, title: "Import Discord SDK", free: true, description: "Install via npm or load via CDN in your Cocos web template.", preview: "npm install @discord/embedded-app-sdk", code: `npm install @discord/embedded-app-sdk\n\n// In your entry TypeScript file:\nimport { DiscordSDK } from '@discord/embedded-app-sdk';`, language: "bash" }, GENERIC_STEP("Discord", "Cocos", 2)] },

  // ─── YOUTUBE ──────────────────────────────────────────────────────────────

  "youtube-unity": {
    title: "YouTube Playables — Unity WebGL", deadline: "15MB limit enforced", deadlineColor: "#FF0000",
    intro: "YouTube Playables enforces a strict 15MB compressed bundle. Unity WebGL builds are typically 20-50MB. Aggressive optimisation required.",
    steps: [
      { id: 1, title: "Enable Brotli compression", free: true, description: "Switch Unity WebGL compression to Brotli for maximum bundle reduction.", preview: "Player Settings → WebGL → Compression: Brotli", code: `// Unity Player Settings:\n// Publishing Settings → Compression Format → Brotli\n// This alone reduces bundle size by ~20% vs gzip`, language: "text" },
      { id: 2, title: "Strip assets and enable code stripping", free: true, description: "Enable managed code stripping and remove unused assets.", preview: "Managed Stripping Level: High", code: `// Player Settings → Other → Managed Stripping Level: High\n// Player Settings → Other → IL2CPP Code Generation: Faster Runtime\n// Remove all unused textures, audio, shaders from Resources/`, language: "text" },
      { id: 3, title: "Split textures and lazy-load", free: false, description: "Externally host textures and lazy-load them at runtime to keep initial bundle under 15MB.", file: "Assets/Scripts/TextureLoader.cs", where: "Create this script and attach it to any GameObject that needs to load external textures. Call StartCoroutine(LoadExternalTexture(...)) from Start()", insertAfter: `// Assets → Create → C# Script → name it "TextureLoader"\n// ↓ paste the full file contents below`, preview: "// External texture loading — unlock to see", code: `// TextureLoader.cs\nIEnumerator LoadExternalTexture(string url, Action<Texture2D> callback) {\n  using var req = UnityWebRequestTexture.GetTexture(url);\n  yield return req.SendWebRequest();\n  if (req.result == UnityWebRequest.Result.Success)\n    callback(DownloadHandlerTexture.GetContent(req));\n}\n\n// Call from Start():\nStartCoroutine(LoadExternalTexture("https://your-cdn.com/tex.jpg", tex => renderer.material.mainTexture = tex));`, language: "csharp" },
      { id: 4, title: "YouTube Playables manifest + submission", free: false, description: "Correct manifest format and submission flow for YouTube Playables ingestion.", file: "playable.json  (place in the root of your hosted game folder, alongside index.html)", where: "Create this file at the root of your build output — the same folder that contains index.html", insertAfter: `// Place this file next to your index.html:\n// your-game-folder/\n//   index.html\n//   playable.json  ← create this file\n//   Build/`, preview: "// YouTube manifest — unlock to see", code: `// playable.json\n{\n  "name": "Your Game Title",\n  "description": "Short description under 140 chars",\n  "category": "CASUAL",\n  "bundle_url": "https://your-host.com/game/index.html",\n  "preview_image": "https://your-host.com/preview.jpg",\n  "orientation": "LANDSCAPE"\n}`, language: "json" },
    ],
  },

  "youtube-phaser": {
    title: "YouTube Playables — Phaser 3", deadline: "15MB limit enforced", deadlineColor: "#FF0000",
    intro: "Phaser 3 is well-suited for YouTube Playables — the main challenge is keeping bundle under 15MB and avoiding external network calls.",
    steps: [
      { id: 1, title: "Audit and cap your bundle size", free: true, description: "Use rollup-plugin-visualizer to find what's bloating your build.", preview: "npx rollup-plugin-visualizer — check for oversized deps", code: `// vite.config.js\nimport { visualizer } from 'rollup-plugin-visualizer';\nexport default { plugins: [visualizer({ open: true })] };\n\n// Run: npm run build\n// Opens a treemap — cut anything over 1MB`, language: "js" },
      { id: 2, title: "No external network calls", free: true, description: "YouTube Playables block all external fetch/XHR. All assets must be bundled or data URIs.", preview: "// No fetch() calls allowed — all assets must be local", code: `// BANNED — will silently fail:\nfetch('https://api.yourserver.com/score');\n\n// Use localStorage for persistence:\nlocalStorage.setItem('highScore', score);\nconst best = parseInt(localStorage.getItem('highScore') || '0');`, language: "js" },
      { id: 3, title: "Phaser atlas packing for size", free: false, description: "Pack all sprites into a single atlas to reduce HTTP overhead and enable better compression.", file: "src/scenes/PreloadScene.js  (or your Phaser preload scene)", where: "Inside the preload() method — replace individual texture loads with a single atlas load", insertAfter: `// Find your existing preload() method:\npreload() {\n  // ← replace individual this.load.image() calls with the atlas load below\n  this.load.image('player', 'assets/player.png');\n  this.load.image('enemy', 'assets/enemy.png');\n  // ↓ replace all of the above with:`, preview: "// TexturePacker atlas config — unlock to see", code: `// preload() in your Phaser scene:\nthis.load.atlas('game', 'assets/game.webp', 'assets/game.json');\n// Use WebP format — ~30% smaller than PNG\n// Pack via TexturePacker: Settings → Format → Phaser 3`, language: "js" },
    ],
  },

  "youtube-godot": { title: "YouTube Playables — Godot 4", deadline: "15MB limit", deadlineColor: "#FF0000", intro: "Godot 4 WASM exports are large by default. Aggressive export flags and asset splitting required.", steps: [{ id: 1, title: "Enable export compression flags", free: true, description: "Use Godot's export settings to minimise bundle size for YouTube.", preview: "Export → HTML5 → GDScript LTO: enabled, Strip Debug Symbols: yes", code: `// Godot Export Settings for YouTube Playables:\n// ✅ Link Time Optimization (LTO): enabled\n// ✅ Debug Symbols: stripped\n// ✅ Thread Support: disabled (adds ~4MB)\n// ✅ GDExtension: only include what you use`, language: "text" }, GENERIC_STEP("YouTube", "Godot", 2)] },
  "youtube-construct": { title: "YouTube Playables — Construct 3", deadline: "15MB limit", deadlineColor: "#FF0000", intro: "Construct 3 HTML5 exports are compact but require minification and asset optimisation for YouTube's 15MB cap.", steps: [{ id: 1, title: "Enable minification + NW.js export", free: true, description: "Use Construct's minification settings for the smallest output.", preview: "Export → Minify script: Yes, Lossless WebP: Yes", code: `// Construct 3 Export Settings:\n// ✅ Minify script: Yes\n// ✅ Recompress images: Yes (WebP)\n// ✅ Remove unused effects: Yes`, language: "text" }, GENERIC_STEP("YouTube", "Construct", 2)] },
  "youtube-cocos": { title: "YouTube Playables — Cocos Creator", deadline: "15MB limit", deadlineColor: "#FF0000", intro: "Cocos Creator web-mobile builds need asset bundle splitting and texture compression for YouTube's 15MB limit.", steps: [{ id: 1, title: "Enable asset bundle + ASTC compression", free: true, description: "Use Cocos Asset Bundles to split content and ASTC for texture compression.", preview: "Asset Bundle → compress: ASTC", code: `// cocos project.json build settings:\n// ✅ Compress textures: ASTC 6x6\n// ✅ Enable Asset Bundle: true\n// ✅ Inline all SpriteFrames: true (reduces HTTP count)`, language: "json" }, GENERIC_STEP("YouTube", "Cocos", 2)] },

  // ─── POKI ─────────────────────────────────────────────────────────────────

  "poki-unity": {
    title: "Poki SDK — Unity WebGL", deadline: "SDK required for distribution", deadlineColor: "#00C896",
    intro: "All games distributed on Poki require the PokiSDK. The SDK manages game lifecycle signals — without it, Poki's platform won't know when your game is loaded, paused, or in gameplay.",
    steps: [
      { id: 1, title: "Add PokiSDK to Unity template", free: true, description: "Inject the PokiSDK script into your Unity WebGL index.html template.", file: "Assets/WebGLTemplates/YourTemplate/index.html", where: "Inside <head>, before the UnityLoader script tag", insertAfter: `<head>\n  <meta charset="utf-8">\n  <!-- ↓ add PokiSDK script here -->`, preview: '<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>', code: `<!-- Unity WebGL Template index.html -->\n<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>`, language: "html" },
      { id: 2, title: "PokiSDK lifecycle calls", free: true, description: "Signal game loading, gameplay start, and gameplay stop to Poki's platform.", file: "Assets/WebGLTemplates/YourTemplate/index.html  (in the inline <script> block at the bottom)", where: "After Unity's createUnityInstance() promise resolves — inside the .then() callback", insertAfter: `createUnityInstance(canvas, config).then(function(unityInstance) {\n  // ↓ add Poki lifecycle calls here, after game finishes loading`, preview: "PokiSDK.gameLoadingFinished(); PokiSDK.gameplayStart();", code: `// Required lifecycle signals:\nPokiSDK.gameLoadingFinished();  // when game assets fully loaded\nPokiSDK.gameplayStart();        // when player begins playing\nPokiSDK.gameplayStop();         // on game over, pause, menus`, language: "js" },
      { id: 3, title: "Unity C# Poki lifecycle bridge", free: false, description: "jslib + MonoBehaviour to call PokiSDK lifecycle from Unity C# at the right moments.", file: "Assets/Plugins/WebGL/PokiSDK.jslib  +  Assets/Scripts/PokiManager.cs", where: "Create PokiSDK.jslib in Plugins/WebGL, then create PokiManager.cs as a script and attach it to a persistent GameObject in your first scene", insertAfter: `// 1. Create: Assets/Plugins/WebGL/PokiSDK.jslib\n// 2. Create: Assets/Scripts/PokiManager.cs\n// 3. Attach PokiManager to a GameObject\n// ↓ paste the full contents below (contains both files)`, preview: "// Poki jslib bridge — unlock to see", code: `// PokiSDK.jslib\nmergeInto(LibraryManager.library, {\n  Poki_LoadingFinished: function() { PokiSDK.gameLoadingFinished(); },\n  Poki_GameplayStart: function()   { PokiSDK.gameplayStart(); },\n  Poki_GameplayStop: function()    { PokiSDK.gameplayStop(); },\n  Poki_CommercialBreak: function() {\n    PokiSDK.commercialBreak().then(() => SendMessage('PokiManager','OnAdDone',''));\n  }\n});\n\n// PokiManager.cs\n[DllImport("__Internal")] static extern void Poki_LoadingFinished();\n[DllImport("__Internal")] static extern void Poki_GameplayStart();\n[DllImport("__Internal")] static extern void Poki_GameplayStop();\n[DllImport("__Internal")] static extern void Poki_CommercialBreak();\npublic static event Action OnCommercialBreakDone;`, language: "js" },
    ],
  },

  "poki-phaser": {
    title: "Poki SDK — Phaser 3", deadline: "SDK required", deadlineColor: "#00C896",
    intro: "Phaser 3 + PokiSDK is one of the easiest integrations. Wire lifecycle calls into your scene transitions.",
    steps: [
      { id: 1, title: "Load PokiSDK", free: true, description: "Add the PokiSDK script to your index.html.", file: "index.html", where: "Inside <head>, before your bundle script", insertAfter: `<head>\n  <meta charset="utf-8">\n  <!-- ↓ add PokiSDK script here -->`, preview: '<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>', code: `<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>`, language: "html" },
      { id: 2, title: "Lifecycle in Phaser scenes", free: true, description: "Wire the three required lifecycle calls into your scene events.", file: "src/scenes/BootScene.js  and  src/scenes/GameScene.js", where: "In BootScene: inside the create() method. In GameScene: inside create() and shutdown()", insertAfter: `// In your BootScene.js, you probably have:\ncreate() {\n  this.scene.start('GameScene'); // ← add PokiSDK.gameLoadingFinished() BEFORE this line\n}`, preview: "PokiSDK.gameLoadingFinished() in preload complete", code: `// BootScene.js\ncreate() { PokiSDK.gameLoadingFinished(); this.scene.start('GameScene'); }\n\n// GameScene.js\ncreate() { PokiSDK.gameplayStart(); }\nshutdown() { PokiSDK.gameplayStop(); }`, language: "js" },
      { id: 3, title: "Commercial break ad integration", free: false, description: "Show Poki commercial breaks between rounds with proper gameplay pause.", file: "src/gameOverHandler.js  (or the file where you handle game over / round end logic)", where: "Replace or wrap your existing game-over function with this — call it whenever a round ends", insertAfter: `// Find your current game over handler — it probably looks like:\nfunction onGameOver() {\n  showGameOverScreen();\n  // ↓ replace the entire function with the version below`, preview: "// PokiSDK.commercialBreak() — unlock to see", code: `// gameOverHandler.js\nasync function onGameOver() {\n  PokiSDK.gameplayStop();\n  // Pause game sounds/timers here\n  await PokiSDK.commercialBreak();\n  // Resume or show restart screen\n  PokiSDK.gameplayStart();\n}`, language: "js" },
    ],
  },

  "poki-godot":     { title: "Poki SDK — Godot 4",     deadline: "SDK required", deadlineColor: "#00C896", intro: "Godot 4 HTML5 + PokiSDK via JavaScriptBridge autoload.", steps: [{ id:1, title:"Add PokiSDK to export template", free:true, description:"Inject PokiSDK into custom HTML shell.", preview:'<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>', code:`<!-- custom_shell.html -->\n<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>`, language:"html" }, GENERIC_STEP("Poki","Godot",2)] },
  "poki-construct":  { title: "Poki SDK — Construct 3",  deadline: "SDK required", deadlineColor: "#00C896", intro: "Construct 3 + PokiSDK via external script and JavaScript event blocks.", steps: [{ id:1, title:"Add PokiSDK external script", free:true, description:"Add PokiSDK CDN to project external scripts.", preview:"https://game-cdn.poki.com/scripts/v2/poki-sdk.js", code:`// Project → Scripts → External:\n// https://game-cdn.poki.com/scripts/v2/poki-sdk.js`, language:"js" }, GENERIC_STEP("Poki","Construct",2)] },
  "poki-cocos":      { title: "Poki SDK — Cocos Creator", deadline: "SDK required", deadlineColor: "#00C896", intro: "Cocos Creator web build + PokiSDK lifecycle integration.", steps: [{ id:1, title:"Load PokiSDK in Cocos web template", free:true, description:"Add PokiSDK to the Cocos web-mobile build template index.html.", preview:'<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>', code:`<!-- build-templates/web-mobile/index.html -->\n<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>`, language:"html" }, GENERIC_STEP("Poki","Cocos",2)] },

  // ─── CRAZYGAMES ───────────────────────────────────────────────────────────

  "crazygames-unity": {
    title: "CrazyGames SDK v3 — Unity WebGL", deadline: "SDK v3 required", deadlineColor: "#F39C12",
    intro: "CrazyGames SDK v3 changed the ad and gameplay hook API. Unity games must update the jslib bridge and implement the new lifecycle.",
    steps: [
      { id: 1, title: "Load CrazyGames SDK v3", free: true, description: "Update your Unity template to load the SDK v3 endpoint.", preview: '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>', code: `<!-- Unity Template -->\n<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>`, language: "html" },
      { id: 2, title: "SDK init + gameplay hooks", free: true, description: "CrazyGames SDK v3 requires explicit init and gameplay start/stop signals.", preview: "CrazyGames.SDK.init(); CrazyGames.SDK.game.gameplayStart();", code: `await CrazyGames.SDK.init();\nCrazyGames.SDK.game.gameplayStart();\n// on pause/menu:\nCrazyGames.SDK.game.gameplayStop();`, language: "js" },
      { id: 3, title: "Unity jslib CrazyGames bridge", free: false, description: "Full jslib for Unity C# to call CrazyGames SDK v3 ad and lifecycle methods.", file: "Assets/Plugins/WebGL/CrazyGamesSDK.jslib", where: "Create this file in Plugins/WebGL — Unity auto-compiles it into your WebGL build", insertAfter: `// Create file at: Assets/Plugins/WebGL/CrazyGamesSDK.jslib\n// ↓ paste the full file contents below`, preview: "// CrazyGamesSDK.jslib — unlock to see", code: `// CrazyGamesSDK.jslib\nmergeInto(LibraryManager.library, {\n  CG_Init: function() {\n    CrazyGames.SDK.init().then(() => SendMessage('CGManager','OnReady',''));\n  },\n  CG_GameplayStart: function() { CrazyGames.SDK.game.gameplayStart(); },\n  CG_GameplayStop:  function() { CrazyGames.SDK.game.gameplayStop(); },\n  CG_ShowAd: function() {\n    CrazyGames.SDK.ad.requestAd('midgame', {\n      adStarted:  () => SendMessage('CGManager','OnAdStart',''),\n      adFinished: () => SendMessage('CGManager','OnAdDone',''),\n      adError:    () => SendMessage('CGManager','OnAdDone',''),\n    });\n  }\n});`, language: "js" },
    ],
  },

  "crazygames-phaser": {
    title: "CrazyGames SDK v3 — Phaser 3", deadline: "SDK v3 required", deadlineColor: "#F39C12",
    intro: "Phaser 3 + CrazyGames SDK v3 is clean. Wire the init + lifecycle into your scene management.",
    steps: [
      { id: 1, title: "Load SDK v3", free: true, description: "Add CrazyGames SDK v3 to your index.html.", preview: '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>', code: `<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>`, language: "html" },
      { id: 2, title: "Init + scene lifecycle wiring", free: true, description: "Init SDK before Phaser, fire gameplayStart/Stop on scene transitions.", preview: "await CrazyGames.SDK.init(); → new Phaser.Game(config)", code: `await CrazyGames.SDK.init();\nconst game = new Phaser.Game(config);\n\n// In GameScene:\ncreate() { CrazyGames.SDK.game.gameplayStart(); }\nshutdown() { CrazyGames.SDK.game.gameplayStop(); }`, language: "js" },
      { id: 3, title: "Midgame ad integration", free: false, description: "Trigger midgame ads between rounds with proper pause handling.", file: "src/ads.js  (or the file where you manage ad calls)", where: "Create or update this file, then call showMidgameAd() from your game-over / round-end handler", insertAfter: `// Create src/ads.js\n// Then in your scene or game-over handler:\n// import { showMidgameAd } from './ads.js';\n// await showMidgameAd(); // call between rounds`, preview: "// CrazyGames midgame ad — unlock to see", code: `async function showMidgameAd() {\n  CrazyGames.SDK.game.gameplayStop();\n  await new Promise(resolve => {\n    CrazyGames.SDK.ad.requestAd('midgame', {\n      adFinished: resolve,\n      adError:    resolve,\n    });\n  });\n  CrazyGames.SDK.game.gameplayStart();\n}`, language: "js" },
    ],
  },

  "crazygames-godot":    { title: "CrazyGames SDK v3 — Godot 4",     deadline: "SDK v3", deadlineColor: "#F39C12", intro: "Godot 4 + CrazyGames SDK v3 via JavaScriptBridge.", steps: [{ id:1, title:"SDK v3 in Godot export template", free:true, description:"Add to custom HTML shell.", preview:'<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>', code:`<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>`, language:"html" }, GENERIC_STEP("CrazyGames","Godot",2)] },
  "crazygames-construct": { title: "CrazyGames SDK v3 — Construct 3", deadline: "SDK v3", deadlineColor: "#F39C12", intro: "Construct 3 + CrazyGames SDK v3 via external scripts.", steps: [{ id:1, title:"Add SDK v3 external script", free:true, description:"Add to project external scripts.", preview:"https://sdk.crazygames.com/crazygames-sdk-v3.js", code:`// Project → External Scripts:\n// https://sdk.crazygames.com/crazygames-sdk-v3.js`, language:"js" }, GENERIC_STEP("CrazyGames","Construct",2)] },
  "crazygames-cocos":    { title: "CrazyGames SDK v3 — Cocos Creator", deadline: "SDK v3", deadlineColor: "#F39C12", intro: "Cocos Creator + CrazyGames SDK v3 lifecycle integration.", steps: [{ id:1, title:"SDK in Cocos build template", free:true, description:"Add to web-mobile index.html.", preview:'<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>', code:`<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>`, language:"html" }, GENERIC_STEP("CrazyGames","Cocos",2)] },

  // ─── LINKEDIN ─────────────────────────────────────────────────────────────

  "linkedin-unity": {
    title: "LinkedIn Playables — Unity WebGL", deadline: "Strict bundle & network rules", deadlineColor: "#0A66C2",
    intro: "LinkedIn Playables for B2B lead gen. Strict 2MB (uncompressed) bundle limit, zero external network calls, MRAID-compatible output required.",
    steps: [
      { id: 1, title: "Enable aggressive Unity size reduction", free: true, description: "LinkedIn's 2MB limit requires extreme build optimisation.", preview: "Managed Stripping: High, Brotli compression, IL2CPP", code: `// Player Settings for LinkedIn:\n// ✅ Compression: Brotli\n// ✅ Managed Stripping Level: High\n// ✅ IL2CPP Code Generation: Faster Runtime\n// ✅ Strip Engine Code: enabled\n// Target: < 2MB compressed`, language: "text" },
      { id: 2, title: "Remove all external network calls", free: true, description: "LinkedIn blocks all fetch/XHR. Use localStorage only.", preview: "// No fetch() — use localStorage for all persistence", code: `// BLOCKED by LinkedIn:\nfetch('https://api.example.com');\n\n// Use localStorage:\nlocalStorage.setItem('li_score', score.toString());\nconst prev = parseInt(localStorage.getItem('li_score') || '0');`, language: "js" },
      { id: 3, title: "MRAID-compatible clickthrough", free: false, description: "LinkedIn Playables require MRAID-standard clickthrough handling for the CTA.", file: "Assets/WebGLTemplates/YourTemplate/index.html  (or Assets/Plugins/WebGL/LinkedIn.jslib)", where: "Add the handleCTA function inside a <script> block in index.html, or inside a jslib. Call it from your C# CTA button handler.", insertAfter: `// In index.html, inside an existing <script> block:\n// OR in a .jslib file if calling from C#\n// ↓ add the function below`, preview: "// MRAID clickthrough — unlock to see", code: `// index.html or jslib:\nfunction handleCTA(url) {\n  if (typeof mraid !== 'undefined') {\n    mraid.open(url); // MRAID standard\n  } else {\n    window.open(url, '_blank');\n  }\n}`, language: "js" },
    ],
  },

  "linkedin-phaser": {
    title: "LinkedIn Playables — Phaser 3", deadline: "Strict bundle & network rules", deadlineColor: "#0A66C2",
    intro: "Phaser 3 is ideal for LinkedIn Playables — lightweight and tree-shakeable. Focus on bundle size and MRAID compliance.",
    steps: [
      { id: 1, title: "Tree-shake Phaser for minimum bundle", free: true, description: "Import only the Phaser modules you use — not the whole library.", preview: "import { Scene, GameObjects } from 'phaser'", code: `// Instead of: import Phaser from 'phaser' (~1MB)\n// Use partial imports:\nimport { Game, Scene } from 'phaser';\nimport { Image, Text } from 'phaser/src/gameobjects';\n// Also: set Phaser's WebGL renderer only if needed, Canvas is smaller`, language: "js" },
      { id: 2, title: "No external calls + localStorage", free: true, description: "Strip all fetch/XHR and replace with localStorage.", preview: "localStorage only — no network", code: `// Game data persistence without network:\nclass SaveManager {\n  static save(key, value) { localStorage.setItem('li_' + key, JSON.stringify(value)); }\n  static load(key, fallback) {\n    const v = localStorage.getItem('li_' + key);\n    return v ? JSON.parse(v) : fallback;\n  }\n}`, language: "js" },
      { id: 3, title: "MRAID CTA + lead capture", free: false, description: "Proper MRAID clickthrough and LinkedIn lead gen CTA implementation.", file: "src/cta.js", where: "Create this file, then import and call openLinkedInCTA() from your game-over / win screen", insertAfter: `// Create src/cta.js\n// Then in your win/game-over scene:\n// import { openLinkedInCTA } from './cta.js';\n// ↓ paste the full file contents below`, preview: "// MRAID CTA — unlock to see", code: `// cta.js\nexport function openLinkedInCTA(url) {\n  if (window.mraid?.getState() === 'expanded' || window.mraid?.getState() === 'default') {\n    window.mraid.open(url);\n  } else {\n    window.open(url, '_blank');\n  }\n}\n\n// In your game over / win screen:\nopenLinkedInCTA('https://your-landing-page.com?utm_source=linkedin_playable');`, language: "js" },
    ],
  },

  "linkedin-godot":    { title: "LinkedIn Playables — Godot 4",     deadline: "2MB limit", deadlineColor: "#0A66C2", intro: "Godot 4 with LinkedIn's strict 2MB and no-network requirements.", steps: [{ id:1, title:"Maximise Godot export size reduction", free:true, description:"Use all available Godot size reduction flags.", preview:"LTO, strip debug, no threads, minimal modules", code:`// Godot Export → HTML5:\n// ✅ LTO enabled\n// ✅ Strip debug symbols\n// ✅ Thread support: OFF (saves ~4MB)\n// ✅ Only enable modules your game uses`, language:"text" }, GENERIC_STEP("LinkedIn","Godot",2)] },
  "linkedin-construct": { title: "LinkedIn Playables — Construct 3", deadline: "2MB limit", deadlineColor: "#0A66C2", intro: "Construct 3 with LinkedIn Playables size and network constraints.", steps: [{ id:1, title:"Minimise Construct export", free:true, description:"Enable all minification and WebP recompression.", preview:"Minify: Yes, WebP: Yes, strip unused effects", code:`// Construct Export Settings:\n// ✅ Minify script: Yes\n// ✅ Recompress images to WebP\n// ✅ Remove unused effects`, language:"text" }, GENERIC_STEP("LinkedIn","Construct",2)] },
};

// ─── PLAYCANVAS ───────────────────────────────────────────────────────────────

const PC_BASE_STEP = (platformName, platformId, sdkSnippet, sdkNote) => ([
  {
    id: 1, title: "Add SDK script asset to PlayCanvas project", free: true,
    description: `In your PlayCanvas Editor, create a new Script Asset and paste the ${platformName} SDK loader at the top, or add it to the index.html under 'External Scripts'.`,
    preview: sdkSnippet,
    code: `// PlayCanvas Editor → Settings → External Scripts:\n// Add: ${sdkSnippet}\n\n// Or in your boot script:\nif (!document.querySelector('script[src*="${platformId}"]')) {\n  const s = document.createElement('script');\n  s.src = '${sdkSnippet}';\n  document.head.appendChild(s);\n}`,
    language: "js",
  },
  {
    id: 2, title: `${platformName} SDK init in PlayCanvas boot script`, free: false,
    description: `Wire the SDK initialisation into your PlayCanvas app's boot/preload script before the first scene loads.`,
    file: "PlayCanvas Editor → create a new Script asset named 'boot.js'",
    where: "In your PlayCanvas project: create a new Script, attach it to the root entity or a dedicated Boot entity in your first scene",
    insertAfter: `// PlayCanvas Editor:\n// 1. Assets panel → + → Script → name it "boot.js"\n// 2. Drag the script onto your root Entity\n// ↓ paste the full script contents below`,
    preview: `// PlayCanvas boot script — unlock to see`,
    code: sdkNote,
    language: "js",
  },
]);

GUIDES["meta-playcanvas"] = { title: "Meta Instant Games SDK v8.0 — PlayCanvas", deadline: "September 30, 2026", deadlineColor: "#EE1D52", intro: "PlayCanvas projects on Meta Instant Games need the FBInstant SDK loaded as an external script and the v8.0 zero-permissions init wired into a boot script.", steps: PC_BASE_STEP("Meta FBInstant", "fbinstant", "https://connect.facebook.net/en_US/fbinstant.8.0.js", `// boot.js (PlayCanvas script)\nvar Boot = pc.createScript('boot');\nBoot.prototype.initialize = function() {\n  FBInstant.initializeAsync()\n    .then(() => FBInstant.startGameAsync())\n    .then(() => {\n      this.app.fire('fb:ready');\n    });\n  FBInstant.setLoadingProgress(50);\n};`) };

GUIDES["tiktok-playcanvas"] = { title: "TikTok Mini Games — PlayCanvas", deadline: "Active (ongoing)", deadlineColor: "#FF6B00", intro: "PlayCanvas on TikTok requires the touch-action CSS fix and TikTok SDK wired via an external script + boot script.", steps: [{ id:1, title:"Fix touch-action CSS + load TikTok SDK", free:true, description:"Add touch-action: none and load TikTok SDK in PlayCanvas External Scripts.", preview:"canvas { touch-action: none; }", code:`// PlayCanvas Settings → External Scripts:\n// https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tt_games_sdk/tt_games_sdk.js\n\n// PlayCanvas Settings → CSS (or custom index.html):\n// canvas { touch-action: none; }`, language:"css" }, { id:2, title:"TikTok SDK boot script", free:false, description:"Boot script for SDK init and login in PlayCanvas.", preview:"// PlayCanvas TikTok boot — unlock to see", code:`var TTBoot = pc.createScript('ttBoot');\nTTBoot.prototype.initialize = function() {\n  new Promise(r => tt.isGameSDKReady((e,ok) => r(!e && ok)))\n    .then(ok => ok ? new Promise(r => tt.login({ success: r, fail: r })) : null)\n    .then(() => this.app.fire('tt:ready'));\n};`, language:"js" }] };

GUIDES["discord-playcanvas"] = { title: "Discord Activities — PlayCanvas", deadline: "Active", deadlineColor: "#5865F2", intro: "PlayCanvas Activities on Discord require the Embedded App SDK loaded as an external script with granular OAuth scope init.", steps: PC_BASE_STEP("Discord Embedded App", "embedded-app-sdk", "https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js", `var DiscordBoot = pc.createScript('discordBoot');\nDiscordBoot.prototype.initialize = function() {\n  const sdk = new DiscordSDK(window.DISCORD_CLIENT_ID);\n  sdk.ready().then(() => sdk.commands.authorize({\n    client_id: window.DISCORD_CLIENT_ID,\n    response_type: 'code', state: '', prompt: 'none',\n    scope: ['identify'],\n  })).then(({ code }) => this.app.fire('discord:authed', code));\n};`) };

GUIDES["youtube-playcanvas"] = { title: "YouTube Playables — PlayCanvas", deadline: "15MB limit enforced", deadlineColor: "#FF0000", intro: "PlayCanvas HTML exports are lean but still require bundle auditing for YouTube's 15MB compressed limit. Disable all external script loads.", steps: [{ id:1, title:"Audit and minimise PlayCanvas build", free:true, description:"Use PlayCanvas's build pipeline to strip unused modules and compress textures.", preview:"Editor → Build → Enable DXT/ASTC compression, disable unused engine modules", code:`// PlayCanvas Editor → Project Settings → Engine modules:\n// Disable: Physics, Particles (if unused), Legacy Audio\n// Enable: DXT/ASTC texture compression\n// Target build size: < 10MB uncompressed`, language:"text" }, { id:2, title:"Remove all external network calls", free:false, description:"YouTube blocks all fetch/XHR. PlayCanvas scripts must use localStorage only.", file:"Your PlayCanvas application script (whichever script currently contains fetch/XHR calls)", where:"Find any script that calls fetch() or XMLHttpRequest — replace those calls with the localStorage pattern below", insertAfter:`// In any PlayCanvas script that has fetch() calls:\n// pc.Application.prototype.fetchScore = async function() { ... }\n// ↓ replace with localStorage version below`, preview:"// No fetch() — localStorage only — unlock to see", code:`// Replace any HTTP calls with localStorage:\npc.Application.prototype.saveScore = function(score) {\n  localStorage.setItem('yt_score', score);\n};\npc.Application.prototype.loadScore = function() {\n  return parseInt(localStorage.getItem('yt_score') || '0');\n};`, language:"js" }] };

GUIDES["poki-playcanvas"] = { title: "Poki SDK — PlayCanvas", deadline: "SDK required", deadlineColor: "#00C896", intro: "PlayCanvas + PokiSDK via external script and a lifecycle boot script.", steps: PC_BASE_STEP("Poki", "poki-sdk", "https://game-cdn.poki.com/scripts/v2/poki-sdk.js", `var PokiBoot = pc.createScript('pokiBoot');\nPokiBoot.prototype.initialize = function() {\n  PokiSDK.gameLoadingFinished();\n  this.app.on('gameplay:start', () => PokiSDK.gameplayStart());\n  this.app.on('gameplay:stop',  () => PokiSDK.gameplayStop());\n  this.app.on('ad:break', () => PokiSDK.commercialBreak().then(() => this.app.fire('ad:done')));\n};`) };

GUIDES["crazygames-playcanvas"] = { title: "CrazyGames SDK v3 — PlayCanvas", deadline: "SDK v3 required", deadlineColor: "#F39C12", intro: "PlayCanvas + CrazyGames SDK v3 via external script and lifecycle boot script.", steps: PC_BASE_STEP("CrazyGames", "crazygames-sdk", "https://sdk.crazygames.com/crazygames-sdk-v3.js", `var CGBoot = pc.createScript('cgBoot');\nCGBoot.prototype.initialize = function() {\n  CrazyGames.SDK.init().then(() => {\n    this.app.fire('cg:ready');\n    this.app.on('gameplay:start', () => CrazyGames.SDK.game.gameplayStart());\n    this.app.on('gameplay:stop',  () => CrazyGames.SDK.game.gameplayStop());\n  });\n};`) };

GUIDES["linkedin-playcanvas"] = { title: "LinkedIn Playables — PlayCanvas", deadline: "2MB limit, no network", deadlineColor: "#0A66C2", intro: "PlayCanvas for LinkedIn Playables — strip unused modules, disable all network calls, add MRAID clickthrough.", steps: [{ id:1, title:"Minimise PlayCanvas build for LinkedIn", free:true, description:"Disable all unused engine modules and compress all textures.", preview:"Disable unused modules, enable texture compression, target < 2MB", code:`// PlayCanvas Project Settings → Engine Modules:\n// Disable everything not used: Physics, Particles, Animation (if not needed)\n// Use only DXT textures (no PNG fallbacks for LinkedIn)\n// Target: < 2MB total`, language:"text" }, { id:2, title:"MRAID clickthrough + no-network enforcement", free:false, description:"Replace all fetch/XHR with localStorage and add MRAID CTA handler.", file:"PlayCanvas Editor — create a Script asset named 'cta.js'", where:"Create this script in PlayCanvas and attach it to your CTA button entity. Set the ctaUrl attribute in the Editor inspector.", insertAfter:`// PlayCanvas Editor:\n// 1. Assets → + → Script → name it "cta.js"\n// 2. Drag it onto your CTA Button entity\n// 3. Set the ctaUrl attribute in the Inspector panel\n// ↓ paste the full script below`, preview:"// MRAID + localStorage — unlock to see", code:`// In your CTA script:\nvar CTA = pc.createScript('cta');\nCTA.attributes.add('ctaUrl', { type: 'string' });\nCTA.prototype.onClick = function() {\n  if (window.mraid) { window.mraid.open(this.ctaUrl); }\n  else { window.open(this.ctaUrl, '_blank'); }\n};`, language:"js" }] };

// ─── UNREAL ───────────────────────────────────────────────────────────────────

const UNREAL_GUIDE = (platformName, platformColor, extraSteps = []) => ({
  title: `Unreal Engine HTML5 — ${platformName}`,
  deadline: "Large bundle — compliance scan recommended",
  deadlineColor: "#FF6B00",
  intro: `Unreal HTML5 exports (Pixel Streaming or legacy HTML5 plugin) produce very large bundles. Run the free compliance scan first to get a full size report — then consider our compliance package to reduce bundle size for ${platformName} deployment.`,
  steps: [
    {
      id: 1, title: "Run the compliance scan first", free: true,
      description: "Before implementing the SDK, get a full size and compliance report for your Unreal build.",
      preview: "→ /sept30-risk-assessor",
      code: `// Step 1: Run the free compliance scan at:\n// https://html5studio.app/sept30-risk-assessor\n//\n// The scan will report:\n// - Current bundle size estimate\n// - Platform-specific size compliance status\n// - Which assets are causing bloat\n// - Whether our Compliance Package can help\n//\n// Our Compliance Package optimises Unreal HTML5 builds\n// for platform-specific size limits.`,
      language: "text",
    },
    {
      id: 2, title: `Add ${platformName} SDK to UE HTML5 export template`, free: false,
      description: `Modify the Unreal HTML5 export template to inject the ${platformName} SDK before the engine loads.`,
      preview: `// UE HTML5 template SDK injection — unlock to see`,
      code: `// Engine/Build/HTML5/Build.html (or your custom template):\n// Add SDK script before the Emscripten loader:\n// <script src="[PLATFORM_SDK_URL]"></script>\n//\n// Then wire lifecycle calls via UE's JavascriptPlugin\n// or a custom HTML5 platform layer.`,
      language: "html",
    },
    ...extraSteps,
  ],
});

["meta","tiktok","discord","youtube","poki","crazygames","linkedin"].forEach(pid => {
  const names = { meta:"Meta Instant Games", tiktok:"TikTok Mini Games", discord:"Discord Activities", youtube:"YouTube Playables", poki:"Poki", crazygames:"CrazyGames", linkedin:"LinkedIn Playables" };
  const colors = { meta:"#EE1D52", tiktok:"#FF6B00", discord:"#5865F2", youtube:"#FF0000", poki:"#00C896", crazygames:"#F39C12", linkedin:"#0A66C2" };
  GUIDES[`${pid}-unreal`] = UNREAL_GUIDE(names[pid], colors[pid]);
});

// ─── COMPLIANCE STEP FACTORIES ────────────────────────────────────────────────

// EU DMA Article 7 / GDPR TCF 2.0 consent step — per platform SDK
const EU_CONSENT_STEPS = {
  poki: {
    id: 99, title: "EU DMA Art. 7 — GDPR consent gate (Poki)", free: false,
    description: "Poki serves EU users at scale. You must check PokiSDK consent signals and gate personalised ads accordingly — required under EU DMA Article 7 / TCF 2.0.",
    file: "src/ads.js  (or wherever you call PokiSDK.commercialBreak())",
    where: "Wrap your existing commercialBreak() call — check consent BEFORE requesting any personalised ad",
    insertAfter: `// Find your existing ad call — it will look like:\nawait PokiSDK.commercialBreak();\n// ↓ replace with the consent-gated version below`,
    preview: "// PokiSDK.getConsent() → gate personalised ads — unlock to see",
    code: `// GDPR / EU DMA Art. 7 — Poki consent gate\n// Poki's SDK exposes a consent object you must respect:\nasync function runAdWithConsent() {\n  const consent = PokiSDK.getConsent();\n  // consent.personalizedAds: true/false (TCF 2.0 signal from Poki's CMP)\n  if (consent?.personalizedAds === false) {\n    // User is in EU and has denied personalised ads\n    // You may still show contextual ads — do NOT pass user IDs\n    console.log('[Consent] Personalised ads denied — showing contextual only');\n  }\n  // commercialBreak() respects the consent signal internally\n  // but you must NOT pass user data to any 3rd party ad SDK yourself\n  await PokiSDK.commercialBreak();\n}\n\n// ✅ Checklist:\n// ✅ Never pass player.id or player email to ad networks without consent\n// ✅ PokiSDK.getConsent() called before any ad or analytics call\n// ✅ Tested with a VPN set to Germany/France to verify CMP fires`,
    language: "js",
  },
  crazygames: {
    id: 99, title: "EU DMA Art. 7 — GDPR consent gate (CrazyGames)", free: false,
    description: "CrazyGames SDK v3 exposes a consent API you must call before personalised ads or analytics — required for EU users under DMA Article 7.",
    file: "src/ads.js  (or wherever you call CrazyGames.SDK.ad.requestAd())",
    where: "Add this consent check BEFORE any ad request and before initialising any analytics SDK",
    insertAfter: `// Find your existing ad call:\nawait CrazyGames.SDK.ad.requestAd('midgame', { ... });\n// ↓ replace with the consent-gated version below`,
    preview: "// CrazyGames.SDK.user.isAdPersonalizationConsented() — unlock to see",
    code: `// GDPR / EU DMA Art. 7 — CrazyGames consent gate\nasync function requestAdWithConsent() {\n  const consented = await CrazyGames.SDK.user.isAdPersonalizationConsented();\n  // consented: true = EU user gave consent, false = denied or not applicable\n  if (!consented) {\n    // Show non-personalised ad OR skip the ad entirely\n    // Do NOT initialise Google Analytics / Amplitude / etc. without consent\n    console.log('[Consent] EU user — personalised ads blocked');\n  }\n  CrazyGames.SDK.game.gameplayStop();\n  await new Promise(resolve => {\n    CrazyGames.SDK.ad.requestAd('midgame', {\n      adFinished: resolve,\n      adError: resolve,\n    });\n  });\n  CrazyGames.SDK.game.gameplayStart();\n}\n\n// ✅ Checklist:\n// ✅ isAdPersonalizationConsented() called on game load\n// ✅ Analytics SDKs not initialised before consent received\n// ✅ Consent state stored and re-checked on session resume`,
    language: "js",
  },
  meta: {
    id: 98, title: "EU DMA Art. 7 — GDPR consent before data requests", free: false,
    description: "Meta's SDK v8.0 zero-permissions model is partly GDPR-compliant but you still need to gate any analytics or third-party data collection behind an explicit consent check for EU users.",
    file: "src/consent.js  (new file — import and call checkEUConsent() before any analytics init)",
    where: "Call checkEUConsent() at the very start of your game boot, AFTER FBInstant.startGameAsync() resolves",
    insertAfter: `// After your FBInstant.startGameAsync() chain:\n.then(() => {\n  // ↓ add consent check here, before any analytics or player data calls\n})`,
    preview: "// EU consent gate for Meta — unlock to see",
    code: `// consent.js — EU user detection + consent gate\nexport async function checkEUConsent() {\n  // Meta does not provide a TCF signal — use locale as a proxy\n  const locale = FBInstant.getLocale(); // e.g. 'de_DE', 'fr_FR'\n  const euLocales = ['de_','fr_','nl_','it_','es_','pl_','pt_','sv_','da_','fi_','nb_','cs_','ro_','hu_','bg_','hr_','sk_','sl_','lt_','lv_','et_','el_','mt_'];\n  const isEU = euLocales.some(l => locale.startsWith(l));\n  if (isEU) {\n    // Do NOT initialise: Google Analytics, Amplitude, Mixpanel, Firebase Analytics\n    // until you have shown your own consent banner and recorded acceptance\n    window._euUser = true;\n    console.log('[Consent] EU user detected — analytics gated');\n  }\n  return isEU;\n}\n\n// Usage in your boot flow:\n// const isEU = await checkEUConsent();\n// if (!isEU) initAnalytics(); // safe to init for non-EU`,
    language: "js",
  },
  tiktok: {
    id: 98, title: "EU DMA Art. 7 — GDPR consent gate (TikTok)", free: false,
    description: "TikTok Mini Games reach EU users via the TikTok app. You must not fire analytics or personalised ads without consent for EU-region users.",
    file: "src/consent.js  (new file)",
    where: "Call after tt.login() resolves, before any analytics SDK init",
    insertAfter: `// After tt.login() resolves in your boot() function:\n// ↓ add consent check here`,
    preview: "// TikTok EU consent gate — unlock to see",
    code: `// consent.js — TikTok EU consent gate\nexport async function checkTikTokEUConsent() {\n  return new Promise((resolve) => {\n    tt.getUserInfo({\n      success: (res) => {\n        // TikTok doesn't expose region directly — use timezone as proxy\n        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;\n        const euTZ = tz.startsWith('Europe/');\n        if (euTZ) {\n          window._euUser = true;\n          // Gate all analytics SDKs — do not call tt.getUniqueId() for ad targeting\n        }\n        resolve(euTZ);\n      },\n      fail: () => resolve(false),\n    });\n  });\n}\n\n// ✅ Checklist:\n// ✅ No third-party analytics fired before consent for EU timezone users\n// ✅ tt.getUniqueId() NOT passed to ad networks without consent\n// ✅ Privacy policy URL set in TikTok Developer Portal`,
    language: "js",
  },
};

// COPPA age-gate step — for Meta and TikTok
const COPPA_STEP = (platform) => ({
  id: 97, title: `COPPA age-gate — protect under-13 users (${platform})`, free: false,
  description: `${platform} policies and US COPPA law prohibit collecting data from users under 13. You must implement an age gate OR configure your app as child-directed, which disables all personalised ads and data collection.`,
  file: "src/ageGate.js  (new file — call before any SDK data collection)",
  where: "Call showAgeGate() on first launch, before FBInstant or TikTok SDK user data calls. Store the result in localStorage so it only shows once.",
  insertAfter: `// In your main boot sequence — call BEFORE any player data requests:\n// await showAgeGate();\n// ↓ paste the full file below`,
  preview: `// COPPA age gate for ${platform} — unlock to see`,
  code: `// ageGate.js\n// For ${platform}: if you target general audiences you MUST implement this.\n// Alternative: mark app as child-directed in Developer Portal (disables all ads).\n\nexport function showAgeGate() {\n  return new Promise((resolve) => {\n    const stored = localStorage.getItem('ageVerified');\n    if (stored) return resolve(stored === 'adult');\n\n    // Create a minimal age gate overlay\n    const overlay = document.createElement('div');\n    overlay.style.cssText = 'position:fixed;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;color:#fff;font-family:sans-serif;text-align:center;padding:24px';\n    overlay.innerHTML = \`\n      <h2 style="font-size:22px;margin-bottom:12px">Age Verification</h2>\n      <p style="margin-bottom:24px;opacity:0.7">You must be 13 or older to play.<br>Are you 13 years of age or older?</p>\n      <div style="display:flex;gap:16px">\n        <button id="ag-yes" style="padding:12px 32px;background:#1e6ff0;border:none;border-radius:8px;color:#fff;font-size:16px;cursor:pointer">Yes, I am 13+</button>\n        <button id="ag-no"  style="padding:12px 32px;background:#333;border:none;border-radius:8px;color:#fff;font-size:16px;cursor:pointer">No</button>\n      </div>\n    \`;\n    document.body.appendChild(overlay);\n\n    document.getElementById('ag-yes').onclick = () => {\n      localStorage.setItem('ageVerified', 'adult');\n      overlay.remove();\n      resolve(true);\n    };\n    document.getElementById('ag-no').onclick = () => {\n      localStorage.setItem('ageVerified', 'child');\n      // Block the game — show a friendly message\n      overlay.innerHTML = '<p style="font-size:18px">Sorry, this game is not available for users under 13.</p>';\n      resolve(false);\n    };\n  });\n}\n\n// ✅ Checklist:\n// ✅ Age gate shown on first launch only (localStorage flag)\n// ✅ If user selects "No": game does not load, no data collected\n// ✅ App marked child-directed in Developer Portal if targeting kids\n// ✅ No IDFA / advertising ID collected for under-13 users`,
  language: "js",
});

// Discord CSP headers step
const DISCORD_CSP_STEP = (engine) => ({
  id: 96, title: "Discord CSP headers — fix silent WebGL/script failures", free: false,
  description: "Discord Activities enforces Content Security Policy. Missing CSP headers silently block WebGL contexts, external scripts, and WebSocket connections — the game loads but nothing works.",
  file: engine === "unity" ? "Assets/WebGLTemplates/YourTemplate/index.html" : engine === "phaser" ? "vite.config.js  (or your server config)" : "Your server config or build template",
  where: engine === "unity"
    ? "Add this <meta> tag inside <head>, as the FIRST element after the opening <head> tag"
    : engine === "phaser"
    ? "Add the headers() function to your Vite dev server config AND your hosting server config"
    : "Add to your production server config",
    insertAfter: engine === "unity"
    ? `<head>\n  <!-- ↓ ADD CSP meta tag as the VERY FIRST element in <head> -->`
    : `// vite.config.js:\nexport default {\n  server: {\n    // ↓ add headers here\n  }\n}`,
  preview: "// Discord CSP headers — unlock to see",
  code: `// Discord Activities requires these CSP directives.\n// Without them: WebGL fails silently, no error shown.\n\n${engine === "unity" ? `<!-- Unity WebGL Template — add as FIRST element in <head> -->\n<meta http-equiv="Content-Security-Policy" content="\n  default-src 'self' https://discord.com https://*.discord.com;\n  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com;\n  style-src 'self' 'unsafe-inline';\n  img-src 'self' data: blob: https://*.discord.com https://cdn.discordapp.com;\n  connect-src 'self' wss://*.discord.com https://*.discord.com;\n  worker-src blob:;\n  child-src blob:;\n">` : engine === "phaser" ? `// vite.config.js\nexport default {\n  server: {\n    headers: {\n      'Content-Security-Policy': [\n        "default-src 'self' https://discord.com https://*.discord.com",\n        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",\n        "style-src 'self' 'unsafe-inline'",\n        "img-src 'self' data: blob: https://*.discord.com https://cdn.discordapp.com",\n        "connect-src 'self' wss://*.discord.com https://*.discord.com",\n        "worker-src blob:",\n      ].join('; ')\n    }\n  }\n}\n\n// Also add to your production server (nginx example):\n// add_header Content-Security-Policy "default-src 'self' https://discord.com ...";` : `// Add to your server config (nginx):\n// add_header Content-Security-Policy "\n//   default-src 'self' https://discord.com https://*.discord.com;\n//   script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com;\n//   connect-src 'self' wss://*.discord.com https://*.discord.com;\n//   worker-src blob:;\n// ";`}\n\n// ✅ Checklist:\n// ✅ Test in Discord sandbox — open DevTools → Console for CSP violation errors\n// ✅ wss://* required for Discord Gateway WebSocket\n// ✅ blob: worker-src required for WebGL shader compilation\n// ✅ Remove 'unsafe-eval' if you don't use it (tightens security)`,
  language: engine === "unity" ? "html" : "js",
});

// ─── INJECT COMPLIANCE STEPS ──────────────────────────────────────────────────

// EU Consent — Poki all engines
["poki-unity","poki-phaser","poki-godot","poki-construct","poki-cocos","poki-playcanvas","poki-unreal"].forEach(key => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...EU_CONSENT_STEPS.poki, id: GUIDES[key].steps.length + 1 });
});

// EU Consent — CrazyGames all engines
["crazygames-unity","crazygames-phaser","crazygames-godot","crazygames-construct","crazygames-cocos","crazygames-playcanvas","crazygames-unreal"].forEach(key => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...EU_CONSENT_STEPS.crazygames, id: GUIDES[key].steps.length + 1 });
});

// EU Consent — Meta all engines
["meta-unity","meta-phaser","meta-godot","meta-construct","meta-playcanvas","meta-unreal"].forEach(key => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...EU_CONSENT_STEPS.meta, id: GUIDES[key].steps.length + 1 });
});

// EU Consent — TikTok all engines
["tiktok-unity","tiktok-phaser","tiktok-godot","tiktok-construct","tiktok-cocos","tiktok-playcanvas","tiktok-unreal"].forEach(key => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...EU_CONSENT_STEPS.tiktok, id: GUIDES[key].steps.length + 1 });
});

// COPPA — Meta all engines
["meta-unity","meta-phaser","meta-godot","meta-construct","meta-playcanvas","meta-unreal"].forEach(key => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...COPPA_STEP("Meta Instant Games"), id: GUIDES[key].steps.length + 1 });
});

// COPPA — TikTok all engines
["tiktok-unity","tiktok-phaser","tiktok-godot","tiktok-construct","tiktok-cocos","tiktok-playcanvas","tiktok-unreal"].forEach(key => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...COPPA_STEP("TikTok Mini Games"), id: GUIDES[key].steps.length + 1 });
});

// COPPA — YouTube (child content is a major YT policy issue)
["youtube-unity","youtube-phaser","youtube-godot","youtube-construct","youtube-cocos","youtube-playcanvas","youtube-unreal"].forEach(key => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...COPPA_STEP("YouTube Playables"), id: GUIDES[key].steps.length + 1 });
});

// Discord CSP — all Discord engines
const discordEngineMap = { "discord-unity":"unity", "discord-phaser":"phaser", "discord-godot":"godot", "discord-construct":"construct", "discord-cocos":"cocos", "discord-playcanvas":"playcanvas", "discord-unreal":"unreal" };
Object.entries(discordEngineMap).forEach(([key, engine]) => {
  if (GUIDES[key]) GUIDES[key].steps.push({ ...DISCORD_CSP_STEP(engine), id: GUIDES[key].steps.length + 1 });
});

export function getGuide(platformId, engineId) {
  return GUIDES[`${platformId}-${engineId}`] || null;
}