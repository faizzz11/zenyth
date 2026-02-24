import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "";
  const connectedAccountId =
    url.searchParams.get("connected_account_id") ??
    url.searchParams.get("connectedAccountId") ??
    "";

  const redirectUrl = new URL("/settings", req.url);
  if (status) {
    redirectUrl.searchParams.set("status", status);
  }
  if (connectedAccountId) {
    redirectUrl.searchParams.set("connectedAccountId", connectedAccountId);
  }

  return NextResponse.redirect(redirectUrl);
}
