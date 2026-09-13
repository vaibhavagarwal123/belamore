import { NextRequest, NextResponse } from "next/server";
import { evaluateGiftCard } from "@/lib/gift-card";

export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({}));
  if (!code) return NextResponse.json({ valid: false, error: "Missing code." }, { status: 400 });
  const result = await evaluateGiftCard(code);
  if (!result.valid) return NextResponse.json(result);
  return NextResponse.json({ valid: true, balancePaise: result.card.balancePaise });
}
