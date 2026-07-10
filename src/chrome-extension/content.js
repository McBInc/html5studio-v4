// HTML5STUDIO Chrome Extension — Content Script
// Injects a subtle compliance reminder on known dev portals

(function () {
  // Don't inject twice
  if (document.getElementById('html5studio-banner')) return;

  const PLATFORM_MAP = {
    "developers.facebook.com": { name: "Meta Instant Games", urgency: "SDK v8.0 mandatory — Sept 30, 2026", color: "#EE1D52" },
    "developers.tiktok.com":   { name: "TikTok Mini Games",  urgency: "Touch-action CSS bug causing mass failures", color: "#FF6B00" },
    "discord.com/developers":  { name: "Discord Activities",  urgency: "Granular OAuth scopes now required", color: "#5865F2" },
    "developer.crazygames.com":{ name: "CrazyGames",         urgency: "SDK v3 migration required", color: "#F39C12" },
    "poki.com":                { name: "Poki",               urgency: "PokiSDK lifecycle implementation required", color: "#00C896" },
  };

  const host = window.location.hostname;
  const match = Object.entries(PLATFORM_MAP).find(([k]) => host.includes(k));
  if (!match) return;

  const [, info] = match;

  const banner = document.createElement('div');
  banner.id = 'html5studio-banner';
  banner.innerHTML = `
    <div style="
      position: fixed; bottom: 20px; right: 20px; z-index: 999999;
      background: #080c18; border: 1px solid ${info.color}40;
      border-radius: 12px; padding: 12px 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      font-family: 'Inter', -apple-system, sans-serif;
      max-width: 300px; cursor: pointer;
      animation: h5s-slide-in 0.3s ease;
    " id="html5studio-toast">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <div style="
          width:22px;height:22px;border-radius:6px;
          background:linear-gradient(135deg,#1e6ff0,#0a4ab8);
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:900;color:#fff;flex-shrink:0;
          font-family:monospace;
        ">H5</div>
        <span style="font-size:11px;font-weight:700;color:#fff;">HTML5STUDIO</span>
        <span style="
          margin-left:auto;font-size:8px;font-family:monospace;font-weight:700;
          padding:2px 6px;border-radius:20px;
          color:${info.color};background:${info.color}18;
        ">COMPLIANCE</span>
        <button id="html5studio-close" style="
          background:none;border:none;color:rgba(255,255,255,0.3);
          cursor:pointer;font-size:14px;padding:0;line-height:1;
        ">×</button>
      </div>
      <div style="font-size:10px;color:rgba(255,255,255,0.5);line-height:1.4;margin-bottom:8px;">
        <strong style="color:${info.color};">${info.name}:</strong> ${info.urgency}
      </div>
      <div style="
        background:rgba(30,111,240,0.12);border:1px solid rgba(30,111,240,0.25);
        border-radius:7px;padding:6px 10px;
        font-size:10px;color:#1e6ff0;font-weight:600;text-align:center;
      ">
        Click to open Compliance Wizard ›
      </div>
    </div>
    <style>
      @keyframes h5s-slide-in {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    </style>
  `;

  document.body.appendChild(banner);

  document.getElementById('html5studio-toast').addEventListener('click', () => {
    banner.remove();
    // Open extension popup (can't programmatically, so open site instead)
    window.open('https://html5studio.app/compliance-wizard', '_blank');
  });

  document.getElementById('html5studio-close').addEventListener('click', (e) => {
    e.stopPropagation();
    banner.remove();
  });

  // Auto-dismiss after 10s
  setTimeout(() => { if (banner.parentNode) banner.remove(); }, 10000);
})();