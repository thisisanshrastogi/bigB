"use client";
import { useState, useEffect } from 'react';

// A mock items list for the editor if no real headings are passed
const MOCK_TOC = [
  { id: 'section-1', text: 'Introduction', level: 'h2' },
  { id: 'section-2', text: 'The Core Concepts', level: 'h2' },
  { id: 'section-2-1', text: 'What is APY?', level: 'h3' },
  { id: 'section-3', text: 'Summary', level: 'h2' }
];

export default function TocBlock({ data, editing, allBlocks = [] }) {
  const { 
    depth = 'h2', 
    position = 'rail', 
    sticky = true, 
    railSide = 'left' 
  } = data || {};

  const [activeId, setActiveId] = useState('');

  // In a real implementation, we'd extract these from `allBlocks`.
  // For the standalone block preview, we use the mock.
  const tocItems = allBlocks.length > 0 ? extractToc(allBlocks, depth) : MOCK_TOC;

  useEffect(() => {
    if (editing || tocItems.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -40% 0px' }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems, editing]);

  if (tocItems.length === 0) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add headings to generate TOC...
      </div>
    );
  }

  const handleClick = (e, id) => {
    if (editing) {
      e.preventDefault();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (position === 'inline') {
    return (
      <div className="my-8 flex flex-wrap gap-2">
        {tocItems.map((item, i) => (
          <a
            key={i}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className="px-4 py-2 bg-[#F7F5EF] text-[#2C4035] hover:bg-[#E2DFD5] rounded-full font-sans text-[13px] font-bold transition-colors"
          >
            {item.text}
          </a>
        ))}
      </div>
    );
  }

  // Rail position
  const stickyClass = sticky ? 'sticky top-[112px]' : '';
  const railClass = railSide === 'right' ? 'ml-auto pl-6 border-l border-[#E2DFD5]' : 'mr-auto pr-6';

  return (
    <nav className={`w-full max-w-[240px] hidden lg:block ${stickyClass} ${railClass}`}>
      <div className="font-sans font-bold text-[11px] uppercase tracking-[0.1em] text-muted mb-4">
        Contents
      </div>
      <ul className="flex flex-col gap-3 m-0 p-0 list-none relative">
        {railSide === 'left' && (
           <div className="absolute left-[3px] top-1 bottom-1 w-[2px] bg-[#E2DFD5]/50 -z-10" />
        )}

        {tocItems.map((item, i) => {
          const isActive = activeId === item.id;
          const isH3 = item.level === 'h3';
          
          if (railSide === 'right') {
            return (
              <li key={i} className={`${isH3 ? 'pl-4' : ''}`}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`font-sans text-[14px] transition-colors block ${isActive ? 'font-bold text-[#2C4035]' : 'text-[#8A8375] hover:text-[#2E2B25]'}`}
                >
                  {item.text}
                </a>
              </li>
            );
          }

          // Left rail (dot-marker tracker)
          return (
            <li key={i} className={`flex items-start gap-3 ${isH3 ? 'pl-4' : ''}`}>
               <div className="shrink-0 pt-[6px]">
                 <div className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-[#2C4035]' : 'bg-transparent border border-[#D6CFBF]'}`} />
               </div>
               <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`font-sans text-[14px] leading-[1.4] transition-colors ${isActive ? 'font-bold text-ink' : 'text-[#8A8375] hover:text-[#2E2B25]'}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Helper to extract TOC items from block array
function extractToc(blocks, depth) {
  const items = [];
  blocks.forEach(b => {
    if (b.type === 'heading') {
      const level = b.data?.level || 'h2';
      if (level === 'h2' || (level === 'h3' && depth === 'h2+h3')) {
        if (b.data?.inTOC !== false) {
          items.push({ id: b.data?.anchor || `section-${items.length}`, text: b.data?.text || 'Untitled', level });
        }
      }
    } else if (b.type === 'steps') {
      b.data?.steps?.forEach((step, i) => {
        if (step.title) {
          items.push({ id: `step-${items.length}-${i}`, text: step.title, level: 'h3' });
        }
      });
    }
  });
  return items;
}
