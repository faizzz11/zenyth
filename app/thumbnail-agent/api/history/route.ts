import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { safeError } from '@/lib/securityUtils';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    const history = await db
      .collection('thumbnails')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ history });
  } catch (error) {
    safeError('Failed to fetch thumbnail history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
