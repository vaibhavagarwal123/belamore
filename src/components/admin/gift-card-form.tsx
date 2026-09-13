"use client";

import { useFormState } from "react-dom";
import { issueGiftCardAction } from "@/lib/admin-giftcard-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function GiftCardForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(issueGiftCardAction, null);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-ink-600/10 bg-white p-5">
      <div className="grid grid-cols-2 gap-3">
        <input name="value" type="number" step="0.01" required placeholder="Value (₹)" className="input" />
        <input name="recipientEmail" type="email" placeholder="Recipient email (optional)" className="input" />
      </div>
      <textarea name="message" rows={2} placeholder="Gift message (optional)" className="input" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-600">{state.success}</p>}
      <SubmitButton>Issue Gift Card</SubmitButton>
    </form>
  );
}
