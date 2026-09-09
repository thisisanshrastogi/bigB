// lib/blog/headings.js
//
// Shared between the server (to build the TOC and estimate reading time)
// and BlockRenderer (to stamp matching ids on rendered headings).
// Both sides must use slugify() or the rail links will point at nothing.

export function slugify(text = '') {
  const base = String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
  return base || 'section';
}

// Blocks come out of Mongo in a few shapes depending on how old the post is,
// so pull text defensively rather than assuming one key.
function readText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(readText).join('');
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (typeof value.content === 'string') return value.content;
    if (Array.isArray(value.children)) return value.children.map(readText).join('');
    if (Array.isArray(value.content)) return value.content.map(readText).join('');
  }
  return '';
}

function headingLevel(block) {
  const data = block?.data || {};
  if (typeof data.level === 'number') return data.level;
  if (typeof data.level === 'string' && /^h?[1-6]$/i.test(data.level)) {
    return Number(data.level.replace(/h/i, ''));
  }
  const match = /^h([1-6])$/i.exec(block?.type || '');
  return match ? Number(match[1]) : 2;
}

function isHeading(block) {
  const type = String(block?.type || '').toLowerCase();
  return type === 'heading' || /^h[1-6]$/.test(type);
}

/**
 * Returns [{ id, text, level }] for the levels you want in the rail.
 * Duplicate titles get -2, -3 suffixes so ids stay unique.
 */
export function extractHeadings(blocks = [], { levels = [2] } = {}) {
  const seen = new Map();
  const out = [];

  for (const block of blocks) {
    if (!isHeading(block)) continue;

    const level = headingLevel(block);
    if (!levels.includes(level)) continue;

    const text = readText(block.data ?? block).trim();
    if (!text) continue;

    // Use explicit anchor if provided, otherwise slugify the text
    const customAnchor = block.data?.anchor;
    const base = customAnchor ? String(customAnchor) : slugify(text);
    
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);

    out.push({
      id: count === 1 ? base : `${base}-${count}`,
      text,
      level,
    });
  }

  return out;
}

/**
 * Reading time from actual prose, not from the JSON envelope.
 * Stringifying the blocks counts keys, braces and quotes as words, which
 * inflates short posts badly.
 */
export function estimateReadingTime(blocks = [], wordsPerMinute = 200) {
  const walk = (node) => {
    if (node == null) return '';
    if (typeof node === 'string') return ` ${node}`;
    if (Array.isArray(node)) return node.map(walk).join('');
    if (typeof node === 'object') {
      return Object.entries(node)
        .filter(([key]) => !['id', 'type', 'url', 'href', 'src', 'alt', 'className'].includes(key))
        .map(([, value]) => walk(value))
        .join('');
    }
    return '';
  };

  const words = walk(blocks).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
