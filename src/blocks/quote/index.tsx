import { z } from 'zod';
import { BlockDefinition, Block, Diagnostic } from '../types';
import React from 'react';

const QuoteContentSchema = z.object({
  text: z.string(),
  attribution: z.string().optional(),
  avatar: z.string().optional()
});

type QuoteContent = z.infer<typeof QuoteContentSchema>;

export const QuoteBlock: BlockDefinition<QuoteContent> = {
  type: 'quote',
  name: 'Quote',
  group: 'Text',
  icon: 'quote',
  summary: 'Pull quote or blockquote',
  
  contentSchema: QuoteContentSchema,
  styleKeys: ['presentation', 'border', 'fill', 'ink', 'align', 'radius', 'padding', 'typeScale', 'spaceAbove'],
  
  defaults: {
    content: { text: '' },
    style: { emphasis: 'normal' }
  },
  
  emphasisMap: {
    quiet: { presentation: 'rule', border: 'left-strong', typeScale: 'lg' },
    normal: { presentation: 'rule', border: 'top-bottom-hairline', typeScale: '2xl', align: 'center' },
    loud: { presentation: 'boxed', fill: 'surface/accent', radius: 'lg', typeScale: '2xl' }
  },

  controls: [
    {
      name: 'Content',
      controls: [
        { kind: 'longtext', path: 'text', label: 'Quote text', rows: 4 },
        { kind: 'text', path: 'attribution', label: 'Attribution' },
        { kind: 'media', path: 'avatar', label: 'Avatar', accept: 'image/*', focalPoint: false } // visibleWhen presentation = boxed
      ]
    },
    {
      name: 'Appearance',
      controls: [
        { kind: 'segmented', path: 'emphasis', label: 'Emphasis', options: [
          { value: 'quiet', label: 'Rule' },
          { value: 'normal', label: 'Pull' },
          { value: 'loud', label: 'Card' }
        ] },
        { kind: 'select', path: 'presentation', label: 'Presentation', options: [
          { value: 'bare', label: 'Bare' },
          { value: 'rule', label: 'Rule' },
          { value: 'boxed', label: 'Boxed' }
        ] }
      ]
    }
  ],

  intents: {
    toPullQuote: {
      label: 'Make it a pull quote',
      phrases: ['pull quote', 'center quote'],
      scope: 'style',
      undoLabel: 'Undid: convert to pull quote',
      apply: (block: Block<QuoteContent>) => ({ style: { ...block.style, emphasis: 'normal' } })
    },
    toCard: {
      label: 'Make it a card quote',
      phrases: ['card quote', 'boxed quote'],
      scope: 'style',
      undoLabel: 'Undid: convert to card quote',
      apply: (block: Block<QuoteContent>) => ({ style: { ...block.style, emphasis: 'loud' } })
    },
    attributeTo: {
      label: 'Set attribution',
      phrases: ['attribute', 'set author'],
      scope: 'content',
      undoLabel: 'Undid: set attribution',
      apply: (block: Block<QuoteContent>, args?: Record<string, unknown>) => {
        const name = (args?.name as string) || '';
        return { content: { ...block.content, attribution: name } };
      }
    }
  },

  describe: (block: Block<QuoteContent>) => {
    let snippet = block.content.text.substring(0, 40);
    if (block.content.text.length > 40) snippet += '...';
    return `Quote — "${snippet || 'Empty'}" ${block.content.attribution ? `— ${block.content.attribution}` : ''}`;
  },

  validate: (block: Block<QuoteContent>): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    if (!block.content.text.trim()) {
      diagnostics.push({ type: 'warning', message: 'Quote text is empty', blockId: block.id });
    }
    return diagnostics;
  },

  wordCount: (content: QuoteContent) => {
    const count = content.text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const attrCount = content.attribution ? content.attribution.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    return count + attrCount;
  },

  render: ({ content, style, editing }) => {
    const scale = style.typeScale || 'lg';
    
    let wrapperStyles: React.CSSProperties = {
      color: style.ink ? `var(--color-${style.ink.replace('/', '-')})` : 'inherit',
      fontSize: `var(--type-scale-${scale}-size)`,
      lineHeight: `var(--type-scale-${scale}-line)`,
      marginTop: style.spaceAbove ? `var(--space-${style.spaceAbove})` : 'var(--space-md)',
      marginBottom: 'var(--space-md)',
      textAlign: style.align === 'center' ? 'center' : 'left',
      fontFamily: 'var(--type-display-family)',
      fontStyle: 'italic',
      position: 'relative'
    };

    if (style.presentation === 'boxed') {
      wrapperStyles = {
        ...wrapperStyles,
        backgroundColor: style.fill ? `var(--color-${style.fill.replace('/', '-')})` : 'transparent',
        borderRadius: style.radius ? `var(--shape-radius-${style.radius})` : 0,
        padding: style.padding ? `var(--space-${style.padding})` : 'var(--space-md)'
      };
    } else if (style.presentation === 'rule') {
      if (style.border === 'left-strong') {
        wrapperStyles.borderLeft = `var(--shape-border-strong) solid var(--color-line-strong)`;
        wrapperStyles.paddingLeft = 'var(--space-md)';
      } else if (style.border === 'top-bottom-hairline') {
        wrapperStyles.borderTop = `var(--shape-border-hairline) solid var(--color-line-hairline)`;
        wrapperStyles.borderBottom = `var(--shape-border-hairline) solid var(--color-line-hairline)`;
        wrapperStyles.paddingTop = 'var(--space-md)';
        wrapperStyles.paddingBottom = 'var(--space-md)';
      }
    }

    const showAvatar = style.presentation === 'boxed' && content.avatar;
    const isCenteredPull = style.presentation === 'rule' && style.align === 'center';

    return (
      <blockquote style={wrapperStyles} className={`amalgamic-quote ${editing ? 'is-editing' : ''}`}>
        {isCenteredPull && (
          <div style={{
            width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--color-line-accent)', 
            margin: '0 auto var(--space-sm) auto'
          }} />
        )}
        <div style={{ marginBottom: content.attribution ? 'var(--space-xs)' : 0 }}>
          {content.text || (editing ? 'Quote text...' : '')}
        </div>
        {content.attribution && (
          <footer style={{ 
            fontSize: 'var(--type-scale-sm-size)', 
            fontFamily: 'var(--type-body-family)', 
            fontStyle: 'normal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: style.align === 'center' ? 'center' : 'flex-start',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-sm)'
          }}>
            {showAvatar && <img src={content.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />}
            — {content.attribution}
          </footer>
        )}
      </blockquote>
    );
  }
};
