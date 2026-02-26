import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.SHORTS_BACKEND_URL || "http://35.202.131.13:8000";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: "Backend is not responding" },
        { status: 503 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      status: "ok",
      backend: data,
      backendUrl: BACKEND_URL,
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Failed to connect to backend",
        backendUrl: BACKEND_URL,
      },
      { status: 503 }
    );
  }
}
