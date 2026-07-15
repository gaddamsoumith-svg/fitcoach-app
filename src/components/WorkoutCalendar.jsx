import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isoDate, shortDateLabel } from "../utils/dates";
import { calculateCalendarStats } from "../utils/calendarStats";
import { Card } from "./ui.jsx";

/* ============================================================
   WORKOUT CALENDAR — color-coded month view + streak/skip summary
   ============================================================ */
function WorkoutCalendar({ t, workoutLogHistory }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayIso = isoDate(0);

  const { startDate, totalTrained, daysSkipped, loggedDates } = calculateCalendarStats(workoutLogHistory, today);

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const cellStatus = (d) => {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (iso === todayIso) return "today";
    if (loggedDates.has(iso)) return "worked";
    if (iso < todayIso && (!startDate || iso >= startDate)) return "missed";
    return "neutral";
  };

  return (
    <Card t={t}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Workout Calendar</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => setMonthOffset(m => m - 1)} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: 7, padding: 3, color: t.inkDim }}>
            <ChevronLeft size={13} />
          </button>
          <span style={{ fontSize: 11, fontWeight: 600, color: t.inkDim, minWidth: 72, textAlign: "center" }}>
            {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <button onClick={() => setMonthOffset(m => m + 1)} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: 7, padding: 3, color: t.inkDim }}>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 12 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 9, color: t.inkFaint, fontWeight: 600 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const status = cellStatus(d);
          const colors = {
            worked: { bg: t.teal, fg: "#06201C" },
            missed: { bg: t.coral, fg: "#2A0E08" },
            today: { bg: "transparent", fg: t.turmeric },
            neutral: { bg: "transparent", fg: t.inkFaint },
          }[status];
          return (
            <div key={i} style={{
              aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, fontSize: 10.5, fontWeight: 700, background: colors.bg, color: colors.fg,
              border: status === "today" ? `1.5px solid ${t.turmeric}` : "none",
            }}>
              {d}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 10, color: t.inkDim }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: t.teal, display: "inline-block" }} /> Trained
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: t.coral, display: "inline-block" }} /> Missed
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, border: `1.5px solid ${t.turmeric}`, display: "inline-block" }} /> Today
        </span>
      </div>

      {startDate ? (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.border}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{shortDateLabel(startDate)}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>Started</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.teal }}>{totalTrained}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>Days trained</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.coral }}>{daysSkipped}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>Days skipped</div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, fontSize: 11, color: t.inkFaint }}>Log your first workout to start tracking your streak.</div>
      )}
    </Card>
  );
}


export { WorkoutCalendar };
