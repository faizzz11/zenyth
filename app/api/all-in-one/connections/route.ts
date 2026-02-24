import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { composio, composioAuthConfig } from "@/lib/composio";

const platformConfigs = [
  { name: "instagram", label: "Instagram", configKey: "instagram" as const },
  { name: "youtube", label: "YouTube", configKey: "youtube" as const },
  { name: "twitter", label: "X (Twitter)", configKey: "twitter" as const },
  { name: "linkedin", label: "LinkedIn", configKey: "linkedin" as const },
];

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connections: {
    name: string;
    label: string;
    connected: boolean;
  }[] = [];

  for (const platform of platformConfigs) {
    const authConfigId = composioAuthConfig[platform.configKey];
    if (!authConfigId) {
      connections.push({ ...platform, connected: false });
      continue;
    }

    try {
      const result = await composio.connectedAccounts.list({
        userIds: [userId],
        authConfigIds: [authConfigId],
        statuses: ["ACTIVE"],
      });
      connections.push({
        name: platform.name,
        label: platform.label,
        connected: result.items.length > 0,
      });
    } catch {
      connections.push({
        name: platform.name,
        label: platform.label,
        connected: false,
      });
    }
  }

  return NextResponse.json({ connections });
}
