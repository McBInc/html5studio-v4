// src/app/history/page.tsx
"use client";
export const dynamic = "force-dynamic";


import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

type ApiBuild = {
  id: string;
  createdAt: string;
  scannedAt: string | null;
  quickScore: number | null;
  brotliPresent: boolean | null;
  gzipPresent: boolean | null;
  status: string;
  versionLabel: string | null;
  buildNumber: number | null;
  launch: null | {
    readinessScore: number | null;
    platformFitScore: number | null;
    hostCompatibilityScore: number | null;
    targetPlatformId: string | null;
    targetHostId: string | null;
  };
  certId?: string | null;
};

type ApiProject = {
  id: string;
  name: string;
  builds: ApiBuild[];
};

export default function HistoryPage() {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  const email = session?.user?.email ?? null;

  useEffect(() => {
    if (status === "authenticated") {
      void fetchHistory();
    } else {
      setProjects([]);
      setError(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function fetchHistory() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/history`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load history");

      setProjects(data.projects || []);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Build History</h1>
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Build History</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Please sign in to view builds grouped by project.
        </p>

        <div className="rounded-2xl border p-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">You’re not signed in</p>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in with email or GitHub to access your history.
            </p>
          </div>
          <button
            className="rounded-xl px-4 py-2 border bg-black text-white"
            onClick={() => signIn(undefined, { callbackUrl: "/history" })}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Build History</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {email ? (
          <>
            Signed in as <span className="font-medium">{email}</span>.{" "}
          </>
        ) : null}
        Launch Readiness appears once you run the Launch Wizard.
      </p>

      <div className="rounded-2xl border p-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Session locked</p>
          <p className="text-xs text-muted-foreground mt-1">
            History is tied to your signed-in account (no manual email entry).
          </p>
        </div>
        <button
          className="rounded-xl px-4 py-2 border bg-black text-white disabled:opacity-50"
          disabled={loading}
          onClick={() => fetchHistory()}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading builds…</p>
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {projects.map((p) => (
            <div key={p.id} className="rounded-2xl border p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <span className="text-xs text-muted-foreground">{p.builds.length} build(s)</span>
              </div>

              <div className="space-y-3">
                {p.builds.map((b) => (
                  <BuildRow key={b.id} b={b} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BuildRow({ b }: { b: ApiBuild }) {
  const created = new Date(b.createdAt).toLocaleString();
  const readiness = b.launch?.readinessScore ?? null;

  return (
    <div className="rounded-2xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link className="font-medium underline" href={`/build/${b.id}`}>
            Build {b.buildNumber ?? ""} {b.versionLabel ? `• ${b.versionLabel}` : ""}
          </Link>

          <Badge>{b.status}</Badge>

          {b.quickScore != null ? <Badge>QuickScore: {b.quickScore}</Badge> : <Badge>QuickScore: —</Badge>}

          {readiness != null ? <Badge>Readiness: {readiness}</Badge> : <Badge>Readiness: —</Badge>}

          {b.brotliPresent ? <Badge>Brotli</Badge> : null}
          {b.gzipPresent ? <Badge>Gzip</Badge> : null}
        </div>

        <p className="text-xs text-muted-foreground mt-2">Created: {created}</p>

        {b.launch ? (
          <p className="text-xs text-muted-foreground mt-1">
            PlatformFit: {b.launch.platformFitScore ?? "—"} • HostCompat: {b.launch.hostCompatibilityScore ?? "—"}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            Run the Launch Wizard to compute platform + host scores.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {b.certId ? (
          <Link className="rounded-xl px-3 py-2 border bg-green-600 text-white font-bold" href={`/report/${b.certId}`}>
            View Certificate
          </Link>
        ) : (
          <Link className="rounded-xl px-3 py-2 border" href={`/build/${b.id}`}>
            View
          </Link>
        )}
        <Link className="rounded-xl px-3 py-2 border bg-black text-white" href={`/build/${b.id}/launch`}>
          Launch Wizard
        </Link>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-xs border rounded-full px-2 py-1">{children}</span>;
}

function EmptyState() {
  return (
    <div className="rounded-2xl border p-10 text-center">
      <p className="font-medium">No builds yet</p>
      <p className="text-sm text-muted-foreground mt-2">
        Upload a build and run a scan, then come back here.
      </p>
    </div>
  );
}
