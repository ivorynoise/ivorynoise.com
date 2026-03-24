import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID!;
const DATACENTER = MAILCHIMP_API_KEY?.split("-")[1];

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const data = {
      email_address: email,
      status: "subscribed",
    };

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const posthog = getPostHogClient();
      posthog?.capture({
        distinctId: email,
        event: "newsletter_subscribed",
        properties: { email },
      });
      return NextResponse.json({ success: true });
    } else {
      const error = await response.json();
      return NextResponse.json({ error: error.detail || "Mailchimp error" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
