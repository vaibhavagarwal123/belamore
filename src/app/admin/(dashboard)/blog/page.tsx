import Link from "next/link";
import { db } from "@/lib/db";
import { deleteBlogPostAction } from "@/lib/admin-marketing-actions";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink-700">Journal Posts</h1>
        <Link href="/admin/blog/new" className="rounded-full bg-gold-500 px-5 py-2.5 text-sm text-white hover:bg-gold-600">
          + New Post
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-2xl border border-ink-600/10 bg-white p-5">
            <div>
              <p className="font-display text-lg text-ink-700">{post.title}</p>
              <p className="text-xs text-ink-400">{post.isPublished ? "Published" : "Draft"}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/blog/${post.id}`} className="text-sm text-gold-600 hover:underline">Edit</Link>
              <form action={deleteBlogPostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button className="text-sm text-blush-300 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
