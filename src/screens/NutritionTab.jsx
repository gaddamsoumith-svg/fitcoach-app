import React, { useState } from "react";
import { ChefHat, ChevronRight, ClipboardList, Clock, Plus } from "lucide-react";
import { RECIPES } from "../data/recipes";
import { Card, Pill, ProgressBar, SwipeableRow, PageHeader } from "../components/ui.jsx";

/* ============================================================
   NUTRITION TAB
   ============================================================ */
function NutritionTab({ t, meals, setMeals, targets, consumed, remaining, mealReminders, setMealReminders }) {
  const [sub, setSub] = useState("track");
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Breakfast", cal: "", protein: "", carbs: "", fat: "" });

  const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Fruits"];
  const MEAL_TYPE_COLOR = { Breakfast: t.turmeric, Lunch: t.teal, Dinner: t.violet, Snacks: t.coral, Fruits: t.teal };

  const tags = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Pre-workout", "High Protein", "Vegetarian", "Non-Vegetarian"];
  const filtered = filter === "All" ? RECIPES : RECIPES.filter(r => r.cat === filter || r.tags.includes(filter));

  const requestNotifyPermission = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const clampNumber = (val, max) => {
    const n = Number(val);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, max);
  };

  const addMeal = () => {
    const name = form.name.trim();
    if (!name || name.length > 80) return;
    const cal = clampNumber(form.cal, 5000);
    if (cal <= 0) return; // require a real calorie value, not blank/zero/negative
    setMeals(m => [...m, {
      name, type: form.type, cal,
      protein: clampNumber(form.protein, 500),
      carbs: clampNumber(form.carbs, 800),
      fat: clampNumber(form.fat, 300),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    }]);
    setForm({ name: "", type: "Breakfast", cal: "", protein: "", carbs: "", fat: "" });
    setShowAdd(false);
  };

  const quickAdd = (recipe) => {
    const typeMap = { Breakfast: "Breakfast", Lunch: "Lunch", Dinner: "Dinner", Snacks: "Snacks", Drinks: "Snacks", "Pre-workout": "Snacks" };
    setMeals(m => [...m, {
      name: recipe.name, type: typeMap[recipe.cat] || "Snacks", cal: recipe.cal, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    }]);
  };

  return (
    <div style={{ padding: "20px 18px" }}>
      <PageHeader t={t} title="Nutrition" />
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {[{ id: "track", label: "Track Food", icon: ClipboardList }, { id: "prepare", label: "Prepare Food", icon: ChefHat }].map(s => {
          const Icon = s.icon;
          const active = sub === s.id;
          return (
            <button key={s.id} onClick={() => setSub(s.id)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 0", borderRadius: 12, border: `1px solid ${active ? t.turmeric : t.border}`,
              background: active ? t.turmericDim : "transparent", color: active ? t.turmeric : t.inkDim, fontSize: 12, fontWeight: 700,
            }}>
              <Icon size={14} /> {s.label}
            </button>
          );
        })}
      </div>

      {sub === "track" && (
        <div style={{ marginTop: 16 }}>
          <Card t={t}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: t.inkFaint }}>Consumed / Target</div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{consumed.cal} / {targets.calories}</div>
              </div>
              <Pill color={t.turmeric} bg={t.turmericDim}>{remaining} kcal left</Pill>
            </div>
            <div style={{ marginTop: 10 }}><ProgressBar pct={(consumed.cal / targets.calories) * 100} color={t.turmeric} track={t.turmericDim} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
              {[
                { label: "Protein", val: consumed.protein, target: targets.protein, color: t.teal },
                { label: "Carbs", val: consumed.carbs, target: targets.carbs, color: t.violet },
                { label: "Fat", val: consumed.fat, target: targets.fat, color: t.coral },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 10, color: t.inkFaint }}>{m.label}</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{m.val}g <span style={{ color: t.inkFaint, fontWeight: 500 }}>/{m.target}g</span></div>
                  <div style={{ marginTop: 4 }}><ProgressBar pct={(m.val / m.target) * 100} color={m.color} track={t.border} /></div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Today's meals</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setShowReminders(v => !v)} style={{
                display: "flex", alignItems: "center", gap: 4, background: showReminders ? t.tealDim : "none",
                border: `1px solid ${showReminders ? t.teal : t.border}`, borderRadius: 10, padding: "6px 9px", fontSize: 11, fontWeight: 700, color: showReminders ? t.teal : t.inkDim,
              }}><Clock size={13} /></button>
              <button onClick={() => setShowAdd(v => !v)} style={{
                display: "flex", alignItems: "center", gap: 4, background: t.turmeric, border: "none",
                borderRadius: 10, padding: "6px 10px", fontSize: 11, fontWeight: 700, color: "#241705",
              }}><Plus size={13} /> Add meal</button>
            </div>
          </div>

          {showReminders && (
            <Card t={t} style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>Meal reminders</div>
              <div style={{ fontSize: 10.5, color: t.inkFaint, marginBottom: 10, lineHeight: 1.5 }}>
                Fires a notification at the set time each day. Works while FitCoach is open or running in the background — iOS may not deliver it if the app has been fully closed for a long time.
              </div>
              {MEAL_TYPES.map(name => {
                const r = mealReminders[name];
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => {
                        requestNotifyPermission();
                        setMealReminders(m => ({ ...m, [name]: { ...m[name], enabled: !m[name].enabled } }));
                      }} style={{
                        width: 34, height: 20, borderRadius: 999, border: "none", position: "relative",
                        background: r.enabled ? t.teal : t.border, flexShrink: 0,
                      }}>
                        <span style={{
                          position: "absolute", top: 2, left: r.enabled ? 16 : 2, width: 16, height: 16, borderRadius: 999,
                          background: "#fff", transition: "left 0.15s ease",
                        }} />
                      </button>
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</span>
                    </div>
                    <input type="time" value={r.time} onChange={e => setMealReminders(m => ({ ...m, [name]: { ...m[name], time: e.target.value, lastFired: null } }))}
                      style={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "5px 8px", color: t.ink, fontSize: 13 }} />
                  </div>
                );
              })}
            </Card>
          )}

          {showAdd && (
            <Card t={t} style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.inkDim, marginBottom: 4 }}>Meal name</div>
              <input placeholder="e.g. Grilled chicken bowl" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: "100%", background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "10px 10px", color: t.ink, fontSize: 16, marginBottom: 12 }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: t.inkDim, marginBottom: 4 }}>Meal type</div>
              <div className="scrollx" style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {MEAL_TYPES.map(mt => (
                  <button key={mt} onClick={() => setForm(f => ({ ...f, type: mt }))} style={{
                    whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                    border: `1px solid ${form.type === mt ? MEAL_TYPE_COLOR[mt] : t.border}`,
                    background: form.type === mt ? `${MEAL_TYPE_COLOR[mt]}22` : "transparent", color: form.type === mt ? MEAL_TYPE_COLOR[mt] : t.inkDim,
                  }}>{mt}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { key: "cal", label: "Calories (kcal)" },
                  { key: "protein", label: "Protein (g)" },
                  { key: "carbs", label: "Carbs (g)" },
                  { key: "fat", label: "Fat (g)" },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.inkDim, marginBottom: 4 }}>{f.label}</div>
                    <input
                      inputMode="numeric" placeholder="0" value={form[f.key]}
                      onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))}
                      style={{
                        width: "100%", background: t.bgElevated, border: `1px solid ${t.border}`,
                        borderRadius: 8, padding: "10px 10px", color: t.ink, fontSize: 16, textAlign: "left",
                      }}
                    />
                  </div>
                ))}
              </div>
              <button onClick={addMeal} style={{ width: "100%", marginTop: 14, background: t.teal, border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, color: "#06201C" }}>Save meal</button>
            </Card>
          )}

          <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 10 }}>
            {meals.length === 0 ? "No meals logged yet today — tap \"Add meal\" or log one from Prepare Food." : "Swipe a meal left to delete it."}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {meals.map((m, i) => (
              <SwipeableRow key={`${m.name}-${m.time}-${i}`} t={t} onDelete={() => setMeals(ms => ms.filter((_, idx) => idx !== i))}>
                <Card t={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: t.bgCard }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      {m.type && <Pill color={MEAL_TYPE_COLOR[m.type] || t.inkDim} bg={t.bgElevated}>{m.type}</Pill>}
                    </div>
                    <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{m.time} · P{m.protein} C{m.carbs} F{m.fat}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.turmeric, flexShrink: 0, marginLeft: 10 }}>{m.cal} kcal</div>
                </Card>
              </SwipeableRow>
            ))}
          </div>
        </div>
      )}

      {sub === "prepare" && (
        <div style={{ marginTop: 16 }}>
          <div className="scrollx" style={{ display: "flex", gap: 6, paddingBottom: 4 }}>
            {tags.map(tag => (
              <button key={tag} onClick={() => setFilter(tag)} style={{
                whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                border: `1px solid ${filter === tag ? t.turmeric : t.border}`,
                background: filter === tag ? t.turmericDim : "transparent", color: filter === tag ? t.turmeric : t.inkDim,
              }}>{tag}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {filtered.map(r => (
              <Card key={r.id} t={t}>
                <div onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: t.inkFaint, marginTop: 3 }}>
                      {r.cal} kcal · P{r.protein} C{r.carbs ?? 0} F{r.fat ?? 0}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600,
                      color: t.turmeric, background: t.turmericDim, borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap",
                    }}>
                      <Clock size={11} /> {r.prep + r.cook} min
                    </span>
                    <ChevronRight size={16} color={t.inkFaint} style={{ transform: expanded === r.id ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </div>
                </div>
                {r.note && (
                  <div style={{ fontSize: 10.5, color: t.inkFaint, fontStyle: "italic", marginTop: 4 }}>{r.note}</div>
                )}
                {expanded === r.id && (
                  <div style={{ marginTop: 12, borderTop: `1px solid ${t.border}`, paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {r.tags.map(tg => <Pill key={tg} color={t.teal} bg={t.tealDim}>{tg}</Pill>)}
                    </div>
                    <div style={{ fontSize: 11, color: t.inkFaint, marginBottom: 4 }}>Prep {r.prep}m · Cook {r.cook}m · Serves {r.servings}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>Ingredients</div>
                    <ul style={{ margin: "4px 0", paddingLeft: 18, fontSize: 12, color: t.inkDim, lineHeight: 1.6 }}>
                      {r.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>Steps</div>
                    <ol style={{ margin: "4px 0", paddingLeft: 18, fontSize: 12, color: t.inkDim, lineHeight: 1.6 }}>
                      {r.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                    <button onClick={() => quickAdd(r)} style={{
                      marginTop: 10, width: "100%", background: t.turmeric, border: "none", borderRadius: 10,
                      padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#241705",
                    }}>Log this meal today</button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ANALYTICS TAB
   ============================================================ */

export { NutritionTab };
