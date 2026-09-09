import { slugify } from '@/lib/blog/headings';

export default function HeadingBlock({ data, editing }) {
  const { level = 'h2', text = '', align = 'left', anchor = '', weight = 'default', fontFamily = 'auto' } = data || {};

  if (!text) {
    return (
      <div className="border border-dashed border-border-strong py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add a descriptive heading...
      </div>
    );
  }

  const Component = level || 'h2';

  const sizeMap = {
    h2: 'text-[32px] leading-[1.2] tracking-[-0.01em] mt-[14px]',
    h3: 'text-[24px] leading-[1.3] mt-[8px]',
    h4: 'text-[19px] leading-[1.4] font-bold',
  };

  let fontClass = '';
  if (fontFamily === 'auto') {
    fontClass = level === 'h4' ? 'font-sans' : 'font-serif';
  } else if (fontFamily === 'serif') {
    fontClass = 'font-serif';
  } else if (fontFamily === 'sans') {
    fontClass = 'font-sans';
  }

  const baseStyles = `text-ink relative group ${sizeMap[level] || sizeMap.h2} ${fontClass}`;

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  const alignClass = alignMap[align] || 'text-left';

  const weightMap = {
    normal: 'font-normal',
    bold: 'font-bold'
  };
  const weightClass = weightMap[weight] || '';

  // Fallback to slugified text if no explicit anchor is provided
  // This ensures the TOC can find the element by ID
  const computedId = anchor || (text ? slugify(text) : undefined);

  return (
    <Component id={computedId} className={`${baseStyles} ${alignClass} ${weightClass}`}>
      {computedId && (
        <a 
          href={`#${computedId}`} 
          className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted hover:text-accent transition-opacity text-lg hidden md:block"
          aria-label="Link to this section"
        >
          #
        </a>
      )}
      {text}
    </Component>
  );
}
