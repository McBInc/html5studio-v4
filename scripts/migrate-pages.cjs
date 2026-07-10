const fs = require('fs');
const path = require('path');

const V5_PAGES_DIR = path.join(__dirname, '../../../html5studiov5_public/src/pages');
const NEXT_APP_DIR = path.join(__dirname, '../src/app');

// Map of React Router paths to Component files (based on App.jsx)
const routes = [
  { path: 'Landing', component: 'Landing.jsx' },
  { path: 'IntelligenceCentre', component: 'IntelligenceCentre.jsx' },
  { path: 'PillarDetail/[pillarId]', component: 'PillarDetail.jsx' },
  { path: 'StudioDirectory', component: 'StudioDirectory.jsx' },
  { path: 'CertBadgePreview', component: 'CertBadgePreview.jsx' },
  { path: 'Registry', component: 'Registry.jsx' },
  { path: 'Sitemap', component: 'Sitemap.jsx' },
  { path: 'article/meta-sdk-v8-migration', component: 'articles/MetaSDKMigration.jsx' },
  { path: 'article/discord-activities-api-split', component: 'articles/DiscordActivitiesAPISplit.jsx' },
  { path: 'article/webgl-certification-standard', component: 'articles/WebGLCertificationStandard.jsx' },
  { path: 'article/eu-dma-article7', component: 'articles/EUDMAArticle7.jsx' },
  { path: 'article/api-deprecation-tracker', component: 'articles/APIDeprecationTracker.jsx' },
  { path: 'article/platform-api-change-alerts', component: 'articles/PlatformAPIChangeAlerts.jsx' },
  { path: 'article/unity-webgl-build-troubleshooting', component: 'articles/BuildTroubleshooting.jsx' },
  { path: 'article/unity-webgl-deploy-hosting', component: 'articles/UnityWebGLDeploy.jsx' },
  { path: 'article/beginner-deployment-guide', component: 'articles/BeginnerDeployment.jsx' },
  { path: 'article/cicd-webgl-pipelines', component: 'articles/CICDWebGL.jsx' },
  { path: 'article/tiktok-mini-games', component: 'articles/TikTokMiniGames.jsx' },
  { path: 'article/telegram-mini-apps', component: 'articles/TelegramMiniApps.jsx' },
  { path: 'article/youtube-playables', component: 'articles/YouTubePlayables.jsx' },
  { path: 'article/linkedin-b2b-gaming', component: 'articles/LinkedInB2BGaming.jsx' },
  { path: 'article/pii-privacy-compliance', component: 'articles/PIIPrivacyCompliance.jsx' },
  { path: 'article/regulatory-bulletins', component: 'articles/RegulatoryBulletins.jsx' },
  { path: 'article/developer-forum-signals', component: 'articles/DeveloperForumSignals.jsx' },
  { path: 'article/build-error-pattern-tracking', component: 'articles/BuildErrorPatternTracking.jsx' },
  { path: 'article/hyper-casual-market', component: 'articles/HyperCasualMarket.jsx' },
  { path: 'article/web3-play-to-earn', component: 'articles/Web3PlayToEarn.jsx' },
  { path: 'article/ai-in-game-dev', component: 'articles/AIInGameDev.jsx' },
  { path: 'article/cloud-streaming-browser-tech', component: 'articles/CloudStreamingBrowserTech.jsx' },
  { path: 'article/ad-network-integrations', component: 'articles/AdNetworkIntegrations.jsx' },
  { path: 'article/iap-stars-ton-payments', component: 'articles/IAPStarsTON.jsx' },
  { path: 'article/ua-growth-strategy', component: 'articles/UAGrowthStrategy.jsx' },
  { path: 'article/game-valuations-ma', component: 'articles/GameValuationsMA.jsx' },
  { path: 'article/gdpr-ccpa-compliance', component: 'articles/GDPRCCPACompliance.jsx' },
  { path: 'article/content-moderation-age-ratings', component: 'articles/ContentModerationAgeRatings.jsx' },
  { path: 'article/ip-licensing-webgl', component: 'articles/IPLicensingWebGL.jsx' },
  { path: 'article/unity-webgl-build-system', component: 'articles/UnityWebGLBuildSystem.jsx' },
  { path: 'article/godot-alternative-engines', component: 'articles/GodotAlternativeEngines.jsx' },
  { path: 'article/sdk-integration-guides', component: 'articles/SDKIntegrationGuides.jsx' },
  { path: 'article/performance-profiling', component: 'articles/PerformanceProfiling.jsx' },
  { path: 'AmbassadorProgram', component: 'AmbassadorProgram.jsx' },
  { path: 'article/september-30-sunset', component: 'articles/September30Sunset.jsx' },
  { path: 'article/deprecated-api-calls', component: 'articles/DeprecatedAPICalls.jsx' },
  { path: 'article/game-investing-guide', component: 'articles/GameInvestingGuide.jsx' },
  { path: 'article/ton-investor-structure', component: 'articles/TONInvestorStructure.jsx' },
  { path: 'article/investor-due-diligence-guide', component: 'articles/InvestorDueDiligenceGuide.jsx' },
  { path: 'internal/ton-briefing', component: 'TONBriefing.jsx' },
  { path: 'control-panel', component: 'ControlPanel.jsx' },
  { path: 'landing2', component: 'Landing2.jsx' },
  { path: 'dev-log', component: 'DevelopmentLog.jsx' },
  { path: 'compliance-matrix', component: 'PlatformComplianceMatrix.jsx' },
  { path: 'sept30-risk-assessor', component: 'Sept30RiskAssessor.jsx' },
  { path: 'risk-dashboard', component: 'RiskDashboard.jsx' },
  { path: 'compliance-wizard', component: 'ComplianceWizard.jsx' },
  { path: 'chrome-extension', component: 'ChromeExtension.jsx' },
  { path: 'about', component: 'About.jsx' },
  { path: 'privacy', component: 'Privacy.jsx' },
  { path: 'contact', component: 'Contact.jsx' }
];

function migrateFile(content) {
  let migrated = content;
  
  // 1. Add use client
  if (!migrated.includes('"use client"')) {
    migrated = '"use client";\n\n' + migrated;
  }
  
  // 2. Replace react-router-dom imports
  // Link
  migrated = migrated.replace(/import\s+{([^}]*)\bLink\b([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
    let newImport = match.replace(/\bLink\b,?\s*/, '');
    if (newImport.includes('{}')) newImport = '';
    return `import Link from 'next/link';\n${newImport}`;
  });

  // useNavigate -> useRouter
  migrated = migrated.replace(/import\s+{([^}]*)\buseNavigate\b([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
    return `import { useRouter } from 'next/navigation';\n`;
  });
  migrated = migrated.replace(/useNavigate\(\)/g, 'useRouter()');

  // useParams -> useParams (next/navigation)
  migrated = migrated.replace(/import\s+{([^}]*)\buseParams\b([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
    return `import { useParams } from 'next/navigation';\n`;
  });
  
  // 3. Simple image src fixes if needed (Vite -> Next)
  // Usually Next.js is fine with /image.png if it's in public

  return migrated;
}

routes.forEach(route => {
  const sourcePath = path.join(V5_PAGES_DIR, route.component);
  
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Source not found: ${sourcePath}`);
    return;
  }
  
  const destDir = path.join(NEXT_APP_DIR, route.path.toLowerCase());
  const destPath = path.join(destDir, 'page.jsx'); // Keeping as .jsx for now to avoid TS errors
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const content = fs.readFileSync(sourcePath, 'utf8');
  const migratedContent = migrateFile(content);
  
  fs.writeFileSync(destPath, migratedContent);
  console.log(`Migrated: ${route.path} -> ${destPath}`);
});

console.log('Migration complete!');
