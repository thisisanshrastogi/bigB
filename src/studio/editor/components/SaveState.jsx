"use client";
import { useEditor } from '@/studio/EditorProvider';

export default function SaveState() {
  const { isDirty, isSaving, post } = useEditor();

  if (isSaving) {
    return <span className="text-sm text-muted">Saving…</span>;
  }

  if (isDirty) {
    return <span className="text-sm text-warn-ink font-medium">Unsaved changes</span>;
  }

  if (!post?.updatedAt) return null;

  return (
    <span className="text-sm text-muted">
      Saved {new Date(post.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}
