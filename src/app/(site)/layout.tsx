import { db } from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { Analytics } from "@/components/analytics";
import { getSiteContent } from "@/lib/site-content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categories, content] = await Promise.all([
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true },
    }),
    getSiteContent(),
  ]);

  return (
    <>
      <Header categories={categories} />
      <main className="min-h-screen">{children}</main>
      <Footer
        categories={categories}
        phone={content["contact.phone"]}
        email={content["contact.email"]}
        instagram={content["contact.instagram"]}
      />
      <CartDrawer />
      <Analytics />
    </>
  );
}
