"use client";

import { useState } from 'react';
import { useEditor } from '@/studio/EditorProvider';
import {
  DndContext,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { blockRegistry } from '@/blog/blocks/blockRegistry';


import StudioTopBar from './StudioTopBar';
import PreviewFrame from './PreviewFrame';
import BlockPalette from './BlockPalette';
import BlockCanvas from './BlockCanvas';
import InspectorRail from './InspectorRail';
import SlotForm from './SlotForm';
import PostDetailsView from './PostDetailsView';

export default function EditorLayout() {
  const { post, updatePost, setSelectedBlockId, viewMode } = useEditor();
  const [activeId, setActiveId] = useState(null);

  const [localBlocks, setLocalBlocks] = useState(null);

  const blocks = localBlocks || post.blocks || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setLocalBlocks(post.blocks || []);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    
    if (activeIdStr === overIdStr) return;

    if (activeIdStr.startsWith('palette-')) {
      setLocalBlocks((prev) => {
        if (!prev) return prev;
        
        // Only insert it ONCE. After it's in the array, SortableContext handles the visual shifting.
        const isAlreadyInCanvas = prev.some(b => b.id === activeIdStr);
        if (isAlreadyInCanvas) return prev;

        const currentBlocks = [...prev];
        const ghostBlock = {
          id: activeIdStr, // Use exact activeId so SortableContext animates it
          type: active.data.current?.type || activeIdStr.replace('palette-', ''),
          data: {},
          isGhost: true
        };

        if (overIdStr === 'canvas-dropzone') {
          currentBlocks.push(ghostBlock);
        } else {
          const overIndex = currentBlocks.findIndex(b => b.id === overIdStr);
          if (overIndex !== -1) {
            currentBlocks.splice(overIndex, 0, ghostBlock);
          } else {
            currentBlocks.push(ghostBlock);
          }
        }
        
        return currentBlocks;
      });
    }
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    const activeIdStr = String(active.id);

    if (!over) {
      setLocalBlocks(null);
      return;
    }

    const overIdStr = String(over.id);

    if (activeIdStr.startsWith('palette-')) {
      if (localBlocks) {
        const type = active.data.current?.type || activeIdStr.replace('palette-', '');
        const entry = blockRegistry[type];
        const defaultData = entry?.defaultData || (type === 'text' ? { html: '' } : {});
        const newBlock = {
          id: crypto.randomUUID(),
          type,
          data: { ...defaultData }
        };
        
        // Use dnd-kit's native arrayMove on the localBlocks to get the exact visual order,
        // which accounts for dragging up vs down perfectly!
        const oldIndex = localBlocks.findIndex(b => b.id === activeIdStr);
        const newIndex = localBlocks.findIndex(b => b.id === overIdStr);
        
        let sortedBlocks = [...localBlocks];
        if (oldIndex !== -1 && newIndex !== -1) {
           sortedBlocks = arrayMove(sortedBlocks, oldIndex, newIndex);
        }
        
        // Substitute the placeholder drag item for the real instantiated block
        const finalBlocks = sortedBlocks.map(b => b.id === activeIdStr ? newBlock : b);
        
        updatePost({ blocks: finalBlocks });
        setSelectedBlockId(newBlock.id);
      }
      setLocalBlocks(null);
      return;
    }

    setLocalBlocks(null);
    const oldIndex = (post.blocks || []).findIndex(block => block.id === activeIdStr);
    const newIndex = (post.blocks || []).findIndex(block => block.id === overIdStr);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      updatePost({ blocks: arrayMove(post.blocks, oldIndex, newIndex) });
    }
  };

  // Build the drag overlay content
  const renderDragOverlay = () => {
    if (!activeId) return null;
    const idStr = String(activeId);

    if (idStr.startsWith('palette-')) {
      const type = activeId.toString().replace('palette-', '');
      const entry = blockRegistry[type];
      return (
        <div className="flex items-center gap-3 bg-white border border-[#2C4035] rounded-xl shadow-xl px-5 py-3 pointer-events-none rotate-2 scale-105 premium-shadow">
          {entry?.icon && (
            <svg className="w-5 h-5 text-[#2C4035]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={entry.icon} />
            </svg>
          )}
          <span className="font-bold text-[13px] text-[#2C4035]">{entry?.label || type}</span>
        </div>
      );
    }

    // Canvas block reorder — show block type label
    const block = blocks.find(b => b.id === idStr);
    if (block) {
      const entry = blockRegistry[block.type];
      const previewText = entry?.toText?.(block.data);
      const truncated = previewText && previewText.length > 40 ? previewText.substring(0, 40) + '…' : previewText;
      return (
        <div className="flex items-center gap-3 bg-white border border-[#2C4035] rounded-xl shadow-xl px-5 py-3 pointer-events-none max-w-[320px] rotate-2 scale-105 premium-shadow">
          {entry?.icon && (
            <svg className="w-4 h-4 text-[#2C4035] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={entry.icon} />
            </svg>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[11px] text-[#2C4035] uppercase tracking-wider">{entry?.label || block.type}</span>
            {truncated && <span className="text-[12px] text-muted truncate">{truncated}</span>}
          </div>
        </div>
      );
    }

    return <div className="bg-white border-2 border-[#2C4035] rounded-xl shadow-xl px-5 py-3 pointer-events-none font-bold text-[#2C4035] rotate-2 scale-105 premium-shadow">Moving…</div>;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F2EFE8]">
      <StudioTopBar />
      
      {viewMode === 'preview' ? (
        <div className="flex-1 overflow-hidden">
          <PreviewFrame />
        </div>
      ) : viewMode === 'details' ? (
        <PostDetailsView />
      ) : post.mode === 'template' ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 border-r border-border overflow-y-auto bg-surface p-6">
            <SlotForm />
          </div>
          <div className="w-1/2 bg-surface-sunken flex flex-col">
            <PreviewFrame />
          </div>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex overflow-hidden w-full max-w-[1400px] mx-auto">
            <div className="w-[240px] shrink-0 border-r border-border bg-[#F2EFE8] flex flex-col">
              <BlockPalette />
            </div>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white shadow-[0_0_20px_rgba(0,0,0,0.03)_inset] ring-1 ring-black/[0.02]">
              <BlockCanvas localBlocks={blocks} />
            </div>
            <div className="w-[300px] xl:w-[340px] shrink-0 bg-[#F2EFE8] border-l border-border flex flex-col overflow-hidden">
              <InspectorRail />
            </div>
          </div>
          <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
            {renderDragOverlay()}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
