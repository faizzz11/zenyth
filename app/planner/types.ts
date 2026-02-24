import { ObjectId } from 'mongodb';

export interface PlannerFormData {
    niche: string;
    platforms: string[];
    contentTypes: string[];
    postingFrequency: number;
    targetAudience: string;
    goals: string[];
    tone: string;
}

export interface ContentItem {
    day: number;
    date: string;
    title: string;
    description: string;
    contentType: string;
    platform: string;
    keywords: string[];
    trendBased: boolean;
    trendSource?: string;
    estimatedEngagement: 'low' | 'medium' | 'high';
    timeToCreate: string;
    callToAction: string;
    hashtags: string[];
    notes?: string;
}

export interface WeekSummary {
    week: number;
    theme: string;
    focus: string;
    expectedReach: string;
}

export interface ContentPlan {
    _id?: ObjectId;
    id: string;
    userId: string;
    niche: string;
    platforms: string[];
    generatedAt: string;
    startDate: string;
    endDate: string;
    totalPosts: number;
    weekSummaries: WeekSummary[];
    contentItems: ContentItem[];
    trendInsights: TrendInsight[];
    recommendations: string[];
}

export interface TrendInsight {
    topic: string;
    source: string;
    relevance: number;
    peakTime: string;
    suggestedDays: number[];
}

export interface ExportFormat {
    type: 'csv' | 'json' | 'pdf' | 'calendar';
    label: string;
    icon: string;
}
