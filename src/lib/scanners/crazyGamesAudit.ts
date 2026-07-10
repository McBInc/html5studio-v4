import fs from "fs/promises";
import path from "path";

export interface CrazyGamesComplianceResult {
    platform: "CRAZYGAMES";
    auditDate: string;
    score: number;
    criticalFailures: {
        id: string;
        description: string;
        remediation: string;
    }[];
    metrics: {
        hasSdkHeader: boolean;
        hasHappyMoments: boolean;
        hasCompressionHeaders: boolean;
    };
    checks: {
        sdk_v2_present: boolean;
        gameplay_hooks_ok: boolean;
        compression_ok: boolean;
    };
}

export async function auditCrazyGamesCompliance(
    tmpRoot: string,
    buildDir: string,
    projectRoot: string
): Promise<CrazyGamesComplianceResult> {
    const result: CrazyGamesComplianceResult = {
        platform: "CRAZYGAMES",
        auditDate: new Date().toISOString(),
        score: 100,
        criticalFailures: [],
        metrics: {
            hasSdkHeader: false,
            hasHappyMoments: false,
            hasCompressionHeaders: false,
        },
        checks: {
            sdk_v2_present: false,
            gameplay_hooks_ok: false,
            compression_ok: false,
        },
    };

    try {
        // 1. Scan for CrazyGames SDK and Hooks
        const indexHtmlPath = path.join(projectRoot, "index.html");
        try {
            const indexContent = await fs.readFile(indexHtmlPath, "utf-8");
            
            // SDK Check (v2)
            if (indexContent.includes("crazygames-sdk-v2.js") || indexContent.includes("sdk.crazygames.com")) {
                result.metrics.hasSdkHeader = true;
                result.checks.sdk_v2_present = true;
            } else {
                result.criticalFailures.push({
                    id: "SDK_MISSING",
                    description: "Missing CrazyGames SDK v2 in index.html.",
                    remediation: "Add <script src='https://sdk.crazygames.com/crazygames-sdk-v2.js'></script> in the head.",
                });
                result.score -= 30;
            }

            // Hooks Check (gameplay_start, gameplay_stop, happytime)
            if (indexContent.includes("gameplay_start") || indexContent.includes("gameplay_stop")) {
                result.checks.gameplay_hooks_ok = true;
            } else {
                result.criticalFailures.push({
                    id: "HOOKS_MISSING",
                    description: "Missing gameplay_start/stop hooks for ad pausing.",
                    remediation: "Call crazygames.SDK.game.gameplayStart() and gameplayStop() during level transitions.",
                });
                result.score -= 30;
            }

            if (indexContent.includes("happytime") || indexContent.includes("requestAd")) {
                result.metrics.hasHappyMoments = true;
            }
        } catch (e) {}

        // 2. Scan JS binaries for Hooks (in case they are not in index.html)
        const buildEntries = await fs.readdir(buildDir).catch(() => []);
        for (const name of buildEntries) {
            if (name.endsWith(".js") || name.endsWith(".wasm")) {
                const content = await fs.readFile(path.join(buildDir, name), "utf-8").catch(() => "");
                if (content.includes("gameplay_start") || content.includes("gameplay_stop")) {
                    result.checks.gameplay_hooks_ok = true;
                }
                if (content.includes("happytime") || content.includes("requestAd")) {
                    result.metrics.hasHappyMoments = true;
                }
            }
        }

        // 3. Compression Check (.htaccess or server config)
        const htaccessPath = path.join(projectRoot, ".htaccess");
        try {
            const htaccessContent = await fs.readFile(htaccessPath, "utf-8");
            if (htaccessContent.includes("AddEncoding br") || htaccessContent.includes("AddEncoding gzip") || htaccessContent.includes("Content-Encoding")) {
                result.metrics.hasCompressionHeaders = true;
                result.checks.compression_ok = true;
            }
        } catch (e) {
            // Check for recursive .br or .gz files as a hint
            const hasCompressed = buildEntries.some(f => f.endsWith(".br") || f.endsWith(".gz"));
            if (hasCompressed) {
                result.checks.compression_ok = true;
            } else {
                result.criticalFailures.push({
                    id: "UNCOMPRESSED_BUILD",
                    description: "Binary components are uncompressed. CrazyGames penalizes slow loading.",
                    remediation: "Set Unity Build Settings to Brotli or Gzip compression.",
                });
                result.score -= 40;
            }
        }

        if (result.score < 0) result.score = 0;
    } catch (error) {
        console.error("CrazyGames audit error:", error);
    }

    return result;
}
