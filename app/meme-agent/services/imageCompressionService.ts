/**
 * Server-side image compression service for meme images
 * Compresses images before storing them to reduce storage costs
 */

import fs from 'fs/promises';
import path from 'path';

export interface CompressionResult {
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compress an image from a URL and save it to the public directory
 */
export async function compressAndStoreImage(
  imageUrl: string,
  filename: string
): Promise<CompressionResult> {
  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const originalBuffer = Buffer.from(await response.arrayBuffer());
    const originalSize = originalBuffer.length;

    // Try to use sharp for compression if available
    let compressedBuffer: Buffer;
    let compressedSize: number;

    try {
      const sharp = require('sharp');
      
      // Compress with sharp
      compressedBuffer = await sharp(originalBuffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          mozjpeg: true,
        })
        .toBuffer();
      
      compressedSize = compressedBuffer.length;
    } catch (error) {
      // If sharp is not available, use the original buffer
      console.warn('Sharp not available, using original image:', error);
      compressedBuffer = originalBuffer;
      compressedSize = originalSize;
    }

    // Ensure the memes directory exists
    const memesDir = path.join(process.cwd(), 'public', 'memes');
    await fs.mkdir(memesDir, { recursive: true });

    // Save the compressed image
    const filepath = path.join(memesDir, filename);
    await fs.writeFile(filepath, compressedBuffer);

    // Return the public URL
    const compressedUrl = `/memes/${filename}`;
    const compressionRatio = compressedSize / originalSize;

    return {
      compressedUrl,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    // If compression fails, return the original URL
    return {
      compressedUrl: imageUrl,
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 1,
    };
  }
}

/**
 * Generate a unique filename for a meme image
 */
export function generateMemeFilename(userId: string, timestamp: number): string {
  return `meme_${userId}_${timestamp}.jpg`;
}

/**
 * Clean up old meme files (optional maintenance function)
 */
export async function cleanupOldMemes(daysOld: number = 30): Promise<number> {
  try {
    const memesDir = path.join(process.cwd(), 'public', 'memes');
    const files = await fs.readdir(memesDir);
    
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    let deletedCount = 0;

    for (const file of files) {
      const filepath = path.join(memesDir, file);
      const stats = await fs.stat(filepath);
      
      if (stats.mtimeMs < cutoffTime) {
        await fs.unlink(filepath);
        deletedCount++;
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('Failed to cleanup old memes:', error);
    return 0;
  }
}
