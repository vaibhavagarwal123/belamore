"use client";

import { useFormState } from "react-dom";
import { changeAdminPasswordAction } from "@/lib/admin-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function ChangePasswordForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(changeAdminPasswordAction, null);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <input name="currentPassword" type="password" required placeholder="Current password" className="input" />
      <input name="newPassword" type="password" required minLength={8} placeholder="New password (min 8 characters)" className="input" />
      <input name="confirmPassword" type="password" required minLength={8} placeholder="Confirm new password" className="input" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-600">{state.success}</p>}
      <SubmitButton>Update Password</SubmitButton>
    </form>
  );
}
