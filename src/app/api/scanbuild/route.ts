// src/app/api/scanbuild/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

import { scanWebglBuildZip } from "@/lib/scanners/scanWebglBuildZip";
import { generateCertId } from "@/lib/cert/generateCertId";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import JSZip from "jszip";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ScanLike = any;

type HostSlug = "netlify" | "vercel" | "apache" | "nginx" | "github_pages";

type HostScore = {
  slug: HostSlug;
  score: number; // 0..100
  certified: boolean;
  compliant: boolean;
  compatible: boolean;
  reasons: string[];
  fixpackRequired: boolean;
};

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function detectCompressionMode(scan: ScanLike): "brotli" | "gzip" | "none" | "mixed" {
  const mode = scan?.compression_mode;
  if (mode === "brotli" || mode === "gzip" || mode === "none" || mode === "mixed") return mode;

  const brotli = !!scan?.compression?.brotli_present;
  const gzip = !!scan?.compression?.gzip_present;

  if (brotli && gzip) return "mixed";
  if (brotli) return "brotli";
  if (gzip) return "gzip";
  return "none";
}

function detectStructure(scan: ScanLike) {
  const s = scan?.structure;
  if (s && typeof s === "object") {
    const hasIndex = !!s.has_index_html;
    const hasTemplateData = !!s.has_template_data;
    const hasLoader = !!s.has_loader;
    const hasFramework = !!s.has_framework;
    const hasData = !!s.has_data;
    const hasWasm = !!s.has_wasm;

    return {
      hasIndex,
      hasTemplateData,
      hasLoader,
      hasFramework,
      hasData,
      hasWasm,
      deployable: hasIndex && hasTemplateData && hasLoader && hasData && hasWasm,
      notes: Array.isArray(s.notes) ? s.notes : [],
    };
  }

  const fileNames: string[] = Array.isArray(scan?.files)
    ? scan.files.map((f: any) => String(f?.name || ""))
    : [];

  const hasLoader = fileNames.some((n) => n.toLowerCase().endsWith(".loader.js"));
  const hasFramework = fileNames.some((n) => n.toLowerCase().includes(".framework.js"));
  const hasData = fileNames.some((n) => n.endsWith(".data") || n.endsWith(".data.br") || n.endsWith(".data.gz"));
  const hasWasm = fileNames.some((n) => n.endsWith(".wasm") || n.endsWith(".wasm.br") || n.endsWith(".wasm.gz"));

  return {
    hasIndex: false,
    hasTemplateData: false,
    hasLoader,
    hasFramework,
    hasData,
    hasWasm,
    deployable: hasLoader && hasData && hasWasm,
    notes: ["Structure fields not present in scan output; using Build-folder heuristics only."],
  };
}

function scoreHosts(scan: ScanLike): { scores: HostScore[]; recommended: HostScore } {
  const quick = Number.isFinite(scan?.quick_score) ? Number(scan.quick_score) : 60;
  const compressionMode = detectCompressionMode(scan);
  const structure = detectStructure(scan);

  const needsHeaders = compressionMode === "brotli" || compressionMode === "gzip" || compressionMode === "mixed";
  const hasBrotli = compressionMode === "brotli" || compressionMode === "mixed";
  const hasGzip = compressionMode === "gzip" || compressionMode === "mixed";

  const baseReadiness = clamp(quick);

  function make(slug: HostSlug, base: number, reasons: string[], compatible: boolean, fixpackRequired: boolean) {
    const compliant = !needsHeaders || fixpackRequired;
    const certified = compatible && structure.deployable;

    const score = clamp(
      base +
        (structure.deployable ? 10 : -25) +
        (needsHeaders ? 0 : 8) +
        (slug === "github_pages" && needsHeaders ? -40 : 0) +
        (slug === "github_pages" && !needsHeaders ? 10 : 0)
    );

    return { slug, score, certified, compliant, compatible, reasons, fixpackRequired } satisfies HostScore;
  }

  const scores: HostScore[] = [];

  scores.push(
    make(
      "netlify",
      baseReadiness + 6,
      [
        structure.deployable ? "Build structure looks deployable." : "Build structure may be incomplete.",
        needsHeaders ? "Compressed assets detected; headers required (FixPack)." : "No pre-compression detected; standard hosting ok.",
        "Strong fit for static WebGL hosting + easy deployment.",
      ],
      structure.deployable,
      needsHeaders
    )
  );

  scores.push(
    make(
      "vercel",
      baseReadiness + 4,
      [
        structure.deployable ? "Build structure looks deployable." : "Build structure may be incomplete.",
        needsHeaders ? "Compressed assets detected; headers required (FixPack)." : "No pre-compression detected; standard hosting ok.",
        "Good fit when paired with your Neon-backed Studio workflow.",
      ],
      structure.deployable,
      needsHeaders
    )
  );

  scores.push(
    make(
      "apache",
      baseReadiness,
      [
        structure.deployable ? "Build structure looks deployable." : "Build structure may be incomplete.",
        needsHeaders ? "Compressed assets detected; server config required (FixPack)." : "No pre-compression detected; standard config ok.",
        "Great when client controls server config.",
      ],
      structure.deployable,
      needsHeaders
    )
  );

  scores.push(
    make(
      "nginx",
      baseReadiness,
      [
        structure.deployable ? "Build structure looks deployable." : "Build structure may be incomplete.",
        needsHeaders ? "Compressed assets detected; server config required (FixPack)." : "No pre-compression detected; standard config ok.",
        "Excellent performance for WebGL with proper config.",
      ],
      structure.deployable,
      needsHeaders
    )
  );

  scores.push(
    make(
      "github_pages",
      baseReadiness - (needsHeaders ? 15 : 0),
      [
        needsHeaders
          ? "Compressed assets detected; GitHub Pages cannot reliably serve Content-Encoding headers."
          : "Uncompressed builds can work on GitHub Pages.",
        "Use only for simple demos unless you control headers elsewhere.",
      ],
      structure.deployable && !needsHeaders,
      false
    )
  );

  const recommended = [...scores].sort((a, b) => b.score - a.score)[0];

  recommended.reasons.push(
    hasBrotli ? "Brotli detected (best performance when hosted correctly)." : hasGzip ? "Gzip detected." : "No compression detected."
  );

  if (structure.notes.length) recommended.reasons.push(...structure.notes.slice(0, 3));

  return { scores, recommended };
}

function getContentType(req: NextRequest) {
  return (req.headers.get("content-type") || "").toLowerCase();
}

function decodeBase64ToBuffer(b64: string): Buffer {
  const comma = b64.indexOf(",");
  const raw = comma >= 0 ? b64.slice(comma + 1) : b64;
  return Buffer.from(raw, "base64");
}

// Returns either a scan (from JSON) OR a buffer (from ZIP upload)
async function parseIncoming(
  req: NextRequest
): Promise<
  | { mode: "scan"; scan: ScanLike; projectName: string }
  | { mode: "zip"; buffer: Buffer; projectName: string; originalName: string }
> {
  const ct = getContentType(req);

  // JSON mode: accept either { scan } OR { zipBase64 }
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => null);

    const projectName =
      typeof body?.projectName === "string" && body.projectName.trim() ? body.projectName.trim() : "Default Project";

    // ✅ Accept client scan
    if (body?.scan && typeof body.scan === "object") {
      return { mode: "scan", scan: body.scan, projectName };
    }

    // Accept base64 zip
    const zipBase64 = body?.zipBase64 || body?.zip_b64 || body?.zip;
    if (zipBase64 && typeof zipBase64 === "string") {
      const originalName = typeof body?.filename === "string" && body.filename.trim() ? body.filename.trim() : "build.zip";
      const buffer = decodeBase64ToBuffer(zipBase64);
      return { mode: "zip", buffer, projectName, originalName };
    }

    throw new Error(
      'Invalid JSON body. Expected either { "scan": {..}, "projectName": "..." } OR { "zipBase64": "<base64>", "projectName": "..." }.'
    );
  }

  // multipart/form-data
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) throw new Error("Missing ZIP file (expected form field: file)");

    const projectName = (form.get("projectName") as string) || "Default Project";
    const originalName = (file as any)?.name ? String((file as any).name) : "build.zip";
    const buffer = Buffer.from(await file.arrayBuffer());

    return { mode: "zip", buffer, projectName, originalName };
  }

  // raw bytes
  if (ct.includes("application/octet-stream") || ct.includes("application/zip")) {
    const ab = await req.arrayBuffer();
    const buffer = Buffer.from(ab);

    const projectName = req.nextUrl.searchParams.get("projectName") || "Default Project";
    const originalName = req.headers.get("x-filename") || "build.zip";

    if (!buffer.length) throw new Error("Empty request body (expected ZIP bytes).");

    return { mode: "zip", buffer, projectName, originalName };
  }

  throw new Error(
    `Unsupported Content-Type: "${ct || "missing"}". Use application/json (scan or base64 zip), multipart/form-data, or application/octet-stream.`
  );
}

type InjectResult = {
  ok: boolean;
  reason?: string;
  wroteUniversalInit: boolean;
  injectedIntoIndexHtml: boolean;
  indexHtmlPath?: string;
};

async function loadUniversalInitSource(): Promise<string> {
  const p = path.join(process.cwd(), "src", "lib", "scripts", "universal-init.js");
  return fs.readFile(p, "utf8");
}

/**
 * Injects universal-init.js into the same directory as index.html,
 * and injects <script src="universal-init.js"></script> into <head>.
 *
 * Works when index.html is at zip root OR inside a single top-level folder (or deeper).
 * We choose the shortest-path index.html found.
 */
async function injectUniversalInitIntoZip(
  zipBuffer: Buffer,
  universalInitContent: string
): Promise<{ patchedZip: Buffer; inject: InjectResult }> {
  const zip = await JSZip.loadAsync(zipBuffer);

  const allFiles = Object.keys(zip.files).filter((p) => !zip.files[p].dir);
  const indexCandidates = allFiles.filter((p) => p.toLowerCase().endsWith("index.html"));

  if (indexCandidates.length === 0) {
    return {
      patchedZip: zipBuffer,
      inject: {
        ok: false,
        reason: "index.html not found in ZIP",
        wroteUniversalInit: false,
        injectedIntoIndexHtml: false,
      },
    };
  }

  // Prefer root-most index.html (shortest path)
  indexCandidates.sort((a, b) => a.split("/").length - b.split("/").length);
  const indexHtmlPath = indexCandidates[0];

  const indexFile = zip.file(indexHtmlPath);
  if (!indexFile) {
    return {
      patchedZip: zipBuffer,
      inject: {
        ok: false,
        reason: "index.html entry missing",
        wroteUniversalInit: false,
        injectedIntoIndexHtml: false,
      },
    };
  }

  let indexHtml = await indexFile.async("string");

  const alreadyInjected =
    /<script[^>]+src=["']universal-init\.js["'][^>]*>\s*<\/script>/i.test(indexHtml);

  const dir = indexHtmlPath.includes("/")
    ? indexHtmlPath.slice(0, indexHtmlPath.lastIndexOf("/") + 1)
    : "";

  // Always write/overwrite universal-init.js next to index.html
  zip.file(`${dir}universal-init.js`, universalInitContent);

  let injectedIntoIndexHtml = false;

  if (!alreadyInjected) {
    const scriptTag = `<script src="universal-init.js"></script>\n`;

    // Best: immediately after <head ...>
    const headOpen = indexHtml.match(/<head[^>]*>/i);
    if (headOpen && headOpen.index !== undefined) {
      const insertAt = headOpen.index + headOpen[0].length;
      indexHtml = indexHtml.slice(0, insertAt) + "\n" + scriptTag + indexHtml.slice(insertAt);
      injectedIntoIndexHtml = true;
    } else {
      // Fallback: before first <script>
      const firstScriptIdx = indexHtml.search(/<script/i);
      if (firstScriptIdx >= 0) {
        indexHtml = indexHtml.slice(0, firstScriptIdx) + scriptTag + indexHtml.slice(firstScriptIdx);
        injectedIntoIndexHtml = true;
      } else {
        // Last resort: prepend
        indexHtml = scriptTag + indexHtml;
        injectedIntoIndexHtml = true;
      }
    }

    zip.file(indexHtmlPath, indexHtml);
  } else {
    injectedIntoIndexHtml = true;
  }

  const patchedZip = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  return {
    patchedZip,
    inject: {
      ok: true,
      wroteUniversalInit: true,
      injectedIntoIndexHtml,
      indexHtmlPath,
    },
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-filename",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-filename",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    // ---------- AUTH ----------
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email;
    
    // Fallback to admin for unauthenticated landing page scans
    const isFallback = !sessionEmail;
    const email: string = sessionEmail || process.env.ADMIN_EMAIL || "mikmcb@gmail.com";

    let user = await prisma.user.findUnique({ where: { email } });
    
    // Auto-provision fallback user if missing
    if (!user && isFallback) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Studio Analytics",
        },
      });
    }

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404, headers: corsHeaders });
    }

    // ---------- INPUT ----------
    const incoming = await parseIncoming(req);
    // Optional: allow clients to suggest a target (doesn't break existing)
const platformTargetRaw =
  incoming.mode === "scan"
    ? (incoming.scan?.platformTarget || (incoming as any)?.platformTarget)
    : null;

const platformTarget = (() => {
  const raw = String(platformTargetRaw ?? "WEB").toUpperCase();
  const allowed = new Set([
    "WEB",
    "MOBILE_WEB",
    "TELEGRAM",
    "META",
    "DISCORD",
    "TIKTOK",
    "YOUTUBE_PLAYABLES",
    "LINKEDIN_GAMES",
  ]);
  return allowed.has(raw) ? raw : "WEB";
})();
    const projectName = incoming.projectName;

    // ---------- UNIVERSAL INIT INJECTION (ZIP uploads only) ----------
    let inject: InjectResult = {
      ok: false,
      reason: "No ZIP provided (scan-only mode)",
      wroteUniversalInit: false,
      injectedIntoIndexHtml: false,
    };

    let bufferForScan: Buffer | null = null;

    if (incoming.mode === "zip") {
      const uniinit = await loadUniversalInitSource();
      const patched = await injectUniversalInitIntoZip(incoming.buffer, uniinit);
      bufferForScan = patched.patchedZip;
      inject = patched.inject;
    }

    // ---------- SCAN ----------
    const scan =
      incoming.mode === "scan"
        ? incoming.scan
        : await scanWebglBuildZip(bufferForScan as Buffer);

    // Attach injection telemetry into scanResult so reports can reference it
    // (non-breaking: stored as extra field)
    const scanWithInject = {
      ...scan,
      universal_init: {
        v: 1,
        ...inject,
      },
    };

    // ---------- HOST SCORING ----------
    const hostScoring = scoreHosts(scanWithInject);
    const recommendedHost = hostScoring.recommended.slug;

    // ---------- FIND / CREATE PROJECT ----------
    let project = await prisma.project.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name: projectName,
        },
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          userId: user.id,
          name: projectName,
        },
      });
    }

    // ---------- CERT ID ----------
    const certId = await generateCertId();

    const quickScore = Number.isFinite(scanWithInject?.quick_score) ? Number(scanWithInject.quick_score) : 0;
    const brotliPresent = !!scanWithInject?.compression?.brotli_present;
    const gzipPresent = !!scanWithInject?.compression?.gzip_present;

    // ---------- CREATE BUILD ----------
    const build = await prisma.build.create({
      data: {
        userId: user.id,
        projectId: project.id,

        status: "scanned",
        scanResult: scanWithInject as any,
        scannedAt: new Date(),

        quickScore,
        brotliPresent,
        gzipPresent,

        certId,
        reportStatus: "draft",
        certifiedAt: new Date(),

        // ✅ ADD HERE (TypeScript, not Prisma schema)
    platformTarget: platformTarget as any,
      },
    });

    // ---------- OPTIONAL Host table linkage ----------
    const hostRow = await prisma.host.findUnique({ where: { slug: recommendedHost } }).catch(() => null);

    // ---------- UPSERT LaunchProfile ----------
    await prisma.launchProfile.upsert({
      where: { buildId: build.id },
      update: {
        hostProvider: recommendedHost,
        readinessScore: clamp(quickScore),
        platformFitScore: clamp(quickScore),
        hostCompatibilityScore: clamp(hostScoring.recommended.score),
        recommendationsJson: {
          v: 1,
          recommendedHost,
          recommended: hostScoring.recommended,
          allHosts: hostScoring.scores,
        },
        targetHostId: hostRow?.id ?? null,
      },
      create: {
        buildId: build.id,
        hostProvider: recommendedHost,
        destinationPlatform: "unknown",
        goal: "test",
        monetization: "unknown",
        readinessScore: clamp(quickScore),
        platformFitScore: clamp(quickScore),
        hostCompatibilityScore: clamp(hostScoring.recommended.score),
        recommendationsJson: {
          v: 1,
          recommendedHost,
          recommended: hostScoring.recommended,
          allHosts: hostScoring.scores,
        },
        targetHostId: hostRow?.id ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      buildId: build.id,
      certId: build.certId,
      reportUrl: `/report/${build.certId}`,

      // return scanWithInject (keeps your existing contract plus the new telemetry)
      scan: scanWithInject,

      // quick fields for UI
      quickScore: build.quickScore,
      recommendedHost,
      hostCompatibilityScore: hostScoring.recommended.score,

      // direct injection telemetry for quick verification
      inject,
    }, {
      headers: corsHeaders
    });
  } catch (err: any) {
    const msg = err?.message || "Scan failed";
    console.error("SCAN ERROR", err);

    const isUnsupported = msg.toLowerCase().includes("unsupported content-type");
    return NextResponse.json({ ok: false, error: msg }, { status: isUnsupported ? 415 : 500, headers: corsHeaders });
  }
}