import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const BACKEND_URL = process.env.SHORTS_BACKEND_URL || "http://35.202.131.13:8000";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Video path is required" }, { status: 400 });
    }

    // Remove leading slash if present
    const filePath = path.startsWith('/') ? path.substring(1) : path;
    const videoUrl = `${BACKEND_URL}/${filePath}`;

    console.log("Proxying video from:", videoUrl);

    // Fetch the video from backend
    const response = await fetch(videoUrl);

    if (!response.ok) {
      console.error("Failed to fetch video:", response.status);
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Get the video data
    const videoBuffer = await response.arrayBuffer();

    // Return the video with proper headers
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "video/mp4",
        "Content-Length": response.headers.get("Content-Length") || String(videoBuffer.byteLength),
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error: unknown) {
    console.error("Video proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
