import React, { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FALLBACK_ITEMS = [
  { tag: "DEADLINE",    tagColor: "#EE1D52", source: "Meta",     summary: "WebGL SDK v8.0 mandatory by Sept 30 — legacy builds will be rejected" },
  { tag: "BREAKING",    tagColor: "#FF9500", source: "Discord",  summary: "Activities Nightmare Split: granular permission scopes now required" },
  { tag: "REGULATORY",  tagColor: "#5865F2", source: "EU DMA",   summary: "DMA Article 7: game publishers must provide certified compliance proof" },
  { tag: "ENFORCEMENT", tagColor: "#FF6B00", source: "YouTube",  summary: "Playables enforces strict 15MB bundle limit — oversized builds blocked at ingestion" },
  { tag: "BUG ALERT",   tagColor: "#EE1D52", source: "TikTok",   summary: "Touch-action CSS requirement causing mass swipe-to-exit failures" },
  { tag: "CRITICAL",    tagColor: "#EE1D52", source: "Telegram", summary: "Mini Apps SDK 7.0 enforced — older bridges produce silent payment failures" },
];

function TickerItem({ item }) {
  const content = (
    <span className="inline-flex items-center gap-2.5 px-8">
      <span className="text-[8px] font-black font-mono px-1.5 py-0.5 rounded"
        style={{ color: item.tagColor || item.tag_color, background: `${item.tagColor || item.tag_color}20` }}>
        {item.tag}
      </span>
      <span className="text-[9px] font-mono font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
        {item.source}
      </span>
      <span className="w-1 h-1 rounded-full inline-block flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />
      <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
        {item.summary || item.title}
      </span>
      <span className="ml-2 text-[10px] font-mono" style={{ color: "rgba(238,29,82,0.35)" }}>◆</span>
    </span>
  );

  if (item.url) {
    return <a href={item.url} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">{content}</a>;
  }
  return content;
}

export default function NewsTicker() {
  const [items, setItems] = useState(FALLBACK_ITEMS);

  useEffect(() => {
    base44.entities.PlatformAlert.filter({ is_active: true }, '-created_date', 50)
      .then(alerts => {
        if (alerts && alerts.length > 0) {
          const cleanText = (text) => {
            if (!text) return "";
            return text
              .replace(/<!\[CDATA\[[\s\S]*?\]\]>/gi, "")  // strip CDATA
              .replace(/<!--[\s\S]*?-->/g, "")              // strip HTML comments
              .replace(/<[^>]+>/g, " ")                     // strip HTML tags
              .replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
              .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&nbsp;/gi, " ")
              .replace(/&[a-z]+;/gi, "")                   // strip remaining entities
              .replace(/\s+/g, " ").trim();
          };

          const isUsable = (item) => {
            const raw = item.summary || item.title || "";
            const text = cleanText(raw);
            if (!text || text.length < 25) return false;
            if (/^https?:\/\//i.test(text)) return false;
            if (!text.includes(" ")) return false;
            // Skip if it still looks like code/markup garbage
            if ((text.match(/[<>&]/g) || []).length > 3) return false;
            return true;
          };

          const processed = alerts
            .filter(isUsable)
            .map(item => ({
              ...item,
              summary: cleanText(item.summary || item.title).slice(0, 160),
            }));

          if (processed.length > 0) setItems(processed);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center overflow-hidden"
      style={{ height: 32, background: "rgba(4,7,18,0.97)", borderBottom: "1px solid rgba(238,29,82,0.2)" }}
    >
      {/* LIVE badge */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 h-full z-10"
        style={{ background: "rgba(238,29,82,0.12)", borderRight: "1px solid rgba(238,29,82,0.25)" }}>
        <Radio className="w-3 h-3 text-destructive animate-pulse" />
        <span className="text-[9px] font-mono font-black text-destructive uppercase tracking-widest whitespace-nowrap">Live</span>
      </div>

      {/* Ticker tape */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(4,7,18,0.97), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, rgba(4,7,18,0.97), transparent)" }} />

        <div className="ticker-tape flex items-center" style={{ whiteSpace: "nowrap" }}>
          <span className="inline-flex">
            {items.map((item, i) => <TickerItem key={`a-${i}`} item={item} />)}
          </span>
          <span className="inline-flex" aria-hidden>
            {items.map((item, i) => <TickerItem key={`b-${i}`} item={item} />)}
          </span>
        </div>
      </div>

      <style>{`
        .ticker-tape {
          display: inline-flex;
          animation: ticker-tape 250s linear infinite;
        }
        @keyframes ticker-tape {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-tape:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}