import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/product/gallery";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductCard, type ProductCardData } from "@/components/product-card";

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { images: { take: 1 } },
  });
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription ?? product.description.slice(0, 155),
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
    },
  });

  if (!product || !product.isActive) notFound();

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, NOT: { id: product.id } },
    take: 4,
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  const relatedCards: ProductCardData[] = related.map((p) => ({
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    priceInPaise: p.priceInPaise,
    compareAtPaise: p.compareAtPaise,
    image: p.images[0]?.url ?? "/products/img-000.jpg",
    material: p.material,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: { "@type": "Brand", name: "Belamore" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.priceInPaise / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pt-28">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <div className="mb-8 flex items-center gap-2 text-sm text-ink-400">
          <Link href="/collections" className="hover:text-gold-600">Collections</Link>
          <span>/</span>
          <Link href={`/collections/${product.category.slug}`} className="hover:text-gold-600">
            {product.category.name}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery images={product.images.map((i) => i.url)} name={product.name} />

          <div>
            {product.material && (
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold-600">
                {product.material}
              </p>
            )}
            <h1 className="font-display text-3xl text-ink-700 sm:text-4xl">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-3 text-ink-500">{product.shortDescription}</p>
            )}

            <div className="mt-6">
              <AddToCart
                productId={product.id}
                slug={product.slug}
                name={product.name}
                image={product.images[0]?.url ?? "/products/img-000.jpg"}
                basePriceInPaise={product.priceInPaise}
                baseStock={product.stock}
                variants={product.variants.map((v) => ({
                  id: v.id,
                  label: v.label,
                  priceInPaise: v.priceInPaise,
                  stock: v.stock,
                }))}
              />
            </div>

            <div className="mt-10 space-y-6 border-t border-ink-600/10 pt-8">
              <div>
                <h2 className="font-display text-lg text-ink-700">Description</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{product.description}</p>
              </div>
              {product.careInstructions && (
                <div>
                  <h2 className="font-display text-lg text-ink-700">Care Instructions</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {product.careInstructions}
                  </p>
                </div>
              )}
              <div className="rounded-xl bg-beige-100/70 p-4 text-xs text-ink-500">
                Handcrafted piece — pan-India delivery, elegantly gift-boxed. Bulk / corporate
                gifting discounts available on request.
              </div>
            </div>
          </div>
        </div>

        {relatedCards.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-8 font-display text-2xl text-ink-700">You May Also Love</h2>
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
              {relatedCards.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
      <div className="h-24" />
    </div>
  );
}
