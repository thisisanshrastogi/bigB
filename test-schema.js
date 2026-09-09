import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const schema = {
  type: "object",
  properties: {
    blocks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          data: { 
            type: "object",
            // Let's try to see if it allows arbitrary properties
          }
        }
      }
    }
  }
};

async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'write 1 block of type "heading" with data { "level": "h2", "text": "hello" }',
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  console.log(response.text);
}
run();
