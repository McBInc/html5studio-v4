import React from "react";
import ArticleLayout from "../../components/article/ArticleLayout";

const article = {
  title: "CI/CD Pipelines for Unity WebGL: GitHub Actions, Netlify & itch.io",
  pillar: "Deployment & Publishing",
  cluster: "CI/CD Pipelines for WebGL",
  lastVerified: "March 2026",
  color: "#1e6ff0",
  urgency: "active",
  isProtected: true,
  tldr: [
    "GameCI's official GitHub Actions workflow (<code>game-ci/unity-builder</code>) is the industry standard for Unity WebGL CI — handles licensing, caching, and artefact upload.",
    "A full build → test → deploy pipeline runs in ~15 minutes on a GitHub-hosted runner with Unity 2022 LTS.",
    "Netlify and Vercel both support Git-triggered deploys — connect your repo and point the publish directory to <code>build/WebGL/WebGL</code>.",
    "Store Unity serial / licence credentials as GitHub Secrets — never hardcode them in workflow YAML.",
  ],
  relatedSiblings: [
    { slug: "unity-webgl-deploy-hosting", title: "Unity WebGL Deploy & Hosting", urgency: "hot" },
    { slug: "unity-webgl-build-troubleshooting", title: "Build Troubleshooting & Fixes", urgency: "critical" },
  ],
  relatedCrossPillar: [
    { slug: "webgl-certification-standard", title: "WGL-CERT Certification Standard" },
  ],
  faqs: [
    { q: "How do I handle Unity licensing in CI?", a: "Use <code>game-ci/unity-activate</code> with your Unity serial stored as a GitHub Secret (<code>UNITY_SERIAL</code>, <code>UNITY_EMAIL</code>, <code>UNITY_PASSWORD</code>). For Unity Personal plans, use the free activation flow with a <code>.ulf</code> licence file." },
    { q: "How long does a WebGL build take on GitHub Actions?", a: "Typically 10–25 minutes depending on project size and whether the Library cache is warm. Always cache the <code>Library/</code> folder between runs — this can cut build times by 60%." },
    { q: "Can I auto-deploy to itch.io?", a: "Yes — use the <code>josephbmanley/butler-publish-itchio-action</code> action after your build step. You'll need an itch.io API key stored as a secret." },
  ],
  body: ({ IntelligenceNote, DataTable, CodeBlock }) => (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Complete GitHub Actions Workflow</h2>
      <CodeBlock code={`# .github/workflows/build-webgl.yml
name: Build and Deploy WebGL

on:
  push:
    branches: [main]

jobs:
  build:
    name: Build Unity WebGL
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true

      - uses: actions/cache@v4
        with:
          path: Library
          key: Library-WebGL-\${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}
          restore-keys: Library-WebGL-

      - uses: game-ci/unity-builder@v4
        env:
          UNITY_LICENSE: \${{ secrets.UNITY_LICENSE }}
          UNITY_EMAIL:   \${{ secrets.UNITY_EMAIL }}
          UNITY_PASSWORD: \${{ secrets.UNITY_PASSWORD }}
        with:
          targetPlatform: WebGL
          buildName: WebGLBuild
          allowDirtyBuild: false

      - uses: actions/upload-artifact@v4
        with:
          name: WebGL-Build
          path: build/WebGL/WebGL

  deploy:
    name: Deploy to Netlify
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: WebGL-Build
          path: ./build

      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: './build'
          production-branch: main
          github-token: \${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`} />

      <IntelligenceNote>
        Always pin GameCI actions to a specific version tag (e.g. <code>@v4</code>) rather than <code>@main</code>. GameCI releases breaking changes without major version bumps occasionally, and an unversioned reference caused widespread CI failures in November 2025 when the activation flow changed for Unity 6.
      </IntelligenceNote>

      <h2 className="text-2xl font-bold mt-10 mb-4">Platform Deploy Targets Comparison</h2>
      <DataTable
        headers={["Platform", "Trigger", "Action/Tool", "Config Effort", "Free Tier"]}
        rows={[
          ["Netlify", "Git push or artefact upload", "<code>nwtgck/actions-netlify</code>", "Low", "100GB/month"],
          ["Vercel", "Git push (auto)", "Native Vercel Git integration", "Zero", "100GB/month"],
          ["itch.io", "Artefact upload via Butler", "<code>josephbmanley/butler-publish-itchio-action</code>", "Low", "Unlimited"],
          ["GitHub Pages", "Git push to <code>gh-pages</code> branch", "<code>peaceiris/actions-gh-pages</code>", "Medium (MIME workaround)", "1GB"],
          ["AWS S3 + CloudFront", "Artefact upload", "<code>aws-actions/configure-aws-credentials</code>", "High", "Pay-as-you-go"],
        ]}
      />

      <h2 className="text-2xl font-bold mt-10 mb-4">Caching Strategy</h2>
      <p className="text-foreground/75 leading-relaxed mb-4">
        The Unity <code>Library/</code> folder is the most expensive part of any CI build. Always cache it with a hash key based on your project files:
      </p>
      <CodeBlock code={`- uses: actions/cache@v4
  with:
    path: Library
    key: Library-\${{ matrix.targetPlatform }}-\${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}
    restore-keys: |
      Library-\${{ matrix.targetPlatform }}-
      Library-`} />
    </>
  ),
};

export default function CICDWebGL() {
  return <ArticleLayout article={article} />;
}
