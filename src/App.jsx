import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { LayoutDashboard, Dumbbell, UtensilsCrossed, BarChart3, Settings2 } from "lucide-react";
import { TOKENS, LIGHT_TOKENS } from "./data/tokens";
import { QUOTES } from "./data/quotes";
import { isoDate, genHistory } from "./utils/dates";
import { usePersistentState, STORAGE_KEYS } from "./utils/storage";
import { calculateConsumed, calculateRemaining } from "./utils/nutrition";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { computeTargets, LoginScreen } from "./screens/LoginScreen.jsx";
import { Dashboard } from "./screens/Dashboard.jsx";

/* Lazy-loaded: these screens (and their recharts dependency) only need to download once the
   person actually navigates to them, instead of blocking the initial Dashboard paint. */
const WorkoutTab = lazy(() => import("./screens/WorkoutTab.jsx").then(m => ({ default: m.WorkoutTab })));
const NutritionTab = lazy(() => import("./screens/NutritionTab.jsx").then(m => ({ default: m.NutritionTab })));
const AnalyticsTab = lazy(() => import("./screens/AnalyticsTab.jsx").then(m => ({ default: m.AnalyticsTab })));
const SettingsTab = lazy(() => import("./screens/SettingsTab.jsx").then(m => ({ default: m.SettingsTab })));

function TabLoadingFallback() {
  return (
    <div style={{ padding: 24, textAlign: "center", color: "#9AA0AE", fontSize: 13 }}>Loading…</div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
function FitCoachApp() {
  const [isDark, setIsDark] = useState(true);
  const t = isDark ? TOKENS : LIGHT_TOKENS;
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.PROFILE, null);

  const [targets, setTargets] = usePersistentState(STORAGE_KEYS.TARGETS, { calories: 2550, protein: 115, carbs: 350, fat: 70, water: 8 });
  const [waterBottles, setWaterBottles] = useState(3);
  const [steps, setSteps] = usePersistentState(STORAGE_KEYS.stepsForDay(isoDate(0)), "");
  const [sleepHours, setSleepHours] = usePersistentState(STORAGE_KEYS.sleepForDay(isoDate(0)), "");
  const [mealReminders, setMealReminders] = usePersistentState(STORAGE_KEYS.MEAL_REMINDERS, {
    Breakfast: { enabled: false, time: "08:00", lastFired: null },
    Lunch: { enabled: false, time: "13:00", lastFired: null },
    Snacks: { enabled: false, time: "17:00", lastFired: null },
    Fruits: { enabled: false, time: "11:00", lastFired: null },
  });

  useEffect(() => {
    const checkReminders = () => {
      if (typeof document !== "undefined" && document.hidden) return; // skip work while backgrounded
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const nowHM = `${hh}:${mm}`;
      const today = isoDate(0);
      setMealReminders(prev => {
        let changed = false;
        const next = { ...prev };
        Object.entries(prev).forEach(([name, r]) => {
          if (r.enabled && r.time === nowHM && r.lastFired !== today) {
            changed = true;
            next[name] = { ...r, lastFired: today };
            const body = `Time for ${name.toLowerCase()} — log it in FitCoach when you eat.`;
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              try { new Notification(`${name} reminder`, { body, icon: "/icon-192.png" }); } catch (e) { /* ignore */ }
            }
          }
        });
        return changed ? next : prev;
      });
    };
    const id = setInterval(checkReminders, 20000);
    checkReminders();
    return () => clearInterval(id);
  }, []);

  const [meals, setMeals] = usePersistentState(STORAGE_KEYS.mealsForDay(isoDate(0)), []);
  const [workoutLogHistory, setWorkoutLogHistory] = usePersistentState(STORAGE_KEYS.WORKOUT_LOG, () =>
    ["Push", "Pull", "Legs", "Push", "Pull"].map((cat, i) => ({
      date: isoDate(-(5 - i)), category: cat, volume: 3200 + Math.round(Math.random() * 900), duration: 62 + Math.round(Math.random() * 10),
    }))
  );
  const [streak, setStreak] = usePersistentState(STORAGE_KEYS.STREAK, 6);
  const [weightHistory] = useState(genHistory(56, 0.6));
  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);

  const consumed = calculateConsumed(meals);
  const remaining = calculateRemaining(consumed.cal, targets.calories);

  const todaysWorkoutDone = workoutLogHistory.some(w => w.date === isoDate(0));
  const [workoutProgressPct, setWorkoutProgressPct] = useState(() => (todaysWorkoutDone ? 100 : 0));
  const [exerciseHistory, setExerciseHistory] = usePersistentState(STORAGE_KEYS.EXERCISE_HISTORY, {});

  const NAV = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "workout", label: "Workout", icon: Dumbbell },
    { id: "nutrition", label: "Nutrition", icon: UtensilsCrossed },
    { id: "analytics", label: "Progress", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings2 },
  ];

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body { height: 100%; }
    .mono { font-family: 'IBM Plex Mono', monospace; }
    .display { font-family: 'Sora', sans-serif; }
    ::-webkit-scrollbar { width: 0px; height: 0px; }
    .scrollx { overflow-x: auto; scrollbar-width: none; }
    button { font-family: inherit; cursor: pointer; }
    button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible {
      outline: 2px solid #E8A33D; outline-offset: 2px;
    }
    input, select {
      font-family: inherit;
      font-size: 16px; /* prevents iOS Safari auto-zoom on focus */
    }

    @keyframes armPress { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-13px) rotate(-8deg); } }
    @keyframes armPull { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(9px) rotate(8deg); } }
    @keyframes armCurl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-48deg); } }
    @keyframes armRaise { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-68deg); } }
    @keyframes legSquat { 0%, 100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(0.84) translateY(7px); } }
    @keyframes torsoBrace { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.045); } }
    @keyframes gentlePulse { 0%, 100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.035); } }
    @keyframes calfBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes legMarch { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

    .demo-press .demo-arm-left, .demo-press .demo-arm-right { animation: armPress 2.2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-pull .demo-arm-left, .demo-pull .demo-arm-right { animation: armPull 2.2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-curl .demo-arm-left, .demo-curl .demo-arm-right { animation: armCurl 2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-raise .demo-arm-left, .demo-raise .demo-arm-right { animation: armRaise 2.2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-squat .demo-torso, .demo-squat .demo-leg-left, .demo-squat .demo-leg-right { animation: legSquat 2.4s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-extension .demo-leg-left, .demo-extension .demo-leg-right { animation: armRaise 2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-core .demo-torso { animation: torsoBrace 2.6s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-figure.demo-stretch { animation: gentlePulse 3s ease-in-out infinite; }
    .demo-figure.demo-calf { animation: calfBob 1.6s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-cardio .demo-leg-left { animation: legMarch 1s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-cardio .demo-leg-right { animation: legMarch 1s cubic-bezier(0.45,0,0.55,1) infinite reverse; }
  `;

  if (!profile) {
    return (
      <>
        <style>{globalStyles}</style>
        <LoginScreen t={t} onComplete={(p) => {
          setProfile(p);
          setTargets(computeTargets(p));
        }} />
      </>
    );
  }

  return (
    <div style={{
      fontFamily: "Inter, -apple-system, sans-serif", background: t.bg, color: t.ink,
      width: "100%", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <style>{globalStyles}</style>

      <main role="main" style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <Suspense fallback={<TabLoadingFallback />}>
          {tab === "dashboard" && (
            <Dashboard t={t} isDark={isDark} setIsDark={setIsDark} waterBottles={waterBottles} setWaterBottles={setWaterBottles}
              targets={targets} consumed={consumed} remaining={remaining} streak={streak} quote={quote}
              todaysWorkoutDone={todaysWorkoutDone} workoutProgressPct={workoutProgressPct} setTab={setTab} profile={profile}
              steps={steps} setSteps={setSteps} sleepHours={sleepHours} setSleepHours={setSleepHours} />
          )}
          {tab === "workout" && (
            <WorkoutTab t={t} onLogWorkout={(entry) => { setWorkoutLogHistory(h => [...h, entry]); setStreak(s => s + 1); }}
              onProgress={setWorkoutProgressPct} exerciseHistory={exerciseHistory} setExerciseHistory={setExerciseHistory} />
          )}
          {tab === "nutrition" && (
            <NutritionTab t={t} meals={meals} setMeals={setMeals} targets={targets} consumed={consumed} remaining={remaining}
              mealReminders={mealReminders} setMealReminders={setMealReminders} />
          )}
          {tab === "analytics" && (
            <AnalyticsTab t={t} weightHistory={weightHistory} workoutLogHistory={workoutLogHistory} meals={meals} targets={targets} />
          )}
          {tab === "settings" && (
            <SettingsTab t={t} isDark={isDark} setIsDark={setIsDark} targets={targets} setTargets={setTargets}
              profile={profile} onEditProfile={() => setProfile(null)} />
          )}
        </Suspense>
      </main>

      {/* Bottom Nav */}
      <nav aria-label="Main navigation" style={{
        background: t.bgElevated, borderTop: `1px solid ${t.border}`, display: "flex",
        padding: "10px 6px calc(10px + env(safe-area-inset-bottom, 0px))", flexShrink: 0,
      }}>
        {NAV.map(n => {
          const Icon = n.icon;
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)} aria-label={n.label} aria-current={active ? "page" : undefined} style={{
              flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, padding: "6px 2px", borderRadius: 12,
              color: active ? t.turmeric : t.inkFaint,
            }}>
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FitCoachApp />
    </ErrorBoundary>
  );
}
