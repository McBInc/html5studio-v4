import fs from "fs/promises";
import path from "path";

export interface PokiComplianceResult {
    platform: "POKI";
    auditDate: string;
    score: number;
    criticalFailures: {
        id: string;
        description: string;
        remediation: string;
    }[];
    metrics: {
        initialPayloadSizeMB: number;
        hasAspectRatioListener: boolean;
        externalCdnViolations: string[];
    };
    checks: {
        sdk_present: boolean;
        payload_ok: boolean;
        scaling_ok: boolean;
        self_contained_ok: boolean;
    };
}

export async function auditPokiCompliance(
    tmpRoot: string,
    buildDir: string,
    projectRoot: string
): Promise<PokiComplianceResult> {
    const result: PokiComplianceResult = {
        platform: "POKI",
        auditDate: new Date().toISOString(),
        score: 100,
        criticalFailures: [],
        metrics: {
            initialPayloadSizeMB: 0,
            hasAspectRatioListener: false,
            externalCdnViolations: [],
        },
        checks: {
            sdk_present: false,
            payload_ok: true,
            scaling_ok: false,
            self_contained_ok: true,
        },
    };

    try {
        // 1. Scan for Poki SDK and External CDNs in index.html
        const indexHtmlPath = path.join(projectRoot, "index.html");
        try {
            const indexContent = await fs.readFile(indexHtmlPath, "utf-8");
            
            // SDK Check
            if (indexContent.includes("poki-sdk.js") || indexContent.includes("PokiSDK")) {
                result.checks.sdk_present = true;
            }

            // Aspect Ratio Check (Regex for 16:9 or window resize listeners)
            if (indexContent.includes("16/9") || indexContent.includes("aspectRatio") || indexContent.includes("window.addEventListener('resize'")) {
                result.metrics.hasAspectRatioListener = true;
                result.checks.scaling_ok = true;
            } else {
                result.criticalFailures.push({
                    id: "SCALING_LOGIC",
                    description: "Missing 16:9 aspect ratio scaling listener.",
                    remediation: "Implement window resize listener with 16:9 canvas clamping.",
                });
                result.score -= 20;
            }

            // External CDN Check
            const cdnRegex = /https?:\/\/(?!(?:localhost|127\.0\.0\.1|.*\.cloudflare\.com|.*\.r2\.dev))[^\s"']+/g;
            const matches = indexContent.match(cdnRegex) || [];
            if (matches.length > 0) {
                result.metrics.externalCdnViolations = Array.from(new Set(matches));
                result.checks.self_contained_ok = false;
                result.criticalFailures.push({
                    id: "CDN_VIOLATION",
                    description: `Detected ${matches.length} external CDN calls. Poki requires self-contained builds.`,
                    remediation: "Host all assets locally or use approved R2/Cloudflare endpoints.",
                });
                result.score -= 30;
            }
        } catch (e) {}

        // 2. Initial Payload Size Check
        const buildEntries = await fs.readdir(buildDir).catch(() => []);
        let totalSize = 0;
        for (const name of buildEntries) {
            if (name.endsWith(".wasm") || name.endsWith(".data") || name.endsWith(".wasm.br") || name.endsWith(".data.br")) {
                const stat = await fs.stat(path.join(buildDir, name));
                totalSize += stat.size;
            }
        }
        
        result.metrics.initialPayloadSizeMB = totalSize / (1024 * 1024);
        if (result.metrics.initialPayloadSizeMB > 8) {
            result.checks.payload_ok = false;
            result.criticalFailures.push({
                id: "PAYLOAD_OVERSIZE",
                description: `Initial payload (${result.metrics.initialPayloadSizeMB.toFixed(2)}MB) exceeds Poki's 8MB limit.`,
                remediation: "Optimize assets or use Addressables to defer loading.",
            });
            result.score -= 40;
        }

        if (result.score < 0) result.score = 0;
    } catch (error) {
        console.error("Poki audit error:", error);
    }

    return result;
}
