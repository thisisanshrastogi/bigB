"use client";
import { useEditor } from '@/studio/EditorProvider';
import { templateRegistry } from '@/blog/templates/templateRegistry';
import SlotField from './SlotField';
import RepeatableSlot from './RepeatableSlot';

export default function SlotForm() {
  const { post, updatePost } = useEditor();
  
  if (post.mode !== 'template') {
    return (
      <div className="p-4 border border-warn-ink bg-warn-bg text-warn-ink rounded-lg">
        This post is in Custom mode. The template form is disabled.
      </div>
    );
  }

  const template = post.templateId ? templateRegistry[post.templateId] : null;

  if (!template) {
    return <div className="text-muted">No template selected.</div>;
  }

  const sections = post.sections || {};

  const handleUpdateSlot = (key, value) => {
    updatePost(prev => ({
      sections: {
        ...prev.sections,
        [key]: value
      }
    }));
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Title & Excerpt are always available */}
      <div className="flex flex-col gap-4 border-b border-border pb-8">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-ink">Title</span>
          <input 
            type="text" 
            className="border border-border-strong rounded-md p-2 text-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={post.title}
            onChange={(e) => updatePost({ title: e.target.value })}
            placeholder="Post Title"
          />
        </label>
        
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-ink">Excerpt <span className="text-muted font-normal">(optional)</span></span>
          <textarea 
            className="border border-border-strong rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
            rows={3}
            value={post.excerpt}
            onChange={(e) => updatePost({ excerpt: e.target.value })}
            placeholder="A short summary for the index..."
          />
        </label>
      </div>

      {template.slots.map(slot => (
        <div key={slot.key}>
          {slot.repeatable ? (
            <RepeatableSlot 
              slot={slot} 
              items={sections[slot.key] || []}
              onChange={(items) => handleUpdateSlot(slot.key, items)}
            />
          ) : (
            <SlotField 
              slot={slot} 
              value={sections[slot.key] || ''}
              onChange={(val) => handleUpdateSlot(slot.key, val)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
