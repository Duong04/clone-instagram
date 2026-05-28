export const getMediaType = (item: string): "image" | "video" =>
  item.startsWith("video::") ? "video" : "image";

export const getMediaUrl = (item: string): string =>
  item.startsWith("video::") ? item.slice(7) : item.startsWith("image::") ? item.slice(7) : item;
