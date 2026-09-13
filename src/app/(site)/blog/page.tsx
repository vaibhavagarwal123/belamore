import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Journal",
  description: "Stories from the Belamore workshop — artisans, marble care guides, and gifting ideas.",
};

export default async function BlogIndexPage() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-600">The Journal</p>
          <h1 className="font-display text-4xl text-ink-700 sm:text-5xl">Stories from the Workshop</h1>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h2 className="mt-1 font-display text-xl text-ink-700 group-hover:text-gold-600">{post.title}</h2>
              <p className="mt-2 text-sm text-ink-500 line-clamp-3">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
