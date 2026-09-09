"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqBlock({ data, editing }) {
  const { 
    items = [], 
    title = '', 
    defaultOpenIndex = null, 
    emitSchema = false 
  } = data || {};

  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  if (!items || items.length === 0) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add FAQ items...
      </div>
    );
  }

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const schema = emitSchema && !editing ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  } : null;

  return (
    <div className="my-10">
      {schema && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
        />
      )}
      
      {title && (
        <h3 className="font-serif text-[24px] md:text-[28px] leading-[1.3] text-ink mb-6">
          {title}
        </h3>
      )}

      <div className="flex flex-col border-t border-[#E2DFD5]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border-b border-[#E2DFD5]">
              <button 
                className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span className="font-sans font-medium text-[17px] md:text-[18px] text-ink pr-8">
                  {item.q}
                </span>
                <span className="shrink-0 w-6 h-6 flex items-center justify-center text-muted group-hover:text-ink transition-colors">
                  <ChevronDown className={`w-5 h-5 transition-transform duration-240 ${isOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>
              
              <div 
                className={`grid transition-[grid-template-rows] duration-240 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="font-sans text-[17px] leading-[1.75] text-[#8A8375] m-0 pb-6 whitespace-pre-wrap">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
