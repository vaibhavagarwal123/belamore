import { Container } from "@/components/ui/container";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { isRazorpayConfigured } from "@/lib/payments/razorpay";
import { isStripeConfigured } from "@/lib/payments/stripe";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <h1 className="mb-10 font-display text-4xl text-ink-700">Checkout</h1>
        <CheckoutForm hasRazorpay={isRazorpayConfigured()} hasStripe={isStripeConfigured()} />
      </Container>
    </div>
  );
}
