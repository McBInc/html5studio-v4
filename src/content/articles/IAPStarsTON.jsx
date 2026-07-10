import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "IAP & Stars / TON Payments for WebGL Games: Implementation Guide 2026",
  pillar: "Monetization & Business",
  cluster: "IAP & Stars / TON Payments",
  lastVerified: "March 2026",
  color: "#F1C40F",
  urgency: "hot",
  tldr: [
    "Telegram Stars is the most scalable IAP mechanism for browser games in 2026 — 900M potential users, no credit card required, and no platform cut beyond Telegram's standard fee.",
    "Standard WebGL IAP via Stripe requires PCI DSS compliance scoping and a payment form — workable but adds 2–4 weeks of implementation time.",
    "Platform-native payments (Poki, CrazyGames) don't exist — these platforms are ad-only. For IAP, you need your own distribution channel.",
    "All client-side payment confirmations are insecure — always validate payment completion on your server via webhook before granting items.",
  ],
  relatedSiblings: [
    { slug: "ad-network-integrations", title: "Ad Network Integrations", urgency: "active" },
    { slug: "ua-growth-strategy", title: "UA & Growth Strategy", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "telegram-mini-apps", title: "Telegram Mini Apps SDK 7.0", urgency: "hot" },
    { slug: "web3-play-to-earn", title: "Web3 & Play-to-Earn", urgency: "active" },
  ],
  faqs: [
    { q: "What payment methods are available for WebGL games?", a: "The main options are: (1) Telegram Stars — best for Telegram Mini Apps, (2) Stripe — for direct web distribution, (3) TON cryptocurrency via TON Connect — for Web3 games on Telegram, (4) PayPal — lower conversion than Stripe but wider international reach." },
    { q: "How do Telegram Stars work as a revenue source?", a: "Users purchase Stars with real money (via App Store/Play Store/Stripe). They spend Stars in your game. Telegram distributes 70% of Stars revenue to developers monthly via a withdrawal mechanism. The 30% Telegram fee is competitive with Apple/Google's 30% but with no minimum threshold." },
    { q: "Can I use Apple Pay or Google Pay in WebGL?", a: "Yes — via Stripe.js, which supports Apple Pay (Safari) and Google Pay (Chrome). The implementation requires a Stripe account, a domain verification file, and HTTPS. Conversion rates are 20–35% higher than standard card forms." },
    { q: "What's the minimum viable IAP implementation?", a: "Stripe Checkout (hosted payment page) is the simplest — it requires ~20 lines of code to create a payment session and redirect the user. No payment form to build, PCI compliance is handled by Stripe. Downside: redirects away from the game, which causes ~20% abandonment." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Payment Method Comparison</h2>
      <DataTable
        headers={["Method", "Platform", "Fee", "Implementation Time", "Conversion Rate"]}
        rows={[
          ["Telegram Stars", "Telegram Mini Apps", "30% to Telegram", "2–4 hours", "High (in-platform)"],
          ["Stripe Elements", "Own web domain", "2.9% + $0.30", "1–2 days", "Medium (3–8%)"],
          ["Stripe Checkout (hosted)", "Own web domain", "2.9% + $0.30", "2–4 hours", "Lower (redirect)"],
          ["Apple Pay (via Stripe)", "Safari on Apple devices", "2.9% + $0.30", "1 day", "High (+30% vs card)"],
          ["Google Pay (via Stripe)", "Chrome on Android", "2.9% + $0.30", "1 day", "High (+25% vs card)"],
          ["TON cryptocurrency", "Telegram (crypto users)", "~0.5% network fee", "1–2 days", "Niche (crypto-savvy users)"],
        ]}
      />

      <IntelligenceNote>
        Telegram Stars has emerged as the most important payment primitive for browser games in 2026 because it solves the fundamental IAP problem: users already have payment methods linked to Telegram from buying Telegram Premium. There's no friction of entering credit card details — it's 2 taps to complete a Stars purchase. Studios seeing conversion rates of 8–15% on Stars offers vs 2–4% on Stripe card forms.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Stripe IAP Integration (Direct Web)</h2>
      <CodeBlock code={`// Backend: create payment session (Node.js)
app.post('/create-payment', async (req, res) => {
  const { item, userId } = req.body;
  const items = {
    extra_lives: { price: 99, name: '5 Extra Lives' },
    premium_skin: { price: 299, name: 'Dragon Skin' },
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'apple_pay', 'google_pay'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: items[item].name },
        unit_amount: items[item].price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: \`https://your-game.com/payment-success?session_id={CHECKOUT_SESSION_ID}&item=\${item}&user=\${userId}\`,
    cancel_url: 'https://your-game.com/',
    metadata: { userId, item },
  });
  res.json({ sessionId: session.id, url: session.url });
});

// Webhook: validate and grant item (ALWAYS server-side)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await grantItem(session.metadata.userId, session.metadata.item);
  }
  res.json({ received: true });
});`} />
    </>
  ),
};

export default function IAPStarsTON() {
  return <ArticleLayout article={article} />;
}
