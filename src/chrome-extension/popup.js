/* eslint-disable no-undef */
// HTML5STUDIO Chrome Extension — Popup Script
// Self-contained: no framework dependencies

const PLATFORMS = [
  { id:"meta",       name:"Meta Instant Games",  icon:"📘", sub:"Facebook / Messenger",     urgency:"SEPT 30 DEADLINE", urgencyColor:"#EE1D52", matchUrl:["developers.facebook.com"] },
  { id:"tiktok",     name:"TikTok Mini Games",   icon:"🎵", sub:"TikTok GameDev Platform",  urgency:"TOUCH-ACTION BUG",  urgencyColor:"#FF6B00", matchUrl:["developers.tiktok.com"] },
  { id:"discord",    name:"Discord Activities",  icon:"🎮", sub:"Discord GameSDK",          urgency:"SCOPE SPLIT LIVE",  urgencyColor:"#5865F2", matchUrl:["discord.com/developers"] },
  { id:"youtube",    name:"YouTube Playables",   icon:"▶️", sub:"YouTube GamesDev",         urgency:"15MB LIMIT",        urgencyColor:"#FF0000", matchUrl:["developers.google.com/youtube"] },
  { id:"poki",       name:"Poki",                icon:"🟢", sub:"Poki Developer Platform",  urgency:"SDK REQUIRED",      urgencyColor:"#00C896", matchUrl:["poki.com/en/developers"] },
  { id:"crazygames", name:"CrazyGames",          icon:"🎯", sub:"CrazyGames SDK",           urgency:"SDK v3 MIGRATION",  urgencyColor:"#F39C12", matchUrl:["developer.crazygames.com"] },
  { id:"linkedin",   name:"LinkedIn Playables",  icon:"💼", sub:"LinkedIn B2B Gaming",      urgency:"NEW PLATFORM",      urgencyColor:"#0A66C2", matchUrl:["business.linkedin.com"] },
];

const ENGINES = {
  meta:       [{id:"unity",name:"Unity WebGL",icon:"🎮"},{id:"phaser",name:"Phaser 3",icon:"⚡"},{id:"godot",name:"Godot 4",icon:"🔷"},{id:"construct",name:"Construct 3",icon:"🧱"},{id:"playcanvas",name:"PlayCanvas",icon:"🌐"},{id:"unreal",name:"Unreal Engine",icon:"⚙️"}],
  tiktok:     [{id:"unity",name:"Unity WebGL",icon:"🎮"},{id:"phaser",name:"Phaser 3",icon:"⚡"},{id:"godot",name:"Godot 4",icon:"🔷"},{id:"construct",name:"Construct 3",icon:"🧱"},{id:"cocos",name:"Cocos Creator",icon:"🥥"},{id:"playcanvas",name:"PlayCanvas",icon:"🌐"},{id:"unreal",name:"Unreal Engine",icon:"⚙️"}],
  discord:    [{id:"unity",name:"Unity WebGL",icon:"🎮"},{id:"phaser",name:"Phaser 3",icon:"⚡"},{id:"godot",name:"Godot 4",icon:"🔷"},{id:"construct",name:"Construct 3",icon:"🧱"},{id:"cocos",name:"Cocos Creator",icon:"🥥"},{id:"playcanvas",name:"PlayCanvas",icon:"🌐"},{id:"unreal",name:"Unreal Engine",icon:"⚙️"}],
  youtube:    [{id:"unity",name:"Unity WebGL",icon:"🎮"},{id:"phaser",name:"Phaser 3",icon:"⚡"},{id:"godot",name:"Godot 4",icon:"🔷"},{id:"construct",name:"Construct 3",icon:"🧱"},{id:"cocos",name:"Cocos Creator",icon:"🥥"},{id:"playcanvas",name:"PlayCanvas",icon:"🌐"},{id:"unreal",name:"Unreal Engine",icon:"⚙️"}],
  poki:       [{id:"unity",name:"Unity WebGL",icon:"🎮"},{id:"phaser",name:"Phaser 3",icon:"⚡"},{id:"godot",name:"Godot 4",icon:"🔷"},{id:"construct",name:"Construct 3",icon:"🧱"},{id:"cocos",name:"Cocos Creator",icon:"🥥"},{id:"playcanvas",name:"PlayCanvas",icon:"🌐"},{id:"unreal",name:"Unreal Engine",icon:"⚙️"}],
  crazygames: [{id:"unity",name:"Unity WebGL",icon:"🎮"},{id:"phaser",name:"Phaser 3",icon:"⚡"},{id:"godot",name:"Godot 4",icon:"🔷"},{id:"construct",name:"Construct 3",icon:"🧱"},{id:"cocos",name:"Cocos Creator",icon:"🥥"},{id:"playcanvas",name:"PlayCanvas",icon:"🌐"},{id:"unreal",name:"Unreal Engine",icon:"⚙️"}],
  linkedin:   [{id:"unity",name:"Unity WebGL",icon:"🎮"},{id:"phaser",name:"Phaser 3",icon:"⚡"},{id:"godot",name:"Godot 4",icon:"🔷"},{id:"construct",name:"Construct 3",icon:"🧱"},{id:"playcanvas",name:"PlayCanvas",icon:"🌐"},{id:"unreal",name:"Unreal Engine",icon:"⚙️"}],
};

// Minimal guide content (free steps only — locked steps redirect to full app)
const GUIDES = {
  "meta-unity": {
    title:"Meta Instant Games SDK v8.0 — Unity WebGL", deadline:"Sept 30, 2026", deadlineColor:"#EE1D52",
    intro:"Move from passive to zero-permissions model. Legacy builds rejected after Sept 30.",
    steps:[
      {id:1,title:"Update SDK script tag",free:true,desc:"Replace the legacy SDK loader in your Unity WebGL index.html template.",code:'<!-- REMOVE old -->\n<!-- <script src="fbinstant.6.3.js"></script> -->\n\n<!-- ADD new -->\n<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>',lang:"html"},
      {id:2,title:"Zero-permissions init",free:true,desc:"SDK v8.0 no longer passes player data during init. Request permissions explicitly after startGameAsync.",code:"FBInstant.initializeAsync()\n  .then(() => FBInstant.startGameAsync())\n  .then(() => FBInstant.player.requestPermissionsAsync(['PROFILE']))\n  .then(granted => {\n    const name = granted.includes('PROFILE')\n      ? FBInstant.player.getName()\n      : 'Player';\n  });",lang:"js"},
      {id:3,title:"Unity jslib bridge update",free:false,desc:"Your Unity jslib bridge needs updating to handle async permission responses."},
      {id:4,title:"Null-safe C# FBManager",free:false,desc:"The MonoBehaviour that handles SDK callbacks with null-safe player data."},
      {id:5,title:"Zero-permission test checklist",free:false,desc:"Before submitting, test with all permissions denied."},
    ]
  },
  "meta-phaser": {
    title:"Meta Instant Games SDK v8.0 — Phaser 3", deadline:"Sept 30, 2026", deadlineColor:"#EE1D52",
    intro:"Phaser 3 has the cleanest migration path. Direct JS — no bridge layer needed.",
    steps:[
      {id:1,title:"Update SDK script tag",free:true,desc:"Update your index.html to load the v8.0 SDK.",code:'<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>',lang:"html"},
      {id:2,title:"Init before Phaser boot",free:true,desc:"Run the SDK init flow before creating your Phaser.Game instance.",code:"FBInstant.initializeAsync()\n  .then(() => { FBInstant.setLoadingProgress(10); return FBInstant.startGameAsync(); })\n  .then(() => { new Phaser.Game(config); });",lang:"js"},
      {id:3,title:"Scene-level permission request",free:false,desc:"Request permissions inside your first scene after player engagement."},
      {id:4,title:"Null-safe leaderboard calls",free:false,desc:"Leaderboard display names require PROFILE permission in v8.0."},
    ]
  },
  "tiktok-unity": {
    title:"TikTok Mini Games — Unity WebGL", deadline:"Active (ongoing)", deadlineColor:"#FF6B00",
    intro:"Unity WebGL games fail with swipe-to-exit issues. Quick CSS fix required plus SDK bridge.",
    steps:[
      {id:1,title:"Fix touch-action CSS",free:true,desc:"Add touch-action: none to your Unity canvas.",code:"/* Unity WebGL template style.css */\n#unity-canvas, #unity-container {\n  touch-action: none;\n  -webkit-touch-callout: none;\n  user-select: none;\n}",lang:"css"},
      {id:2,title:"Add TikTok SDK loader",free:true,desc:"Include the TikTok Games SDK in your Unity WebGL template.",code:'<script src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tt_games_sdk/tt_games_sdk.js"></script>',lang:"html"},
      {id:3,title:"Unity jslib TikTok bridge",free:false,desc:"Full jslib plugin bridging Unity C# to the TikTok Games SDK."},
      {id:4,title:"C# TikTok Manager",free:false,desc:"MonoBehaviour handling all TikTok SDK events with editor fallback."},
    ]
  },
  "tiktok-phaser": {
    title:"TikTok Mini Games — Phaser 3", deadline:"Active", deadlineColor:"#FF6B00",
    intro:"Fix touch-action, wire the SDK before Phaser boots, add rewarded ads.",
    steps:[
      {id:1,title:"Fix touch-action CSS",free:true,desc:"Required CSS to prevent TikTok's gesture layer from intercepting input.",code:"<style>\n  canvas, body { touch-action: none; margin: 0; overflow: hidden; }\n</style>",lang:"html"},
      {id:2,title:"SDK init before Phaser boot",free:true,desc:"Load and init TikTok SDK before creating your Phaser.Game instance.",code:"async function boot() {\n  const ready = await new Promise(r => tt.isGameSDKReady((e,ok) => r(!e && ok)));\n  if (ready) await new Promise(r => tt.login({ success: r, fail: () => r() }));\n  new Phaser.Game(config);\n}\nboot();",lang:"js"},
      {id:3,title:"Rewarded ad helper",free:false,desc:"Reusable rewarded ad function for use in any Phaser scene."},
    ]
  },
  "discord-unity": {
    title:"Discord Activities — Unity WebGL", deadline:"Scope split enforced", deadlineColor:"#5865F2",
    intro:"Monolithic OAuth scope broken for new users. Must migrate to granular scopes.",
    steps:[
      {id:1,title:"Install Embedded App SDK",free:true,desc:"Load the Discord Embedded App SDK in your Unity WebGL template.",code:'<script src="https://unpkg.com/@discord/embedded-app-sdk@latest/output/index.js"></script>',lang:"html"},
      {id:2,title:"Granular OAuth scope migration",free:true,desc:"Update OAuth scopes in the Discord Developer Portal and SDK init.",code:"const sdk = new DiscordSDK('YOUR_CLIENT_ID');\nawait sdk.ready();\nconst { code } = await sdk.commands.authorize({\n  client_id: 'YOUR_CLIENT_ID',\n  response_type: 'code',\n  state: '', prompt: 'none',\n  scope: ['identify', 'guilds.members.read'],\n});",lang:"js"},
      {id:3,title:"Unity jslib Discord bridge",free:false,desc:"Full jslib bridge for Unity C# to call Discord SDK commands."},
      {id:4,title:"Server-side token exchange",free:false,desc:"Your backend must exchange the auth code for a Discord access token."},
    ]
  },
  "youtube-unity": {
    title:"YouTube Playables — Unity WebGL", deadline:"15MB limit enforced", deadlineColor:"#FF0000",
    intro:"Unity builds are typically 20-50MB. Aggressive optimisation required for the 15MB cap.",
    steps:[
      {id:1,title:"Enable Brotli compression",free:true,desc:"Switch Unity WebGL compression to Brotli for maximum bundle reduction.",code:"// Unity Player Settings:\n// Publishing Settings → Compression Format → Brotli\n// Reduces bundle by ~20% vs gzip",lang:"text"},
      {id:2,title:"Enable managed code stripping",free:true,desc:"Strip unused code and remove unused assets.",code:"// Player Settings → Other → Managed Stripping Level: High\n// Player Settings → Other → IL2CPP Code Generation: Faster Runtime\n// Remove all unused textures, audio, shaders from Resources/",lang:"text"},
      {id:3,title:"Split textures and lazy-load",free:false,desc:"Externally host textures to keep initial bundle under 15MB."},
      {id:4,title:"YouTube manifest + submission",free:false,desc:"Correct manifest format for YouTube Playables ingestion."},
    ]
  },
  "poki-unity": {
    title:"Poki SDK — Unity WebGL", deadline:"SDK required", deadlineColor:"#00C896",
    intro:"All Poki games require the PokiSDK for lifecycle signals.",
    steps:[
      {id:1,title:"Add PokiSDK to Unity template",free:true,desc:"Inject the PokiSDK script into your Unity WebGL index.html.",code:'<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>',lang:"html"},
      {id:2,title:"PokiSDK lifecycle calls",free:true,desc:"Signal loading, gameplay start, and gameplay stop to Poki's platform.",code:"PokiSDK.gameLoadingFinished();\nPokiSDK.gameplayStart();\nPokiSDK.gameplayStop();",lang:"js"},
      {id:3,title:"Unity C# Poki lifecycle bridge",free:false,desc:"jslib + MonoBehaviour to call PokiSDK lifecycle from Unity C#."},
    ]
  },
  "crazygames-unity": {
    title:"CrazyGames SDK v3 — Unity WebGL", deadline:"SDK v3 required", deadlineColor:"#F39C12",
    intro:"SDK v3 changed the ad and gameplay hook API. Must update jslib bridge.",
    steps:[
      {id:1,title:"Load CrazyGames SDK v3",free:true,desc:"Update your Unity template to load the SDK v3 endpoint.",code:'<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>',lang:"html"},
      {id:2,title:"SDK init + gameplay hooks",free:true,desc:"CrazyGames SDK v3 requires explicit init and lifecycle signals.",code:"await CrazyGames.SDK.init();\nCrazyGames.SDK.game.gameplayStart();\n// on pause:\nCrazyGames.SDK.game.gameplayStop();",lang:"js"},
      {id:3,title:"Unity jslib CrazyGames bridge",free:false,desc:"Full jslib for Unity C# to call CrazyGames SDK v3 methods."},
    ]
  },
  "linkedin-unity": {
    title:"LinkedIn Playables — Unity WebGL", deadline:"2MB limit enforced", deadlineColor:"#0A66C2",
    intro:"2MB compressed bundle limit. Zero external network calls. MRAID required.",
    steps:[
      {id:1,title:"Aggressive size reduction",free:true,desc:"LinkedIn's 2MB limit requires extreme build optimisation.",code:"// Player Settings for LinkedIn:\n// ✅ Compression: Brotli\n// ✅ Managed Stripping Level: High\n// ✅ Strip Engine Code: enabled\n// Target: < 2MB compressed",lang:"text"},
      {id:2,title:"Remove all external network calls",free:true,desc:"LinkedIn blocks all fetch/XHR. Use localStorage only.",code:"// Use localStorage:\nlocalStorage.setItem('li_score', score.toString());\nconst prev = parseInt(localStorage.getItem('li_score') || '0');",lang:"js"},
      {id:3,title:"MRAID-compatible clickthrough",free:false,desc:"LinkedIn Playables require MRAID-standard clickthrough handling."},
    ]
  },
};

// State
let state = { step: "platform", platform: null, engine: null, guide: null, detectedPlatform: null, unlocked: false, unlockedTier: null, openSteps: {}, showRestore: false, restoreEmail: "", restoreStatus: null };

const SITE_URL = "https://html5studio.app/compliance-wizard";
const API_URL  = "https://api.base44.com/api/apps/69ba1abf2a0664e140df1370/entities/License/filter";

async function checkLicenseByEmail(email) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filter: { email: email.trim().toLowerCase(), is_active: true }, limit: 1 })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data && data.length > 0) ? data[0] : null;
}

function saveLicense(license) {
  chrome.storage.local.set({ license, unlocked: true });
  state.unlocked = true;
  state.unlockedTier = license.tier;
  state.showRestore = false;
  state.restoreStatus = null;
}

function getDetectedPlatform(url) {
  if (!url) return null;
  for (const p of PLATFORMS) {
    if (p.matchUrl.some(m => url.includes(m))) return p;
  }
  return null;
}

function getGuide(pid, eid) {
  return GUIDES[`${pid}-${eid}`] || null;
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1500);
  });
}

function renderHeader(detected) {
  return `
    <div class="header">
      <div class="header-logo">H5</div>
      <div>
        <div class="header-title">HTML5STUDIO</div>
        <div class="header-sub">Compliance Wizard v1.0</div>
      </div>
      <div class="header-detect ${detected ? 'detected' : 'not-detected'}">
        ${detected ? '● ' + detected.name.split(' ')[0] + ' detected' : '● No portal detected'}
      </div>
    </div>
    <div class="deadline-banner">
      <span class="deadline-dot"></span>
      Meta SDK v8.0 mandatory — Sept 30, 2026 deadline active
    </div>`;
}

function renderPlatformStep(detected) {
  const sortedPlatforms = detected
    ? [detected, ...PLATFORMS.filter(p => p.id !== detected.id)]
    : PLATFORMS;

  const items = sortedPlatforms.map(p => `
    <button class="platform-btn${detected && p.id === detected.id ? ' auto-detected' : ''}" data-pid="${p.id}">
      <div class="platform-icon">${p.icon}</div>
      <div class="platform-info">
        <div class="platform-name">${p.name}${detected && p.id === detected.id ? ' <span style="font-size:8px;color:#00ff88;font-family:monospace;">AUTO</span>' : ''}</div>
        <div class="platform-sub">${p.sub}</div>
      </div>
      <span class="urgency-tag" style="color:${p.urgencyColor};background:${p.urgencyColor}18;">${p.urgency}</span>
      <div class="platform-arrow">›</div>
    </button>`).join('');

  return `
    <div class="step-label">Step 1 of 3 — Select Platform</div>
    <div class="platform-list">${items}</div>`;
}

function renderEngineStep(platform) {
  const engines = ENGINES[platform.id] || [];
  const items = engines.map(e => `
    <button class="engine-btn" data-eid="${e.id}">
      <div class="engine-icon">${e.icon}</div>
      <div>
        <div class="engine-name">${e.name}</div>
      </div>
    </button>`).join('');

  return `
    <button class="back-btn" id="back-to-platform">← Back</button>
    <div class="step-label">Step 2 of 3 — Select Engine · <span style="color:#fff">${platform.name}</span></div>
    <div class="engine-grid">${items}</div>`;
}

function renderRestorePanel() {
  if (!state.showRestore) {
    return `<div class="restore-link"><button id="toggle-restore">Already purchased? Restore access →</button></div>`;
  }
  let statusHtml = '';
  if (state.restoreStatus === 'loading') statusHtml = `<div class="restore-status loading">Checking…</div>`;
  else if (state.restoreStatus === 'notfound') statusHtml = `<div class="restore-status error">No license found. <a href="mailto:support@html5studio.app">Contact support</a></div>`;
  else if (state.restoreStatus === 'error') statusHtml = `<div class="restore-status error">Network error — try again.</div>`;

  return `
    <div class="restore-panel">
      <div class="restore-title">Restore Access</div>
      <div class="restore-desc">Enter the email you used to purchase.</div>
      <div class="restore-row">
        <input id="restore-email" type="email" placeholder="your@email.com" value="${state.restoreEmail}" />
        <button id="restore-submit">Restore</button>
      </div>
      ${statusHtml}
      <button id="toggle-restore" class="restore-cancel">Cancel</button>
    </div>`;
}

function renderGuideStep(guide, platform, engine, unlocked) {
  if (!guide) {
    // Generic fallback for guides not in extension — redirect to site
    return `
      <button class="back-btn" id="back-to-engine">← Back</button>
      <div class="guide-container">
        <div class="guide-title">${platform.name} — ${engine.name}</div>
        <div class="guide-intro" style="margin-top:6px;">
          Full integration guide available on HTML5STUDIO. Includes SDK setup, lifecycle hooks, code snippets, and test checklists.
        </div>
        <div class="full-guide-cta" style="margin:12px 0 0;">
          <p>View the complete guide on HTML5STUDIO</p>
          <a href="${SITE_URL}?platform=${platform.id}&engine=${engine.id}" target="_blank">Open Full Guide →</a>
        </div>
      </div>`;
  }

  const stepsHtml = guide.steps.map(s => {
    const isOpen = state.openSteps[s.id];
    const bodyHtml = isOpen ? `
      <div class="step-body">
        <div class="step-desc">${s.desc}</div>
        ${s.free && s.code ? `
          <div class="code-block" id="code-${s.id}"><button class="copy-btn" data-code="${s.id}">Copy</button>${escapeHtml(s.code)}</div>
        ` : !s.free ? `
          <div class="paywall">
            <div class="paywall-title">🔒 Full Implementation Code</div>
            <div class="paywall-price">Unlock all guides — <s>$49</s> <strong>$17</strong></div>
            <a class="unlock-btn" href="${SITE_URL}?unlock=1&platform=${platform.id}&engine=${engine.id}" target="_blank">Unlock Full Guide →</a>
          </div>
        ` : ''}
      </div>` : '';

    return `
      <div class="step-card">
        <div class="step-header" data-sid="${s.id}">
          <div class="step-num ${s.free ? 'free' : 'locked'}">${s.id}</div>
          <div class="step-title">${s.title}</div>
          <span class="step-badge ${s.free ? 'free' : 'locked'}">${s.free ? 'FREE' : 'LOCKED'}</span>
          <span class="step-chevron">${isOpen ? '▾' : '›'}</span>
        </div>
        ${bodyHtml}
      </div>`;
  }).join('');

  return `
    ${unlocked ? `<div class="unlocked-badge">✓ Full guide unlocked</div>` : ''}
    <button class="back-btn" id="back-to-engine">← Back</button>
    <div class="guide-container">
      <div class="guide-title">${guide.title}</div>
      <div class="guide-deadline" style="background:${guide.deadlineColor}18;color:${guide.deadlineColor};">${guide.deadline}</div>
      <div class="guide-intro">${guide.intro}</div>
      ${stepsHtml}
    </div>
    <div class="full-guide-cta">
      <p>See full guide with deployment checklist on HTML5STUDIO</p>
      <a href="${SITE_URL}?platform=${platform.id}&engine=${engine.id}" target="_blank">Open Full Guide →</a>
    </div>
    ${!unlocked ? renderRestorePanel() : ''}`;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function render() {
  const root = document.getElementById('root');
  const detected = state.detectedPlatform;

  let content = renderHeader(detected);

  if (state.step === 'platform') {
    content += renderPlatformStep(detected);
  } else if (state.step === 'engine') {
    content += renderEngineStep(state.platform);
  } else if (state.step === 'guide') {
    content += renderGuideStep(state.guide, state.platform, state.engine, state.unlocked);
  }

  root.innerHTML = content;
  attachListeners();
}

function attachListeners() {
  // Platform selection
  document.querySelectorAll('[data-pid]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.pid;
      state.platform = PLATFORMS.find(p => p.id === pid);
      state.step = 'engine';
      state.openSteps = {};
      render();
    });
  });

  // Engine selection
  document.querySelectorAll('[data-eid]').forEach(btn => {
    btn.addEventListener('click', () => {
      const eid = btn.dataset.eid;
      const engines = ENGINES[state.platform.id] || [];
      state.engine = engines.find(e => e.id === eid);
      state.guide = getGuide(state.platform.id, eid);
      state.step = 'guide';
      state.openSteps = {};
      render();
    });
  });

  // Back buttons
  const backToPlatform = document.getElementById('back-to-platform');
  if (backToPlatform) backToPlatform.addEventListener('click', () => { state.step = 'platform'; state.openSteps = {}; render(); });

  const backToEngine = document.getElementById('back-to-engine');
  if (backToEngine) backToEngine.addEventListener('click', () => { state.step = 'engine'; state.openSteps = {}; render(); });

  // Step toggles
  document.querySelectorAll('[data-sid]').forEach(el => {
    el.addEventListener('click', () => {
      const sid = parseInt(el.dataset.sid);
      state.openSteps[sid] = !state.openSteps[sid];
      render();
    });
  });

  // Restore toggle
  const toggleRestore = document.getElementById('toggle-restore');
  if (toggleRestore) {
    toggleRestore.addEventListener('click', () => {
      state.showRestore = !state.showRestore;
      state.restoreStatus = null;
      render();
    });
  }

  // Restore submit
  const restoreSubmit = document.getElementById('restore-submit');
  if (restoreSubmit) {
    restoreSubmit.addEventListener('click', async () => {
      const emailInput = document.getElementById('restore-email');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) return;
      state.restoreEmail = email;
      state.restoreStatus = 'loading';
      render();
      const license = await checkLicenseByEmail(email).catch(() => null);
      if (license) {
        saveLicense(license);
        render();
      } else {
        state.restoreStatus = license === null ? 'notfound' : 'error';
        render();
      }
    });
  }

  // Copy buttons
  document.querySelectorAll('[data-code]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sid = btn.dataset.code;
      const codeEl = document.getElementById(`code-${sid}`);
      if (codeEl) {
        const text = codeEl.textContent.replace('Copy', '').replace('Copied!', '').trim();
        copyToClipboard(text, btn);
      }
    });
  });
}

// Init — detect current tab's platform
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || '';
  state.detectedPlatform = getDetectedPlatform(url);

  // Restore state from storage
  chrome.storage.local.get(['unlocked', 'license'], (data) => {
    state.unlocked = data.unlocked || false;
    state.unlockedTier = data.license ? data.license.tier : null;
    render();
  });
});