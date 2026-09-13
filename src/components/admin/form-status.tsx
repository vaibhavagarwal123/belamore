"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full bg-gold-500 px-6 py-3 text-sm text-white transition hover:bg-gold-600 disabled:opacity-60 ${className}`}
    >
      {pending ? "Please wait..." : children}
    </button>
  );
}
