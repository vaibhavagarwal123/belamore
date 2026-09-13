"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export type DoorCategory = {
  name: string;
  slug: string;
  tagline: string | null;
  heroImage: string | null;
};

export function CategoryDoors({
  categories,
  showHeading = true,
}: {
  categories: DoorCategory[];
  showHeading?: boolean;
}) {
  return (
    <section id="doors" className="marble-surface relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {showHeading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-600">The Palace Awaits</p>
            <h2 className="font-display text-3xl text-ink-700 sm:text-4xl md:text-5xl">
              Choose a Door, Enter a World
            </h2>
            <p className="mt-4 text-ink-500">
              Every collection lives behind its own door. Push one open to wander its room, at your
              own pace.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
            >
              <Link href={`/collections/${cat.slug}`} className="door-card group block">
                <div className="perspective">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-[8rem] rounded-b-xl shadow-soft transition-shadow duration-500 group-hover:shadow-pedestal">
                    {/* Room image revealed behind the doors */}
                    {cat.heroImage && (
                      <Image
                        src={cat.heroImage}
                        alt={cat.name}
                        fill
                        sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-ink-800/25" />

                    {/* Left door panel */}
                    <div
                      className="door-panel-left preserve-3d backface-hidden absolute inset-y-0 left-0 w-1/2 origin-left bg-gradient-to-br from-ink-600 via-ink-700 to-ink-800"
                    >
                      <div className="absolute inset-3 rounded-tl-[6rem] border border-gold-300/40" />
                      <div className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_8px_2px_rgba(217,178,91,0.6)]" />
                    </div>
                    {/* Right door panel */}
                    <div
                      className="door-panel-right preserve-3d backface-hidden absolute inset-y-0 right-0 w-1/2 origin-right bg-gradient-to-bl from-ink-600 via-ink-700 to-ink-800"
                    >
                      <div className="absolute inset-3 rounded-tr-[6rem] border border-gold-300/40" />
                      <div className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_8px_2px_rgba(217,178,91,0.6)]" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-gradient-to-t from-ink-800/80 to-transparent px-4 pb-5 pt-10 text-center">
                      <h3 className="font-display text-base text-beige-50 sm:text-lg">{cat.name}</h3>
                      {cat.tagline && (
                        <p className="hidden text-xs text-beige-100/80 sm:block">{cat.tagline}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
