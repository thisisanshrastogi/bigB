export const howTo = { 
  id: 'how-to', 
  name: 'How-to Guide', 
  purpose: 'A step-by-step tutorial or guide',
  slots: [
    { key: 'lead', label: 'Lead Paragraph', kind: 'richtext', required: true, hint: 'Introduce the guide' },
    { key: 'steps', label: 'Steps', kind: 'steps', required: true, repeatable: { min: 2, max: 20 }, hint: 'The individual steps to complete the task' },
    { key: 'conclusion', label: 'Conclusion', kind: 'richtext', required: false, hint: 'Wrap up the guide' }
  ], 
  toBlocks: (sections) => {
    const blocks = [];
    if (sections.lead) {
      blocks.push({ id: crypto.randomUUID(), type: 'text', data: { html: sections.lead } });
    }
    if (sections.steps && sections.steps.length > 0) {
      blocks.push({ id: crypto.randomUUID(), type: 'steps', data: { items: sections.steps } });
    }
    if (sections.conclusion) {
      blocks.push({ id: crypto.randomUUID(), type: 'text', data: { html: sections.conclusion } });
    }
    return blocks;
  }, 
  matches: (blocks) => {
    // Rough matching for now: sequence of [text?, steps, text?]
    const hasSteps = blocks.some(b => b.type === 'steps');
    const validTypes = blocks.every(b => b.type === 'text' || b.type === 'steps');
    return hasSteps && validTypes;
  }
};
