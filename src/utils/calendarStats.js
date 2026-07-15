/* Pure, testable calendar/streak math — used by both the Workout Calendar UI and (optionally)
   any future analytics. Extracted so the day-counting logic can be unit tested directly. */

function calculateCalendarStats(workoutLogHistory, todayDate = new Date()) {
  const loggedDates = new Set(workoutLogHistory.map(w => w.date));
  const sortedDates = [...loggedDates].sort();
  const startDate = sortedDates[0] || null;

  let daysSkipped = 0;
  if (startDate) {
    const start = new Date(startDate + "T00:00:00");
    const cursor = new Date(start);
    const today = new Date(todayDate);
    today.setHours(0, 0, 0, 0);
    while (cursor <= today) {
      const iso = cursor.toISOString().slice(0, 10);
      if (!loggedDates.has(iso)) daysSkipped++;
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  const totalTrained = loggedDates.size;
  const totalSpan = startDate ? totalTrained + daysSkipped : 0;
  const consistencyPct = totalSpan ? Math.round((totalTrained / totalSpan) * 100) : 0;

  return { startDate, totalTrained, daysSkipped, consistencyPct, loggedDates };
}

export { calculateCalendarStats };
