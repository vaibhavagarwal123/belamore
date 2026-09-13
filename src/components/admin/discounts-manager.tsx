"use client";

import { useState } from "react";
import { DiscountForm } from "@/components/admin/discount-form";
import { deleteDiscountAction } from "@/lib/admin-marketing-actions";
import { formatPaise } from "@/lib/money";

type Discount = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderPaise: number;
  usageLimit: number | null;
  timesUsed: number;
  expiresAt: Date | null;
  isActive: boolean;
};

export function DiscountsManager({ discounts }: { discounts: Discount[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setCreating((v) => !v)} className="rounded-full bg-gold-500 px-5 py-2.5 text-sm text-white hover:bg-gold-600">
          {creating ? "Close" : "+ Add Discount"}
        </button>
      </div>
      {creating && <DiscountForm onDone={() => setCreating(false)} />}

      {discounts.map((d) =>
        editing === d.id ? (
          <DiscountForm key={d.id} discount={d} onDone={() => setEditing(null)} />
        ) : (
          <div key={d.id} className="flex items-center justify-between rounded-2xl border border-ink-600/10 bg-white p-5">
            <div>
              <p className="font-display text-lg text-ink-700">{d.code}</p>
              <p className="text-sm text-ink-500">
                {d.type === "PERCENTAGE" ? `${d.value}% off` : `${formatPaise(d.value)} off`}
                {d.minOrderPaise > 0 && ` · min order ${formatPaise(d.minOrderPaise)}`}
              </p>
              <p className="text-xs text-ink-400">
                Used {d.timesUsed}{d.usageLimit ? `/${d.usageLimit}` : ""} times
                {d.expiresAt && ` · expires ${new Date(d.expiresAt).toLocaleDateString("en-IN")}`}
                {" · "}{d.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setEditing(d.id)} className="text-sm text-gold-600 hover:underline">Edit</button>
              <form action={deleteDiscountAction}>
                <input type="hidden" name="id" value={d.id} />
                <button className="text-sm text-blush-300 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
