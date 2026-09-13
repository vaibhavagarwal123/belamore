"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthForms() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body =
      mode === "login"
        ? { email: fd.get("email"), password: fd.get("password") }
        : { name: fd.get("name"), email: fd.get("email"), password: fd.get("password") };

    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 flex justify-center gap-6 text-sm">
        <button
          onClick={() => setMode("login")}
          className={mode === "login" ? "text-gold-600 border-b-2 border-gold-500 pb-1" : "text-ink-400"}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode("register")}
          className={mode === "register" ? "text-gold-600 border-b-2 border-gold-500 pb-1" : "text-ink-400"}
        >
          Create Account
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "register" && <input name="name" required placeholder="Full name" className="input" />}
        <input name="email" type="email" required placeholder="Email address" className="input" />
        <input name="password" type="password" required minLength={6} placeholder="Password" className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="gold" disabled={loading} className="w-full">
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
