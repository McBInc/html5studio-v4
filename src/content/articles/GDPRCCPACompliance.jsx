import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "GDPR & CCPA Compliance for WebGL Games: Consent Flows, Cookie Law & Data Minimisation",
  pillar: "Legal & Regulatory",
  cluster: "GDPR & CCPA Compliance",
  lastVerified: "March 2026",
  color: "#229ED9",
  urgency: "hot",
  tldr: [
    "GDPR applies to any WebGL game accessible to EU users — there is no size or revenue exemption for small studios.",
    "CCPA applies to games with California users where the studio has annual revenue >$25M, processes data of 100K+ California consumers, or derives >50% of revenue from selling consumer data.",
    "A TCF 2.2-compliant Consent Management Platform (CMP) is the simplest way to achieve GDPR consent compliance — it handles the legal text, vendor list, and consent signal passing.",
    "Data Subject Access Requests (DSARs) must be responded to within 30 days under GDPR — build the capability to export and delete user data before you need it.",
  ],
  relatedSiblings: [
    { slug: "eu-dma-article7", title: "EU Digital Markets Act", urgency: "critical" },
    { slug: "content-moderation-age-ratings", title: "Content Moderation & Age Ratings", urgency: "active" },
    { slug: "ip-licensing-webgl", title: "IP & Licensing for WebGL Games", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "pii-privacy-compliance", title: "PII & Privacy Compliance", urgency: "hot" },
    { slug: "regulatory-bulletins", title: "Regulatory Bulletins", urgency: "hot" },
  ],
  faqs: [
    { q: "Do I need a cookie banner if my game doesn't use cookies?", a: "If your game uses localStorage, sessionStorage, or any tracking pixel — yes. If it truly collects zero data (no analytics, no error tracking, no ad network, no server-side IP logging) — no. Most games use at least one of these, so a consent mechanism is almost always required." },
    { q: "What's the easiest way to implement GDPR consent?", a: "Use a TCF 2.2-compliant CMP like Cookiebot, Didomi, or OneTrust. These provide a pre-built consent banner, automatically maintain the vendor list, and pass the consent signal to all integrated ad networks and analytics tools. Cost: $10–$50/month depending on traffic." },
    { q: "What's different about CCPA vs GDPR?", a: "CCPA focuses on the right to opt-out of data selling (not an opt-in requirement like GDPR). For most small studios, CCPA requires adding a 'Do Not Sell My Personal Information' link to your privacy policy and implementing a way to honour opt-out requests. The threshold exemptions mean many indie studios are technically exempt." },
    { q: "What happens if I ignore GDPR?", a: "Regulators have fined companies of all sizes. The most common enforcement trigger for games is a complaint from a user or an NGO scan. Fines for small studios typically range from €5K to €100K. More damaging is the reputational impact and the cost of emergency compliance remediation." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">GDPR vs CCPA: Key Differences</h2>
      <DataTable
        headers={["Aspect", "GDPR (EU)", "CCPA (California)"]}
        rows={[
          ["Scope", "Any processing of EU residents' data", "CA residents, with revenue/volume thresholds"],
          ["Consent model", "Opt-in — no tracking before consent", "Opt-out — can track, but must stop if asked"],
          ["Legal basis options", "Consent, legitimate interest, contract, etc.", "Primarily opt-out from sale/share"],
          ["Data subject rights", "Access, erasure, portability, rectification", "Access, deletion, opt-out, non-discrimination"],
          ["Response time for requests", "30 days", "45 days"],
          ["Maximum fine", "€20M or 4% of global turnover", "$7,500 per intentional violation"],
        ]}
      />

      <IntelligenceNote>
        The most common compliance mistake in WebGL games is implementing the consent banner but failing to actually block third-party scripts until consent is given. Many implementations show the banner while simultaneously loading Google Analytics, Meta Pixel, and ad SDK scripts in the background. This is non-compliant — scripts must not execute until after consent is granted.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Correct Consent-Blocking Implementation</h2>
      <CodeBlock code={`<!-- WRONG: Loading scripts before consent -->
<head>
  <script src="https://www.googletagmanager.com/gtag/js"></script>  <!-- BLOCKS consent -->
  <script>gtag('config', 'GA-XXXXX');</script>
</head>

<!-- CORRECT: Block all tracking scripts until consent -->
<head>
  <!-- Only load CMP first -->
  <script src="https://consent.cookiebot.com/uc.js" 
          data-cbid="YOUR-CBID" 
          data-blockingmode="auto">
  </script>

  <!-- All other scripts tagged with type="text/plain" and data-cookiecategory -->
  <!-- Cookiebot will change type to "text/javascript" after consent -->
  <script type="text/plain" 
          data-cookiecategory="statistics"
          src="https://www.googletagmanager.com/gtag/js">
  </script>
</head>`} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Data Subject Request Handler</h2>
      <CodeBlock code={`// Backend: GDPR Data Subject Access Request handler
app.post('/api/privacy/dsar', async (req, res) => {
  const { requestType, userEmail, verificationToken } = req.body;

  // Verify the request is from the actual user
  const isValid = await verifyEmailOwnership(userEmail, verificationToken);
  if (!isValid) return res.status(403).json({ error: 'Verification failed' });

  switch (requestType) {
    case 'access':
      const userData = await getAllUserData(userEmail);
      return res.json({ data: userData });

    case 'deletion':
      await deleteAllUserData(userEmail);
      return res.json({ message: 'All data deleted' });

    case 'portability':
      const exportData = await exportUserData(userEmail);
      return res.attachment('my-data.json').send(JSON.stringify(exportData));
  }
});`} />
    </>
  ),
};

export default function GDPRCCPACompliance() {
  return <ArticleLayout article={article} />;
}
