import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import type { TrendingTopic, PlatformTrends } from '../../types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Fetch trending topics from SerpAPI for different platforms
 */
async function fetchPlatformTrends(platform: string): Promise<TrendingTopic[]> {
    const serpApiKey = process.env.SERPAPI_KEY;
    
    if (!serpApiKey) {
        console.warn('SERPAPI_KEY not configured');
        return [];
    }

    try {
        let trends: TrendingTopic[] = [];
        const timestamp = new Date().toISOString();

        switch (platform) {
            case 'youtube': {
                // YouTube trending videos
                const youtubeUrl = `https://serpapi.com/search.json?engine=youtube&search_query=trending&api_key=${serpApiKey}`;
                const youtubeResponse = await fetch(youtubeUrl);
                const youtubeData = await youtubeResponse.json();
                
                trends = (youtubeData.video_results || []).slice(0, 10).map((video: any, index: number) => ({
                    id: `yt-${index}-${Date.now()}`,
                    title: video.title || 'Untitled',
                    description: video.description || video.snippet || 'No description available',
                    platform: 'youtube' as const,
                    category: video.channel?.name || 'General',
                    trendScore: 100 - (index * 5),
                    relatedKeywords: video.title?.split(' ').slice(0, 5) || [],
                    source: 'YouTube Trending',
                    timestamp,
                    link: video.link
                }));
                break;
            }

            case 'twitter': {
                // Twitter/X trending topics
                const twitterUrl = `https://serpapi.com/search.json?engine=google_trends&q=twitter&geo=US&data_type=TIMESERIES&api_key=${serpApiKey}`;
                const twitterResponse = await fetch(twitterUrl);
                const twitterData = await twitterResponse.json();
                
                // Also get general trending searches
                const trendingUrl = `https://serpapi.com/search.json?engine=google&q=trending+on+twitter&api_key=${serpApiKey}`;
                const trendingResponse = await fetch(trendingUrl);
                const trendingData = await trendingResponse.json();
                
                trends = (trendingData.organic_results || []).slice(0, 10).map((result: any, index: number) => ({
                    id: `tw-${index}-${Date.now()}`,
                    title: result.title || 'Untitled',
                    description: result.snippet || 'No description available',
                    platform: 'twitter' as const,
                    category: 'Trending',
                    trendScore: 95 - (index * 5),
                    relatedKeywords: result.title?.split(' ').slice(0, 5) || [],
                    source: 'Twitter/X Trends',
                    timestamp,
                    link: result.link
                }));
                break;
            }

            case 'instagram': {
                // Instagram trending hashtags and topics
                const instaUrl = `https://serpapi.com/search.json?engine=google&q=trending+on+instagram&api_key=${serpApiKey}`;
                const instaResponse = await fetch(instaUrl);
                const instaData = await instaResponse.json();
                
                trends = (instaData.organic_results || []).slice(0, 10).map((result: any, index: number) => ({
                    id: `ig-${index}-${Date.now()}`,
                    title: result.title || 'Untitled',
                    description: result.snippet || 'No description available',
                    platform: 'instagram' as const,
                    category: 'Trending',
                    trendScore: 90 - (index * 5),
                    relatedKeywords: result.title?.split(' ').slice(0, 5) || [],
                    source: 'Instagram Trends',
                    timestamp,
                    link: result.link
                }));
                break;
            }

            case 'linkedin': {
                // LinkedIn trending topics
                const linkedinUrl = `https://serpapi.com/search.json?engine=google&q=trending+on+linkedin&api_key=${serpApiKey}`;
                const linkedinResponse = await fetch(linkedinUrl);
                const linkedinData = await linkedinResponse.json();
                
                trends = (linkedinData.organic_results || []).slice(0, 10).map((result: any, index: number) => ({
                    id: `li-${index}-${Date.now()}`,
                    title: result.title || 'Untitled',
                    description: result.snippet || 'No description available',
                    platform: 'linkedin' as const,
                    category: 'Professional',
                    trendScore: 85 - (index * 5),
                    relatedKeywords: result.title?.split(' ').slice(0, 5) || [],
                    source: 'LinkedIn Trends',
                    timestamp,
                    link: result.link
                }));
                break;
            }

            case 'general': {
                // General Google Trends
                const generalUrl = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=US&api_key=${serpApiKey}`;
                const generalResponse = await fetch(generalUrl);
                const generalData = await generalResponse.json();
                
                trends = (generalData.trending_searches || []).slice(0, 15).map((search: any, index: number) => ({
                    id: `gen-${index}-${Date.now()}`,
                    title: search.query || search.title || 'Untitled',
                    description: search.snippet || search.description || 'Trending topic',
                    platform: 'general' as const,
                    category: search.category || 'General',
                    searchVolume: search.search_volume,
                    trendScore: 100 - (index * 3),
                    relatedKeywords: search.related_queries?.slice(0, 5) || [],
                    source: 'Google Trends',
                    timestamp,
                    link: search.link
                }));
                break;
            }
        }

        return trends;
    } catch (error) {
        console.error(`Error fetching ${platform} trends:`, error);
        return [];
    }
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

        const { searchParams } = new URL(req.url);
        const platform = searchParams.get('platform');

        if (platform && platform !== 'all') {
            // Fetch trends for specific platform
            const trends = await fetchPlatformTrends(platform);
            return NextResponse.json({
                success: true,
                trends: [{
                    platform,
                    trends,
                    lastUpdated: new Date().toISOString()
                }]
            });
        }

        // Fetch trends for all platforms
        const platforms = ['general', 'youtube', 'twitter', 'instagram', 'linkedin'];
        const allTrends = await Promise.all(
            platforms.map(async (platform) => ({
                platform,
                trends: await fetchPlatformTrends(platform),
                lastUpdated: new Date().toISOString()
            }))
        );

        return NextResponse.json({
            success: true,
            trends: allTrends.filter(pt => pt.trends.length > 0)
        });

    } catch (error) {
        console.error('Trends fetch error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch trending topics'
            },
            { status: 500 }
        );
    }
}
