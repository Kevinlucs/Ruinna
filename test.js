function calculateWeeks(startDate, raceDate) {
  const race = new Date(raceDate);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const diffMs = race - start;
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(4, Math.min(52, diffWeeks));
}
console.log(calculateWeeks("2026-05-05", "2026-12-22"));
