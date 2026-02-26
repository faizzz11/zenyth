import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const BACKEND_URL = process.env.SHORTS_BACKEND_URL || "http://35.202.131.13:8000";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    console.log("Generating short for URL:", url);

    // Call backend API to generate short
    const response = await fetch(`${BACKEND_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    console.log("Backend generate response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend generate error:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }

      return NextResponse.json(
        { error: errorData.detail || "Failed to generate short" },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log("Backend generate response:", responseData);

    // Backend returns just the job_id as a string
    const jobId = typeof responseData === "string" ? responseData : responseData.job_id || responseData.jobId;

    if (!jobId) {
      console.error("No job ID in response:", responseData);
      return NextResponse.json(
        { error: "No job ID returned from backend" },
        { status: 500 }
      );
    }

    return NextResponse.json({ jobId, url });
  } catch (error: unknown) {
    console.error("Generate short error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
