"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatPaise } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { FLAT_SHIPPING_PAISE, FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/constants";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type PaymentProvider = "RAZORPAY" | "STRIPE" | "COD";

export function CheckoutForm({
  hasRazorpay,
  hasStripe,
}: {
  hasRazorpay: boolean;
  hasStripe: boolean;
}) {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const subtotal = cartSubtotal(items);

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardApplied, setGiftCardApplied] = useState(false);
  const [giftCardBalance, setGiftCardBalance] = useState(0);
  const [giftCardMessage, setGiftCardMessage] = useState<string | null>(null);
  const [provider, setProvider] = useState<PaymentProvider>(
    hasRazorpay ? "RAZORPAY" : hasStripe ? "STRIPE" : "COD",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : FLAT_SHIPPING_PAISE;
  const preGiftCardTotal = Math.max(0, subtotal - discountAmount) + shipping;
  const giftCardDeduction = giftCardApplied ? Math.min(giftCardBalance, preGiftCardTotal) : 0;
  const total = preGiftCardTotal - giftCardDeduction;

  async function applyDiscount() {
    if (!discountCode) return;
    const res = await fetch("/api/discount/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: discountCode, subtotalPaise: subtotal }),
    });
    const data = await res.json();
    if (data.valid) {
      setDiscountAmount(data.amountOffPaise);
      setDiscountMessage(`Code applied — you saved ${formatPaise(data.amountOffPaise)}`);
    } else {
      setDiscountAmount(0);
      setDiscountMessage(data.error ?? "Invalid code.");
    }
  }

  async function applyGiftCard() {
    if (!giftCardCode) return;
    const res = await fetch("/api/gift-card/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: giftCardCode }),
    });
    const data = await res.json();
    if (data.valid) {
      setGiftCardApplied(true);
      setGiftCardBalance(data.balancePaise);
      setGiftCardMessage(`Gift card applied — balance ${formatPaise(data.balancePaise)}`);
    } else {
      setGiftCardApplied(false);
      setGiftCardMessage(data.error ?? "Invalid gift card.");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const shippingInfo = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      line1: String(formData.get("line1") || ""),
      line2: String(formData.get("line2") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      postalCode: String(formData.get("postalCode") || ""),
      country: String(formData.get("country") || "India"),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shipping: shippingInfo,
          discountCode: discountAmount > 0 ? discountCode : undefined,
          giftCardCode: giftCardApplied ? giftCardCode : undefined,
          paymentProvider: provider,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      if (provider === "COD" || data.totalPaise === 0) {
        clear();
        router.push(`/checkout/success?order=${data.orderId}`);
        return;
      }

      if (provider === "RAZORPAY") {
        const rpRes = await fetch("/api/payments/razorpay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        const rp = await rpRes.json();
        if (!rpRes.ok) throw new Error(rp.error);

        const rzp = new window.Razorpay({
          key: rp.keyId,
          amount: rp.amount,
          currency: "INR",
          name: "Belamore",
          description: `Order ${rp.orderNumber}`,
          order_id: rp.razorpayOrderId,
          prefill: { name: shippingInfo.fullName, email: shippingInfo.email, contact: shippingInfo.phone },
          theme: { color: "#B8862F" },
          handler: async (response: Record<string, string>) => {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderId, ...response }),
            });
            if (verifyRes.ok) {
              clear();
              router.push(`/checkout/success?order=${data.orderId}`);
            } else {
              setError("Payment verification failed. Please contact us with your order number.");
            }
          },
        });
        rzp.open();
        setLoading(false);
        return;
      }

      if (provider === "STRIPE") {
        const stripeRes = await fetch("/api/payments/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        const stripeData = await stripeRes.json();
        if (!stripeRes.ok) throw new Error(stripeData.error);
        window.location.href = stripeData.url;
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <>
      {hasRazorpay && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="mb-4 font-display text-xl text-ink-700">Shipping Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input name="fullName" required placeholder="Full name" className="input" />
              <input name="phone" required placeholder="Phone number" className="input" />
              <input name="email" type="email" required placeholder="Email address" className="input sm:col-span-2" />
              <input name="line1" required placeholder="Address line 1" className="input sm:col-span-2" />
              <input name="line2" placeholder="Address line 2 (optional)" className="input sm:col-span-2" />
              <input name="city" required placeholder="City" className="input" />
              <input name="state" required placeholder="State" className="input" />
              <input name="postalCode" required placeholder="Postal code" className="input" />
              <input name="country" defaultValue="India" required placeholder="Country" className="input" />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl text-ink-700">Payment Method</h2>
            <div className="space-y-3">
              {hasRazorpay && (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-600/15 p-4">
                  <input type="radio" name="provider" checked={provider === "RAZORPAY"} onChange={() => setProvider("RAZORPAY")} />
                  <span>UPI / Cards / Netbanking (Razorpay)</span>
                </label>
              )}
              {hasStripe && (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-600/15 p-4">
                  <input type="radio" name="provider" checked={provider === "STRIPE"} onChange={() => setProvider("STRIPE")} />
                  <span>International Card (Stripe)</span>
                </label>
              )}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-600/15 p-4">
                <input type="radio" name="provider" checked={provider === "COD"} onChange={() => setProvider("COD")} />
                <span>Cash on Delivery</span>
              </label>
              {!hasRazorpay && !hasStripe && (
                <p className="text-xs text-ink-400">
                  Online payments aren&rsquo;t configured yet — add Razorpay or Stripe keys in your
                  environment settings to accept cards/UPI. Cash on Delivery works right away.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="h-fit rounded-2xl bg-beige-100/60 p-6">
          <h2 className="mb-4 font-display text-lg text-ink-700">Order Summary</h2>
          <ul className="mb-4 space-y-2 text-sm text-ink-600">
            {items.map((item) => (
              <li key={item.productId + (item.variantId ?? "")} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPaise(item.unitPricePaise * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 flex gap-2">
            <input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Discount code"
              className="input flex-1"
            />
            <button type="button" onClick={applyDiscount} className="rounded-full border border-ink-600/20 px-4 text-sm text-ink-600 hover:border-gold-500">
              Apply
            </button>
          </div>
          {discountMessage && <p className="mb-3 text-xs text-gold-600">{discountMessage}</p>}

          <div className="mb-4 flex gap-2">
            <input
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value)}
              placeholder="Gift card code"
              className="input flex-1"
            />
            <button type="button" onClick={applyGiftCard} className="rounded-full border border-ink-600/20 px-4 text-sm text-ink-600 hover:border-gold-500">
              Apply
            </button>
          </div>
          {giftCardMessage && <p className="mb-3 text-xs text-gold-600">{giftCardMessage}</p>}

          <div className="space-y-2 border-t border-ink-600/10 pt-4 text-sm text-ink-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPaise(subtotal)}</span></div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-gold-600"><span>Discount</span><span>−{formatPaise(discountAmount)}</span></div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPaise(shipping)}</span>
            </div>
            {giftCardDeduction > 0 && (
              <div className="flex justify-between text-gold-600"><span>Gift Card</span><span>−{formatPaise(giftCardDeduction)}</span></div>
            )}
            <div className="flex justify-between border-t border-ink-600/10 pt-2 font-display text-lg text-ink-700">
              <span>Total</span><span>{formatPaise(total)}</span>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            variant="gold"
            disabled={loading || items.length === 0}
            className="mt-6 w-full"
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </form>
    </>
  );
}
