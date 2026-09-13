"use client";

import { useState } from "react";

export function NewsletterForm({ light = false }: { light?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className={light ? "text-gold-100" : "text-gold-600"}>
        You&rsquo;re on the list — welcome to the Belamore circle.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={
          light
            ? "w-full rounded-full border border-beige-50/30 bg-transparent px-4 py-2.5 text-sm text-beige-50 placeholder:text-beige-100/60 focus:border-gold-300 focus:outline-none"
            : "w-full rounded-full border border-ink-600/20 bg-white px-4 py-2.5 text-sm text-ink-700 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none"
        }
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-gold-500 px-5 py-2.5 text-sm text-white transition hover:bg-gold-600 disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Join"}
      </button>
      {status === "error" && (
        <span className="sr-only">Something went wrong, please try again.</span>
      )}
    </form>
  );
}
