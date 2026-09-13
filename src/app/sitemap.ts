import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [categories, products, posts] = await Promise.all([
    db.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = ["", "/collections", "/about", "/contact", "/blog", "/privacy-policy", "/terms-of-service"].map(
    (route) => ({ url: `${siteUrl}${route}`, lastModified: new Date() }),
  );

  const categoryRoutes = categories.map((c) => ({
    url: `${siteUrl}/collections/${c.slug}`,
    lastModified: c.updatedAt,
  }));
  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
  }));
  const blogRoutes = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
