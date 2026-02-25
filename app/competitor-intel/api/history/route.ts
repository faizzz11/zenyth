import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';

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
      .toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
