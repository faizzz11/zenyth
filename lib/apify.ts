export const apifyConfig = {
  token: process.env.APIFY_API_TOKEN || '',
  baseUrl: 'https://api.apify.com/v2',
};

// YouTube Channel Scraper - streamers/youtube-channel-scraper
const YT_CHANNEL_ACTOR = 'streamers~youtube-channel-scraper';
// Instagram Profile Scraper - apify/instagram-profile-scraper
const IG_PROFILE_ACTOR = 'apify~instagram-profile-scraper';

interface ApifyRunResult<T = any> {
  items: T[];
}

async function runActorSync<T = any>(
  actorId: string,
  input: Record<string, unknown>,
  timeoutSecs = 120,
): Promise<T[]> {
  const token = apifyConfig.token;
  if (!token) throw new Error('APIFY_API_TOKEN is not set');

  const url = `${apifyConfig.baseUrl}/acts/${actorId}/run-sync-get-dataset-items?token=${token}&timeout=${timeoutSecs}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Apify actor ${actorId} failed (${res.status}): ${text.substring(0, 300)}`);
  }

  const items = (await res.json()) as T[];
  return items;
}

export interface YouTubeChannelData {
  channelName?: string;
  channelUrl?: string;
  numberOfSubscribers?: number;
  numberOfVideos?: number;
  channelDescription?: string;
  joinedDate?: string;
  channelTotalViews?: number;
  [key: string]: unknown;
}

export interface YouTubeVideoData {
  title?: string;
  url?: string;
  viewCount?: number;
  likes?: number;
  commentsCount?: number;
  date?: string;
  duration?: string;
  description?: string;
  thumbnailUrl?: string;
  [key: string]: unknown;
}

export async function scrapeYouTubeChannel(channelUrl: string): Promise<{
  channel: YouTubeChannelData | null;
  videos: YouTubeVideoData[];
}> {
  const items = await runActorSync(YT_CHANNEL_ACTOR, {
    startUrls: [{ url: channelUrl }],
    maxResults: 50,
    sortBy: 'date',
  }, 180);

  if (!items || items.length === 0) {
    return { channel: null, videos: [] };
  }

  // The first item usually contains channel info, rest are videos
  // Different actors structure data differently, so we handle both cases
  let channel: YouTubeChannelData | null = null;
  const videos: YouTubeVideoData[] = [];

  for (const item of items) {
    if (item.channelName || item.channelUrl || item.numberOfSubscribers) {
      if (!channel) channel = item as YouTubeChannelData;
    }
    if (item.title && (item.viewCount !== undefined || item.url)) {
      videos.push(item as YouTubeVideoData);
    }
  }

  // If no separate channel object, extract from first video
  if (!channel && videos.length > 0) {
    const first = items[0];
    channel = {
      channelName: first.channelName ?? first.channelTitle ?? first.channel,
      channelUrl: channelUrl,
      numberOfSubscribers: first.numberOfSubscribers ?? first.subscriberCount,
      numberOfVideos: first.numberOfVideos ?? items.length,
      channelDescription: first.channelDescription ?? first.description,
    };
  }

  return { channel, videos };
}

export interface InstagramProfileData {
  username?: string;
  fullName?: string;
  biography?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  isVerified?: boolean;
  profilePicUrl?: string;
  externalUrl?: string;
  [key: string]: unknown;
}

export interface InstagramPostData {
  url?: string;
  caption?: string;
  likesCount?: number;
  commentsCount?: number;
  timestamp?: string;
  type?: string;
  videoViewCount?: number;
  displayUrl?: string;
  hashtags?: string[];
  [key: string]: unknown;
}

export async function scrapeInstagramProfile(profileUrl: string): Promise<{
  profile: InstagramProfileData | null;
  posts: InstagramPostData[];
}> {
  // Extract username from URL
  let username = profileUrl;
  if (profileUrl.includes('instagram.com')) {
    const match = profileUrl.match(/instagram\.com\/([^/?#]+)/);
    if (match) username = match[1];
  }

  const items = await runActorSync(IG_PROFILE_ACTOR, {
    usernames: [username],
    resultsLimit: 50,
  }, 180);

  if (!items || items.length === 0) {
    return { profile: null, posts: [] };
  }

  let profile: InstagramProfileData | null = null;
  const posts: InstagramPostData[] = [];

  for (const item of items) {
    // Profile data
    if (item.username || item.followersCount || item.biography) {
      if (!profile) {
        profile = {
          username: item.username,
          fullName: item.fullName,
          biography: item.biography,
          followersCount: item.followersCount,
          followsCount: item.followsCount,
          postsCount: item.postsCount,
          isVerified: item.isVerified ?? item.verified,
          profilePicUrl: item.profilePicUrl ?? item.profilePicUrlHD,
          externalUrl: item.externalUrl,
        };
      }
    }
    // Post data
    if (item.caption !== undefined || item.likesCount !== undefined || item.displayUrl) {
      posts.push(item as InstagramPostData);
    }
  }

  return { profile, posts };
}
