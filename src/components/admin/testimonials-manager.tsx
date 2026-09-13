"use client";

import { useState } from "react";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { deleteTestimonialAction } from "@/lib/admin-marketing-actions";

type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  rating: number;
  sortOrder: number;
  isActive: boolean;
};

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setCreating((v) => !v)} className="rounded-full bg-gold-500 px-5 py-2.5 text-sm text-white hover:bg-gold-600">
          {creating ? "Close" : "+ Add Testimonial"}
        </button>
      </div>
      {creating && <TestimonialForm onDone={() => setCreating(false)} />}
      {testimonials.map((t) =>
        editing === t.id ? (
          <TestimonialForm key={t.id} testimonial={t} onDone={() => setEditing(null)} />
        ) : (
          <div key={t.id} className="flex items-center justify-between rounded-2xl border border-ink-600/10 bg-white p-5">
            <div>
              <p className="font-display text-ink-700">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-1 text-sm text-ink-500">
                {t.authorName}{t.authorRole ? ` — ${t.authorRole}` : ""} · {t.isActive ? "Active" : "Hidden"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 pl-4">
              <button onClick={() => setEditing(t.id)} className="text-sm text-gold-600 hover:underline">Edit</button>
              <form action={deleteTestimonialAction}>
                <input type="hidden" name="id" value={t.id} />
                <button className="text-sm text-blush-300 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
