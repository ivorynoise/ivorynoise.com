import posthog from "posthog-js";

// Only track the live site, so localhost and preview deploys never reach PostHog.
const PRODUCTION_HOSTS = [
  "deepakaggarwal.me",
  "www.deepakaggarwal.me",
  "ivorynoise.com",
  "www.ivorynoise.com",
];

if (PRODUCTION_HOSTS.includes(window.location.hostname)) {
  posthog.init("phc_kp66RPY7BFZ4BZvLMkg69q34LGG3NpKvzXggcQ6vNkwP", {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
  });
}
