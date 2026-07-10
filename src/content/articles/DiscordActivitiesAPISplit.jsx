import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "Discord Activities API Split — The Feb 2025 Breaking Change & How to Fix Your Embedded Game",
  pillar: "Platform Ecosystems",
  cluster: "Discord Activities",
  lastVerified: "March 2026",
  color: "#5865F2",
  urgency: "critical",
  isProtected: true,
  tldr: [
    "Discord split its Activities SDK into <strong>granular permission scopes</strong> on February 25, 2025 — any game using the monolithic auth model is now broken for new Discord users",
    "The old <code>activities.write</code> scope no longer grants all permissions — you must now request each scope individually",
    "Discord's sandbox environment changed simultaneously, meaning local testing setups built before Feb 2025 are also reporting false positives",
    "Studios who haven't updated are seeing <strong>silent auth failures</strong> that only affect users who haven't previously granted permissions to the activity",
  ],
  relatedSiblings: [
    { slug: "meta-sdk-v8-migration", title: "Meta Instant Games SDK v8.0 Migration", urgency: "critical" },
    { slug: "tiktok-touch-action-css", title: "TikTok Mini-Games — Touch-Action CSS Fix", urgency: "hot" },
    { slug: "api-deprecation-tracker", title: "API Deprecation Tracker — Full 2026 Sunset Schedule", urgency: "hot" },
  ],
  relatedCrossPillar: [
    { slug: "webgl-certification-standard", title: "WebGL Certification Standard (WGL-CERT)" },
    { slug: "pii-privacy-compliance", title: "PII & Privacy Compliance for WebGL Games" },
  ],
  faqs: [
    {
      q: "Does the Discord Activities API split affect games that use OAuth outside of the Activities SDK?",
      a: "Partially. If your game uses standard Discord OAuth (not the embedded Activities SDK), the scope changes still apply to any activity-specific permissions. Pure OAuth flows for login are unaffected, but any call to Activities-specific endpoints now requires the new granular scopes.",
    },
    {
      q: "What exactly is the 'Nightmare Split' — is it an official Discord term?",
      a: "No, 'Nightmare Split' is the community name that emerged in developer forums due to the simultaneous breakage across sandbox, production, and documentation. Discord's official documentation refers to it as the 'Granular Scopes Migration'. The community name stuck because the timing meant no safe testing path existed during the migration window.",
    },
    {
      q: "My game worked in the sandbox before Feb 25. Why is it now failing only for some users?",
      a: "Users who had previously granted permissions to your Activity before Feb 25 have those permissions cached. New users — or users who revoked permissions — hit the new scope model and see failures. This is why the bug manifests inconsistently across your user base.",
    },
    {
      q: "How do I test my Activity with zero pre-granted permissions to reproduce the bug?",
      a: "In Discord Developer Portal, go to your application, then OAuth2 → Revoke All User Tokens. Then test your Activity with that account. This simulates a first-time user under the new scope model.",
    },
    {
      q: "Does the granular scopes change affect Telegram Mini Apps or Meta Instant Games?",
      a: "No. Each platform has its own permissions model. However, if your studio has games on multiple platforms, it's worth auditing each one independently — Meta made a similar zero-permissions architectural change in their v8.0 SDK (also in 2025–2026).",
    },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <div className="space-y-6 text-foreground/80 leading-relaxed">

      <h2 className="text-2xl font-bold text-foreground mt-10">What Changed on February 25, 2025 — and Why Studios Were Caught Off Guard</h2>
      <p>
        Discord's embedded Activities platform had, since its launch, operated on a broadly-permissioned auth model. A game requesting <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">activities.write</code> received, in practice, write access to the full range of activity-adjacent features — presence, voice channel state, rich presence, and user identity within the context of the activity.
      </p>
      <p>
        On February 25, 2025, Discord deprecated this model and enforced a <strong>granular permission scopes</strong> architecture. Each capability now requires its own explicit scope request. The change took effect simultaneously in production and the sandbox environment, leaving studios with no safe path to test before the migration hit live users.
      </p>
      <p>
        The breakage was not uniform. Users who had previously granted permissions to a game's Activity before the migration date had those grants cached — their experience appeared normal. Only <strong>new users, or returning users who had revoked permissions</strong>, hit the new scope model and experienced auth failures. This made the bug extremely difficult to reproduce in internal testing.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-10">Granular Scopes — The New Model Explained</h2>
      <p>
        Under the old model, a single scope declaration covered everything your Activity needed. Under the new model, each capability is a discrete scope:
      </p>
      <DataTable
        headers={["Old Scope", "New Granular Equivalent", "Covers"]}
        rows={[
          ["<code>activities.write</code>", "<code>activities.write</code> (narrowed)", "Activity state updates only"],
          ["<em>(implicit)</em>", "<code>rpc.activities.write</code>", "RPC-based activity updates"],
          ["<em>(implicit)</em>", "<code>rpc.voice.read</code>", "Voice channel state reading"],
          ["<em>(implicit)</em>", "<code>guilds.members.read</code>", "Guild member presence"],
          ["<em>(implicit)</em>", "<code>identify</code>", "User identity within the Activity"],
        ]}
      />
      <p>
        The critical implication: your OAuth2 scope declaration in the developer portal must now explicitly list every scope your Activity uses. Requesting fewer scopes than your code calls will result in silent <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-mono">401 Unauthorized</code> responses — no error thrown to your game, just missing data.
      </p>

      <CodeBlock code={`// OLD model (pre-Feb 2025) — do not use
const auth = await discordSdk.commands.authorize({
  client_id: CLIENT_ID,
  response_type: "code",
  state: "",
  prompt: "none",
  scope: ["activities.write", "identify"],
});

// NEW model — granular scopes required
const auth = await discordSdk.commands.authorize({
  client_id: CLIENT_ID,
  response_type: "code",
  state: "",
  prompt: "none",
  scope: [
    "identify",
    "guilds",
    "rpc.activities.write",
    "guilds.members.read",
    // add only scopes your Activity actually uses
  ],
});`} />

      <IntelligenceNote>
        Discord's official migration guide instructs studios to "add required scopes to the OAuth2 configuration in the developer portal." What the documentation does not clarify — but was confirmed in a Discord developer support thread — is that <strong>the portal will silently accept invalid scope combinations</strong>. If you include a scope your application type is not approved for, Discord returns a successful auth token but silently drops that scope from the grant. This means your local tests pass, but production users with stricter privacy settings hit the failure. Always verify your granted scopes by decoding the returned access token with a JWT inspector before considering the migration complete.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold text-foreground mt-10">How to Test Your Activity Under the New Scope Model</h2>
      <p>
        Standard sandbox testing will give you a false sense of security because your developer account has elevated permissions by default. To accurately simulate a new user under the new scope model:
      </p>
      <ul className="list-none space-y-2 pl-4">
        {[
          "In Discord Developer Portal: OAuth2 → Revoke All User Tokens for your application",
          "Create a secondary Discord account that has never interacted with your Activity",
          "Join a test server with that account and launch your Activity",
          "Open browser DevTools → Network tab — watch for 401 responses on any Activities API calls",
          "Verify the granted scopes in the access token by decoding it at jwt.io",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2"><span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-indigo-400" />{item}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-foreground mt-10">Scope Declaration Checklist for Migration</h2>
      <DataTable
        headers={["Capability Used", "Required Scope", "Priority"]}
        rows={[
          ["User identity (name, avatar)", "<code>identify</code>", "<span style='color:#EE1D52'>Critical</span>"],
          ["Activity state / presence", "<code>rpc.activities.write</code>", "<span style='color:#EE1D52'>Critical</span>"],
          ["Voice channel awareness", "<code>rpc.voice.read</code>", "<span style='color:#FF6B00'>High</span>"],
          ["Server member list", "<code>guilds.members.read</code>", "<span style='color:#FF6B00'>High</span>"],
          ["Guild membership", "<code>guilds</code>", "<span style='color:#1e6ff0'>Medium</span>"],
          ["Direct messages", "<code>messages.read</code>", "<span style='color:#1e6ff0'>Medium</span>"],
        ]}
      />
    </div>
  ),
};

export default function DiscordActivitiesAPISplit() {
  return <ArticleLayout article={article} />;
}
