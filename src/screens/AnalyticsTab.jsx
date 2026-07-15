import React, { useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { dayKey, isoDate, shortDateLabel, genHistory } from "../utils/dates";
import { Card } from "../components/ui.jsx";
import { PageHeader } from "../components/ui.jsx";
import { WorkoutCalendar } from "../components/WorkoutCalendar.jsx";

/* ============================================================
   ANALYTICS TAB
   ============================================================ */
function AnalyticsTab({ t, weightHistory, workoutLogHistory, meals, targets }) {
  const consumedCal = meals.reduce((a, m) => a + m.cal, 0);
  const calHistory = useMemo(() => {
    const base = genHistory(targets.calories - 150, 300, 6);
    return [...base, { day: dayKey(0), value: consumedCal }];
  }, [consumedCal]);

  const loggedDates = useMemo(() => new Set(workoutLogHistory.map(w => w.date)), [workoutLogHistory]);
  const consistencyData = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const offset = -(13 - i);
    const iso = isoDate(offset);
    return { label: shortDateLabel(iso), worked: loggedDates.has(iso) ? 1 : 0 };
  }), [loggedDates]);

  return (
    <div style={{ padding: "20px 18px" }}>
      <PageHeader t={t} title="Progress" subtitle="Trends over the last 2 weeks" />

      <div style={{ marginTop: 16 }}>
        <WorkoutCalendar t={t} workoutLogHistory={workoutLogHistory} />
      </div>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Training consistency (last 14 days)</div>
        <div style={{ height: 110, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consistencyData}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 8, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} interval={1} />
              <YAxis hide domain={[0, 1]} />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [v ? "Trained" : "Missed", ""]} />
              <Bar dataKey="worked" radius={[4, 4, 4, 4]}>
                {consistencyData.map((d, i) => <Cell key={i} fill={d.worked ? t.teal : t.coral} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TrendingUp size={14} color={t.turmeric} />
          <div style={{ fontSize: 12, fontWeight: 700 }}>Body weight (kg)</div>
        </div>
        <div style={{ height: 130, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightHistory}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="value" stroke={t.turmeric} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Daily calories vs target</div>
        <div style={{ height: 130, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calHistory}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="value" fill={t.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Workout volume by session</div>
        <div style={{ height: 130, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutLogHistory.map(w => ({ ...w, label: shortDateLabel(w.date) }))}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 8, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="volume" fill={t.violet} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   SETTINGS TAB
   ============================================================ */

export { AnalyticsTab };
