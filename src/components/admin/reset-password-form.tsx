"use client";

import { useFormState } from "react-dom";
import { resetAdminPasswordAction, type ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useFormState<ActionState, FormData>(resetAdminPasswordAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-center font-display text-2xl text-ink-700">Choose a New Password</h1>
      <input type="hidden" name="token" value={token} />
      <input name="password" type="password" required minLength={8} placeholder="New password (min 8 characters)" className="input" />
      <input name="confirmPassword" type="password" required minLength={8} placeholder="Confirm new password" className="input" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton className="w-full">Reset Password</SubmitButton>
    </form>
  );
}
