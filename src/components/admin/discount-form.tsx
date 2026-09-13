"use client";

import { useFormState } from "react-dom";
import { upsertDiscountAction } from "@/lib/admin-marketing-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function DiscountForm({
  discount,
  onDone,
}: {
  discount?: {
    id: string;
    code: string;
    type: string;
    value: number;
    minOrderPaise: number;
    usageLimit: number | null;
    expiresAt: Date | null;
    isActive: boolean;
  };
  onDone?: () => void;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(upsertDiscountAction, null);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-ink-600/10 bg-white p-5">
      {discount && <input type="hidden" name="id" value={discount.id} />}
      <div className="grid grid-cols-2 gap-3">
        <input name="code" required defaultValue={discount?.code} placeholder="CODE (e.g. FESTIVE20)" className="input uppercase" />
        <select name="type" defaultValue={discount?.type ?? "PERCENTAGE"} className="input">
          <option value="PERCENTAGE">Percentage off</option>
          <option value="FIXED">Fixed amount off (₹)</option>
        </select>
        <input name="value" type="number" required defaultValue={discount?.value} placeholder="Value (e.g. 10 for 10%)" className="input" />
        <input name="minOrder" type="number" step="0.01" defaultValue={discount ? discount.minOrderPaise / 100 : 0} placeholder="Minimum order (₹)" className="input" />
        <input name="usageLimit" type="number" defaultValue={discount?.usageLimit ?? ""} placeholder="Usage limit (blank = unlimited)" className="input" />
        <input
          name="expiresAt"
          type="date"
          defaultValue={discount?.expiresAt ? new Date(discount.expiresAt).toISOString().slice(0, 10) : ""}
          className="input"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input type="checkbox" name="isActive" defaultChecked={discount?.isActive ?? true} /> Active
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-600">{state.success}</p>}
      <div className="flex gap-3">
        <SubmitButton>{discount ? "Save Discount" : "Add Discount"}</SubmitButton>
        {onDone && <button type="button" onClick={onDone} className="text-sm text-ink-400 hover:underline">Cancel</button>}
      </div>
    </form>
  );
}
