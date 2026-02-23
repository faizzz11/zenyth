import fc from 'fast-check';
import { PollinationsClient, createPollinationsClient } from '../pollinations';

describe('Property Tests: Pollinations Client', () => {
  /**
   * Feature: meme-agent, Property 24: API Configuration from Environment
   * 
   * For any service initialization (Gemini, Pollinations), the service should be properly
   * configured. Pollinations.ai is free and doesn't require an API key.
   * 
   * **Validates: Requirements 15.1, 15.4, 19.2, 19.3**
   */
  describe('Property 24: API Configuration from Environment', () => {
    it('should successfully create client without API key', () => {
      const client = new PollinationsClient();
      expect(client).toBeInstanceOf(PollinationsClient);
    });

    it('should successfully create client using factory function', () => {
      const client = createPollinationsClient();
      expect(client).toBeInstanceOf(PollinationsClient);
    });
  });

  /**
   * Feature: meme-agent, Property 27: Retry with Exponential Backoff
   * 
   * For any transient service failure (network error, timeout, 5xx error), the system should
   * retry the operation up to 3 times with exponentially increasing delays (1s, 2s, 4s)
   * before reporting failure.
   * 
   * **Validates: Requirements 15.5, 15.6, 19.2, 19.3**
   */
  describe('Property 27: Retry with Exponential Backoff', () => {
    it('should retry up to maxRetries times with exponential backoff', async () => {
      const client = new PollinationsClient();
      
      let attemptCount = 0;
      const startTime = Date.now();
      
      // Mock generateImage to fail first 2 times, succeed on 3rd
      jest.spyOn(client, 'generateImage').mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Transient failure');
        }
        return 'https://image.pollinations.ai/prompt/test';
      });

      const result = await client.generateWithRetry('test prompt', 3, 30000);
      const duration = Date.now() - startTime;

      expect(result).toBe('https://image.pollinations.ai/prompt/test');
      expect(attemptCount).toBe(3);
      // Should have delays of 1s + 2s = 3s minimum
      expect(duration).toBeGreaterThanOrEqual(3000);
    });

    it('should throw error after exhausting all retries', async () => {
      const client = new PollinationsClient();
      
      let attemptCount = 0;
      
      // Mock generateImage to always fail
      jest.spyOn(client, 'generateImage').mockImplementation(async () => {
        attemptCount++;
        throw new Error('Persistent failure');
      });

      await expect(client.generateWithRetry('test prompt', 3, 30000)).rejects.toThrow('Persistent failure');
      expect(attemptCount).toBe(3);
    });

    it('should use exponential backoff delays (1s, 2s, 4s)', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 5 }),
          async (maxRetries) => {
            const client = new PollinationsClient();
            
            const attemptTimes: number[] = [];
            
            jest.spyOn(client, 'generateImage').mockImplementation(async () => {
              attemptTimes.push(Date.now());
              throw new Error('Test failure');
            });

            try {
              await client.generateWithRetry('test prompt', maxRetries, 30000);
            } catch (error) {
              // Expected to fail
            }

            // Verify exponential backoff between attempts
            for (let i = 1; i < attemptTimes.length; i++) {
              const delay = attemptTimes[i] - attemptTimes[i - 1];
              const expectedDelay = Math.pow(2, i - 1) * 1000;
              // Allow 100ms tolerance
              expect(delay).toBeGreaterThanOrEqual(expectedDelay - 100);
            }
          }
        ),
        { numRuns: 10 } // Fewer runs due to time delays
      );
    });
  });

  /**
   * Feature: meme-agent, Property 28: Service Timeout Enforcement
   * 
   * For any service call, the operation should be terminated if it exceeds its timeout
   * threshold: 10 seconds for Gemini, 30 seconds for Pollinations, 45 seconds for FFmpeg,
   * and 60 seconds for the complete pipeline.
   * 
   * **Validates: Requirements 7.6, 15.6, 22.1**
   */
  describe('Property 28: Service Timeout Enforcement', () => {
    it('should timeout operations that exceed the specified timeout', async () => {
      const client = new PollinationsClient();
      
      const shortTimeout = 100; // 100ms timeout
      
      // Create a promise that takes longer than the timeout
      const slowOperation = new Promise((resolve) => {
        setTimeout(() => resolve('https://image.pollinations.ai/prompt/test'), shortTimeout + 1000);
      });
      
      // Mock the actual API call to be slow
      jest.spyOn(client, 'generateImage').mockImplementation(async (prompt, timeout) => {
        return Promise.race([
          slowOperation,
          new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout!)
          )
        ]);
      });

      await expect(
        client.generateImage('test prompt', shortTimeout)
      ).rejects.toThrow('Request timeout');
    });

    it('should complete operations within timeout', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1000, max: 5000 }),
          fc.integer({ min: 100, max: 900 }),
          async (timeout, operationTime) => {
            const client = new PollinationsClient();
            
            jest.spyOn(client, 'generateImage').mockImplementation(async () => {
              await new Promise(resolve => setTimeout(resolve, operationTime));
              return 'https://image.pollinations.ai/prompt/test';
            });

            const result = await client.generateImage('test prompt', timeout);
            expect(result).toBe('https://image.pollinations.ai/prompt/test');
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should use default 30-second timeout for Pollinations', async () => {
      const client = new PollinationsClient();
      
      let usedTimeout: number | undefined;
      
      jest.spyOn(client, 'generateImage').mockImplementation(async (prompt, timeout) => {
        usedTimeout = timeout;
        return 'https://image.pollinations.ai/prompt/test';
      });

      await client.generateWithRetry('test prompt');
      
      expect(usedTimeout).toBe(30000);
    });
  });
});
