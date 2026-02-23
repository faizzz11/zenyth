// Cache for trending topics
interface CacheEntry {
  topics: string[];
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Default fallback topics
const DEFAULT_TOPICS = [
  "Monday motivation",
  "Weekend vibes",
  "Work from home",
  "Coffee addiction",
  "Procrastination",
  "Social media trends"
];

export async function getTrendingTopics(): Promise<string[]> {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.topics;
  }
  
  try {
    // Call external Trend Agent API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      // TODO: Replace with actual Trend Agent API endpoint
      const trendAgentUrl = process.env.TREND_AGENT_URL || 'https://api.trendagent.example.com/topics';
      
      const response = await fetch(trendAgentUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Trend Agent API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      let topics: string[] = data.topics || [];
      
      // Ensure we have 3-10 topics
      if (topics.length < 3) {
        // Supplement with default topics
        topics = [...topics, ...DEFAULT_TOPICS].slice(0, 6);
      } else if (topics.length > 10) {
        topics = topics.slice(0, 10);
      }
      
      // Update cache
      cache = {
        topics,
        timestamp: Date.now(),
      };
      
      return topics;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    // If service is unavailable, return default topics
    console.warn('Trend Agent service unavailable, using fallback topics:', error);
    
    // Cache the fallback topics as well
    cache = {
      topics: DEFAULT_TOPICS,
      timestamp: Date.now(),
    };
    
    return DEFAULT_TOPICS;
  }
}

// Function to manually refresh the cache
export function refreshTrendingTopics(): void {
  cache = null;
}
