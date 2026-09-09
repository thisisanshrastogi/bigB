import { z } from 'zod';
import { BlockDefinition, Block, Diagnostic } from '../types';
import React from 'react';

const DividerContentSchema = z.object({
  variant: z.enum(['rule', 'dots', 'space'])
});

type DividerContent = z.infer<typeof DividerContentSchema>;

export const DividerBlock: BlockDefinition<DividerContent> = {
  type: 'divider',
  name: 'Divider',
  group: 'Layout',
  icon: 'minus',
  summary: 'Visual separator or space',
  
  contentSchema: DividerContentSchema,
  styleKeys: ['accent', 'spaceAbove', 'spaceBelow', 'width'],
  
  defaults: {
    content: { variant: 'rule' },
    style: {}
  },
  
  emphasisMap: {
    quiet: {},
    normal: {},
    loud: {}
  },

  controls: [
    {
      name: 'Content',
      controls: [
        { kind: 'thumbnails', path: 'variant', label: 'Variant', options: [
          { value: 'rule', label: 'Rule', svg: '<svg></svg>' },
          { value: 'dots', label: 'Dots', svg: '<svg></svg>' },
          { value: 'space', label: 'Space', svg: '<svg></svg>' }
        ] }
      ]
    },
    {
      name: 'Layout',
      controls: [
        { kind: 'segmented', path: 'width', label: 'Width', options: [
          { value: 'narrow', label: 'Narrow' },
          { value: 'base', label: 'Base' },
          { value: 'wide', label: 'Wide' },
          { value: 'full', label: 'Full' }
        ] }
      ]
    }
  ],

  intents: {
    toSpace: {
      label: 'Make it a space',
      phrases: ['invisible divider', 'just space'],
      scope: 'content',
      undoLabel: 'Undid: convert to space',
      apply: (block: Block<DividerContent>) => ({ content: { ...block.content, variant: 'space' } })
    },
    toDots: {
      label: 'Make it dots',
      phrases: ['dot divider', 'three dots'],
      scope: 'content',
      undoLabel: 'Undid: convert to dots',
      apply: (block: Block<DividerContent>) => ({ content: { ...block.content, variant: 'dots' } })
    }
  },

  describe: (block: Block<DividerContent>) => {
    return `Divider — ${block.content.variant}`;
  },

  validate: (): Diagnostic[] => {
    return [];
  },

  wordCount: () => 0,

  render: ({ content, style, editing }) => {
    const width = style.width ? `var(--type-measure-${style.width})` : 'var(--type-measure-base)';
    const spaceAbove = style.spaceAbove ? `var(--space-${style.spaceAbove})` : 'var(--space-md)';
    const spaceBelow = style.spaceBelow ? `var(--space-${style.spaceBelow})` : 'var(--space-md)';

    const wrapperStyle: React.CSSProperties = {
      width: style.width === 'full' ? '100%' : width,
      margin: `${spaceAbove} auto ${spaceBelow} auto`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: editing && content.variant === 'space' ? 24 : undefined
    };

    if (content.variant === 'rule') {
      return (
        <div style={wrapperStyle} className={`amalgamic-divider ${editing ? 'is-editing' : ''}`}>
          <div style={{ width: '100%', height: 'var(--shape-border-hairline)', backgroundColor: 'var(--color-line-hairline)' }} />
        </div>
      );
    }

    if (content.variant === 'dots') {
      const dotStyle = {
        width: 4, height: 4, borderRadius: '50%', 
        backgroundColor: style.accent ? `var(--color-${style.accent.replace('/', '-')})` : 'var(--color-line-accent)'
      };
      return (
        <div style={{...wrapperStyle, gap: 'var(--space-sm)'}} className={`amalgamic-divider ${editing ? 'is-editing' : ''}`}>
          <div style={dotStyle} />
          <div style={dotStyle} />
          <div style={dotStyle} />
        </div>
      );
    }

    // space
    return (
      <div style={wrapperStyle} className={`amalgamic-divider ${editing ? 'is-editing' : ''}`}>
        {editing && <div style={{ border: '1px dashed var(--color-line-hairline)', width: '100%', height: 1 }} />}
      </div>
    );
  }
};
