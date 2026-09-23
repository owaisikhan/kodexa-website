// The free speed check on the Website Audit page: one Google PageSpeed
// Insights run, on a simulated mid-range phone, summarised into what a shop
// owner can read. Server only, because it holds the API key.
//
// PageSpeed without a key shares one tiny quota with the whole internet and
// is usually exhausted, so the feature only appears when PAGESPEED_API_KEY is
// set (a free Google Cloud key with the PageSpeed Insights API enabled).

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CACHE_MS = 10 * 60 * 1000;
const RATE = { windowMs: 10 * 60 * 1000, max: 5 };

export function isSpeedConfigured() {
  return Boolean(process.env.PAGESPEED_API_KEY);
}

/**
 * What the visitor typed, as a public http(s) URL, or null. "shop.pk" gets
 * https:// in front. IP addresses, localhost and internal names are refused:
 * Google is the one fetching, but there is no reason to point it anywhere
 * that is not a public website.
 */
export function normaliseUrl(input) {
  let raw = String(input ?? "").trim();
  if (!raw || raw.length > 200) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.username || url.password) return null;
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal")) return null;
  if (/^[\d.]+$/.test(host) || host.includes(":") || host === "localhost") return null;
  url.hash = "";
  return url.toString();
}

const METRICS = [
  { id: "largest-contentful-paint", label: "Main content shows" },
  { id: "first-contentful-paint", label: "First thing on screen" },
  { id: "total-blocking-time", label: "Frozen while loading" },
  { id: "cumulative-layout-shift", label: "Page jumps around" },
  { id: "speed-index", label: "Looks loaded" },
];

// Lighthouse scores each audit 0 to 1; these are its own thresholds.
function rating(score) {
  if (score == null) return "unknown";
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "needs-work";
  return "poor";
}

/** Google's full report, cut down to what the page shows. */
export function summarise(json) {
  const lr = json?.lighthouseResult;
  const perf = lr?.categories?.performance;
  if (!lr || perf?.score == null) return null;
  const audits = lr.audits ?? {};

  const metrics = METRICS.filter((m) => audits[m.id]).map((m) => ({
    label: m.label,
    value: audits[m.id].displayValue ?? "",
    rating: rating(audits[m.id].score),
  }));

  // The biggest wins first: anything failing that Lighthouse says would save
  // time. Newer Lighthouse reports savings per metric instead of in ms.
  const savings = (a) =>
    a.details?.overallSavingsMs ?? Math.max(0, ...Object.values(a.metricSavings ?? {}).map(Number).filter(Number.isFinite));
  const fixes = Object.values(audits)
    .filter((a) => a.score != null && a.score < 0.9 && savings(a) > 0)
    .sort((a, b) => savings(b) - savings(a))
    .slice(0, 3)
    .map((a) => a.title);

  return {
    url: lr.finalDisplayedUrl || lr.finalUrl || lr.requestedUrl,
    score: Math.round(perf.score * 100),
    rating: rating(perf.score),
    metrics,
    fixes,
  };
}

const cache = new Map();
const hits = new Map();

export function speedRateLimit(ip) {
  const now = Date.now();
  const r = hits.get(ip);
  if (!r || now - r.start > RATE.windowMs) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) for (const [k, v] of hits) if (now - v.start > RATE.windowMs) hits.delete(k);
    return true;
  }
  if (r.count >= RATE.max) return false;
  r.count += 1;
  return true;
}

/** { ok: true, result } or { ok: false, status, message } with a sentence. */
export async function runSpeedTest(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.at < CACHE_MS) return { ok: true, result: cached.result };

  const q = new URLSearchParams({ url, strategy: "mobile", category: "performance", key: process.env.PAGESPEED_API_KEY });
  let response;
  try {
    response = await fetch(`${ENDPOINT}?${q}`, { signal: AbortSignal.timeout(55_000), cache: "no-store" });
  } catch {
    return { ok: false, status: 504, message: "The test took too long. Try again, or send us the address and we will test it by hand." };
  }

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const reason = json?.error?.message ?? "";
    console.error("PageSpeed error", response.status, reason.slice(0, 200));
    if (response.status === 429) {
      return { ok: false, status: 503, message: "The speed test is busy right now. Try again in a few minutes." };
    }
    // A bad or restricted key is also a 400, and is our problem, not the
    // visitor's site: say the check is unavailable, and log why.
    if (/API key|API_KEY|PERMISSION_DENIED|has not been used|is disabled/i.test(reason) || response.status === 403) {
      return { ok: false, status: 503, message: "The speed check is unavailable right now. Send us the address and we will test it by hand." };
    }
    // Google answers 400 when it could not load the page at all.
    if (response.status === 400 || /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS/i.test(reason)) {
      return { ok: false, status: 422, message: "We could not open that site. Check the address, and that it loads in your own browser." };
    }
    return { ok: false, status: 502, message: "The speed test is unavailable right now. Send us the address and we will test it by hand." };
  }

  const result = summarise(json);
  if (!result) {
    return { ok: false, status: 502, message: "The test finished without a score. Try again, or send us the address." };
  }
  cache.set(url, { at: Date.now(), result });
  if (cache.size > 200) cache.delete(cache.keys().next().value);
  return { ok: true, result };
}
