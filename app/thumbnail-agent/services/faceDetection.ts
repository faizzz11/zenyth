// Face detection and validation service
export async function validateFaceImage(imageBase64: string): Promise<{
  isValid: boolean;
  message?: string;
}> {
  try {
    // Basic validation - check if it's a valid base64 image
    if (!imageBase64 || imageBase64.length < 100) {
      return {
        isValid: false,
        message: 'Image data is too small or invalid',
      };
    }

    // Check if it's a valid image format
    const validFormats = ['data:image/jpeg', 'data:image/jpg', 'data:image/png', 'data:image/webp'];
    const hasValidFormat = validFormats.some(format => imageBase64.startsWith(format));

    if (!hasValidFormat) {
      return {
        isValid: false,
        message: 'Invalid image format. Please upload JPEG, PNG, or WebP',
      };
    }

    // In a production environment, you would use a face detection API here
    // For now, we'll do basic validation
    return {
      isValid: true,
    };
  } catch (error) {
    return {
      isValid: false,
      message: 'Failed to validate image',
    };
  }
}

export function extractBase64Data(dataUrl: string): string {
  // Remove data URL prefix if present
  if (dataUrl.startsWith('data:')) {
    const base64Index = dataUrl.indexOf('base64,');
    if (base64Index !== -1) {
      return dataUrl.substring(base64Index + 7);
    }
  }
  return dataUrl;
}
