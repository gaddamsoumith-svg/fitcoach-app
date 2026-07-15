import React, { useState } from "react";
import { Zap, Flame, Clock, History, Award, ChevronDown } from "lucide-react";
import { getExerciseDetail } from "../data/exercises";
import { Card } from "./ui.jsx";
import { AnimatedDemo } from "./AnimatedDemo.jsx";
import { BodyMap } from "./BodyMap.jsx";

function MiniStat({ t, icon: Icon, label, value, accent }) {
  return (
    <div style={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 12, padding: "8px 6px", textAlign: "center" }}>
      <Icon size={13} color={accent || t.inkDim} style={{ margin: "0 auto", display: "block" }} />
      <div className="mono" style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: accent || t.ink }}>{value}</div>
      <div style={{ fontSize: 9, color: t.inkFaint, marginTop: 1 }}>{label}</div>
    </div>
  );
}

/* ============================================================
   EDUCATION ACCORDION — expandable coaching content
   ============================================================ */
function EducationAccordion({ t, detail }) {
  const [open, setOpen] = useState(null);
  const sections = [
    { key: "benefits", label: "Benefits", content: detail.benefits },
    { key: "why", label: "Why it's in your program", content: detail.whyIncluded },
    { key: "tips", label: "Execution tips", content: detail.tips },
    { key: "mistakes", label: "Common mistakes", content: detail.mistakes },
    { key: "safety", label: "Safety precautions", content: detail.safety },
    { key: "alternatives", label: "Alternative exercises", content: detail.alternatives },
    { key: "variations", label: "Easier & advanced variations", content: [`Easier: ${detail.easier}`, `Advanced: ${detail.advanced}`] },
    { key: "warmup", label: "Warm-up recommendation", content: detail.warmup },
    { key: "stretch", label: "Stretch afterward", content: detail.stretchAfter },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sections.map(s => {
        const hasContent = Array.isArray(s.content) ? s.content.filter(Boolean).length > 0 : !!(s.content && s.content !== "N/A");
        if (!hasContent) return null;
        const isOpen = open === s.key;
        return (
          <div key={s.key} style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
            <button onClick={() => setOpen(isOpen ? null : s.key)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", background: "none", border: "none", color: t.ink, fontSize: 12.5, fontWeight: 600,
            }}>
              {s.label}
              <ChevronDown size={14} color={t.inkFaint} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
            </button>
            {isOpen && (
              <div style={{ padding: "0 12px 12px", fontSize: 12, color: t.inkDim, lineHeight: 1.6 }}>
                {Array.isArray(s.content)
                  ? <ul style={{ margin: 0, paddingLeft: 16 }}>{s.content.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  : <div>{s.content}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Combines the demo animation, quick stats, body map, and education accordion — reused in the
   pre-workout Session Overview and inline during active logging. */
function ExerciseDetailBlock({ t, name, category, history }) {
  const detail = getExerciseDetail(name, category);
  const hist = history?.[name];
  return (
    <div style={{ marginTop: 10 }}>
      <AnimatedDemo t={t} pattern={detail.pattern} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        <MiniStat t={t} icon={Zap} label="Level" value={detail.difficulty} />
        <MiniStat t={t} icon={Flame} label="Burn" value={`~${detail.estCalories} kcal`} />
        <MiniStat t={t} icon={Clock} label="Time" value={`~${detail.estMinutes} min`} />
      </div>
      {hist && (hist.lastWeight || hist.prWeight) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          <MiniStat t={t} icon={History} label="Last time" value={hist.lastWeight ? `${hist.lastWeight}kg × ${hist.lastReps}` : "—"} />
          <MiniStat t={t} icon={Award} label="Personal record" value={hist.prWeight ? `${hist.prWeight}kg × ${hist.prReps}` : "—"} accent={t.turmeric} />
        </div>
      )}
      <div style={{ fontSize: 11, color: t.inkDim, marginTop: 10 }}>Tempo: <span style={{ color: t.ink, fontWeight: 600 }}>{detail.tempo}</span></div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.inkDim, marginBottom: 6, letterSpacing: 0.3 }}>MUSCLES TARGETED</div>
        <BodyMap t={t} primary={detail.primary} secondary={detail.secondary} size={130} />
      </div>
      <div style={{ marginTop: 12 }}>
        <EducationAccordion t={t} detail={detail} />
      </div>
    </div>
  );
}

/* ============================================================
   WORKOUT CALENDAR — color-coded month view + streak/skip summary
   ============================================================ */

export { MiniStat, EducationAccordion, ExerciseDetailBlock };
