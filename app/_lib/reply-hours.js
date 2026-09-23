// Are we at the phone right now, and if not, when are we back? Worked out in
// the business's own timezone, never the visitor's or the server's: a
// visitor in Dubai at 9pm and a Vercel function in Mumbai must both get
// Pakistan's answer.
//
// Pure (the clock is passed in), so it can be checked against fixed times.

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function localParts(now, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return { day: SHORT[get("weekday")], hour: Number(get("hour")) };
}

function clock(hour) {
  if (hour === 0) return "midnight";
  if (hour === 12) return "noon";
  return hour < 12 ? `${hour} am` : `${hour - 12} pm`;
}

/**
 * { open: true } while someone is there, otherwise
 * { open: false, back: "10 am tomorrow" } naming the next opening.
 */
export function replyStatus(now, { timeZone, days, open, close }) {
  const { day, hour } = localParts(now, timeZone);

  if (days.includes(day) && hour >= open && hour < close) return { open: true };

  for (let ahead = 0; ahead < 8; ahead++) {
    const d = (day + ahead) % 7;
    if (!days.includes(d)) continue;
    if (ahead === 0 && hour >= open) continue; // today's hours are over
    const when = ahead === 0 ? "today" : ahead === 1 ? "tomorrow" : DAY_NAMES[d];
    return { open: false, back: `${clock(open)} ${when}` };
  }
  return { open: false, back: null };
}
