/**
 * Opening hours (from the site footer, Footer.hoursValue):
 * Sun-Thu 08:00-22:00 · Fri-Sat 10:00-22:00, Israel time.
 */
const HOURS: Record<number, [number, number]> = {
  0: [8, 22], 1: [8, 22], 2: [8, 22], 3: [8, 22], 4: [8, 22],
  5: [10, 22], 6: [10, 22],
};

/** Is the shop open right now? Computed in Asia/Jerusalem. */
export function isOpenNow(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const h = Number(get('hour')) + Number(get('minute')) / 60;
  const [open, close] = HOURS[day] ?? [0, 0];
  return h >= open && h < close;
}
