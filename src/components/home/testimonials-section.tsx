"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export type TestimonialData = {
  id: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  rating: number;
};

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialData[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section className="marble-surface py-24">
      <Container>
        <SectionHeading
          eyebrow="Social Proof"
          title="Loved by Gifters & Corporates Alike"
        />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-2xl bg-white/70 p-8 shadow-soft"
            >
              <div className="mb-4 text-gold-500">{"★".repeat(t.rating)}</div>
              <p className="font-display text-lg leading-relaxed text-ink-700">“{t.quote}”</p>
              <footer className="mt-5 text-sm text-ink-500">
                <span className="font-medium text-ink-600">{t.authorName}</span>
                {t.authorRole && <span> — {t.authorRole}</span>}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
