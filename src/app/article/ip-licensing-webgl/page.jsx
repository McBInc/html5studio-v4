"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "IP & Licensing for WebGL Games: Open Source, Asset Licensing & Trademark in 2026",
  pillar: "Legal & Regulatory",
  cluster: "IP & Licensing for WebGL Games",
  lastVerified: "March 2026",
  color: "#229ED9",
  urgency: "active",
  tldr: [
    "The most common IP risk in WebGL games is unlicensed third-party assets — free asset stores frequently contain assets with incompatible licences for commercial use.",
    "Unity's licence terms require a separate WebGL Build add-on for revenue-generating games on Unity Personal plan — failure to upgrade is a licence violation.",
    "Open source licences (MIT, GPL, Apache 2.0) have different commercial use implications — GPL in particular can 'infect' your entire codebase if used in a shipped product.",
    "WGL-CERT's DIP seal documents your IP stack at certification time — this provides a defensible record of your IP ownership for M&A due diligence and infringement disputes.",
  ],
  relatedSiblings: [
    { slug: "gdpr-ccpa-compliance", title: "GDPR & CCPA Compliance", urgency: "hot" },
    { slug: "content-moderation-age-ratings", title: "Content Moderation & Age Ratings", urgency: "active" },
    { slug: "eu-dma-article7", title: "EU Digital Markets Act", urgency: "critical" },
  ],
  relatedCrossPillar: [
    { slug: "webgl-certification-standard", title: "WGL-CERT Certification Standard", urgency: "critical" },
    { slug: "game-valuations-ma", title: "Game Valuations & M&A" },
  ],
  faqs: [
    { q: "Can I use Unity for commercial WebGL games for free?", a: "Unity Personal is free for studios with <$200K annual revenue and personal use. For commercial games, you must comply with Unity's terms on WebGL specifically — check the current Unity pricing page as terms changed in 2024. Unity Pro is required for revenue above $200K/year." },
    { q: "What's wrong with using free assets from the Unity Asset Store?", a: "Nothing, if you use them correctly. The issue is that many 'free' assets have licences that prohibit redistribution in certain contexts, limit commercial use, or require attribution. Always read the licence file. 'Free to download' ≠ 'free to use commercially'." },
    { q: "Is it safe to use MIT-licensed code in a commercial game?", a: "Yes — MIT is one of the most permissive licences. You can use it in commercial products with minimal restrictions (typically just: keep the copyright notice). MIT code does not 'infect' your proprietary code." },
    { q: "Can GPL-licensed code infect my commercial game?", a: "Yes — if you distribute software that incorporates GPL code, the GPL requires you to make your entire source code available under GPL terms. For most commercial games, this is unacceptable. Use LGPL or MIT alternatives for any libraries you ship." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Common Licence Types for Game Assets</h2>
      <DataTable
        headers={["Licence", "Commercial Use", "Attribution Required", "Source Required", "Copyleft Risk"]}
        rows={[
          ["MIT", "✓ Yes", "Include copyright notice", "✗ No", "None"],
          ["Apache 2.0", "✓ Yes", "Include NOTICE file", "✗ No", "None"],
          ["CC BY", "✓ Yes", "✓ Yes, with link", "✗ No", "None"],
          ["CC BY-SA", "✓ Yes", "✓ Yes", "Share-alike required", "Medium"],
          ["CC BY-NC", "✗ Non-commercial only", "✓ Yes", "✗ No", "Blocks commercial use"],
          ["GPL v3", "✓ But source required", "✓ Yes", "✓ Full source required", "High (infects codebase)"],
          ["LGPL v3", "✓ Yes (with conditions)", "✓ Yes", "Library source required", "Low (if linked dynamically)"],
          ["Proprietary / All Rights Reserved", "Only if licensed", "Per licence terms", "No", "N/A"],
        ]}
      />

      <IntelligenceNote>
        AI-generated assets have unclear IP status in most jurisdictions. The US Copyright Office's 2023 guidance states that purely AI-generated works (no human creative selection) are not eligible for copyright protection. This means: (1) you may not own the copyright to your AI-generated art, (2) competitors can copy it without infringement. For commercially significant assets, use AI as a starting point and add substantial human creative modification to establish copyright.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">IP Audit Checklist</h2>
      <DataTable
        headers={["Asset Category", "What to Check", "Common Issue", "Resolution"]}
        rows={[
          ["Code libraries (npm/NuGet)", "package.json / .csproj licence fields", "GPL dependency in shipping code", "Replace with MIT/Apache alternative"],
          ["Fonts", "Font licence (SIL OFL vs proprietary)", "Google Fonts assume 'free' but OFL applies", "Use SIL OFL fonts or purchase commercial licence"],
          ["Sound effects", "Freesound/Zapsplat licence terms", "CC BY-NC used in commercial game", "Purchase commercial licence or use CC0"],
          ["Music", "Composer agreement or stock music licence", "Background music used without game licence", "Purchase 'games' licence explicitly"],
          ["Art assets", "Asset store licence file", "'Editorial use only' or 'personal use'", "Purchase extended/commercial licence"],
          ["Game mechanics", "Patents (rare but emerging)", "Patent trolls targeting casual mechanics", "Freedom-to-operate analysis for novel mechanics"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Trademarking Your Game</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        A trademark protects your game's name and logo from being used by others in the same category. For games targeted at acquisition (see the M&A article), a registered trademark increases defensibility of IP and is increasingly expected by acquirers.
      </p>
      <p className="text-foreground/75 leading-relaxed mb-4">
        Filing a trademark in the US (USPTO) costs $250–$350 per class. For games, file in Class 41 (entertainment services) and optionally Class 9 (software). The process takes 12–18 months. In the EU, file via EUIPO — costs €850 for one class covering all EU member states.
      </p>
    </>
  ),
};

export default function IPLicensingWebGL() {
  return <ArticleLayout article={article} />;
}