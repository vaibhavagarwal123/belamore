import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export type BlogTeaser = { slug: string; title: string; excerpt: string; coverImage: string | null };

export function JournalTeaser({ posts }: { posts: BlogTeaser[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="bg-beige-100/60 py-24">
      <Container>
        <SectionHeading eyebrow="From the Journal" title="Stories from the Workshop" />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
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
              <h3 className="mt-4 font-display text-lg text-ink-700 group-hover:text-gold-600">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-ink-500 line-clamp-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
