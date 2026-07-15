/* Pure, testable nutrition math — extracted from App.jsx so it can be unit tested
   without rendering the whole component tree. */

function calculateConsumed(meals) {
  return meals.reduce(
    (a, m) => ({
      cal: a.cal + (m.cal || 0),
      protein: a.protein + (m.protein || 0),
      carbs: a.carbs + (m.carbs || 0),
      fat: a.fat + (m.fat || 0),
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function calculateRemaining(consumedCal, targetCal) {
  return Math.max(targetCal - consumedCal, 0);
}

export { calculateConsumed, calculateRemaining };
