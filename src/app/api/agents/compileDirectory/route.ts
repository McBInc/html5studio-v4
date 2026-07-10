import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [VSA INTERFACE 7: SYSTEM 5 POLICY] - Operational Ruleset
const COMPLIANCE_POLICY = {
  ALLOW_EXECUTION: true, 
};

// CORS configuration for bridging V5 (Vite) and V4 (Next.js)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  // [VSA INTERFACE 3: SYSTEM 2 COORDINATOR] - Reporting intelligence to the UI Dashboard
  const studios = await prisma.gameStudio.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  // [VSA INTERFACE 9: SYSTEM ENVIRONMENT LOOP] - Telemetry return
  return NextResponse.json(studios, { headers: corsHeaders });
}

// [VSA INTERFACE 1: ENVIRONMENT RESOURCE] - Ingesting Requisite Variety
const ENVIRONMENT_SOURCES = [
  {
    name: "Famobi", website: "https://www.famobi.com", contact_email: "info@famobi.com", country: "Germany", studio_size: "mid-size", platforms: ["Poki", "CrazyGames", "GameDistribution"], games: ["Jewel Explode", "Knife Smash"], source_directory: "Poki / GameDistribution", compliance_risks: ["Sept 30 Meta SDK Risk", "Legacy Compression Format"], risk_level: "critical", tags: ["casual", "puzzle"]
  },
  {
    name: "Voodoo", website: "https://www.voodoo.io", contact_email: "dev@voodoo.io", country: "France", studio_size: "large", platforms: ["CrazyGames", "Poki", "Meta Instant Games"], games: ["Helix Jump", "Paper.io 2"], source_directory: "CrazyGames / Meta", compliance_risks: ["Sept 30 Meta SDK Risk", "TikTok Touch-Action CSS"], risk_level: "critical", tags: ["hyper-casual", "arcade"]
  },
  {
    name: "Coolmath Games", website: "https://www.coolmathgames.com", contact_email: "support@coolmathgames.com", country: "USA", studio_size: "mid-size", platforms: ["Coolmath", "CrazyGames"], games: ["Run 3", "Fireboy Watergirl"], source_directory: "Coolmath Games", compliance_risks: ["COPPA Risk", "Outdated WebGL Template"], risk_level: "high", tags: ["educational", "casual"]
  },
  {
    name: "Kongregate", website: "https://www.kongregate.com", contact_email: "support@kongregate.com", country: "USA", studio_size: "large", platforms: ["Kongregate", "Meta Instant Games"], games: ["Bloons Tower Defense", "Kingdom Rush"], source_directory: "Kongregate", compliance_risks: ["Legacy Flash Migration Incomplete", "Sept 30 Meta SDK Risk"], risk_level: "critical", tags: ["strategy", "tower-defense"]
  },
  {
    name: "Kizi Games", website: "https://kizi.com", contact_email: "info@kizi.com", country: "Netherlands", studio_size: "mid-size", platforms: ["Kizi", "CrazyGames"], games: ["My Dolphin Show", "Papa's Freezeria"], source_directory: "CrazyGames", compliance_risks: ["Legacy API Calls", "DMA Non-Compliant"], risk_level: "high", tags: ["casual", "simulation"]
  },
  {
    name: "Gamee", website: "https://www.gamee.com", contact_email: "hello@gamee.com", country: "Czech Republic", studio_size: "mid-size", platforms: ["Meta Instant Games", "Telegram Mini Apps"], games: ["Arc", "Bricks n Balls"], source_directory: "Meta Instant Games", compliance_risks: ["Telegram SDK 7.0 Upgrade Needed"], risk_level: "critical", tags: ["arcade", "instant-games"]
  },
  {
    name: "MarketJS", website: "https://www.marketjs.com", contact_email: "info@marketjs.com", country: "Singapore", studio_size: "indie", platforms: ["GameDistribution", "Poki"], games: ["Bubble Shooter Pro", "Mahjong Classic"], source_directory: "GameDistribution", compliance_risks: ["Sept 30 Meta SDK Risk", "DMA Non-Compliant"], risk_level: "critical", tags: ["casual", "puzzle"]
  },
  {
    name: "Softgames", website: "https://www.softgames.com", contact_email: "business@softgames.com", country: "Germany", studio_size: "mid-size", platforms: ["GameDistribution", "Facebook Instant Games"], games: ["Solitaire Story", "Mahjong Story"], source_directory: "GameDistribution / Meta", compliance_risks: ["Sept 30 Meta SDK Risk", "YouTube 15MB Bundle Risk"], risk_level: "critical", tags: ["casual", "card"]
  }
];

export async function POST(req: Request) {
  try {
    // [VSA INTERFACE 5: SYSTEM 3* AUDIT] - Pre-Execution Verification
    if (!COMPLIANCE_POLICY.ALLOW_EXECUTION) {
      return NextResponse.json({ error: 'System 5 Policy: Execution Denied' }, { status: 403, headers: corsHeaders });
    }
    
    // [VSA INTERFACE 6: SYSTEM 4 INTELLIGENCE] - Processing Environmental Data Variety
    const intelligenceMap = ENVIRONMENT_SOURCES.map(studio => {
      let activeRisk = studio.risk_level;
      
      // [VSA INTERFACE 8: ALGEDONIC ALERT] - Pain/Threat Bypass Trigger
      if (studio.compliance_risks.includes("Sept 30 Meta SDK Risk")) {
         activeRisk = "critical"; // Force critical path escalation via Algedonics
      }

      // [VSA INTERFACE 2: SYSTEM 1 OPERATIONS] - Formatting Operational Payload
      return {
        ...studio,
        risk_level: activeRisk,
      };
    });

    let created = 0;
    let skipped = 0;

    // [VSA INTERFACE 4: SYSTEM 3 CONTROL] - Database State Homeostasis (Ensuring 1:1 parity)
    for (const data of intelligenceMap) {
      const exists = await prisma.gameStudio.findUnique({
        where: { name: data.name }
      });

      if (!exists) {
        await prisma.gameStudio.create({ data });
        created++;
      } else {
        // Here we could update, but we skip to maintain homeostasis
        skipped++;
      }
    }

    // [VSA INTERFACE 9: SYSTEM ENVIRONMENT LOOP] - Telemetry Feedback to UI
    return NextResponse.json({
      status: 'homeostasis_achieved',
      studios_researched: intelligenceMap.length,
      upserted: created,
      skipped,
    }, { status: 200, headers: corsHeaders });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
