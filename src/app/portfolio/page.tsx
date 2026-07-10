// src/app/portfolio/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  caseStudies,
  allIssueTags,
  allPlatforms,
  type CaseStudy,
  type IssueTag,
  type PortfolioPlatform,
} from '@/lib/portfolio/caseStudies';

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800">
      {children}
    </span>
  );
}

function StatusPill({ status }: { status?: 'verified' | 'in_progress' }) {
  const s = status ?? 'verified';
  if (s === 'in_progress') {
    return (
      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
        In progress
      </span>
    );
  }
  return (
    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
      Verified
    </span>
  );
}

function CaseCard({ cs }: { cs: CaseStudy }) {
  const isInProgress = (cs.status ?? 'verified') === 'in_progress';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-semibold text-slate-500">{cs.timeframe}</div>
            <StatusPill status={cs.status} />
          </div>

          <div className="mt-2 text-lg font-semibold text-slate-900">{cs.title}</div>
          <div className="mt-1 text-sm text-slate-600">{cs.oneLiner}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill>{cs.platform}</Pill>
          <Pill>{cs.host}</Pill>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-700">Before</div>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {cs.before.slice(0, 3).map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-700">After</div>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {cs.after.slice(0, 3).map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {cs.issues.slice(0, 5).map((t) => (
          <span key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            {t}
          </span>
        ))}
      </div>

      {cs.testimonial?.quote ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-700">Client note</div>
          <div className="mt-2 text-sm text-slate-700">“{cs.testimonial.quote}”</div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {isInProgress ? (
          <span className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Details coming soon</span>
        ) : (
          <Link
            href={`/portfolio/${cs.slug}`}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View details
          </Link>
        )}

        <Link
          href="/preflight"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Run a scan
        </Link>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [platform, setPlatform] = useState<PortfolioPlatform | 'All'>('All');
  const [issue, setIssue] = useState<IssueTag | 'All'>('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return caseStudies.filter((cs) => {
      const platformOk = platform === 'All' ? true : cs.platform === platform || cs.host === platform;
      const issueOk = issue === 'All' ? true : cs.issues.includes(issue);
      const qOk =
        !query ||
        cs.title.toLowerCase().includes(query) ||
        cs.oneLiner.toLowerCase().includes(query) ||
        cs.issues.some((t) => t.toLowerCase().includes(query));
      return platformOk && issueOk && qOk;
    });
  }, [platform, issue, q]);

  // Keep these simple for now; replace later with env-safe server wrapper if you want.
  const fiverr = 'https://www.fiverr.com/';
  const upwork = 'https://www.upwork.com/';
  const email = 'hello@yourdomain.com';

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8">
        <div className="text-sm text-slate-500">Portfolio</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Verified Unity WebGL deployments</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Real deployment outcomes: black screens fixed, MIME + compression corrected, caching stabilized, and platform requirements met.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={fiverr}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Continue on Fiverr
          </a>
          <a
            href={upwork}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Continue on Upwork
          </a>
          <a
            href={`mailto:${email}?subject=Unity%20WebGL%20Deployment%20Quote`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Email me
          </a>
          <Link
            href="/preflight"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Run a scan
          </Link>
        </div>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="black screen, wasm mime, compression…"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Platform / Host</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              <option value="All">All</option>
              {allPlatforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Issue type</label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              <option value="All">All</option>
              {allIssueTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> case{filtered.length === 1 ? '' : 's'}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setPlatform('All');
                setIssue('All');
                setQ('');
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filtered.map((cs) => (
          <CaseCard key={cs.slug} cs={cs} />
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="text-xl font-semibold text-slate-900">Want the same outcome?</div>
        <p className="mt-2 max-w-3xl text-sm text-slate-700">
          If you already contacted me on Fiverr or Upwork, reply there with your target host/platform and deadline. If you haven’t run it yet, start with
          a scan.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={fiverr}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Continue on Fiverr
          </a>
          <a
            href={upwork}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Continue on Upwork
          </a>
          <Link
            href="/preflight"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Run a scan
          </Link>
        </div>
      </section>
    </main>
  );
}
