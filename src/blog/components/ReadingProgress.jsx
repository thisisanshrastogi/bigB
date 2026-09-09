"use client";
import { useReadingProgress } from '@/blog/hooks/useReadingProgress';

export default function ReadingProgress() {
  const { progressPercent } = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent">
      <div
        className="h-full bg-forest transition-all duration-100 ease-linear"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}
