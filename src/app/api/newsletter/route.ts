import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID_RAW = process.env.BREVO_LIST_ID;

function brevoErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object") return "Brevo error";
  const o = body as Record<string, unknown>;
  const msg = o.message;
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) {
    return msg.map(String).filter(Boolean).join(", ") || "Brevo error";
  }
  return "Brevo error";
}

export async function POST(req: NextRequest) {
  try {
    if (!BREVO_API_KEY?.trim()) {
      return NextResponse.json(
        {
          error:
            "Add BREVO_API_KEY to your environment. Get a key from Brevo → Settings → SMTP & API → API keys. Restart the dev server after changing env vars.",
        },
        { status: 503 }
      );
    }

    if (!BREVO_LIST_ID_RAW?.trim()) {
      return NextResponse.json(
        {
          error:
            "Add BREVO_LIST_ID to your environment (e.g. .env.local). In Brevo: CRM → Lists → open your list — the numeric ID is in the URL or list details. Restart the dev server after changing env vars.",
        },
        { status: 503 }
      );
    }

    const listId = Number.parseInt(BREVO_LIST_ID_RAW.trim(), 10);
    if (!Number.isFinite(listId) || listId < 1) {
      return NextResponse.json({ error: "Invalid newsletter list id." }, { status: 500 });
    }

    const { email: raw } = await req.json();
    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const email = raw.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY.trim(),
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (response.ok) {
      const posthog = getPostHogClient();
      posthog?.capture({
        distinctId: email,
        event: "newsletter_subscribed",
        properties: { email, provider: "brevo" },
      });
      return NextResponse.json({ success: true });
    }

    const errBody = await response.json().catch(() => null);
    const clientMessage = brevoErrorMessage(errBody);
    const status =
      response.status >= 400 && response.status < 600 ? response.status : 400;

    return NextResponse.json(
      { error: clientMessage },
      { status: status >= 500 ? 502 : 400 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
