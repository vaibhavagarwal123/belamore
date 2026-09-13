import Image from "next/image";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { InfinityMark } from "@/components/logo";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { db } from "@/lib/db";

export const metadata = {
  title: "About Us",
  description: "The story behind Belamore — sustainable, handcrafted marble gifts rooted in a lineage that traces back to the artisans of the Taj Mahal.",
};

export default async function AboutPage() {
  const [content, testimonials] = await Promise.all([
    getSiteContent(),
    db.testimonial.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
  ]);

  return (
    <div className="pt-28">
      <div className="marble-surface py-24 text-center">
        <Container>
          <InfinityMark className="mx-auto mb-6 h-9 w-24" />
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-600">Our Story</p>
          <h1 className="mx-auto max-w-3xl font-display text-4xl text-ink-700 sm:text-5xl">
            Infinite, Beautiful Love — Carved by Hand
          </h1>
        </Container>
      </div>

      <Container className="py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-ink-600">
          <p>{content["about.story"]}</p>
          <p>
            We specialize in crafting unique marble gifting products that embody sustainability
            and elegance. These gifts reflect our commitment to eco-consciousness — we focus on
            creating meaningful solutions that minimise environmental impact while delivering
            timeless value.
          </p>
          <p>
            Each Belamore gift is thoughtfully designed and intricately crafted by artisans whose
            families have perfected this art over generations, proudly tracing their lineage back
            to the creators of the iconic Taj Mahal. When you hold a piece of Belamore, you are
            holding a small part of that living history.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
            <Image src="/products/img-063.jpg" alt="Belamore artisan craftsmanship" fill className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
            <Image src="/products/img-004.jpg" alt="Belamore gift packaging" fill className="object-cover" />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-beige-100/60 p-8 text-center">
          <h2 className="font-display text-2xl text-ink-700">Why Choose Belamore</h2>
          <ul className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-3 text-left text-ink-600 sm:grid-cols-2">
            <li>✦ Affordable premium quality</li>
            <li>✦ Handcrafted in India</li>
            <li>✦ Customisable (name, logo, message)</li>
            <li>✦ Elegant packaging</li>
            <li>✦ Pan-India & international delivery</li>
            <li>✦ A refined, lasting impression</li>
          </ul>
        </div>
      </Container>

      <TestimonialsSection
        testimonials={testimonials.map((t) => ({
          id: t.id,
          authorName: t.authorName,
          authorRole: t.authorRole,
          quote: t.quote,
          rating: t.rating,
        }))}
      />
    </div>
  );
}
