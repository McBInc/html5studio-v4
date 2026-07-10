import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const PLATFORMS = ["All Platforms", "Meta Instant Games", "Discord Activities", "TikTok Mini-Games", "Telegram Mini Apps", "YouTube Playables", "Poki", "CrazyGames", "GameDistribution", "itch.io"];
const RISK_LEVELS = ["All Risks", "critical", "high", "medium", "low", "unknown"];
const SIZES = ["All Sizes", "solo", "indie", "mid-size", "large", "publisher"];

export default function DirectoryFilters({ filters, onChange, totalCount, filteredCount }) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
          placeholder="Search studios, games, platforms..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-muted-foreground/50">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Filter</span>
        </div>

        <select
          className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50"
          style={{ background: "#0f1220" }}
          value={filters.platform}
          onChange={(e) => onChange({ ...filters, platform: e.target.value })}
        >
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50"
          style={{ background: "#0f1220" }}
          value={filters.riskLevel}
          onChange={(e) => onChange({ ...filters, riskLevel: e.target.value })}
        >
          {RISK_LEVELS.map((r) => <option key={r} value={r} className="capitalize">{r === "All Risks" ? r : r.toUpperCase()}</option>)}
        </select>

        <select
          className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50"
          style={{ background: "#0f1220" }}
          value={filters.size}
          onChange={(e) => onChange({ ...filters, size: e.target.value })}
        >
          {SIZES.map((s) => <option key={s} value={s} className="capitalize">{s === "All Sizes" ? s : s}</option>)}
        </select>

        <select
          className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50"
          style={{ background: "#0f1220" }}
          value={filters.outreachStatus}
          onChange={(e) => onChange({ ...filters, outreachStatus: e.target.value })}
        >
          <option value="all">All Studios</option>
          <option value="contacted">Contacted</option>
          <option value="not_contacted">Not Contacted</option>
        </select>

        {(filters.search || filters.platform !== "All Platforms" || filters.riskLevel !== "All Risks" || filters.size !== "All Sizes" || filters.outreachStatus !== "all") && (
          <button
            onClick={() => onChange({ search: "", platform: "All Platforms", riskLevel: "All Risks", size: "All Sizes", outreachStatus: "all" })}
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-white/10 hover:border-white/20"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-[10px] font-mono text-muted-foreground/50">
          {filteredCount} / {totalCount} studios
        </span>
      </div>
    </div>
  );
}