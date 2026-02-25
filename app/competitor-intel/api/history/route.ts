import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';

export const maxDuration = 10; // 10 seconds timeout for history fetch

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    const items = await db
      .collection('competitor_analyses')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .project({
        id: 1,
        platform: 1,
        channelName: 1,
        url: 1,
        analyzedAt: 1,
      })
      .maxTimeMS(8000) // 8 second query timeout
      .toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('History fetch error:', error);
    
    // Return empty array on timeout instead of error
    if (error instanceof Error && (error.message.includes('ETIMEOUT') || error.message.includes('timeout'))) {
      return NextResponse.json({ success: true, items: [] });
    }
    
    return NextResponse.json({ success: true, items: [] }, { status: 200 });
  }
}
