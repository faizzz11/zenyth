import { GoogleGenAI } from '@google/genai';

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
    // Use Gemini with Google Search to get real trending topics
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Search the internet for the top 6-8 trending meme topics right now. Return ONLY a JSON array of topic strings, no additional text.

Example format: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"]

Focus on:
- Current viral trends
- Popular culture moments
- Relatable everyday situations
- Internet humor trends
- Social media trending topics

Return ONLY the JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('No response from Gemini');
    }

    let responseText = response.candidates[0].content.parts[0].text.trim();
    
    // Clean up markdown code blocks if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const topics: string[] = JSON.parse(responseText);
    
    // Ensure we have 3-10 topics
    if (!Array.isArray(topics) || topics.length < 3) {
      throw new Error('Invalid topics format');
    }
    
    const validTopics = topics.slice(0, 10);
    
    // Update cache
    cache = {
      topics: validTopics,
      timestamp: Date.now(),
    };
    
    return validTopics;
  } catch (error) {
    // If service is unavailable, return default topics
    console.warn('Failed to fetch trending topics from Gemini, using fallback:', error);
    
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
