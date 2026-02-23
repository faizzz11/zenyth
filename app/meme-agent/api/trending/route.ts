import { NextResponse } from 'next/server';
import { getTrendingTopics } from '../../services/trendingTopicsService';

export async function GET() {
  try {
    const topics = await getTrendingTopics();
    
    return NextResponse.json({
      success: true,
      topics,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to load trending topics. Try custom topic mode.',
      },
      { status: 500 }
    );
  }
}
