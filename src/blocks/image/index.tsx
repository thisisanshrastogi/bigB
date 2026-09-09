import { z } from 'zod';
import { BlockDefinition, Block, Diagnostic } from '../types';
import React from 'react';

const ImageContentSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  ratio: z.enum(['auto', '16:9', '4:3', '1:1']),
  focalPoint: z.object({ x: z.number(), y: z.number() }).optional(),
  link: z.string().optional(),
  wash: z.boolean().default(false)
});

type ImageContent = z.infer<typeof ImageContentSchema>;

export const ImageBlock: BlockDefinition<ImageContent> = {
  type: 'image',
  name: 'Image',
  group: 'Media',
  icon: 'image',
  summary: 'Image with optional caption',
  
  contentSchema: ImageContentSchema,
  styleKeys: ['width', 'radius', 'spaceAbove', 'ink'],
  
  defaults: {
    content: { src: '', alt: '', ratio: 'auto', wash: false },
    style: { emphasis: 'normal' }
  },
  
  emphasisMap: {
    quiet: { width: 'narrow' },
    normal: { width: 'base' },
    loud: { width: 'full', radius: 'none' }
  },

  controls: [
    {
      name: 'Content',
      controls: [
        { kind: 'media', path: 'src', label: 'Image', accept: 'image/*', focalPoint: true },
        { kind: 'text', path: 'alt', label: 'Alt text' },
        { kind: 'action', label: 'Describe with AI', intent: 'suggestAlt' },
        { kind: 'text', path: 'caption', label: 'Caption' }
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
        ] },
        { kind: 'select', path: 'ratio', label: 'Aspect Ratio', options: [
          { value: 'auto', label: 'Auto' },
          { value: '16:9', label: '16:9' },
          { value: '4:3', label: '4:3' },
          { value: '1:1', label: '1:1' }
        ] }
      ]
    },
    {
      name: 'Appearance',
      controls: [
        { kind: 'toggle', path: 'wash', label: 'Wash out image' },
        { kind: 'select', path: 'radius', label: 'Radius', options: [
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' }
        ] }
      ]
    }
  ],

  intents: {
    suggestAlt: {
      label: 'Suggest alt text',
      phrases: ['describe this', 'generate alt text'],
      scope: 'content',
      undoLabel: 'Undid: generate alt text',
      apply: () => {
        // AI execution would be handled by shell, this acts as a stub trigger
        return {};
      }
    },
    bleedFull: {
      label: 'Make full width',
      phrases: ['bleed', 'full width image'],
      scope: 'style',
      undoLabel: 'Undid: full width',
      apply: (block: Block<ImageContent>) => ({ style: { ...block.style, width: 'full', radius: 'none' } })
    },
    crop: {
      label: 'Crop image',
      phrases: ['change crop', 'set ratio'],
      scope: 'content',
      undoLabel: 'Undid: crop image',
      apply: (block: Block<ImageContent>, args?: Record<string, unknown>) => {
        const ratio = (args?.ratio as '16:9' | '4:3' | '1:1' | 'auto') || '16:9';
        return { content: { ...block.content, ratio } };
      }
    },
    unwash: {
      label: 'Remove wash filter',
      phrases: ['unwash', 'remove filter'],
      scope: 'content',
      undoLabel: 'Undid: unwash',
      apply: (block: Block<ImageContent>) => ({ content: { ...block.content, wash: false } })
    }
  },

  describe: (block: Block<ImageContent>) => {
    let desc = `${block.style?.width === 'full' ? 'Full width image' : block.style?.width === 'wide' ? 'Wide image' : 'Image'}, ${block.content.ratio}`;
    if (block.content.wash) desc += ', washed';
    if (!block.content.alt) desc += ' — alt text missing';
    return desc;
  },

  validate: (block: Block<ImageContent>): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    if (!block.content.alt.trim()) {
      diagnostics.push({ type: 'error', message: 'Alt text is missing', blockId: block.id });
    }
    // "warn if intrinsic width < 1200 and width: 'full'" - requires context, handled in shell where image is loaded.
    return diagnostics;
  },

  wordCount: (content: ImageContent) => {
    return content.caption ? content.caption.split(/\s+/).filter(w => w.length > 0).length : 0;
  },

  render: ({ content, style, editing }) => {
    const wrapperStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: style.width === 'full' ? '100%' : `var(--type-measure-${style.width || 'base'})`,
      margin: '0 auto',
      marginTop: style.spaceAbove ? `var(--space-${style.spaceAbove})` : 0,
    };

    const imgStyle: React.CSSProperties = {
      width: '100%',
      height: content.ratio === 'auto' ? 'auto' : '100%',
      aspectRatio: content.ratio !== 'auto' ? content.ratio.replace(':', '/') : undefined,
      objectFit: 'cover',
      objectPosition: content.focalPoint ? `${content.focalPoint.x}% ${content.focalPoint.y}%` : 'center',
      filter: content.wash ? 'saturate(.78) contrast(.95)' : 'none',
      borderRadius: style.radius ? `var(--shape-radius-${style.radius})` : '0',
      display: 'block'
    };

    const captionStyle: React.CSSProperties = {
      fontSize: 'var(--type-scale-xs-size)',
      color: `var(--color-ink-muted)`, // The spec says ink/muted
      marginTop: 'var(--space-2xs)',
      fontFamily: 'var(--type-body-family)',
      textAlign: 'center'
    };

    return (
      <figure style={wrapperStyle} className={`amalgamic-image ${editing ? 'is-editing' : ''}`}>
        {content.src ? (
          <img src={content.src} alt={content.alt} style={imgStyle} />
        ) : (
          <div style={{...imgStyle, backgroundColor: 'var(--color-surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{color: 'var(--color-ink-muted)'}}>No image selected</span>
          </div>
        )}
        {content.caption && <figcaption style={captionStyle}>{content.caption}</figcaption>}
      </figure>
    );
  }
};
