// src/app/api/report/[certId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ certId: string }> }) {
  try {
    const { certId } = await ctx.params;

    if (!certId || typeof certId !== "string") {
      return NextResponse.json({ ok: false, error: "Missing certId" }, { status: 400 });
    }

    // certId is @unique in your schema, but we use findFirst for case-insensitive fallback.
    // We order by scannedAt or createdAt DESC so that if one certId is reused (unlikely on UUIDs),
    // we get the MOST RECENT forensics.
    const build = await prisma.build.findFirst({
      where: {
        certId: {
          equals: certId,
          mode: 'insensitive' 
        }
      },
      orderBy: { createdAt: "desc" },
      include: { 
        project: true, 
        launchProfile: true 
      },
    });

    if (!build) {
      // Diagnostic: Find the latest 3 builds to see what exists in THIS database.
      const latestBuilds = await prisma.build.findMany({
          take: 3,
          orderBy: { createdAt: 'desc' },
          select: { certId: true, createdAt: true }
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Report not found",
          hint: {
            requestedCertId: certId,
            latestBuildsInThisDatabase: latestBuilds,
            serverDiagnostics: "Alpha-9 Forensic Suite (V72) Database Check"
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      build: {
        id: build.id,
        certId: build.certId,

        reportStatus: build.reportStatus,
        scannedAt: build.scannedAt,
        quickScore: build.quickScore ?? 0,

        brotliPresent: !!build.brotliPresent,
        gzipPresent: !!build.gzipPresent,

        // UI expects scanResult
        scanResult: build.scanResult ?? null,

        emulationReadiness: build.emulationReadiness ?? null,
        liveUrl: build.liveUrl ?? null,

        // publishEvidence exists in your newer flow (may not exist in DB yet)
        publishEvidence: (build as any).publishEvidence ?? null,

        project: build.project ? { id: build.project.id, name: build.project.name } : null,
        launchProfile: build.launchProfile ?? null,

        createdAt: build.createdAt,
        updatedAt: build.updatedAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to load report" },
      { status: 500 }
    );
  }
}