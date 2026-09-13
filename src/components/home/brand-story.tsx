"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function BrandStory({ story }: { story: string }) {
  return (
    <section className="bg-beige-50 py-24">
      <Container className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-pedestal"
        >
          <Image src="/products/img-004.jpg" alt="Belamore gift packaging" fill className="object-cover" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-600">Our Story</p>
          <h2 className="font-display text-3xl text-ink-700 sm:text-4xl">
            Bel + Amore — Beautiful Love, Made to Last
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-500">{story}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Represented by the infinity symbol, our brand celebrates eternal bonds, enduring
            friendships, and timeless connections — a philosophy of doing good while doing
            business, one sustainably sourced, hand-finished piece at a time.
          </p>
          <div className="mt-8">
            <Button href="/about" variant="outline">
              Read Our Full Story
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
