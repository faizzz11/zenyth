/**
 * Image compression utility for meme images
 * Reduces file size while maintaining visual quality
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, default 0.85
  format?: 'jpeg' | 'webp' | 'png';
}

export async function compressImage(
  imageUrl: string,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    format = 'jpeg',
  } = options;

  // Fetch the image
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Create an image element
  const img = await createImageBitmap(blob);

  // Calculate new dimensions while maintaining aspect ratio
  let width = img.width;
  let height = img.height;

  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;

    if (width > height) {
      width = Math.min(width, maxWidth);
      height = width / aspectRatio;
    } else {
      height = Math.min(height, maxHeight);
      width = height * aspectRatio;
    }
  }

  // Create canvas and draw resized image
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0, width, height);

  // Convert to blob with compression
  const mimeType = `image/${format}`;
  const compressedBlob = await canvas.convertToBlob({
    type: mimeType,
    quality,
  });

  return compressedBlob;
}

/**
 * Compress image and return as data URL
 */
export async function compressImageToDataURL(
  imageUrl: string,
  options: CompressionOptions = {}
): Promise<string> {
  const blob = await compressImage(imageUrl, options);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Calculate compression ratio
 */
export async function getCompressionRatio(
  originalUrl: string,
  compressedBlob: Blob
): Promise<number> {
  const originalResponse = await fetch(originalUrl);
  const originalBlob = await originalResponse.blob();
  return compressedBlob.size / originalBlob.size;
}

/**
 * Server-side image compression using sharp (Node.js only)
 */
export async function compressImageServer(
  imageBuffer: Buffer,
  options: CompressionOptions = {}
): Promise<Buffer> {
  // This function is for server-side use only
  // It requires the 'sharp' package to be installed
  try {
    const sharp = require('sharp');
    
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      format = 'jpeg',
    } = options;

    let pipeline = sharp(imageBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });

    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
    }

    return await pipeline.toBuffer();
  } catch (error) {
    // If sharp is not available, return original buffer
    console.warn('Sharp not available, returning original image:', error);
    return imageBuffer;
  }
}
