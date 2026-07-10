"use client";

import React from "react";
import ArticleLayout from '@/components/article/ArticleLayout';

const article = {
  title: "AI in Game Development: Asset Generation, Procedural Content & LLM NPCs in 2026",
  pillar: "Industry Trends",
  cluster: "AI in Game Dev",
  lastVerified: "March 2026",
  color: "#9B59B6",
  urgency: "active",
  tldr: [
    "AI-generated art assets are now standard practice for indie WebGL studios — tools like Midjourney, DALL-E 3, and Stability AI have reduced art production costs by 60–80% for 2D casual games.",
    "LLM NPCs (AI-powered non-player characters with dynamic dialogue) are technically feasible in WebGL via API calls, but add latency and require careful cost management — not suitable for real-time action games.",
    "Procedural content generation using AI models is the fastest-growing technique — daily-generated puzzles, maps, and challenges dramatically improve day-7 retention metrics.",
    "PEGI and ESRB are introducing AI content descriptors in 2026 — games using AI-generated content will require additional classification steps.",
  ],
  relatedSiblings: [
    { slug: "hyper-casual-market", title: "Hyper-Casual & CrazyGames Market", urgency: "active" },
    { slug: "web3-play-to-earn", title: "Web3 & Play-to-Earn", urgency: "active" },
    { slug: "cloud-streaming-browser-tech", title: "Cloud Streaming & Browser Tech", urgency: "active" },
  ],
  relatedCrossPillar: [
    { slug: "regulatory-bulletins", title: "Regulatory Bulletins", urgency: "hot" },
    { slug: "ip-licensing-webgl", title: "IP & Licensing for WebGL Games" },
  ],
  faqs: [
    { q: "Can I use AI-generated art in commercial games?", a: "Generally yes for the major tools (Midjourney, DALL-E), but terms vary and are evolving. Key considerations: (1) check the tool's commercial usage terms, (2) be aware that AI art trained on copyrighted images faces ongoing legal challenges, (3) document your AI usage for platform certification." },
    { q: "How do LLM NPCs work in a WebGL game?", a: "The game sends a context prompt (NPC personality, game state, player input) to an LLM API (OpenAI, Anthropic, etc.) and displays the response as dialogue. Latency is 500ms–2s, making it suitable for RPG dialogue but not real-time interactions. Cost per conversation is $0.001–$0.01 at current API rates." },
    { q: "What's the impact on bundle size?", a: "AI inference happens server-side (API call), so it doesn't impact bundle size. The only client-side addition is the fetch call and rendering logic. For fully offline AI using ONNX.js or TensorFlow.js, models add 50MB–500MB which far exceeds platform limits." },
    { q: "Are there legal risks with AI NPCs?", a: "Yes — primarily around unexpected content generation. LLMs can produce content that violates platform content policies even with safety guardrails. Always implement server-side content filtering before displaying LLM output, and have a moderation appeals process." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">AI Tools for WebGL Game Development</h2>
      <DataTable
        headers={["Tool Category", "Leading Tools", "Use Case", "Cost Range", "WebGL Compatible"]}
        rows={[
          ["2D Art Generation", "Midjourney, DALL-E 3, Stability AI", "Sprites, backgrounds, UI", "$10–$60/month", "✓ Yes (offline)"],
          ["3D Asset Generation", "Meshy, CSM, Tripo3D", "3D models → convert to 2D sprite", "$20–$100/month", "✓ Via pipeline"],
          ["Sound/Music AI", "Suno, Udio, ElevenLabs", "Background music, SFX, voice", "$10–$30/month", "✓ Yes (offline)"],
          ["LLM NPCs / Dialogue", "OpenAI GPT-4o, Claude 3.5", "Dynamic NPC conversations", "$0.001–$0.01/call", "✓ Via API"],
          ["Procedural Level Gen", "Custom models + LLM APIs", "Daily challenges, unique maps", "Varies", "✓ Via API"],
          ["On-device AI", "ONNX.js, TF.js", "Offline inference", "Free", "⚠ Bundle size concern"],
        ]}
      />

      <IntelligenceNote>
        Studios using AI-generated daily content are reporting day-7 retention improvements of 25–40% compared to static content. The psychological driver is the same as Wordle — players return daily because they know fresh content exists. This mechanic is now being explicitly requested by platform partners (Poki, CrazyGames) in their publisher outreach to studios.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">LLM NPC Implementation Pattern</h2>
      <CodeBlock code={`// Server-side NPC dialogue endpoint (Node.js/Express)
app.post('/api/npc-dialogue', async (req, res) => {
  const { npcPersonality, playerInput, gameContext } = req.body;

  const systemPrompt = \`You are \${npcPersonality.name}, a \${npcPersonality.role}.
    Personality: \${npcPersonality.traits.join(', ')}.
    Current game context: \${gameContext}.
    Respond in 1-3 sentences. Stay in character. No meta-commentary.
    Content policy: family-friendly, no violence, no adult content.\`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',  // cheaper for high-volume NPC dialogue
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: playerInput }
    ],
    max_tokens: 100,
    temperature: 0.8,
  });

  const dialogue = completion.choices[0].message.content;

  // Content safety filter before returning
  const safeDialogue = await filterContent(dialogue);

  res.json({ dialogue: safeDialogue });
});`} />
    </>
  ),
};

export default function AIInGameDev() {
  return <ArticleLayout article={article} />;
}