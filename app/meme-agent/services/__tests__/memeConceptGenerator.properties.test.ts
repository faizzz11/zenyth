import fc from 'fast-check';
import { generateMemeConcept } from '../memeConceptGenerator';
import { MemeStyle } from '../../types';
import * as geminiModule from '@/lib/gemini';

describe('Property Tests: Meme Concept Generator', () => {
  /**
   * Feature: meme-agent, Property 7: Style Parameter Propagation
   * 
   * For any meme generation request, the selected style (classic, modern, or minimalist)
   * should be included in the parameters sent to the Gemini service for concept generation.
   * 
   * **Validates: Requirements 4.4**
   */
  describe('Property 7: Style Parameter Propagation', () => {
    it('should include style in prompt sent to Gemini', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 3, maxLength: 200 }),
          fc.constantFrom<MemeStyle>('classic', 'modern', 'minimalist'),
          async (topic, style) => {
            const mockClient = {
              generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify({
                caption: 'Test caption',
                punchline: 'Test punchline',
                visualDescription: 'Test description',
              })),
            };
            
            jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
            
            await generateMemeConcept(topic, style);
            
            expect(mockClient.generateWithRetry).toHaveBeenCalled();
            const prompt = mockClient.generateWithRetry.mock.calls[0][0];
            expect(prompt).toContain(style);
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should accept all valid style values', async () => {
      const styles: MemeStyle[] = ['classic', 'modern', 'minimalist'];
      
      for (const style of styles) {
        const mockClient = {
          generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify({
            caption: 'Test caption',
            punchline: 'Test punchline',
            visualDescription: 'Test description',
          })),
        };
        
        jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
        
        const result = await generateMemeConcept('test topic', style);
        expect(result).toBeDefined();
      }
    });
  });

  /**
   * Feature: meme-agent, Property 9: Concept Structure Constraints
   * 
   * For any generated meme concept, the caption should not exceed 100 characters, the
   * punchline should not exceed 100 characters, and the visual description should be non-empty.
   * 
   * **Validates: Requirements 6.2, 6.3, 6.4**
   */
  describe('Property 9: Concept Structure Constraints', () => {
    it('should enforce caption length constraint (max 100 chars)', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 3, maxLength: 200 }),
          fc.constantFrom<MemeStyle>('classic', 'modern', 'minimalist'),
          fc.string({ minLength: 101, maxLength: 200 }), // Caption longer than 100
          async (topic, style, longCaption) => {
            const mockClient = {
              generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify({
                caption: longCaption,
                punchline: 'Test punchline',
                visualDescription: 'Test description',
              })),
            };
            
            jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
            
            const result = await generateMemeConcept(topic, style);
            
            expect(result.caption.length).toBeLessThanOrEqual(100);
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should enforce punchline length constraint (max 100 chars)', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 3, maxLength: 200 }),
          fc.constantFrom<MemeStyle>('classic', 'modern', 'minimalist'),
          fc.string({ minLength: 101, maxLength: 200 }), // Punchline longer than 100
          async (topic, style, longPunchline) => {
            const mockClient = {
              generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify({
                caption: 'Test caption',
                punchline: longPunchline,
                visualDescription: 'Test description',
              })),
            };
            
            jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
            
            const result = await generateMemeConcept(topic, style);
            
            expect(result.punchline.length).toBeLessThanOrEqual(100);
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should require non-empty visual description', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 3, maxLength: 200 }),
          fc.constantFrom<MemeStyle>('classic', 'modern', 'minimalist'),
          async (topic, style) => {
            const mockClient = {
              generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify({
                caption: 'Test caption',
                punchline: 'Test punchline',
                visualDescription: '',
              })),
            };
            
            jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
            
            await expect(generateMemeConcept(topic, style)).rejects.toThrow('Visual description is required');
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should return valid concept structure', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 3, maxLength: 200 }),
          fc.constantFrom<MemeStyle>('classic', 'modern', 'minimalist'),
          async (topic, style) => {
            const mockClient = {
              generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify({
                caption: 'Test caption',
                punchline: 'Test punchline',
                visualDescription: 'Test description for image generation',
              })),
            };
            
            jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
            
            const result = await generateMemeConcept(topic, style);
            
            expect(result).toHaveProperty('caption');
            expect(result).toHaveProperty('punchline');
            expect(result).toHaveProperty('visualDescription');
            expect(typeof result.caption).toBe('string');
            expect(typeof result.punchline).toBe('string');
            expect(typeof result.visualDescription).toBe('string');
            expect(result.visualDescription.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  /**
   * Feature: meme-agent, Property 26: Response Parsing Correctness
   * 
   * For any Gemini API response, the service should parse the response into a MemeConcept
   * structure with caption, punchline, and visualDescription fields.
   * 
   * **Validates: Requirements 14.3**
   */
  describe('Property 26: Response Parsing Correctness', () => {
    it('should parse JSON response correctly', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 3, maxLength: 200 }),
          fc.constantFrom<MemeStyle>('classic', 'modern', 'minimalist'),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 10, maxLength: 200 }),
          async (topic, style, caption, punchline, visualDescription) => {
            const mockResponse = {
              caption,
              punchline,
              visualDescription,
            };
            
            const mockClient = {
              generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
            };
            
            jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
            
            const result = await generateMemeConcept(topic, style);
            
            expect(result.caption).toBe(caption.length > 100 ? caption.substring(0, 100) : caption);
            expect(result.punchline).toBe(punchline.length > 100 ? punchline.substring(0, 100) : punchline);
            expect(result.visualDescription).toBe(visualDescription);
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should handle malformed JSON gracefully', async () => {
      const mockClient = {
        generateWithRetry: jest.fn().mockResolvedValue('not valid json'),
      };
      
      jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
      
      await expect(generateMemeConcept('test topic', 'classic')).rejects.toThrow();
    });

    it('should handle missing fields in response', async () => {
      const mockClient = {
        generateWithRetry: jest.fn().mockResolvedValue(JSON.stringify({
          caption: 'Test caption',
          // Missing punchline and visualDescription
        })),
      };
      
      jest.spyOn(geminiModule, 'createGeminiClient').mockReturnValue(mockClient as any);
      
      await expect(generateMemeConcept('test topic', 'classic')).rejects.toThrow();
    });
  });
});
