/**
 * Returns whether Dulce Cafe is currently open based on Lagos time (WAT = UTC+1).
 * Operating hours: 8:00 AM – 8:00 PM daily.
 */
export function isLagosOpen(): boolean {
  const now = new Date();
  const lagosTime = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    hour12: false,
  }).format(now);
  const hour = parseInt(lagosTime, 10);
  return hour >= 8 && hour < 20;
}

/**
 * Returns a formatted string of the current Lagos time.
 */
export function getLagosTimeString(): string {
  return new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}
