import { NextRequest, NextResponse } from "next/server";
import { evaluateDiscountCode } from "@/lib/discount";

export async function POST(req: NextRequest) {
  const { code, subtotalPaise } = await req.json().catch(() => ({}));
  if (!code || typeof subtotalPaise !== "number") {
    return NextResponse.json({ valid: false, error: "Missing code." }, { status: 400 });
  }
  const result = await evaluateDiscountCode(code, subtotalPaise);
  return NextResponse.json(result);
}
