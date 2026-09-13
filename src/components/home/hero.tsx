"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { InfinityMark } from "@/components/logo";

export function Hero({ heading, subheading }: { heading: string; subheading: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-ink-800">
      <motion.div style={{ scale }} className="absolute inset-0">
        <div className="marble-surface absolute inset-0 opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-800/70 via-ink-700/30 to-beige-50" />
        {/* Faux marble columns framing the gate */}
        <div className="absolute inset-y-0 left-0 hidden w-[12%] bg-gradient-to-r from-ink-800/60 to-transparent md:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[12%] bg-gradient-to-l from-ink-800/60 to-transparent md:block" />
      </motion.div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-6 h-10 w-24 animate-floatSlow md:h-14 md:w-32"
        >
          <InfinityMark className="h-full w-full" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-4 text-xs uppercase tracking-[0.5em] text-gold-100"
        >
          Belamore &middot; Infinite Beautiful Love
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-4xl font-display text-4xl leading-[1.15] text-beige-50 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-beige-100/90 md:text-lg"
        >
          {subheading}
        </motion.p>

        <motion.a
          href="#doors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-gold-100/40 px-8 py-3.5 text-sm uppercase tracking-[0.25em] text-beige-50 transition-all hover:border-gold-300 hover:bg-gold-300/10"
        >
          Enter the Palace
          <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-beige-100/60"
      >
        Scroll to Discover
      </motion.div>
    </section>
  );
}
