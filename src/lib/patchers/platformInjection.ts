import JSZip from "jszip";
import path from "node:path";

export type PlatformPatchReport = {
    poki_injected: boolean;
    crazygames_injected: boolean;
    tencent_injected: boolean;
    ok: boolean;
};

export async function patchPlatformHooksInZip(zipBuffer: Buffer): Promise<{ outZip: Buffer, report: PlatformPatchReport }> {
    const zip = await JSZip.loadAsync(zipBuffer);
    const report: PlatformPatchReport = {
        poki_injected: false,
        crazygames_injected: false,
        tencent_injected: false,
        ok: true,
    };

    const pokiRegex = /(PokiSDK|adblock|commercialBreak|gameplayStart|gameplayStop)/;
    const crazyGamesRegex = /(CrazyGames|sdk\.crazygames\.com|requestAd|bannerLayout)/;
    const tencentRegex = /(mqq|JSBridge|getSystemInfoSync|shareAppMessage|wx\.)/;

    const files = Object.keys(zip.files);
    
    for (const filePath of files) {
        if (filePath.endsWith(".js") || filePath.endsWith(".html")) {
            const file = zip.file(filePath);
            if (!file) continue;

            let content = await file.async("string");
            let modified = false;

            // POKI INJECTION
            if (pokiRegex.test(content) && !content.includes("PokiSDK.init()")) {
                const injection = `
/* ALPHA-9 AUTO-INJECTION: POKI HANDSHAKE */
if (typeof PokiSDK !== 'undefined') {
    PokiSDK.init().then(() => { console.log("H5S: Poki Initialized"); }).catch(() => { console.warn("H5S: Poki Ad-Blocker Detected"); });
}
`;
                content = content.replace(pokiRegex, (match) => `${injection}\n${match}`);
                report.poki_injected = true;
                modified = true;
            }

            // CRAZYGAMES INJECTION
            if (crazyGamesRegex.test(content) && !content.includes("CrazyGames.SDK.modules.ad")) {
                const injection = `
/* ALPHA-9 AUTO-INJECTION: CRAZYGAMES MODULES */
if (typeof CrazyGames !== 'undefined' && CrazyGames.SDK) {
    const adModules = CrazyGames.SDK.modules.ad;
    if (adModules) {
        adModules.on('adStarted', () => { if (typeof unityInstance !== 'undefined') unityInstance.SendMessage('SDKManager', 'OnAdStarted'); });
        adModules.on('adFinished', () => { if (typeof unityInstance !== 'undefined') unityInstance.SendMessage('SDKManager', 'OnAdFinished'); });
    }
}
`;
                content = content.replace(crazyGamesRegex, (match) => `${injection}\n${match}`);
                report.crazygames_injected = true;
                modified = true;
            }

            // TENCENT INJECTION
            if (tencentRegex.test(content) && !content.includes("Tencent.MQQ.JSBridge")) {
                const injection = `
/* ALPHA-9 AUTO-INJECTION: TENCENT MQQ BRIDGE */
if (typeof Tencent !== 'undefined' && Tencent.MQQ) {
    Tencent.MQQ.JSBridge.ready(() => { console.log("H5S: Tencent JSBridge Ready (DMA Art 7 Active)"); });
}
`;
                content = content.replace(tencentRegex, (match) => `${injection}\n${match}`);
                report.tencent_injected = true;
                modified = true;
            }

            if (modified) {
                zip.file(filePath, content);
            }
        }
    }

    const outZip = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
    return { outZip, report };
}
