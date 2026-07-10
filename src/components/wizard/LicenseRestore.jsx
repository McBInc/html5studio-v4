import React, { useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LicenseRestore({ onRestore }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "found" | "notfound"
  const [license, setLicense] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    const results = await base44.entities.License.filter({ email: email.trim().toLowerCase(), is_active: true }, "-created_date", 1);
    if (results && results.length > 0) {
      setLicense(results[0]);
      setStatus("found");
      // Persist to localStorage
      localStorage.setItem("h5s_license", JSON.stringify(results[0]));
      setTimeout(() => onRestore(results[0]), 1200);
    } else {
      setStatus("notfound");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
      <p className="text-xs font-bold text-foreground mb-1">Already purchased?</p>
      <p className="text-xs text-muted-foreground mb-4">Enter your email to restore access on this device.</p>

      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="px-4 py-2 rounded-lg text-xs font-black text-white disabled:opacity-50 transition-all hover:opacity-90 flex items-center gap-1.5"
          style={{ background: "#1e6ff0" }}
        >
          {status === "loading" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Restore"}
        </button>
      </form>

      {status === "found" && (
        <div className="flex items-center gap-2 mt-3 text-xs text-green-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          License found — restoring <span className="font-mono font-bold">{license.tier}</span> access…
        </div>
      )}
      {status === "notfound" && (
        <div className="flex items-center gap-2 mt-3 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5" />
          No license found for that email. <a href="mailto:support@html5studio.io" className="underline ml-1">Contact support</a>
        </div>
      )}
    </div>
  );
}