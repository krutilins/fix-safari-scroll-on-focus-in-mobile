export function daysSinceDate(date: Date) {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.abs((date.getTime() - new Date().getTime()) / oneDay);

  return diffDays;
}
