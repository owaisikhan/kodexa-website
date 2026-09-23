import { isSpeedConfigured, normaliseUrl, runSpeedTest, speedRateLimit } from "@/app/_lib/speed/psi";

// A PageSpeed run takes 20 to 40 seconds on Google's side.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  if (!isSpeedConfigured()) {
    return Response.json({ error: "The speed check is not set up." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send JSON." }, { status: 400 });
  }

  const url = normaliseUrl(body?.url);
  if (!url) {
    return Response.json(
      { error: "That does not look like a website address. Try something like yourshop.pk" },
      { status: 400 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!speedRateLimit(ip)) {
    return Response.json(
      { error: "That is a few tests in a row. Give it ten minutes, or send us the address on WhatsApp." },
      { status: 429 }
    );
  }

  const run = await runSpeedTest(url);
  if (!run.ok) return Response.json({ error: run.message }, { status: run.status });
  return Response.json(run.result);
}
