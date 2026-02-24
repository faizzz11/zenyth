import { generateMemeImage } from '../memeImageGenerator';

// Mock the Gemini API
jest.mock('@google/generative-ai');

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  process.env.GEMINI_API_KEY = 'test-api-key';
});

describe('Property Tests: Meme Image Generator', () => {
  /**
   * Feature: meme-agent, Property 10: Data URL Validation
   * 
   * For any meme output, the image should be returned as a valid data URL with base64 encoded image data.
   * 
   * **Validates: Requirements 7.3, 15.3**
   */
  describe('Property 10: Data URL Validation', () => {
    it('should return valid data URLs starting with data:image/', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const visualDescription = 'Test visual description';
      const mockBase64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  data: mockBase64Data,
                  mimeType: 'image/png'
                }
              }]
            }
          }]
        }
      });
      
      const mockModel = {
        generateContent: mockGenerateContent
      };
      
      const mockClient = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel)
      };
      
      GoogleGenerativeAI.mockImplementation(() => mockClient);
      
      const result = await generateMemeImage(visualDescription);
      
      expect(result).toMatch(/^data:image\//);
      expect(result).toContain('base64,');
    });

    it('should reject invalid data URL formats', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  data: 'test',
                  mimeType: 'text/plain' // Invalid MIME type
                }
              }]
            }
          }]
        }
      });
      
      const mockModel = {
        generateContent: mockGenerateContent
      };
      
      const mockClient = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel)
      };
      
      GoogleGenerativeAI.mockImplementation(() => mockClient);
      
      await expect(generateMemeImage('test description')).rejects.toThrow('Invalid data URL format');
    });
  });

  /**
   * Feature: meme-agent, Property 11: Image Data Validation
   * 
   * For any generated meme image, the data URL should contain valid base64 encoded image data.
   * 
   * Note: This property validates that the Gemini API returns properly formatted base64 image data.
   * 
   * **Validates: Requirements 7.4**
   */
  describe('Property 11: Image Data Validation', () => {
    it('should return data URL with valid base64 data', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const visualDescription = 'A funny cat wearing sunglasses';
      const mockBase64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  data: mockBase64Data,
                  mimeType: 'image/png'
                }
              }]
            }
          }]
        }
      });
      
      const mockModel = {
        generateContent: mockGenerateContent
      };
      
      const mockClient = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel)
      };
      
      GoogleGenerativeAI.mockImplementation(() => mockClient);
      
      const result = await generateMemeImage(visualDescription);
      
      expect(typeof result).toBe('string');
      expect(result.startsWith('data:image/')).toBe(true);
      expect(result).toContain('base64,');
      
      // Extract and validate base64 data
      const base64Part = result.split('base64,')[1];
      expect(base64Part).toBeTruthy();
      expect(base64Part.length).toBeGreaterThan(0);
    });

    it('should pass visual description to Gemini model', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const visualDescription = 'A funny cat wearing sunglasses';
      const mockBase64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  data: mockBase64Data,
                  mimeType: 'image/png'
                }
              }]
            }
          }]
        }
      });
      
      const mockModel = {
        generateContent: mockGenerateContent
      };
      
      const mockClient = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel)
      };
      
      GoogleGenerativeAI.mockImplementation(() => mockClient);
      
      await generateMemeImage(visualDescription);
      
      expect(mockGenerateContent).toHaveBeenCalledWith(visualDescription);
    });

    it('should handle retry logic with exponential backoff', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockBase64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const mockGenerateContent = jest.fn()
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockRejectedValueOnce(new Error('Second attempt failed'))
        .mockResolvedValueOnce({
          response: {
            candidates: [{
              content: {
                parts: [{
                  inlineData: {
                    data: mockBase64Data,
                    mimeType: 'image/png'
                  }
                }]
              }
            }]
          }
        });
      
      const mockModel = {
        generateContent: mockGenerateContent
      };
      
      const mockClient = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel)
      };
      
      GoogleGenerativeAI.mockImplementation(() => mockClient);
      
      const result = await generateMemeImage('test description');
      
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
      expect(result).toMatch(/^data:image\//);
    });
  });
});
