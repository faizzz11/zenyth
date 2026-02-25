import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { connectToDatabase } from '@/lib/mongodb';
import {
  scrapeYouTubeChannel,
  scrapeInstagramProfile,
} from '@/lib/apify';
import type { Platform, CompetitorAnalysis } from '../../types';

export const runtime = 'nodejs';
export const maxDuration = 300;

function detectPlatform(url: string): Platform | null {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.startsWith('@')) return 'youtube';
  if (lower.includes('instagram.com')) return 'instagram';
  return null;
}

function normalizeYouTubeUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('@')) {
    return `https://www.youtube.com/${trimmed}`;
  }
  if (trimmed.startsWith('http')) return trimmed;
  return `https://www.youtube.com/${trimmed}`;
}

function normalizeInstagramUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('http')) return trimmed;
  if (trimmed.startsWith('@')) return `https://www.instagram.com/${trimmed.slice(1)}`;
  return `https://www.instagram.com/${trimmed}`;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  const platform = detectPlatform(url);
  if (!platform) {
    return NextResponse.json({ error: 'Could not detect platform. Provide a YouTube or Instagram URL.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    let rawData: string;
    let channelName = 'Unknown';
    let profilePic: string | undefined;
    let subscribers: number | undefined;
    let followers: number | undefined;
    let totalViews: number | undefined;
    let totalPosts: number | undefined;

    if (platform === 'youtube') {
      const normalized = normalizeYouTubeUrl(url);
      console.log('Scraping YouTube channel:', normalized);
      const { channel, videos } = await scrapeYouTubeChannel(normalized);

      channelName = channel?.channelName || 'Unknown Channel';
      subscribers = channel?.numberOfSubscribers;
      totalViews = channel?.channelTotalViews;
      totalPosts = channel?.numberOfVideos ?? videos.length;

      rawData = JSON.stringify({
        channel: {
          name: channel?.channelName,
          subscribers: channel?.numberOfSubscribers,
          totalViews: channel?.channelTotalViews,
          totalVideos: channel?.numberOfVideos,
          description: channel?.channelDescription,
          joinedDate: channel?.joinedDate,
        },
        videos: videos.slice(0, 50).map(v => ({
          title: v.title,
          views: v.viewCount,
          likes: v.likes,
          comments: v.commentsCount,
          date: v.date,
          duration: v.duration,
          url: v.url,
        })),
      });
    } else {
      const normalized = normalizeInstagramUrl(url);
      console.log('Scraping Instagram profile:', normalized);
      const { profile, posts } = await scrapeInstagramProfile(normalized);

      channelName = profile?.fullName || profile?.username || 'Unknown Profile';
      profilePic = profile?.profilePicUrl;
      followers = profile?.followersCount;
      totalPosts = profile?.postsCount ?? posts.length;

      rawData = JSON.stringify({
        profile: {
          username: profile?.username,
          fullName: profile?.fullName,
          bio: profile?.biography,
          followers: profile?.followersCount,
          following: profile?.followsCount,
          posts: profile?.postsCount,
          isVerified: profile?.isVerified,
          externalUrl: profile?.externalUrl,
        },
        recentPosts: posts.slice(0, 50).map(p => ({
          caption: p.caption?.substring(0, 300),
          likes: p.likesCount,
          comments: p.commentsCount,
          timestamp: p.timestamp,
          type: p.type,
          videoViews: p.videoViewCount,
          hashtags: p.hashtags,
        })),
      });
    }

    // AI Analysis with Gemini
    const ai = new GoogleGenAI({ apiKey });

    const analysisPrompt = `You are an expert social media strategist and competitive intelligence analyst.

Analyze the following ${platform === 'youtube' ? 'YouTube channel' : 'Instagram profile'} data and provide a comprehensive competitive intelligence report.

RAW DATA:
${rawData}

Provide your analysis as a JSON object with these exact fields:

{
  "contentPerformance": {
    "topVideosByViews": [{"title": "...", "views": 0, "likes": 0, "comments": 0, "url": "...", "date": "..."}],
    "avgEngagementRate": 0.0,
    "bestContentType": "description of what type performs best",
    "durationInsight": "insight about optimal content length/duration",
    "totalVideosAnalyzed": 0
  },
  "postingPattern": {
    "mostActiveDay": "day of week",
    "uploadFrequency": "description like 'twice per week'",
    "avgPostsPerWeek": 0,
    "bestTimeToPost": "estimated best posting time",
    "consistencyScore": "high/medium/low with explanation"
  },
  "audienceInsight": {
    "contentStyle": "educational/entertainment/mixed etc",
    "targetAudience": "description of who they target",
    "topicClusters": ["topic1", "topic2", "topic3"],
    "titlePatterns": ["pattern1", "pattern2"],
    "thumbnailStyle": "description of visual patterns"
  },
  "contentGap": {
    "underservedTopics": ["topic1", "topic2"],
    "overusedThemes": ["theme1", "theme2"],
    "trendingOpportunities": ["opportunity1", "opportunity2"]
  },
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "..."]
}

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no extra text. For ${platform === 'instagram' ? 'Instagram' : 'YouTube'}, adapt field names appropriately (e.g. "topVideosByViews" can contain posts/reels for Instagram). Fill in real data from the scraped content. If data is missing, provide reasonable estimates based on available info.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: analysisPrompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '';
    let analysisData: any;

    try {
      analysisData = JSON.parse(text);
    } catch {
      // Try extracting JSON from markdown
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
      if (match) {
        analysisData = JSON.parse(match[1] || match[0]);
      } else {
        throw new Error('Failed to parse AI analysis response');
      }
    }

    const analysis: CompetitorAnalysis = {
      id: `analysis_${Date.now()}`,
      userId,
      platform,
      url,
      channelName,
      profilePic,
      subscribers,
      followers,
      totalViews,
      totalPosts,
      contentPerformance: analysisData.contentPerformance || {},
      postingPattern: analysisData.postingPattern || {},
      audienceInsight: analysisData.audienceInsight || {},
      contentGap: analysisData.contentGap || {},
      recommendations: analysisData.recommendations || [],
      analyzedAt: new Date().toISOString(),
    };

    // Save to MongoDB with timeout handling
    try {
      const db = await connectToDatabase();
      await db.collection('competitor_analyses').insertOne({
        ...analysis,
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error('MongoDB save error (non-critical):', dbError);
      // Continue even if save fails - user still gets the analysis
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Competitor analysis error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Analysis failed';
    if (error instanceof Error) {
      if (error.message.includes('ETIMEOUT') || error.message.includes('timeout')) {
        errorMessage = 'Database connection timeout. Analysis completed but not saved. Please try again.';
      } else if (error.message.includes('Apify')) {
        errorMessage = 'Failed to scrape channel data. Please check the URL and try again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
