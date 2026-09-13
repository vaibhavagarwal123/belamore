"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { db } from "@/lib/db";
import { requireAdminOrRedirect } from "@/lib/admin-actions";
import type { ActionState } from "@/lib/admin-actions";

function slug(s: string) {
  return slugify(s, { lower: true, strict: true });
}

function parseVariants(raw: string): { label: string; price: number; stock: number }[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v) => v && v.label)
      .map((v) => ({
        label: String(v.label),
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
      }));
  } catch {
    return [];
  }
}

function parseImages(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function upsertCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const heroImage = String(formData.get("heroImage") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";

  if (!name) return { error: "Category name is required." };

  const data = { name, slug: slug(name), tagline, description, heroImage, sortOrder, isActive };

  if (id) {
    await db.category.update({ where: { id }, data });
  } else {
    await db.category.create({ data });
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { success: "Category saved." };
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const productCount = await db.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return; // silently refuse — UI already warns; avoids orphaning products
  }
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}

export async function upsertProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const price = Math.round(Number(formData.get("price") || 0) * 100);
  const compareAtRaw = formData.get("compareAt");
  const compareAt = compareAtRaw ? Math.round(Number(compareAtRaw) * 100) : null;
  const sku = String(formData.get("sku") || "").trim();
  const stock = Number(formData.get("stock") || 0);
  const material = String(formData.get("material") || "").trim();
  const shortDescription = String(formData.get("shortDescription") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const careInstructions = String(formData.get("careInstructions") || "").trim();
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";
  const images = parseImages(String(formData.get("images") || ""));
  const variants = parseVariants(String(formData.get("variantsJson") || ""));

  if (!name || !categoryId || !sku || !price) {
    return { error: "Name, category, SKU and price are required." };
  }

  const baseData = {
    name,
    slug: slug(name),
    categoryId,
    priceInPaise: price,
    compareAtPaise: compareAt,
    sku,
    stock,
    material,
    shortDescription,
    description,
    careInstructions,
    isFeatured,
    isActive,
  };

  try {
    if (id) {
      await db.product.update({ where: { id }, data: baseData });
      await db.productImage.deleteMany({ where: { productId: id } });
      await db.productVariant.deleteMany({ where: { productId: id } });
      if (images.length) {
        await db.productImage.createMany({
          data: images.map((url, i) => ({ productId: id, url, sortOrder: i, alt: name })),
        });
      }
      if (variants.length) {
        await db.productVariant.createMany({
          data: variants.map((v, i) => ({
            productId: id,
            label: v.label,
            priceInPaise: Math.round(v.price * 100),
            stock: v.stock,
            sku: `${sku}-V${i + 1}`,
          })),
        });
      }
    } else {
      await db.product.create({
        data: {
          ...baseData,
          images: { create: images.map((url, i) => ({ url, sortOrder: i, alt: name })) },
          variants: {
            create: variants.map((v, i) => ({
              label: v.label,
              priceInPaise: Math.round(v.price * 100),
              stock: v.stock,
              sku: `${sku}-V${i + 1}`,
            })),
          },
        },
      });
    }
  } catch (e) {
    return { error: `Could not save product — check the SKU is unique. (${(e as Error).message})` };
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}
