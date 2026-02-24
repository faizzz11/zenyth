import { GoogleGenAI } from '@google/genai';
import { safeError } from './securityUtils';

export class GeminiClient {
  private client: GoogleGenAI;
  private model: string = 'gemini-3-flash-preview';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateText(prompt: string, timeout: number = 10000): Promise<string> {
    return Promise.race([
      (async () => {
        const response = await this.client.models.generateContent({
          model: this.model,
          contents: prompt,
        });
        
        if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('No text generated from Gemini API');
        }
        
        return response.candidates[0].content.parts[0].text;
      })(),
      new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  async generateWithRetry(
    prompt: string,
    maxRetries: number = 3,
    timeout: number = 10000
  ): Promise<string> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.generateText(prompt, timeout);
      } catch (error) {
        lastError = error as Error;
        // Use safe error logging to prevent API key exposure
        safeError(`Gemini generation attempt ${attempt + 1} failed:`, error);
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
}

export function createGeminiClient(): GeminiClient {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GeminiClient(apiKey);
}
