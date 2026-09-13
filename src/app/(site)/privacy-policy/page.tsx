import { Container } from "@/components/ui/container";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-ink-700">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-400">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="mt-10 space-y-6 leading-relaxed text-ink-600">
          <p>
            Belamore (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy.
            This policy explains what information we collect when you use belamoregifts.com, and
            how we use it.
          </p>
          <h2 className="font-display text-xl text-ink-700">Information We Collect</h2>
          <p>
            When you browse our site, place an order, create an account, or contact us, we may
            collect your name, email address, phone number, shipping address, and order details.
            We do not store your payment card details — these are processed securely by our
            payment partners (Razorpay, Stripe) and never touch our servers.
          </p>
          <h2 className="font-display text-xl text-ink-700">How We Use Your Information</h2>
          <p>
            We use your information to process and deliver orders, respond to enquiries, send
            order updates, and — only if you opt in — send newsletters and promotional offers.
            You can unsubscribe from marketing emails at any time.
          </p>
          <h2 className="font-display text-xl text-ink-700">Sharing of Information</h2>
          <p>
            We share information with trusted third parties only as needed to fulfil your order:
            payment processors, shipping/courier partners, and email/analytics providers. We never
            sell your personal information.
          </p>
          <h2 className="font-display text-xl text-ink-700">Cookies</h2>
          <p>
            We use cookies to keep you signed in, remember your shopping bag, and understand site
            usage through analytics tools such as Google Analytics.
          </p>
          <h2 className="font-display text-xl text-ink-700">Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any
            time by contacting us at the email address listed on our Contact page.
          </p>
          <p className="text-sm text-ink-400">
            This is a template policy provided for launch purposes. Please have it reviewed by a
            legal professional before going live, particularly if you sell internationally
            (GDPR, CCPA, etc. may apply).
          </p>
        </div>
      </Container>
    </div>
  );
}
