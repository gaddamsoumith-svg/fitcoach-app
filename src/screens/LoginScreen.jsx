import React, { useState } from "react";
import { Dumbbell, ArrowRight } from "lucide-react";
import { primaryButtonStyle, secondaryButtonStyle, textInputStyle, fieldLabelStyle } from "../utils/styleHelpers";

/* ============================================================
   LOGIN / PROFILE SETUP
   ============================================================ */
function computeTargets(p) {
  const weight = Number(p.weight) || 56;
  const height = Number(p.height) || 165;
  const age = Number(p.age) || 28;
  const bmr = p.sex === "female"
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;
  const activityMultiplier = { sedentary: 1.3, moderate: 1.5, active: 1.7 }[p.activity] || 1.5;
  const tdee = bmr * activityMultiplier;
  const goalAdj = { gain: 300, maintain: 0, lose: -350 }[p.goal] ?? 0;
  const calories = Math.round((tdee + goalAdj) / 10) * 10;
  const protein = Math.round(weight * 2.0);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat, water: 8 };
}

function LoginScreen({ t, onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", age: "", height: "", weight: "", sex: "male", activity: "moderate", goal: "gain",
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const STEPS = [
    { title: "Let's start with the basics", subtitle: "So we know who we're building this plan for." },
    { title: "Your body stats", subtitle: "Used to calculate your calorie and protein targets accurately." },
    { title: "Activity & goal", subtitle: "The last piece — this decides whether we're building a surplus or a deficit." },
  ];

  const stepValid = [
    form.name.trim().length > 0 && Number(form.age) > 0 && Number(form.age) < 120,
    Number(form.height) > 0 && Number(form.height) < 260 && Number(form.weight) > 0 && Number(form.weight) < 400,
    true,
  ];
  const canAdvance = stepValid[step];

  const fieldStyle = { ...textInputStyle(t), marginTop: 6 };
  const labelStyle = fieldLabelStyle(t);

  const next = () => {
    if (!canAdvance) return;
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onComplete(form);
  };
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <div style={{
      width: "100%", minHeight: "100dvh", background: t.bg, color: t.ink,
      fontFamily: "Inter, -apple-system, sans-serif", display: "flex", flexDirection: "column",
      padding: "max(28px, env(safe-area-inset-top)) 20px 32px",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: t.turmericDim,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
      }}>
        <Dumbbell size={24} color={t.turmeric} />
      </div>

      {/* Step progress indicator */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: i <= step ? t.turmeric : t.border,
            transition: "background 0.2s ease",
          }} />
        ))}
      </div>

      <div className="display" style={{ fontSize: 22, fontWeight: 800 }}>{STEPS[step].title}</div>
      <div style={{ fontSize: 13, color: t.inkDim, marginTop: 4, lineHeight: 1.5 }}>{STEPS[step].subtitle}</div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {step === 0 && (
          <>
            <label>
              <div style={labelStyle}>Name</div>
              <input style={fieldStyle} value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your name" />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                <div style={labelStyle}>Age</div>
                <input style={fieldStyle} type="number" value={form.age} onChange={e => update("age", e.target.value)} placeholder="Years" />
              </label>
              <label>
                <div style={labelStyle}>Sex</div>
                <select style={fieldStyle} value={form.sex} onChange={e => update("sex", e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
            {!stepValid[0] && (form.name || form.age) && (
              <div style={{ fontSize: 11.5, color: t.coral }}>Enter your name and a valid age to continue.</div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                <div style={labelStyle}>Height (cm)</div>
                <input style={fieldStyle} type="number" value={form.height} onChange={e => update("height", e.target.value)} placeholder="e.g. 165" />
              </label>
              <label>
                <div style={labelStyle}>Weight (kg)</div>
                <input style={fieldStyle} type="number" value={form.weight} onChange={e => update("weight", e.target.value)} placeholder="e.g. 56" />
              </label>
            </div>
            {!stepValid[1] && (form.height || form.weight) && (
              <div style={{ fontSize: 11.5, color: t.coral }}>Enter a realistic height and weight to continue.</div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <label>
              <div style={labelStyle}>Daily activity (outside the gym)</div>
              <select style={fieldStyle} value={form.activity} onChange={e => update("activity", e.target.value)}>
                <option value="sedentary">Mostly sitting (desk job)</option>
                <option value="moderate">Some walking/standing</option>
                <option value="active">On my feet most of the day</option>
              </select>
            </label>
            <label>
              <div style={labelStyle}>Primary goal</div>
              <select style={fieldStyle} value={form.goal} onChange={e => update("goal", e.target.value)}>
                <option value="gain">Build lean muscle (slight surplus)</option>
                <option value="maintain">Maintain current weight</option>
                <option value="lose">Lose fat (slight deficit)</option>
              </select>
            </label>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {step > 0 && (
          <button onClick={back} style={{ ...secondaryButtonStyle(t), flex: 1 }}>
            Back
          </button>
        )}
        <button
          disabled={!canAdvance}
          onClick={next}
          style={{
            ...primaryButtonStyle(t, { disabled: !canAdvance }),
            flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {step < STEPS.length - 1 ? "Next" : "Get started"} <ArrowRight size={16} />
        </button>
      </div>

      <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 14, textAlign: "center", lineHeight: 1.5 }}>
        This sets up your personal targets for this session — there's no password or account server yet,
        so this info isn't stored anywhere beyond your current visit.
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

export { computeTargets, LoginScreen };
