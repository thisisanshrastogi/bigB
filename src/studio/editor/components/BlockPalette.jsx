"use client";
import { useState, useRef } from 'react';
import { useEditor } from '@/studio/EditorProvider';
import { blockRegistry } from '@/blog/blocks/blockRegistry';

import { useDraggable } from '@dnd-kit/core';

function PaletteButton({ type, onClickAdd }) {
  const blockDef = blockRegistry[type];
  if (!blockDef) return null;

  const pointerStart = useRef(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { isPalette: true, type }
  });

  const handlePointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    // Call dnd-kit's onPointerDown
    listeners?.onPointerDown?.(e);
  };

  const handlePointerUp = (e) => {
    if (!pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    pointerStart.current = null;
    // Only treat as click if pointer didn't move (below activation threshold)
    if (distance < 5 && !isDragging) {
      onClickAdd(type);
    }
  };

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="flex flex-col items-center justify-center p-3 rounded-[14px] bg-transparent border border-transparent hover:bg-white hover:border-border hover:shadow-sm hover:text-accent transition-all group cursor-grab active:cursor-grabbing h-16 active:scale-95"
    >
      <div className="text-muted group-hover:text-accent mb-1.5 pointer-events-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={blockDef.icon} />
        </svg>
      </div>
      <span className="text-[10px] font-semibold text-ink group-hover:text-accent pointer-events-none">{blockDef.label}</span>
    </button>
  );
}

export default function BlockPalette() {
  const { post, updatePost, selectedBlockId, setSelectedBlockId } = useEditor();
  const [isOutlineExpanded, setIsOutlineExpanded] = useState(false);

  if (post.mode !== 'custom') return null;

  const blocks = post.blocks || [];
  const PALETTE_BLOCK_TYPES = Object.keys(blockRegistry);

  const handleClickAdd = (type) => {
    const entry = blockRegistry[type];
    const defaultData = entry?.defaultData ? { ...entry.defaultData } : (type === 'text' ? { html: '' } : {});
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      data: defaultData
    };
    const newBlocks = [...blocks];
    if (selectedBlockId) {
      const idx = blocks.findIndex(b => b.id === selectedBlockId);
      if (idx !== -1) {
        newBlocks.splice(idx + 1, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
    } else {
      newBlocks.push(newBlock);
    }
    updatePost({ blocks: newBlocks });
    setSelectedBlockId(newBlock.id);
  };

  const getOutlineLabel = (block) => {
    const entry = blockRegistry[block.type];
    if (!entry) return block.type;
    
    const text = entry.toText(block.data);
    
    if (block.type === 'heading') {
      const levelStr = (block.data?.level || 'h2').toUpperCase();
      if (!text) return `${levelStr} · ${entry.label}`;
      const truncated = text.length > 25 ? text.substring(0, 25) + '...' : text;
      return `${levelStr} · ${truncated}`;
    }

    if (!text) return entry.label;
    const truncated = text.length > 25 ? text.substring(0, 25) + '...' : text;
    return truncated;
  };

  const handleOutlineClick = (blockId) => {
    setSelectedBlockId(blockId);
    document.getElementById(`block-${blockId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Blocks Section (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col pb-24">
        <h3 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4">Blocks · Drag In</h3>
        <div className="grid grid-cols-2 gap-3">
          {PALETTE_BLOCK_TYPES.map(type => (
            <PaletteButton key={type} type={type} onClickAdd={handleClickAdd} />
          ))}
        </div>
      </div>

      {/* Expandable Outline Drawer */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-[#F2EFE8] border-t border-border flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10 ${
          isOutlineExpanded ? 'h-1/2' : 'h-[52px]'
        }`}
      >
        <button 
          onClick={() => setIsOutlineExpanded(!isOutlineExpanded)}
          className="h-[52px] w-full px-5 flex items-center justify-between text-muted hover:text-ink hover:bg-white/40 transition-colors shrink-0"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">Outline · {blocks.length}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isOutlineExpanded ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        
        <div className={`px-4 pb-4 overflow-y-auto flex-1 transition-opacity duration-300 ${isOutlineExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="space-y-0.5">
            {blocks.map((block, index) => {
              const isActive = selectedBlockId === block.id;
              return (
                <div 
                  key={block.id}
                  onClick={() => handleOutlineClick(block.id)}
                  className={`px-3 py-2 text-[13px] truncate rounded-lg cursor-pointer transition-all active:scale-[0.98] ${
                    isActive 
                      ? 'bg-white shadow-sm ring-1 ring-border text-ink font-semibold' 
                      : 'text-muted hover:bg-white/50 hover:text-ink'
                  }`}
                >
                  {getOutlineLabel(block)}
                </div>
              );
            })}
            
            {blocks.length === 0 && (
              <div className="px-3 py-4 text-center text-faint text-[12px] italic">
                No blocks added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
