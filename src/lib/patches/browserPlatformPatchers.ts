import JSZip from "jszip";

// Extracted from scripts directory
const ASSETS: Record<string, string> = {
    "fb-init-v8.js": `/** HTML5STUDIO Handshake Recovery v1.0 (Meta SDK v8.0) */\n(function() { window.FB_INSTANT_READY = false; var script = document.createElement('script'); script.src = "https://connect.facebook.net/en_US/fbinstant.8.0.js"; script.onload = function() { console.log("HTML5STUDIO: SDK v8.0 Loaded. Starting Handshake..."); FBInstant.initializeAsync().then(function() { window.FB_INSTANT_READY = true; console.log("HTML5STUDIO: Handshake Verified."); window.onUnityLoading = function(progress) { FBInstant.setLoadingProgress(progress * 100); }; }).catch(function(err) { console.error("HTML5STUDIO: Handshake Recovery Failed", err); }); }; document.head.appendChild(script); window.HTML5STUDIO_StartGame = function() { if (window.FB_INSTANT_READY) { FBInstant.startGameAsync().then(function() { console.log("HTML5STUDIO: Play Session Active."); }); } }; })();`,
    "discord-init-1.8.js": `/** HTML5STUDIO Discord Handshake Recovery v1.8 */\n(function () { window.DISCORD_READY = false; const discordSdk = window.discordSdk || (typeof window.DiscordSDK !== 'undefined' ? new window.DiscordSDK(window.__DISCORD_CLIENT_ID || "DEFAULT_ID") : null); if (!discordSdk) { console.error("HTML5STUDIO: Discord SDK not found."); return; } async function setup() { const timeout = setTimeout(() => { console.error("HTML5STUDIO: Discord Handshake Timeout - Recovering by reloading..."); location.reload(); }, 15000); try { await discordSdk.ready(); clearTimeout(timeout); window.DISCORD_READY = true; console.log("HTML5STUDIO: Discord Social SDK 1.8 Active."); } catch (e) { console.error("HTML5STUDIO: Discord Handshake Failed", e); clearTimeout(timeout); } } setup(); })();`,
    "tiktokBridge.js": `/** HTML5STUDIO TikTok Bridge */\n(function () { window.addEventListener('load', function () { console.log("HTML5STUDIO: Injecting TikTok UX Overrides"); const canvasContainers = document.querySelectorAll('canvas'); canvasContainers.forEach(canvas => { canvas.style.setProperty('touch-action', 'none', 'important'); }); document.body.style.paddingTop = 'env(safe-area-inset-top)'; if (typeof tt !== 'undefined') { if (tt.onShow) { tt.onShow(() => console.log("HTML5STUDIO: TikTok Session Foregrounded.")); } } else { console.log("HTML5STUDIO: Local TikTok Simulation"); } }); })();`,
    "linkedin-init.js": `/** HTML5STUDIO LinkedIn Native Security Bridge (Zero-PII) */\n(function () { console.log("HTML5STUDIO: LinkedIn Security Bridge Initialize (Zero-PII)"); const blockedDomains = ["google-analytics.com", "googletagmanager.com", "facebook.com/tr", "hotjar.com", "linkedin.com/px"]; function isBlockedUrl(url) { if (!url) return false; if (typeof url !== 'string') return false; const lowerUrl = url.toLowerCase(); for (let i = 0; i < blockedDomains.length; i++) { if (lowerUrl.includes(blockedDomains[i])) { return true; } } return false; } const originalFetch = window.fetch; window.fetch = async function (...args) { const url = args[0] && typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : ""); if (isBlockedUrl(url)) { console.warn("HTML5STUDIO: Security Bridge blocked outbound fetch payload to -> " + url); return new Response('{}', { status: 200, statusText: "OK (Blocked)" }); } return originalFetch.apply(this, args); }; const originalXHR = window.XMLHttpRequest; function CustomXHR() { const xhr = new originalXHR(); const originalOpen = xhr.open; xhr.open = function (method, url, ...rest) { this._interceptedUrl = url; if (isBlockedUrl(url)) { this._isBlocked = true; } return originalOpen.apply(this, [method, url, ...rest]); }; const originalSend = xhr.send; xhr.send = function (body) { if (this._isBlocked) { console.warn("HTML5STUDIO: Security Bridge blocked outbound XHR payload to -> " + this._interceptedUrl); Object.defineProperty(this, 'readyState', { value: 4, writable: false }); Object.defineProperty(this, 'status', { value: 200, writable: false }); Object.defineProperty(this, 'responseText', { value: '{}', writable: false }); if (this.onreadystatechange) { this.onreadystatechange(); } if (this.onload) { this.onload(); } return; } return originalSend.apply(this, [body]); }; return xhr; } window.XMLHttpRequest = CustomXHR; })();`,
    "telegram-init.js": `/** Telegram Web App Bridge */\n(function () { window.addEventListener("load", function () { if (window.Telegram && window.Telegram.WebApp) { console.log("[HTML5Studio] Telegram Web App SDK Detected. Calling ready()"); const tg = window.Telegram.WebApp; tg.ready(); if (!tg.isExpanded) { console.log("[HTML5Studio] Requesting Viewport Expansion"); tg.expand(); } const originalOpen = window.open; window.open = function (url, target, features) { if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) { console.log("[HTML5Studio] Intercepting window.open to tg.openLink:", url); tg.openLink(url); return null; } return originalOpen.apply(this, arguments); }; window.HTML5StudioTelegram = { purchaseStars: function (invoiceUrl) { console.log("[HTML5Studio] Unity invoked Telegram Stars Purchase:", invoiceUrl); tg.openInvoice(invoiceUrl, function (status) { console.log("[HTML5Studio] Telegram Stars Purchase Status:", status); }); } }; } else { console.warn("[HTML5Studio] Telegram Web App SDK not found on window!"); } }); })();`,
    "youtube-init.js": `/** HTML5STUDIO YouTube Playables Wrapper */\n(function () { window.YT_PLAYABLE_READY = false; let unityGameInstance = null; const originalCreateUnityInstance = window.createUnityInstance; if (originalCreateUnityInstance) { window.createUnityInstance = async function () { const instance = await originalCreateUnityInstance.apply(this, arguments); unityGameInstance = instance; return instance; }; } else { const findInstance = setInterval(() => { if (window.unityInstance || window.gameInstance) { unityGameInstance = window.unityInstance || window.gameInstance; clearInterval(findInstance); } }, 500); } if (typeof window.ytGame === 'undefined') { console.error("HTML5STUDIO: window.ytGame not found. Injecting script..."); var script = document.createElement('script'); script.src = "//www.youtube.com/iframe_api"; } async function setupYTSdk() { if (!window.ytGame) return setTimeout(setupYTSdk, 250); try { await window.ytGame.ready(); window.YT_PLAYABLE_READY = true; console.log("HTML5STUDIO: YouTube Playables SDK Active."); window.ytGame.sendScore = function (score) { } window.ytGame.gameReady(); window.ytGame.onPause(() => { if (unityGameInstance) { unityGameInstance.SendMessage('YTGameWrapper', 'OnYouTubePause'); } }); window.ytGame.onResume(() => { if (unityGameInstance) { unityGameInstance.SendMessage('YTGameWrapper', 'OnYouTubeResume'); } }); } catch (e) { console.error("HTML5STUDIO: YouTube Handshake Failed", e); } } setupYTSdk(); })();`,
    "universal-init.js": `/** universal-init.js */\n(function universalInit() { "use strict"; window.HTML5STUDIO = { env: { target: "OVERRIDE" } }; })();`
};

export async function applyPlatformPatchBrowser(platform: "META" | "DISCORD" | "TIKTOK" | "LINKEDIN" | "TELEGRAM" | "YOUTUBE", outZip: JSZip, prefix: string) {
    const indexHtmlPath = prefix ? `${prefix}index.html` : "index.html";
    const indexFile = outZip.file(indexHtmlPath);
    if (!indexFile) return false;

    let indexHtml = await indexFile.async("string");

    // 1. Injects Universal Init (stubbed briefly to prevent 404s if missing)
    if (!indexHtml.includes("universal-init.js")) {
        // Safe head injection
        const headMatch = indexHtml.match(/<head[^>]*>/i);
        if (headMatch && headMatch.index !== undefined) {
            indexHtml = indexHtml.slice(0, headMatch.index + headMatch[0].length) + "\\n" +
                `<script src="universal-init.js"></script>\\n` +
                indexHtml.slice(headMatch.index + headMatch[0].length);
        } else {
            indexHtml = `<script src="universal-init.js"></script>\\n` + indexHtml;
        }
        outZip.file(prefix ? `${prefix}universal-init.js` : "universal-init.js", ASSETS["universal-init.js"]);
    }

    // 2. Platform Specific logic
    if (platform === "META") {
        outZip.file(prefix ? `${prefix}fb-init-v8.js` : "fb-init-v8.js", ASSETS["fb-init-v8.js"]);

        // Strip PII loops explicitly in Build binaries (Light Regex)
        const entries = Object.keys(outZip.files).filter(k => k.startsWith(prefix ? `${prefix}Build/` : "Build/") && k.endsWith(".js"));
        for (const file of entries) {
            let data = await outZip.file(file)!.async("string");
            if (data.includes('.api("/me")')) {
                data = data.replace(/\.api\("\/me"\)/g, '.api("/NO_ME_PERM")');
                outZip.file(file, data);
            }
        }

        indexHtml = indexHtml.replace(/<head[^>]*>/i, `$&\\n<script src="fb-init-v8.js"></script>\\n`);
    }

    if (platform === "DISCORD") {
        outZip.file(prefix ? `${prefix}discord-init-1.8.js` : "discord-init-1.8.js", ASSETS["discord-init-1.8.js"]);
        indexHtml = indexHtml.replace(/<head[^>]*>/i, `$&\\n<script src="discord-init-1.8.js"></script>\\n`);
    }

    if (platform === "TIKTOK") {
        outZip.file(prefix ? `${prefix}tiktokBridge.js` : "tiktokBridge.js", ASSETS["tiktokBridge.js"]);
        indexHtml = indexHtml.replace(/<body>/i, `<body>\\n<script src="tiktokBridge.js"></script>\\n`);
        if (!indexHtml.includes("viewport-fit=cover")) {
            indexHtml = indexHtml.replace(/<meta name="viewport" content="[^"]*"/i, `$&, viewport-fit=cover"`);
        }
    }

    if (platform === "LINKEDIN") {
        outZip.file(prefix ? `${prefix}linkedin-init.js` : "linkedin-init.js", ASSETS["linkedin-init.js"]);
        indexHtml = indexHtml.replace(/<head[^>]*>/i, `$&\\n<script src="linkedin-init.js"></script>\\n`);
    }

    if (platform === "TELEGRAM") {
        outZip.file(prefix ? `${prefix}telegram-init.js` : "telegram-init.js", ASSETS["telegram-init.js"]);
        indexHtml = indexHtml.replace(/<head[^>]*>/i, `$&\\n<script src="https://telegram.org/js/telegram-web-app.js"></script>\\n<script src="telegram-init.js"></script>\\n`);
    }

    if (platform === "YOUTUBE") {
        outZip.file(prefix ? `${prefix}youtube-init.js` : "youtube-init.js", ASSETS["youtube-init.js"]);
        indexHtml = indexHtml.replace(/<head[^>]*>/i, `$&\\n<script src="youtube-init.js"></script>\\n`);
    }

    // Rewrite indexHtml back
    outZip.file(indexHtmlPath, indexHtml);
    return true;
}
