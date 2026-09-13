import { db } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";
import { Hero } from "@/components/home/hero";
import { CategoryDoors } from "@/components/home/category-doors";
import { BrandStory } from "@/components/home/brand-story";
import { WhyBelamore } from "@/components/home/why-belamore";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { JournalTeaser } from "@/components/home/journal-teaser";
import { NewsletterBanner } from "@/components/home/newsletter-banner";
import type { ProductCardData } from "@/components/product-card";

export default async function HomePage() {
  const [categories, featured, testimonials, posts, content] = await Promise.all([
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true, tagline: true, heroImage: true },
    }),
    db.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
    db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
    db.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true, coverImage: true },
    }),
    getSiteContent(),
  ]);

  const featuredProducts: ProductCardData[] = featured.map((p) => ({
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    priceInPaise: p.priceInPaise,
    compareAtPaise: p.compareAtPaise,
    image: p.images[0]?.url ?? "/products/img-000.jpg",
    material: p.material,
  }));

  return (
    <>
      <Hero heading={content["home.hero.heading"]} subheading={content["home.hero.subheading"]} />
      <CategoryDoors categories={categories} />
      <BrandStory story={content["about.story"]} />
      <FeaturedProducts products={featuredProducts} />
      <WhyBelamore />
      <TestimonialsSection testimonials={testimonials} />
      <JournalTeaser posts={posts} />
      <NewsletterBanner />
    </>
  );
}
