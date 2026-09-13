import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/customer-auth";

export async function POST() {
  clearCustomerSession();
  return NextResponse.json({ ok: true });
}
