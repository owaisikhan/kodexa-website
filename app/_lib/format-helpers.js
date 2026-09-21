// Formatting only. Safe on the server AND in client components, which is why
// it lives apart from helpers.js (that one reads cookies and is server-only).

export function formatDate(value, locale = "en-GB") {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

// "923001234567" reads as a phone number to nobody. This makes it readable
// without changing the value we actually dial.
export function formatPhone(digits) {
  const d = String(digits ?? "").replace(/\D/g, "");
  if (d.length < 10) return digits;
  return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
}
