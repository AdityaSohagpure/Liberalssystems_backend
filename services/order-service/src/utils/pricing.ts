// Helper to calculate duration in days
export function getDurationInDays(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1; // Minimum 1 day
}

// Helper to calculate rental cost
export function calculateRentCost(pricePerDay: number, pricePerWeek: number | null, days: number): number {
  if (pricePerWeek && days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return (weeks * pricePerWeek) + (remainingDays * pricePerDay);
  }
  return days * pricePerDay;
}
