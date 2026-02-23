import { createFFmpegService } from '@/lib/ffmpeg';
import path from 'path';
import fs from 'fs/promises';

export async function generateMemeVideo(
  imageUrl: string,
  caption: string,
  punchline: string
): Promise<string> {
  const ffmpegService = createFFmpegService();
  
  // Verify FFmpeg is installed
  const isInstalled = await ffmpegService.verifyInstallation();
  if (!isInstalled) {
    throw new Error('FFmpeg is not installed or not accessible');
  }
  
  // Create public directory for videos if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public', 'memes');
  await fs.mkdir(publicDir, { recursive: true });
  
  // Generate unique filename
  const timestamp = Date.now();
  const outputFilename = `meme_${timestamp}.mp4`;
  const outputPath = path.join(publicDir, outputFilename);
  
  // Create video with timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Video generation timed out after 45 seconds')), 45000);
  });
  
  const videoPromise = ffmpegService.createMemeVideo(
    imageUrl,
    caption,
    punchline,
    outputPath
  );
  
  try {
    await Promise.race([videoPromise, timeoutPromise]);
  } catch (error) {
    // Clean up output file if it exists
    try {
      await fs.unlink(outputPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
  
  // Return HTTPS URL (in production, this would be the actual domain)
  // For now, return a relative URL that will be converted to full URL by the client
  const videoUrl = `/memes/${outputFilename}`;
  
  // Validate the file exists and has content
  try {
    const stats = await fs.stat(outputPath);
    if (stats.size === 0) {
      throw new Error('Generated video file is empty');
    }
  } catch (error) {
    throw new Error(`Failed to validate video file: ${(error as Error).message}`);
  }
  
  return videoUrl;
}
