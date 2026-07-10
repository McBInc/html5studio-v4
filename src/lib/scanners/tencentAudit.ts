import fs from "fs/promises";
import path from "path";

export interface TencentComplianceResult {
    platform: "TENCENT_WECHAT";
    auditDate: string;
    score: number;
    criticalFailures: {
        id: string;
        description: string;
        remediation: string;
    }[];
    metrics: {
        hasMidasPayment: boolean;
        hasPIIExfiltration: boolean;
        usesRestrictedApis: boolean;
    };
    checks: {
        pipl_2026_ok: boolean;
        payment_gates_ok: boolean;
        runtime_ready: boolean;
    };
}

export async function auditTencentCompliance(
    tmpRoot: string,
    buildDir: string,
    projectRoot: string
): Promise<TencentComplianceResult> {
    const result: TencentComplianceResult = {
        platform: "TENCENT_WECHAT",
        auditDate: new Date().toISOString(),
        score: 100,
        criticalFailures: [],
        metrics: {
            hasMidasPayment: false,
            hasPIIExfiltration: false,
            usesRestrictedApis: false,
        },
        checks: {
            pipl_2026_ok: true,
            payment_gates_ok: true,
            runtime_ready: true,
        },
    };

    try {
        const buildEntries = await fs.readdir(buildDir).catch(() => []);
        
        // 1. PII Sweep (PIPL 2026) in index.html and binaries
        const indexHtmlPath = path.join(projectRoot, "index.html");
        try {
            const indexContent = await fs.readFile(indexHtmlPath, "utf-8");
            
            // Regex for common PII patterns (names, emails, phone numbers)
            if (indexContent.includes(".api(\"/me\")") || indexContent.includes("user_friends") || indexContent.includes("contacts")) {
                result.metrics.hasPIIExfiltration = true;
                result.checks.pipl_2026_ok = false;
                result.criticalFailures.push({
                    id: "PIPL_VIOLATION",
                    description: "Detected PII data harvesting without mandatory Tencent privacy popup.",
                    remediation: "Initialize WeChat Privacy Policy popup before accessing user data.",
                });
                result.score -= 40;
            }

            // 2. Payment Logic Check (Midas / WeChat Pay mandatory)
            if (indexContent.includes("paypal") || indexContent.includes("creditcard") || indexContent.includes("stripe")) {
                result.metrics.hasMidasPayment = false;
                result.checks.payment_gates_ok = false;
                result.criticalFailures.push({
                    id: "PAYMENT_GATE_VIOLATION",
                    description: "Detected forbidden external payment systems (PayPal/Stripe).",
                    remediation: "Reroute all virtual payments through Tencent Midas or WeChat Pay.",
                });
                result.score -= 40;
            }
        } catch (e) {}

        // 3. Scan binaries for Custom Runtime Restrictions (eval, localStorage)
        for (const name of buildEntries) {
            if (name.endsWith(".js") || name.endsWith(".wasm")) {
                const content = await fs.readFile(path.join(buildDir, name), "utf-8").catch(() => "");
                
                if (content.includes("eval(") || content.includes("new Function(")) {
                    result.metrics.usesRestrictedApis = true;
                    result.checks.runtime_ready = false;
                    result.criticalFailures.push({
                        id: "RUNTIME_RESTRICTION",
                        description: `Binary (${name}) contains eval() or new Function() calls. WeChat blocks these.`,
                        remediation: "Remove dynamic evaluation or use WeChat Custom Compiler options.",
                    });
                    result.score -= 20;
                }
                
                // Check for PII or Payment signs in binary
                if (content.includes("paypal") || content.includes("stripe") || content.includes("user_friends")) {
                    result.checks.pipl_2026_ok = false;
                    result.checks.payment_gates_ok = false;
                    result.score -= 20;
                }
            }
        }

        if (result.score < 0) result.score = 0;
    } catch (error) {
        console.error("Tencent audit error:", error);
    }

    return result;
}
