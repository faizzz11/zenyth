import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';

interface Activity {
    type: 'meme' | 'music' | 'thumbnail' | 'planner' | 'post' | 'competitor';
    title: string;
    time: string;
    status: 'completed' | 'alert' | 'scheduled';
    createdAt: Date;
    details?: any;
}

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
        const activities: Activity[] = [];

        // Fetch counts for stats
        const [memeCount, musicCount, thumbnailCount, planCount, analysisCount] = await Promise.all([
            db.collection('memes').countDocuments({ userId }),
            db.collection('music').countDocuments({ userId }),
            db.collection('thumbnails').countDocuments({ userId }),
            db.collection('content_plans').countDocuments({ userId }),
            db.collection('competitor_analyses').countDocuments({ userId }),
        ]);

        const totalGenerated = memeCount + musicCount + thumbnailCount + planCount + analysisCount;

        // Fetch meme generations
        const memes = await db
            .collection('memes')
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        memes.forEach(meme => {
            activities.push({
                type: 'meme',
                title: `Generated meme: "${meme.concept?.substring(0, 50)}..."`,
                time: getRelativeTime(meme.createdAt),
                status: 'completed',
                createdAt: meme.createdAt,
                details: {
                    style: meme.style,
                    mode: meme.mode
                }
            });
        });

        // Fetch music generations
        const music = await db
            .collection('music')
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        music.forEach(track => {
            activities.push({
                type: 'music',
                title: `Created music track: "${track.prompt?.substring(0, 50)}..."`,
                time: getRelativeTime(track.createdAt),
                status: 'completed',
                createdAt: track.createdAt,
                details: {
                    duration: track.duration
                }
            });
        });

        // Fetch thumbnail generations
        const thumbnails = await db
            .collection('thumbnails')
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        thumbnails.forEach(thumbnail => {
            const variantCount = thumbnail.variants?.length || 0;
            activities.push({
                type: 'thumbnail',
                title: `Generated ${variantCount} thumbnail variation${variantCount !== 1 ? 's' : ''}`,
                time: getRelativeTime(thumbnail.createdAt),
                status: 'completed',
                createdAt: thumbnail.createdAt,
                details: {
                    style: thumbnail.style,
                    variants: variantCount
                }
            });
        });

        // Fetch content plans
        const plans = await db
            .collection('content_plans')
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        plans.forEach(plan => {
            activities.push({
                type: 'planner',
                title: `Created 30-day plan for ${plan.niche}`,
                time: getRelativeTime(plan.createdAt),
                status: 'completed',
                createdAt: plan.createdAt,
                details: {
                    totalPosts: plan.totalPosts,
                    platforms: plan.platforms
                }
            });
        });

        // Fetch competitor analyses
        const analyses = await db
            .collection('competitor_analyses')
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        analyses.forEach(a => {
            activities.push({
                type: 'competitor',
                title: `Analyzed ${a.platform === 'youtube' ? 'YouTube' : 'Instagram'}: ${a.channelName}`,
                time: getRelativeTime(a.createdAt),
                status: 'completed',
                createdAt: a.createdAt,
            });
        });

        // Sort all activities by date and take top 10
        const sortedActivities = activities
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 10);

        return NextResponse.json({
            success: true,
            activities: sortedActivities,
            stats: {
                totalGenerated,
                memes: memeCount,
                music: musicCount,
                thumbnails: thumbnailCount,
                plans: planCount,
                analyses: analysisCount,
            },
        });

    } catch (error) {
        console.error('Activity fetch error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch activities'
            },
            { status: 500 }
        );
    }
}

function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
}
