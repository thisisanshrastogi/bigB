import { blockRegistry } from '@/blog/blocks/blockRegistry';

/**
 * Validates a post and its blocks.
 * @param {Object} post - The post data object.
 * @returns {Object} { errors: Array<{message: string, blockId?: string}>, warnings: Array<{message: string, blockId?: string}> }
 */
export function validatePost(post) {
  const errors = [];
  const warnings = [];

  // 1. Post-level checks
  
  // Title
  if (!post.title || post.title.trim() === '' || post.title === 'Untitled Post') {
    errors.push({ message: 'Title is missing or default', field: 'title' });
  } else if (post.title.length > 60) {
    warnings.push({ message: `Search title is ${post.title.length} characters — trims to 60 in results.`, field: 'title' });
  }

  // Slug
  if (!post.slug || post.slug.trim() === '') {
    errors.push({ message: 'Slug is missing', field: 'slug' });
  }

  // Excerpt
  if (!post.excerpt || post.excerpt.trim() === '') {
    errors.push({ message: 'No excerpt written', field: 'excerpt' });
  } else if (post.excerpt.length < 120 || post.excerpt.length > 158) {
    warnings.push({ message: `Excerpt is ${post.excerpt.length} characters (target 120–158)`, field: 'excerpt' });
  }

  // Category
  if (!post.category || post.category === 'Uncategorized') {
    errors.push({ message: 'Category is not set', field: 'category' });
  }

  // Tags
  if (!post.tags || post.tags.length === 0) {
    errors.push({ message: 'At least 1 tag is required', field: 'tags' });
  }

  // Hero Image
  if (!post.heroImage || post.heroImage.trim() === '') {
    errors.push({ message: 'Missing hero image', field: 'heroImage' });
  }

  // 2. Block-level checks
  const blocks = post.blocks || [];
  blocks.forEach(block => {
    const registryEntry = blockRegistry[block.type];
    
    // Check required slots first
    if (block.required) {
      let isMissing = false;
      const data = block.data || {};
      
      switch (block.type) {
        case 'text':
          isMissing = !data.html || data.html === '<p></p>' || data.html.trim() === '';
          break;
        case 'image':
          isMissing = !data.src;
          break;
        case 'heading':
          isMissing = !data.text || data.text.trim() === '';
          break;
        case 'callout':
          isMissing = (!data.title || data.title.trim() === '') && (!data.body || data.body.trim() === '');
          break;
        case 'quote':
          isMissing = !data.text || data.text.trim() === '';
          break;
        case 'list':
          isMissing = !data.items || data.items.length === 0;
          break;
        case 'steps':
          isMissing = !data.steps || data.steps.length === 0;
          break;
        case 'card':
          isMissing = !data.cardId;
          break;
        case 'table':
          isMissing = !data.columns || data.columns.length === 0 || !data.rows || data.rows.length === 0;
          break;
        case 'faq':
          isMissing = !data.items || data.items.length === 0;
          break;
        case 'keyTakeaways':
          isMissing = !data.items || data.items.length === 0;
          break;
        case 'sources':
          isMissing = !data.items || data.items.length === 0;
          break;
        default:
          // For other types, we'll rely on the registry validate or just skip strict required checking if unclear
          break;
      }
      
      if (isMissing) {
        errors.push({ 
          message: `Required ${block.slotLabel || registryEntry?.label || block.type} is empty.`, 
          blockId: block.id, 
          type: block.type 
        });
      }
    }

    if (registryEntry && registryEntry.validate) {
      // The registry returns an array of issues: { level: 'warn' | 'error', message: string }
      const issues = registryEntry.validate(block.data);
      if (issues && Array.isArray(issues)) {
        issues.forEach(issue => {
          if (issue.level === 'error') {
            errors.push({ message: issue.message, blockId: block.id, type: block.type });
          } else {
            warnings.push({ message: issue.message, blockId: block.id, type: block.type });
          }
        });
      }
    }
  });

  return { errors, warnings };
}
