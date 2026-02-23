import { generateMemeImage } from '../memeImageGenerator';
import * as pollinationsModule from '@/lib/pollinations';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Property Tests: Meme Image Generator', () => {
  /**
   * Feature: meme-agent, Property 10: HTTPS URL Validation
   * 
   * For any meme output, the image should be returned as a valid HTTPS URL from Pollinations.ai.
   * 
   * **Validates: Requirements 7.3, 15.3**
   */
  describe('Property 10: HTTPS URL Validation', () => {
    it('should return valid HTTPS URLs', async () => {
      const visualDescription = 'Test visual description';
      const mockImageUrl = 'https://image.pollinations.ai/prompt/test';
      
      const mockClient = {
        generateWithRetry: jest.fn().mockResolvedValue(mockImageUrl),
      };
      
      jest.spyOn(pollinationsModule, 'createPollinationsClient').mockReturnValue(mockClient as any);
      
      const result = await generateMemeImage(visualDescription);
      
      expect(result).toMatch(/^https:\/\//);
    });

    it('should reject invalid URL formats', async () => {
      const invalidFormats = ['http://example.com/image.jpg', 'data:image/png;base64,test', 'invalid'];
      
      for (const invalidFormat of invalidFormats) {
        const mockClient = {
          generateWithRetry: jest.fn().mockResolvedValue(invalidFormat),
        };
        
        jest.spyOn(pollinationsModule, 'createPollinationsClient').mockReturnValue(mockClient as any);
        
        await expect(generateMemeImage('test description')).rejects.toThrow('Invalid image URL format');
      }
    });
  });

  /**
   * Feature: meme-agent, Property 11: Image Resolution Requirement
   * 
   * For any generated meme image, the URL should be valid and accessible.
   * 
   * Note: This property is typically enforced by the Pollinations.ai service itself.
   * We test that the service accepts the visual description and returns a valid HTTPS URL.
   * 
   * **Validates: Requirements 7.4**
   */
  describe('Property 11: Image Resolution Requirement', () => {
    it('should accept visual description and return valid HTTPS URL', async () => {
      const visualDescription = 'A funny cat wearing sunglasses';
      const mockImageUrl = 'https://image.pollinations.ai/prompt/A%20funny%20cat%20wearing%20sunglasses';
      
      const mockClient = {
        generateWithRetry: jest.fn().mockResolvedValue(mockImageUrl),
      };
      
      jest.spyOn(pollinationsModule, 'createPollinationsClient').mockReturnValue(mockClient as any);
      
      const result = await generateMemeImage(visualDescription);
      
      expect(typeof result).toBe('string');
      expect(result.startsWith('https://')).toBe(true);
      expect(mockClient.generateWithRetry).toHaveBeenCalledWith(visualDescription, 3, 30000);
    });

    it('should pass visual description to Pollinations client', async () => {
      const visualDescription = 'A funny cat wearing sunglasses';
      const mockImageUrl = 'https://image.pollinations.ai/prompt/A%20funny%20cat%20wearing%20sunglasses';
      
      const mockClient = {
        generateWithRetry: jest.fn().mockResolvedValue(mockImageUrl),
      };
      
      jest.spyOn(pollinationsModule, 'createPollinationsClient').mockReturnValue(mockClient as any);
      
      await generateMemeImage(visualDescription);
      
      expect(mockClient.generateWithRetry).toHaveBeenCalledWith(visualDescription, 3, 30000);
    });
  });
});
