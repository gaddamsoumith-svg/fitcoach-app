import React from "react";
import { Flame, Sun, MoonStar, Droplet, Footprints, Moon, ChevronRight } from "lucide-react";
import { Card, Ring } from "../components/ui.jsx";
import { EditableStatCard } from "../components/EditableStatCard.jsx";

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ t, isDark, setIsDark, waterBottles, setWaterBottles, targets, consumed, remaining, streak, quote, todaysWorkoutDone, workoutProgressPct, setTab, profile, steps, setSteps, sleepHours, setSleepHours }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.name?.split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const calPct = Math.min(consumed.cal / targets.calories, 1);
  const proteinPct = Math.min(consumed.protein / targets.protein, 1);
  const waterPct = Math.min(waterBottles / targets.water, 1);
  const workoutPct = Math.min(workoutProgressPct / 100, 1);

  return (
    <div style={{ padding: "22px 18px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="display" style={{ fontSize: 22, fontWeight: 800 }}>{greeting}{firstName ? `, ${firstName}` : ""}</div>
          <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>{today}</div>
        </div>
        <button onClick={() => setIsDark(d => !d)} style={{
          background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: 9,
        }}>
          {isDark ? <Sun size={16} color={t.turmeric} /> : <MoonStar size={16} color={t.violet} />}
        </button>
      </div>

      {/* Streak */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
        <Flame size={15} color={t.turmeric} fill={t.turmeric} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>{streak}-day streak</span>
        <span style={{ fontSize: 12, color: t.inkFaint }}>· keep it going</span>
      </div>

      {/* Ring cluster — 2x2 grid */}
      <Card t={t} style={{ marginTop: 16, padding: "20px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 20, columnGap: 6 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={calPct} color={t.turmeric} track={t.turmericDim} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{remaining}</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>kcal left</div>
              </div>
            </Ring>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={proteinPct} color={t.teal} track={t.tealDim} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{consumed.protein}g</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>protein</div>
              </div>
            </Ring>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={waterPct} color={t.violet} track={isDark ? "#2A2540" : "#E7E3F7"} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{waterBottles}/{targets.water}</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>bottles</div>
              </div>
            </Ring>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={workoutPct} color={t.coral} track={t.coralDim} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{Math.round(workoutProgressPct)}%</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>workout</div>
              </div>
            </Ring>
          </div>
        </div>
      </Card>

      {/* Quick stat row — manual entry (no Apple Health sync from a web app; see Settings) */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <EditableStatCard t={t} icon={Footprints} color={t.teal} label="steps today" value={steps} onSave={setSteps} suffix="" placeholder="0" />
        <EditableStatCard t={t} icon={Moon} color={t.violet} label="sleep last night" value={sleepHours} onSave={setSleepHours} suffix="h" placeholder="0" />
      </div>

      {/* Water quick add */}
      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Droplet size={16} color={t.violet} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Water intake (bottles)</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setWaterBottles(c => Math.max(c - 1, 0))} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.ink }}>–</button>
            <button onClick={() => setWaterBottles(c => c + 1)} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.ink }}>+</button>
          </div>
        </div>
      </Card>

      {/* Today's workout */}
      <Card t={t} onClick={() => setTab("workout")} style={{ marginTop: 12, cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Dumbbell size={16} color={t.turmeric} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Today's session</span>
          </div>
          <ChevronRight size={16} color={t.inkFaint} />
        </div>
        {todaysWorkoutDone ? (
          <Pill color={t.teal} bg={t.tealDim}>Completed</Pill>
        ) : (
          <div style={{ fontSize: 12, color: t.inkDim, marginTop: 6 }}>Not logged yet — tap to start.</div>
        )}
      </Card>

      {/* AI coach note */}
      <Card t={t} style={{ marginTop: 12, background: isDark ? t.turmericDim : t.turmericDim }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.turmeric, letterSpacing: 0.4 }}>COACH NOTE</div>
        <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
          {targets.protein - consumed.protein > 15
            ? `You're ${targets.protein - consumed.protein}g short on protein — a Sprouts & Moong Salad or a Protein Smoothie would close most of that gap.`
            : "Protein is on track for today. Nice work — stay consistent with the evening stretch routine."}
        </div>
      </Card>

      <div style={{ textAlign: "center", fontSize: 12, color: t.inkFaint, fontStyle: "italic", margin: "18px 0 8px" }}>
        "{quote}"
      </div>
    </div>
  );
}

/* ============================================================
   WORKOUT TAB
   ============================================================ */

export { Dashboard };
