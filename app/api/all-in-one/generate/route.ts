import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt, platforms, mediaType } = await req.json();

  if (!prompt || !platforms || platforms.length === 0) {
    return NextResponse.json({ error: "Missing prompt or platforms" }, { status: 400 });
  }

  const isImage = mediaType === "image";
  const isVideo = mediaType === "video";
  const hasMedia = isImage || isVideo;

  const gemini = createGeminiClient();

  const platformInstructions = platforms
    .map((p: string) => {
      switch (p) {
        case "youtube":
          if (isVideo) {
            return `YouTube (VIDEO UPLOAD):
- video_title: A catchy, SEO-optimized title (max 100 chars)
- description: Detailed description with keywords (200-300 words)
- tags: Array of 8-12 relevant tags`;
          }
          return `YouTube (IMAGE - Community Post):
- community_post: An engaging community post caption for the image (200-400 chars)
- hashtags: Array of 5-8 relevant hashtags`;
        case "instagram":
          if (isVideo) {
            return `Instagram (REEL/VIDEO):
- feed_caption: Engaging reel caption (max 2200 chars, include call to action, emojis)
- hashtags: Array of 15-20 relevant hashtags (mix of popular and niche)`;
          }
          return `Instagram (FEED IMAGE POST):
- feed_caption: Engaging caption for feed post (max 2200 chars, include call to action, emojis)
- hashtags: Array of 15-20 relevant hashtags (mix of popular and niche)`;
        case "twitter":
          return `Twitter/X:
- tweet: A single engaging tweet (max 280 chars, punchy and shareable)${hasMedia ? " - media will be attached" : ""}
- thread: Array of 2-4 tweets for a thread version (each max 280 chars)`;
        case "linkedin":
          return `LinkedIn:
- post: Professional-style post (300-600 words, business tone, include insights)${hasMedia ? " - media will be attached" : ""}
- short_version: Condensed version (max 200 chars)`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");

  const systemPrompt = `You are a social media content expert. Given a base idea, generate platform-specific content that is optimized for each platform's unique format, tone, and audience.

IMPORTANT RULES:
- Each platform's content must be DIFFERENT and tailored to that platform's style
- Do NOT generate the same text for every platform
- YouTube content should be SEO-focused and descriptive
- Instagram content should be visual-first, trendy, with emojis
- Twitter content should be concise, witty, and shareable
- LinkedIn content should be professional, insightful, and business-oriented

Generate content for these platforms in valid JSON format:

${platformInstructions}

CRITICAL: Return ONLY valid JSON. Use EXACTLY these lowercase keys for platforms: ${platforms.map((p: string) => `"${p}"`).join(", ")}. No markdown, no code blocks, just raw JSON.`;

  try {
    const result = await gemini.generateWithRetry(
      `${systemPrompt}\n\nBase idea: ${prompt}`,
      2,
      30000
    );

    let cleaned = result.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const content = JSON.parse(cleaned);
    
    // Normalize keys to lowercase to match platform names
    const normalized: Record<string, unknown> = {};
    const keyMap: Record<string, string> = {
      youtube: "youtube", yt: "youtube",
      instagram: "instagram", ig: "instagram",
      twitter: "twitter", "twitter/x": "twitter", x: "twitter",
      linkedin: "linkedin",
    };
    for (const [key, value] of Object.entries(content)) {
      const lower = key.toLowerCase().replace(/[^a-z/]/g, "");
      const mapped = keyMap[lower] || lower;
      normalized[mapped] = value;
    }
    
    return NextResponse.json({ success: true, content: normalized });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
