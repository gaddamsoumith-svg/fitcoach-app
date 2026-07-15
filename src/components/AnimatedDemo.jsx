import React from "react";

/* ============================================================
   ANIMATED DEMO — lightweight looping CSS/SVG movement illustration
   ============================================================ */
function AnimatedDemo({ t, pattern = "press", size = 130 }) {
  const skin = t.ink;
  const shirt = t.turmeric;
  const shorts = t.teal;
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: t.bgElevated, borderRadius: 16, padding: "16px 0" }}>
      <svg viewBox="0 0 120 160" width={size} height={size * 1.3} className={`demo-figure demo-${pattern}`}>
        {/* head + neck */}
        <circle className="demo-head" cx="60" cy="18" r="11" fill={skin} opacity="0.9" />
        <rect x="56" y="27" width="8" height="8" rx="3" fill={skin} opacity="0.8" />
        {/* tapered torso (shoulders wider than waist, like a real upper body) */}
        <path className="demo-torso" d="M44,36 Q60,28 76,36 L72,80 Q60,86 48,80 Z" fill={shirt} opacity="0.92" />
        {/* hips */}
        <path d="M48,80 Q60,86 72,80 L74,96 Q60,102 46,96 Z" fill={shorts} opacity="0.9" />
        {/* shoulder joints */}
        <circle cx="45" cy="38" r="4.5" fill={skin} opacity="0.85" />
        <circle cx="75" cy="38" r="4.5" fill={skin} opacity="0.85" />
        {/* arms — upper arm + forearm for a more articulated, human silhouette */}
        <g className="demo-arm-left" style={{ transformOrigin: "45px 38px" }}>
          <rect x="38" y="38" width="11" height="30" rx="5.5" fill={skin} opacity="0.9" />
          <circle cx="43.5" cy="66" r="4" fill={skin} opacity="0.8" />
          <rect x="38" y="64" width="11" height="26" rx="5.5" fill={skin} opacity="0.75" />
        </g>
        <g className="demo-arm-right" style={{ transformOrigin: "75px 38px" }}>
          <rect x="71" y="38" width="11" height="30" rx="5.5" fill={skin} opacity="0.9" />
          <circle cx="76.5" cy="66" r="4" fill={skin} opacity="0.8" />
          <rect x="71" y="64" width="11" height="26" rx="5.5" fill={skin} opacity="0.75" />
        </g>
        {/* hip joints */}
        <circle cx="52" cy="98" r="4.5" fill={shorts} opacity="0.85" />
        <circle cx="68" cy="98" r="4.5" fill={shorts} opacity="0.85" />
        {/* legs — thigh + shin */}
        <g className="demo-leg-left" style={{ transformOrigin: "52px 98px" }}>
          <rect x="45" y="96" width="13" height="34" rx="6" fill={skin} opacity="0.88" />
          <circle cx="51.5" cy="128" r="4.5" fill={skin} opacity="0.75" />
          <rect x="45" y="126" width="13" height="30" rx="6" fill={skin} opacity="0.7" />
        </g>
        <g className="demo-leg-right" style={{ transformOrigin: "68px 98px" }}>
          <rect x="62" y="96" width="13" height="34" rx="6" fill={skin} opacity="0.88" />
          <circle cx="68.5" cy="128" r="4.5" fill={skin} opacity="0.75" />
          <rect x="62" y="126" width="13" height="30" rx="6" fill={skin} opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}


export { AnimatedDemo };
