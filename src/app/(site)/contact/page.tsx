import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Belamore for orders, corporate gifting enquiries, or general questions.",
};

export default async function ContactPage() {
  const content = await getSiteContent();
  return (
    <div className="pt-32 pb-24">
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-600">Get in Touch</p>
          <h1 className="font-display text-4xl text-ink-700 sm:text-5xl">We&rsquo;d Love to Hear From You</h1>
          <p className="mt-5 max-w-md text-ink-500">
            Whether it&rsquo;s a corporate gifting enquiry, a custom hamper, or a question about an
            order — reach out and our team will respond promptly.
          </p>

          <div className="mt-10 space-y-3 text-ink-600">
            <p><strong>Phone:</strong> {content["contact.phone"]}</p>
            <p><strong>Email:</strong> {content["contact.email"]}</p>
            <p><strong>Address:</strong> {content["contact.address"]}</p>
            <p>
              <strong>Instagram:</strong>{" "}
              <a href={content["contact.instagram"]} target="_blank" rel="noreferrer" className="text-gold-600 hover:underline">
                @BelamoreGifts
              </a>
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-beige-100/60 p-8">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
