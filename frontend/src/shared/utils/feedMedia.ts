import type { FeedItem, MediaItem, PostMedia } from "~/shared/types/feed";

type LegacyReelMedia = MediaItem | null | undefined;

export const getFeedMedia = (item: FeedItem): PostMedia[] => {
  if (Array.isArray(item.media)) return item.media;

  const media = item.media as unknown as LegacyReelMedia;
  if (!media) return [];

  return [
    {
      id: `${item.id}-media`,
      post_id: item.id,
      media_id: media.id,
      position: 0,
      media,
    },
  ];
};
