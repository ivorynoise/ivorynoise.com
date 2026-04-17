import { NextRequest } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";
const POSTHOG_ASSETS_HOST = "https://us-assets.i.posthog.com";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/^\/ingest/, "");
  const search = request.nextUrl.search;

  const isAsset =
    pathname.startsWith("/static/") || pathname.startsWith("/array/");
  const host = isAsset ? POSTHOG_ASSETS_HOST : POSTHOG_HOST;
  const url = `${host}${pathname}${search}`;

  // Forward the real client IP so PostHog can resolve GeoIP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    undefined;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (ip) headers.set("x-forwarded-for", ip);

  const response = await fetch(url, {
    method: request.method,
    headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}

export const config = {
  matcher: "/ingest/:path*",
};
