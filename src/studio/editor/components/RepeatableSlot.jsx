'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, item, onChange, onRemove, renderFields }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white border border-border-strong rounded-lg p-4 mb-3 shadow-sm flex gap-4 ${isDragging ? 'shadow-lg ring-2 ring-accent/30' : ''}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab text-muted hover:text-ink pt-2"
        title="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        {renderFields(item, onChange)}
      </div>

      <button 
        onClick={onRemove}
        className="text-muted hover:text-warn-ink pt-2"
        title="Remove"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function RepeatableSlot({ slot, items = [], onChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleAdd = () => {
    if (slot.repeatable.max && items.length >= slot.repeatable.max) return;
    const newItem = { id: crypto.randomUUID() }; // Initialize with unique ID
    onChange([...items, newItem]);
  };

  const handleRemove = (id) => {
    if (slot.repeatable.min && items.length <= slot.repeatable.min) return;
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, newValues) => {
    onChange(items.map(item => item.id === id ? { ...item, ...newValues } : item));
  };

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-6 mt-2">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-sm font-semibold text-ink">{slot.label}</span>
          {slot.hint && <p className="text-xs text-muted mt-1">{slot.hint}</p>}
        </div>
        <span className="text-xs text-muted bg-surface-sunken px-2 py-1 rounded-full">
          {items.length} items
        </span>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SortableItem 
              key={item.id} 
              id={item.id}
              item={item}
              onChange={(newVals) => handleItemChange(item.id, newVals)}
              onRemove={() => handleRemove(item.id)}
              renderFields={(data, updater) => {
                // Here we render fields based on the slot kind (e.g. steps need title and body)
                if (slot.kind === 'steps') {
                  return (
                    <>
                      <input 
                        type="text" 
                        className="border border-border-strong rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full font-serif font-medium"
                        value={data.title || ''}
                        onChange={e => updater({ title: e.target.value })}
                        placeholder="Step Title"
                      />
                      <textarea 
                        className="border border-border-strong rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                        rows={3}
                        value={data.body || ''}
                        onChange={e => updater({ body: e.target.value })}
                        placeholder="Step description..."
                      />
                    </>
                  );
                }
                return <div>Unknown repeatable kind: {slot.kind}</div>;
              }}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button 
        onClick={handleAdd}
        disabled={slot.repeatable.max && items.length >= slot.repeatable.max}
        className="mt-2 w-full py-3 border-2 border-dashed border-border-strong rounded-lg text-sm font-medium text-accent hover:bg-accent-tint hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add {slot.label}
      </button>
    </div>
  );
}
