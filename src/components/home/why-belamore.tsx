"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const POINTS = [
  {
    title: "Affordable Premium",
    desc: "Museum-quality marble craftsmanship, priced for everyday gifting moments.",
  },
  {
    title: "Handcrafted in India",
    desc: "Every piece is carved and finished by artisan families, not machines.",
  },
  {
    title: "Legacy of the Taj Mahal",
    desc: "Our artisans trace their craft directly back to the builders of the Taj Mahal.",
  },
  {
    title: "Elegant Packaging",
    desc: "Gift-ready presentation with pan-India and international delivery.",
  },
];

export function WhyBelamore() {
  return (
    <section className="bg-beige-50 py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-600">Why Belamore</p>
          <h2 className="font-display text-3xl text-ink-700 sm:text-4xl">
            A Refined Way to Leave a Lasting Impression
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-ink-600/10 bg-white/60 p-7 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-gold-300 text-gold-600 flex items-center justify-center font-display text-lg">
                {i + 1}
              </div>
              <h3 className="font-display text-lg text-ink-700">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
