import HeadingBlock from './HeadingBlock';
import TextBlock from './TextBlock';
import ListBlock from './ListBlock';
import QuoteBlock from './QuoteBlock';
import DividerBlock from './DividerBlock';
import ImageBlock from './ImageBlock';
import GalleryBlock from './GalleryBlock';
import EmbedBlock from './EmbedBlock';
import KeyTakeawaysBlock from './KeyTakeawaysBlock';
import StepsBlock from './StepsBlock';
import CalloutBlock from './CalloutBlock';
import CtaBlock from './CtaBlock';
import TableBlock from './TableBlock';
import CardBlock from './CardBlock';
import FaqBlock from './FaqBlock';
import SourcesBlock from './SourcesBlock';
import ColumnsBlock from './ColumnsBlock';
import CodeBlock from './CodeBlock';
import NewsletterBlock from './NewsletterBlock';
import RelatedPostsBlock from './RelatedPostsBlock';
import TocBlock from './TocBlock';
import GlossaryBlock from './GlossaryBlock';

export const blockRegistry = {
  heading: { 
    component: HeadingBlock, 
    label: 'Heading', 
    icon: 'M4 6h16M4 12h16M4 18h16',
    defaultData: { level: 'h2', text: '', anchor: '', align: 'left', weight: 'default', inTOC: true },
    editor: [
      { key: 'level', type: 'select', options: [
        { label: 'H2 – Section', value: 'h2' },
        { label: 'H3 – Sub-section', value: 'h3' },
        { label: 'H4 – Minor', value: 'h4' }
      ], label: 'Level' },
      { key: 'align', type: 'toggleGroup', options: [{label: 'Left', value: 'left'}, {label: 'Center', value: 'center'}], label: 'Alignment' },
      { key: 'weight', type: 'toggleGroup', options: [{label: 'Default', value: 'default'}, {label: 'Normal', value: 'normal'}, {label: 'Bold', value: 'bold'}], label: 'Weight' },
      { key: 'text', type: 'text', label: 'Text' },
      { key: 'anchor', type: 'text', label: 'Anchor ID', help: 'For table of contents linking.' },
      { key: 'inTOC', type: 'boolean', label: 'Include in TOC' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (!data.text) issues.push({ level: 'warn', message: 'Heading is empty.' });
      return issues;
    },
    toText: (data = {}) => data.text || ''
  },
  text: { 
    component: TextBlock, 
    label: 'Text', 
    icon: 'M4 6h16M4 12h16M4 18h7',
    defaultData: { html: '', size: 'regular', dropcap: false },
    editor: [
      { key: 'size', type: 'toggleGroup', options: [{label: 'Regular', value: 'regular'}, {label: 'Lead', value: 'lead'}], label: 'Text Size' },
      { key: 'dropcap', type: 'boolean', label: 'Use Drop Cap' },
    ],
    validate: () => [], // Always valid
    toText: (data = {}) => data.html?.replace(/<[^>]*>?/gm, '') || ''
  },
  list: { 
    component: ListBlock, 
    label: 'List', 
    icon: 'M4 6h16M4 12h16M4 18h16',
    defaultData: { style: 'bullet', spacing: 'tight', items: [] },
    editor: [
      { key: 'style', type: 'select', options: [
        {label: 'Bullet', value: 'bullet'}, 
        {label: 'Numbered', value: 'numbered'},
        {label: 'Check', value: 'check'},
        {label: 'Cross', value: 'cross'}
      ], label: 'Style' },
      { key: 'spacing', type: 'toggleGroup', options: [{label: 'Tight', value: 'tight'}, {label: 'Loose', value: 'loose'}], label: 'Spacing' },
      { key: 'items', type: 'repeatable', itemSchema: [ 
        { key: 'html', type: 'richtext', label: 'Item text' },
        { key: 'marker', type: 'select', options: [{label: 'Default', value: ''}, {label: 'Check', value: 'check'}, {label: 'Cross', value: 'cross'}], label: 'Override Marker' }
      ], label: 'Items' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (data.items?.length === 0) issues.push({ level: 'warn', message: 'List is empty.' });
      if ((data.style === 'check' || data.style === 'cross') && !data.items?.some(i => i.marker)) {
         issues.push({ level: 'warn', message: 'Check/cross list has no explicit markers set.' });
      }
      return issues;
    },
    toText: (data = {}) => data.items?.map(i => i?.html || '').join(' ') || ''
  },
  quote: { 
    component: QuoteBlock, 
    label: 'Quote', 
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    defaultData: { text: '', attribution: '', variant: 'pull' },
    editor: [
      { key: 'variant', type: 'toggleGroup', options: [{label: 'Rule', value: 'rule'}, {label: 'Pull', value: 'pull'}, {label: 'Card', value: 'card'}], label: 'Variant' },
      { key: 'text', type: 'textarea', label: 'Quote Text' },
      { key: 'attribution', type: 'text', label: 'Attribution' },
      { key: 'avatar', type: 'image', label: 'Avatar URL (Card variant only)' }
    ],
    validate: () => [],
    toText: (data = {}) => `${data.text || ''} ${data.attribution || ''}`
  },
  divider: { 
    component: DividerBlock, 
    label: 'Divider', 
    icon: 'M20 12H4',
    defaultData: { variant: 'rule' },
    editor: [
      { key: 'variant', type: 'toggleGroup', options: [{label: 'Rule', value: 'rule'}, {label: 'Dots', value: 'dots'}, {label: 'Space', value: 'space'}], label: 'Variant' }
    ],
    validate: () => [],
    toText: () => ''
  },
  image: { 
    component: ImageBlock, 
    label: 'Image', 
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    defaultData: { src: '', alt: '', width: 'narrow', ratio: 'auto', objectFit: 'cover', wash: false, caption: '', link: '', focalPoint: { x: 0.5, y: 0.5 } },
    editor: [
      { key: 'src', type: 'image', label: 'Image Source' },
      { key: 'alt', type: 'text', label: 'Alt Text (Required)' },
      { key: 'caption', type: 'text', label: 'Caption' },
      { key: 'width', type: 'toggleGroup', options: [
        {label: 'Compact', value: 'compact'},
        {label: 'Narrow', value: 'narrow'},
        {label: 'Wide', value: 'wide'},
        {label: 'Full', value: 'full'}
      ], label: 'Width' },
      { key: 'ratio', type: 'select', options: [
        {label: 'Auto (natural)', value: 'auto'},
        {label: '16:9', value: '16:9'},
        {label: '4:3', value: '4:3'},
        {label: '1:1', value: '1:1'}
      ], label: 'Aspect Ratio' },
      { key: 'objectFit', type: 'toggleGroup', options: [
        {label: 'Cover', value: 'cover'},
        {label: 'Contain', value: 'contain'}
      ], label: 'Object Fit' },
      { key: 'wash', type: 'boolean', label: 'Apply Wash Filter' },
      { key: 'link', type: 'text', label: 'Link URL' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (!data.alt) issues.push({ level: 'error', message: 'Image is missing alt text.' });
      return issues;
    },
    toText: (data = {}) => data.alt || ''
  },
  gallery: {
    component: GalleryBlock,
    label: 'Gallery',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    defaultData: { images: [], layout: 'grid-2', gap: 20, captionMode: 'per-item' },
    editor: [
      { key: 'images', type: 'repeatable', itemSchema: [
        { key: 'src', type: 'image', label: 'Image URL' },
        { key: 'alt', type: 'text', label: 'Alt Text (Required)' },
        { key: 'caption', type: 'text', label: 'Caption' }
      ], label: 'Images' },
      { key: 'layout', type: 'toggleGroup', options: [
        {label: 'Grid 2', value: 'grid-2'},
        {label: 'Grid 3', value: 'grid-3'},
        {label: 'Carousel', value: 'carousel'},
        {label: 'Masonry', value: 'masonry'}
      ], label: 'Layout' },
      { key: 'captionMode', type: 'toggleGroup', options: [{label: 'Per Item', value: 'per-item'}, {label: 'Shared', value: 'shared'}], label: 'Caption Mode' },
      { key: 'sharedCaption', type: 'text', label: 'Shared Caption' }
    ],
    validate: (data = {}) => {
      const issues = [];
      const missingAlt = data.images?.filter(img => !img.alt).length || 0;
      if (missingAlt > 0) issues.push({ level: 'error', message: `${missingAlt} image(s) missing alt text.` });
      return issues;
    },
    toText: (data = {}) => data.images?.map(i => i.alt).join(' ') || ''
  },
  embed: { 
    component: EmbedBlock, 
    label: 'Video / Embed', 
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    defaultData: { url: '', provider: 'youtube', aspect: '16:9', lazy: true, privacyMode: false },
    editor: [
      { key: 'url', type: 'text', label: 'URL' },
      { key: 'provider', type: 'select', options: [
        {label: 'YouTube', value: 'youtube'},
        {label: 'Vimeo', value: 'vimeo'},
        {label: 'Loom', value: 'loom'},
        {label: 'X (Twitter)', value: 'x'},
        {label: 'Generic oEmbed', value: 'generic-oembed'}
      ], label: 'Provider' },
      { key: 'aspect', type: 'select', options: [
        {label: '16:9', value: '16:9'},
        {label: '1:1', value: '1:1'},
        {label: 'Auto', value: 'auto'}
      ], label: 'Aspect Ratio' },
      { key: 'caption', type: 'text', label: 'Caption' },
      { key: 'lazy', type: 'boolean', label: 'Lazy Load (Poster)' },
      { key: 'privacyMode', type: 'boolean', label: 'Privacy-Enhanced Mode' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (!data.url) issues.push({ level: 'error', message: 'Embed URL is required.' });
      return issues;
    },
    toText: () => ''
  },
  keyTakeaways: {
    component: KeyTakeawaysBlock,
    label: 'Key Takeaways',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    defaultData: { kicker: 'The short version', items: [], numbered: false, variant: 'card' },
    editor: [
      { key: 'kicker', type: 'text', label: 'Kicker' },
      { key: 'numbered', type: 'boolean', label: 'Numbered' },
      { key: 'variant', type: 'toggleGroup', options: [{label: 'Card', value: 'card'}, {label: 'Rule', value: 'rule'}], label: 'Variant' },
      { key: 'items', type: 'repeatable', itemSchema: [{ key: 'text', type: 'text', label: 'Takeaway text' }], label: 'Takeaways' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (data.items?.length === 0) issues.push({ level: 'warn', message: 'Key takeaways block is empty.' });
      return issues;
    },
    toText: (data = {}) => data.items?.map(i => i.text).join(' ') || ''
  },
  steps: { 
    component: StepsBlock, 
    label: 'Steps', 
    icon: 'M4 6h16M4 12h16M4 18h16',
    defaultData: { steps: [], start: 1, variant: 'numbered-circle' },
    editor: [
      { key: 'variant', type: 'toggleGroup', options: [{label: 'Numbered Circle', value: 'numbered-circle'}, {label: 'Timeline', value: 'timeline'}], label: 'Variant' },
      { key: 'start', type: 'number', label: 'Start Number' },
      { key: 'steps', type: 'repeatable', itemSchema: [
        { key: 'title', type: 'text', label: 'Title' },
        { key: 'body', type: 'textarea', label: 'Body' },
        { key: 'image', type: 'image', label: 'Image URL' }
      ], label: 'Steps' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if ((data.steps?.length || 0) < 2) issues.push({ level: 'warn', message: 'Steps sequence has fewer than 2 items.' });
      return issues;
    },
    toText: (data = {}) => data.steps?.map(i => `${i.title || ''} ${i.body || ''}`).join(' ') || ''
  },
  callout: { 
    component: CalloutBlock, 
    label: 'Callout / Stat', 
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    defaultData: { variant: 'info', title: '', body: '', presentation: 'boxed' },
    editor: [
      { key: 'variant', type: 'toggleGroup', options: [
        {label: 'Info', value: 'info'},
        {label: 'Warn', value: 'warn'},
        {label: 'Success', value: 'success'},
        {label: 'Stat', value: 'stat'}
      ], label: 'Variant' },
      { key: 'presentation', type: 'toggleGroup', options: [{label: 'Boxed', value: 'boxed'}, {label: 'Rule', value: 'rule'}], label: 'Presentation' },
      { key: 'figure', type: 'text', label: 'Stat Figure (Stat only)' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'body', type: 'textarea', label: 'Body Text' },
      { key: 'icon', type: 'image', label: 'Custom Icon URL' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (data.variant === 'stat' && !data.figure) issues.push({ level: 'error', message: 'Stat block requires a figure.' });
      return issues;
    },
    toText: (data = {}) => `${data.title || ''} ${data.body || ''}`
  },
  cta: { 
    component: CtaBlock, 
    label: 'Call to Action', 
    icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
    defaultData: { theme: 'ink', layout: 'row', heading: '', body: '', buttonLabel: 'Click Here', href: '#' },
    editor: [
      { key: 'theme', type: 'toggleGroup', options: [
        {label: 'Ink', value: 'ink'},
        {label: 'Mint', value: 'mint'},
        {label: 'Outline', value: 'outline'}
      ], label: 'Theme' },
      { key: 'layout', type: 'toggleGroup', options: [
        {label: 'Row', value: 'row'},
        {label: 'Stacked', value: 'stacked'}
      ], label: 'Layout' },
      { key: 'heading', type: 'text', label: 'Heading' },
      { key: 'body', type: 'textarea', label: 'Body Text' },
      { key: 'buttonLabel', type: 'text', label: 'Button Label' },
      { key: 'href', type: 'text', label: 'Button URL' },
      { key: 'goalName', type: 'text', label: 'Analytics Goal Name' }
    ],
    validate: () => [],
    toText: (data = {}) => `${data.heading || ''} ${data.body || ''}`
  },
  table: { 
    component: TableBlock, 
    label: 'Table', 
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    defaultData: { columns: [], rows: [], firstColSticky: false, zebra: false, presentation: 'boxed', mobileLayout: 'scroll' },
    editor: [
      { key: 'mobileLayout', type: 'toggleGroup', options: [{label: 'Scroll', value: 'scroll'}, {label: 'Stacked', value: 'stacked'}], label: 'Mobile Layout' },
      { key: 'columns', type: 'repeatable', label: 'Columns', itemSchema: [
        { key: 'label', type: 'text', label: 'Header label' },
        { key: 'align', type: 'select', options: [{label: 'Left', value: 'left'}, {label: 'Center', value: 'center'}, {label: 'Right', value: 'right'}], label: 'Align' }
      ]},
      { key: 'rows', type: 'repeatable', label: 'Rows', itemSchema: [
        { key: 'cells', type: 'repeatable', label: 'Cells', itemSchema: [{ key: 'text', type: 'text', label: 'Cell text' }] }
      ]},
      { key: 'firstColSticky', type: 'boolean', label: 'Sticky First Column' },
      { key: 'zebra', type: 'boolean', label: 'Zebra Striping' },
      { key: 'caption', type: 'text', label: 'Caption' },
      { key: 'presentation', type: 'toggleGroup', options: [{label: 'Boxed', value: 'boxed'}, {label: 'Minimal', value: 'minimal'}], label: 'Presentation' }
    ],
    validate: (data = {}) => {
      const issues = [];
      const colCount = data.columns?.length || 0;
      if (data.rows?.some(row => (row.cells?.length || 0) !== colCount)) {
        issues.push({ level: 'warn', message: 'Table rows have mismatched column counts.' });
      }
      return issues;
    },
    toText: () => ''
  },
  card: { 
    component: CardBlock, 
    label: 'Card / Product', 
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    defaultData: { cardId: '', variant: 'inline', showCTA: true },
    editor: [
      { key: 'cardId', type: 'text', label: 'Card ID Reference' },
      { key: 'variant', type: 'toggleGroup', options: [{label: 'Inline', value: 'inline'}, {label: 'Sidebar', value: 'sidebar'}, {label: 'Compare Row', value: 'compare-row'}], label: 'Variant' },
      { key: 'showCTA', type: 'boolean', label: 'Show CTA Button' },
      { key: 'overrideVerdict', type: 'textarea', label: 'Override Verdict Copy' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (!data.cardId) issues.push({ level: 'error', message: 'Card block is missing a valid card reference.' });
      return issues;
    },
    toText: () => ''
  },
  faq: {
    component: FaqBlock,
    label: 'FAQ / Accordion',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    defaultData: { items: [], emitSchema: false },
    editor: [
      { key: 'title', type: 'text', label: 'Section Title' },
      { key: 'items', type: 'repeatable', itemSchema: [
        { key: 'q', type: 'text', label: 'Question' },
        { key: 'a', type: 'textarea', label: 'Answer' }
      ], label: 'Q&A Pairs' },
      { key: 'defaultOpenIndex', type: 'number', label: 'Default Open Index' },
      { key: 'emitSchema', type: 'boolean', label: 'Emit FAQPage JSON-LD' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (data.items?.some(item => !item.a)) issues.push({ level: 'warn', message: 'FAQ has an empty answer.' });
      return issues;
    },
    toText: (data = {}) => data.items?.map(i => `${i.q} ${i.a}`).join(' ') || ''
  },
  sources: {
    component: SourcesBlock,
    label: 'Sources / Footnotes',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    defaultData: { items: [], title: 'Sources', numbered: true },
    editor: [
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'numbered', type: 'boolean', label: 'Numbered' },
      { key: 'position', type: 'select', options: [{label: 'Default', value: 'default'}, {label: 'Promoted', value: 'promoted'}], label: 'Suggested Position' },
      { key: 'items', type: 'repeatable', itemSchema: [
        { key: 'text', type: 'text', label: 'Citation text' },
        { key: 'url', type: 'text', label: 'URL (optional)' }
      ], label: 'Sources' }
    ],
    validate: () => [],
    toText: (data = {}) => data.items?.map(i => i.text).join(' ') || ''
  },
  columns: {
    component: ColumnsBlock,
    label: 'Columns',
    icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
    defaultData: { count: 2, ratio: '1:1', stackOn: 'mobile', children: [[], []] },
    editor: [
      { key: 'count', type: 'toggleGroup', options: [{label: '2 Columns', value: 2}, {label: '3 Columns', value: 3}], label: 'Column Count' },
      { key: 'ratio', type: 'select', options: [
        {label: '1:1', value: '1:1'},
        {label: '2:1', value: '2:1'},
        {label: '1:2', value: '1:2'}
      ], label: 'Ratio (for 2 cols)' },
      { key: 'stackOn', type: 'toggleGroup', options: [{label: 'Mobile', value: 'mobile'}, {label: 'Tablet', value: 'tablet'}], label: 'Stack Breakpoint' }
    ],
    validate: () => [],
    toText: () => ''
  },
  code: {
    component: CodeBlock,
    label: 'Code',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    defaultData: { language: 'javascript', showLineNumbers: false, code: '' },
    editor: [
      { key: 'language', type: 'text', label: 'Language' },
      { key: 'filename', type: 'text', label: 'Filename' },
      { key: 'showLineNumbers', type: 'boolean', label: 'Show Line Numbers' },
      { key: 'code', type: 'textarea', label: 'Code Content' }
    ],
    validate: () => [],
    toText: (data = {}) => data.code || ''
  },
  newsletter: {
    component: NewsletterBlock,
    label: 'Newsletter Inline',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    defaultData: { heading: '', body: '', theme: 'mint', layout: 'center' },
    editor: [
      { key: 'heading', type: 'text', label: 'Heading' },
      { key: 'body', type: 'textarea', label: 'Body Text' },
      { key: 'listId', type: 'text', label: 'ESP List ID' },
      { key: 'theme', type: 'select', options: [
        {label: 'Mint', value: 'mint'}, 
        {label: 'Ink', value: 'ink'},
        {label: 'Paper', value: 'paper'},
        {label: 'Forest', value: 'forest'}
      ], label: 'Theme' },
      { key: 'layout', type: 'toggleGroup', options: [{label: 'Centered', value: 'center'}, {label: 'Split', value: 'split'}], label: 'Layout' }
    ],
    validate: (data = {}) => {
      const issues = [];
      if (!data.listId) issues.push({ level: 'error', message: 'Newsletter block is missing a List ID.' });
      return issues;
    },
    toText: (data = {}) => `${data.heading || ''} ${data.body || ''}`
  },
  relatedPosts: {
    component: RelatedPostsBlock,
    label: 'Related Posts',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    defaultData: { mode: 'auto-by-tag', count: 3, heading: 'Related reading' },
    editor: [
      { key: 'mode', type: 'toggleGroup', options: [{label: 'Auto (Tags)', value: 'auto-by-tag'}, {label: 'Manual', value: 'manual'}], label: 'Mode' },
      { key: 'heading', type: 'text', label: 'Section Heading' },
      { key: 'count', type: 'number', label: 'Count' },
      { key: 'posts', type: 'text', label: 'Manual Post IDs (Comma separated)' } // Simplified for now
    ],
    validate: () => [],
    toText: () => ''
  },
  toc: {
    component: TocBlock,
    label: 'Anchor / TOC',
    icon: 'M4 6h16M4 12h16M4 18h7',
    defaultData: { depth: 'h2', position: 'rail', sticky: true, railSide: 'left' },
    editor: [
      { key: 'depth', type: 'toggleGroup', options: [{label: 'H2 Only', value: 'h2'}, {label: 'H2 + H3', value: 'h2+h3'}], label: 'Depth' },
      { key: 'position', type: 'toggleGroup', options: [{label: 'Rail', value: 'rail'}, {label: 'Inline', value: 'inline'}], label: 'Position' },
      { key: 'sticky', type: 'boolean', label: 'Sticky in Rail' },
      { key: 'railSide', type: 'toggleGroup', options: [{label: 'Left', value: 'left'}, {label: 'Right', value: 'right'}], label: 'Rail Side' }
    ],
    validate: () => [],
    toText: () => ''
  },
  glossary: { // Keeping glossary even if not explicitly tier 1-4, as it was in original
    component: GlossaryBlock,
    label: 'Glossary',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    defaultData: { term: '', definition: '', layout: 'block' },
    editor: [
      { key: 'term', type: 'text', label: 'Term' },
      { key: 'definition', type: 'richtext', label: 'Definition' },
      { key: 'layout', type: 'toggleGroup', options: [{label: 'Block', value: 'block'}, {label: 'Inline', value: 'inline'}], label: 'Layout' }
    ],
    validate: () => [],
    toText: (data = {}) => `${data.term || ''} ${data.definition?.replace(/<[^>]*>?/gm, '') || ''}`
  }
};
