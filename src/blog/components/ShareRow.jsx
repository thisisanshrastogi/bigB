"use client";
import { useState } from 'react';

export default function ShareRow({ title = '', url = '' }) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const [copied, setCopied] = useState(false);

  const share = async (platform) => {
    if (platform === 'copy') {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.share && platform === 'native') {
      try {
        await navigator.share({
          title,
          url: shareUrl
        });
        return;
      } catch (e) {
        // Fallback if native share fails or is aborted
      }
    }

    const text = `${title} — `;
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };
    
    if (links[platform]) {
      window.open(links[platform], '_blank', 'noopener,noreferrer,width=600,height=480');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-muted">Share</span>
      <div className="flex items-center gap-2">
        {/* X / Twitter */}
        <button
          onClick={() => share('twitter')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border bg-white text-[13px] font-semibold text-ink hover:border-ink hover:bg-ink hover:text-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.23H2.748l7.73-8.835L2.252 2.25H8.08l4.265 5.644zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Post
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => share('linkedin')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border bg-white text-[13px] font-semibold text-ink hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share
        </button>

        {/* Copy link */}
        <button
          onClick={() => share('copy')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border bg-white text-[13px] font-semibold text-ink hover:border-accent hover:bg-accent hover:text-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
