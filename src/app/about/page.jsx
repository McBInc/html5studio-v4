"use client";

import React from "react";
import NewsTicker from "@/components/landing/NewsTicker";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <NewsTicker />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">About</div>
        <h1 className="text-4xl font-black tracking-tight mb-6">About HTML5STUDIO</h1>
        <div className="h-px bg-border mb-8" />

        <div className="space-y-5 text-foreground/80 leading-relaxed text-base">
          <p>
            <strong className="text-foreground">HTML5STUDIO</strong> is the definitive intelligence and certification platform for HTML5 and WebGL game developers navigating the rapidly shifting landscape of social and browser-based game distribution.
          </p>
          <p>
            Deploying a game today means integrating with a growing number of platform-specific SDKs — Meta Instant Games, TikTok Mini Games, Discord Activities, YouTube Playables, Poki, CrazyGames, LinkedIn Playables, and more. Each platform enforces its own authentication model, lifecycle hooks, bundle size constraints, and compliance deadlines. A single missed SDK migration can silently break a live game for millions of players overnight.
          </p>
          <p>
            HTML5STUDIO exists to solve exactly that problem. We provide a continuously updated Intelligence Centre tracking every platform API change, deprecation deadline, and regulatory update that affects HTML5 game deployments. Our Compliance Wizard generates precise, engine-specific implementation code — whether you build in Unity, Phaser, Godot, Construct 3, Cocos Creator, PlayCanvas, or Unreal — so developers spend less time reading fragmented documentation and more time shipping.
          </p>
          <p>
            Beyond tooling, we operate the <strong className="text-foreground">WGL-CERT certification standard</strong> — an independent audit framework that scores live games against a composite health checklist covering SDK compliance, performance benchmarks, IP protection, and investor-readiness metrics. Certified games receive a verifiable badge and a formal certification report trusted by studios, publishers, and investors alike.
          </p>
          <p>
            HTML5STUDIO is built and maintained by a specialist team with deep roots in browser game distribution, compliance research, and web platform engineering. We monitor upstream developer portals, regulatory bodies, and community forums daily so our users always have the earliest possible warning of changes that affect their live games.
          </p>
          <p>
            Whether you're an indie solo developer shipping your first Meta Instant Game or a studio managing a multi-platform catalogue, HTML5STUDIO gives you the intelligence, tooling, and certification infrastructure to deploy with confidence.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}