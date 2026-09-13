import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await db.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Edit Journal Post</h1>
      <BlogForm post={post} />
    </div>
  );
}
