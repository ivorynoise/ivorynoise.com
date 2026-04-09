"use client";

import { useState } from "react";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    posthog.capture("newsletter_submitted");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Thank you for subscribing. You are subscribed now :)");
        setEmail("");
        posthog.capture("newsletter_subscribe_success");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        posthog.capture("newsletter_subscribe_failed", { error: data.error });
      }
    } catch (err) {
      posthog.captureException(err);
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <Input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 border-white/12 bg-white/8 text-cream placeholder:text-cream/30 md:h-10"
        style={{ fontSize: "var(--text-sm)" }}
        disabled={status === "loading"}
      />
      <Button
        type="submit"
        className="bg-cream font-semibold text-nocturne hover:bg-cream/90 md:h-10"
        style={{ fontSize: "var(--text-sm)" }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </Button>
      {message && (
        <span
          className={
            status === "success"
              ? "text-green-500 text-sm mt-2 sm:mt-0"
              : "text-red-500 text-sm mt-2 sm:mt-0"
          }
          style={{ minWidth: "8rem" }}
        >
          {message}
        </span>
      )}
    </form>
  );
}
