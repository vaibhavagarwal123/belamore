import Link from "next/link";
import { BelamoreLogo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { Container } from "@/components/ui/container";
import type { NavCategory } from "@/components/header";

export function Footer({
  categories,
  phone,
  email,
  instagram,
}: {
  categories: NavCategory[];
  phone: string;
  email: string;
  instagram: string;
}) {
  return (
    <footer className="marble-surface-dark mt-24 border-t border-ink-600/10">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <BelamoreLogo tagline />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              Sustainable, handcrafted marble gifts from artisan families whose lineage traces
              back to the creators of the Taj Mahal.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-ink-700">Shop</h4>
            <ul className="mt-4 space-y-2">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} className="text-sm text-ink-500 hover:text-gold-600">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-ink-700">Company</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-ink-500 hover:text-gold-600">About Us</Link></li>
              <li><Link href="/blog" className="text-sm text-ink-500 hover:text-gold-600">Journal</Link></li>
              <li><Link href="/contact" className="text-sm text-ink-500 hover:text-gold-600">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-ink-500 hover:text-gold-600">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-ink-500 hover:text-gold-600">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-ink-700">Stay in Touch</h4>
            <div className="mt-4 space-y-1.5 text-sm text-ink-500">
              <p>{phone}</p>
              <p>{email}</p>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="block hover:text-gold-600"
              >
                @BelamoreGifts
              </a>
            </div>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ink-600/10 pt-6 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Belamore. All rights reserved.</p>
          <p>Handcrafted in India · Pan-India & International Delivery</p>
        </div>
      </Container>
    </footer>
  );
}
