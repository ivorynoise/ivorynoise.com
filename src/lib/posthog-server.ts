import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

/** Returns null when PostHog is not configured (e.g. missing runtime env in container). */
export function getPostHogClient(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return null;

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}
