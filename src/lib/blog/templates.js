const generateId = () => crypto.randomUUID();

const sharedHead = [
  { 
    blockType: 'heading', 
    slotLabel: 'Post Header', 
    locked: true, 
    required: true, 
    defaultData: { level: 'h2', text: 'Enter your post title here', align: 'left' } 
  },
  { 
    blockType: 'image', 
    slotLabel: 'Hero Image', 
    locked: true, 
    required: true, 
    defaultData: { 
      width: 'full', 
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      alt: 'Hero placeholder',
      caption: 'Replace with your hero image'
    } 
  }
];

const sharedTail = [
  { 
    blockType: 'relatedPosts', 
    slotLabel: 'Related Posts', 
    locked: true, 
    required: false, 
    defaultData: { heading: 'Keep reading', count: 3, mode: 'auto-by-tag' } 
  },
  { 
    blockType: 'newsletter', 
    slotLabel: 'Newsletter Inline', 
    locked: true, 
    required: false, 
    defaultData: { heading: 'Get more like this', body: 'Subscribe to our newsletter.', theme: 'mint' } 
  }
];

export const templates = {
  'how-to': {
    name: 'How-to (procedural)',
    description: 'Do X in N steps. Reader wants the path, not the theory.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'keyTakeaways', 
        slotLabel: 'The short version', 
        locked: true, 
        required: true, 
        defaultData: { 
          kicker: 'The short version',
          items: [{text: 'Step 1: Preparation'}, {text: 'Step 2: Execution'}, {text: 'Step 3: Review'}]
        } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Lead paragraph', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>State the problem you are solving in one concise paragraph. Avoid long introductions and get straight to the point.</p>', size: 'lead' } 
      },
      { 
        blockType: 'steps', 
        slotLabel: 'Steps sequence', 
        locked: true, 
        required: true, 
        defaultData: { 
          variant: 'numbered-circle',
          steps: [
            {title: 'First step', body: 'Detailed instructions for the first step.'},
            {title: 'Second step', body: 'Detailed instructions for the second step.'},
            {title: 'Final step', body: 'Detailed instructions for the final step.'}
          ]
        } 
      },
      { 
        blockType: 'quote', 
        slotLabel: 'Pull quote', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'pull', text: 'A memorable insight that reframes why this process matters.', attribution: 'Expert Name' } 
      },
      { 
        blockType: 'list', 
        slotLabel: 'Common mistakes', 
        locked: true, 
        required: false, 
        defaultData: { 
          style: 'cross',
          items: [{html: 'Skipping the preparation phase', marker: 'cross'}, {html: 'Ignoring edge cases', marker: 'cross'}]
        } 
      },
      { 
        blockType: 'faq', 
        slotLabel: 'Edge cases (FAQ)', 
        locked: true, 
        required: false, 
        defaultData: {
          items: [{q: 'What if I encounter an error?', a: 'Check your configuration and try again.'}]
        } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Product Tie-in', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'ink', heading: 'Ready to start?', body: 'Use our tool to automate this entire process.', buttonLabel: 'Get Started' } 
      },
      ...sharedTail
    ]
  },
  'listicle': {
    name: 'Listicle (ranked / enumerated)',
    description: 'N best/worst X. Reader is comparing.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'text', 
        slotLabel: 'Lead (ranking criteria)', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>We evaluated the top options based on performance, cost, and ease of use. Here is how they rank, from best to worst.</p>' } 
      },
      { 
        blockType: 'toc', 
        slotLabel: 'Table of Contents', 
        locked: true, 
        required: false, 
        defaultData: { position: 'inline' } 
      },
      // Repeating Unit
      { 
        blockType: 'heading', 
        slotLabel: 'Item Heading', 
        locked: true, 
        required: true, 
        repeatingGroup: 'listicle-item', 
        defaultData: { level: 'h3', text: '1. Top Choice Option' } 
      },
      { 
        blockType: 'card', 
        slotLabel: 'Item Card', 
        locked: true, 
        required: true, 
        repeatingGroup: 'listicle-item', 
        defaultData: { variant: 'inline' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Item Verdict', 
        locked: true, 
        required: true, 
        repeatingGroup: 'listicle-item', 
        defaultData: { html: '<p>A brief 80-word verdict on why this item earned its rank on the list.</p>' } 
      },
      { 
        blockType: 'divider', 
        slotLabel: 'Item Divider', 
        locked: true, 
        required: false, 
        repeatingGroup: 'listicle-item', 
        defaultData: { variant: 'dots' } 
      },
      
      { 
        blockType: 'table', 
        slotLabel: 'Comparison Table', 
        locked: true, 
        required: false, 
        defaultData: {
          columns: [{label: 'Option', align: 'left'}, {label: 'Score', align: 'center'}, {label: 'Price', align: 'right'}],
          rows: [{cells: [{text: 'Top Choice'}, {text: '9.5/10'}, {text: '$99'}]}]
        } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'mint', heading: 'Try the winner', buttonLabel: 'View Pricing' } 
      },
      ...sharedTail
    ]
  },
  'review': {
    name: 'Card/product review',
    description: 'Single-subject deep dive — one product, fully evaluated.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'callout', 
        slotLabel: 'Headline stat', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'stat', figure: '$1,400+', title: 'in estimated first-year value', body: 'A premier option for power users.' } 
      },
      { 
        blockType: 'keyTakeaways', 
        slotLabel: 'Good for', 
        locked: true, 
        required: true, 
        defaultData: { kicker: 'Good for', items: [{text: 'Power users'}, {text: 'Enterprise teams'}] } 
      },
      { 
        blockType: 'keyTakeaways', 
        slotLabel: 'Skip if', 
        locked: true, 
        required: true, 
        defaultData: { kicker: 'Skip if', items: [{text: 'Budget conscious'}, {text: 'Solo founders'}] } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Full narrative case', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Write your comprehensive narrative case here. Cover the main benefits, the user experience, and who should ultimately buy this product.</p>' } 
      },
      { 
        blockType: 'table', 
        slotLabel: 'Fee/benefit breakdown', 
        locked: true, 
        required: true, 
        defaultData: { 
          firstColSticky: true,
          columns: [{label: 'Benefit', align: 'left'}, {label: 'Value', align: 'left'}],
          rows: [{cells: [{text: 'Annual Credit'}, {text: '$200'}]}]
        } 
      },
      { 
        blockType: 'steps', 
        slotLabel: 'Timeline (credits payout)', 
        locked: true, 
        required: false, 
        defaultData: { 
          variant: 'timeline',
          steps: [{title: 'Month 1', body: 'Unlock the welcome bonus.'}, {title: 'Month 6', body: 'Utilize the mid-year credits.'}]
        } 
      },
      { 
        blockType: 'quote', 
        slotLabel: 'User Quote', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'card', text: 'This product completely transformed my daily workflow.', attribution: 'Real User' } 
      },
      { 
        blockType: 'card', 
        slotLabel: 'Alternatives', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'compare-row' } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'ink', heading: 'Ready to apply?', buttonLabel: 'Apply Now' } 
      },
      ...sharedTail
    ]
  },
  'comparison': {
    name: 'Comparison ("X vs Y")',
    description: 'Two options, reader is deciding between them.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'callout', 
        slotLabel: 'One-line verdict', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'info', title: 'The Verdict', body: 'Pick Option X for speed; pick Option Y for flexibility.' } 
      },
      { 
        blockType: 'table', 
        slotLabel: 'Side-by-side specs', 
        locked: true, 
        required: true, 
        defaultData: {
          columns: [{label: 'Feature', align: 'left'}, {label: 'Option X', align: 'center'}, {label: 'Option Y', align: 'center'}],
          rows: [{cells: [{text: 'Pricing'}, {text: '$10/mo'}, {text: '$15/mo'}]}]
        } 
      },
      { 
        blockType: 'columns', 
        slotLabel: 'Strengths (2 columns)', 
        locked: true, 
        required: true, 
        defaultData: { count: 2, ratio: '1:1' } 
      },
      { 
        blockType: 'heading', 
        slotLabel: 'Tiebreaker Heading', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h2', text: 'The tiebreaker' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Tiebreaker explained', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Explain the single most important factor that decides the winner between these two options.</p>' } 
      },
      { 
        blockType: 'faq', 
        slotLabel: 'Disambiguation FAQ', 
        locked: true, 
        required: false, 
        defaultData: {
          items: [{q: 'Can I switch from X to Y later?', a: 'Yes, both platforms offer migration tools.'}]
        } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'outline', heading: 'Still undecided?', body: 'Read our full individual reviews.', buttonLabel: 'Read Reviews' } 
      },
      ...sharedTail
    ]
  },
  'news': {
    name: 'News / explainer',
    description: 'A change happened, here\'s what it means.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'callout', 
        slotLabel: 'What changed', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'warn', title: 'Update', body: 'Briefly summarize the policy shift or news event here.' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'The announcement', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Provide the factual details of the announcement. Keep it short and objective.</p>' } 
      },
      { 
        blockType: 'table', 
        slotLabel: 'Before vs. after', 
        locked: true, 
        required: true, 
        defaultData: {
          columns: [{label: 'Term', align: 'left'}, {label: 'Before', align: 'left'}, {label: 'After', align: 'left'}],
          rows: [{cells: [{text: 'Annual Fee'}, {text: '$95'}, {text: '$150'}]}]
        } 
      },
      { 
        blockType: 'heading', 
        slotLabel: 'What this means for you', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h3', text: 'What this means for you' } 
      },
      { 
        blockType: 'list', 
        slotLabel: 'Implications', 
        locked: true, 
        required: true, 
        defaultData: { 
          style: 'bullet',
          items: [{html: 'If you have Option A, your rate will change.'}, {html: 'If you have Option B, no action is required.'}]
        } 
      },
      { 
        blockType: 'sources', 
        slotLabel: 'Primary Sources', 
        locked: true, 
        required: true, 
        defaultData: { 
          position: 'promoted',
          items: [{text: 'Official Press Release from Company XYZ'}]
        } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'mint', heading: 'Check your account', buttonLabel: 'Login' } 
      },
      ...sharedTail
    ]
  }
};

/**
 * Helper to generate a new array of blocks for a post given a template ID.
 */
export function generateBlocksFromTemplate(templateId) {
  const template = templates[templateId];
  if (!template) return [];
  
  return template.slots.map(slot => ({
    id: generateId(),
    type: slot.blockType,
    data: { ...slot.defaultData },
    locked: slot.locked,
    required: slot.required,
    slotLabel: slot.slotLabel,
    repeatingGroup: slot.repeatingGroup || null
  }));
}
