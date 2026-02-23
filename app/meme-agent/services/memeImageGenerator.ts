import { createPollinationsClient } from '@/lib/pollinations';

export async function generateMemeImage(
  visualDescription: string
): Promise<string> {
  const client = createPollinationsClient();
  
  const imageUrl = await client.generateWithRetry(visualDescription, 3, 30000);
  
  // Validate HTTPS URL format
  if (!imageUrl.startsWith('https://')) {
    throw new Error('Invalid image URL format');
  }
  
  // Validate URL structure
  try {
    new URL(imageUrl);
  } catch {
    throw new Error('Invalid image URL');
  }
  
  // Note: Image resolution validation would require fetching and parsing the image
  // This is typically done by the image generation service itself
  
  return imageUrl;
}
