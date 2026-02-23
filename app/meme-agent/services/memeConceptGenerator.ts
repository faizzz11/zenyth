import { createGeminiClient } from '@/lib/gemini';
import { MemeConcept, MemeStyle } from '../types';

export async function generateMemeConcept(
  topic: string,
  style: MemeStyle
): Promise<MemeConcept> {
  const client = createGeminiClient();
  
  const prompt = `Generate a meme concept for the topic: "${topic}"
Style: ${style}

Return a JSON object with:
- caption: A witty caption (max 100 characters)
- punchline: A humorous punchline (max 100 characters)
- visualDescription: A detailed description for image generation (2-3 sentences)

The meme should be appropriate for social media and match the ${style} aesthetic.

Return ONLY the JSON object, no additional text.`;

  const response = await client.generateWithRetry(prompt, 3, 10000);
  
  // Parse the JSON response
  const parsed = JSON.parse(response);
  
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
