import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const db = await connectToDatabase();
        
        // Fetch user's content plans, sorted by most recent
        const plans = await db
            .collection('content_plans')
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();

        return NextResponse.json({
            success: true,
            plans
        });

    } catch (error) {
        console.error('History fetch error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch history'
            },
            { status: 500 }
        );
    }
}
