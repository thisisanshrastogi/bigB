import { z } from 'zod';
import { BlockDefinition, Block, Diagnostic, TocEntry } from '../types';
import React from 'react';

const HeadingContentSchema = z.object({
  level: z.enum(['h2', 'h3', 'h4']),
  text: z.string(),
  inTOC: z.boolean().default(true)
});

type HeadingContent = z.infer<typeof HeadingContentSchema>;

export const HeadingBlock: BlockDefinition<HeadingContent> = {
  type: 'heading',
  name: 'Heading',
  group: 'Text',
  icon: 'heading',
  summary: 'Section heading',
  
  contentSchema: HeadingContentSchema,
  styleKeys: ['align', 'typeFamily', 'typeScale', 'spaceAbove', 'ink'],
  
  defaults: {
    content: { level: 'h2', text: '', inTOC: true },
    style: { emphasis: 'normal', typeFamily: 'display' }
  },
  
  emphasisMap: {
    quiet: { typeScale: 'lg' },
    normal: {},
    loud: { typeScale: '3xl' }
  },

  controls: [
    {
      name: 'Content',
      controls: [
        { kind: 'segmented', path: 'level', label: 'Level', options: [
          { value: 'h2', label: 'H2' },
          { value: 'h3', label: 'H3' },
          { value: 'h4', label: 'H4' }
        ] },
        { kind: 'toggle', path: 'inTOC', label: 'Show in contents' }
      ]
    },
    {
      name: 'Layout',
      controls: [
        { kind: 'segmented', path: 'align', label: 'Alignment', options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' }
        ] }
      ]
    },
    {
      name: 'Advanced',
      collapsed: true,
      controls: [
        { kind: 'text', path: 'anchor', label: 'Anchor ID' },
        { kind: 'action', label: 'Regenerate Anchor', intent: 'regenerateAnchor' }
      ]
    }
  ],

  intents: {
    promote: {
      label: 'Promote heading',
      phrases: ['make this a bigger heading', 'level up'],
      scope: 'structure',
      undoLabel: 'Undid: promote heading',
      apply: (block: Block<HeadingContent>) => {
        const next = block.content.level === 'h4' ? 'h3' : 'h2';
        return { content: { ...block.content, level: next } };
      }
    },
    demote: {
      label: 'Demote heading',
      phrases: ['make this a smaller heading', 'level down'],
      scope: 'structure',
      undoLabel: 'Undid: demote heading',
      apply: (block: Block<HeadingContent>) => {
        const next = block.content.level === 'h2' ? 'h3' : 'h4';
        return { content: { ...block.content, level: next } };
      }
    },
    toggleContents: {
      label: 'Toggle TOC inclusion',
      phrases: ['hide from toc', 'show in contents'],
      scope: 'content',
      undoLabel: 'Undid: toggle TOC',
      apply: (block: Block<HeadingContent>) => {
        return { content: { ...block.content, inTOC: !block.content.inTOC } };
      }
    },
    regenerateAnchor: {
      label: 'Regenerate anchor',
      phrases: ['fix anchor'],
      scope: 'structure',
      undoLabel: 'Undid: regenerate anchor',
      apply: (block: Block<HeadingContent>) => {
        const anchor = block.content.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return { layout: { ...block.layout, anchor } };
      }
    }
  },

  describe: (block: Block<HeadingContent>) => {
    return `${block.content.level.toUpperCase()} — '${block.content.text || 'Empty'}'`;
  },

  validate: (block: Block<HeadingContent>): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    if (!block.content.text.trim()) {
      diagnostics.push({ type: 'error', message: 'Heading text is empty', blockId: block.id });
    }
    // Duplicate anchor check would require post-level context, usually passed down or handled by a higher-level validator.
    return diagnostics;
  },

  wordCount: (content: HeadingContent) => {
    return content.text.trim().split(/\s+/).filter(w => w.length > 0).length;
  },

  toc: (content: HeadingContent): TocEntry[] => {
    if (!content.inTOC) return [];
    const levelMap = { h2: 2, h3: 3, h4: 4 };
    const anchor = content.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return [{ id: anchor, level: levelMap[content.level], title: content.text }];
  },

  render: ({ content, style, editing, ctx }) => {
    const defaultScale = { h2: '2xl', h3: 'xl', h4: 'lg' }[content.level];
    const scale = style.typeScale || defaultScale;
    
    const inlineStyle: React.CSSProperties = {
      color: style.ink ? `var(--color-${style.ink.replace('/', '-')})` : 'inherit',
      fontSize: `var(--type-scale-${scale}-size)`,
      lineHeight: `var(--type-scale-${scale}-line)`,
      marginTop: style.spaceAbove ? `var(--space-${style.spaceAbove})` : 0,
      textAlign: style.align === 'center' ? 'center' : 'left',
      fontFamily: style.typeFamily ? `var(--type-${style.typeFamily}-family)` : 'var(--type-display-family)',
      fontWeight: 'var(--type-display-weight)'
    };

    const Tag = content.level as 'h2' | 'h3' | 'h4';
    // ID comes from layout anchor, falling back to generated one
    const id = ctx?.anchor || content.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    return (
      <Tag 
        id={id}
        style={inlineStyle} 
        className={`amalgamic-heading ${editing ? 'is-editing' : ''}`}
      >
        {content.text || (editing ? 'Heading' : '')}
      </Tag>
    );
  }
};
