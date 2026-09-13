"use client";

import { useFormState } from "react-dom";
import { updateSiteContentAction } from "@/lib/admin-marketing-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

const FIELDS: { key: string; label: string; type: "input" | "textarea" }[] = [
  { key: "home.hero.heading", label: "Homepage Hero Heading", type: "input" },
  { key: "home.hero.subheading", label: "Homepage Hero Subheading", type: "textarea" },
  { key: "about.story", label: "About Page — Our Story", type: "textarea" },
  { key: "contact.phone", label: "Contact Phone", type: "input" },
  { key: "contact.email", label: "Contact Email", type: "input" },
  { key: "contact.address", label: "Contact Address", type: "input" },
  { key: "contact.instagram", label: "Instagram URL", type: "input" },
];

export function ContentForm({ content }: { content: Record<string, string> }) {
  const [state, formAction] = useFormState<ActionState, FormData>(updateSiteContentAction, null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-sm font-medium text-ink-700">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea name={`content.${field.key}`} rows={3} defaultValue={content[field.key] ?? ""} className="input" />
          ) : (
            <input name={`content.${field.key}`} defaultValue={content[field.key] ?? ""} className="input" />
          )}
        </div>
      ))}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-600">{state.success}</p>}
      <SubmitButton>Save Content</SubmitButton>
    </form>
  );
}
