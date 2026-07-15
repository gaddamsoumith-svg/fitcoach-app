import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChevronRight, ChevronLeft, Check, Timer, Clock, TrendingUp,
  CalendarDays, LayoutGrid, Volume2, VolumeX, Info, ChevronDown,
} from "lucide-react";
import { EXERCISE_DB, CATEGORY_ICON, WEEKLY_SCHEDULE, TODAY_NAME, getExerciseDetail } from "../data/exercises";
import { dayKey, isoDate } from "../utils/dates";
import { primaryButtonStyle } from "../utils/styleHelpers";
import { Card, Pill, BackButton, PageHeader } from "../components/ui.jsx";
import { ExerciseDetailBlock } from "../components/ExerciseDetailBlock.jsx";

/* ============================================================
   WORKOUT TAB
   ============================================================ */
function WorkoutTab({ t, onLogWorkout, onProgress, exerciseHistory, setExerciseHistory }) {
  const [browseMode, setBrowseMode] = useState(null); // null | "schedule" | "category"
  const [pendingCategory, setPendingCategory] = useState(null); // category chosen, showing Session Overview
  const [expandedPreview, setExpandedPreview] = useState(null); // index expanded in Session Overview
  const [category, setCategory] = useState(null);
  const [session, setSession] = useState(null); // {exercises: [{name, sets:[{weight,reps,done}]}], elapsed}
  const [expandedExercise, setExpandedExercise] = useState(null); // index expanded during active session
  const [elapsed, setElapsed] = useState(0);
  const [resting, setResting] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showLiveChart, setShowLiveChart] = useState(false);
  const intervalRef = useRef(null);
  const restRef = useRef(null);
  const prevRestingRef = useRef(0);

  const COACH_CUES = ["Keep your back straight.", "Engage your core.", "Slow down the lowering phase.", "Full range of motion.", "Control the weight, don't rush."];

  const speak = (text) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1; u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (e) { /* speech synthesis unavailable — fail silently */ }
  };

  useEffect(() => {
    if (session) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [session]);

  useEffect(() => {
    if (resting > 0) {
      restRef.current = setInterval(() => setResting(r => (r <= 1 ? 0 : r - 1)), 1000);
      return () => clearInterval(restRef.current);
    }
  }, [resting]);

  useEffect(() => {
    if (resting === 0 && prevRestingRef.current > 0) {
      speak("Rest complete. Start your next set.");
    }
    prevRestingRef.current = resting;
  }, [resting]);

  useEffect(() => {
    if (session && onProgress) {
      const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
      const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
      onProgress(totalSets ? Math.round((doneSets / totalSets) * 100) : 0);
    }
  }, [session]);

  const recordSetHistory = (name, weight, reps) => {
    const w = Number(weight) || 0, r = Number(reps) || 0;
    if (!w && !r) return;
    setExerciseHistory(h => {
      const prev = h[name] || {};
      const isNewPR = !prev.prWeight || w > prev.prWeight || (w === prev.prWeight && r > (prev.prReps || 0));
      return {
        ...h,
        [name]: {
          lastWeight: w, lastReps: r,
          prWeight: isNewPR ? w : prev.prWeight,
          prReps: isNewPR ? r : prev.prReps,
        },
      };
    });
  };

  const startSession = (cat) => {
    const exercises = EXERCISE_DB[cat].map(ex => ({
      name: ex.name, equip: ex.equip, target: ex.reps,
      sets: Array.from({ length: ex.sets }, () => ({ weight: "", reps: "", done: false })),
    }));
    setCategory(cat);
    setSession({ exercises });
    setElapsed(0);
    setExpandedExercise(null);
  };

  const toggleSet = (exIdx, setIdx) => {
    setSession(s => {
      const next = structuredClone(s);
      const set = next.exercises[exIdx].sets[setIdx];
      set.done = !set.done;
      if (set.done) {
        setResting(60);
        recordSetHistory(next.exercises[exIdx].name, set.weight, set.reps);
        const detail = getExerciseDetail(next.exercises[exIdx].name, category);
        const pool = [...COACH_CUES, ...(detail.tips || [])];
        speak(pool[Math.floor(Math.random() * pool.length)]);
      }
      return next;
    });
  };

  const updateSet = (exIdx, setIdx, field, rawValue) => {
    // Allow only digits and a single decimal point; strip anything else (pasted text, symbols).
    let value = rawValue.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
    const max = field === "weight" ? 500 : 100; // sanity ceiling: 500kg, 100 reps
    if (value !== "" && Number(value) > max) value = String(max);
    setSession(s => {
      const next = structuredClone(s);
      next.exercises[exIdx].sets[setIdx][field] = value;
      return next;
    });
  };

  const finishSession = () => {
    const volume = session.exercises.reduce((tot, ex) =>
      tot + ex.sets.reduce((s, st) => s + (Number(st.weight) || 0) * (Number(st.reps) || 0), 0), 0);
    onLogWorkout({ date: isoDate(0), category, volume: volume || 0, duration: Math.round(elapsed / 60) });
    if (onProgress) onProgress(100);
    setSession(null);
    setCategory(null);
    setElapsed(0);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ---------- Active session: guided logging with real-time coaching ---------- */
  if (session) {
    const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
    const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
    const liveChartData = (() => {
      let cum = 0;
      const data = [{ set: "Start", volume: 0 }];
      session.exercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.done) {
            cum += (Number(s.weight) || 0) * (Number(s.reps) || 0);
            data.push({ set: `${data.length}`, volume: cum });
          }
        });
      });
      return data;
    })();
    return (
      <div style={{ padding: "20px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BackButton t={t} label="Exit" onClick={() => { setSession(null); setCategory(null); }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setShowLiveChart(v => !v)} title="Live progress" style={{
              background: showLiveChart ? t.tealDim : "none", border: `1px solid ${showLiveChart ? t.teal : t.border}`,
              borderRadius: 8, padding: 5, display: "flex", alignItems: "center",
            }}>
              <TrendingUp size={14} color={showLiveChart ? t.teal : t.inkFaint} />
            </button>
            <button onClick={() => setVoiceEnabled(v => !v)} title="Voice coaching cues" style={{
              background: voiceEnabled ? t.turmericDim : "none", border: `1px solid ${voiceEnabled ? t.turmeric : t.border}`,
              borderRadius: 8, padding: 5, display: "flex", alignItems: "center",
            }}>
              {voiceEnabled ? <Volume2 size={14} color={t.turmeric} /> : <VolumeX size={14} color={t.inkFaint} />}
            </button>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <Timer size={15} color={t.turmeric} /> {fmt(elapsed)}
            </div>
          </div>
        </div>
        <div className="display" style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>{category} Session</div>
        <div style={{ fontSize: 12, color: t.inkFaint, marginTop: 2 }}>{doneSets}/{totalSets} sets complete{voiceEnabled ? " · voice coaching on" : ""}</div>

        {showLiveChart && (
          <Card t={t} style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: t.inkDim }}>Live volume this session (updates as you log sets)</div>
            <div style={{ height: 110, marginTop: 6 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveChartData}>
                  <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="set" tick={{ fontSize: 9, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="volume" stroke={t.teal} strokeWidth={2.5} dot={{ r: 3, fill: t.teal }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {resting > 0 && (
          <div style={{ marginTop: 12, background: t.coralDim, border: `1px solid ${t.coral}40`, borderRadius: 14, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.coral }}>Rest — {resting}s</div>
            <button onClick={() => setResting(0)} style={{ background: "none", border: `1px solid ${t.coral}`, color: t.coral, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>Skip</button>
          </div>
        )}

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {session.exercises.map((ex, exIdx) => {
            const detail = getExerciseDetail(ex.name, category);
            const isInfoOpen = expandedExercise === exIdx;
            return (
              <Card key={ex.name} t={t}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{ex.equip} · target {ex.target}</div>
                  </div>
                  <button onClick={() => setExpandedExercise(isInfoOpen ? null : exIdx)} style={{
                    flexShrink: 0, display: "flex", alignItems: "center", gap: 4, background: isInfoOpen ? t.turmericDim : "none",
                    border: `1px solid ${isInfoOpen ? t.turmeric : t.border}`, borderRadius: 8, padding: "4px 9px",
                    color: isInfoOpen ? t.turmeric : t.inkDim, fontSize: 10.5, fontWeight: 600,
                  }}>
                    <Info size={11} /> Info
                  </button>
                </div>

                {isInfoOpen && <ExerciseDetailBlock t={t} name={ex.name} category={category} history={exerciseHistory} />}

                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {ex.sets.map((set, setIdx) => (
                    <div key={setIdx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 16, fontSize: 11, color: t.inkFaint }}>{setIdx + 1}</span>
                      <input placeholder="kg" value={set.weight} onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)}
                        style={{ width: 58, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 6px", color: t.ink, fontSize: 16, textAlign: "center" }} />
                      <input placeholder="reps" value={set.reps} onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)}
                        style={{ width: 58, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 6px", color: t.ink, fontSize: 16, textAlign: "center" }} />
                      <button onClick={() => toggleSet(exIdx, setIdx)} style={{
                        marginLeft: "auto", width: 28, height: 28, borderRadius: 8,
                        border: `1px solid ${set.done ? t.teal : t.border}`, background: set.done ? t.teal : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={14} color={set.done ? "#08150F" : t.inkFaint} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <button onClick={finishSession} style={{ ...primaryButtonStyle(t), width: "100%", marginTop: 16 }}>
          Finish Workout
        </button>
      </div>
    );
  }

  /* ---------- Session Overview: exercise preview before starting ---------- */
  if (pendingCategory) {
    const list = EXERCISE_DB[pendingCategory];
    return (
      <div style={{ padding: "20px 18px" }}>
        <BackButton t={t} onClick={() => { setPendingCategory(null); setExpandedPreview(null); }} style={{ marginBottom: 10 }} />
        <PageHeader t={t} title={`${pendingCategory} Session`}
          subtitle="Review each exercise before you begin — tap any card for muscles worked, technique, and coaching notes." />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {list.map((ex, i) => {
            const detail = getExerciseDetail(ex.name, pendingCategory);
            const isOpen = expandedPreview === i;
            return (
              <Card key={ex.name} t={t}>
                <div onClick={() => setExpandedPreview(isOpen ? null : i)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{ex.equip} · {ex.sets} sets × {ex.reps}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <Pill color={t.turmeric} bg={t.turmericDim}>{detail.difficulty}</Pill>
                    <ChevronDown size={16} color={t.inkFaint} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                </div>
                {isOpen && <ExerciseDetailBlock t={t} name={ex.name} category={pendingCategory} history={exerciseHistory} />}
              </Card>
            );
          })}
        </div>

        <button onClick={() => { startSession(pendingCategory); setPendingCategory(null); setExpandedPreview(null); }} style={{ ...primaryButtonStyle(t), width: "100%", marginTop: 18 }}>
          Begin Workout
        </button>
      </div>
    );
  }

  if (browseMode === "schedule") {
    return (
      <div style={{ padding: "20px 18px" }}>
        <BackButton t={t} onClick={() => setBrowseMode(null)} style={{ marginBottom: 10 }} />
        <PageHeader t={t} title="Weekly Schedule"
          subtitle="Each day of the week has a recommended session — tap today's entry to preview it." />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {WEEKLY_SCHEDULE.map(({ day, session: sessionType, description }) => {
            const Icon = CATEGORY_ICON[sessionType];
            const isToday = day === TODAY_NAME;
            return (
              <Card key={day} t={t} onClick={() => setPendingCategory(sessionType)} style={{
                cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                border: `1px solid ${isToday ? t.turmeric : t.border}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: t.turmericDim,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={18} color={t.turmeric} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{day}</span>
                    {isToday && <Pill color={t.teal} bg={t.tealDim}>Today</Pill>}
                  </div>
                  <div style={{ fontSize: 12, color: t.inkDim, marginTop: 1 }}>{sessionType} — {description}</div>
                </div>
                <ChevronRight size={16} color={t.inkFaint} />
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (browseMode === "category") {
    return (
      <div style={{ padding: "20px 18px" }}>
        <BackButton t={t} onClick={() => setBrowseMode(null)} style={{ marginBottom: 10 }} />
        <PageHeader t={t} title="Training Categories"
          subtitle="Choose the muscle group or training style you'd like to work on right now." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          {Object.keys(EXERCISE_DB).map(cat => {
            const Icon = CATEGORY_ICON[cat];
            return (
              <Card key={cat} t={t} onClick={() => setPendingCategory(cat)} style={{ cursor: "pointer" }}>
                <Icon size={18} color={t.turmeric} />
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10 }}>{cat}</div>
                <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{EXERCISE_DB[cat].length} exercises</div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 18px" }}>
      <PageHeader t={t} title="Workout" subtitle="Choose how you'd like to find today's session." />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
        <Card t={t} onClick={() => setBrowseMode("schedule")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: t.turmericDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CalendarDays size={20} color={t.turmeric} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Follow the Weekly Schedule</div>
              <div style={{ fontSize: 12, color: t.inkDim, marginTop: 3, lineHeight: 1.5 }}>
                See the recommended session for each day of the week, from Monday through Sunday, and preview today's session before you begin.
              </div>
            </div>
            <ChevronRight size={16} color={t.inkFaint} style={{ marginTop: 4, flexShrink: 0 }} />
          </div>
        </Card>

        <Card t={t} onClick={() => setBrowseMode("category")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: t.tealDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <LayoutGrid size={20} color={t.teal} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Browse by Category</div>
              <div style={{ fontSize: 12, color: t.inkDim, marginTop: 3, lineHeight: 1.5 }}>
                Pick a specific muscle group or training style — such as chest and shoulders, back, legs, or mobility — and start a session on your own terms.
              </div>
            </div>
            <ChevronRight size={16} color={t.inkFaint} style={{ marginTop: 4, flexShrink: 0 }} />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   NUTRITION TAB
   ============================================================ */

export { WorkoutTab };
