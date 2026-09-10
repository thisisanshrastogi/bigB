'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { createPortal } from 'react-dom';

export default function NewPostDialog({ open, onClose, templateId = null, templateName = null }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate in
  useEffect(() => {
    if (open) {
      // Small delay for mount → animate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      // Auto-focus the input
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setIsVisible(false);
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

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

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

  if (!open || !mounted) return null;

  const slug = title.trim() ? generateSlug(title.trim()) : '';

  return createPortal(
    <div
      className={`fixed inset-0 bg-ink/50 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        className={`bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl transition-all duration-200 ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
      >
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

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-5 py-2 rounded-full border border-border-strong text-[13px] font-semibold text-ink hover:bg-surface-sunken disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-5 py-2 rounded-full text-[13px] font-semibold text-surface bg-ink hover:bg-ink/90 flex items-center gap-2 disabled:opacity-50"
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
      </div>
    </div>,
    document.body
  );
}
