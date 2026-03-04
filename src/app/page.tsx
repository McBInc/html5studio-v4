// src/app/page.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import JSZip from "jszip";
import { generateFixPack, type ScanResponse } from "@/lib/fixpack/generateFixPack";
import { runBrowserPlatformAudits } from "@/lib/scanners/browserPlatformAudits";
import { applyPlatformPatchBrowser } from "@/lib/patches/browserPlatformPatchers";
import { useSession, signIn } from "next-auth/react";

type MePayload =
  | { ok: true; email: string; fixPackUses: number; remainingFreeUses: number; subscriptionActive: boolean }
  | { error: string };

type HostKey = "vercel" | "netlify" | "nginx" | "apache" | "generic";

function recommendHostFromScan(scan: ScanResponse | null): { host: HostKey; label: string; reason: string } {
  if (!scan) return { host: "netlify", label: "Netlify", reason: "Reliable default for first-time online testing." };
  if (scan.compression?.brotli_present)
    return { host: "netlify", label: "Netlify", reason: "Brotli detected — easiest to apply correct headers quickly." };
  if (scan.compression?.gzip_present)
    return { host: "vercel", label: "Vercel", reason: "Gzip detected — clean default for quick testing links." };
  return { host: "generic", label: "Generic Web Host", reason: "No compression detected — ensure WASM MIME + caching." };
}

function scoreBand(score: number) {
  if (score >= 90) return { label: "Ready for deployment", message: "Low risk of hosting-related failures." };
  if (score >= 75) return { label: "Deployable", message: "Should work — Fix Pack reduces edge-case failures." };
  if (score >= 50) return { label: "Hosting fixes required", message: "High chance of failure without correct headers/MIME." };
  if (score >= 25) return { label: "High deployment risk", message: "Very likely to fail online unless corrected." };
  return { label: "Deployment will fail", message: "Critical WebGL components or assumptions are missing." };
}

function hostLabel(h: HostKey) {
  if (h === "vercel") return "Vercel";
  if (h === "netlify") return "Netlify";
  if (h === "nginx") return "Nginx";
  if (h === "apache") return "Apache";
  return "Generic Web Host";
}

function slugify(input: string) {
  const s = (input || "webgl-game").trim().toLowerCase();
  const cleaned = s
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "webgl-game";
}

/**
 * Finds the Unity WebGL "root folder" inside arbitrary zip layouts.
 * We search for an index.html whose sibling folders include Build/ and TemplateData/.
 * Returns a prefix ("" means zip root).
 */
function findUnityRootPrefix(entryNames: string[]) {
  const norm = (n: string) => n.replace(/\\/g, "/").replace(/^\/+/, "");
  const names = entryNames.map(norm).filter(Boolean);

  const filtered = names.filter((n) => {
    const low = n.toLowerCase();
    if (low.startsWith("__macosx/")) return false;
    if (low.endsWith(".ds_store")) return false;
    return true;
  });

  const indexFiles = filtered.filter((n) => n.toLowerCase() === "index.html" || n.toLowerCase().endsWith("/index.html"));

  const dirOf = (path: string) => {
    if (path.toLowerCase() === "index.html") return "";
    const i = path.lastIndexOf("/");
    return i >= 0 ? path.slice(0, i + 1) : "";
  };

  for (const idx of indexFiles) {
    const prefix = dirOf(idx);
    const hasBuild = filtered.some((n) => n.toLowerCase().startsWith((prefix + "build/").toLowerCase()));
    const hasTemplate = filtered.some((n) => n.toLowerCase().startsWith((prefix + "templatedata/").toLowerCase()));
    if (hasBuild && hasTemplate) return { prefix };
  }

  for (const idx of indexFiles) {
    const prefix = dirOf(idx);
    const hasBuild = filtered.some((n) => n.toLowerCase().startsWith((prefix + "build/").toLowerCase()));
    if (hasBuild) return { prefix };
  }

  return { prefix: null as string | null };
}

export default function HomePage() {
  const { status } = useSession();

  const [targetHost, setTargetHost] = useState<HostKey>("netlify");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [scan, setScan] = useState<ScanResponse | null>(null);

  const [savedBuildId, setSavedBuildId] = useState<string | null>(null);
  const [certId, setCertId] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const PROJECT_KEY = "unity_html5_project_name_v1";
  const [projectName, setProjectName] = useState<string>("Untitled Game");

  const [me, setMe] = useState<MePayload | null>(null);

  useEffect(() => {
    try {
      const savedProject = localStorage.getItem(PROJECT_KEY) || "Untitled Game";
      setProjectName(savedProject);
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PROJECT_KEY, projectName || "Untitled Game");
    } catch { }
  }, [projectName]);

  async function refreshMe() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const json = (await res.json()) as MePayload;
      setMe(json);
    } catch { }
  }

  useEffect(() => {
    if (status === "authenticated") void refreshMe();
    else setMe(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const remainingDeployments = me && "ok" in me && (me as any).ok ? (me as any).remainingFreeUses : null;
  const isFreeLimitReached = remainingDeployments === 0;

  const humanMem = useMemo(() => {
    if (!scan?.memory_settings_detected_bytes?.length) return null;
    return scan.memory_settings_detected_bytes.map((b) => `${Math.round(b / 1024 / 1024)} MB`).join(", ");
  }, [scan]);

  const recommendation = useMemo(() => recommendHostFromScan(scan), [scan]);

  const scoreInfo = useMemo(() => {
    if (!scan) return null;
    const band = scoreBand(scan.quick_score);
    return { score: scan.quick_score, bandLabel: band.label, bandMessage: band.message };
  }, [scan]);

  function getBrand() {
    return {
      productName: "Unity → HTML5 Studio",
      website: typeof window !== "undefined" ? window.location.origin : "",
    };
  }

  async function persistScan(s: ScanResponse) {
    const res = await fetch("/api/scanbuild", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName: projectName || "Untitled Game",
        scan: s,
        buildSizeMB: file ? Math.round(file.size / 1024 / 1024) : undefined,
        source: "client",
      }),
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok || !payload?.ok) throw new Error(payload?.error || "Failed to save scan");

    if (payload?.buildId) setSavedBuildId(payload.buildId);
    if (payload?.certId) setCertId(payload.certId);
    if (payload?.reportUrl) setReportUrl(payload.reportUrl);
  }

  async function runScan() {
    if (!file) return;

    setBusy(true);
    setErr(null);
    setScan(null);
    setSavedBuildId(null);
    setCertId(null);
    setReportUrl(null);

    try {
      const ab = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(ab);

      const entries = Object.values(zip.files).filter((z) => !z.dir);
      const lower = (s: string) => s.toLowerCase();

      const brotli_present = entries.some((e) => lower(e.name).endsWith(".br"));
      const gzip_present = entries.some((e) => lower(e.name).endsWith(".gz"));

      const loaderFiles = entries
        .filter((e) => lower(e.name).endsWith(".js"))
        .filter((e) => lower(e.name).includes("loader"));

      let memory_settings_detected_bytes: number[] = [];
      for (const lf of loaderFiles.slice(0, 5)) {
        try {
          const text = await zip.file(lf.name)!.async("string");
          const matches = [...text.matchAll(/(TOTAL_MEMORY|totalMemory|memory)\s*[:=]\s*(\d{7,12})/g)];
          for (const m of matches) {
            const n = Number(m[2]);
            if (Number.isFinite(n) && n > 32 * 1024 * 1024 && n < 8 * 1024 * 1024 * 1024) {
              memory_settings_detected_bytes.push(n);
            }
          }
        } catch { }
      }
      memory_settings_detected_bytes = Array.from(new Set(memory_settings_detected_bytes)).sort((a, b) => a - b);

      const hasSuffix = (name: string, suffixes: string[]) => suffixes.some((s) => lower(name).endsWith(s));
      const hasData = entries.some((e) => hasSuffix(e.name, [".data", ".data.br", ".data.gz"]));
      const hasWasm = entries.some((e) => hasSuffix(e.name, [".wasm", ".wasm.br", ".wasm.gz"]));
      const hasLoader = loaderFiles.length > 0;

      let quick_score = 50;
      if (brotli_present) quick_score += 20;
      if (gzip_present) quick_score += 10;
      if (hasData && hasWasm && hasLoader) quick_score += 15;
      if (!hasWasm) quick_score -= 25;
      if (!hasLoader) quick_score -= 25;
      quick_score = Math.max(0, Math.min(100, quick_score));

      const hosting_checks: { check: string; severity: "info" | "medium" | "high" }[] = [];
      if (brotli_present)
        hosting_checks.push({ check: "Brotli assets detected (.br). Host must send Content-Encoding: br.", severity: "high" });
      if (gzip_present)
        hosting_checks.push({ check: "Gzip assets detected (.gz). Host must send Content-Encoding: gzip.", severity: "medium" });
      hosting_checks.push({ check: "Ensure .wasm is served with MIME type: application/wasm", severity: "high" });
      hosting_checks.push({ check: "Set long cache headers for immutable build files to improve load speed.", severity: "info" });

      const IMPORTANT_SUFFIXES = [
        ".data",
        ".data.br",
        ".data.gz",
        ".wasm",
        ".wasm.br",
        ".wasm.gz",
        ".framework.js",
        ".framework.js.br",
        ".framework.js.gz",
        ".loader.js",
        ".loader.js.br",
        ".loader.js.gz",
        "index.html",
      ];

      const isImportant = (name: string) => {
        const n = lower(name);
        return IMPORTANT_SUFFIXES.some((suf) => n.endsWith(suf)) || n.includes("build/");
      };

      const targets = [...entries.filter((e) => isImportant(e.name)), ...entries.filter((e) => !isImportant(e.name)).slice(0, 25)];
      const uniqTargets = Array.from(new Map(targets.map((t) => [t.name, t])).values());

      const files = await Promise.all(
        uniqTargets.map(async (e) => {
          try {
            const buf = await zip.file(e.name)!.async("arraybuffer");
            return { name: e.name, size_bytes: buf.byteLength, sha256: "local-scan" };
          } catch {
            return { name: e.name, size_bytes: 0, sha256: "local-scan" };
          }
        })
      );
      files.sort((a, b) => b.size_bytes - a.size_bytes);

      const { prefix } = findUnityRootPrefix(Object.keys(zip.files).filter(k => !zip.files[k].dir));
      const unityPrefix = prefix || "";
      const platformAudits = await runBrowserPlatformAudits(zip, unityPrefix);

      const s: ScanResponse & any = {
        kind: "webgl_build_scan",
        quick_score,
        compression: { brotli_present, gzip_present },
        memory_settings_detected_bytes,
        files,
        hosting_checks,
        scanned_at: new Date().toISOString(),
        ...platformAudits,
      };

      setScan(s);

      const rec = recommendHostFromScan(s);
      setTargetHost(rec.host);

      await persistScan(s);
      await refreshMe();
    } catch (e: any) {
      setErr(e?.message || "Scan failed");
    } finally {
      setBusy(false);
    }
  }

  function downloadTextFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function downloadFixPackZip(mode: "repo-ready" | "handover") {
    if (!scan) return;
    if (!file) {
      setErr("Please upload a WebGL.zip first.");
      return;
    }

    // Gate usage (customers). Scan is free.
    const gate = await fetch("/api/fixpacks/use", { method: "POST" });
    const gateJson = await gate.json().catch(() => null);
    if (!gate.ok) {
      const msg = gateJson?.message || gateJson?.error || "You’ve used all free Fix Pack deployments. Subscribe to continue.";
      setErr(msg);
      await refreshMe();
      return;
    }
    await refreshMe();

    setBusy(true);
    setErr(null);

    try {
      const pack = generateFixPack(scan, getBrand());

      const ab = await file.arrayBuffer();
      const srcZip = await JSZip.loadAsync(ab);
      const srcFiles = Object.values(srcZip.files).filter((z) => !z.dir);
      const entryNames = srcFiles.map((z) => z.name);

      const normalize = (n: string) => n.replace(/\\/g, "/").replace(/^\/+/, "");
      const { prefix } = findUnityRootPrefix(entryNames);

      if (prefix === null) {
        setErr("Could not find Unity WebGL root inside this zip. Expected index.html with sibling Build/ and TemplateData/ folders.");
        return;
      }

      const unityPrefix = prefix || "";
      const outZip = new JSZip();

      const gameSlug = slugify(projectName);
      const hostSlug = targetHost === "generic" ? "generic" : targetHost;

      let siteRoot: JSZip;
      if (mode === "handover") {
        const rootName = `${gameSlug}_${hostSlug}_fixpack`;
        const root = outZip.folder(rootName);
        if (!root) throw new Error("Could not create zip root folder");
        const deploy = root.folder("deploy");
        if (!deploy) throw new Error("Could not create deploy folder");
        siteRoot = deploy;
        root.file("README.md", pack.readme);
      } else {
        siteRoot = outZip;
        outZip.file("README.md", pack.readme);
      }

      for (const f of srcFiles) {
        const srcName = normalize(f.name);
        if (unityPrefix && !srcName.toLowerCase().startsWith(unityPrefix.toLowerCase())) continue;

        const relative = unityPrefix ? srcName.slice(unityPrefix.length) : srcName;
        const low = relative.toLowerCase();

        const allowed = low === "index.html" || low.startsWith("build/") || low.startsWith("templatedata/");
        if (!allowed) continue;

        if (low === "index.html") {
          let html = await srcZip.file(f.name)!.async("string");

          // Build dynamic HUD based on scan
          const alerts = [];
          if ((scan as any).meta?.criticalFailures?.length > 0) alerts.push("⚠️ META COMPLIANCE: FAIL");
          if ((scan as any).discord?.criticalFailures?.length > 0) alerts.push("⚠️ DISCORD SCOPES: FAIL");
          if ((scan as any).tiktok?.criticalFailures?.length > 0) alerts.push("⚠️ TIKTOK UX: FAIL");
          if ((scan as any).telegram?.criticalFailures?.length > 0) alerts.push("⚠️ TELEGRAM SDK: MISSING");
          if ((scan as any).linkedin?.criticalFailures?.length > 0) alerts.push("⚠️ LINKEDIN: PRIVACY LEAK");
          if ((scan as any).youtube?.criticalFailures?.length > 0) alerts.push("⚠️ YOUTUBE: RULES VIOLATED");

          const hudTitle = alerts.length > 0 ? alerts.join("<br/>") : "✅ BUILD COMPLIANT";
          const color = alerts.length > 0 ? "#ff0000" : "#00ff00";

          const hudScript = `
<script>
(function() {
    const overlay = document.createElement('div');
    overlay.style = "position:fixed;top:0;right:0;width:250px;height:100vh;background:rgba(0,0,0,0.9);color:${color};z-index:9999;padding:15px;font-family:monospace;border-left:2px solid ${color};pointer-events:none;overflow-y:auto;";
    overlay.innerHTML = "<b style='font-size:14px;color:#fff;'>HUD DIAGNOSIS</b><hr style='border-color:#333;'/>${hudTitle}";
    document.body.appendChild(overlay);
})();
</script>
`;
          if (!html.includes("HUD DIAGNOSIS")) {
            if (html.toLowerCase().includes("</body>")) {
              html = html.replace(/<\/body>/i, `${hudScript}\n</body>`);
            } else {
              html += hudScript;
            }
          }
          siteRoot.file(relative, html);
        } else {
          const data = await srcZip.file(f.name)!.async("arraybuffer");
          siteRoot.file(relative, data);
        }
      }

      if (targetHost === "vercel") siteRoot.file("vercel.json", pack.vercelJson);
      else if (targetHost === "netlify") siteRoot.file("_headers", pack.netlifyHeaders);
      else if (targetHost === "nginx") siteRoot.file("nginx.conf", pack.nginxConf);
      else if (targetHost === "apache") siteRoot.file(".htaccess", pack.htaccess);
      else {
        siteRoot.file("_headers", pack.netlifyHeaders);
        siteRoot.file(".htaccess", pack.htaccess);
      }

      const blob = await outZip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);

      const filename = mode === "handover" ? `${gameSlug}_${hostSlug}_handover.zip` : `${gameSlug}_${hostSlug}_repo-ready.zip`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error("FixPack ZIP failed:", e);
      setErr(e?.message || "Failed to build FixPack ZIP");
    } finally {
      setBusy(false);
    }
  }

  async function downloadPlatformZip(platform: "META" | "DISCORD" | "TIKTOK" | "LINKEDIN" | "TELEGRAM" | "YOUTUBE") {
    if (!file) {
      setErr("Please select your WebGL.zip file above first to apply this patch. Browser patches require the file to be actively loaded in your current tab.");
      return;
    }
    setBusy(true);
    setErr(null);

    // Gate usage (optional - we can keep it free or gated. Let's use the same gate as before)
    const gate = await fetch("/api/fixpacks/use", { method: "POST" });
    if (!gate.ok) {
      setErr("You’ve used all free Fix Pack deployments. Subscribe to continue.");
      setBusy(false);
      return;
    }

    try {
      const ab = await file.arrayBuffer();
      const srcZip = await JSZip.loadAsync(ab);
      const { prefix } = findUnityRootPrefix(Object.keys(srcZip.files));

      const success = await applyPlatformPatchBrowser(platform, srcZip, prefix || "");
      if (!success) throw new Error("Could not apply platform patch. index.html not found.");

      const blob = await srcZip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);

      const gameSlug = slugify(projectName);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${gameSlug}_${platform.toLowerCase()}_certified.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      await refreshMe();
    } catch (e: any) {
      console.error("Platform patch failed:", e);
      setErr(e?.message || "Failed to inject Platform SDKs");
    } finally {
      setBusy(false);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
  }

  const fixPack = useMemo(() => (scan ? generateFixPack(scan, getBrand()) : null), [scan]);

  // --- Auth gate ---
  if (status === "loading") {
    return (
      <div>
        <h1 style={{ fontSize: 34, margin: "8px 0 8px" }}>Stop WebGL hosting failures — instantly</h1>
        <p style={{ opacity: 0.8 }}>Checking your session…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <h1 style={{ fontSize: 34, margin: "8px 0 8px" }}>Stop WebGL hosting failures — instantly</h1>
        <p style={{ opacity: 0.8, lineHeight: 1.5, maxWidth: 760 }}>
          Sign in to scan builds, save history, and unlock your free Fix Pack deployments.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={() => signIn(undefined, { callbackUrl: "/" })} style={primaryBtn} type="button">
            Sign in (Email)
          </button>

          <button onClick={() => signIn("github", { callbackUrl: "/" })} style={primaryBtn} type="button">
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 34, margin: "8px 0 8px" }}>Stop WebGL hosting failures — instantly</h1>
      <p style={{ opacity: 0.8, lineHeight: 1.5, maxWidth: 760 }}>
        Upload a <b>Unity WebGL build ZIP</b>. We score deployment readiness and generate a host-ready Fix Pack.
      </p>

      {/* Step 1: Scan */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Game name (optional)"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", minWidth: 220 }}
        />

        <input type="file" accept=".zip" onChange={(e) => setFile(e.target.files?.[0] || null)} />

        <button
          onClick={runScan}
          disabled={!file || busy}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            background: busy ? "#ddd" : "#111",
            color: "#fff",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 900,
          }}
          type="button"
        >
          {busy ? "Scanning…" : "Run Quick Scan"}
        </button>

        <span style={{ fontSize: 12, opacity: 0.75 }}>
          Free Fix Pack deployments remaining: <b>{remainingDeployments == null ? "—" : remainingDeployments}</b>
        </span>

        {err && <span style={{ color: "crimson" }}>{err}</span>}
      </div>

      {/* Saved */}
      {(savedBuildId || certId || reportUrl) && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 12, border: "1px solid #e5e7eb", background: "#fafafa", maxWidth: 760 }}>
          <div style={{ fontWeight: 900 }}>✅ Saved</div>

          {savedBuildId && (
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
              Build ID: <span style={{ fontFamily: "monospace" }}>{savedBuildId}</span>
            </div>
          )}

          {certId && (
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
              Cert ID: <span style={{ fontFamily: "monospace" }}>{certId}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <a href="/history" style={linkBtn}>
              View in History →
            </a>

            {(reportUrl || certId) && (
              <a href={reportUrl || `/report/${certId}`} style={linkBtn}>
                Open Certification Report →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {scan && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Results</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{scan.scanned_at}</div>
          </div>

          {scoreInfo && (
            <div style={{ marginTop: 12, padding: 14, borderRadius: 12, border: "1px solid #eee", background: "#fafafa" }}>
              <div style={{ fontWeight: 900, fontSize: 14 }}>
                Web Readiness Score: {scoreInfo.score}/100 — {scoreInfo.bandLabel}
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{scoreInfo.bandMessage}</div>

              <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
                <b>Recommended Host:</b> {recommendation.label} — {recommendation.reason}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, opacity: 0.8 }}>Host for Fix Pack</label>
                  <select
                    value={targetHost}
                    onChange={(e) => setTargetHost(e.target.value as HostKey)}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                  >
                    <option value="netlify">Netlify</option>
                    <option value="vercel">Vercel</option>
                    <option value="nginx">Nginx</option>
                    <option value="apache">Apache</option>
                    <option value="generic">Generic Web Host</option>
                  </select>
                </div>

                <button onClick={() => downloadFixPackZip("repo-ready")} disabled={busy} style={primaryBtn} type="button">
                  🚀 Download FixPack (Repo-Ready)
                </button>

                <button onClick={() => downloadFixPackZip("handover")} disabled={busy} style={primaryBtn} type="button">
                  📦 Download FixPack (Client Handover)
                </button>

                {isFreeLimitReached && (
                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eee", background: "#fff" }}>
                    <div style={{ fontWeight: 900 }}>Free limit reached</div>
                    <button onClick={() => (window.location.href = "/pricing")} style={primaryBtn} type="button">
                      Upgrade — Unlimited Deployments
                    </button>
                  </div>
                )}

                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Selected host: <b>{hostLabel(targetHost)}</b>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
            <Kpi label="Brotli" value={scan.compression?.brotli_present ? "Yes" : "No"} />
            <Kpi label="Gzip" value={scan.compression?.gzip_present ? "Yes" : "No"} />
            <Kpi label="Memory (detected)" value={humanMem || "Not found"} />
          </div>

          <div style={{ marginTop: 20, padding: 16, border: "1px solid #111", borderRadius: 14, background: "#1a1a1a", color: "#fff" }}>
            <div style={{ fontWeight: 900, marginBottom: 10, fontSize: 16 }}>Platform Migration FixPacks (SDK Injectors)</div>
            <div style={{ fontSize: 13, marginBottom: 16, opacity: 0.85 }}>
              Automatically inject the required SDK bridges, compliance policies, and zero-PII firewalls natively into your WebGL build for immediate distribution.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {(scan as any).meta && (
                <button onClick={() => downloadPlatformZip("META")} style={{ ...primaryBtn, background: "#1877f2", borderColor: "#1877f2" }} type="button">
                  🔧 Apply Meta Patch
                </button>
              )}
              {(scan as any).discord && (
                <button onClick={() => downloadPlatformZip("DISCORD")} style={{ ...primaryBtn, background: "#5865F2", borderColor: "#5865F2" }} type="button">
                  🔧 Apply Discord Patch
                </button>
              )}
              {(scan as any).tiktok && (
                <button onClick={() => downloadPlatformZip("TIKTOK")} style={{ ...primaryBtn, background: "#ff0050", borderColor: "#ff0050" }} type="button">
                  🔧 Apply TikTok Patch
                </button>
              )}
              {(scan as any).linkedin && (
                <button onClick={() => downloadPlatformZip("LINKEDIN")} style={{ ...primaryBtn, background: "#0a66c2", borderColor: "#0a66c2" }} type="button">
                  🔧 Apply LinkedIn Security
                </button>
              )}
              {(scan as any).telegram && (
                <button onClick={() => downloadPlatformZip("TELEGRAM")} style={{ ...primaryBtn, background: "#229ED9", borderColor: "#229ED9" }} type="button">
                  🔧 Apply Telegram Bridge
                </button>
              )}
              {(scan as any).youtube && (
                <button onClick={() => downloadPlatformZip("YOUTUBE")} style={{ ...primaryBtn, background: "#FF0000", borderColor: "#FF0000" }} type="button">
                  🔧 Apply YouTube Hooks
                </button>
              )}
            </div>
          </div>

          <details style={{ marginTop: 16 }}>
            <summary style={{ cursor: "pointer", fontWeight: 900 }}>Hosting checks</summary>
            <ul style={{ marginTop: 10, lineHeight: 1.6 }}>
              {scan.hosting_checks?.map((c, i) => (
                <li key={i}>
                  <b style={{ textTransform: "uppercase", fontSize: 11, opacity: 0.75 }}>{c.severity}</b> {c.check}
                </li>
              ))}
            </ul>
          </details>

          {fixPack && (
            <details style={{ marginTop: 12 }} open>
              <summary style={{ cursor: "pointer", fontWeight: 900 }}>Fix Pack files for {hostLabel(targetHost)}</summary>

              <div style={{ marginTop: 12 }}>
                {targetHost === "vercel" && (
                  <ConfigBlock title="Vercel (vercel.json)" content={fixPack.vercelJson} onCopy={() => copyToClipboard(fixPack.vercelJson)} />
                )}
                {targetHost === "netlify" && (
                  <ConfigBlock title="Netlify (_headers)" content={fixPack.netlifyHeaders} onCopy={() => copyToClipboard(fixPack.netlifyHeaders)} />
                )}
                {targetHost === "nginx" && (
                  <ConfigBlock title="Nginx (nginx.conf snippet)" content={fixPack.nginxConf} onCopy={() => copyToClipboard(fixPack.nginxConf)} />
                )}
                {targetHost === "apache" && (
                  <ConfigBlock title="Apache (.htaccess)" content={fixPack.htaccess} onCopy={() => copyToClipboard(fixPack.htaccess)} />
                )}
                {targetHost === "generic" && (
                  <>
                    <ConfigBlock title="Generic (_headers)" content={fixPack.netlifyHeaders} onCopy={() => copyToClipboard(fixPack.netlifyHeaders)} />
                    <ConfigBlock title="Generic (.htaccess)" content={fixPack.htaccess} onCopy={() => copyToClipboard(fixPack.htaccess)} />
                  </>
                )}

                <ConfigBlock title="README.md" content={fixPack.readme} onCopy={() => copyToClipboard(fixPack.readme)} />

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  {targetHost === "vercel" && (
                    <button onClick={() => downloadTextFile("vercel.json", fixPack.vercelJson)} style={ghostBtn} type="button">
                      Download vercel.json
                    </button>
                  )}
                  {targetHost === "netlify" && (
                    <button onClick={() => downloadTextFile("_headers", fixPack.netlifyHeaders)} style={ghostBtn} type="button">
                      Download _headers
                    </button>
                  )}
                  {targetHost === "nginx" && (
                    <button onClick={() => downloadTextFile("nginx.conf", fixPack.nginxConf)} style={ghostBtn} type="button">
                      Download nginx.conf
                    </button>
                  )}
                  {targetHost === "apache" && (
                    <button onClick={() => downloadTextFile(".htaccess", fixPack.htaccess)} style={ghostBtn} type="button">
                      Download .htaccess
                    </button>
                  )}
                </div>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function ConfigBlock({ title, content, onCopy }: { title: string; content: string; onCopy: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 10, border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontWeight: 900,
            textAlign: "left",
            flex: 1,
          }}
          aria-expanded={open}
        >
          {open ? "▾ " : "▸ "}
          {title}
        </button>

        <button type="button" onClick={onCopy} style={ghostBtn}>
          Copy
        </button>
      </div>

      {open && (
        <pre
          style={{
            marginTop: 10,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#fafafa",
            borderRadius: 10,
            padding: 12,
            fontSize: 12,
            overflowX: "auto",
          }}
        >
          {content}
        </pre>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, minWidth: 160 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 18 }}>{value}</div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 900,
};

const linkBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  fontWeight: 900,
  textDecoration: "none",
};

const ghostBtn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};