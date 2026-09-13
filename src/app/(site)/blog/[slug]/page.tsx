import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.isPublished) notFound();

  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-3xl">
        <p className="text-xs text-ink-400">
          {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink-700 sm:text-5xl">{post.title}</h1>
        {post.coverImage && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-soft">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="mt-10 max-w-none text-ink-600">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="mb-5 leading-relaxed">{para}</p>
          ))}
        </div>
      </Container>
    </div>
  );
}
