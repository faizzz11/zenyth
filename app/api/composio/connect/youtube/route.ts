import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { composio, composioAuthConfig } from "@/lib/composio";

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!composioAuthConfig.youtube) {
    return new NextResponse("YouTube not configured", { status: 500 });
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const callbackUrl = `${baseUrl}/api/composio/callback`;

  const connectionRequest = await composio.connectedAccounts.link(
    userId,
    composioAuthConfig.youtube,
    {
      callbackUrl,
    }
  );

  return NextResponse.redirect(connectionRequest.redirectUrl);
}
