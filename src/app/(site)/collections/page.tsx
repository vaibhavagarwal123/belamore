import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CategoryDoors } from "@/components/home/category-doors";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "All Collections",
  description: "Explore every Belamore collection — coasters, figurines, jewellery boxes, diyas, and more, all hand-carved in marble.",
};

export default async function CollectionsPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true, slug: true, tagline: true, heroImage: true },
  });

  return (
    <div className="pt-28">
      <Container className="pb-6 pt-8 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-600">The Full Palace</p>
        <h1 className="font-display text-4xl text-ink-700 sm:text-5xl">All Collections</h1>
      </Container>
      <CategoryDoors categories={categories} showHeading={false} />
    </div>
  );
}
