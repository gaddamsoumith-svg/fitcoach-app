import React, { useState } from "react";
import { RotateCw, X } from "lucide-react";
import { MUSCLE_INFO, FRONT_REGIONS, BACK_REGIONS, BASE_BODY } from "../data/exercises";
import { Card } from "./ui.jsx";

/* ============================================================
   BODY MAP — interactive front/back muscle diagram (original SVG, tappable regions)
   ============================================================ */
function BodyMap({ t, primary = [], secondary = [], size = 150 }) {
  const [view, setView] = useState("front");
  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const regions = view === "front" ? FRONT_REGIONS : BACK_REGIONS;
  const info = selected ? MUSCLE_INFO[selected] : null;

  const regionColor = (key) => {
    if (primary.includes(key)) return t.coral;
    if (secondary.includes(key)) return t.turmeric;
    return t.inkFaint;
  };
  const regionOpacity = (key) => (primary.includes(key) || secondary.includes(key) ? 0.92 : 0.25);

  const flip = () => {
    setSpinning(true);
    setTimeout(() => { setView(v => (v === "front" ? "back" : "front")); setSelected(null); }, 160);
    setTimeout(() => setSpinning(false), 340);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 12, fontSize: 10.5, color: t.inkDim }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: t.coral, display: "inline-block" }} /> Primary
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: t.turmeric, display: "inline-block" }} /> Secondary
          </span>
        </div>
        <button onClick={flip} style={{
          display: "flex", alignItems: "center", gap: 5, background: t.bgElevated, border: `1px solid ${t.border}`,
          borderRadius: 10, padding: "5px 10px", fontSize: 11, fontWeight: 600, color: t.ink,
        }}>
          <RotateCw size={12} /> {view === "front" ? "Front" : "Back"} view
        </button>
      </div>

      <div style={{
        display: "flex", justifyContent: "center", perspective: 600,
        transform: spinning ? "rotateY(90deg)" : "rotateY(0deg)", transition: "transform 0.32s ease",
      }}>
        <svg viewBox="0 0 200 300" width={size} height={size * 1.5}>
          {BASE_BODY.map((s, i) => s.shape === "circle"
            ? <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={t.inkFaint} opacity={0.18} />
            : <rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} rx={s.rx} fill={t.inkFaint} opacity={0.18} />
          )}
          {regions.map((r, i) => {
            const color = regionColor(r.key);
            const op = regionOpacity(r.key);
            return r.shape === "ellipse"
              ? <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} fill={color} opacity={op} stroke={t.bg} strokeWidth={1.5}
                  style={{ cursor: "pointer" }} onClick={() => setSelected(r.key)} />
              : <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} rx={r.rx} fill={color} opacity={op} stroke={t.bg} strokeWidth={1.5}
                  style={{ cursor: "pointer" }} onClick={() => setSelected(r.key)} />;
          })}
        </svg>
      </div>

      {info && (
        <Card t={t} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{info.label}</div>
              <div style={{ fontSize: 11, color: t.inkFaint, fontStyle: "italic", marginTop: 1 }}>{info.anatomicalName}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: t.inkFaint, padding: 2 }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: 12, color: t.inkDim, marginTop: 6, lineHeight: 1.5 }}>{info.function}</div>
        </Card>
      )}
      {!info && <div style={{ fontSize: 10.5, color: t.inkFaint, textAlign: "center", marginTop: 4 }}>Tap a highlighted muscle to learn more</div>}
    </div>
  );
}

/* ============================================================
   ANIMATED DEMO — lightweight looping CSS/SVG movement illustration
   ============================================================ */

export { BodyMap };
