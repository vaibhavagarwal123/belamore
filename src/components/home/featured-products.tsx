"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section className="bg-beige-100/60 py-24">
      <Container>
        <SectionHeading
          eyebrow="Recently Discovered"
          title="Treasures Worth Pausing For"
          subtitle="A hand-picked edit of Belamore's most-loved pieces this season."
        />
        <div className="mt-14 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button href="/collections" variant="outline">
            View All Collections
          </Button>
        </div>
      </Container>
    </section>
  );
}
