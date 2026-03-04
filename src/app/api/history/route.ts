// src/app/api/history/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.trim().toLowerCase() ?? "";

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ ok: true, email, projects: [] });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        builds: {
          orderBy: { createdAt: "desc" },
          include: { launchProfile: true },
        },
      },
    });

    const shaped = projects.map((p) => ({
      id: p.id,
      name: p.name,
      builds: p.builds.map((b) => ({
        id: b.id,
        createdAt: b.createdAt,
        scannedAt: b.scannedAt,
        quickScore: b.quickScore,
        brotliPresent: b.brotliPresent,
        gzipPresent: b.gzipPresent,
        status: b.status,
        versionLabel: b.versionLabel,
        buildNumber: b.buildNumber,
        certId: b.certId,
        launch: b.launchProfile
          ? {
            readinessScore: b.launchProfile.readinessScore,
            platformFitScore: b.launchProfile.platformFitScore,
            hostCompatibilityScore: b.launchProfile.hostCompatibilityScore,
            targetPlatformId: b.launchProfile.targetPlatformId,
            targetHostId: b.launchProfile.targetHostId,
          }
          : null,
      })),
    }));

    return NextResponse.json({ ok: true, email, projects: shaped });
  } catch (err) {
    console.error("/api/history error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
