import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeUrl(u: string) {
  const s = (u || "").trim();
  if (!s) return "";
  if (!/^https?:\/\//i.test(s)) return `https://${s}`;
  return s;
}

function getCT(req: NextRequest) {
  return (req.headers.get("content-type") || "").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    // --- auth ---
    let isAuthorized = false;
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ? String(session.user.email).toLowerCase() : "";
    
    // V69: Localhost Admin Bypass
    const isLocalhost = req.headers.get("host")?.includes("localhost") || req.headers.get("host")?.includes("127.0.0.1");
    
    if (isLocalhost) {
        isAuthorized = true;
    } else if (email) {
        const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
        if (!adminEmail || email === adminEmail) {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    // --- parse body (JSON OR form-data) ---
    const ct = getCT(req);

    let certId = "";
    let liveUrl = "";

    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => null);

      const certRaw =
        body?.certId ?? body?.certid ?? body?.CertId ?? body?.CERTID ?? body?.certificateId ?? body?.certificateID;

      const urlRaw =
        body?.liveUrl ?? body?.liveurl ?? body?.LiveUrl ?? body?.url ?? body?.deployUrl ?? body?.deploymentUrl;

      certId = typeof certRaw === "string" ? certRaw.trim() : "";
      liveUrl = typeof urlRaw === "string" ? normalizeUrl(urlRaw) : "";
    } else if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      const certRaw =
        form.get("certId") ?? form.get("certid") ?? form.get("CertId") ?? form.get("CERTID") ?? form.get("certificateId");

      const urlRaw =
        form.get("liveUrl") ?? form.get("liveurl") ?? form.get("LiveUrl") ?? form.get("url") ?? form.get("deployUrl");

      certId = typeof certRaw === "string" ? certRaw.trim() : "";
      liveUrl = typeof urlRaw === "string" ? normalizeUrl(urlRaw) : "";
    } else {
      // still try JSON as a fallback
      const body = await req.json().catch(() => null);
      certId = typeof body?.certId === "string" ? body.certId.trim() : "";
      liveUrl = typeof body?.liveUrl === "string" ? normalizeUrl(body.liveUrl) : "";
    }

    if (!certId || !liveUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing data",
          debug: {
            received: { certId: !!certId, liveUrl: !!liveUrl },
            contentType: ct || "missing",
          },
        },
        { status: 400 }
      );
    }

    // --- update build ---
    const build = await prisma.build.findFirst({
      where: { certId },
      orderBy: { scannedAt: "desc" },
      select: { id: true, certId: true, platformTarget: true },
    });

    if (!build) {
      return NextResponse.json({ ok: false, error: "Build not found for certId" }, { status: 404 });
    }

    let newCertId = build.certId || "";
    if (build.platformTarget === "META" && !newCertId.includes("-META-")) {
      newCertId = newCertId.replace("WGL-CERT-", "WGL-CERT-META-");
    } else if (build.platformTarget === "DISCORD" && !newCertId.includes("-DISC-")) {
      newCertId = newCertId.replace("WGL-CERT-", "WGL-CERT-DISC-");
    } else if (build.platformTarget === "YOUTUBE_PLAYABLES" && !newCertId.includes("-YT-")) {
      newCertId = newCertId.replace("WGL-CERT-", "WGL-CERT-YT-");
    } else if (build.platformTarget === "LINKEDIN_GAMES" && !newCertId.includes("-ENT-")) {
      newCertId = newCertId.replace("WGL-CERT-", "WGL-CERT-ENT-");
    } else if (build.platformTarget === "TELEGRAM" && !newCertId.includes("-TG-")) {
      newCertId = newCertId.replace("WGL-CERT-", "WGL-CERT-TG-");
    }

    const updated = await prisma.build.update({
      where: { id: build.id },
      data: {
        certId: newCertId,
        liveUrl,
        reportStatus: "issued",
        certifiedAt: new Date(),
      },
      select: { certId: true, liveUrl: true, reportStatus: true, certifiedAt: true },
    });

    return NextResponse.json({ ok: true, updated });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed to issue certificate" }, { status: 500 });
  }
}