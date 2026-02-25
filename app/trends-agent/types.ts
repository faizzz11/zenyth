export interface TrendingTopic {
    id: string;
    title: string;
    description: string;
    platform: 'youtube' | 'instagram' | 'twitter' | 'linkedin' | 'general';
    category: string;
    searchVolume?: number;
    trendScore: number;
    relatedKeywords: string[];
    source: string;
    timestamp: string;
    link?: string;
}

export interface PlatformTrends {
    platform: string;
    trends: TrendingTopic[];
    lastUpdated: string;
}

export interface TrendsResponse {
    success: boolean;
    trends: PlatformTrends[];
    error?: string;
}
