"use client";

import { useFormState } from "react-dom";
import { upsertBlogPostAction } from "@/lib/admin-marketing-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function BlogForm({
  post,
}: {
  post?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    isPublished: boolean;
  };
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(upsertBlogPostAction, null);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input name="title" required defaultValue={post?.title} placeholder="Post title" className="input" />
      <textarea name="excerpt" required rows={2} defaultValue={post?.excerpt} placeholder="Short excerpt" className="input" />
      <textarea name="content" required rows={10} defaultValue={post?.content} placeholder="Full content (separate paragraphs with a blank line)" className="input" />
      <input name="coverImage" defaultValue={post?.coverImage ?? ""} placeholder="Cover image URL" className="input" />
      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input type="checkbox" name="isPublished" defaultChecked={post?.isPublished ?? true} /> Published
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>{post ? "Save Post" : "Publish Post"}</SubmitButton>
    </form>
  );
}
