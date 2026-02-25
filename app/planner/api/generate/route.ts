import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { connectToDatabase } from '@/lib/mongodb';
import type { PlannerFormData, ContentPlan } from '../../types';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * Fetch trending news and topics using SerpAPI
 */
async function fetchTrendingNews(niche: string): Promise<{ news: any[]; trends: any[] }> {
    const serpApiKey = process.env.SERPAPI_KEY;
    
    if (!serpApiKey) {
        console.warn('SERP_API_KEY not configured, using fallback data');
        return { news: [], trends: [] };
    }

    try {
        // Google News Search
        const newsUrl = `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(niche)}&api_key=${serpApiKey}`;
        const newsResponse = await fetch(newsUrl);
        const newsData = await newsResponse.json();

        // Google Trends
        const trendsUrl = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(niche)}&data_type=TIMESERIES&api_key=${serpApiKey}`;
        const trendsResponse = await fetch(trendsUrl);
        const trendsData = await trendsResponse.json();

        return {
            news: newsData.news_results || [],
            trends: trendsData.interest_over_time?.timeline_data || []
        };
    } catch (error) {
        console.error('SerpAPI fetch error:', error);
        return { news: [], trends: [] };
    }
}

/**
 * Generate 30-day content plan using Gemini AI
 */
async function generateContentPlan(
    formData: PlannerFormData,
    trendingData: { news: any[]; trends: any[] },
    userId: string
): Promise<ContentPlan> {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    // Calculate total posts
    const totalPosts = Math.ceil((formData.postingFrequency * 30) / 7);

    // Prepare context for AI
    const newsContext = trendingData.news?.slice(0, 10).map((item: any) => ({
        title: item.title,
        source: item.source,
        date: item.date
    })) || [];

    const prompt = `You are an expert content strategist. Create a detailed 30-day content calendar based on the following information:

**User Profile:**
- Niche: ${formData.niche}
- Platforms: ${formData.platforms.join(', ')}
- Content Types: ${formData.contentTypes.join(', ')}
- Posting Frequency: ${formData.postingFrequency} posts per week (${totalPosts} total posts)
- Target Audience: ${formData.targetAudience || 'General audience'}
- Goals: ${formData.goals.join(', ')}
- Tone: ${formData.tone}

**Current Trending News/Topics:**
${newsContext.length > 0 ? newsContext.map((n: any, i: number) => `${i + 1}. ${n.title} (${n.source})`).join('\n') : 'No trending data available'}

**Requirements:**
1. Create exactly ${totalPosts} content items spread across 30 days
2. Distribute content items across ALL platforms: ${formData.platforms.join(', ')}
3. Each content item should be for ONE specific platform only
4. Each content item should include:
   - Day number (1-30)
   - Title (engaging and SEO-friendly)
   - Description (2-3 sentences)
   - Content type (from user's selected types)
   - Platform (ONE platform from: ${formData.platforms.join(', ')})
   - Keywords (3-5 relevant keywords)
   - Whether it's trend-based (true/false)
   - Estimated engagement (low/medium/high)
   - Time to create (e.g., "2 hours", "30 minutes")
   - Call to action
   - Hashtags (5-10 relevant hashtags)
5. Create 4 week summaries with themes and focus areas
6. Identify 5-7 trend insights with relevance scores
7. Provide 5 strategic recommendations

**Important:**
- Mix trending topics with evergreen content
- Vary content types and platforms
- Consider optimal posting times
- Include seasonal/timely content
- Balance promotional and value-driven content
- Ensure each platform gets content throughout the month

CRITICAL: Return ONLY a valid JSON object with NO additional text, explanations, or markdown. The response must start with { and end with }.

JSON Structure:
{
  "weekSummaries": [
    {
      "week": 1,
      "theme": "Week 1 Theme",
      "focus": "Focus area description",
      "expectedReach": "Estimated reach"
    }
  ],
  "contentItems": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Content title",
      "description": "Content description",
      "contentType": "video",
      "platform": "youtube",
      "keywords": ["keyword1", "keyword2"],
      "trendBased": false,
      "trendSource": null,
      "estimatedEngagement": "medium",
      "timeToCreate": "2 hours",
      "callToAction": "CTA text",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "notes": null
    }
  ],
  "trendInsights": [
    {
      "topic": "Trending topic",
      "source": "Source name",
      "relevance": 85,
      "peakTime": "Time description",
      "suggestedDays": [1, 5, 10]
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const text = response.text || '';
        console.log('AI Response preview:', text.substring(0, 500));
        
        // Extract JSON from response - handle markdown code blocks
        let jsonText = text;
        
        // Remove markdown code blocks if present
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
            jsonText = codeBlockMatch[1].trim();
        } else {
            // Try to find JSON object
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonText = jsonMatch[0];
            }
        }
        
        if (!jsonText || (!jsonText.startsWith('{') && !jsonText.startsWith('['))) {
            console.error('Invalid JSON response:', text.substring(0, 1000));
            throw new Error('No valid JSON found in AI response');
        }

        const planData = JSON.parse(jsonText);

        // Validate required fields
        if (!planData.contentItems || !Array.isArray(planData.contentItems)) {
            console.error('Invalid plan data structure:', planData);
            throw new Error('AI response missing contentItems array');
        }

        if (!planData.weekSummaries || !Array.isArray(planData.weekSummaries)) {
            planData.weekSummaries = [];
        }

        if (!planData.trendInsights || !Array.isArray(planData.trendInsights)) {
            planData.trendInsights = [];
        }

        if (!planData.recommendations || !Array.isArray(planData.recommendations)) {
            planData.recommendations = [];
        }

        // Add dates to content items
        planData.contentItems = planData.contentItems.map((item: any) => {
            const itemDate = new Date(startDate);
            itemDate.setDate(itemDate.getDate() + (item.day || 1) - 1);
            return {
                ...item,
                date: itemDate.toISOString().split('T')[0],
                day: item.day || 1
            };
        });

        // Construct complete plan
        const plan: ContentPlan = {
            id: `plan_${Date.now()}`,
            userId,
            niche: formData.niche,
            platforms: formData.platforms,
            generatedAt: new Date().toISOString(),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            totalPosts,
            weekSummaries: planData.weekSummaries,
            contentItems: planData.contentItems,
            trendInsights: planData.trendInsights,
            recommendations: planData.recommendations
        };

        return plan;

    } catch (error) {
        console.error('AI plan generation error:', error instanceof Error ? error.message : error);
        console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2));
        throw new Error(`Failed to generate content plan with AI: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData: PlannerFormData = await req.json();

        // Validate input
        if (!formData.niche || formData.platforms.length === 0 || formData.contentTypes.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log('Fetching trending news for:', formData.niche);
        
        // Fetch trending data from SerpAPI
        const trendingData = await fetchTrendingNews(formData.niche);

        console.log('Generating content plan with AI...');

        // Generate plan with Gemini AI
        const plan = await generateContentPlan(formData, trendingData, userId);

        console.log('Saving plan to MongoDB...');

        // Save to MongoDB
        const db = await connectToDatabase();
        await db.collection('content_plans').insertOne({
            ...plan,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Content plan generated and saved successfully');

        return NextResponse.json({
            success: true,
            plan
        });

    } catch (error) {
        console.error('Plan generation error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to generate content plan'
            },
            { status: 500 }
        );
    }
}
