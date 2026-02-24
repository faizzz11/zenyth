import { createGeminiClient } from '@/lib/gemini';
import { MemeConcept, MemeStyle } from '../types';

export async function generateMemeConcept(
  topic: string,
  style: MemeStyle
): Promise<MemeConcept> {
  const client = createGeminiClient();
  
  const prompt = `Generate a meme concept for the topic: "${topic}"
Style: ${style}

You must return ONLY a valid JSON object with these exact fields:
{
  "caption": "A witty caption (max 100 characters)",
  "punchline": "A humorous punchline (max 100 characters)",
  "visualDescription": "A detailed description for image generation (2-3 sentences)"
}

Requirements:
- The meme should be appropriate for social media
- Match the ${style} aesthetic
- Use double quotes for all JSON strings
- Return ONLY the JSON object, no markdown formatting, no additional text

Example format:
{"caption": "When you...", "punchline": "But then...", "visualDescription": "An image showing..."}`;


  const response = await client.generateWithRetry(prompt, 3, 10000);
  
  // Clean the response - remove markdown code blocks if present
  let cleanedResponse = response.trim();
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  // Parse the JSON response
  let parsed;
  try {
    parsed = JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Failed to parse JSON response:', cleanedResponse);
    throw new Error(`Invalid JSON response from Gemini: ${(error as Error).message}`);
  }
  
  // Validate constraints
  if (parsed.caption.length > 100) {
    parsed.caption = parsed.caption.substring(0, 100);
  }
  
  if (parsed.punchline.length > 100) {
    parsed.punchline = parsed.punchline.substring(0, 100);
  }
  
  if (!parsed.visualDescription || parsed.visualDescription.length === 0) {
    throw new Error('Visual description is required');
  }
  
  return {
    caption: parsed.caption,
    punchline: parsed.punchline,
    visualDescription: parsed.visualDescription,
  };
}
