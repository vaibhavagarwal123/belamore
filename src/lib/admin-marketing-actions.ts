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

export async function upsertDiscountAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const type = String(formData.get("type") || "PERCENTAGE");
  const value = Number(formData.get("value") || 0);
  const minOrder = Math.round(Number(formData.get("minOrder") || 0) * 100);
  const usageLimitRaw = formData.get("usageLimit");
  const usageLimit = usageLimitRaw ? Number(usageLimitRaw) : null;
  const expiresAtRaw = String(formData.get("expiresAt") || "");
  const isActive = formData.get("isActive") === "on";

  if (!code || !value) return { error: "Code and value are required." };

  const data = {
    code,
    type,
    value,
    minOrderPaise: minOrder,
    usageLimit,
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    isActive,
  };

  try {
    if (id) {
      await db.discountCode.update({ where: { id }, data });
    } else {
      await db.discountCode.create({ data });
    }
  } catch {
    return { error: "Could not save — that code may already exist." };
  }

  revalidatePath("/admin/discounts");
  return { success: "Discount saved." };
}

export async function deleteDiscountAction(formData: FormData) {
  await requireAdminOrRedirect();
  await db.discountCode.delete({ where: { id: String(formData.get("id") || "") } });
  revalidatePath("/admin/discounts");
}

export async function upsertBlogPostAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !excerpt || !content) return { error: "Title, excerpt and content are required." };

  const data = { title, slug: slug(title), excerpt, content, coverImage, isPublished };

  if (id) {
    await db.blogPost.update({ where: { id }, data });
  } else {
    await db.blogPost.create({ data });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdminOrRedirect();
  await db.blogPost.delete({ where: { id: String(formData.get("id") || "") } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function upsertTestimonialAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const authorName = String(formData.get("authorName") || "").trim();
  const authorRole = String(formData.get("authorRole") || "").trim();
  const quote = String(formData.get("quote") || "").trim();
  const rating = Number(formData.get("rating") || 5);
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";

  if (!authorName || !quote) return { error: "Name and quote are required." };

  const data = { authorName, authorRole, quote, rating, sortOrder, isActive };

  if (id) {
    await db.testimonial.update({ where: { id }, data });
  } else {
    await db.testimonial.create({ data });
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/", "layout");
  return { success: "Testimonial saved." };
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdminOrRedirect();
  await db.testimonial.delete({ where: { id: String(formData.get("id") || "") } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "layout");
}

export async function updateSiteContentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminOrRedirect();
  const entries = Array.from(formData.entries()).filter(([key]) => key.startsWith("content."));

  for (const [key, value] of entries) {
    const contentKey = key.replace("content.", "");
    await db.siteContent.upsert({
      where: { key: contentKey },
      create: { key: contentKey, value: String(value) },
      update: { value: String(value) },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  return { success: "Site content updated." };
}
