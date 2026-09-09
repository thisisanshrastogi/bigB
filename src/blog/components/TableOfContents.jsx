"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useReadingProgress } from '@/blog/hooks/useReadingProgress';
import { slugify } from '@/lib/blog/headings';
import { Link as LinkIcon } from 'lucide-react';
import { animate } from 'animejs';

// Matches the sticky rail offset so a clicked heading lands below the navbar.
const SCROLL_OFFSET = 120;

export default function TableOfContents({
  headings: initialHeadings = [],
  totalReadingTime = 0,
  railPosition = 'right',
  title = '',
  url = '',
}) {
  // Server-rendered headings paint with the article. The DOM scrape below is
  // only a fallback for posts whose blocks don't expose heading text.
  const [scraped, setScraped] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [copied, setCopied] = useState(false);
  const { progressPercent } = useReadingProgress(totalReadingTime);

  const headings = useMemo(
    () => (initialHeadings.length ? initialHeadings : scraped),
    [initialHeadings, scraped]
  );

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const share = useCallback(async (platform) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard?.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard blocked, nothing useful to do here.
      }
      return;
    }

    if (platform === 'native' && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // User dismissed the sheet, or the browser refused. Fall through.
      }
    }

    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} — `)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (links[platform]) {
      window.open(links[platform], '_blank', 'noopener,noreferrer,width=600,height=480');
    }
  }, [shareUrl, title]);

  // Fallback only: read H2s out of the article and stamp ids on them.
  useEffect(() => {
    if (initialHeadings.length) return;

    const article = document.querySelector('article');
    if (!article) return;

    const collect = () => {
      const seen = new Map();
      const items = Array.from(article.querySelectorAll('h2')).map((el) => {
        const text = el.textContent?.trim() || '';
        if (!el.id) {
          const base = slugify(text);
          const count = (seen.get(base) || 0) + 1;
          seen.set(base, count);
          el.id = count === 1 ? base : `${base}-${count}`;
        }
        return { id: el.id, text };
      });
      setScraped((prev) =>
        prev.length === items.length && prev.every((p, i) => p.id === items[i].id) ? prev : items
      );
    };

    collect();

    // Blocks that hydrate late (embeds, code, charts) would otherwise be missed.
    const observer = new MutationObserver(collect);
    observer.observe(article, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [initialHeadings.length]);

  // Active heading: the last one whose top has crossed the offset line.
  // Reading the list in order avoids the flicker you get from taking whichever
  // entry an IntersectionObserver happens to report first.
  useEffect(() => {
    if (!headings.length) return;

    let frame = null;

    const update = () => {
      frame = null;
      let current = headings[0].id;

      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        // Add a buffer so the section switches when the heading is slightly below the navbar
        if (el.getBoundingClientRect().top - SCROLL_OFFSET <= 100) current = heading.id;
        else break;
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom) current = headings[headings.length - 1].id;

      setActiveId(current);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [headings]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
      behavior: reduced ? 'auto' : 'smooth',
    });
    setActiveId(id);
  };

  useEffect(() => {
    if (railPosition === 'left' || !activeId) return;
    
    const indicator = document.getElementById('toc-active-indicator');
    const activeItem = document.getElementById(`toc-item-${activeId}`);
    
    if (indicator && activeItem) {
      // The dot should sit 8px from the top of the li, as it was originally designed
      const topPos = activeItem.offsetTop + 8;
      
      animate(indicator, {
        translateY: topPos,
        opacity: 1, // Make sure it's visible after first calculation
        duration: 350,
        ease: 'outExpo'
      });
    }
  }, [activeId, railPosition]);

  if (!headings.length && railPosition !== 'left') return null;

  return (
    <nav aria-label="On this page" className="flex w-full flex-col gap-6">
      <span className="block pl-3 text-[11px] font-medium tracking-[0.08em] text-ink/40">
        Contents
      </span>

      {headings.length > 0 && (
        <ul className={`relative ${railPosition === 'left' ? 'flex flex-col pr-1' : 'flex flex-col'}`}>
          {railPosition !== 'left' && (
            <div 
              id="toc-active-indicator"
              className="absolute left-[-4px] top-0 z-20 h-[10px] w-[10px] rounded-full border-[2px] border-paper bg-forest opacity-0" 
            />
          )}
          {headings.map((heading) => {
            const isActive = activeId === heading.id;

            if (railPosition === 'left') {
              return (
                <li key={heading.id} id={`toc-item-${heading.id}`} className="flex">
                  <button
                    type="button"
                    onClick={() => scrollTo(heading.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex-1 border-l py-1.5 pl-3 text-left text-[14px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 ${isActive
                      ? 'border-ink text-ink'
                      : 'border-transparent text-muted hover:text-ink'
                      }`}
                  >
                    {heading.text}
                  </button>
                </li>
              );
            }

            return (
              <li key={heading.id} id={`toc-item-${heading.id}`} className="group relative">
                <div
                  className={`absolute bottom-0 left-0 top-0 w-[2px] transition-colors duration-300 ${isActive ? 'z-10 bg-forest' : 'bg-rule'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => scrollTo(heading.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`w-full py-3 pl-[18px] text-left text-[14px] leading-[1.4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 ${isActive ? 'font-bold text-ink' : 'text-muted hover:text-ink'
                    }`}
                >
                  {heading.text}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {railPosition === 'left' && (
        <div className="mt-4 border-t border-ink/10 pt-4">
          <span className="block text-[11px] tracking-[0.04em] text-ink/45">
            Read {progressPercent}%
          </span>
          <div className="mt-2 h-px w-full bg-ink/12">
            <div
              className="h-full bg-ink transition-[width] duration-150 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-8 flex items-center gap-4 text-ink/40">
            <button
              type="button"
              onClick={() => share('linkedin')}
              aria-label="Share on LinkedIn"
              className="text-[14px] font-bold transition-colors hover:text-[#0A66C2]"
            >
              in
            </button>
            <button
              type="button"
              onClick={() => share('twitter')}
              aria-label="Share on X"
              className="text-[14px] font-bold transition-colors hover:text-ink"
            >
              x
            </button>
            <button
              type="button"
              onClick={() => share('copy')}
              aria-label="Copy link"
              className="relative pl-1 transition-colors hover:text-ink"
            >
              <LinkIcon size={18} strokeWidth={2.5} />
              <span
                role="status"
                className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[11px] text-white transition-opacity ${copied ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
              >
                Link copied
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 