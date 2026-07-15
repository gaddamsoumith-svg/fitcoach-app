import { useState, useEffect } from "react";

/* Centralized localStorage keys — avoids typo-prone string literals scattered across the app
   and makes future migrations (e.g. versioning/renaming) a one-place change. */
const STORAGE_KEYS = {
  PROFILE: "fc_profile",
  TARGETS: "fc_targets",
  STREAK: "fc_streak",
  EXERCISE_HISTORY: "fc_exercise_history",
  WORKOUT_LOG: "fc_workout_log",
  MEAL_REMINDERS: "fc_meal_reminders",
  mealsForDay: (isoDay) => `fc_meals_${isoDay}`,
  stepsForDay: (isoDay) => `fc_steps_${isoDay}`,
  sleepForDay: (isoDay) => `fc_sleep_${isoDay}`,
};

/* Persists state to the browser's localStorage (this is a real deployed web app, not a Claude.ai
   artifact preview, so localStorage works normally here — unlike in-chat artifacts).
   Accepts a lazy initializer function for defaultValue, same convention as useState. */
function usePersistentState(key, defaultValue) {
  const resolveDefault = () => (typeof defaultValue === "function" ? defaultValue() : defaultValue);
  const [state, setState] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return saved !== null ? JSON.parse(saved) : resolveDefault();
    } catch (e) {
      return resolveDefault();
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (e) { /* storage unavailable — fail silently, app still works in-session */ }
  }, [key, state]);
  return [state, setState];
}

export { usePersistentState, STORAGE_KEYS };
