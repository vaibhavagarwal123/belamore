"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminOrRedirect } from "@/lib/admin-actions";
import type { ActionState } from "@/lib/admin-actions";

function generateGiftCardCode() {
  return `GIFT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function issueGiftCardAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminOrRedirect();
  const valuePaise = Math.round(Number(formData.get("value") || 0) * 100);
  const recipientEmail = String(formData.get("recipientEmail") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!valuePaise) return { error: "Enter a value for the gift card." };

  const card = await db.giftCard.create({
    data: {
      code: generateGiftCardCode(),
      initialValuePaise: valuePaise,
      balancePaise: valuePaise,
      recipientEmail: recipientEmail || undefined,
      message: message || undefined,
    },
  });

  revalidatePath("/admin/gift-cards");
  return { success: `Gift card created: ${card.code}` };
}

export async function toggleGiftCardAction(formData: FormData) {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const card = await db.giftCard.findUnique({ where: { id } });
  if (!card) return;
  await db.giftCard.update({ where: { id }, data: { isActive: !card.isActive } });
  revalidatePath("/admin/gift-cards");
}
