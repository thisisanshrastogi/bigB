"use client";
import { useState, useRef, useEffect } from 'react';
import { useEditor } from '@/studio/EditorProvider';
import { blockRegistry } from '@/blog/blocks/blockRegistry';
import FieldRenderer from './FieldRenderer';
import { animate } from 'animejs';

export default function InspectorForm() {
  const { post, updatePost, selectedBlockId } = useEditor();

  const [displayBlockId, setDisplayBlockId] = useState(selectedBlockId);
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedBlockId !== displayBlockId) {
      if (containerRef.current) {
        animate(containerRef.current, {
          opacity: [1, 0],
          translateY: [0, -4],
          duration: 150,
          ease: 'inQuad',
          onComplete: () => {
            setDisplayBlockId(selectedBlockId);
            animate(containerRef.current, {
              opacity: [0, 1],
              translateY: [4, 0],
              duration: 250,
              ease: 'outQuart'
            });
          }
        });
      } else {
        setDisplayBlockId(selectedBlockId);
      }
    }
  }, [selectedBlockId, displayBlockId]);

  if (!displayBlockId) {
    return (
      <div className="flex flex-col gap-6 p-6 pt-8">
        <p className="text-[12px] text-muted text-center italic px-4">
          Click any block on the canvas to edit its specific settings.
        </p>
      </div>
    );
  }

  const blocks = post.blocks || [];
  const blockIndex = blocks.findIndex(b => b.id === displayBlockId);
  const block = blocks[blockIndex];

  if (!block) {
    return <div ref={containerRef} className="text-[13px] text-warn-ink opacity-0">Selected block not found.</div>;
  }

  const registryEntry = blockRegistry[block.type];
  if (!registryEntry || !registryEntry.editor) {
    return <div ref={containerRef} className="text-[13px] text-muted opacity-0">No settings available for this block.</div>;
  }

  const schema = registryEntry.editor;

  const handleFieldChange = (key, newValue) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex] = {
      ...block,
      data: {
        ...block.data,
        [key]: newValue
      }
    };
    updatePost({ blocks: newBlocks });
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-hidden">
      {/* Fixed Header */}
      <div className="px-6 pt-6 pb-3 shrink-0 border-b  border-border">
        <h3 className="font-bold text-[10px] text-muted uppercase tracking-wider">{registryEntry.label || registryEntry.name} BLOCK</h3>
      </div>

      {/* Scrollable Fields */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-24">
        <div className="pt-2">
          {schema.map(field => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={block.data?.[field.key]}
              onChange={(newVal) => handleFieldChange(field.key, newVal)}
            />
          ))}
        </div>

        {/* Helper text specific to the block */}
        {registryEntry.helpText && (
          <p className="text-[10px] text-muted leading-relaxed mt-4 pt-6 border-t border-border/50 pr-4">
            {registryEntry.helpText}
          </p>
        )}
      </div>
    </div>
  );
}
