import { NextResponse } from 'next/server';
import { getTrendingTopics, refreshTrendingTopics } from '../../services/trendingTopicsService';

export async function GET(request: Request) {
  try {
    // Check if refresh parameter is present
    const { searchParams } = new URL(request.url);
    const shouldRefresh = searchParams.get('refresh') === 'true';
    
    // Clear cache if refresh is requested
    if (shouldRefresh) {
      refreshTrendingTopics();
    }
    
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
