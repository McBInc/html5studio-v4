import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Ad Network Integrations for WebGL Games: Meta, AdMob, IronSource & 2026 Best Practices",
  pillar: "Monetization & Business",
  cluster: "Ad Network Integrations",
  lastVerified: "March 2026",
  color: "#F1C40F",
  urgency: "active",
  tldr: [
    "Meta Audience Network and Google AdSense are the primary ad networks for WebGL games — they require GDPR-compliant consent flows before serving personalised ads.",
    "Rewarded video ads in WebGL have the highest eCPM ($5–$25) but require the player to be in a Chrome/Firefox browser with autoplay enabled.",
    "IronSource (now Unity LevelPlay) is the leading mediation platform — it allows a single integration to serve ads from 30+ networks and maximise fill rate.",
    "Ad revenue in WebGL is significantly lower than native mobile — CPMs are 40–60% of native equivalents due to cookie deprecation and limited attribution.",
  ],
  relatedSiblings: [
    { slug: "iap-stars-ton-payments", title: "IAP & Stars / TON Payments", urgency: "hot" },
    { slug: "ua-growth-strategy", title: "UA & Growth Strategy", urgency: "active" },
    { slug: "game-valuations-ma", title: "Game Valuations & M&A", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "pii-privacy-compliance", title: "PII & Privacy Compliance", urgency: "hot" },
    { slug: "gdpr-ccpa-compliance", title: "GDPR & CCPA Compliance" },
  ],
  faqs: [
    { q: "What's the average CPM for WebGL game ads?", a: "It varies significantly by region and ad format. US-tier rewarded video: $8–$25 CPM. US-tier display/banner: $0.50–$2 CPM. EU-tier (non-personalised due to GDPR): $0.30–$1.50 CPM. Overall blended CPM across all traffic: $1–$4 for most studios." },
    { q: "Why are WebGL CPMs lower than native mobile?", a: "Three factors: (1) Third-party cookie deprecation has reduced ad targeting precision on web, (2) Desktop users are less valuable to performance advertisers than mobile (lower conversion intent for app installs), (3) Attribution is harder on web — fewer measurement partners support cross-site tracking." },
    { q: "Should I use a mediation platform or direct ad network integration?", a: "Use mediation (Unity LevelPlay, AppLovin MAX, or Pubfox for web) once you have 50K+ MAU. Direct integration makes sense initially, but mediation's waterfall/bidding system increases effective fill rate from ~60% to ~95% and CPM by 20–40%." },
    { q: "How do I handle ad consent under GDPR?", a: "Use Google's Consent Management Platform (CMP) or a TCF 2.2-compliant CMP like Didomi or OneTrust. You must collect consent before initialising any personalised ad SDK. Without consent, serve contextual (non-personalised) ads — these pay ~60% less but are legally safe." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Ad Network Comparison for WebGL</h2>
      <DataTable
        headers={["Network", "Format", "eCPM Range", "Min Traffic", "GDPR Consent Required"]}
        rows={[
          ["Google AdSense / Ad Manager", "Display, video", "$0.5–$3", "None", "✓ Yes (CMP required)"],
          ["Meta Audience Network", "Display, rewarded video", "$1–$15", "10K MAU", "✓ Yes"],
          ["Unity LevelPlay (mediation)", "All formats (30+ networks)", "$2–$20 (blended)", "50K MAU recommended", "✓ Yes (per network)"],
          ["Poki SDK (platform ads)", "Platform-served ads", "Revenue share", "Poki distribution only", "Handled by platform"],
          ["CrazyGames SDK (platform ads)", "Platform-served ads", "Revenue share", "CrazyGames distribution only", "Handled by platform"],
        ]}
      />

      <IntelligenceNote>
        Platform-served ads (Poki, CrazyGames) are significantly simpler to implement than direct ad network integrations — the platform handles consent, serving, and compliance. The tradeoff is lower revenue (platform takes ~70% of ad revenue). For studios on premium platforms, the simplicity often justifies the lower yield. For studios distributing via their own domain or GameDistribution, direct ad integration is worth the complexity.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Rewarded Video Integration Pattern</h2>
      <CodeBlock code={`// Google AdSense rewarded ad implementation
class RewardedAdManager {
  constructor() {
    this.adUnit = 'ca-pub-XXXX/YYYY';
    this.isReady = false;
    this.loadAd();
  }

  loadAd() {
    // Only load after consent is granted
    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(() => {
      const rewardedSlot = googletag.defineOutOfPageSlot(
        this.adUnit,
        googletag.enums.OutOfPageFormat.REWARDED
      );
      if (rewardedSlot) {
        rewardedSlot.addService(googletag.pubads());
        googletag.pubads().addEventListener('rewardedSlotReady', (event) => {
          this.isReady = true;
          this.pendingSlot = event;
        });
        googletag.pubads().addEventListener('rewardedSlotGranted', (event) => {
          // User watched the full ad — grant reward
          this.grantReward(event.payload.type, event.payload.amount);
        });
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
        googletag.display(rewardedSlot);
      }
    });
  }

  showAd(onGranted) {
    if (!this.isReady) { return false; }
    this.onGranted = onGranted;
    this.pendingSlot.makeRewardedVisible();
    return true;
  }

  grantReward(type, amount) {
    console.log(\`Granting \${amount} \${type}\`);
    if (this.onGranted) this.onGranted({ type, amount });
    // Preload next ad
    this.isReady = false;
    this.loadAd();
  }
}`} />
    </>
  ),
};

export default function AdNetworkIntegrations() {
  return <ArticleLayout article={article} />;
}
