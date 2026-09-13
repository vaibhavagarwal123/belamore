"use client";

import { useFormState } from "react-dom";
import { requestAdminPasswordResetAction, type ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(requestAdminPasswordResetAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-center font-display text-2xl text-ink-700">Reset Admin Password</h1>
      <p className="text-center text-sm text-ink-500">
        Enter your admin email and we&rsquo;ll send you a reset link.
      </p>
      <input name="email" type="email" required placeholder="Admin email" className="input" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-600">{state.success}</p>}
      <SubmitButton className="w-full">Send Reset Link</SubmitButton>
    </form>
  );
}
