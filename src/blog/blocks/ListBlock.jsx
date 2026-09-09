import { Check, X } from 'lucide-react';

export default function ListBlock({ data, editing }) {
  const { style = 'bullet', items = [], spacing = 'tight' } = data || {};

  if (!items || items.length === 0) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
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
          marker = <div className="w-[6px] h-[6px] rounded-full bg-[#2C4035] mt-[10px] shrink-0" />;
        } else if (itemStyle === 'numbered') {
          marker = <div className="font-serif text-[#2C4035] font-medium tabular-nums min-w-[20px] shrink-0 text-right">{index + 1}.</div>;
        } else if (itemStyle === 'check') {
          marker = (
            <div className="w-[22px] h-[22px] rounded-full bg-[#C2E0D1] text-[#2C4035] flex items-center justify-center shrink-0 mt-[3px]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          );
        } else if (itemStyle === 'cross') {
          marker = (
            <div className="w-[22px] h-[22px] rounded-full bg-[#F5E6E6] text-[#8A5A2B] flex items-center justify-center shrink-0 mt-[3px]">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          );
        }
        
        return (
          <li key={index} className="flex gap-4 items-start font-sans text-[18px] leading-[1.7] text-ink">
            {marker}
            <div 
              className="flex-1 prose prose-p:my-0 prose-a:text-[#2E2B25] prose-a:border-b-[1.5px] prose-a:border-[#8DC4AC] hover:prose-a:border-solid hover:prose-a:border-[#8DC4AC] prose-a:no-underline prose-strong:font-bold prose-code:text-[13px] prose-code:bg-[#F1EEE6] prose-code:px-[5px] prose-code:py-[2px] prose-code:rounded-[5px] max-w-none"
              dangerouslySetInnerHTML={{ __html: item.html || '' }} 
            />
          </li>
        );
      })}
    </ul>
  );
}
