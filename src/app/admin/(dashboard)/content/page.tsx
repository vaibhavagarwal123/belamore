import { getSiteContent } from "@/lib/site-content";
import { ContentForm } from "@/components/admin/content-form";

export default async function AdminContentPage() {
  const content = await getSiteContent();
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-ink-700">Site Content</h1>
      <p className="mb-8 text-sm text-ink-500">
        Edit key text across the storefront without touching any code.
      </p>
      <ContentForm content={content} />
    </div>
  );
}
