import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadOptions {
  folder: string;
  userId: string;
  resourceType?: 'image' | 'video' | 'auto';
  publicId?: string;
}

interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a base64 or data URL string to Cloudinary
 */
export async function uploadToCloudinary(
  data: string,
  options: UploadOptions
): Promise<UploadResult> {
  const { folder, userId, resourceType = 'image', publicId } = options;

  const uploadOptions: Record<string, any> = {
    folder: `zenythh/${userId}/${folder}`,
    resource_type: resourceType,
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  // Ensure data URL prefix for base64 strings
  const uploadData = data.startsWith('data:') ? data : `data:image/jpeg;base64,${data}`;

  const result = await cloudinary.uploader.upload(uploadData, uploadOptions);

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Upload a Buffer to Cloudinary (for videos and binary data)
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadOptions
): Promise<UploadResult> {
  const { folder, userId, resourceType = 'video', publicId } = options;

  const uploadOptions: Record<string, any> = {
    folder: `zenythh/${userId}/${folder}`,
    resource_type: resourceType,
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}
