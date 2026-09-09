import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// We use the new Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

const SYSTEM_PROMPT = `
You are an expert content editor and designer for the Amalgamic Blog. 
Convert the user's provided markdown/content into a structured JSON payload for our block-based CMS editor.

The output must be a valid JSON object matching this schema:
{
  "title": "A captivating title",
  "excerpt": "A brief, compelling summary of the article (1-2 sentences)",
  "heroImage": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200", 
  "category": "Technology",
  "blocks": [
    // Array of block objects
  ]
}

Available block types for the 'blocks' array:
- heading (Used for section titles): { "type": "heading", "data": { "level": "h2"|"h3", "text": "...", "anchor": "optional-id" } }
- text (Used for standard paragraphs, supports HTML): { "type": "text", "data": { "html": "...", "size": "regular"|"lead" } }
- list (Used for bulleted or numbered lists): { "type": "list", "data": { "style": "bullet"|"numbered", "items": [ { "html": "..." } ] } }
- quote (Used for pull quotes and blockquotes): { "type": "quote", "data": { "text": "...", "attribution": "..." } }
- callout (Used to highlight info, warnings, or statistics): { "type": "callout", "data": { "variant": "info"|"stat", "presentation": "boxed", "title": "...", "body": "...", "figure": "..." } }
- toc (Used to render the table of contents sidebar): { "type": "toc", "data": { "depth": "h2+h3", "position": "rail", "sticky": true, "railSide": "left" } }
- divider (Used to visually separate content): { "type": "divider", "data": { "variant": "rule" } }
- code (Used for syntax-highlighted code snippets): { "type": "code", "data": { "language": "...", "code": "..." } }
- image (Used for a single image with optional caption): { "type": "image", "data": { "src": "...", "alt": "...", "caption": "...", "width": "wide" } }
- keyTakeaways (Used for executive summaries at the top): { "type": "keyTakeaways", "data": { "kicker": "...", "items": [ { "text": "..." } ] } }
- gallery (Used for a grid or carousel of images): { "type": "gallery", "data": { "images": [{ "src": "...", "alt": "...", "caption": "..." }], "layout": "grid-2", "captionMode": "per-item" } }
- embed (Used for embedding YouTube, Vimeo, Loom, or X links): { "type": "embed", "data": { "url": "...", "provider": "youtube", "aspect": "16:9", "caption": "..." } }
- steps (Used for numbered step-by-step guides or timelines): { "type": "steps", "data": { "variant": "numbered-circle", "start": 1, "steps": [{ "title": "...", "body": "...", "image": "..." }] } }
- cta (Used for a Call to Action banner with a button): { "type": "cta", "data": { "theme": "ink", "layout": "row", "heading": "...", "body": "...", "buttonLabel": "...", "href": "..." } }
- table (Used for displaying tabular data): { "type": "table", "data": { "columns": [{ "label": "...", "align": "left" }], "rows": [{ "cells": [{ "text": "..." }] }], "presentation": "boxed", "mobileLayout": "scroll" } }
- faq (Used for accordion-style FAQ sections): { "type": "faq", "data": { "title": "...", "items": [{ "q": "...", "a": "..." }], "defaultOpenIndex": 0 } }
- sources (Used for footnotes and references at the bottom): { "type": "sources", "data": { "title": "...", "numbered": true, "items": [{ "text": "...", "url": "..." }] } }
- newsletter (Used for rendering an inline email signup form): { "type": "newsletter", "data": { "heading": "...", "body": "...", "listId": "...", "theme": "mint", "layout": "center" } }
- relatedPosts (Used to automatically suggest related reading): { "type": "relatedPosts", "data": { "mode": "auto-by-tag", "heading": "...", "count": 3 } }
- glossary (Used to define specific terminology): { "type": "glossary", "data": { "term": "...", "definition": "...", "layout": "block" } }

Rules:
1. Start the 'blocks' array with a 'keyTakeaways' block (if applicable) and a 'toc' block.
2. Structure the content logically using 'heading' and 'text' blocks.
3. Break up long walls of text. Use 'callout' or 'quote' for emphasis.
4. IMPORTANT: Ensure every block is an object with 'type' and 'data'.
5. ONLY return valid JSON. Do not return markdown \`\`\`json wrappers.
`;

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is missing in environment variables.' },
        { status: 500 }
      );
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

    // Using 2.5-flash since 3.6-flash doesn't exist yet!
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: content,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const resultJson = response.text;
    const parsed = JSON.parse(resultJson);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content.' },
      { status: 500 }
    );
  }
}
