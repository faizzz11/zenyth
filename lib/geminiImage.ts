import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeError } from './securityUtils';

export class GeminiImageClient {
  private client: GoogleGenerativeAI;
  private model: string = 'imagen-3.0-generate-001';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateImage(prompt: string, timeout: number = 30000): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });
    
    return Promise.race([
      (async () => {
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        
        const response = result.response;
        
        // Extract base64 image from response
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('No image generated in response');
        }
        
        const candidate = response.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          throw new Error('No content parts in response');
        }
        
        const part = candidate.content.parts[0];
        if (!('inlineData' in part) || !part.inlineData) {
          throw new Error('No inline data in response');
        }
        
        const { data, mimeType } = part.inlineData;
        if (!data) {
          throw new Error('No image data in response');
        }
        
        // Convert base64 to data URL
        const dataUrl = `data:${mimeType || 'image/png'};base64,${data}`;
        return dataUrl;
      })(),
      new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  async generateWithRetry(
    prompt: string,
    maxRetries: number = 3,
    timeout: number = 30000
  ): Promise<string> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.generateImage(prompt, timeout);
      } catch (error) {
        lastError = error as Error;
        // Use safe error logging to prevent API key exposure
        safeError(`Gemini image generation attempt ${attempt + 1} failed:`, error);
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
}

export function createGeminiImageClient(): GeminiImageClient {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GeminiImageClient(apiKey);
}
