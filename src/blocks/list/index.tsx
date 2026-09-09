import { z } from 'zod';
import { BlockDefinition, Block, Diagnostic } from '../types';
import React from 'react';

// Using a lazy schema for recursive children
const ListItemSchema: z.ZodType<any> = z.lazy(() => z.object({
  html: z.string(),
  marker: z.enum(['check', 'cross']).optional(),
  children: z.array(ListItemSchema).optional()
}));

const ListContentSchema = z.object({
  style: z.enum(['bullet', 'numbered', 'check', 'cross']),
  items: z.array(ListItemSchema),
  spacing: z.enum(['tight', 'loose'])
});

type ListItem = { html: string; marker?: 'check' | 'cross'; children?: ListItem[] };
type ListContent = z.infer<typeof ListContentSchema>;

export const ListBlock: BlockDefinition<ListContent> = {
  type: 'list',
  name: 'List',
  group: 'Text',
  icon: 'list',
  summary: 'Bullet, numbered, or checklist',
  
  contentSchema: ListContentSchema,
  styleKeys: ['accent', 'typeScale', 'ink', 'spaceAbove'],
  
  defaults: {
    content: { style: 'bullet', items: [{ html: '' }], spacing: 'tight' },
    style: { emphasis: 'normal' }
  },
  
  emphasisMap: {
    quiet: {},
    normal: {},
    loud: {} // No specific emphasis map described, defaulting to empty
  },

  controls: [
    {
      name: 'Content',
      controls: [
        { kind: 'thumbnails', path: 'style', label: 'Style', options: [
          { value: 'bullet', label: 'Bullet', svg: '<svg></svg>' },
          { value: 'numbered', label: 'Numbered', svg: '<svg></svg>' },
          { value: 'check', label: 'Checklist', svg: '<svg></svg>' },
          { value: 'cross', label: 'Cross', svg: '<svg></svg>' }
        ] },
        { kind: 'list', path: 'items', label: 'Items', addLabel: 'Add item', reorder: true, itemControls: [
          { kind: 'richtext', path: 'html', label: 'Text', marks: ['bold', 'italic', 'code', 'link'] },
          { kind: 'segmented', path: 'marker', label: 'Marker Override', options: [
            { value: 'check', label: 'Check' },
            { value: 'cross', label: 'Cross' }
          ] } // Ideally this is visibleWhen style is check/cross
        ] }
      ]
    },
    {
      name: 'Layout',
      controls: [
        { kind: 'segmented', path: 'spacing', label: 'Spacing', options: [
          { value: 'tight', label: 'Tight' },
          { value: 'loose', label: 'Loose' }
        ] }
      ]
    }
  ],

  intents: {
    toNumbered: {
      label: 'Make numbered',
      phrases: ['numbered list', 'convert to numbered'],
      scope: 'content',
      undoLabel: 'Undid: convert to numbered list',
      apply: (block: Block<ListContent>) => ({ content: { ...block.content, style: 'numbered' } })
    },
    toChecklist: {
      label: 'Make checklist',
      phrases: ['checklist', 'convert to checklist'],
      scope: 'content',
      undoLabel: 'Undid: convert to checklist',
      apply: (block: Block<ListContent>) => ({ content: { ...block.content, style: 'check' } })
    },
    flipMarkers: {
      label: 'Flip markers to crosses',
      phrases: ['make these crosses', 'mark as failed'],
      scope: 'content',
      undoLabel: 'Undid: flip markers',
      apply: (block: Block<ListContent>) => {
        if (block.content.style !== 'check' && block.content.style !== 'cross') return {};
        const flip = (items: ListItem[]): ListItem[] => items.map(item => ({
          ...item,
          marker: item.marker === 'check' ? 'cross' : (item.marker === 'cross' ? 'check' : undefined),
          children: item.children ? flip(item.children) : undefined
        }));
        return { content: { ...block.content, style: block.content.style === 'check' ? 'cross' : 'check', items: flip(block.content.items) } };
      }
    },
    flatten: {
      label: 'Flatten list',
      phrases: ['flatten', 'un-nest all'],
      scope: 'content',
      undoLabel: 'Undid: flatten list',
      apply: (block: Block<ListContent>) => {
        const flatItems: ListItem[] = [];
        const flatten = (items: ListItem[]) => {
          for (const item of items) {
            flatItems.push({ html: item.html, marker: item.marker });
            if (item.children) flatten(item.children);
          }
        };
        flatten(block.content.items);
        return { content: { ...block.content, items: flatItems } };
      }
    }
  },

  describe: (block: Block<ListContent>) => {
    return `${block.content.items.length} items, ${block.content.style} style`;
  },

  validate: (block: Block<ListContent>): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    if (block.content.style === 'check' || block.content.style === 'cross') {
      const allDefault = block.content.items.every(item => !item.marker);
      if (allDefault) {
        diagnostics.push({ type: 'warning', message: 'Check/cross list but every marker is default', blockId: block.id });
      }
    }
    return diagnostics;
  },

  wordCount: (content: ListContent) => {
    let count = 0;
    const countWords = (items: ListItem[]) => {
      for (const item of items) {
        count += item.html.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;
        if (item.children) countWords(item.children);
      }
    };
    countWords(content.items);
    return count;
  },

  render: ({ content, style, editing }) => {
    const scale = style.typeScale || 'base';
    
    const listStyle: React.CSSProperties = {
      color: style.ink ? `var(--color-${style.ink.replace('/', '-')})` : 'inherit',
      fontSize: `var(--type-scale-${scale}-size)`,
      lineHeight: `var(--type-scale-${scale}-line)`,
      marginTop: style.spaceAbove ? `var(--space-${style.spaceAbove})` : 0,
      fontFamily: 'var(--type-body-family)',
      fontWeight: 'var(--type-body-weight)',
      listStyle: 'none',
      paddingLeft: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: content.spacing === 'tight' ? 'var(--space-2xs)' : 'var(--space-sm)'
    };

    const renderItem = (item: ListItem, index: number, depth: number = 0) => {
      const isCheckOrCross = content.style === 'check' || content.style === 'cross';
      const actualMarker = item.marker || content.style;
      
      let markerContent;
      if (actualMarker === 'bullet') {
        markerContent = (
          <span style={{ 
            display: 'inline-block', width: 6, height: 6, borderRadius: '50%', 
            backgroundColor: style.accent ? `var(--color-${style.accent.replace('/', '-')})` : 'var(--color-line-accent)',
            marginTop: '0.55em', marginRight: 'var(--space-sm)', flexShrink: 0
          }} />
        );
      } else if (actualMarker === 'numbered') {
        markerContent = (
          <span style={{
            fontFamily: 'var(--type-display-family)', 
            color: style.accent ? `var(--color-${style.accent.replace('/', '-')})` : 'var(--color-ink-accent)',
            fontVariantNumeric: 'tabular-nums',
            marginRight: 'var(--space-sm)', flexShrink: 0, minWidth: '1.5em', textAlign: 'right'
          }}>{index + 1}.</span>
        );
      } else {
        // check or cross
        const isCheck = actualMarker === 'check';
        const fillToken = isCheck ? 'surface-accent' : 'surface-warn';
        const inkToken = isCheck ? 'ink-accent' : 'ink-warn';
        markerContent = (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 20, height: 20, borderRadius: '50%',
            backgroundColor: `var(--color-${fillToken})`,
            color: `var(--color-${inkToken})`,
            marginRight: 'var(--space-sm)', marginTop: '2px', flexShrink: 0
          }}>
            {isCheck ? '✓' : '✕'}
          </span>
        );
      }

      return (
        <li key={index} style={{ display: 'flex', alignItems: isCheckOrCross ? 'flex-start' : 'baseline', marginLeft: depth > 0 ? 'var(--space-md)' : 0 }}>
          {markerContent}
          <div style={{ flex: 1 }}>
            <span dangerouslySetInnerHTML={{ __html: item.html || (editing ? 'List item' : '') }} />
            {item.children && item.children.length > 0 && (
              <ul style={{ ...listStyle, marginTop: content.spacing === 'tight' ? 'var(--space-2xs)' : 'var(--space-sm)' }}>
                {item.children.map((child, idx) => renderItem(child, idx, depth + 1))}
              </ul>
            )}
          </div>
        </li>
      );
    };

    const Tag = content.style === 'numbered' ? 'ol' : 'ul';

    return (
      <Tag style={listStyle} className={`amalgamic-list ${editing ? 'is-editing' : ''}`}>
        {content.items.map((item, index) => renderItem(item, index))}
      </Tag>
    );
  }
};
