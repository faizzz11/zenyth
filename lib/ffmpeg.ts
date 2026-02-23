import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export class FFmpegService {
  async verifyInstallation(): Promise<boolean> {
    try {
      await execAsync('ffmpeg -version');
      return true;
    } catch {
      return false;
    }
  }

  async createMemeVideo(
    imageUrl: string,
    caption: string,
    punchline: string,
    outputPath: string
  ): Promise<string> {
    const isInstalled = await this.verifyInstallation();
    if (!isInstalled) {
      throw new Error('FFmpeg is not installed or not accessible');
    }

    const tempDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tempDir, { recursive: true });

    const tempImagePath = path.join(tempDir, `input-${Date.now()}.jpg`);
    const tempVideoPath = path.join(tempDir, `output-${Date.now()}.mp4`);

    try {
      // Download image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      await fs.writeFile(tempImagePath, Buffer.from(imageBuffer));

      // Escape special characters in text
      const escapedCaption = caption.replace(/'/g, "\\'").replace(/:/g, "\\:");
      const escapedPunchline = punchline.replace(/'/g, "\\'").replace(/:/g, "\\:");

      // Generate video with text overlays
      const command = `ffmpeg -loop 1 -i "${tempImagePath}" -vf "` +
        `drawtext=text='${escapedCaption}':fontsize=48:fontcolor=white:` +
        `x=(w-text_w)/2:y=h-100:enable='between(t,0,3)':` +
        `alpha='if(lt(t,0.5),t/0.5,if(lt(t,2.5),1,(3-t)/0.5))',` +
        `drawtext=text='${escapedPunchline}':fontsize=48:fontcolor=white:` +
        `x=(w-text_w)/2:y=h-50:enable='between(t,3,6)':` +
        `alpha='if(lt(t,3.5),(t-3)/0.5,if(lt(t,5.5),1,(6-t)/0.5))'` +
        `" -t 6 -c:v libx264 -pix_fmt yuv420p "${tempVideoPath}"`;

      await execAsync(command);

      // Move to final output location
      await fs.copyFile(tempVideoPath, outputPath);

      return outputPath;
    } finally {
      // Cleanup temporary files
      try {
        await fs.unlink(tempImagePath);
        await fs.unlink(tempVideoPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

export function createFFmpegService(): FFmpegService {
  return new FFmpegService();
}
