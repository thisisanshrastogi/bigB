"use client";

import dynamic from 'next/dynamic';

// ssr: false must be declared inside a Client Component.
// This wrapper exists solely to handle the dnd-kit hydration mismatch.
const EditorLayout = dynamic(
  () => import('./EditorLayout'),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center h-screen bg-[#F2EFE8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3C5B49] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted font-medium">Loading editor...</span>
        </div>
      </div>
    )
  }
);

export default function EditorClientWrapper() {
  return <EditorLayout />;
}
