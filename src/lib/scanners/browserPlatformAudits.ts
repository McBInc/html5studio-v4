import JSZip from "jszip";

export async function runBrowserPlatformAudits(zip: JSZip, prefix: string) {
    const files = Object.keys(zip.files).filter(p => !zip.files[p].dir);
    const getFileString = async (path: string) => {
        const file = zip.file(path);
        return file ? await file.async("string") : null;
    };

    const audits: any = {};

    // 1. META
    const metaScore = {
        platform: "FACEBOOK",
        auditDate: new Date().toISOString(),
        score: 100,
        criticalFailures: [] as any[],
        monetizationReadiness: { cmpEligible: false, missingBridge: "MetaMonetization.jslib" },
        checks: { sdk_v8: false, zero_perm: false }
    };
    const indexHtmlPath = prefix ? `${prefix}index.html` : "index.html";
    const indexHtml = await getFileString(indexHtmlPath) || "";
    if (indexHtml.includes("fbinstant.8.0.js")) {
        metaScore.checks.sdk_v8 = true;
    } else {
        metaScore.criticalFailures.push({ id: "SDK_VERSION", description: "Detected outdated SDK. Meta mandate requires v8.0.", sunsetRisk: "TERMINAL" });
        metaScore.score -= 40;
    }
    if (indexHtml.includes(".api(\"/me\")") || indexHtml.includes("user_friends")) {
        metaScore.criticalFailures.push({ id: "PII_LEAK", description: "Legacy Facebook PII calls detected in index.html.", sunsetRisk: "HIGH" });
        metaScore.score -= 40;
    }
    // Deep scan build folder for Meta
    const buildFiles = files.filter(p => p.startsWith(prefix ? `${prefix}Build/` : "Build/"));
    for (const bf of buildFiles) {
        if (bf.endsWith(".js") || bf.endsWith(".data") || bf.endsWith(".wasm")) {
            const data = await getFileString(bf) || "";
            if (data.includes(".api(\"/me\")") || data.includes("user_friends")) {
                if (!metaScore.criticalFailures.some(f => f.id === "PII_LEAK")) {
                    metaScore.criticalFailures.push({ id: "PII_LEAK", description: `Legacy Facebook PII calls detected in ${bf}.`, sunsetRisk: "HIGH" });
                    metaScore.score -= 40;
                }
                break;
            }
        }
    }
    const fbappConfigPath = prefix ? `${prefix}fbapp-config.json` : "fbapp-config.json";
    const fbappConfig = await getFileString(fbappConfigPath);
    if (fbappConfig) {
        try {
            const obj = JSON.parse(fbappConfig);
            if (obj.connection_experience === "network_enabled_zero_permissions" || obj.connection_experience === "zero_permissions") {
                metaScore.checks.zero_perm = true;
            } else {
                metaScore.criticalFailures.push({ id: "SCOPES", description: "fbapp-config requests invasive scopes", sunsetRisk: "TERMINAL" });
                metaScore.score -= 20;
            }
        } catch (e) { }
    } else {
        metaScore.criticalFailures.push({ id: "MISSING_CONFIG", description: "Missing fbapp-config.json for zero_permissions.", sunsetRisk: "TERMINAL" });
        metaScore.score -= 20;
    }
    audits.meta = metaScore;

    // 2. DISCORD
    const discordScore = { platform: "DISCORD", auditDate: new Date().toISOString(), score: 100, criticalFailures: [] as any[] };
    if (!indexHtml.includes("discord.com/assets/")) {
        discordScore.criticalFailures.push({ id: "DISCORD_SDK_MISSING", description: "Missing Discord embedded Activities SDK." });
        discordScore.score -= 50;
    }
    for (const bf of buildFiles) {
        if (bf.endsWith(".js") || bf.endsWith(".data")) {
            const data = await getFileString(bf) || "";
            if (data.includes("MANAGE_GUILD")) {
                discordScore.criticalFailures.push({ id: "DISCORD_SCOPES_INVALID", description: `Detected legacy MANAGE_GUILD scope request in ${bf}.` });
                discordScore.score -= 50;
                break;
            }
        }
    }
    audits.discord = discordScore;

    // 3. TIKTOK
    const tiktokScore = { platform: "TIKTOK", auditDate: new Date().toISOString(), score: 100, criticalFailures: [] as any[] };
    let hasTikTokBridge = indexHtml.includes("tiktok-bridge") || indexHtml.includes("preventDefault") || indexHtml.includes("html5studio-tiktok");
    if (!hasTikTokBridge) {
        tiktokScore.criticalFailures.push({ id: "TIKTOK_SWIPE_EXIT_RISK", description: "Missing Touch-Event interceptors. Players swiping down may accidentally exit the mini-game." });
        tiktokScore.score -= 50;
    }
    if (!indexHtml.includes("safe-area-inset")) {
        tiktokScore.criticalFailures.push({ id: "TIKTOK_SAFE_AREA_MISSING", description: "CSS env(safe-area-inset-*) not declared. UI may overlap TikTok engagement buttons." });
        tiktokScore.score -= 20;
    }
    audits.tiktok = tiktokScore;

    // 4. LINKEDIN
    const linkedinScore = { platform: "LINKEDIN", auditDate: new Date().toISOString(), score: 100, criticalFailures: [] as any[] };
    let piiDetect = false;
    for (const bf of [...buildFiles, indexHtmlPath]) {
        const data = await getFileString(bf) || "";
        if (data.includes("google-analytics.com") || data.includes("connect.facebook.net") || data.includes("bat.bing.com")) {
            linkedinScore.criticalFailures.push({ id: "LI_PII_TRACKING_FOUND", description: "Third-party tracking scripts identified. LinkedIn B2B apps enforce strict zero-telemetry." });
            linkedinScore.score -= 100;
            piiDetect = true;
            break;
        }
    }
    audits.linkedin = linkedinScore;

    // 5. TELEGRAM
    const telegramScore = { platform: "TELEGRAM", auditDate: new Date().toISOString(), score: 100, criticalFailures: [] as any[] };
    if (!indexHtml.includes("telegram-web-app.js")) {
        telegramScore.criticalFailures.push({ id: "TG_SDK_MISSING", description: "Missing Telegram Web App SDK. Application will not expand to full screen." });
        telegramScore.score -= 50;
    }
    let hasStars = false;
    for (const bf of files) {
        if (bf.toLowerCase().includes("telegrampayment.jslib")) hasStars = true;
    }
    if (!hasStars) {
        telegramScore.criticalFailures.push({ id: "TMA_STARS_STUB", description: "No Stars bridge found. Required for native payment handling." });
        telegramScore.score -= 10;
    }
    audits.telegram = telegramScore;

    // 6. YOUTUBE
    const ytScore = { platform: "YOUTUBE", auditDate: new Date().toISOString(), score: 100, criticalFailures: [] as any[], metrics: { initialBundleSizeMiB: 0, totalBundleSizeMiB: 0 } };
    let totalSize = 0; let initialSize = 0;
    for (const p of files) {
        const file = zip.file(p);
        if (file) {
            // we can access the uncompressed size from the zip entry internal metadata without loading it
            const s = (file as any)._data?.uncompressedSize || 0;
            totalSize += s;
            if (p.endsWith("index.html") || p.endsWith(".loader.js") || p.endsWith(".framework.js") || p.endsWith(".wasm") || p.endsWith(".jpg") || p.endsWith(".png")) {
                initialSize += s;
            }
        }
    }
    ytScore.metrics.initialBundleSizeMiB = parseFloat((initialSize / (1024 * 1024)).toFixed(2));
    ytScore.metrics.totalBundleSizeMiB = parseFloat((totalSize / (1024 * 1024)).toFixed(2));
    if (ytScore.metrics.initialBundleSizeMiB > 30) { ytScore.criticalFailures.push({ id: "YT_INITIAL_SIZE_EXCEEDED", description: "Initial load logic exceeds 30MB limit." }); ytScore.score -= 50; }
    if (ytScore.metrics.totalBundleSizeMiB > 250) { ytScore.criticalFailures.push({ id: "YT_TOTAL_SIZE_EXCEEDED", description: "Total bundle exceeds YouTube Playables 250MB strict limit." }); ytScore.score -= 50; }
    audits.youtube = ytScore;

    // Clamps
    for (const key of Object.keys(audits)) {
        audits[key].score = Math.max(0, Math.min(100, audits[key].score));
    }

    return audits;
}
