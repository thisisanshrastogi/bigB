"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useEditor } from '@/studio/EditorProvider';
import DeviceSwitch from './DeviceSwitch';
import AIGeneratorModal from './AIGeneratorModal';
import { Home } from 'lucide-react';

export default function StudioTopBar() {
  const { post, viewMode, setViewMode, device, setDevice, viewAs, setViewAs, zoomScale, updateZoom } = useEditor();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  if (!post) return null;

  const handleView = async () => {
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id || post.id })
      });
      const { token } = await res.json();
      const origin = window.location.origin;
      const url = `${origin}/blog/${post.slug || 'untitled'}?preview=${token}`;
      window.open(url, '_blank');
    } catch (e) {
      console.error('Failed to generate preview link', e);
    }
  };

  return (
    <div className="h-[62px] bg-white border-b border-rule flex items-center justify-between px-[22px] shrink-0 z-10 relative gap-[16px]">
      <div className="flex items-center gap-[16px] text-[13px] font-medium w-full">
        <Link href="/studio" className="text-muted hover:text-ink transition-colors flex items-center justify-center p-1" title="Back to Dashboard">
          <Home className="w-5 h-5" strokeWidth={2.5} />
        </Link>

        <div className="w-[1px] h-[26px] bg-rule"></div>

        {viewMode === 'preview' ? (
          <>
            <DeviceSwitch active={device} onChange={setDevice} />
            <div className="w-[1px] h-[26px] bg-rule mx-2"></div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => updateZoom(Math.max(0.25, zoomScale - 0.1))} 
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-rule transition-colors text-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={zoomScale <= 0.25}
                title="Zoom out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <button 
                onClick={() => updateZoom(1)}
                className="text-[12px] font-bold text-ink w-12 text-center hover:bg-rule py-1 rounded-full transition-colors"
                title="Reset zoom"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button 
                onClick={() => updateZoom(Math.min(2, zoomScale + 0.1))} 
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-rule transition-colors text-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={zoomScale >= 2}
                title="Zoom in"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-mint text-forest text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {post.category || 'Uncategorized'}
            </div>

            <h2 className="font-semibold text-ink text-[15px] truncate max-w-[300px]">
              {post.title || 'Untitled Post'}
            </h2>

            <span className="text-faint text-[13px]">Draft · saved 12:04</span>
          </>
        )}

        <div className="flex-1"></div>

        {/* Toggle Pill */}
        <div className="flex items-center bg-[#F1EEE6] p-[3px] rounded-full mr-2">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-[16px] py-[6px] text-[13px] font-bold rounded-full transition-all active:scale-95 ${viewMode === 'edit' ? 'bg-white shadow-sm text-ink' : 'text-muted hover:text-ink'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setViewMode('details')}
            className={`px-[16px] py-[6px] text-[13px] font-bold rounded-full transition-all active:scale-95 ${viewMode === 'details' ? 'bg-white shadow-sm text-ink' : 'text-muted hover:text-ink'}`}
          >
            Details
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-[16px] py-[6px] text-[13px] font-bold rounded-full transition-all active:scale-95 ${viewMode === 'preview' ? 'bg-white shadow-sm text-ink' : 'text-muted hover:text-ink'}`}
          >
            Preview
          </button>
        </div>

        <button
          onClick={handleView}
          className="flex items-center gap-1.5 text-muted hover:text-ink px-3 py-1.5 rounded-full text-[13px] font-bold transition-all w-[80px] justify-center active:scale-95"
          title="View in new tab"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="hidden sm:inline">View</span>
        </button>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 text-ink  border-ink px-4 py-1.5 rounded-full text-[13px] font-bold hover:bg-ink hover:text-white transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Generate
        </button>

        <button
          onClick={() => setViewMode('details')}
          className="bg-ink text-white px-5 py-2 rounded-full text-[14px] font-bold hover:opacity-90 transition-all active:scale-95"
        >
          Publish
        </button>
      </div>

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
}
