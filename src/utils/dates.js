const dayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

/* Real calendar date in YYYY-MM-DD form — used for calendar/streak tracking (not just weekday labels) */
const isoDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const shortDateLabel = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const genHistory = (base, variance, days = 14) =>
  Array.from({ length: days }, (_, i) => ({
    day: dayKey(-(days - 1 - i)),
    value: Math.round(base + (Math.random() - 0.5) * variance),
  }));

export { dayKey, isoDate, shortDateLabel, genHistory };
