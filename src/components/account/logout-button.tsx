"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh();
      }}
      className="text-sm text-ink-500 underline hover:text-gold-600"
    >
      Sign out
    </button>
  );
}
