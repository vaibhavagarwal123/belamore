"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAdminAction, type ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function LoginForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(loginAdminAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-center font-display text-2xl text-ink-700">Admin Sign In</h1>
      <input name="email" type="email" required placeholder="Email" className="input" />
      <input name="password" type="password" required placeholder="Password" className="input" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton className="w-full">Sign In</SubmitButton>
      <p className="text-center text-sm text-ink-400">
        <Link href="/admin/forgot-password" className="hover:text-gold-600">Forgot your password?</Link>
      </p>
    </form>
  );
}
