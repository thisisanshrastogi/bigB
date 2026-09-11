const generateId = () => crypto.randomUUID();

const sharedHead = [
  { 
    blockType: 'heading', 
    slotLabel: 'Post Header', 
    locked: true, 
    required: true, 
    defaultData: { level: 'h2', text: 'Enter your post title here', align: 'left', inTOC: false } 
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
    defaultData: { heading: 'Keep reading', count: 3, mode: 'auto-by-tag', posts: [] } 
  },
  { 
    blockType: 'newsletter', 
    slotLabel: 'Newsletter Inline', 
    locked: true, 
    required: false, 
    defaultData: { heading: 'Get more like this', body: 'Subscribe to our newsletter.', theme: 'mint', layout: 'center', listId: 'default-newsletter' } 
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
          items: [{text: 'Step 1: Preparation'}, {text: 'Step 2: Execution'}, {text: 'Step 3: Review'}],
          numbered: true,
          variant: 'card'
        } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Lead paragraph', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>State the problem you are solving in one concise paragraph. Avoid long introductions and get straight to the point.</p>', size: 'lead', dropcap: false } 
      },
      {
        blockType: 'callout',
        slotLabel: 'Prerequisites',
        locked: true,
        required: false,
        defaultData: {
          variant: 'info',
          presentation: 'boxed',
          title: 'Before you begin',
          body: 'Make sure you have the following tools and permissions ready.'
        }
      },
      { 
        blockType: 'steps', 
        slotLabel: 'Steps sequence', 
        locked: true, 
        required: true, 
        defaultData: { 
          variant: 'numbered-circle',
          start: 1,
          steps: [
            {title: 'First step', body: 'Detailed instructions for the first step.', image: ''},
            {title: 'Second step', body: 'Detailed instructions for the second step.', image: ''},
            {title: 'Final step', body: 'Detailed instructions for the final step.', image: ''}
          ]
        } 
      },
      { 
        blockType: 'quote', 
        slotLabel: 'Pull quote', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'pull', text: 'A memorable insight that reframes why this process matters.', attribution: 'Expert Name', theme: 'mint' } 
      },
      { 
        blockType: 'list', 
        slotLabel: 'Common mistakes', 
        locked: true, 
        required: false, 
        defaultData: { 
          style: 'cross',
          spacing: 'tight',
          items: [{html: 'Skipping the preparation phase', marker: 'cross'}, {html: 'Ignoring edge cases', marker: 'cross'}]
        } 
      },
      { 
        blockType: 'faq', 
        slotLabel: 'Edge cases (FAQ)', 
        locked: true, 
        required: false, 
        defaultData: {
          title: 'Frequently asked questions',
          defaultOpenIndex: 0,
          emitSchema: true,
          items: [{q: 'What if I encounter an error?', a: 'Check your configuration and try again.'}]
        } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Product Tie-in', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'ink', layout: 'row', heading: 'Ready to start?', body: 'Use our tool to automate this entire process.', buttonLabel: 'Get Started', href: '#' } 
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
        defaultData: { html: '<p>We evaluated the top options based on performance, cost, and ease of use. Here is how they rank, from best to worst.</p>', size: 'lead', dropcap: false } 
      },
      {
        blockType: 'table',
        slotLabel: 'Comparison Table',
        locked: true,
        required: false,
        defaultData: {
          firstColSticky: true,
          zebra: true,
          presentation: 'boxed',
          mobileLayout: 'scroll',
          columns: [{label: 'Option', align: 'left'}, {label: 'Score', align: 'center'}, {label: 'Price', align: 'right'}],
          rows: [
            {cells: [{text: 'Top Choice'}, {text: '9.5/10'}, {text: '$99'}]},
            {cells: [{text: 'Runner Up'}, {text: '8.0/10'}, {text: '$79'}]}
          ]
        }
      },
      { 
        blockType: 'heading', 
        slotLabel: 'Item 1 Heading', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h3', text: '1. Top Choice Option', inTOC: true } 
      },
      {
        blockType: 'image',
        slotLabel: 'Item 1 Image',
        locked: true,
        required: true,
        defaultData: { width: 'narrow', ratio: '16:9', objectFit: 'cover', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', alt: 'Option 1 preview', caption: '' }
      },
      { 
        blockType: 'text', 
        slotLabel: 'Item 1 Verdict', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>A brief 80-word verdict on why this item earned its rank on the list.</p>', size: 'regular' } 
      },
      { 
        blockType: 'divider', 
        slotLabel: 'Item Divider', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'dots', height: 'medium' } 
      },
      { 
        blockType: 'heading', 
        slotLabel: 'Item 2 Heading', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h3', text: '2. Runner Up Option', inTOC: true } 
      },
      {
        blockType: 'image',
        slotLabel: 'Item 2 Image',
        locked: true,
        required: true,
        defaultData: { width: 'narrow', ratio: '16:9', objectFit: 'cover', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', alt: 'Option 2 preview', caption: '' }
      },
      { 
        blockType: 'text', 
        slotLabel: 'Item 2 Verdict', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>A brief 80-word verdict on why this item earned its rank on the list.</p>', size: 'regular' } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'mint', layout: 'row', heading: 'Try the winner', body: 'Experience the top choice yourself.', buttonLabel: 'View Pricing', href: '#' } 
      },
      ...sharedTail
    ]
  },

  'card-review': {
    name: 'Card review',
    description: 'Verdict up top, then fee maths, credits and who it suits.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'callout', 
        slotLabel: 'Headline stat', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'stat', presentation: 'boxed', figure: '$1,400+', title: 'in estimated first-year value', body: 'A premier option for power users.' } 
      },
      { 
        blockType: 'keyTakeaways', 
        slotLabel: 'Good for', 
        locked: true, 
        required: true, 
        defaultData: { kicker: 'Good for', variant: 'card', numbered: false, items: [{text: 'Power users'}, {text: 'Enterprise teams'}] } 
      },
      { 
        blockType: 'keyTakeaways', 
        slotLabel: 'Skip if', 
        locked: true, 
        required: true, 
        defaultData: { kicker: 'Skip if', variant: 'rule', numbered: false, items: [{text: 'Budget conscious'}, {text: 'Solo founders'}] } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Full narrative case', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Write your comprehensive narrative case here. Cover the main benefits, the user experience, and who should ultimately buy this product.</p>', size: 'regular' } 
      },
      { 
        blockType: 'table', 
        slotLabel: 'Fee/benefit breakdown', 
        locked: true, 
        required: true, 
        defaultData: { 
          firstColSticky: true,
          zebra: true,
          presentation: 'boxed',
          mobileLayout: 'scroll',
          columns: [{label: 'Benefit', align: 'left'}, {label: 'Value', align: 'left'}],
          rows: [{cells: [{text: 'Annual Credit'}, {text: '$200'}]}, {cells: [{text: 'Lounge Access'}, {text: '$500'}]}]
        } 
      },
      { 
        blockType: 'steps', 
        slotLabel: 'Timeline (credits payout)', 
        locked: true, 
        required: false, 
        defaultData: { 
          variant: 'timeline',
          start: 1,
          steps: [{title: 'Month 1', body: 'Unlock the welcome bonus.', image: ''}, {title: 'Month 6', body: 'Utilize the mid-year credits.', image: ''}]
        } 
      },
      { 
        blockType: 'quote', 
        slotLabel: 'User Quote', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'card', theme: 'paper', text: 'This product completely transformed my daily workflow.', attribution: 'Real User' } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'ink', layout: 'stacked', heading: 'Ready to apply?', body: 'Get approved in minutes.', buttonLabel: 'Apply Now', href: '#' } 
      },
      ...sharedTail
    ]
  },

  'product-update': {
    name: 'Product update',
    description: 'What shipped, why it matters, a screenshot. Dated and tagged.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'callout', 
        slotLabel: 'What changed', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'success', presentation: 'boxed', title: 'New Feature', body: 'Briefly summarize the new feature or update here.' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'The announcement', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Provide the factual details of the update. Keep it short, objective, and explain the core value it provides to users.</p>', size: 'lead' } 
      },
      {
        blockType: 'gallery',
        slotLabel: 'Feature Screenshots',
        locked: true,
        required: false,
        defaultData: {
          layout: 'grid-2',
          gap: 20,
          captionMode: 'shared',
          sharedCaption: 'The new interface in action.',
          images: [
            { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', alt: 'Screenshot 1', caption: '' },
            { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', alt: 'Screenshot 2', caption: '' }
          ]
        }
      },
      { 
        blockType: 'heading', 
        slotLabel: 'How to use it', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h3', text: 'How to use it', inTOC: true } 
      },
      { 
        blockType: 'steps', 
        slotLabel: 'Usage Steps', 
        locked: true, 
        required: true, 
        defaultData: { 
          variant: 'numbered-circle',
          start: 1,
          steps: [
            {title: 'Enable the feature', body: 'Go to your settings and toggle the feature on.', image: ''},
            {title: 'Configure options', body: 'Set your preferred defaults in the dashboard.', image: ''}
          ]
        } 
      },
      {
        blockType: 'code',
        slotLabel: 'API Example',
        locked: true,
        required: false,
        defaultData: {
          language: 'javascript',
          filename: 'api-example.js',
          showLineNumbers: true,
          code: 'const response = await api.newFeature.enable();\nconsole.log(response);'
        }
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'mint', layout: 'row', heading: 'Try it out', body: 'Log into your dashboard to access this new feature.', buttonLabel: 'Go to Dashboard', href: '#' } 
      },
      ...sharedTail
    ]
  },

  'customer-story': {
    name: 'Customer story',
    description: 'One person, one number they recovered, quotes in their words.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'quote', 
        slotLabel: 'Hero Quote', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'pull', theme: 'mint', text: 'Using this platform completely changed how our team operates. We saved thousands of hours.', attribution: 'Jane Doe, CEO at Acme Corp' } 
      },
      { 
        blockType: 'heading', 
        slotLabel: 'The Challenge', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h3', text: 'The Challenge', inTOC: true } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Challenge narrative', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Describe the problems the customer faced before using your product. Highlight their pain points and what they were looking to solve.</p>', size: 'regular' } 
      },
      { 
        blockType: 'list', 
        slotLabel: 'Pain points', 
        locked: true, 
        required: true, 
        defaultData: { 
          style: 'cross',
          spacing: 'loose',
          items: [{html: 'High operational costs', marker: 'cross'}, {html: 'Manual data entry errors', marker: 'cross'}]
        } 
      },
      { 
        blockType: 'heading', 
        slotLabel: 'The Solution', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h3', text: 'The Solution', inTOC: true } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Solution narrative', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Explain how your product was implemented and how it directly addressed their challenges.</p>', size: 'regular' } 
      },
      { 
        blockType: 'callout', 
        slotLabel: 'ROI Stat', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'stat-forest', presentation: 'boxed', figure: '300%', title: 'Increase in efficiency', body: 'Achieved within the first quarter of deployment.' } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'ink', layout: 'stacked', heading: 'Achieve similar results', body: 'Book a demo to see how we can help your team.', buttonLabel: 'Book a Demo', href: '#' } 
      },
      ...sharedTail
    ]
  },

  'news': {
    name: 'News',
    description: 'Short. A change in the industry and what to do about it.',
    slots: [
      ...sharedHead,
      { 
        blockType: 'callout', 
        slotLabel: 'What changed', 
        locked: true, 
        required: true, 
        defaultData: { variant: 'warn', presentation: 'boxed', title: 'Industry Update', body: 'Briefly summarize the policy shift or news event here.' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'The announcement', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Provide the factual details of the announcement. Keep it short and objective.</p>', size: 'lead' } 
      },
      { 
        blockType: 'heading', 
        slotLabel: 'What this means for you', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h3', text: 'What this means for you', inTOC: true } 
      },
      { 
        blockType: 'list', 
        slotLabel: 'Implications', 
        locked: true, 
        required: true, 
        defaultData: { 
          style: 'bullet',
          spacing: 'loose',
          items: [{html: 'If you have Option A, your rate will change.', marker: ''}, {html: 'If you have Option B, no action is required.', marker: ''}]
        } 
      },
      {
        blockType: 'embed',
        slotLabel: 'Video Context',
        locked: true,
        required: false,
        defaultData: {
          url: 'https://youtube.com/embed/example',
          provider: 'youtube',
          aspect: '16:9',
          lazy: true,
          privacyMode: false,
          caption: ''
        }
      },
      { 
        blockType: 'sources', 
        slotLabel: 'Primary Sources', 
        locked: true, 
        required: true, 
        defaultData: { 
          position: 'promoted',
          numbered: true,
          title: 'Sources',
          items: [{text: 'Official Press Release from Company XYZ', url: '#'}]
        } 
      },
      { 
        blockType: 'cta', 
        slotLabel: 'Call to Action', 
        locked: true, 
        required: false, 
        defaultData: { theme: 'outline', layout: 'row', heading: 'Check your account', body: 'Log in to see if you are affected.', buttonLabel: 'Login', href: '#' } 
      },
      ...sharedTail
    ]
  },

  'plain-essay': {
    name: 'Plain essay',
    description: 'Just a title and prose. For thinking out loud.',
    slots: [
      { 
        blockType: 'heading', 
        slotLabel: 'Post Header', 
        locked: true, 
        required: true, 
        defaultData: { level: 'h2', text: 'Enter your essay title here', align: 'center', inTOC: false, fontFamily: 'serif' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Introduction', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Start your thoughtful essay here. Use a dropcap for editorial elegance.</p>', size: 'lead', dropcap: true } 
      },
      { 
        blockType: 'quote', 
        slotLabel: 'Thoughtful quote', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'rule', theme: 'paper', text: 'A provocative thought that anchors the essay.', attribution: 'Author Name' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Body text', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Continue your narrative. Keep paragraphs medium-length and focus on flow.</p>', size: 'regular', dropcap: false } 
      },
      { 
        blockType: 'divider', 
        slotLabel: 'Section break', 
        locked: true, 
        required: false, 
        defaultData: { variant: 'dots', height: 'large' } 
      },
      { 
        blockType: 'text', 
        slotLabel: 'Conclusion', 
        locked: true, 
        required: true, 
        defaultData: { html: '<p>Wrap up your thoughts cleanly.</p>', size: 'regular', dropcap: false } 
      },
      { 
        blockType: 'newsletter', 
        slotLabel: 'Newsletter Inline', 
        locked: true, 
        required: false, 
        defaultData: { heading: 'Enjoyed this piece?', body: 'Get essays delivered directly to your inbox.', theme: 'paper', layout: 'split', listId: 'essay-readers' } 
      }
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
