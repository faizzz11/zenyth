import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateMemeConcept } from '../../services/memeConceptGenerator';
import { generateMemeImage } from '../../services/memeImageGenerator';
import { generateMemeVideo } from '../../services/memeVideoGenerator';
import { compressAndStoreImage, generateMemeFilename } from '../../services/imageCompressionService';
import { connectToDatabase } from '@/lib/mongodb';
import { safeError, createSafeErrorMessage } from '@/lib/securityUtils';
import { GenerationRequest, GenerationResponse, MemeDocument } from '../../types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            stage: 'concept',
            message: 'Authentication required',
            retryable: false,
          },
        } as GenerationResponse,
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body: GenerationRequest = await request.json();
    
    const { mode, topic, style, generateVideo } = body;
    
    // Validate required fields
    if (!mode || !topic || !style) {
      return NextResponse.json(
        {
          success: false,
          error: {
            stage: 'concept',
            message: 'Missing required fields: mode, topic, style',
            retryable: false,
          },
        } as GenerationResponse,
        { status: 400 }
      );
    }
    
    // Validate topic length
    if (topic.length < 3 || topic.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: {
            stage: 'concept',
            message: 'Topic must be between 3 and 200 characters',
            retryable: false,
          },
        } as GenerationResponse,
        { status: 400 }
      );
    }
    
    // Validate style
    if (!['classic', 'modern', 'minimalist'].includes(style)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            stage: 'concept',
            message: 'Invalid style. Must be classic, modern, or minimalist',
            retryable: false,
          },
        } as GenerationResponse,
        { status: 400 }
      );
    }
    
    // Set up timeout for entire pipeline (8 minutes for video generation)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Generation pipeline timed out after 8 minutes')), 480000);
    });
    
    const generationPromise = (async () => {
      let concept;
      let imageUrl;
      let videoUrl;
      const conceptStartTime = Date.now();
      
      // Step 1: Generate concept
      try {
        concept = await generateMemeConcept(topic, style);
      } catch (error) {
        throw {
          stage: 'concept',
          message: `Failed to generate meme concept: ${(error as Error).message}`,
          retryable: true,
        };
      }
      
      const conceptTime = Date.now() - conceptStartTime;
      const imageStartTime = Date.now();
      
      // Step 2: Generate image
      try {
        imageUrl = await generateMemeImage(concept.visualDescription);
        
        // Compress and store the image on Cloudinary
        const timestamp = Date.now();
        const filename = generateMemeFilename(userId, timestamp);
        const compressionResult = await compressAndStoreImage(imageUrl, filename, userId);
        
        // Use the Cloudinary URL
        imageUrl = compressionResult.compressedUrl;
        
        // Log compression stats
        if (compressionResult.compressionRatio < 1) {
          console.log(`Image compressed: ${(compressionResult.compressionRatio * 100).toFixed(1)}% of original size`);
        }
      } catch (error) {
        throw {
          stage: 'image',
          message: `Failed to generate meme image: ${(error as Error).message}`,
          retryable: true,
        };
      }
      
      const imageTime = Date.now() - imageStartTime;
      let videoTime;
      
      // Step 3: Generate video (if enabled)
      if (generateVideo) {
        const videoStartTime = Date.now();
        try {
          videoUrl = await generateMemeVideo(imageUrl, concept.caption, concept.punchline, userId);
          videoTime = Date.now() - videoStartTime;
        } catch (error) {
          // Video generation failure is not fatal - we still have the image
          safeError('Video generation failed (FFmpeg may not be installed):', error);
          console.warn('Continuing without video. To enable video generation, install FFmpeg.');
          videoTime = 0;
        }
      }
      
      // Store result in MongoDB
      try {
        const db = await connectToDatabase();
        const memeDocument: MemeDocument = {
          userId,
          mode,
          topic,
          style,
          concept: {
            caption: concept.caption,
            punchline: concept.punchline,
            visualDescription: concept.visualDescription,
          },
          output: {
            imageUrl,
            videoUrl,
          },
          metadata: {
            generationTime: Date.now() - startTime,
            imageGenerationTime: imageTime,
            videoGenerationTime: videoTime,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await db.collection('memes').insertOne(memeDocument);
      } catch (error) {
        // Log error but don't fail the request
        safeError('Failed to store meme in database:', error);
      }
      
      // Return successful response
      return {
        success: true,
        output: {
          memeImage: imageUrl,
          memeCaption: concept.caption,
          memeVideo: videoUrl,
        },
      } as GenerationResponse;
    })();
    
    // Race between generation and timeout
    const result = await Promise.race([generationPromise, timeoutPromise]);
    return NextResponse.json(result);
    
  } catch (error: any) {
    // Handle structured errors from generation pipeline
    if (error.stage) {
      return NextResponse.json(
        {
          success: false,
          error: {
            stage: error.stage,
            message: error.message,
            retryable: error.retryable,
          },
        } as GenerationResponse,
        { status: 500 }
      );
    }
    
    // Handle unexpected errors
    safeError('Unexpected error in generation pipeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          stage: 'concept',
          message: 'An unexpected error occurred',
          retryable: true,
        },
      } as GenerationResponse,
      { status: 500 }
    );
  }
}
