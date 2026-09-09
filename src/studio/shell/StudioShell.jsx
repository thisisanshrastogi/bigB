"use client";
import { usePathname } from 'next/navigation';
import StudioSidebar from './StudioSidebar';

export default function StudioShell({ children }) {
  const pathname = usePathname();
  // Hide sidebar on the editor route (e.g. /studio/posts/[id])
  // We check if it matches /studio/posts/SOMETHING
  const isEditor = pathname?.match(/\/studio\/posts\/[^\/]+$/);

  if (isEditor) {
    return (
      <div className="flex h-screen w-full bg-surface text-brand overflow-hidden">
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <main className="flex-1 flex flex-col h-full">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-surface text-brand overflow-hidden">
      <StudioSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
