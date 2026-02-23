import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MemeHistoryItem } from '../../types';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50); // Max 50
    
    // Validate userId
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId is required',
        },
        { status: 400 }
      );
    }
    
    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'page must be >= 1',
        },
        { status: 400 }
      );
    }
    
    if (limit < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'limit must be >= 1',
        },
        { status: 400 }
      );
    }
    
    // Connect to database
    const db = await connectToDatabase();
    const memesCollection = db.collection('memes');
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Query for user's memes
    const query = { userId };
    
    // Get total count
    const total = await memesCollection.countDocuments(query);
    
    // Get paginated results, ordered by timestamp descending
    const memes = await memesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Transform to MemeHistoryItem format
    const historyItems: MemeHistoryItem[] = memes.map((meme) => ({
      id: meme._id.toString(),
      userId: meme.userId,
      topic: meme.topic,
      style: meme.style,
      mode: meme.mode,
      output: {
        memeImage: meme.output.imageUrl,
        memeCaption: meme.concept.caption,
        memeVideo: meme.output.videoUrl,
      },
      timestamp: meme.createdAt,
    }));
    
    // Calculate if there are more pages
    const hasMore = skip + memes.length < total;
    
    // Return response
    return NextResponse.json({
      success: true,
      data: historyItems,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    });
    
  } catch (error) {
    console.error('Error fetching meme history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch meme history',
      },
      { status: 500 }
    );
  }
}
