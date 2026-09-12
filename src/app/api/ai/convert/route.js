import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { blockRegistry } from '@/blog/blocks/blockRegistry';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing in environment variables.' }, { status: 500 });
    }

    const { currentBlock, targetType } = await req.json();

    if (!currentBlock || !targetType) {
      return NextResponse.json({ error: 'currentBlock and targetType are required.' }, { status: 400 });
    }

    const targetSchema = blockRegistry[targetType];
    if (!targetSchema) {
      return NextResponse.json({ error: 'Invalid target type.' }, { status: 400 });
    }

    // Clean up editor fields for the prompt so we just get key/type information
    const cleanEditorFields = targetSchema.editor?.map(field => {
      const cleanField = { key: field.key, type: field.type };
      if (field.options) cleanField.options = field.options.map(o => o.value);
      if (field.itemSchema) {
        cleanField.itemSchema = field.itemSchema.map(i => ({ key: i.key, type: i.type }));
      }
      return cleanField;
    }) || [];

    const prompt = `
You are an expert CMS content editor. Your job is to convert a content block from one type to another, preserving as much meaning and content as possible, while strictly adhering to the target block's schema.

CURRENT BLOCK:
Type: ${currentBlock.type}
Data: ${JSON.stringify(currentBlock.data, null, 2)}

TARGET BLOCK TYPE: ${targetType}
TARGET SCHEMA INFO (Editor fields & default data):
Default Data: ${JSON.stringify(targetSchema.defaultData, null, 2)}
Editor Fields: ${JSON.stringify(cleanEditorFields, null, 2)}

INSTRUCTIONS:
1. Map the content from the current block to the target block's schema.
2. Maintain the semantic meaning of the content.
3. If there are fields in the target block that cannot be populated from the current block, use the default values or leave them empty/omitted if appropriate.
4. If the current block's content is completely incompatible and cannot be logically converted to the target block's schema in any meaningful way, output a JSON object with a single key "error" containing a descriptive error message explaining why the conversion is not possible.
5. Otherwise, your output MUST be exactly one valid JSON object representing the "data" object of the target block. 
6. Do not include markdown fences, comments, or any other text. Output ONLY the JSON object.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const resultJson = response.text;
    const parsed = JSON.parse(resultJson);

    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 422 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('AI Convert Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to convert block.' },
      { status: 500 }
    );
  }
}
