import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { composio, composioAuthConfig } from "@/lib/composio";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!composioAuthConfig.twitter) {
    return NextResponse.redirect(new URL("/settings", request.url));
  }

  const connections = await composio.connectedAccounts.list({
    userIds: [userId],
    authConfigIds: [composioAuthConfig.twitter],
    statuses: ["ACTIVE"],
  });

  const account = connections.items[0];

  if (account) {
    await composio.connectedAccounts.delete(account.id);
  }

  return NextResponse.redirect(new URL("/settings", request.url));
}
