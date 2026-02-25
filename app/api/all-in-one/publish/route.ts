import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { composio, composioAuthConfig } from "@/lib/composio";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

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
        if (!text && !mediaBuffer) { results.twitter = { success: false, error: "No tweet text or media" }; continue; }

        let tweetMediaId: string | null = null;

        if (mediaBuffer && process.env.COMPOSIO_API_KEY) {
          // Step 1: Request presigned upload URL from Composio
          const hash = crypto.createHash("md5").update(mediaBuffer).digest("hex");
          const uploadReq = await fetch("https://backend.composio.dev/api/v3/files/upload/request", {
            method: "POST",
            headers: {
              "x-api-key": process.env.COMPOSIO_API_KEY,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              md5: hash,
              mimetype: mediaMime || "application/octet-stream",
              filename: mediaName || "media",
              toolkit_slug: "TWITTER",
              tool_slug: "TWITTER_UPLOAD_LARGE_MEDIA",
            }),
          });

          if (!uploadReq.ok) {
            console.error("Twitter: Failed to request upload URL", uploadReq.status);
          } else {
            const uploadJson = (await uploadReq.json()) as { key?: string; new_presigned_url?: string };

            if (!uploadJson.key || !uploadJson.new_presigned_url) {
              console.error("Twitter: Invalid upload response from Composio");
            } else {
              // Step 2: PUT the file to the presigned URL
              const uploadPut = await fetch(uploadJson.new_presigned_url, {
                method: "PUT",
                headers: { "content-type": mediaMime || "application/octet-stream" },
                body: new Uint8Array(mediaBuffer),
              });

              if (!uploadPut.ok) {
                console.error("Twitter: Failed to upload media file to presigned URL");
              } else {
                // Step 3: Determine media category
                let mediaCategory: string;
                if (mediaMime === "image/gif") {
                  mediaCategory = "tweet_gif";
                } else if (mediaType === "image") {
                  mediaCategory = "tweet_image";
                } else {
                  mediaCategory = "tweet_video";
                }

                // Step 4: Execute TWITTER_UPLOAD_LARGE_MEDIA with the s3key
                const mediaRes = await composio.tools.execute("TWITTER_UPLOAD_LARGE_MEDIA", {
                  userId,
                  arguments: {
                    media: {
                      name: mediaName || "media",
                      mimetype: mediaMime || "application/octet-stream",
                      s3key: uploadJson.key,
                    },
                    media_category: mediaCategory,
                  },
                });

                // Step 5: Extract media_id from response
                const mediaRaw = mediaRes as any;
                const mediaRoot = mediaRaw?.data ?? mediaRaw?.output ?? mediaRaw;
                const mediaData = mediaRoot?.data ?? mediaRoot;
                const mediaId =
                  mediaData?.media_id_string ??
                  mediaData?.media_id ??
                  mediaData?.id ??
                  mediaData?.data?.media_id_string ??
                  mediaData?.data?.media_id;

                if (mediaId) {
                  tweetMediaId = String(mediaId);
                } else {
                  console.error("Twitter: Failed to resolve media_id", JSON.stringify(mediaRaw));
                }
              }
            }
          }
        }

        // Step 6: Create the tweet with or without media
        const tweetArgs: Record<string, unknown> = {};
        if (tweetMediaId) {
          tweetArgs.media_media_ids = [tweetMediaId];
        }
        if (text) {
          tweetArgs.text = text;
        }

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

        // Upload to Cloudinary (Instagram requires publicly accessible URLs)
        const isVideo = mediaType === "video";
        let cloudinaryUrl: string;
        try {
          const uploadResult = await uploadBufferToCloudinary(mediaBuffer, {
            folder: "all-in-one-posts",
            userId,
            resourceType: isVideo ? "video" : "image",
          });
          cloudinaryUrl = uploadResult.url;
        } catch (error) {
          results.instagram = { success: false, error: "Failed to upload media to Cloudinary" };
          continue;
        }

        const containerArgs: Record<string, unknown> = {
          ig_user_id: igId,
          caption: fullCaption || undefined,
          content_type: isVideo ? "reel" : "photo",
        };
        if (isVideo) {
          containerArgs.video_url = cloudinaryUrl;
        } else {
          containerArgs.image_url = cloudinaryUrl;
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
