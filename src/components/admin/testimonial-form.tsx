"use client";

import { useFormState } from "react-dom";
import { upsertTestimonialAction } from "@/lib/admin-marketing-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function TestimonialForm({
  testimonial,
  onDone,
}: {
  testimonial?: {
    id: string;
    authorName: string;
    authorRole: string | null;
    quote: string;
    rating: number;
    sortOrder: number;
    isActive: boolean;
  };
  onDone?: () => void;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(upsertTestimonialAction, null);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-ink-600/10 bg-white p-5">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
      <div className="grid grid-cols-2 gap-3">
        <input name="authorName" required defaultValue={testimonial?.authorName} placeholder="Name" className="input" />
        <input name="authorRole" defaultValue={testimonial?.authorRole ?? ""} placeholder="Role / context" className="input" />
      </div>
      <textarea name="quote" required rows={3} defaultValue={testimonial?.quote} placeholder="Quote" className="input" />
      <div className="grid grid-cols-2 gap-3">
        <input name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? 5} className="input" />
        <input name="sortOrder" type="number" defaultValue={testimonial?.sortOrder ?? 0} placeholder="Sort order" className="input" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input type="checkbox" name="isActive" defaultChecked={testimonial?.isActive ?? true} /> Active
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-3">
        <SubmitButton>{testimonial ? "Save" : "Add Testimonial"}</SubmitButton>
        {onDone && <button type="button" onClick={onDone} className="text-sm text-ink-400 hover:underline">Cancel</button>}
      </div>
    </form>
  );
}
