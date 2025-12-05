/**
 * Live occupancy data subscription
 * Simulates 5s updates with realistic data variations
 */

export interface OccupancyPoint {
  t: string; // time label (e.g., "8 PM", "10:23 AM")
  v: number; // occupancy value (0-150)
}

const initialData: OccupancyPoint[] = [
  { t: '8 PM', v: 42 },
  { t: '9 PM', v: 68 },
  { t: '10 PM', v: 51 },
  { t: '11 PM', v: 73 },
  { t: '12 AM', v: 38 },
  { t: '1 AM', v: 102 },
  { t: '2 AM', v: 64 },
];

export function subscribeOccupancy(callback: (data: OccupancyPoint[]) => void): () => void {
  let data = [...initialData];

  // Initial call
  callback(data);

  // Simulate 5s updates with sliding window
  const interval = setInterval(() => {
    const last = data[data.length - 1];

    // Generate realistic next value: ±15% variance, clamped to 10-140
    const variance = Math.random() * 30 - 15; // -15 to +15
    const nextV = Math.max(10, Math.min(140, Math.round(last.v + variance)));

    // Format time label (could be real time, or a sequence)
    const now = new Date();
    const nextT = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    // Slide window: drop oldest, add newest
    data = [...data.slice(1), { t: nextT, v: nextV }];

    callback(data);
  }, 5000);

  return () => clearInterval(interval);
}
