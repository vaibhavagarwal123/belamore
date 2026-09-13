import { db } from "@/lib/db";

export async function evaluateGiftCard(code: string) {
  const card = await db.giftCard.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!card || !card.isActive) {
    return { valid: false as const, error: "This gift card code was not found." };
  }
  if (card.expiresAt && card.expiresAt < new Date()) {
    return { valid: false as const, error: "This gift card has expired." };
  }
  if (card.balancePaise <= 0) {
    return { valid: false as const, error: "This gift card has no remaining balance." };
  }
  return { valid: true as const, card };
}
