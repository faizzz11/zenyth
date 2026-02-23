import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeError } from './securityUtils';

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private model: string = 'gemini-2.0-flash-exp';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, timeout: number = 10000): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });
    
    return Promise.race([
      (async () => {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
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
