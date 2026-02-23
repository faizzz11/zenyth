import { safeError } from './securityUtils';

export class PollinationsClient {
  private baseUrl: string = 'https://image.pollinations.ai/prompt';

  constructor() {
    // No API key required for Pollinations.ai
  }

  async generateImage(
    prompt: string,
    timeout: number = 30000
  ): Promise<string> {
    return Promise.race([
      (async () => {
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `${this.baseUrl}/${encodedPrompt}`;
        
        // Pollinations.ai returns the image directly, so we just need to verify it's accessible
        const response = await fetch(imageUrl, { method: 'HEAD' });

        if (!response.ok) {
          throw new Error(`Pollinations.ai API error: ${response.statusText}`);
        }

        return imageUrl;
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
        // Use safe error logging
        safeError(`Pollinations.ai generation attempt ${attempt + 1} failed:`, error);
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
}

export function createPollinationsClient(): PollinationsClient {
  return new PollinationsClient();
}
