// src/app/api/scanbuild/route.ts
// [V38: ZERO-DEPENDENCY FORENSIC INGESTION]

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scanWebglBuildZip } from "@/lib/scanners/scanWebglBuildZip";
import { generateCertId } from "@/lib/cert/generateCertId";
import { patchPlatformHooksInZip } from "@/lib/patchers/platformInjection";
import AdmZip from "adm-zip";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "http://localhost:5173";
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
  
  try {
    console.log(`[V38-BRIDGE] Ingesting Forensic Payload...`);
    
    // 1. Parse Inbound
    const form = await req.formData();
    const file = form.get("file") as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Platform & Forensic Path
    const platformTarget = (req.nextUrl.searchParams.get("platform") || "WEB").toUpperCase();
    const certId = req.nextUrl.searchParams.get("certId") || await generateCertId();
    
    // 2.5 Auto-Injection Handshake (V55 Expansion)
    let finalBuffer = buffer;
    if (["POKI", "CRAZYGAMES", "TENCENT_WECHAT"].includes(platformTarget)) {
        console.log(`[V55-INJECTOR] Patching ${platformTarget} Hooks...`);
        const { outZip } = await patchPlatformHooksInZip(buffer);
        finalBuffer = outZip;
    }

    const emulationPath = path.join(process.cwd(), "public", "temp-builds", certId);

    // 3. Extraction (Non-Blocking Baseline)
    await fs.mkdir(emulationPath, { recursive: true });
    const zip = new AdmZip(finalBuffer);
    zip.extractAllTo(emulationPath, true);

    // 4. Audit
    const scan = await scanWebglBuildZip(finalBuffer, platformTarget);
    
    // 5. Database Commit (RESTORED & REALIGNED)
    let user = await prisma.user.findFirst({ where: { email: "mikmcb@gmail.com" } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: "mikmcb@gmail.com", name: "Alpha-9 Agent" }
      });
    }

    // Every Build MUST belong to a Project in your schema
    let project = await prisma.project.findFirst({ 
      where: { userId: user.id, name: "Alpha-9 Forensic Suite" } 
    });

    if (!project) {
        project = await prisma.project.create({
            data: { userId: user.id, name: "Alpha-9 Forensic Suite" }
        });
    }

    const build = await prisma.build.create({
      data: {
        certId,
        projectId: project.id,
        userId: user.id,
        status: "certified",
        platformTarget,
        reportStatus: "draft",
        scannedAt: new Date(),
        scanResult: scan as any,
        emulationReadiness: (scan as any).emulation_readiness || null,
        quickScore: (scan as any).quick_score || 0,
        brotliPresent: (scan as any).compression?.brotli_present ?? false,
        gzipPresent: (scan as any).compression?.gzip_present ?? false,
      }
    });

    console.log(`[V55-BASELINE] SUCCESS. Cert: ${certId}`);

    return NextResponse.json({
      ok: true,
      buildId: build.id,
      certId: certId,
      reportUrl: `/report/${certId}`,
      scan,
      emulationUrl: `/temp-builds/${certId}/index.html`,
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("[V38-BRIDGE] FATAL ERROR:", error.message);
    return NextResponse.json(
      { ok: false, error: "Ingestion Failure", detail: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}