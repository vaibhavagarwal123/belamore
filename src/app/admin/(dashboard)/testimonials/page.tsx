import { db } from "@/lib/db";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Testimonials</h1>
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
