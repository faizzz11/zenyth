export type Platform = 'youtube' | 'instagram';

export interface AnalysisRequest {
  url: string;
  platform: Platform;
}

export interface ContentPerformance {
  topVideosByViews: { title: string; views: number; likes: number; comments: number; url: string; date: string }[];
  avgEngagementRate: number;
  bestContentType: string;
  durationInsight: string;
  totalVideosAnalyzed: number;
}

export interface PostingPattern {
  mostActiveDay: string;
  uploadFrequency: string;
  avgPostsPerWeek: number;
  bestTimeToPost: string;
  consistencyScore: string;
}

export interface AudienceInsight {
  contentStyle: string;
  targetAudience: string;
  topicClusters: string[];
  titlePatterns: string[];
  thumbnailStyle: string;
}

export interface ContentGap {
  underservedTopics: string[];
  overusedThemes: string[];
  trendingOpportunities: string[];
}

export interface CompetitorAnalysis {
  id: string;
  userId: string;
  platform: Platform;
  url: string;
  channelName: string;
  profilePic?: string;
  subscribers?: number;
  followers?: number;
  totalViews?: number;
  totalPosts?: number;
  contentPerformance: ContentPerformance;
  postingPattern: PostingPattern;
  audienceInsight: AudienceInsight;
  contentGap: ContentGap;
  recommendations: string[];
  analyzedAt: string;
}

export interface AnalysisHistoryItem {
  id: string;
  platform: Platform;
  channelName: string;
  url: string;
  analyzedAt: string;
}
