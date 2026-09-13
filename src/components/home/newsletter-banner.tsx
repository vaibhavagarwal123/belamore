import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/newsletter-form";
import { InfinityMark } from "@/components/logo";

export function NewsletterBanner() {
  return (
    <section className="bg-ink-800 py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <InfinityMark className="h-8 w-20" />
        <h2 className="font-display text-3xl text-beige-50 sm:text-4xl">
          Join the Belamore Circle
        </h2>
        <p className="max-w-md text-beige-100/80">
          New collections, festive edits, and early access to limited pieces — straight to your
          inbox.
        </p>
        <NewsletterForm light />
      </Container>
    </section>
  );
}
