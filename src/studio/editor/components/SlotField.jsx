import React from 'react';

// A mock rich text editor for now - we'll implement TipTap properly later
function RichTextInput({ value, onChange }) {
  return (
    <textarea 
      className="w-full border border-border-strong rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
      rows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="<p>Rich text goes here...</p>"
    />
  );
}

export default function SlotField({ slot, value, onChange }) {
  const isOptional = !slot.required;

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-ink">{slot.label}</span>
        {isOptional && <span className="text-xs text-muted font-normal">(optional)</span>}
      </label>
      {slot.hint && <p className="text-xs text-muted mb-1">{slot.hint}</p>}
      
      {slot.kind === 'text' && (
        <input 
          type="text" 
          className="border border-border-strong rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      
      {slot.kind === 'richtext' && (
        <RichTextInput 
          value={value || ''}
          onChange={onChange}
        />
      )}

      {slot.kind === 'image' && (
        <div className="border-2 border-dashed border-border-strong rounded-md p-4 text-center bg-surface-sunken text-muted cursor-pointer hover:bg-paper transition-colors">
          {value ? 'Image Selected (click to replace)' : 'Click to select image'}
        </div>
      )}

      {/* Fallback for other kinds */}
      {!['text', 'richtext', 'image'].includes(slot.kind) && (
        <div className="p-3 bg-warn-bg text-warn-ink rounded-md text-sm border border-warn-ink border-opacity-20">
          Field type <code>{slot.kind}</code> is not yet implemented.
        </div>
      )}
    </div>
  );
}
