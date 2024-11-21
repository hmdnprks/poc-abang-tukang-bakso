const SPEEDS_KMH: Record<'foot' | 'car' | 'bike' | 'motorcycle', number> = {
  foot: 5,
  car: 60,
  bike: 20,
  motorcycle: 45,
};

export function estimateDuration(
  distanceKm: number,
  mode: keyof typeof SPEEDS_KMH
): number {
  const speedKmh = SPEEDS_KMH[mode];

  if (!speedKmh) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  const durationHours = distanceKm / speedKmh;
  const durationMinutes = durationHours * 60;

  return durationMinutes;
}
