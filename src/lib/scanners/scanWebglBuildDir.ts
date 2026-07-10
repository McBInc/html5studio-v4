// src/lib/scanners/scanWebglBuildDir.ts
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";
import { auditMetaCompliance } from "./metaCompliance";
import { auditDiscordCompliance } from "./discordAudit";
import { auditYoutubeBundleCompliance } from "./bundleAudit";
import { auditTiktokCompliance } from "./tiktokAudit";
import { auditLinkedinCompliance } from "./linkedinAudit";
import { auditTelegramCompliance } from "./telegramAudit";

/**
 * Audit a WebGL build already extracted to the filesystem.
 * This avoids redundant ZIP parsing and event loop blocking.
 */
export async function scanWebglBuildDir(projectRoot: string, platformTarget?: string) {
  try {
    const buildDir = await findBuildDir(projectRoot);

    if (!buildDir) {
      throw new Error(
        "Could not locate a Unity WebGL Build folder (missing .data/.wasm)."
      );
    }

    const structure = await detectStructure(projectRoot, buildDir);

    // List files in Build folder (only)
    const entries = await fs.readdir(buildDir);

    const files: {
      name: string;
      size_bytes: number;
      sha256: string;
    }[] = [];

    for (const name of entries) {
      const full = path.join(buildDir, name);
      const st = await fs.stat(full);
      if (!st.isFile()) continue;

      const data = await fs.readFile(full);
      files.push({
        name,
        size_bytes: st.size,
        sha256: crypto
          .createHash("sha256")
          .update(data)
          .digest("hex")
          .slice(0, 16),
      });
    }

    files.sort((a, b) => b.size_bytes - a.size_bytes);

    const brotliPresent = files.some((f) => f.name.endsWith(".br"));
    const gzipPresent = files.some((f) => f.name.endsWith(".gz"));

    const compressionMode = computeCompressionMode(files);

    const loader = files.find((f) =>
      f.name.toLowerCase().endsWith(".loader.js")
    );

    const memValues = loader
      ? await extractMemoryHints(path.join(buildDir, loader.name))
      : [];

    const deployable =
      structure.has_build_dir &&
      structure.has_data &&
      structure.has_wasm &&
      structure.has_loader &&
      structure.has_index_html &&
      structure.has_template_data;

    const quickScore = computeQuickScore({
      structure,
      compressionMode,
    });

    const compliance = {
      requires_wasm_mime: true,
      requires_brotli_headers: brotliPresent,
      requires_gzip_headers: gzipPresent,
      requires_cache_headers: true,
      notes: "Compliance signals are derived from detected compression + standard Unity WebGL serving requirements.",
    };

    const compatibility = computeHostCompatibility({
      deployable,
      compressionMode,
    });

    const recommendedHost = pickRecommendedHost(compatibility);

    let metaResult, discordResult, youtubeResult, tiktokResult, linkedinResult, telegramResult;

    if (platformTarget === "META") {
      metaResult = await auditMetaCompliance(projectRoot, buildDir, projectRoot);
    } else if (platformTarget === "DISCORD") {
      discordResult = await auditDiscordCompliance(projectRoot, buildDir, projectRoot);
    } else if (platformTarget === "YOUTUBE_PLAYABLES") {
      youtubeResult = await auditYoutubeBundleCompliance(projectRoot, buildDir, projectRoot);
    } else if (platformTarget === "TIKTOK") {
      tiktokResult = await auditTiktokCompliance(projectRoot, buildDir, projectRoot);
    } else if (platformTarget === "LINKEDIN_GAMES") {
      linkedinResult = await auditLinkedinCompliance(projectRoot, buildDir, projectRoot);
    } else if (platformTarget === "TELEGRAM") {
      telegramResult = await auditTelegramCompliance(projectRoot, buildDir, projectRoot);
    }

    const hosting_checks = [
      { check: "Serve .wasm with MIME type application/wasm", severity: "high" as const },
      { check: "Ensure HTTPS + cache headers for build assets", severity: "medium" as const },
      {
        check: "Serve pre-compressed assets with correct Content-Encoding",
        severity: compressionMode === "none" ? "info" as const : "high" as const,
      },
      {
        check: "Verify required WebGL structure (index.html + TemplateData + Build)",
        severity: deployable ? "info" as const : "high" as const,
      },
    ];

    return {
      kind: "webgl_build_scan",
      scanned_at: new Date().toISOString(),
      build_dir: "Build",
      quick_score: quickScore,
      compression: { brotli_present: brotliPresent, gzip_present: gzipPresent, notes: "Automated scan of extracted directory." },
      memory_settings_detected_bytes: memValues.slice(0, 6),
      hosting_checks,
      files,
      structure,
      compression_mode: compressionMode,
      deployment_readiness: { deployable, certification_level: deployable ? "Certified" : "Blocked" },
      compliance,
      compatibility,
      recommended_host: recommendedHost,
      recommended_fixpack: recommendedHost,
      meta: metaResult,
      discord: discordResult,
      youtube: youtubeResult,
      tiktok: tiktokResult,
      linkedin: linkedinResult,
      telegram: telegramResult,
    };
  } catch (error) {
    console.error("[SCAN-DIR] Critical auditing failure:", error);
    throw error;
  }
}

// Reuse logic from scanWebglBuildZip (Simplified for this file)
async function findBuildDir(root: string) {
  const stack: { p: string; d: number }[] = [{ p: root, d: 0 }];
  const visited = new Set<string>();

  while (stack.length) {
    const { p: cur, d: depth } = stack.pop()!;
    if (depth > 8 || visited.has(cur)) continue;
    visited.add(cur);

    const entries = await fs.readdir(cur, { withFileTypes: true }).catch(() => []);
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    
    const hasData = files.some(n => n.endsWith(".data") || n.endsWith(".data.br") || n.endsWith(".data.gz") || n.endsWith(".data.unityweb"));
    const hasWasm = files.some(n => n.endsWith(".wasm") || n.endsWith(".wasm.br") || n.endsWith(".wasm.gz") || n.endsWith(".wasm.unityweb"));
    
    if (path.basename(cur).toLowerCase() === "build" && hasData && hasWasm) return cur;

    for (const e of entries) {
      if (e.isDirectory()) {
        stack.push({ p: path.join(cur, e.name), d: depth + 1 });
      }
    }
  }
  return null;
}

async function detectStructure(projectRoot: string, buildDir: string) {
  const hasIndexHtml = await fs.stat(path.join(projectRoot, "index.html")).then(() => true).catch(() => false);
  const hasTemplateData = await fs.stat(path.join(projectRoot, "TemplateData")).then(() => true).catch(() => false);
  const buildEntries = await fs.readdir(buildDir).catch(() => []);
  const lower = buildEntries.map(n => n.toLowerCase());
  return {
    has_index_html: hasIndexHtml,
    has_template_data: hasTemplateData,
    has_build_dir: true,
    has_loader: lower.some(n => n.endsWith(".loader.js")),
    has_framework: lower.some(n => n.includes(".framework.js")),
    has_data: lower.some(n => n.endsWith(".data") || n.endsWith(".data.br") || n.endsWith(".data.gz")),
    has_wasm: lower.some(n => n.endsWith(".wasm") || n.endsWith(".wasm.br") || n.endsWith(".wasm.gz")),
  };
}

function computeCompressionMode(files: any[]) {
    const hasBr = files.some((f) => f.name.endsWith(".br"));
    const hasGz = files.some((f) => f.name.endsWith(".gz"));
    if (hasBr && hasGz) return "mixed";
    if (hasBr) return "brotli";
    if (hasGz) return "gzip";
    return "none";
}

function computeQuickScore(opts: any) {
    let score = 50;
    if (opts.structure.has_index_html) score += 10;
    if (opts.structure.has_loader) score += 10;
    if (opts.structure.has_wasm) score += 10;
    if (opts.compressionMode === "brotli") score += 20;
    return score;
}

function computeHostCompatibility(opts: any) {
    return { vercel: { compatible: opts.deployable }, netlify: { compatible: opts.deployable }, github_pages: { compatible: opts.deployable && opts.compressionMode === "none" } };
}

function pickRecommendedHost(compat: any) {
    return compat.netlify.compatible ? "netlify" : "vercel";
}

async function extractMemoryHints(p: string) {
    const txt = await fs.readFile(p, "utf-8");
    const m = txt.match(/memory\s*[:=]\s*(\d+)/);
    return m ? [parseInt(m[1])] : [];
}
