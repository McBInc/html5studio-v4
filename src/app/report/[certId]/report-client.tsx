"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type BuildShape = {
  id: string;
  certId: string | null;
  reportStatus: string;
  scannedAt: string | Date | null;
  quickScore: number | null;
  brotliPresent: boolean | null;
  gzipPresent: boolean | null;
  scanResult: any;
  liveUrl: string | null;
  clipUrl?: string | null;
  certifiedAt?: string | Date | null;
  project?: { id: string; name: string } | null;
  launchProfile?: any | null;
};

type ApiWrapped =
  | { ok: true; build: BuildShape }
  | { ok: false; error: string; hint?: any };

type ApiFlat =
  | {
    ok: true;
    certId: string;
    buildId: string;
    projectName: string;
    scannedAt: string | Date | null;
    quickScore: number;
    brotliPresent: boolean;
    gzipPresent: boolean;
    scan: any;
    launchProfile: any;
    reportStatus?: string | null;
    certifiedAt?: string | Date | null;
    liveUrl?: string | null;
    clipUrl?: string | null;
  }
  | { ok: false; error: string; hint?: any };

type AnyReport = ApiWrapped | ApiFlat;

type MePayload = { ok: true; email: string } | { error: string };

function fmtDate(d: any) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d instanceof Date ? d : null;
    if (!dt) return "—";
    return dt.toLocaleString();
  } catch {
    return "—";
  }
}

function safeString(v: any) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function normalize(report: AnyReport, certIdFromUrl: string) {
  if (!report || typeof report !== "object") {
    return { ok: false as const, error: "Bad report payload" };
  }
  if ("ok" in report && report.ok === false) return report;

  // Wrapped shape: { ok: true, build: {...} }
  if ("build" in report && (report as any).build) {
    const b = (report as any).build as BuildShape;
    return {
      ok: true as const,
      certId: b.certId || certIdFromUrl || "",
      buildId: b.id,
      projectName: b.project?.name || "Untitled Project",
      scannedAt: b.scannedAt ?? null,
      quickScore: Number.isFinite(b.quickScore as any) ? Number(b.quickScore) : 0,
      brotliPresent: !!b.brotliPresent,
      gzipPresent: !!b.gzipPresent,
      scan: b.scanResult ?? null,
      launchProfile: b.launchProfile ?? null,
      reportStatus: b.reportStatus ?? "draft",
      certifiedAt: (b as any).certifiedAt ?? null,
      liveUrl: b.liveUrl ?? null,
      clipUrl: (b as any).clipUrl ?? null,
      _raw: report,
    };
  }

  // Flat shape (older / alternate)
  const r = report as any;
  return {
    ok: true as const,
    certId: r.certId || certIdFromUrl || "",
    buildId: r.buildId || "",
    projectName: r.projectName || "Untitled Project",
    scannedAt: r.scannedAt ?? null,
    quickScore: Number.isFinite(r.quickScore) ? Number(r.quickScore) : 0,
    brotliPresent: !!r.brotliPresent,
    gzipPresent: !!r.gzipPresent,
    scan: r.scan ?? null,
    launchProfile: r.launchProfile ?? null,
    reportStatus: r.reportStatus ?? "draft",
    certifiedAt: r.certifiedAt ?? null,
    liveUrl: r.liveUrl ?? null,
    clipUrl: r.clipUrl ?? null,
    _raw: report,
  };
}

export default function ReportClient({
  certId,
  initial,
}: {
  certId: string;
  initial: AnyReport;
}) {
  const { status } = useSession();

  const [raw, setRaw] = useState<any>(initial);
  const [me, setMe] = useState<MePayload | null>(null);

  const n = useMemo(() => normalize(raw as AnyReport, certId), [raw, certId]);

  // Admin issue cert
  const [liveUrlInput, setLiveUrlInput] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [issueMsg, setIssueMsg] = useState<string | null>(null);

  // Patch/download (now redirects to /, no ZIP upload here)
  const [patchMsg, setPatchMsg] = useState<string | null>(null);

  async function loadMe() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      setMe((await res.json()) as MePayload);
    } catch { }
  }

  async function refreshReport() {
    if (!certId) return;
    const res = await fetch(`/api/report/${encodeURIComponent(certId)}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({ ok: false, error: "Bad JSON" }));
    setRaw(json);
  }

  useEffect(() => {
    // Always refresh once on mount to avoid SSR quirks
    void refreshReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certId]);

  useEffect(() => {
    if (status === "authenticated") void loadMe();
    else setMe(null);
  }, [status]);

  useEffect(() => {
    if (n.ok) setLiveUrlInput(safeString(n.liveUrl));
  }, [n.ok, (n as any).liveUrl]);

  const isAdmin = useMemo(() => {
    // V68: Localhost Admin Bypass
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return true;
    }
    const email = me && "ok" in me && (me as any).ok ? String((me as any).email || "").toLowerCase() : "";
    return !!email;
  }, [me]);

  async function issueCertificate() {
    setIssueMsg(null);
    const liveUrlTrim = liveUrlInput.trim();
    const cert = n.ok ? n.certId : certId;

    if (!cert) return setIssueMsg("Internal error: missing certId");
    if (!liveUrlTrim) return setIssueMsg("Paste a Live URL first.");

    setIssuing(true);
    try {
      const res = await fetch("/api/admin/set-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certId: cert, liveUrl: liveUrlTrim }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) return setIssueMsg(json?.error || `Issue failed (${res.status})`);

      setIssueMsg("✅ Certificate issued! This page is now officially certified. Send this URL to your client.");
      if (json.updated?.certId && json.updated.certId !== cert) {
        window.location.href = `/report/${json.updated.certId}`;
        return;
      }
      await refreshReport();
    } catch (e: any) {
      setIssueMsg(e?.message || "Issue failed");
    } finally {
      setIssuing(false);
    }
  }

  function goDownloadFixPack() {
    const id = (n.ok ? n.certId : certId) || "";
    // We route back to / and let the user generate the ZIP locally (no /api/patch upload).
    // Pass certId so the homepage can show "continue from this cert" later if you add that.
    const url = id ? `/?certId=${encodeURIComponent(id)}` : "/";
    window.location.href = url;
  }

  const headerCert = n.ok ? n.certId : certId || "(missing)";

  return (
    <div style={{ padding: "40px 60px", maxWidth: 1000, margin: "40px auto 80px", border: "14px solid #1a1a1a", outline: "4px solid #1a1a1a", outlineOffset: "6px", backgroundColor: "#ffffff", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", borderRadius: 4 }}>
      {/* Fancy seal mark */}
      <div style={{ position: "absolute", top: 50, right: 60, width: 90, height: 90, border: "6px double #1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textTransform: "uppercase", fontWeight: 900, fontSize: 12, textAlign: "center", letterSpacing: 2, opacity: 0.08, transform: "rotate(-12deg)" }}>
        HTML5<br />SECURE
      </div>

      <div style={{ textAlign: "center", marginBottom: 40, borderBottom: "2px solid #eaeaea", paddingBottom: 30 }}>
        <h1 style={{ fontSize: 46, margin: 0, textTransform: "uppercase", letterSpacing: 4, fontFamily: "Georgia, serif", color: "#111" }}>Official Certificate</h1>
        <div style={{ fontSize: 18, marginTop: 12, opacity: 0.6, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>WebGL Platform Compliance & Security</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.5, fontWeight: 900 }}>Licensed Software</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 6, color: "#222" }}>{n.ok ? n.projectName : "—"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.5, fontWeight: 900 }}>Certificate ID</div>
          <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, marginTop: 6, color: "#222" }}>{headerCert}</div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 14, border: "1px solid #eee", background: "#fafafa" }}>
        <div style={{ fontWeight: 900 }}>Status</div>

        {n.ok ? (
          <>
            <div style={{ marginTop: 8 }}>
              Report: <b>{safeString(n.reportStatus || "draft")}</b>
            </div>
            <div style={{ marginTop: 6 }}>
              Quick Score: <b>{n.quickScore}</b> • Brotli: <b>{String(n.brotliPresent)}</b>
            </div>

            {/* V77: Robust First-Class Column Mapping */}
            {(n as any)._raw?.build?.emulationReadiness && (
              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                <div style={{ padding: "8px 12px", border: "1px solid #111", background: "#111", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: "900", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>🍎</span> iOS Certified ({(n as any)._raw.build.emulationReadiness.ios_score}%)
                </div>
                <div style={{ padding: "8px 12px", border: "1px solid #111", background: "#111", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: "900", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>🤖</span> Android Certified ({(n as any)._raw.build.emulationReadiness.android_score}%)
                </div>
              </div>
            )}
            {n.scan?.meta && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fff5f5", border: "1px solid #ffdddd", color: "#d32f2f" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span>⚠️ META SUNSET: SEPT 30</span>
                  <span>Compliance Score: {n.scan.meta.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  {n.scan.meta.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> Failures detected. Upgrade to Certified Migration to inject SDK v8.0 and patch legacy PII leaks.
                    </span>
                  ) : (
                    <span>
                      <b>Zero-Friction Ready:</b> Build passes v8.0 and privacy checks.
                    </span>
                  )}
                </div>
              </div>
            )}
            {n.scan?.discord && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#f0f4ff", border: "1px solid #c2d1ff", color: "#314cb6" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span>📢 DISCORD PERMISSION SPLIT (FEB 23)</span>
                  <span>Compliance Score: {n.scan.discord.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  {n.scan.discord.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> Failures detected. Upgrade to Certified Migration to inject SDK v1.8 and patch legacy scopes (`MANAGE_GUILD`).
                    </span>
                  ) : (
                    <span>
                      <b>Compliance Passed:</b> Build passes v1.8 and granular privacy checks.
                    </span>
                  )}
                </div>
              </div>
            )}
            {n.scan?.youtube && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#ffebee", border: "1px solid #ffcdd2", color: "#c62828" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span>🚨 YOUTUBE PLAYABLES RESTRICTIONS</span>
                  <span>Compliance Score: {n.scan.youtube.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div style={{ marginBottom: 4 }}>
                    <b>Initial Bundle:</b> {n.scan.youtube.metrics.initialBundleSizeMiB} MiB / 30 MiB
                    <span style={{ marginLeft: 8 }}>|</span>
                    <span style={{ marginLeft: 8 }}><b>Total:</b> {n.scan.youtube.metrics.totalBundleSizeMiB} MiB / 250 MiB</span>
                  </div>
                  {n.scan.youtube.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> Constraints violated (Size / Strict relative pathing). Please review the integration constraints.
                    </span>
                  ) : (
                    <span>
                      <b>Compliance Passed:</b> File limits, memory heap, pathing rules, and SDK constraints are met.
                    </span>
                  )}
                </div>
              </div>
            )}
            {n.scan?.tiktok && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#000000", border: "1px solid #333333", color: "#69C9D0" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span><span style={{ color: "#EE1D52" }}>🎵</span> TIKTOK UX STANDARDS </span>
                  <span>Compliance Score: {n.scan.tiktok.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4, color: "#FFFFFF" }}>
                  {n.scan.tiktok.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> Constraints violated. Upgrade to Certified Migration to inject the TikTok Canvas Bridge to prevent "Swipe to Exit" lag.
                    </span>
                  ) : (
                    <span>
                      <b>Compliance Passed:</b> Touch-Event suppression and Safe-Area layouts are verified.
                    </span>
                  )}
                </div>
              </div>
            )}
            {n.scan?.linkedin && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#f0f7fc", border: "1px solid #c2e0f4", color: "#006097" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span><span style={{ color: "#0a66c2" }}>👔</span> LINKEDIN B2B PRIVACY AUDIT </span>
                  <span>Compliance Score: {n.scan.linkedin.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  {n.scan.linkedin.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> Unconsented Analytics/PII detected! Upgrade to Certified Migration to inject the Corporate Firewall and remove rogue pixels.
                    </span>
                  ) : (
                    <span>
                      <b>Compliance Passed:</b> Zero-PII constraints verified. The build is safe for Enterprise B2B distribution.
                    </span>
                  )}
                </div>
              </div>
            )}
            {n.scan?.telegram && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#f0f8ff", border: "1px solid #c2e0ff", color: "#0088cc" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span><span style={{ color: "#2AABEE" }}>✈️</span> TELEGRAM MINI APP STANDARDS </span>
                  <span>Compliance Score: {n.scan.telegram.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  {n.scan.telegram.criticalFailures?.some((f: any) => f.id.includes("TG_SDK_MISSING")) && (
                    <div style={{ marginBottom: 4 }}>
                      <b>Action Required:</b> Web App SDK missing. Upgrade to Certified Migration to inject the Telegram Bridge. This unlocks fullscreen mode and protects URL routing!
                    </div>
                  )}
                  {n.scan.telegram.criticalFailures?.some((f: any) => f.id === "TMA_STARS_STUB") && (
                    <div style={{ marginBottom: 4 }}>
                      <b>Warning:</b> No Stars bridge found! Scan Assets/Plugins for TelegramPayment.jslib. Required for Producer tier revenue via Telegram Stars.
                    </div>
                  )}
                  {(!n.scan.telegram.criticalFailures || n.scan.telegram.criticalFailures.length === 0) && (
                    <div>
                      <b>Compliance Passed:</b> The Web App expanding viewport bridge is locked in. Ready for the Telegram community!
                    </div>
                  )}
                </div>
              </div>
            )}
            {n.scan?.poki && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fffdf0", border: "1px solid #ffeeba", color: "#856404" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span>🌀 POKI UNIVERSAL SCALABILITY AUDIT</span>
                  <span>Compliance Score: {n.scan.poki.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div style={{ marginBottom: 4 }}>
                    <b>Initial Payload:</b> {n.scan.poki.metrics.initialPayloadSizeMB.toFixed(2)} MB / 8.00 MB
                    <span style={{ marginLeft: 8 }}>|</span>
                    <span style={{ marginLeft: 8 }}><b>Scaling:</b> {n.scan.poki.metrics.hasAspectRatioListener ? "16:9 Verified" : "Missing Listener"}</span>
                  </div>
                  {n.scan.poki.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> {n.scan.poki.criticalFailures[0].description} {n.scan.poki.criticalFailures[0].remediation}
                    </span>
                  ) : (
                    <span>
                      <b>Self-Contained Ready:</b> No external CDN violations detected. Scalability targets met.
                    </span>
                  )}
                </div>
              </div>
            )}
            {n.scan?.crazygames && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fdf0ff", border: "1px solid #ebbaff", color: "#6f0485" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span>🎮 CRAZYGAMES SDK HOOK AUDIT</span>
                  <span>Compliance Score: {n.scan.crazygames.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div style={{ marginBottom: 4 }}>
                    <b>Hooks:</b> {n.scan.crazygames.checks.gameplay_hooks_ok ? "gameplay_start/stop Detected" : "Hooks Missing"}
                    <span style={{ marginLeft: 8 }}>|</span>
                    <span style={{ marginLeft: 8 }}><b>Compression:</b> {n.scan.crazygames.checks.compression_ok ? "Verified" : "Missing Headers"}</span>
                  </div>
                  {n.scan.crazygames.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> {n.scan.crazygames.criticalFailures[0].description} Upgrade to Certified Migration to inject SDK Modules.
                    </span>
                  ) : (
                    <span>
                      <b>Monetization Ready:</b> Gameplay transitions and happytime hooks are verified.
                    </span>
                  )}
                </div>
              </div>
            )}
            {n.scan?.tencent && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fff5f0", border: "1px solid #ffccba", color: "#851e04" }}>
                <div style={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                  <span>⛩️ TENCENT/WECHAT REGULATORY SCAN</span>
                  <span>Compliance Score: {n.scan.tencent.score}/100</span>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div style={{ marginBottom: 4 }}>
                    <b>PIPL 2026:</b> {n.scan.tencent.checks.pipl_2026_ok ? "Privacy Guard Active" : "Violation Detected"}
                    <span style={{ marginLeft: 8 }}>|</span>
                    <span style={{ marginLeft: 8 }}><b>Payments:</b> {n.scan.tencent.checks.payment_gates_ok ? "Midas Ready" : "Restricted Gate"}</span>
                  </div>
                  {n.scan.tencent.criticalFailures?.length > 0 ? (
                    <span>
                      <b>Action Required:</b> {n.scan.tencent.criticalFailures[0].description} {n.scan.tencent.criticalFailures[0].remediation}
                    </span>
                  ) : (
                    <span>
                      <b>Mainland Ready:</b> Build complies with Custom WeChat Kernel and PIPL 2026 mandates.
                    </span>
                  )}
                </div>
              </div>
            )}
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
              Scanned: {fmtDate(n.scannedAt)} • Build ID:{" "}
              <span style={{ fontFamily: "monospace" }}>{n.buildId}</span>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 8, color: "crimson" }}>Error: {safeString((n as any).error || "Report not loaded")}</div>
        )}

        <button
          onClick={() => refreshReport()}
          style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff" }}
          type="button"
        >
          Reload Report
        </button>
      </div>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 14, border: "1px solid #eee", background: "#fff" }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>1) Apply Platform FixPacks</div>
        <div style={{ opacity: 0.8, fontSize: 13 }}>
          Platform SDK injections (Meta, TikTok, Telegram) and Hosting fixes (Vercel, Netlify) are generated seamlessly inside your browser on the Upload Dashboard to eliminate server size constraints.
          <br /><br />
          <b>Note:</b> You must apply these patches immediately after uploading your file. If you have navigated away, you will need to select your `.zip` file again on the dashboard to apply new patches.
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <a
            href="/history"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            📋 View Client Projects (History)
          </a>
          <button
            onClick={() => window.print()}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#fff",
              color: "#111",
              cursor: "pointer",
              fontWeight: 900,
            }}
            type="button"
          >
            🖨️ Print Certificate
          </button>
        </div>

        {/* Next Step Section */}
        <div style={{ marginTop: 24, padding: 14, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#334155" }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>✅ Next Steps: Staging vs Certification</div>

          <div style={{ fontSize: 13, marginBottom: 10, lineHeight: 1.6 }}>
            <b>Phase 1 (Diagnostic):</b> To show your client the game works and the <span style={{ fontFamily: "monospace", fontSize: 11 }}>HUD Diagnosis</span>, download a <b>Repo-Ready FixPack</b> (Netlify selected) from the Dashboard. Drag and drop it into Netlify Drop to generate a staging <code>netlify.app</code> link to send them.
          </div>

          <div style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>
            <b>Phase 2 (Certification):</b> Once they give you Developer access, deploy the <b>Platform Certified .zip</b> (Meta, TikTok, Telegram) directly into their platform console. Paste that final <code>Live Platform URL</code> below to issue the official compliance certificate.
          </div>

          <a
            href="https://app.netlify.com/drop"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 8,
              background: "#00c7b7", // Netlify Teal
              color: "#fff",
              fontWeight: 900,
              textDecoration: "none",
              fontSize: 14
            }}
          >
            Launch Diagnostic on Netlify Drop ↗
          </a>
        </div>

        {patchMsg && <div style={{ marginTop: 10, opacity: 0.9 }}>{patchMsg}</div>}
      </div>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 14, border: "1px solid #eee", background: "#fff" }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>2) Deploy + Issue Certificate</div>

        {n.ok && n.liveUrl ? (
          <div style={{ opacity: 0.9 }}>
            Live URL:{" "}
            <a href={n.liveUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
              {n.liveUrl}
            </a>
            <div style={{ marginTop: 10, padding: 10, background: "#d1fae5", color: "#065f46", border: "1px solid #34d399", borderRadius: 8, fontSize: 13, fontWeight: "bold" }}>
              🎉 This page is now an official compliance certificate. You can send this exact Report URL to your client!
            </div>
          </div>
        ) : (
          <div style={{ opacity: 0.75 }}>Live URL: Pending</div>
        )}

        <div style={{ marginTop: 10, opacity: 0.8 }}>Issued at: {fmtDate(n.ok ? n.certifiedAt : null)}</div>

        {isAdmin && (
          <div style={{ marginTop: 14, padding: 14, borderRadius: 12, border: "1px solid #111" }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Admin — Issue Certificate</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input
                value={liveUrlInput}
                onChange={(e) => setLiveUrlInput(e.target.value)}
                placeholder="Paste the Netlify Live URL (https://...)"
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", minWidth: 360, flex: 1 }}
              />
              <button
                onClick={issueCertificate}
                disabled={issuing}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #111",
                  background: issuing ? "#ddd" : "#111",
                  color: "#fff",
                  cursor: issuing ? "not-allowed" : "pointer",
                  fontWeight: 900,
                }}
                type="button"
              >
                {issuing ? "Issuing…" : "Issue Certificate"}
              </button>
            </div>
            {issueMsg && <div style={{ marginTop: 10, opacity: 0.9 }}>{issueMsg}</div>}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 14, border: "1px solid #eee", background: "#0b0b0b", color: "#7CFC00" }}>
        <div style={{ fontFamily: "monospace", fontWeight: 900, marginBottom: 8 }}>Debug: raw /api/report response</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(raw, null, 2)}</pre>
      </div>
    </div>
  );
}