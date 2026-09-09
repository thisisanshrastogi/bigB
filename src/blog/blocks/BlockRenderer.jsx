"use client";
import { blockRegistry } from './blockRegistry';

export default function BlockRenderer({ blocks = [] }) {
  return (
    <div className="flex flex-col gap-[26px]">
      {blocks.map((block, index) => {
        const blockType = block.type;
        const registryEntry = blockRegistry[blockType];
        
        if (!registryEntry) {
          console.warn(`Unknown block type: ${blockType}`);
          return null;
        }

        const Component = registryEntry.component;
        // In a real app we'd want an ErrorBoundary here per block
        return <Component key={block.id || index} data={block.data || {}} />;
      })}
    </div>
  );
}
