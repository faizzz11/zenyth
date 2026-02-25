import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { safeError } from '@/lib/securityUtils';

export const maxDuration = 10; // 10 seconds timeout

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    const history = await db
      .collection('music')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .maxTimeMS(8000) // 8 second query timeout
      .toArray();

    return NextResponse.json({ history });
  } catch (error) {
    safeError('Failed to fetch music history:', error);
    
    // Return empty array on timeout instead of error
    if (error instanceof Error && (error.message.includes('ETIMEOUT') || error.message.includes('timeout'))) {
      return NextResponse.json({ history: [] });
    }
    
    return NextResponse.json({ history: [] }, { status: 200 });
  }
}
