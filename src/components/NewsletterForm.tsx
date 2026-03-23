"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setStatus("success");
      setMessage("You're subscribed!");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-[var(--radius-sm)] px-4 py-2.5 text-nocturne outline-none placeholder:text-nocturne/30"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "var(--text-sm)", color: "var(--color-cream)" }}
        disabled={status === "loading"}
      />
      <button
        type="submit"
        className="rounded-[var(--radius-sm)] text-nocturne font-semibold px-5 py-2.5 transition-opacity hover:opacity-80"
        style={{ fontSize: "var(--text-sm)", background: "var(--color-cream)" }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
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
