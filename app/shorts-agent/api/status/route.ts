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
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    console.log("Checking status for job:", jobId);

    // Call backend API to check status
    const response = await fetch(`${BACKEND_URL}/status/${jobId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend status error:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }

      return NextResponse.json(
        { 
          status: "failed",
          error: errorData.detail || "Failed to get status" 
        },
        { status: 200 } // Return 200 so frontend doesn't throw
      );
    }

    const statusData = await response.json();
    console.log("Backend status data:", statusData);

    // Normalize the response format
    // Backend might return just a string or an object
    let normalizedStatus;
    if (typeof statusData === "string") {
      // If it's just a string, parse it as status
      normalizedStatus = {
        status: statusData.toLowerCase().includes("complete") ? "completed" :
                statusData.toLowerCase().includes("process") ? "processing" :
                statusData.toLowerCase().includes("fail") ? "failed" : "pending",
        video_url: undefined,
        error: undefined,
      };
    } else {
      // Backend returns 'file' field with relative path, convert to full URL
      let videoUrl = statusData.video_url || statusData.videoUrl || statusData.url;
      
      // If backend returns 'file' field, construct full URL
      if (!videoUrl && statusData.file) {
        // Remove leading slash if present
        const filePath = statusData.file.startsWith('/') ? statusData.file.substring(1) : statusData.file;
        videoUrl = `${BACKEND_URL}/${filePath}`;
      }

      normalizedStatus = {
        status: statusData.status || "pending",
        video_url: videoUrl,
        error: statusData.error,
      };
    }

    console.log("Normalized status:", normalizedStatus);

    return NextResponse.json(normalizedStatus);
  } catch (error: unknown) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { 
        status: "failed",
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 200 } // Return 200 so frontend doesn't throw
    );
  }
}
