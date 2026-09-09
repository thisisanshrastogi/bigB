"use client";

import { useState } from 'react';
import NewPostDialog from '@/studio/components/NewPostDialog';

export default function TemplateGallery() {
  const [selected, setSelected] = useState('how-to');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTemplate, setDialogTemplate] = useState(null); // null = blank

  const templates = [
    {
      id: 'how-to',
      name: 'How-to guide',
      description: 'Numbered steps for one specific outcome. Your best-performing shape.',
      sections: 7,
      used: 14,
    },
    {
      id: 'listicle',
      name: 'Listicle',
      description: 'Ranked picks, each with card art and a one-line verdict.',
      sections: 5,
      used: 9,
    },
    {
      id: 'card-review',
      name: 'Card review',
      description: 'Verdict up top, then fee maths, credits and who it suits.',
      sections: 8,
      used: 6,
    },
    {
      id: 'product-update',
      name: 'Product update',
      description: 'What shipped, why it matters, a screenshot. Dated and tagged.',
      sections: 5,
      used: 11,
    },
    {
      id: 'customer-story',
      name: 'Customer story',
      description: 'One person, one number they recovered, quotes in their words.',
      sections: 6,
      used: 4,
    },
    {
      id: 'news',
      name: 'News',
      description: 'Short. A change in the industry and what to do about it.',
      sections: 4,
      used: 7,
    },
    {
      id: 'plain-essay',
      name: 'Plain essay',
      description: 'Just a title and prose. For thinking out loud.',
      sections: 2,
      used: 3,
    }
  ];

  const openDialog = (template = null) => {
    setDialogTemplate(template);
    setDialogOpen(true);
  };

  return (
    <div className="p-8 md:p-12 max-w-[1240px] mx-auto min-h-screen bg-bg">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-serif text-ink mb-3">Choose a template</h1>
          <p className="text-[15px] text-muted-soft">
            Start with a predefined layout, or start from scratch with a blank post.
          </p>
        </div>
        <button 
          onClick={() => openDialog(null)}
          className="px-5 py-2.5 rounded-full border border-border-strong text-[14px] font-semibold text-ink hover:bg-surface-sunken transition-colors"
        >
          Start blank
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(tpl => (
          <TemplateCard 
            key={tpl.id} 
            template={tpl} 
            isSelected={selected === tpl.id}
            onClick={() => {
              setSelected(tpl.id);
              openDialog(tpl);
            }}
            onUse={() => openDialog(tpl)}
          />
        ))}

        {/* Save as template card */}
        <div className="bg-transparent border-2 border-dashed border-border-strong rounded-[22px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-sunken/50 transition-colors h-[320px]">
          <div className="w-10 h-10 rounded-full border border-border-strong flex items-center justify-center text-muted mb-4 bg-surface">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h3 className="text-[17px] font-bold text-ink mb-2">Save a post as a template</h3>
          <p className="text-[14px] text-muted-soft leading-relaxed px-4">
            Any published post can become a reusable shape.
          </p>
        </div>
      </div>

      <NewPostDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        templateId={dialogTemplate?.id || null}
        templateName={dialogTemplate?.name || null}
      />
    </div>
  );
}

function TemplateCard({ template, isSelected, onClick, onUse }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-surface rounded-[22px] p-5 cursor-pointer flex flex-col transition-all duration-200 h-[320px] ${
        isSelected 
          ? 'border-2 border-accent shadow-md scale-[1.02]' 
          : 'border border-border hover:shadow-sm hover:border-border-strong'
      }`}
    >
      <TemplateThumb id={template.id} />
      
      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="text-[17px] font-bold text-ink mb-2 leading-tight">{template.name}</h3>
        <p className="text-[14px] text-muted-soft leading-relaxed line-clamp-2">
          {template.description}
        </p>
        
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="text-[12px] text-muted-soft font-medium">
            {template.sections} sections · used {template.used}x
          </div>
          <button 
            className={`w-full py-2.5 rounded-full text-[14px] font-semibold text-center transition-colors block ${
              isSelected 
                ? 'bg-ink text-surface hover:bg-ink/90' 
                : 'border border-border-strong text-ink hover:bg-surface-sunken'
            }`}
            onClick={(e) => { e.stopPropagation(); onUse(); }}
          >
            Use template
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateThumb({ id }) {
  // A generic wrapper for the wireframe thumbnail
  return (
    <div className="bg-[#F7F5EF] rounded-xl h-28 overflow-hidden p-4 relative">
      {id === 'how-to' && (
        <div className="flex flex-col gap-2">
          <div className="h-1.5 w-16 bg-ink rounded-full mb-1"></div>
          <div className="h-6 w-full bg-[#E2DFD5] rounded-md"></div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <div className="h-1 w-20 bg-[#D6CFBF] rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <div className="h-1 w-24 bg-[#D6CFBF] rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <div className="h-1 w-16 bg-[#D6CFBF] rounded-full"></div>
          </div>
        </div>
      )}

      {id === 'listicle' && (
        <div className="flex flex-col gap-2.5">
          <div className="h-1.5 w-12 bg-ink rounded-full"></div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-accent shrink-0"></div>
            <div className="h-3 w-full bg-[#E2DFD5] rounded-sm"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-accent shrink-0"></div>
            <div className="h-3 w-full bg-[#E2DFD5] rounded-sm"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-accent shrink-0"></div>
            <div className="h-3 w-3/4 bg-[#E2DFD5] rounded-sm"></div>
          </div>
        </div>
      )}

      {id === 'card-review' && (
        <div className="flex flex-col gap-2.5 mt-1">
          <div className="h-5 w-full bg-[#E2DFD5] rounded-md"></div>
          <div className="h-1.5 w-24 bg-ink rounded-full"></div>
          <div className="h-3 w-full bg-[#E2DFD5] rounded-sm opacity-60"></div>
          <div className="h-3 w-4/5 bg-[#E2DFD5] rounded-sm opacity-60"></div>
        </div>
      )}

      {id === 'product-update' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-6 bg-highlight rounded-full"></div>
            <div className="h-1 w-12 bg-[#D6CFBF] rounded-full"></div>
          </div>
          <div className="h-1.5 w-16 bg-ink rounded-full"></div>
          <div className="h-6 w-full bg-[#E2DFD5] rounded-md mt-1"></div>
          <div className="h-1 w-full bg-[#D6CFBF] rounded-full mt-1"></div>
        </div>
      )}

      {id === 'customer-story' && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#E2DFD5]"></div>
            <div className="h-1.5 w-14 bg-ink rounded-full"></div>
          </div>
          <div className="flex gap-2 mt-2 h-10">
            <div className="w-0.5 h-full bg-accent rounded-full ml-2"></div>
            <div className="flex flex-col gap-1.5 flex-1 pt-1">
              <div className="h-1 w-full bg-[#D6CFBF] rounded-full"></div>
              <div className="h-1 w-4/5 bg-[#D6CFBF] rounded-full"></div>
              <div className="h-1 w-1/2 bg-[#D6CFBF] rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {id === 'news' && (
        <div className="flex flex-col gap-1.5 mt-3">
          <div className="h-1.5 w-10 bg-accent rounded-full mb-1"></div>
          <div className="h-1.5 w-20 bg-ink rounded-full"></div>
          <div className="h-1 w-full bg-[#D6CFBF] rounded-full mt-3"></div>
          <div className="h-1 w-5/6 bg-[#D6CFBF] rounded-full"></div>
        </div>
      )}

      {id === 'plain-essay' && (
        <div className="flex flex-col gap-2.5 mt-3">
          <div className="h-1.5 w-12 bg-ink rounded-full"></div>
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="h-1 w-full bg-[#D6CFBF] rounded-full"></div>
            <div className="h-1 w-11/12 bg-[#D6CFBF] rounded-full"></div>
            <div className="h-1 w-4/5 bg-[#D6CFBF] rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
