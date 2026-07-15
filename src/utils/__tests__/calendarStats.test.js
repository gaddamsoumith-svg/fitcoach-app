import { describe, it, expect } from "vitest";
import { calculateCalendarStats } from "../calendarStats";

describe("calculateCalendarStats", () => {
  it("returns no start date when there is no workout history", () => {
    const stats = calculateCalendarStats([], new Date("2026-07-15"));
    expect(stats.startDate).toBeNull();
    expect(stats.totalTrained).toBe(0);
    expect(stats.daysSkipped).toBe(0);
  });

  it("counts trained days and skipped days correctly across a date range", () => {
    // Trained on the 10th and 12th, today is the 13th -> span is 10,11,12,13 (4 days), 2 trained, 2 skipped
    const history = [
      { date: "2026-07-10" },
      { date: "2026-07-12" },
    ];
    const stats = calculateCalendarStats(history, new Date("2026-07-13"));
    expect(stats.startDate).toBe("2026-07-10");
    expect(stats.totalTrained).toBe(2);
    expect(stats.daysSkipped).toBe(2);
    expect(stats.consistencyPct).toBe(50);
  });

  it("reports 100% consistency when every day since starting was trained", () => {
    const history = [{ date: "2026-07-13" }];
    const stats = calculateCalendarStats(history, new Date("2026-07-13"));
    expect(stats.totalTrained).toBe(1);
    expect(stats.daysSkipped).toBe(0);
    expect(stats.consistencyPct).toBe(100);
  });
});
