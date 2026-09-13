"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BelamoreLogo } from "@/components/logo";
import { useCartStore, cartCount } from "@/lib/cart-store";

export type NavCategory = { name: string; slug: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, setOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 z-30 w-full transition-all duration-500 ${
        transparent ? "bg-transparent py-6" : "bg-beige-50/90 backdrop-blur-md shadow-sm py-3"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/">
          <BelamoreLogo
            className="h-8"
            textClassName={transparent ? "text-beige-50" : "text-ink-700"}
          />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {[
            { href: "/collections", label: "Shop All" },
            { href: "/about", label: "About" },
            { href: "/blog", label: "Journal" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-sm tracking-wide transition-colors ${
                transparent ? "text-beige-50/90 hover:text-gold-200" : "text-ink-600 hover:text-gold-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/account"
            className={`hidden text-sm sm:block ${
              transparent ? "text-beige-50/90 hover:text-gold-200" : "text-ink-600 hover:text-gold-600"
            }`}
          >
            Account
          </Link>
          <button
            onClick={() => setOpen(true)}
            className={`relative text-sm ${
              transparent ? "text-beige-50" : "text-ink-700"
            }`}
            aria-label="Open cart"
          >
            Bag
            {mounted && cartCount(items) > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] text-white">
                {cartCount(items)}
              </span>
            )}
          </button>
          <button
            className={`xl:hidden ${transparent ? "text-beige-50" : "text-ink-700"}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mt-4 border-t border-ink-600/10 bg-beige-50 px-5 py-4 xl:hidden">
          <nav className="flex flex-col gap-3">
            {categories.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="text-ink-600">
                {c.name}
              </Link>
            ))}
            <Link href="/about" className="text-ink-600">About</Link>
            <Link href="/blog" className="text-ink-600">Journal</Link>
            <Link href="/contact" className="text-ink-600">Contact</Link>
            <Link href="/account" className="text-ink-600">Account</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
