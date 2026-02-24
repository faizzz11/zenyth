import { GoogleGenAI } from '@google/genai';
import { safeError } from '@/lib/securityUtils';
import path from 'path';
import fs from 'fs/promises';
import { ThumbnailStyle } from '../types';

interface ThumbnailGenerationParams {
  faceImageBase64: string;
  additionalImages?: string[];
  videoType?: string;
  instructions?: string;
  referenceImages: string[]; // Reference thumbnails for style learning
}

interface ThumbnailVariation {
  imageUrl: string;
  style: string;
  dominantColor: string;
  emotion: string;
}

const STYLE_CONFIGS: Record<ThumbnailStyle, {
  name: string;
  prompt: string;
  dominantColor: string;
  emotion: string;
}> = {
  'dramatic-shock': {
    name: 'Dramatic Shock',
    prompt: 'Create a dramatic YouTube thumbnail with high emotion. Close-up face with shocked/surprised expression, strong red and yellow color contrast, dark dramatic background with spotlight effect, big bold text placement area. High contrast, intense lighting, viral style.',
    dominantColor: 'Red',
    emotion: 'Shocked',
  },
  'clean-professional': {
    name: 'Clean Professional',
    prompt: 'Create a clean, professional YouTube thumbnail. Balanced composition, soft lighting, minimal design, blue and white color scheme, confident expression, modern typography area. Professional, trustworthy, educational style.',
    dominantColor: 'Blue',
    emotion: 'Confident',
  },
  'cinematic-dark': {
    name: 'Cinematic Dark',
    prompt: 'Create a cinematic, dramatic YouTube thumbnail. Dark moody background, spotlight on face, intense serious expression, purple and orange color grading, film noir style lighting. Mysterious, high-production value aesthetic.',
    dominantColor: 'Purple',
    emotion: 'Intense',
  },
  'bright-viral': {
    name: 'Bright Viral',
    prompt: 'Create a bright, viral-style YouTube thumbnail. High saturation, vibrant colors (yellow, green, pink), energetic happy expression, sharp outlines, dynamic composition, eye-catching design. Fun, energetic, attention-grabbing style.',
    dominantColor: 'Yellow',
    emotion: 'Excited',
  },
};

export async function generateThumbnails(
  params: ThumbnailGenerationParams
): Promise<ThumbnailVariation[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });
  const thumbnails: ThumbnailVariation[] = [];

  // Generate 4 variations
  const styles: ThumbnailStyle[] = [
    'dramatic-shock',
    'clean-professional',
    'cinematic-dark',
    'bright-viral',
  ];

  for (const styleKey of styles) {
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount < maxRetries) {
      try {
        const styleConfig = STYLE_CONFIGS[styleKey];
        
        // Build comprehensive prompt with increasing strictness on retries
        const prompt = buildThumbnailPrompt(
          styleConfig.prompt,
          params.videoType,
          params.instructions,
          params.referenceImages,
          retryCount
        );

        console.log(`Generating ${styleConfig.name} thumbnail (attempt ${retryCount + 1})...`);

        // Extract base64 data from data URL
        const faceImageData = params.faceImageBase64.includes('base64,')
          ? params.faceImageBase64.split('base64,')[1]
          : params.faceImageBase64;

        // Build contents array with face image and prompt
        const contents = [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: faceImageData,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ];

        // Generate thumbnail using Nano Banana Pro with face image
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: contents,
        });

        // Extract image data
        if (!response.candidates?.[0]?.content?.parts) {
          throw new Error('No image data found in response');
        }

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const base64Data = part.inlineData.data;
            
            // Save thumbnail
            const publicDir = path.join(process.cwd(), 'public', 'thumbnails');
            await fs.mkdir(publicDir, { recursive: true });

            const timestamp = Date.now();
            const filename = `thumbnail_${styleKey}_${timestamp}.png`;
            const filepath = path.join(publicDir, filename);

            // Convert base64 to buffer and save
            const buffer = Buffer.from(base64Data, 'base64');
            await fs.writeFile(filepath, buffer);

            console.log(`Saved ${styleConfig.name}: ${filename}`);

            thumbnails.push({
              imageUrl: `/thumbnails/${filename}`,
              style: styleConfig.name,
              dominantColor: styleConfig.dominantColor,
              emotion: styleConfig.emotion,
            });

            break; // Only take first image from response
          }
        }
        
        // Success - break retry loop
        break;
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          safeError(`Failed to generate ${styleKey} thumbnail after ${maxRetries} attempts:`, error);
          // Continue with other styles even if one fails
        } else {
          console.log(`Retrying ${styleKey} thumbnail generation...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }
  }

  if (thumbnails.length === 0) {
    throw new Error('Failed to generate any thumbnails');
  }

  return thumbnails;
}

function buildThumbnailPrompt(
  basePrompt: string,
  videoType?: string,
  userInstructions?: string,
  referenceImages?: string[],
  retryAttempt: number = 0
): string {
  // Add extra emphasis on retries
  const faceEmphasis = retryAttempt > 0 
    ? `\n⚠️ CRITICAL: Previous attempt failed to preserve the face. You MUST use the EXACT face from the provided image. DO NOT generate a different person.\n`
    : '';

  let prompt = `You are a professional YouTube thumbnail designer. I have provided you with a face photo. Create a high-converting YouTube thumbnail using THIS EXACT FACE from the provided image.
${faceEmphasis}
CRITICAL FACE REQUIREMENTS (HIGHEST PRIORITY):
- Use ONLY the face from the provided image - this is MANDATORY
- DO NOT generate a different person's face
- DO NOT change the person's gender, age, or ethnicity
- DO NOT use any other face or person
- Keep the facial features, skin tone, and identity EXACTLY as shown in the provided image
- The face must be clearly recognizable as the same person from the input image
- Treat the provided face image as the PRIMARY input - everything else is secondary

THUMBNAIL SPECIFICATIONS:
- Resolution: 1280x720 pixels (16:9 aspect ratio)
- Face must occupy 30-50% of the frame
- High contrast for mobile visibility
- Clear space for text overlay (don't add actual text, just design the layout)
- Professional quality, sharp and clear

STYLE DIRECTION:
${basePrompt}

`;

  if (videoType) {
    const videoTypePrompts: Record<string, string> = {
      vlog: 'Personal, relatable, friendly vibe',
      challenge: 'Exciting, action-packed, energetic',
      'tech-review': 'Modern, sleek, professional tech aesthetic',
      reaction: 'Expressive, emotional, engaging',
      finance: 'Professional, trustworthy, sophisticated',
      fitness: 'Energetic, motivational, strong',
      gaming: 'Dynamic, colorful, exciting',
      educational: 'Clear, professional, informative',
      entertainment: 'Fun, engaging, eye-catching',
    };
    
    prompt += `VIDEO TYPE: ${videoType}\n`;
    prompt += `Style adjustment: ${videoTypePrompts[videoType] || 'Engaging and professional'}\n\n`;
  }

  if (userInstructions) {
    prompt += `USER INSTRUCTIONS:\n${userInstructions}\n\n`;
  }

  if (referenceImages && referenceImages.length > 0) {
    prompt += `REFERENCE STYLE NOTES:
Study the composition, color schemes, and layout patterns from professional YouTube thumbnails.
- Learn from: facial expression intensity, color contrast techniques, text placement areas
- DO NOT copy: exact layouts, specific text, identifiable elements
- Focus on: professional quality, attention-grabbing design principles

`;
  }

  prompt += `ABSOLUTE REQUIREMENTS - MUST FOLLOW:
1. ✅ Use ONLY the face from the provided input image (MOST IMPORTANT)
2. ❌ DO NOT generate any other person's face
3. ❌ DO NOT change the person's identity, gender, age, or ethnicity
4. ✅ The person in the thumbnail MUST be recognizable as the same person from the input image
5. ✅ Preserve all facial features exactly as they appear in the input
6. ✅ Only modify: background, lighting, colors, composition, expression intensity
7. ✅ The face identity must remain 100% consistent with the input image

WORKFLOW:
1. First, analyze the provided face image carefully
2. Identify the person's key facial features
3. Generate the thumbnail background and composition
4. Place the EXACT SAME FACE from the input image into the thumbnail
5. Apply the style effects (lighting, colors) while keeping the face identity unchanged

Generate a professional, high-converting YouTube thumbnail using the provided face image and following these guidelines strictly.`;

  return prompt;
}
