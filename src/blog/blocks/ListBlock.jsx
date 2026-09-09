import { Check, X } from 'lucide-react';

export default function ListBlock({ data, editing }) {
  const { style = 'bullet', items = [], spacing = 'tight' } = data || {};

  if (!items || items.length === 0) {
    return (
      <div className="border border-dashed border-border-strong py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add list items...
      </div>
    );
  }

  const gapClass = spacing === 'loose' ? 'gap-4' : 'gap-2';
  
  return (
    <ul className={`flex flex-col ${gapClass} my-0`}>
      {items.map((item, index) => {
        const itemStyle = item.marker || style;
        let marker = null;
        
        if (itemStyle === 'bullet') {
          marker = (
            <div className="w-[28px] h-[28px] flex items-center justify-center">
              <div className="w-[6px] h-[6px] rounded-full bg-accent" />
            </div>
          );
        } else if (itemStyle === 'numbered') {
          marker = (
            <div className="w-[28px] h-[28px] flex items-center justify-end pr-1">
              <span className="font-serif text-accent font-bold tabular-nums text-[16px] leading-none">{index + 1}.</span>
            </div>
          );
        } else if (itemStyle === 'check') {
          marker = (
            <div className="w-[28px] h-[28px] flex items-center justify-center">
              <div className="w-[22px] h-[22px] rounded-full bg-highlight text-accent flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          );
        } else if (itemStyle === 'cross') {
          marker = (
            <div className="w-[28px] h-[28px] flex items-center justify-center">
              <div className="w-[22px] h-[22px] rounded-full bg-warn-bg text-warn-ink flex items-center justify-center">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          );
        }
        
        return (
          <li key={index} className="flex gap-3 items-start font-sans text-[18px] leading-[1.7] text-ink">
            <div className="shrink-0 mt-[1px]">
              {marker}
            </div>
            <div 
              className="flex-1 min-w-0 prose prose-p:my-0 prose-a:text-ink prose-a:border-b-[1.5px] prose-a:border-highlight hover:prose-a:border-solid hover:prose-a:border-highlight hover:prose-a:bg-highlight/20 prose-a:no-underline prose-strong:font-bold prose-code:text-[13px] prose-code:bg-surface-sunken prose-code:px-[5px] prose-code:py-[2px] prose-code:rounded-[5px] max-w-none"
              dangerouslySetInnerHTML={{ __html: item.html || '' }} 
            />
          </li>
        );
      })}
    </ul>
  );
}
