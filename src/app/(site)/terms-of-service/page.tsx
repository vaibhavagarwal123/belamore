import { Container } from "@/components/ui/container";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-ink-700">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink-400">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="mt-10 space-y-6 leading-relaxed text-ink-600">
          <h2 className="font-display text-xl text-ink-700">Orders & Payment</h2>
          <p>
            All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes
            unless stated otherwise. We accept payment via UPI, credit/debit cards, netbanking
            (Razorpay), international cards (Stripe), and Cash on Delivery where available. Orders
            are confirmed once payment is successfully received (or, for Cash on Delivery, once
            placed).
          </p>
          <h2 className="font-display text-xl text-ink-700">Handcrafted Products</h2>
          <p>
            Every Belamore piece is handcrafted from natural marble, soapstone or onyx. Minor
            variations in veining, colour and finish are natural characteristics of the material
            and are not considered defects.
          </p>
          <h2 className="font-display text-xl text-ink-700">Shipping</h2>
          <p>
            We deliver across India and to select international destinations. Delivery timelines
            vary by location and are shared at checkout and via order confirmation email.
          </p>
          <h2 className="font-display text-xl text-ink-700">Returns & Cancellations</h2>
          <p>
            Please contact us within 48 hours of delivery if an item arrives damaged or incorrect,
            with photos of the product and packaging, and we will arrange a replacement or refund.
            Custom/personalised and hamper orders are not eligible for return unless defective.
          </p>
          <h2 className="font-display text-xl text-ink-700">Bulk & Corporate Orders</h2>
          <p>
            Bulk pricing (10–49 units: 5% off, 50–199 units: 10% off, 200+ units: 15% off) applies
            to standard catalogue items; final pricing for customised or hamper orders is
            confirmed at the time of quotation.
          </p>
          <p className="text-sm text-ink-400">
            This is a template policy provided for launch purposes. Please have it reviewed by a
            legal professional before going live.
          </p>
        </div>
      </Container>
    </div>
  );
}
