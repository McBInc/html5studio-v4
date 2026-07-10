"use client";

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import NewsTicker from '@/components/landing/NewsTicker';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: June 2026</p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">1. Overview</h2>
              <p>HTML5STUDIO ("we", "our", "us") is committed to protecting your privacy. This policy covers both our website at <span className="text-foreground">web-play-core.base44.app</span> and our Chrome Extension, <strong className="text-foreground">HTML5STUDIO Compliance Wizard</strong>.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">2. Website</h2>
              <p>When you visit our website, we may collect:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Anonymous usage analytics via Google Analytics (page views, session duration, referral source)</li>
                <li>Email address if you submit a contact form or purchase a license</li>
                <li>Stripe payment session data (handled entirely by Stripe — we never see or store card details)</li>
              </ul>
              <p className="mt-3">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">3. Chrome Extension</h2>
              <p>The HTML5STUDIO Compliance Wizard extension:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong className="text-foreground">Does not collect</strong> any personal data</li>
                <li>Reads only the <strong className="text-foreground">current tab's URL</strong> to detect which developer portal you are visiting — this data never leaves your device</li>
                <li>Stores your purchase license record locally using <code className="text-foreground bg-muted px-1 rounded">chrome.storage.local</code> — this is never transmitted to any server</li>
                <li>Does not use any analytics, tracking pixels, or third-party SDKs</li>
                <li>Does not inject ads or modify page content beyond compliance reminder overlays on supported developer portals</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">4. Permissions Justification</h2>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong className="text-foreground">activeTab</strong> — required to read the current page URL for platform detection</li>
                <li><strong className="text-foreground">storage</strong> — required to persist your license locally so you don't need to re-enter it</li>
              </ul>
              <p className="mt-3">No other permissions are requested.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">5. Data Retention</h2>
              <p>Contact form submissions and license records are retained for up to 2 years for customer support purposes. You may request deletion at any time by emailing us.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">6. Third-Party Services</h2>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong className="text-foreground">Stripe</strong> — payment processing (<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">stripe.com/privacy</a>)</li>
                <li><strong className="text-foreground">Google Analytics</strong> — anonymous website analytics (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">policies.google.com/privacy</a>)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">7. Contact</h2>
              <p>For any privacy-related questions or data deletion requests, please contact us at <a href="mailto:support@html5studio.app" className="text-primary underline">support@html5studio.app</a>.</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}