"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { ARTICLE_MAP } from "@/lib/articles/slugMap";

/**
 * DYNAMIC ARTICLE RESOLVER (V100)
 * Automatically renders articles from the Content Vault.
 * Maintains 100% internal link integrity.
 */

export default function DynamicArticlePage() {
  const params = useParams();
  const slug = params.slug;

  // Find the article config from the map to ensure we have the right file
  const articleEntry = ARTICLE_MAP.find(a => a.slug === slug);

  if (!articleEntry) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
        404 // Intelligence Record Not Found
      </div>
    );
  }

  // Dynamically import the article component from the content vault
  // Using the original V5 filename resolved from the slug map
  const ArticleComponent = dynamic(() => import(`@/content/articles/${articleEntry.file}`), {
    loading: () => <div className="min-h-screen bg-black animate-pulse" />,
    ssr: false
  });

  return <ArticleComponent />;
}
