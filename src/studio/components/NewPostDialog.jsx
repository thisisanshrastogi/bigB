'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BaseDialog } from '@/ui/Dialog';

export default function NewPostDialog({ open, onClose, templateId = null, templateName = null }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus the input
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setTitle('');
        setIsCreating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      || `untitled-${Date.now()}`;
  };

  const handleCreate = useCallback(async () => {
    if (isCreating) return;
    const finalTitle = title.trim() || 'Untitled Post';
    setIsCreating(true);

    try {
      const body = {
        title: finalTitle,
        slug: generateSlug(finalTitle),
      };

      if (templateId) {
        // Navigate to the template route which handles server-side creation
        const slug = generateSlug(finalTitle);
        const params = new URLSearchParams({
          template: templateId,
          title: finalTitle,
          slug: slug,
        });
        router.push(`/studio/posts/new?${params.toString()}`);
      } else {
        // Create via API for blank posts
        const res = await fetch('/api/studio/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to create post');
        const newPost = await res.json();
        router.push(`/studio/posts/${newPost.id}`);
      }
    } catch (e) {
      console.error(e);
      setIsCreating(false);
    }
  }, [title, templateId, router, isCreating]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  const slug = title.trim() ? generateSlug(title.trim()) : '';

  return (
    <BaseDialog open={open} onClose={onClose}>
      <h3 className="text-[18px] font-bold text-ink mb-1">
        {templateId ? 'Name your post' : 'Create a new post'}
      </h3>
      
      {templateId && templateName ? (
        <p className="text-[13px] text-muted-soft mb-6">
          Using the <span className="font-semibold text-ink">{templateName}</span> template
        </p>
      ) : (
        <p className="text-[13px] text-muted-soft mb-6">
          Give your new post a title to get started.
        </p>
      )}

      <div className="mb-6">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Post title"
          className="w-full px-4 py-2.5 text-[14px] text-ink bg-surface border border-border-strong rounded-xl focus:outline-none focus:border-ink transition-colors placeholder:text-muted-soft"
          autoComplete="off"
          disabled={isCreating}
        />
        <div className="mt-2 flex items-center gap-1.5 min-h-[16px]">
          {slug && (
            <span className="text-[12px] text-muted-soft font-mono truncate">
              /blog/<span className="text-ink font-medium">{slug}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-2">
        <button
          onClick={onClose}
          disabled={isCreating}
          className="px-5 py-2 rounded-full border border-border-strong text-[13px] font-semibold text-ink hover:bg-surface-sunken disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="px-5 py-2 rounded-full text-[13px] font-semibold text-surface bg-ink hover:bg-ink/90 flex items-center gap-2 disabled:opacity-50 transition-colors"
        >
          {isCreating ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-surface/30 border-t-surface animate-spin" />
              Creating...
            </>
          ) : (
            templateId ? 'Create from Template' : 'Create Post'
          )}
        </button>
      </div>
    </BaseDialog>
  );
}
