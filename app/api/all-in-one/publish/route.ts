import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { composio, composioAuthConfig } from "@/lib/composio";

function decodeJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = parts[1];
  const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const json = Buffer.from(base64, "base64").toString("utf8");
  try { return JSON.parse(json); } catch { return null; }
}

function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function detectMediaType(name: string, mime: string): "image" | "video" | "none" {
  const m = mime.toLowerCase();
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg","jpeg","png","webp","gif","avif","bmp","svg"].includes(ext)) return "image";
  if (["mp4","mov","avi","mkv","webm","m4v","quicktime"].includes(ext)) return "video";
  return "none";
}

async function uploadToComposio(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  toolkit: string,
  tool: string
): Promise<{ key: string } | null> {
  if (!process.env.COMPOSIO_API_KEY) return null;
  const hash = crypto.createHash("md5").update(buffer).digest("hex");
  const res = await fetch("https://backend.composio.dev/api/v3/files/upload/request", {
    method: "POST",
    headers: { "x-api-key": process.env.COMPOSIO_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ md5: hash, mimetype: mimeType, filename: fileName, toolkit_slug: toolkit, tool_slug: tool }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { key?: string; new_presigned_url?: string };
  if (!json.key || !json.new_presigned_url) return null;
  const put = await fetch(json.new_presigned_url, {
    method: "PUT",
    headers: { "content-type": mimeType },
    body: new Uint8Array(buffer),
  });
  if (!put.ok) return null;
  return { key: json.key };
}

async function resolveLinkedInPersonId(userId: string): Promise<string | null> {
  // Method 1: Try getting profile info directly
  try {
    const profileResult = await composio.tools.execute("LINKEDIN_GET_MY_INFO", {
      userId,
      arguments: {},
    });
    const raw = profileResult as Record<string, unknown>;
    const data = (raw?.data ?? raw?.output) as Record<string, unknown> | undefined;
    const d = (data?.data ?? data) as Record<string, unknown>;
    if (d && typeof d === "object") {
      const sub = (d.sub ?? d.id ?? d.member_urn) as string | undefined;
      if (typeof sub === "string" && sub) {
        return sub.includes(":") ? sub.split(":").pop() ?? null : sub;
      }
    }
  } catch {}

  // Method 2: Decode from id_token in connected account
  try {
    const accounts = await composio.connectedAccounts.list({
      userIds: [userId],
      authConfigIds: composioAuthConfig.linkedin ? [composioAuthConfig.linkedin] : undefined,
      statuses: ["ACTIVE"],
    });
    for (const account of accounts.items) {
      const acct = account as any;
      const idToken = acct?.data?.id_token ?? acct?.state?.val?.id_token;
      if (typeof idToken === "string" && idToken) {
        const payload = decodeJwt(idToken);
        if (payload) {
          const raw = payload.sub ?? payload.id ?? payload.member_urn;
          if (typeof raw === "string" && raw) {
            return raw.includes(":") ? raw.split(":").pop() ?? null : raw;
          }
        }
      }
    }
  } catch {}

  return null;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { platforms } = body as {
    platforms: {
      name: string;
      content: Record<string, unknown>;
      mediaFile?: { base64: string; name: string; type: string };
    }[];
  };

  if (!platforms || platforms.length === 0) {
    return NextResponse.json({ error: "No platforms selected" }, { status: 400 });
  }

  // Detect media type from the first platform that has a file
  let mediaBuffer: Buffer | null = null;
  let mediaName = "";
  let mediaMime = "";
  let mediaType: "image" | "video" | "none" = "none";

  const firstWithMedia = platforms.find((p) => p.mediaFile?.base64);
  if (firstWithMedia?.mediaFile) {
    mediaBuffer = Buffer.from(firstWithMedia.mediaFile.base64, "base64");
    mediaName = firstWithMedia.mediaFile.name || "file";
    mediaMime = firstWithMedia.mediaFile.type || "application/octet-stream";
    mediaType = detectMediaType(mediaName, mediaMime);
  }

  const results: Record<string, { success: boolean; error?: string }> = {};

  for (const platform of platforms) {
    try {
      // ─── TWITTER ───
      if (platform.name === "twitter") {
        const text = String(platform.content.tweet ?? platform.content.text ?? "").trim();
        if (!text) { results.twitter = { success: false, error: "No tweet text" }; continue; }

        let tweetMediaId: string | null = null;

        if (mediaBuffer && platform.mediaFile?.base64) {
          // Upload media to Composio's file storage first, then call the Twitter upload tool
          const toolSlug = mediaType === "video" ? "TWITTER_UPLOAD_LARGE_MEDIA" : "TWITTER_UPLOAD_MEDIA";
          const upload = await uploadToComposio(mediaBuffer, mediaName, mediaMime, "TWITTER", toolSlug);

          if (upload) {
            try {
              const uploadArgs: Record<string, unknown> = {
                file: { name: mediaName, mimetype: mediaMime, s3key: upload.key },
                media_category: mediaType === "video" ? "tweet_video" : "tweet_image",
              };

              const uploadResult = await composio.tools.execute(toolSlug, {
                userId,
                arguments: uploadArgs,
              });

              console.log("Twitter media upload result:", JSON.stringify(uploadResult, null, 2));

              // Extract media_id from deeply nested response
              const extractMediaId = (obj: unknown): string | null => {
                if (!obj || typeof obj !== "object") return null;
                const o = obj as Record<string, unknown>;
                // Check direct fields
                if (o.media_id_string) return String(o.media_id_string);
                if (o.media_id && typeof o.media_id !== "object") return String(o.media_id);
                // Check nested data/output/response
                for (const key of ["data", "output", "response", "result", "media"]) {
                  if (o[key] && typeof o[key] === "object") {
                    const found = extractMediaId(o[key]);
                    if (found) return found;
                  }
                }
                return null;
              };

              tweetMediaId = extractMediaId(uploadResult);
              if (!tweetMediaId) {
                console.error("Could not extract media_id from Twitter upload response:", JSON.stringify(uploadResult));
              }
            } catch (mediaErr: any) {
              console.error("Twitter media upload tool error:", mediaErr?.message, mediaErr);
            }
          } else {
            console.error("Twitter: uploadToComposio returned null");
          }
        }

        const tweetArgs: Record<string, unknown> = { text };
        if (tweetMediaId) {
          tweetArgs.media_media_ids = [tweetMediaId];
        }

        console.log("Twitter post args:", JSON.stringify(tweetArgs));
        await composio.tools.execute("TWITTER_CREATION_OF_A_POST", { userId, arguments: tweetArgs });
        results.twitter = { success: true, ...(mediaBuffer && !tweetMediaId ? { error: "Posted text only — media upload failed" } : {}) };
      }

      // ─── INSTAGRAM ───
      if (platform.name === "instagram") {
        const caption = String(platform.content.feed_caption ?? platform.content.reel_caption ?? platform.content.caption ?? "");
        const hashtagsRaw = platform.content.hashtags;
        const hashtags = toStringArray(hashtagsRaw);
        const hashtagStr = hashtags.length > 0
          ? hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")
          : "";
        const fullCaption = hashtagStr ? `${caption}\n\n${hashtagStr}` : caption;

        if (!mediaBuffer) {
          results.instagram = { success: false, error: "Instagram requires media (image or video)" };
          continue;
        }

        // Get IG user ID
        const info = await composio.tools.execute("INSTAGRAM_GET_USER_INFO", { userId, arguments: { ig_user_id: "me" } });
        const infoRaw = info as any;
        const infoRoot = infoRaw?.data ?? infoRaw?.output ?? infoRaw;
        const infoData = infoRoot?.data ?? infoRoot;
        const igUserId = infoData?.id ?? infoData?.ig_user_id ?? infoData?.instagram_business_account?.id;
        if (!igUserId) { results.instagram = { success: false, error: "Failed to resolve Instagram user ID" }; continue; }
        const igId = String(igUserId).trim();

        // Upload to Composio
        const upload = await uploadToComposio(mediaBuffer, mediaName, mediaMime, "INSTAGRAM", "INSTAGRAM_CREATE_MEDIA_CONTAINER");
        if (!upload) { results.instagram = { success: false, error: "Failed to upload media" }; continue; }

        const isVideo = mediaType === "video";
        const containerArgs: Record<string, unknown> = {
          ig_user_id: igId,
          caption: fullCaption || undefined,
          content_type: isVideo ? "reel" : "photo",
        };
        if (isVideo) {
          containerArgs.video_url = `composio://file/${upload.key}`;
        } else {
          containerArgs.image_url = `composio://file/${upload.key}`;
        }

        const container = await composio.tools.execute("INSTAGRAM_CREATE_MEDIA_CONTAINER", { userId, arguments: containerArgs });
        const containerRaw = container as any;
        const containerData = containerRaw?.data ?? containerRaw?.output;
        const creationId = containerData?.id ?? containerData?.creation_id ?? containerData?.data?.id;
        if (!creationId) { results.instagram = { success: false, error: "Failed to create media container" }; continue; }

        await composio.tools.execute("INSTAGRAM_CREATE_POST", { userId, arguments: { ig_user_id: igId, creation_id: creationId } });
        results.instagram = { success: true };
      }

      // ─── LINKEDIN ───
      if (platform.name === "linkedin") {
        const commentary = String(platform.content.post ?? platform.content.short_version ?? platform.content.commentary ?? "").trim();
        if (!commentary) { results.linkedin = { success: false, error: "No post content" }; continue; }

        const personId = await resolveLinkedInPersonId(userId);
        if (!personId) { results.linkedin = { success: false, error: "Failed to resolve LinkedIn person ID. Try reconnecting LinkedIn in Settings." }; continue; }

        const postArgs: Record<string, unknown> = {
          author: `urn:li:person:${personId}`,
          commentary,
          visibility: "PUBLIC",
          lifecycleState: "PUBLISHED",
        };

        // Attach media if available
        if (mediaBuffer && mediaType === "image") {
          const upload = await uploadToComposio(mediaBuffer, mediaName, mediaMime, "LINKEDIN", "LINKEDIN_CREATE_LINKED_IN_POST");
          if (upload) {
            postArgs.images = [{ name: mediaName, mimetype: mediaMime, s3key: upload.key }];
          }
        }

        await composio.tools.execute("LINKEDIN_CREATE_LINKED_IN_POST", { userId, arguments: postArgs });
        results.linkedin = { success: true };
      }

      // ─── YOUTUBE ───
      if (platform.name === "youtube") {
        const title = String(platform.content.video_title ?? platform.content.title ?? platform.content.community_post ?? "").trim();
        const description = String(platform.content.description ?? title ?? "");
        const tags = toStringArray(platform.content.tags);

        if (!title) { results.youtube = { success: false, error: "No title/content provided" }; continue; }

        if (mediaType === "video" && mediaBuffer) {
          // VIDEO → Upload as YouTube video
          const upload = await uploadToComposio(mediaBuffer, mediaName, mediaMime, "YOUTUBE", "YOUTUBE_MULTIPART_UPLOAD_VIDEO");
          if (!upload) { results.youtube = { success: false, error: "Failed to upload video" }; continue; }

          await composio.tools.execute("YOUTUBE_MULTIPART_UPLOAD_VIDEO", {
            userId,
            arguments: {
              videoFile: { name: mediaName, mimetype: mediaMime, s3key: upload.key },
              title,
              description,
              privacyStatus: "public",
              categoryId: "22",
              tags,
            },
          });
          results.youtube = { success: true };
        } else if (mediaType === "image" && mediaBuffer) {
          // IMAGE → YouTube community posts with images aren't supported via API
          results.youtube = { success: false, error: "YouTube community posts with images are not supported via API. Upload a video instead." };
        } else {
          results.youtube = { success: false, error: "YouTube requires a video file" };
        }
      }
    } catch (error: any) {
      results[platform.name] = { success: false, error: error?.message || "Publishing failed" };
    }
  }

  return NextResponse.json({ results });
}
