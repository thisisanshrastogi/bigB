"use client";

import { useState, useEffect } from 'react';
import { useEditor } from '@/studio/EditorProvider';
import { blockRegistry } from '@/blog/blocks/blockRegistry';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import BlockFrame from './BlockFrame';

export default function BlockCanvas({ localBlocks }) {
  const { post, updatePost, selectedBlockId, setSelectedBlockId } = useEditor();
  const [isMounted, setIsMounted] = useState(false);

  const { setNodeRef } = useDroppable({
    id: 'canvas-dropzone',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const blocks = localBlocks || post.blocks || [];

  const removeBlock = (id) => {
    updatePost({
      blocks: blocks.filter(b => b.id !== id)
    });
    if (selectedBlockId === id) {
      const idx = blocks.findIndex(b => b.id === id);
      if (idx > 0) setSelectedBlockId(blocks[idx - 1].id);
      else setSelectedBlockId(null);
    }
  };

  const duplicateBlock = (id) => {
    const index = blocks.findIndex(b => b.id === id);
    const block = blocks[index];
    const newBlock = { ...block, id: crypto.randomUUID(), data: structuredClone(block.data || {}) };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    
    updatePost({ blocks: newBlocks });
    setSelectedBlockId(newBlock.id);
  };

  const changeBlockType = (id, newType) => {
    const entry = blockRegistry[newType];
    updatePost({
      blocks: blocks.map(b => {
        if (b.id !== id) return b;
        return { ...b, type: newType, data: entry?.defaultData ? { ...entry.defaultData } : {} };
      })
    });
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      updatePost({ blocks: newBlocks });
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      updatePost({ blocks: newBlocks });
    }
  };

  const insertBlockAfter = (id, type = 'text', data = {}) => {
    const index = blocks.findIndex(b => b.id === id);
    const newBlock = { id: crypto.randomUUID(), type, data };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updatePost({ blocks: newBlocks });
    setSelectedBlockId(newBlock.id);
  };

  const addRepeatingGroup = (groupId) => {
    // Find the first instance of this repeating group to determine the pattern
    let startIndex = -1;
    let length = 0;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].repeatingGroup === groupId) {
        if (startIndex === -1) startIndex = i;
        length++;
      } else if (startIndex !== -1) {
        break; // end of first instance
      }
    }
    
    if (startIndex === -1) return;
    
    const patternBlocks = blocks.slice(startIndex, startIndex + length);
    
    const newBlocks = patternBlocks.map(b => {
      const registryEntry = blockRegistry[b.type];
      return {
        ...b,
        id: crypto.randomUUID(),
        data: registryEntry ? { ...registryEntry.defaultData } : {}
      };
    });
    
    const lastIndex = blocks.findLastIndex(b => b.repeatingGroup === groupId);
    
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(lastIndex + 1, 0, ...newBlocks);
    updatePost({ blocks: updatedBlocks });
    setSelectedBlockId(newBlocks[0].id);
  };

  if (!isMounted) {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-8 md:p-8 flex justify-center">
        <div className="w-full max-w-[1200px] flex flex-col gap-[26px]">
          <div className="w-full max-w-[900px] mx-auto flex flex-col gap-[26px]">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-full bg-border/40 rounded-xl animate-pulse ${i === 0 ? 'h-48' : 'h-24'}`} 
                style={{ animationDelay: `${i * 100}ms` }} 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="flex-1 overflow-y-auto px-5 py-8 md:p-8 flex justify-center overflow-x-hidden" id="block-canvas-container">
      <div className="w-full max-w-[1200px] flex flex-col gap-[26px] pb-12 relative">
        <SortableContext 
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => {
            const isLastOfGroup = block.repeatingGroup && (index === blocks.length - 1 || blocks[index + 1].repeatingGroup !== block.repeatingGroup);
            
            return (
              <div key={block.id} id={`block-${block.id}`} className="relative">
                <BlockFrame 
                  id={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  onRemove={() => removeBlock(block.id)}
                  onDuplicate={() => duplicateBlock(block.id)}
                  onChangeType={(newType) => changeBlockType(block.id, newType)}
                  onMoveUp={() => moveBlock(block.id, 'up')}
                  onMoveDown={() => moveBlock(block.id, 'down')}
                  onInsertAfter={(type, data) => insertBlockAfter(block.id, type, data)}
                  onUpdate={(newData) => {
                    const newBlocks = blocks.map(b => b.id === block.id ? { ...b, data: newData } : b);
                    updatePost({ blocks: newBlocks });
                  }}
                />
                
                {isLastOfGroup && (
                  <div className="mt-[26px] flex justify-center">
                    <button 
                      onClick={() => addRepeatingGroup(block.repeatingGroup)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-[13px] font-bold text-ink rounded-full hover:bg-surface transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Item
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </SortableContext>
        
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-32 text-center text-muted max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-surface shadow-sm ring-1 ring-border flex items-center justify-center mb-6 text-muted-soft">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-[20px] font-serif text-ink mb-2">A blank canvas</p>
            <p className="text-[14px] text-muted-soft leading-relaxed">Drag a block from the palette on the left to start structuring your post.</p>
          </div>
        )}
        
        {/* Bottom Spacer to allow scrolling past the last block */}
        <div className="h-32 shrink-0 pointer-events-none" />
      </div>
    </div>
  );
}
