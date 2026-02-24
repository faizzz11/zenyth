import { GoogleGenAI } from '@google/genai';
import { safeError } from '@/lib/securityUtils';
import path from 'path';
import fs from 'fs/promises';

export async function generateMemeVideo(
  imageUrl: string,
  caption: string,
  punchline: string
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
        // Check if we've exceeded max poll time
        if (Date.now() - startTime > maxPollTime) {
          throw new Error('Video generation exceeded maximum wait time (6 minutes)');
        }

        // Wait before polling again
        console.log('Waiting for video generation to complete...');
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        // Get updated operation status - pass the operation object itself
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
      
      // Step 5: Save video to public directory
      const publicDir = path.join(process.cwd(), 'public', 'memes');
      await fs.mkdir(publicDir, { recursive: true });

      const timestamp = Date.now();
      const filename = `meme_video_${timestamp}.mp4`;
      const filepath = path.join(publicDir, filename);

      // Check if video has videoBytes property
      if (video.videoBytes) {
        // Video data is available as bytes
        const buffer = Buffer.from(video.videoBytes);
        await fs.writeFile(filepath, buffer);
      } else if (video.uri) {
        // Video is available via URI - need to download it
        const response = await fetch(video.uri, {
          headers: {
            'x-goog-api-key': apiKey,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to download video from URI: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        await fs.writeFile(filepath, Buffer.from(arrayBuffer));
      } else {
        throw new Error('Video has neither videoBytes nor uri property');
      }

      // Validate the file exists and has content
      const stats = await fs.stat(filepath);
      if (stats.size === 0) {
        throw new Error('Generated video file is empty');
      }

      console.log(`Video saved successfully: ${filename} (${stats.size} bytes)`);

      // Return relative URL
      return `/memes/${filename}`;
    } catch (error) {
      lastError = error as Error;
      safeError(`Veo video generation attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = 5000; // 5 second delay between retries
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
