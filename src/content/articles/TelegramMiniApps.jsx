import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Telegram Mini Apps SDK 7.0: Migration, Stars Payments & Storebridge",
  pillar: "Platform Ecosystems",
  cluster: "Telegram Mini Apps",
  lastVerified: "March 2026",
  color: "#FF6B00",
  urgency: "hot",
  tldr: [
    "Telegram SDK 7.0 is now enforced — apps using SDK 6.x or earlier experience silent payment failures and broken biometric auth.",
    "<code>Telegram.WebApp.ready()</code> must be called within 500ms of page load or the container collapses the mini app view.",
    "Telegram Stars is the primary IAP currency — all payments must go through <code>Telegram.WebApp.openInvoice()</code>, not direct Stripe/PayPal integrations.",
    "The <code>Storebridge.jslib</code> Unity plugin wraps all Telegram SDK calls for C# — it requires SDK 7.0 minimum and Unity 2022.3 LTS.",
  ],
  relatedSiblings: [
    { slug: "tiktok-mini-games", title: "TikTok Mini-Games", urgency: "hot" },
    { slug: "iap-stars-ton-payments", title: "IAP & Stars / TON Payments", urgency: "hot" },
  ],
  relatedCrossPillar: [
    { slug: "api-deprecation-tracker", title: "API Deprecation Tracker 2026" },
  ],
  faqs: [
    { q: "How do I detect which SDK version my app is using?", a: "Check <code>Telegram.WebApp.version</code> — if it returns undefined or a value below '7.0', you're on legacy SDK. Update your Telegram WebApp script tag to the latest CDN URL and test in @BotFather's test environment." },
    { q: "What are Telegram Stars and how do payments work?", a: "Stars are Telegram's virtual currency. Users buy Stars via Apple/Google Pay or Telegram Payments. Your game requests an invoice via <code>Telegram.WebApp.openInvoice(invoiceLink)</code>, Telegram handles the payment UI, and you receive a <code>invoice_paid</code> event via your webhook." },
    { q: "Can I use Unity for Telegram Mini Apps?", a: "Yes — build to WebGL and use the Storebridge.jslib plugin to bridge Telegram SDK calls into C#. The plugin is available via the Unity Asset Store and requires SDK 7.0 and Unity 2022.3 LTS." },
    { q: "Why does my mini app close immediately?", a: "You're likely not calling <code>Telegram.WebApp.ready()</code> quickly enough. Telegram closes the WebView if <code>ready()</code> isn't called within 500ms. Call it as early as possible — ideally before any asset loading." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">SDK 7.0 Breaking Changes</h2>
      <DataTable
        headers={["Feature", "SDK 6.x Behaviour", "SDK 7.0 Behaviour", "Migration Action"]}
        rows={[
          ["<code>ready()</code> timeout", "No timeout", "500ms hard limit", "Call immediately on page load"],
          ["Biometric auth", "Optional init", "Required explicit enable call", "Add <code>BiometricManager.init()</code>"],
          ["Payments", "Direct external links allowed", "Must use <code>openInvoice()</code> only", "Migrate all IAP flows"],
          ["Back button", "Auto-shown", "Must explicitly show/hide", "Add <code>BackButton.show()</code> logic"],
          ["Theme params", "Basic colour set", "Extended CSS variable set", "Update theme consumers"],
          ["Cloud storage", "Not available", "Full key-value store", "Optional — migrate from localStorage"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Correct SDK 7.0 Initialisation</h2>
      <CodeBlock code={`// index.html — call ready() as the FIRST script action
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
  // CRITICAL: must be called within 500ms
  Telegram.WebApp.ready();

  // Expand to full height
  Telegram.WebApp.expand();

  // Apply Telegram theme to your app
  document.documentElement.style.setProperty(
    '--tg-theme-bg-color',
    Telegram.WebApp.themeParams.bg_color
  );
  document.documentElement.style.setProperty(
    '--tg-theme-text-color',
    Telegram.WebApp.themeParams.text_color
  );
</script>`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Telegram Stars Payment Flow</h2>
      <CodeBlock code={`// 1. Your backend creates an invoice link via Bot API
// POST https://api.telegram.org/bot{TOKEN}/createInvoiceLink
// { title, description, payload, currency: 'XTR', prices: [{label, amount}] }

// 2. Frontend opens invoice
const invoiceLink = await fetch('/api/create-invoice', {
  method: 'POST',
  body: JSON.stringify({ item: 'extra_lives', quantity: 5 })
}).then(r => r.json()).then(d => d.invoice_link);

Telegram.WebApp.openInvoice(invoiceLink, (status) => {
  if (status === 'paid') {
    // Payment confirmed — grant item
    grantItem('extra_lives', 5);
  } else if (status === 'cancelled') {
    console.log('User cancelled payment');
  } else if (status === 'failed') {
    showPaymentError();
  }
});`} />

      <IntelligenceNote>
        The <code>openInvoice()</code> callback fires on the client but is NOT a secure grant signal — always validate payment via your backend webhook (<code>successful_payment</code> Telegram Bot API event) before granting items. Client-side only payment validation was the #1 fraud vector in Telegram gaming apps in 2025.
      </IntelligenceNote>
    </>
  ),
};

export default function TelegramMiniApps() {
  return <ArticleLayout article={article} />;
}
