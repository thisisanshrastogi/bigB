import { z } from 'zod';
import { BlockDefinition, Block, Diagnostic } from '../types';
import React from 'react';

const TextContentSchema = z.object({
  html: z.string(),
  dropcap: z.boolean().default(false)
});

type TextContent = z.infer<typeof TextContentSchema>;

export const TextBlock: BlockDefinition<TextContent> = {
  type: 'text',
  name: 'Text',
  group: 'Text',
  icon: 'type',
  summary: 'Standard body text',
  
  contentSchema: TextContentSchema,
  styleKeys: ['typeScale', 'ink', 'width', 'spaceAbove'],
  
  defaults: {
    content: { html: '', dropcap: false },
    style: { emphasis: 'normal' }
  },
  
  emphasisMap: {
    quiet: { typeScale: 'sm', ink: 'ink/secondary' },
    normal: {},
    loud: { typeScale: 'lg', ink: 'ink/secondary' }
  },

  controls: [
    {
      name: 'Content',
      controls: [
        { kind: 'richtext', path: 'html', label: 'Text', marks: ['bold', 'italic', 'code', 'link', 'highlight', 'footnoteRef'] }
      ]
    },
    {
      name: 'Appearance',
      controls: [
        { 
          kind: 'segmented', 
          path: 'emphasis', 
          label: 'Emphasis', 
          options: [
            { value: 'quiet', label: 'Small' },
            { value: 'normal', label: 'Body' },
            { value: 'loud', label: 'Lead' }
          ] 
        },
        { kind: 'toggle', path: 'dropcap', label: 'Drop cap' }
      ]
    }
  ],

  intents: {
    toLead: {
      label: 'Make it a lead',
      phrases: ['lead', 'standfirst', 'intro text'],
      scope: 'style',
      undoLabel: 'Undid: make lead',
      apply: (block: Block<TextContent>) => ({ style: { ...block.style, emphasis: 'loud' } })
    },
    toBody: {
      label: 'Make it body text',
      phrases: ['normal text', 'regular text'],
      scope: 'style',
      undoLabel: 'Undid: make body',
      apply: (block: Block<TextContent>) => ({ style: { ...block.style, emphasis: 'normal' } })
    }
  },

  describe: (block: Block<TextContent>) => {
    // Return first 48 chars of plain text version of html
    const plainText = block.content.html.replace(/<[^>]+>/g, '').trim();
    const snippet = plainText.substring(0, 48) + (plainText.length > 48 ? '...' : '');
    return `Text — ${snippet || 'Empty'}`;
  },

  validate: (block: Block<TextContent>): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    if (!block.content.html.trim()) {
      diagnostics.push({ type: 'warning', message: 'Text block is empty', blockId: block.id });
    }
    // Checking for link with empty href could be done here by regex on html
    if (/<a[^>]*href=["']\s*["'][^>]*>/i.test(block.content.html)) {
      diagnostics.push({ type: 'warning', message: 'Link with empty href found', blockId: block.id });
    }
    return diagnostics;
  },

  wordCount: (content: TextContent) => {
    return content.html.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;
  },

  render: ({ content, style, editing }) => {
    // This assumes resolveStyle has already been run and 'style' has final values like typeScale: 'sm', ink: 'ink/secondary'
    
    // Convert style keys to CSS Custom Property references or Tailwind classes mapped to CSS variables
    const inlineStyle: React.CSSProperties = {
      color: style.ink ? `var(--color-${style.ink.replace('/', '-')})` : 'inherit',
      fontSize: style.typeScale ? `var(--type-scale-${style.typeScale}-size)` : 'inherit',
      lineHeight: style.typeScale ? `var(--type-scale-${style.typeScale}-line)` : 'inherit',
      marginTop: style.spaceAbove ? `var(--space-${style.spaceAbove})` : 0,
      maxWidth: style.width ? `var(--type-measure-${style.width})` : 'var(--type-measure-base)',
      fontFamily: 'var(--type-body-family)',
      fontWeight: 'var(--type-body-weight)',
      textWrap: 'pretty'
    };

    return (
      <div 
        style={inlineStyle} 
        className={`amalgamic-text-block ${content.dropcap ? 'has-dropcap' : ''} ${editing ? 'is-editing' : ''}`}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }
};
