import { Composio } from "@composio/core";

export const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  toolkitVersions: {
    INSTAGRAM: "20260217_00",
    YOUTUBE: "20260223_00",
    LINKEDIN: "20260223_00",
    TWITTER: "20260217_00",
  },
});

export const composioAuthConfig = {
  instagram: process.env.COMPOSIO_INSTAGRAM_AUTH_CONFIG_ID,
  youtube: process.env.COMPOSIO_YOUTUBE_AUTH_CONFIG_ID,
  linkedin: process.env.COMPOSIO_LINKEDIN_AUTH_CONFIG_ID,
  twitter: process.env.COMPOSIO_TWITTER_AUTH_CONFIG_ID,
};
