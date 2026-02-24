import { GoogleGenAI } from '@google/genai';
import { safeError } from '@/lib/securityUtils';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';

export async function generateMemeVideo(
  imageUrl: string,
  caption: string,
  punchline: string,
  userId: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  // Create the prompt for Veo to generate an animated meme video
  const prompt = `Create a short animated meme video based on this concept:

Caption (appears at top): "${caption}"
Punchline (appears at bottom): "${punchline}"

The video should:
- Be humorous and engaging
- Have smooth animations or transitions
- Include the text overlays prominently
- Be suitable for social media sharing
- Have a meme-style aesthetic

Style: Dynamic, eye-catching, with bold text overlays`;

  let lastError: Error;
  const maxRetries = 2;
  const pollInterval = 10000; // Poll every 10 seconds
  const maxPollTime = 360000; // Max 6 minutes total

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Starting Veo video generation attempt ${attempt + 1}...`);
      
      // Step 1: Start the video generation operation
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: prompt,
        config: {
          aspectRatio: '16:9',
          durationSeconds: 6,
        },
      });

      if (!operation.name) {
        throw new Error('No operation name returned from Veo API');
      }

      console.log(`Veo operation started: ${operation.name}`);

      // Step 2: Poll the operation until it's done
      const startTime = Date.now();

      while (!operation.done) {
        if (Date.now() - startTime > maxPollTime) {
          throw new Error('Video generation exceeded maximum wait time (6 minutes)');
        }

        console.log('Waiting for video generation to complete...');
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        operation = await ai.operations.getVideosOperation({
          operation: operation,
        });

        console.log(`Veo operation status: ${operation.done ? 'done' : 'in progress'}`);
      }

      // Step 3: Check for errors in the completed operation
      if (operation.error) {
        throw new Error(`Veo operation failed: ${JSON.stringify(operation.error)}`);
      }

      // Step 4: Extract video from the completed operation
      if (!operation.response?.generatedVideos?.[0]?.video) {
        throw new Error('No video data found in completed operation');
      }

      const video = operation.response.generatedVideos[0].video;
      
      // Step 5: Get video buffer and upload to Cloudinary
      let videoBuffer: Buffer;

      if (video.videoBytes) {
        videoBuffer = Buffer.from(video.videoBytes);
      } else if (video.uri) {
        const response = await fetch(video.uri, {
          headers: {
            'x-goog-api-key': apiKey,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to download video from URI: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        videoBuffer = Buffer.from(arrayBuffer);
      } else {
        throw new Error('Video has neither videoBytes nor uri property');
      }

      if (videoBuffer.length === 0) {
        throw new Error('Generated video buffer is empty');
      }

      // Upload to Cloudinary
      const result = await uploadBufferToCloudinary(videoBuffer, {
        folder: 'memes',
        userId,
        resourceType: 'video',
      });

      console.log(`Video uploaded to Cloudinary: ${result.url} (${result.bytes} bytes)`);

      return result.url;
    } catch (error) {
      lastError = error as Error;
      safeError(`Veo video generation attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = 5000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
