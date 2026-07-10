// src/app/portfolio/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/lib/portfolio/caseStudies';

type PageProps = {
  params: { slug: string };
};

function getHireLinks() {
  const fiverr = process.env.NEXT_PUBLIC_FIVERR_URL || 'https://www.fiverr.com/';
  const upwork = process.env.NEXT_PUBLIC_UPWORK_URL || 'https://www.upwork.com/';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@yourdomain.com';
  return { fiverr, upwork, email };
}

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

export default function CaseStudyPage({ params }: PageProps) {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  if (!cs) return notFound();

  // If someone somehow hits an in-progress slug directly, show a polite page.
  const isInProgress = (cs.status ?? 'verified') === 'in_progress';
  if (isInProgress) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link href="/portfolio" className="text-sm font-semibold text-slate-900 underline underline-offset-4">
            ← Back to portfolio
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status="in_progress" />
            <div className="text-xs font-semibold text-slate-500">{cs.timeframe}</div>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{cs.title}</h1>
          <p className="mt-2 text-slate-600">{cs.oneLiner}</p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">Details coming soon</div>
            <p className="mt-2 text-sm text-slate-700">
              This case study is being finalized. If you want help with your build right now, run a scan and message me on Fiverr/Upwork with your target
              host and deadline.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/preflight"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Run a scan
              </Link>
              <Link
                href="/portfolio"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Back to portfolio
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const links = getHireLinks();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Link href="/portfolio" className="text-sm font-semibold text-slate-900 underline underline-offset-4">
          ← Back to portfolio
        </Link>
      </div>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xs font-semibold text-slate-500">{cs.timeframe}</div>
              <StatusPill status={cs.status} />
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{cs.title}</h1>
            <p className="mt-2 text-slate-600">{cs.oneLiner}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill>{cs.clientType}</Pill>
            <Pill>{cs.platform}</Pill>
            <Pill>{cs.host}</Pill>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-900">{cs.outcome.headline}</div>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {cs.outcome.bullets.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={links.fiverr}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Continue on Fiverr
          </a>
          <a
            href={links.upwork}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Continue on Upwork
          </a>
          <a
            href={`mailto:${links.email}?subject=Unity%20WebGL%20Deployment%20Quote%20(${encodeURIComponent(cs.title)})`}
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
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Problems observed</div>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {cs.before.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Outcome after deployment</div>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {cs.after.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Issue tags</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {cs.issues.map((t) => (
            <span key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 text-sm font-semibold text-slate-900">Deliverables</div>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {cs.deliverables.map((d, i) => (
            <li key={i}>• {d}</li>
          ))}
        </ul>

        {/* ✅ This is the “proof of work” block */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-900">Verification performed</div>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            <li>• Tested load in Chrome (cold load + reload)</li>
            <li>• Hard refresh checks (cache behavior validated)</li>
            <li>• Network tab confirms correct Content-Type for WASM + assets</li>
            <li>• Compression behavior checked (gzip/brotli where applicable)</li>
          </ul>
        </div>

        {cs.testimonial?.quote ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-900">Client note</div>
            <div className="mt-2 text-sm text-slate-700">“{cs.testimonial.quote}”</div>
            <div className="mt-2 text-xs text-slate-500">
              Source: {cs.testimonial.where}
              {cs.testimonial.name ? ` — ${cs.testimonial.name}` : ''}
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="text-xl font-semibold text-slate-900">Want the same outcome?</div>
        <p className="mt-2 text-sm text-slate-700">
          Reply on Fiverr/Upwork with your target host/platform and deadline, or run a scan first and send me the results.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={links.fiverr}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Continue on Fiverr
          </a>
          <a
            href={links.upwork}
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
