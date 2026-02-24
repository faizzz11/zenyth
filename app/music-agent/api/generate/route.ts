import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { parsePromptToParameters } from '../../services/promptParser';
import { generateMusic } from '../../services/musicGenerator';
import { connectToDatabase } from '@/lib/mongodb';
import { safeError } from '@/lib/securityUtils';
import { MusicGenerationRequest, MusicGenerationResponse, MusicDocument } from '../../types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', retryable: false } } as MusicGenerationResponse,
        { status: 401 }
      );
    }

    const body: Omit<MusicGenerationRequest, 'userId'> = await request.json();
    const { mood, tempo, bpm, genre, singerStyle, freeTextPrompt } = body;

    if (!mood || !tempo || !genre) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Missing required fields: mood, tempo, genre', retryable: false },
        } as MusicGenerationResponse,
        { status: 400 }
      );
    }

    // Check for voice cloning attempts
    if (
      freeTextPrompt?.toLowerCase().includes('voice') ||
      freeTextPrompt?.toLowerCase().includes('clone') ||
      freeTextPrompt?.toLowerCase().includes('sound like')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Voice cloning is not supported. This system generates music in the stylistic essence of artists, not voice replicas.',
            retryable: false,
          },
        } as MusicGenerationResponse,
        { status: 400 }
      );
    }

    const parsed = parsePromptToParameters(mood, tempo, genre, singerStyle, freeTextPrompt);

    console.log('Generating music with parameters:', parsed);

    const audioUrl = await generateMusic({
      styleDescription: parsed.styleDescription,
      bpm: bpm || parsed.bpm || 110,
      duration: 30,
    });

    const generationTime = Date.now() - startTime;

    // Store in database
    try {
      const db = await connectToDatabase();
      const musicDocument: MusicDocument = {
        userId,
        mood,
        tempo,
        bpm: bpm || parsed.bpm,
        genre,
        singerStyle,
        prompt: parsed.styleDescription,
        output: {
          audioUrl,
          duration: 30,
        },
        metadata: {
          generationTime,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('music').insertOne(musicDocument);
    } catch (error) {
      safeError('Failed to store music in database:', error);
    }

    return NextResponse.json({
      success: true,
      output: {
        audioUrl,
        styleReference: singerStyle || 'Original style',
        tempo,
        mood,
        genre,
        duration: 30,
      },
    } as MusicGenerationResponse);
  } catch (error: any) {
    safeError('Music generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || 'An unexpected error occurred', retryable: true },
      } as MusicGenerationResponse,
      { status: 500 }
    );
  }
}
