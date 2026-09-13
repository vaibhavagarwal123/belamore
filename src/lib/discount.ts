import { db } from "@/lib/db";

export async function evaluateDiscountCode(code: string, subtotalPaise: number) {
  const discount = await db.discountCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!discount || !discount.isActive) {
    return { valid: false as const, error: "This code is not valid." };
  }
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return { valid: false as const, error: "This code has expired." };
  }
  if (discount.usageLimit !== null && discount.timesUsed >= discount.usageLimit) {
    return { valid: false as const, error: "This code has reached its usage limit." };
  }
  if (subtotalPaise < discount.minOrderPaise) {
    return {
      valid: false as const,
      error: `Add more to your bag to use this code (minimum order applies).`,
    };
  }

  const amountOffPaise =
    discount.type === "PERCENTAGE"
      ? Math.round((subtotalPaise * discount.value) / 100)
      : Math.min(discount.value, subtotalPaise);

  return { valid: true as const, discount, amountOffPaise };
}
