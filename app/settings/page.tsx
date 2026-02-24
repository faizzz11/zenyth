import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { composio, composioAuthConfig } from "@/lib/composio";

export default async function SettingsPage() {
  const { userId } = await auth();

  let instagramAccount: { id: string } | null = null;
  let youtubeAccount: { id: string } | null = null;
  let twitterAccount: { id: string } | null = null;
  let linkedinAccount: { id: string } | null = null;

  if (userId) {
    if (composioAuthConfig.instagram) {
      const connections = await composio.connectedAccounts.list({
        userIds: [userId],
        authConfigIds: [composioAuthConfig.instagram],
        statuses: ["ACTIVE"],
      });
      instagramAccount = connections.items[0] ?? null;
    }

    if (composioAuthConfig.youtube) {
      const ytConnections = await composio.connectedAccounts.list({
        userIds: [userId],
        authConfigIds: [composioAuthConfig.youtube],
        statuses: ["ACTIVE"],
      });
      youtubeAccount = ytConnections.items[0] ?? null;
    }

    if (composioAuthConfig.twitter) {
      const twConnections = await composio.connectedAccounts.list({
        userIds: [userId],
        authConfigIds: [composioAuthConfig.twitter],
        statuses: ["ACTIVE"],
      });
      twitterAccount = twConnections.items[0] ?? null;
    }

    if (composioAuthConfig.linkedin) {
      const liConnections = await composio.connectedAccounts.list({
        userIds: [userId],
        authConfigIds: [composioAuthConfig.linkedin],
        statuses: ["ACTIVE"],
      });
      linkedinAccount = liConnections.items[0] ?? null;
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Connect your social media accounts to enable posting from agents
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-input bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Instagram</h3>
                  {instagramAccount ? (
                    <p className="text-sm text-muted-foreground">Connected</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  )}
                </div>
              </div>
              {instagramAccount ? (
                <form action="/api/composio/disconnect/instagram" method="post">
                  <button
                    type="submit"
                    className="rounded-full border border-destructive px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Disconnect
                  </button>
                </form>
              ) : (
                <Link
                  href="/api/composio/connect/instagram"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Connect
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-input bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">YouTube</h3>
                  {youtubeAccount ? (
                    <p className="text-sm text-muted-foreground">Connected</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  )}
                </div>
              </div>
              {youtubeAccount ? (
                <form action="/api/composio/disconnect/youtube" method="post">
                  <button
                    type="submit"
                    className="rounded-full border border-destructive px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Disconnect
                  </button>
                </form>
              ) : (
                <Link
                  href="/api/composio/connect/youtube"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Connect
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-input bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">X (Twitter)</h3>
                  {twitterAccount ? (
                    <p className="text-sm text-muted-foreground">Connected</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  )}
                </div>
              </div>
              {twitterAccount ? (
                <form action="/api/composio/disconnect/x" method="post">
                  <button
                    type="submit"
                    className="rounded-full border border-destructive px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Disconnect
                  </button>
                </form>
              ) : (
                <Link
                  href="/api/composio/connect/x"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Connect
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-input bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">LinkedIn</h3>
                  {linkedinAccount ? (
                    <p className="text-sm text-muted-foreground">Connected</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  )}
                </div>
              </div>
              {linkedinAccount ? (
                <form action="/api/composio/disconnect/linkedin" method="post">
                  <button
                    type="submit"
                    className="rounded-full border border-destructive px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Disconnect
                  </button>
                </form>
              ) : (
                <Link
                  href="/api/composio/connect/linkedin"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Connect
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
