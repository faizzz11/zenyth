import { NextRequest, NextResponse } from 'next/server';
import { generateThumbnails } from '../../services/thumbnailGenerator';
import { validateFaceImage } from '../../services/faceDetection';
import { connectToDatabase } from '@/lib/mongodb';
import { safeError } from '@/lib/securityUtils';
import { ThumbnailGenerationRequest, ThumbnailGenerationResponse, ThumbnailDocument } from '../../types';
import path from 'path';
import fs from 'fs/promises';

// Load reference thumbnails
async function loadReferenceThumbnails(): Promise<string[]> {
  const refDir = path.join(process.cwd(), 'public', 'thumbnail-ref');
  const files = await fs.readdir(refDir);
  
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  
  return imageFiles.map(file => `/thumbnail-ref/${file}`);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ThumbnailGenerationRequest = await request.json();
    const { faceImage, additionalImages, videoType, detailedInstructions, userId } = body;

    // Validate required fields
    if (!faceImage || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Missing required fields: faceImage and userId are required',
            retryable: false,
          },
        } as ThumbnailGenerationResponse,
        { status: 400 }
      );
    }

    // Validate face image
    const validation = await validateFaceImage(faceImage);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: validation.message || 'Invalid face image',
            retryable: false,
          },
        } as ThumbnailGenerationResponse,
        { status: 400 }
      );
    }

    // Load reference thumbnails for style learning
    const referenceImages = await loadReferenceThumbnails();
    console.log(`Loaded ${referenceImages.length} reference thumbnails for style learning`);

    // Generate thumbnails
    console.log('Starting thumbnail generation...');
    const thumbnails = await generateThumbnails({
      faceImageBase64: faceImage,
      additionalImages,
      videoType,
      instructions: detailedInstructions,
      referenceImages,
    });

    const generationTime = Date.now() - startTime;
    console.log(`Generated ${thumbnails.length} thumbnails in ${generationTime}ms`);

    // Store in database
    try {
      const db = await connectToDatabase();
      const thumbnailDocument: ThumbnailDocument = {
        userId,
        videoType,
        instructions: detailedInstructions,
        thumbnails,
        metadata: {
          generationTime,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('thumbnails').insertOne(thumbnailDocument);
    } catch (error) {
      safeError('Failed to store thumbnails in database:', error);
    }

    return NextResponse.json({
      success: true,
      thumbnails,
    } as ThumbnailGenerationResponse);
  } catch (error: any) {
    safeError('Thumbnail generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'An unexpected error occurred',
          retryable: true,
        },
      } as ThumbnailGenerationResponse,
      { status: 500 }
    );
  }
}
