import { GoogleGenAI } from '@google/genai';
import { safeError } from '@/lib/securityUtils';

export async function generateMemeImage(
  visualDescription: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  
  const ai = new GoogleGenAI({ apiKey });

  let lastError: Error;
  const maxRetries = 3;
  const timeout = 60000; // 60 seconds for image generation

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const dataUrl = await Promise.race([
        (async () => {
          const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: visualDescription,
          });

          // Extract base64 image data from response
          if (!response.candidates?.[0]?.content?.parts) {
            throw new Error('No image data found in response');
          }

          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64Data = part.inlineData.data;
              const dataUrl = `data:image/png;base64,${base64Data}`;

              // Validate data URL format
              if (!dataUrl.startsWith('data:image/')) {
                throw new Error('Invalid data URL format');
              }

              return dataUrl;
            }
          }

          throw new Error('No image data found in response');
        })(),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);

      return dataUrl;
    } catch (error) {
      lastError = error as Error;
      safeError(`Gemini image generation attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
