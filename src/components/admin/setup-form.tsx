"use client";

import { useFormState } from "react-dom";
import { setupAdminAction, type ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function SetupForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(setupAdminAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-center font-display text-2xl text-ink-700">Set Up Admin Access</h1>
      <p className="text-center text-sm text-ink-500">
        Create the one admin account that can manage products, orders and offers. Keep these
        details safe.
      </p>
      <input name="name" required placeholder="Your name" className="input" />
      <input name="email" type="email" required placeholder="Admin email" className="input" />
      <input name="password" type="password" required minLength={8} placeholder="Password (min 8 characters)" className="input" />
      <input name="confirmPassword" type="password" required minLength={8} placeholder="Confirm password" className="input" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton className="w-full">Create Admin Account</SubmitButton>
    </form>
  );
}
