// src/lib/scanners/scanWebglBuildZip.ts
import crypto from "crypto";
import path from "path";
import os from "os";
import fs from "fs/promises";
import AdmZip from "adm-zip";
import { z } from "zod";
import { auditMetaCompliance } from "./metaCompliance";
import { auditDiscordCompliance } from "./discordAudit";
import { auditYoutubeBundleCompliance } from "./bundleAudit";
import { auditTiktokCompliance } from "./tiktokAudit";
import { auditLinkedinCompliance } from "./linkedinAudit";
import { auditTelegramCompliance } from "./telegramAudit";
import { auditPokiCompliance } from "./pokiAudit";
import { auditCrazyGamesCompliance } from "./crazyGamesAudit";
import { auditTencentCompliance } from "./tencentAudit";

/**
 * Server-safe WebGL ZIP scanner (no system binaries)
 *
 * Upgrades (SaaS-grade):
 * - Cleans up temp folder (prevents disk leaks)
 * - Does not leak server paths in report
 * - Adds structure checks (index.html, TemplateData, Build contents)
 * - Adds compression mode + per-artifact compression
 * - Adds deployability + basic host recommendation + compatibility matrix
 * - Keeps existing fields for backward compatibility
 */
export async function scanWebglBuildZip(zipBuffer: Buffer, platformTarget?: string) {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "webgl-build-"));

  try {
    // Unzip to temp
    const zip = new AdmZip(zipBuffer);
    zip.extractAllTo(tmpRoot, true);

    const buildDir = await findBuildDir(tmpRoot);

    if (!buildDir) {
      throw new Error(
        "Could not locate a Unity WebGL Build folder (missing .data/.wasm)."
      );
    }

    // Parent folder is where Unity typically outputs index.html + TemplateData + Build/
    const projectRoot = path.dirname(buildDir);

    const structure = await detectStructure(projectRoot, buildDir);

    // Recursive File Scan (Ensures we find .br files in subfolders)
    const files: any[] = [];
    const getAllFiles = async (dirPath: string) => {
        const list = await fs.readdir(dirPath, { withFileTypes: true });
        for (const item of list) {
            const fullPath = path.join(dirPath, item.name);
            if (item.isDirectory()) {
                await getAllFiles(fullPath);
            } else {
                const data = await fs.readFile(fullPath);
                files.push({
                    name: item.name,
                    size_bytes: (await fs.stat(fullPath)).size,
                    sha256: crypto.createHash("sha256").update(data).digest("hex").slice(0, 16)
                });
            }
        }
    };
    await getAllFiles(buildDir);

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

    // Basic deployability: must have Build data+wasm + loader + index + TemplateData
    const deployable =
      structure.has_build_dir &&
      structure.has_data &&
      structure.has_wasm &&
      structure.has_loader &&
      structure.has_index_html &&
      structure.has_template_data;

    // Quick score: keep concept, but make it reflect structure + compression
    const quickScore = computeQuickScore({
      structure,
      compressionMode,
    });

    const compliance = {
      requires_wasm_mime: true,
      requires_brotli_headers: brotliPresent,
      requires_gzip_headers: gzipPresent,
      requires_cache_headers: true,
      notes:
        "Compliance signals are derived from detected compression + standard Unity WebGL serving requirements.",
    };

    const compatibility = computeHostCompatibility({
      deployable,
      compressionMode,
    });

    const recommendedHost = pickRecommendedHost(compatibility);

    let metaComplianceResult: any = undefined;
    let discordComplianceResult: any = undefined;
    let youtubeComplianceResult: any = undefined;
    let tiktokComplianceResult: any = undefined;
    let linkedinComplianceResult: any = undefined;
    let telegramComplianceResult: any = undefined;
    let pokiComplianceResult: any = undefined;
    let crazygamesComplianceResult: any = undefined;
    let tencentComplianceResult: any = undefined;

    if (platformTarget === "META") {
      metaComplianceResult = await auditMetaCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "DISCORD") {
      discordComplianceResult = await auditDiscordCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "YOUTUBE_PLAYABLES") {
      youtubeComplianceResult = await auditYoutubeBundleCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "TIKTOK") {
      tiktokComplianceResult = await auditTiktokCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "LINKEDIN_GAMES") {
      linkedinComplianceResult = await auditLinkedinCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "TELEGRAM") {
      telegramComplianceResult = await auditTelegramCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "POKI") {
      pokiComplianceResult = await auditPokiCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "CRAZYGAMES") {
      crazygamesComplianceResult = await auditCrazyGamesCompliance(tmpRoot, buildDir, projectRoot);
    } else if (platformTarget === "TENCENT_WECHAT") {
      tencentComplianceResult = await auditTencentCompliance(tmpRoot, buildDir, projectRoot);
    }

    // Keep the existing hosting_checks, but make them consistent with detection
    const hosting_checks = [
      {
        check: "Serve .wasm with MIME type application/wasm",
        severity: "high" as const,
      },
      {
        check: "Ensure HTTPS + cache headers for build assets",
        severity: "medium" as const,
      },
      {
        check: "Serve pre-compressed assets with correct Content-Encoding",
        severity:
          compressionMode === "none"
            ? ("info" as const)
            : ("high" as const),
      },
      {
        check: "Verify required WebGL structure (index.html + TemplateData + Build)",
        severity: deployable ? ("info" as const) : ("high" as const),
      },
    ];

    const report = {
      kind: "webgl_build_scan",
      scanned_at: new Date().toISOString(),
      build_dir: "Build",
      quick_score: quickScore,
      compression: {
        brotli_present: brotliPresent,
        gzip_present: gzipPresent,
        notes: "Recursive scan confirmed compressed artifacts."
      },
      memory_settings_detected_bytes: memValues.slice(0, 6),
      hosting_checks,
      files,
      structure,
      compression_mode: compressionMode,
      deployment_readiness: {
        deployable,
        certification_level: deployable ? "Certified" : "Blocked",
      },
      compliance,
      compatibility,
      recommended_host: recommendedHost,
      recommended_fixpack: recommendedHost,
      emulation_readiness: {
          ios_score: (brotliPresent ? 40 : 20) + (deployable ? 60 : 10),
          android_score: (brotliPresent ? 40 : 20) + (deployable ? 60 : 10),
          status: (brotliPresent && deployable) ? "Certified" : "Warning"
      },
      meta: metaComplianceResult,
      discord: discordComplianceResult,
      youtube: youtubeComplianceResult,
      tiktok: tiktokComplianceResult,
      linkedin: linkedinComplianceResult,
      telegram: telegramComplianceResult,
      poki: pokiComplianceResult,
      crazygames: crazygamesComplianceResult,
      tencent: tencentComplianceResult,
    };

    return BuildScanSchema.parse(report);
  } finally {
    // Cleanup temp folder (prevents disk growth on serverless)
    await fs.rm(tmpRoot, { recursive: true, force: true }).catch(() => { });
  }
}

/* ---------------- Schema ---------------- */

const BuildScanSchema = z.object({
  kind: z.literal("webgl_build_scan"),
  scanned_at: z.string(),

  // keep for backward compatibility (but now safe value)
  build_dir: z.string(),

  quick_score: z.number().int().min(0).max(100),

  compression: z.object({
    brotli_present: z.boolean(),
    gzip_present: z.boolean(),
    notes: z.string(),
  }),

  memory_settings_detected_bytes: z.array(z.number().int()).optional(),

  hosting_checks: z.array(
    z.object({
      check: z.string(),
      severity: z.enum(["info", "medium", "high"]),
    })
  ),

  files: z.array(
    z.object({
      name: z.string(),
      size_bytes: z.number().int(),
      sha256: z.string(),
    })
  ),

  // New fields (optional-safe additions)
  structure: z
    .object({
      has_index_html: z.boolean(),
      has_template_data: z.boolean(),
      has_build_dir: z.boolean(),
      has_loader: z.boolean(),
      has_framework: z.boolean(),
      has_data: z.boolean(),
      has_wasm: z.boolean(),
      notes: z.array(z.string()).optional(),
    })
    .optional(),

  compression_mode: z.enum(["brotli", "gzip", "none", "mixed"]).optional(),

  deployment_readiness: z
    .object({
      deployable: z.boolean(),
      certification_level: z.enum(["Certified", "Blocked"]),
    })
    .optional(),

  compliance: z
    .object({
      requires_wasm_mime: z.boolean(),
      requires_brotli_headers: z.boolean(),
      requires_gzip_headers: z.boolean(),
      requires_cache_headers: z.boolean(),
      notes: z.string().optional(),
    })
    .optional(),

  compatibility: z
    .object({
      vercel: z.object({
        compatible: z.boolean(),
        fixpack_required: z.boolean(),
        reason: z.string().optional(),
      }),
      netlify: z.object({
        compatible: z.boolean(),
        fixpack_required: z.boolean(),
        reason: z.string().optional(),
      }),
      apache: z.object({
        compatible: z.boolean(),
        fixpack_required: z.boolean(),
        reason: z.string().optional(),
      }),
      nginx: z.object({
        compatible: z.boolean(),
        fixpack_required: z.boolean(),
        reason: z.string().optional(),
      }),
      github_pages: z.object({
        compatible: z.boolean(),
        fixpack_required: z.boolean(),
        reason: z.string().optional(),
      }),
    })
    .optional(),

  recommended_host: z
    .enum(["vercel", "netlify", "apache", "nginx", "github_pages"])
    .optional(),

  recommended_fixpack: z
    .enum(["vercel", "netlify", "apache", "nginx", "github_pages"])
    .optional(),

  meta: z
    .object({
      platform: z.literal("FACEBOOK"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          sunsetRisk: z.string(),
        })
      ),
      monetizationReadiness: z.object({
        cmpEligible: z.boolean(),
        missingBridge: z.string().nullable(),
      }),
      checks: z.object({
        sdk_v8: z.boolean(),
        zero_perm: z.boolean(),
      })
    })
    .optional(),

  discord: z
    .object({
      platform: z.literal("DISCORD"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          sunsetRisk: z.string(),
        })
      ),
      monetizationReadiness: z.object({
        cmpEligible: z.boolean(),
        missingBridge: z.string().nullable(),
      }),
      checks: z.object({
        sdk_v1_8: z.boolean(),
        granular_scopes: z.boolean(),
      })
    })
    .optional(),

  youtube: z
    .object({
      platform: z.literal("YOUTUBE_PLAYABLES"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          sunsetRisk: z.string(),
        })
      ),
      metrics: z.object({
        initialBundleSizeMiB: z.number(),
        totalBundleSizeMiB: z.number(),
        largestFileMiB: z.number(),
        memoryHeapLimit: z.number().nullable(),
      }),
      checks: z.object({
        max_file_size_ok: z.boolean(),
        initial_bundle_size_ok: z.boolean(),
        max_bundle_size_ok: z.boolean(),
        naming_conventions_ok: z.boolean(),
        sdk_present: z.boolean(),
        heap_limit_ok: z.boolean(),
        absolute_paths_ok: z.boolean(),
      })
    })
    .optional(),

  tiktok: z
    .object({
      platform: z.literal("TIKTOK"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          sunsetRisk: z.string(),
        })
      ),
      checks: z.object({
        touch_action_locked: z.boolean(),
      })
    })
    .optional(),

  linkedin: z
    .object({
      platform: z.literal("LINKEDIN"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          sunsetRisk: z.string(),
        })
      ),
      checks: z.object({
        zero_pii_ok: z.boolean(),
      })
    })
    .optional(),

  telegram: z
    .object({
      platform: z.literal("TELEGRAM"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          sunsetRisk: z.string(),
        })
      ),
      monetizationReadiness: z.object({
        cmpEligible: z.boolean(),
        missingBridge: z.string().nullable(),
      }).optional(),
      checks: z.object({
        sdk_present: z.boolean(),
        stars_stub: z.boolean(),
      }).optional()
    })
    .optional(),

  poki: z
    .object({
      platform: z.literal("POKI"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          remediation: z.string(),
        })
      ),
      metrics: z.object({
        initialPayloadSizeMB: z.number(),
        hasAspectRatioListener: z.boolean(),
        externalCdnViolations: z.array(z.string()),
      }),
      checks: z.object({
        sdk_present: z.boolean(),
        payload_ok: z.boolean(),
        scaling_ok: z.boolean(),
        self_contained_ok: z.boolean(),
      })
    })
    .optional(),

  crazygames: z
    .object({
      platform: z.literal("CRAZYGAMES"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          remediation: z.string(),
        })
      ),
      metrics: z.object({
        hasSdkHeader: z.boolean(),
        hasHappyMoments: z.boolean(),
        hasCompressionHeaders: z.boolean(),
      }),
      checks: z.object({
        sdk_v2_present: z.boolean(),
        gameplay_hooks_ok: z.boolean(),
        compression_ok: z.boolean(),
      })
    })
    .optional(),

  tencent: z
    .object({
      platform: z.literal("TENCENT_WECHAT"),
      auditDate: z.string(),
      score: z.number(),
      criticalFailures: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          remediation: z.string(),
        })
      ),
      metrics: z.object({
        hasMidasPayment: z.boolean(),
        hasPIIExfiltration: z.boolean(),
        usesRestrictedApis: z.boolean(),
      }),
      checks: z.object({
        pipl_2026_ok: z.boolean(),
        payment_gates_ok: z.boolean(),
        runtime_ready: z.boolean(),
      })
    })
    .optional(),

  emulation_readiness: z
    .object({
      ios_score: z.number(),
      android_score: z.number(),
      status: z.string(),
    })
    .optional(),
}).passthrough();

/* ---------------- Helpers ---------------- */

async function findBuildDir(root: string) {
  const stack: string[] = [root];

  while (stack.length) {
    const cur = stack.pop()!;

    const entries = await fs.readdir(cur, { withFileTypes: true });

    const files = entries.filter((e) => e.isFile()).map((e) => e.name);

    const hasData = files.some(
      (n) =>
        n.endsWith(".data") || n.endsWith(".data.br") || n.endsWith(".data.gz") || n.endsWith(".data.unityweb")
    );

    const hasWasm = files.some(
      (n) =>
        n.endsWith(".wasm") || n.endsWith(".wasm.br") || n.endsWith(".wasm.gz") || n.endsWith(".wasm.unityweb")
    );

    if (path.basename(cur).toLowerCase() === "build" && hasData && hasWasm) {
      return cur;
    }

    for (const e of entries) {
      if (e.isDirectory()) {
        stack.push(path.join(cur, e.name));
      }
    }
  }

  return null;
}

async function detectStructure(projectRoot: string, buildDir: string) {
  const notes: string[] = [];

  const hasIndexHtml = await exists(path.join(projectRoot, "index.html"));
  const hasTemplateData = await exists(path.join(projectRoot, "TemplateData"));

  const buildEntries = await fs.readdir(buildDir).catch(() => []);
  const lower = buildEntries.map((n) => n.toLowerCase());

  const hasLoader = lower.some((n) => n.endsWith(".loader.js"));
  const hasFramework = lower.some((n) =>
    n.includes(".framework.js") || n.endsWith(".framework.js.br") || n.endsWith(".framework.js.gz")
  );

  const hasData = buildEntries.some(
    (n) =>
      n.endsWith(".data") || n.endsWith(".data.br") || n.endsWith(".data.gz")
  );
  const hasWasm = buildEntries.some(
    (n) =>
      n.endsWith(".wasm") || n.endsWith(".wasm.br") || n.endsWith(".wasm.gz")
  );

  if (!hasIndexHtml) notes.push("Missing index.html at project root (next to Build/).");
  if (!hasTemplateData) notes.push("Missing TemplateData/ folder at project root (next to Build/).");
  if (!hasLoader) notes.push("Missing *.loader.js in Build/ folder.");
  if (!hasFramework) notes.push("Missing framework.js (or compressed variant) in Build/ folder.");

  return {
    has_index_html: hasIndexHtml,
    has_template_data: hasTemplateData,
    has_build_dir: true,
    has_loader: hasLoader,
    has_framework: hasFramework,
    has_data: hasData,
    has_wasm: hasWasm,
    notes: notes.length ? notes : undefined,
  };
}

async function exists(p: string) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function computeCompressionMode(
  files: Array<{ name: string; size_bytes: number; sha256: string }>
): "brotli" | "gzip" | "none" | "mixed" {
  const hasBr = files.some((f) => f.name.endsWith(".br"));
  const hasGz = files.some((f) => f.name.endsWith(".gz"));
  if (hasBr && hasGz) return "mixed";
  if (hasBr) return "brotli";
  if (hasGz) return "gzip";
  return "none";
}

function computeQuickScore(opts: {
  structure: {
    has_index_html: boolean;
    has_template_data: boolean;
    has_build_dir: boolean;
    has_loader: boolean;
    has_framework: boolean;
    has_data: boolean;
    has_wasm: boolean;
  };
  compressionMode: "brotli" | "gzip" | "none" | "mixed";
}) {
  let score = 50;

  // Structure (biggest driver of “will it run”)
  const s = opts.structure;
  const structurePoints =
    (s.has_index_html ? 8 : 0) +
    (s.has_template_data ? 8 : 0) +
    (s.has_loader ? 10 : 0) +
    (s.has_framework ? 8 : 0) +
    (s.has_data ? 8 : 0) +
    (s.has_wasm ? 8 : 0);
  score += structurePoints;

  // Compression (quality + hosting complexity)
  if (opts.compressionMode === "brotli") score += 10;
  if (opts.compressionMode === "gzip") score += 6;
  if (opts.compressionMode === "mixed") score += 2; // mixed tends to cause confusion

  // Clamp
  return Math.max(0, Math.min(100, Math.round(score)));
}

function computeHostCompatibility(opts: {
  deployable: boolean;
  compressionMode: "brotli" | "gzip" | "none" | "mixed";
}) {
  // Basic, honest heuristics:
  // - Vercel/Netlify: can be compatible with all modes if headers/routing are correct (fixpack usually needed for compressed)
  // - Apache/Nginx: compatible but requires correct config (fixpack helps)
  // - GitHub Pages: fine for uncompressed; compressed is difficult (no headers control)
  const { deployable, compressionMode } = opts;

  const needsHeaders =
    compressionMode === "brotli" || compressionMode === "gzip" || compressionMode === "mixed";

  return {
    vercel: {
      compatible: deployable,
      fixpack_required: deployable ? needsHeaders : false,
      reason: !deployable
        ? "Build structure missing required files."
        : needsHeaders
          ? "Compressed assets require correct headers (Content-Encoding + MIME)."
          : undefined,
    },
    netlify: {
      compatible: deployable,
      fixpack_required: deployable ? needsHeaders : false,
      reason: !deployable
        ? "Build structure missing required files."
        : needsHeaders
          ? "Compressed assets require correct headers (Content-Encoding + MIME)."
          : undefined,
    },
    apache: {
      compatible: deployable,
      fixpack_required: deployable ? needsHeaders : false,
      reason: !deployable
        ? "Build structure missing required files."
        : needsHeaders
          ? "Requires server config for Content-Encoding + MIME."
          : undefined,
    },
    nginx: {
      compatible: deployable,
      fixpack_required: deployable ? needsHeaders : false,
      reason: !deployable
        ? "Build structure missing required files."
        : needsHeaders
          ? "Requires server config for Content-Encoding + MIME."
          : undefined,
    },
    github_pages: {
      compatible: deployable && compressionMode === "none",
      fixpack_required: false,
      reason:
        !deployable
          ? "Build structure missing required files."
          : compressionMode !== "none"
            ? "GitHub Pages cannot reliably set Content-Encoding headers for pre-compressed Unity assets."
            : undefined,
    },
  };
}

function pickRecommendedHost(compat: ReturnType<typeof computeHostCompatibility>) {
  // Prefer Netlify first if compatible; then Vercel; then Nginx/Apache; then GitHub Pages (only for uncompressed).
  if (compat.netlify.compatible) return "netlify" as const;
  if (compat.vercel.compatible) return "vercel" as const;
  if (compat.nginx.compatible) return "nginx" as const;
  if (compat.apache.compatible) return "apache" as const;
  if (compat.github_pages.compatible) return "github_pages" as const;
  return "netlify" as const; // default fallback
}

async function extractMemoryHints(loaderPath: string) {
  const txt = await fs.readFile(loaderPath, "utf-8");

  const patterns = [
    /TOTAL_MEMORY\s*[:=]\s*(\d+)/g,
    /INITIAL_MEMORY\s*[:=]\s*(\d+)/g,
    /memory\s*[:=]\s*(\d+)/g,
  ];

  const found = new Set<number>();

  for (const pat of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pat.exec(txt))) {
      const v = parseInt(m[1], 10);
      if (Number.isFinite(v)) found.add(v);
    }
  }

  return Array.from(found).sort((a, b) => a - b);
}