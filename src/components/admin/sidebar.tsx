"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { BelamoreLogo } from "@/components/logo";
import { logoutAdminAction } from "@/lib/admin-actions";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/discounts", label: "Discounts & Offers" },
  { href: "/admin/gift-cards", label: "Gift Cards" },
  { href: "/admin/blog", label: "Journal Posts" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 border-r border-ink-600/10 bg-beige-50 p-6">
      <BelamoreLogo className="mb-8" textClassName="text-lg" />
      <nav className="space-y-1">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-gold-100 text-ink-700" : "text-ink-500 hover:bg-beige-100",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-10 border-t border-ink-600/10 pt-4">
        <p className="mb-2 text-xs text-ink-400">Signed in as</p>
        <p className="mb-3 text-sm text-ink-700">{adminName}</p>
        <form action={logoutAdminAction}>
          <button className="text-xs text-ink-400 underline hover:text-blush-300">Sign out</button>
        </form>
      </div>
      <div className="mt-6">
        <Link href="/" className="text-xs text-ink-400 hover:text-gold-600">
          ← Back to storefront
        </Link>
      </div>
    </aside>
  );
}
