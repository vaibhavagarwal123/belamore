import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { ProductCard, type ProductCardData } from "@/components/product-card";

export async function generateStaticParams() {
  const categories = await db.category.findMany({ select: { slug: true } });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await db.category.findUnique({ where: { slug: params.slug } });
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? category.tagline ?? undefined,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isActive: true },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });

  if (!category || !category.isActive) notFound();

  const products: ProductCardData[] = category.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    priceInPaise: p.priceInPaise,
    compareAtPaise: p.compareAtPaise,
    image: p.images[0]?.url ?? "/products/img-000.jpg",
    material: p.material,
  }));

  return (
    <div>
      <div className="relative flex h-[46vh] min-h-[340px] items-end overflow-hidden bg-ink-800">
        {category.heroImage && (
          <Image
            src={category.heroImage}
            alt={category.name}
            fill
            priority
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800/90 via-ink-800/30 to-ink-800/10" />
        <Container className="relative z-10 pb-10 pt-28">
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-gold-200">Now Entering</p>
          <h1 className="font-display text-4xl text-beige-50 sm:text-5xl">{category.name}</h1>
          {category.tagline && (
            <p className="mt-3 max-w-xl text-beige-100/90">{category.tagline}</p>
          )}
        </Container>
      </div>

      <Container className="py-16">
        {category.description && (
          <p className="mx-auto mb-14 max-w-2xl text-center text-ink-500">{category.description}</p>
        )}
        {products.length === 0 ? (
          <p className="text-center text-ink-400">
            New pieces are being hand-finished for this room — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
