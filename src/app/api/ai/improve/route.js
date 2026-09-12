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

    const { currentBlock, prompt: userPrompt } = await req.json();

    if (!currentBlock || !userPrompt) {
      return NextResponse.json({ error: 'currentBlock and prompt are required.' }, { status: 400 });
    }

    const blockSchema = blockRegistry[currentBlock.type];
    if (!blockSchema) {
      return NextResponse.json({ error: 'Invalid block type.' }, { status: 400 });
    }

    // Clean up editor fields for the prompt so we just get key/type information
    const cleanEditorFields = blockSchema.editor?.map(field => {
      const cleanField = { key: field.key, type: field.type };
      if (field.options) cleanField.options = field.options.map(o => o.value);
      if (field.itemSchema) {
        cleanField.itemSchema = field.itemSchema.map(i => ({ key: i.key, type: i.type }));
      }
      return cleanField;
    }) || [];

    const prompt = `
You are an expert CMS content editor and copywriter. Your job is to improve or modify a content block based on a user's instructions.

USER INSTRUCTION: "${userPrompt}"

CURRENT BLOCK TYPE: ${currentBlock.type}
CURRENT BLOCK DATA: ${JSON.stringify(currentBlock.data, null, 2)}

SCHEMA INFO (Editor fields for this block):
${JSON.stringify(cleanEditorFields, null, 2)}

INSTRUCTIONS:
1. Apply the user's instructions to improve or modify the content of the block.
2. Only modify the data that makes sense to change based on the instruction. Preserve other data.
3. If the user instruction is completely irrelevant or asks to do something impossible for this block schema, output a JSON object with a single key "error" containing a descriptive error message explaining why the improvement is not possible.
4. Otherwise, your output MUST be exactly one valid JSON object representing the modified "data" object of this block type.
5. Do not include markdown fences, comments, or any other text. Output ONLY the JSON object.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    });

    const resultJson = response.text;
    const parsed = JSON.parse(resultJson);

    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 422 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('AI Improve Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to improve block.' },
      { status: 500 }
    );
  }
}
