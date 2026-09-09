'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostDialog({ open, onClose, templateId = null, templateName = null }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

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

  if (!open) return null;

  const slug = title.trim() ? generateSlug(title.trim()) : '';

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-[#171613]/40 backdrop-blur-[6px] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={`relative w-full max-w-[520px] mx-4 transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.97] opacity-0'}`}
      >
        {/* Card */}
        <div className="bg-[#FDFCF9] rounded-[28px] shadow-[0_24px_80px_rgba(23,22,19,0.2),0_0_1px_rgba(23,22,19,0.1)] overflow-hidden border border-[#E2DFD5]/60">

          {/* Top accent strip */}
          <div className="h-[3px] bg-[#2C4035]" />

          {/* Header */}
          <div className="px-8 pt-8 pb-2 flex items-start justify-between">
            <div>
              <h2 className="text-[22px] font-serif text-[#171613] tracking-tight leading-tight">
                {templateId ? 'Name your post' : 'Create a new post'}
              </h2>
              {templateId && templateName && (
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8DC4AC]" />
                  <span className="text-[13px] text-[#8A8375] font-medium">
                    Using <span className="text-[#2C4035] font-semibold">{templateName}</span> template
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#EFEBE1] flex items-center justify-center text-[#8A8375] hover:text-[#171613] transition-colors -mr-1 -mt-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-8 pt-4 pb-2">
            {/* Title Input */}
            <div className="mb-1">
              <label className="block text-[11px] font-bold text-[#8A8375] uppercase tracking-[0.08em] mb-2.5">
                Post title
              </label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. How to maximise your credit card rewards"
                className="w-full px-4 py-3.5 text-[16px] text-[#171613] bg-white border border-[#D6CFBF] rounded-2xl focus:outline-none focus:border-[#2C4035] focus:ring-2 focus:ring-[#2C4035]/10 transition-all placeholder:text-[#C4BFB0] font-serif"
                autoComplete="off"
                disabled={isCreating}
              />
            </div>

            {/* Live slug preview */}
            <div className={`mt-3 flex items-center gap-1.5 transition-all duration-200 ${slug ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
              <svg className="w-3 h-3 text-[#8DC4AC] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-[12px] text-[#8A8375] font-mono truncate">
                /blog/<span className="text-[#2C4035] font-medium">{slug}</span>
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pt-5 pb-7 flex items-center justify-between">
            <button
              onClick={onClose}
              disabled={isCreating}
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#6B6658] hover:text-[#171613] hover:bg-[#EFEBE1] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="group relative bg-[#171613] text-[#F5F2EA] px-7 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#2C4035] transition-all duration-200 flex items-center gap-2.5 disabled:opacity-60 shadow-[0_2px_8px_rgba(23,22,19,0.15)] hover:shadow-[0_4px_16px_rgba(44,64,53,0.25)]"
            >
              {isCreating ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-[#F5F2EA]/30 border-t-[#F5F2EA] animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {templateId ? 'Create post' : 'Create draft'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
