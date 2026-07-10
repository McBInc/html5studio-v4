import React, { useMemo } from "react";

function getTierConfig(score) {
  if (score >= 90) return {
    tier: "AAA", tierLabel: "AAA RATED", color: "#00FF88",
    colorDim: "#00FF8844", colorFaint: "#00FF8812", label: "CERTIFIED · ELITE",
  };
  if (score >= 80) return {
    tier: "AA", tierLabel: "AA RATED", color: "#38BDF8",
    colorDim: "#38BDF844", colorFaint: "#38BDF812", label: "CERTIFIED · STANDARD",
  };
  if (score >= 70) return {
    tier: "A", tierLabel: "A RATED", color: "#F59E0B",
    colorDim: "#F59E0B44", colorFaint: "#F59E0B12", label: "CERTIFIED · ENTRY",
  };
  return {
    tier: null, tierLabel: "UNRATED", color: "#444444",
    colorDim: "#44444433", colorFaint: "#44444410", label: "UNRATED",
  };
}

const SQUIRCLE       = "M 300,10 C 520,10 590,80 590,300 C 590,520 520,590 300,590 C 80,590 10,520 10,300 C 10,80 80,10 300,10 Z";
const SQUIRCLE_INNER = "M 300,22 C 508,22 578,92 578,300 C 578,508 508,578 300,578 C 92,578 22,508 22,300 C 22,92 92,22 300,22 Z";

export default function UniversalCertBadge({ certId = "CERT-XXXX-000", healthScore = 0, studioName = "", size = 600 }) {
  const uid = useMemo(() => `b${Math.random().toString(36).slice(2, 8)}`, []);
  const cfg = getTierConfig(healthScore);

  const p = {
    clip:       `url(#clip-${uid})`,
    bgGlow:     `url(#bgGlow-${uid})`,
    borderGlow: `url(#borderGlow-${uid})`,
    glass:      `url(#glass-${uid})`,
    glassSheen: `url(#glassSheen-${uid})`,
    etchGlow:   `url(#etchGlow-${uid})`,
    strongGlow: `url(#strongGlow-${uid})`,
  };

  const arcC = 2 * Math.PI * 68;
  const arcFill = (healthScore / 100) * arcC;
  const issuedDate = new Date().toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "2-digit" });

  return (
    <svg viewBox="0 0 600 600" width={size} height={size} style={{ display: "block" }}>
      <defs>
        <clipPath id={`clip-${uid}`}><path d={SQUIRCLE} /></clipPath>

        <radialGradient id={`bgGlow-${uid}`} cx="50%" cy="46%" r="52%">
          <stop offset="0%"   stopColor={cfg.color} stopOpacity="0.13" />
          <stop offset="50%"  stopColor={cfg.color} stopOpacity="0.04" />
          <stop offset="100%" stopColor="#060809"   stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`glassSheen-${uid}`} x1="0%" y1="0%" x2="30%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="40%"  stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`glass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>

        <filter id={`borderGlow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4"  result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="b3" />
          <feMerge><feMergeNode in="b3" /><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <filter id={`etchGlow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <filter id={`strongGlow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5"  result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* BG */}
      <path d={SQUIRCLE} fill="#07090E" />
      <path d={SQUIRCLE} fill={p.glassSheen} />
      <path d={SQUIRCLE} fill={p.bgGlow} />

      {/* ETCHED GRID */}
      <g clipPath={p.clip}>
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1="10" y1={46 * i + 4} x2="590" y2={46 * i + 4} stroke={cfg.color} strokeWidth="0.3" opacity="0.06" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={46 * i + 4} y1="10" x2={46 * i + 4} y2="590" stroke={cfg.color} strokeWidth="0.3" opacity="0.06" />
        ))}
        {[80, 520].flatMap(x => [80, 520].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={cfg.color} opacity="0.18" />
        )))}
      </g>

      {/* NEON BORDER */}
      <path d={SQUIRCLE} fill="none" stroke={cfg.color} strokeWidth="6" filter={p.borderGlow} opacity="0.55" />
      <path d={SQUIRCLE} fill="none" stroke={cfg.color} strokeWidth="1.2" opacity="0.9" />
      <path d={SQUIRCLE_INNER} fill="none" stroke={cfg.color} strokeWidth="0.5" opacity="0.22" />

      {/* CORNER BRACKETS */}
      {[
        [[ 28, 70],[28,28],[70,28]],
        [[530, 28],[572,28],[572,70]],
        [[ 28,530],[28,572],[70,572]],
        [[530,572],[572,572],[572,530]],
      ].map((pts, i) => (
        <polyline key={i} points={pts.map(p2 => p2.join(",")).join(" ")}
          fill="none" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="square"
          filter={p.etchGlow} opacity="0.7" />
      ))}

      {/* HTML5STUDIO WORDMARK TOP */}
      <rect x="186" y="28" width="228" height="36" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
      <text x="208" y="54" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="900" letterSpacing="0.5">
        <tspan fill="rgba(255,255,255,0.85)">HTML</tspan>
        <tspan fill="#1e6ff0">5</tspan>
        <tspan fill={cfg.color}>STUDIO</tspan>
      </text>

      {/* TOP DIVIDER */}
      <line x1="60" y1="80" x2="540" y2="80" stroke={cfg.color} strokeWidth="0.4" opacity="0.15" />

      {/* SCORE RING — top section, centred */}
      <g transform="translate(300, 185)">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
          return (
            <line key={i}
              x1={Math.cos(angle) * 72} y1={Math.sin(angle) * 72}
              x2={Math.cos(angle) * 78} y2={Math.sin(angle) * 78}
              stroke={cfg.color} strokeWidth="0.8" opacity="0.18" />
          );
        })}
        <circle cx="0" cy="0" r="56" fill="none" stroke={cfg.colorDim} strokeWidth="1" opacity="0.3" />
        <circle cx="0" cy="0" r="56" fill="none" stroke={cfg.color} strokeWidth="2.5"
          strokeDasharray={`${(healthScore / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
          strokeDashoffset={2 * Math.PI * 56 * 0.25}
          strokeLinecap="round"
          filter={p.strongGlow}
          opacity="0.9" />
        {/* Globe icon — left of ring */}
        <g transform="translate(-140, 0)">
          <rect x="-42" y="-42" width="84" height="84" rx="14" fill={p.glass} stroke={cfg.color} strokeWidth="0.4" opacity="0.3" />
          <g filter={p.etchGlow} opacity="0.95">
            <circle cx="0" cy="0" r="27" fill="none" stroke={cfg.color} strokeWidth="1.4" />
            <ellipse cx="0" cy="0" rx="14" ry="27" fill="none" stroke={cfg.color} strokeWidth="0.9" opacity="0.7" />
            <ellipse cx="0" cy="0" rx="27" ry="11" fill="none" stroke={cfg.color} strokeWidth="0.9" opacity="0.7" />
            <line x1="-27" y1="0" x2="27" y2="0" stroke={cfg.color} strokeWidth="0.6" opacity="0.45" />
            <line x1="0" y1="-27" x2="0" y2="27" stroke={cfg.color} strokeWidth="0.6" opacity="0.45" />
          </g>
          <text x="0" y="54" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="6.5" letterSpacing="1.5" fontWeight="600" fill={cfg.color} opacity="0.45">UNIVERSAL</text>
          <text x="0" y="65" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="6.5" letterSpacing="1.5" fontWeight="600" fill={cfg.color} opacity="0.45">COMPLIANCE</text>
        </g>
        {/* Shield icon — right of ring */}
        <g transform="translate(140, 0)">
          <rect x="-42" y="-42" width="84" height="84" rx="14" fill={p.glass} stroke={cfg.color} strokeWidth="0.4" opacity="0.3" />
          <g filter={p.etchGlow} opacity="0.95">
            <path d="M0,-27 L24,-16 L24,5 C24,19 13,29 0,35 C-13,29 -24,19 -24,5 L-24,-16 Z"
              fill="none" stroke={cfg.color} strokeWidth="1.6" strokeLinejoin="round" />
            <polyline points="-10,4 -2,11 11,-8" fill="none" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="0" y="54" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="6.5" letterSpacing="1.5" fontWeight="600" fill={cfg.color} opacity="0.45">VERIFIED</text>
        </g>
        {/* Score number inside ring */}
        <g filter={p.etchGlow}>
          <text x="0" y="-5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="40" fontWeight="800" fill={cfg.color} opacity="0.95">
            {healthScore}
          </text>
          <text x="0" y="18" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700" letterSpacing="3" fill={cfg.color} opacity="0.6">
            {cfg.tierLabel}
          </text>
        </g>
      </g>

      {/* MIDDLE DIVIDER */}
      <line x1="60" y1="316" x2="540" y2="316" stroke={cfg.color} strokeWidth="0.4" opacity="0.12" />

      {/* GAME ASSET OWNER — middle */}
      <text x="300" y="344" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8.5" letterSpacing="3" fontWeight="500" fill={cfg.color} opacity="0.35">GAME ASSET OWNER</text>
      <g filter={p.etchGlow}>
        {studioName ? (
          <text x="300" y="376" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="22" fontWeight="800" letterSpacing="1.5" fill={cfg.color} opacity="0.92">
            {studioName.toUpperCase()}
          </text>
        ) : (
          <text x="300" y="376" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="500" letterSpacing="2" fill={cfg.color} opacity="0.25">
            — UNASSIGNED —
          </text>
        )}
      </g>

      {/* LOWER DIVIDER */}
      <line x1="60" y1="400" x2="540" y2="400" stroke={cfg.color} strokeWidth="0.4" opacity="0.15" />

      {/* CERT ID STRIP — lifted */}
      <rect x="54" y="416" width="492" height="52" rx="6" fill={cfg.colorFaint} stroke={cfg.color} strokeWidth="0.5" opacity="0.6" />
      <g filter={p.etchGlow}>
        <circle cx="82" cy="442" r="3.5" fill={cfg.color} opacity="0.7" />
      </g>
      <circle cx="82" cy="442" r="7" fill="none" stroke={cfg.color} strokeWidth="0.6" opacity="0.25" />
      <text x="100" y="435" fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="2.5" fontWeight="500" fill={cfg.color} opacity="0.4">CERT ID</text>
      <g filter={p.etchGlow}>
        <text x="100" y="455" fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700" letterSpacing="1.5" fill={cfg.color} opacity="0.9">
          {certId}
        </text>
      </g>
      <text x="538" y="435" textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="1" fill={cfg.color} opacity="0.25">ISSUED</text>
      <text x="538" y="455" textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.5" fill={cfg.color} opacity="0.45">
        {issuedDate}
      </text>

      {/* WORDMARK BOTTOM */}
      <text x="300" y="540" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="9" fontWeight="800" letterSpacing="0.5">
        <tspan fill="rgba(255,255,255,0.3)">HTML</tspan>
        <tspan fill="#1e6ff0" opacity="0.6">5</tspan>
        <tspan fill={cfg.color} opacity="0.4">STUDIO</tspan>
        <tspan fill="rgba(255,255,255,0.15)" fontSize="8" letterSpacing="2"> · CERTIFICATION AUTHORITY</tspan>
      </text>

      {/* GLASS SHEEN */}
      <path d="M 120,10 C 220,10 380,10 480,10 C 510,30 520,60 510,80 C 400,60 200,60 90,80 C 80,60 90,30 120,10 Z"
        fill="rgba(255,255,255,0.025)" clipPath={p.clip} />
    </svg>
  );
}