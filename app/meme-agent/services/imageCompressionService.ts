/**
 * Server-side image compression service for meme images
 * Uploads images to Cloudinary for cloud storage with per-user isolation
 */

import { uploadToCloudinary } from '@/lib/cloudinary';

export interface CompressionResult {
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compress an image from a URL and upload it to Cloudinary
 */
export async function compressAndStoreImage(
  imageUrl: string,
  filename: string,
  userId: string
): Promise<CompressionResult> {
  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const originalBuffer = Buffer.from(await response.arrayBuffer());
    const originalSize = originalBuffer.length;

    // Convert buffer to base64 data URL for Cloudinary upload
    const base64Data = `data:image/jpeg;base64,${originalBuffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(base64Data, {
      folder: 'memes',
      userId,
      resourceType: 'image',
    });

    return {
      compressedUrl: result.url,
      originalSize,
      compressedSize: result.bytes,
      compressionRatio: result.bytes / originalSize,
    };
  } catch (error) {
    console.error('Image compression/upload failed:', error);
    // If upload fails, return the original URL
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
  return `meme_${userId}_${timestamp}`;
}
