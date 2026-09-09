"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BlogNav({ totalReadingTime = 0 }) {
  const [minLeft, setMinLeft] = useState(totalReadingTime);

  useEffect(() => {
    if (!totalReadingTime) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setMinLeft(Math.max(0, Math.ceil(totalReadingTime * (1 - progress))));
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [totalReadingTime]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(245,242,234,0.94)] backdrop-blur-[10px]">
      <div className="w-full px-[44px] py-[18px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-[22px] h-[22px] bg-forest rounded-[4px] flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="font-sans font-[800] text-[16px] text-ink">
            Amalgamic
          </span>
        </Link>
        <div className="flex-1"></div>
        {totalReadingTime > 0 && (
          <div className="text-[13px] text-muted font-sans font-medium">
            {minLeft} min left
          </div>
        )}
      </div>
    </header>
  );
}
