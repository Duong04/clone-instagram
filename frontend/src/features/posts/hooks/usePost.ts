import { useState } from "react";
import { mediaApi } from "../api/mediaApi";
import { postApi } from "../api/postApi";
import { createPostSchema } from "../schemas/postSchema";

export function usePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const createPost = async (data: {
    images: string[];
    caption: string;
    location: string;
    hashtags: string;
    musicId?: string;
  }) => {
    setIsLoading(true);
    setServerError("");

    try {
      const parsed = createPostSchema.safeParse(data);
      if (!parsed.success) {
        setServerError(parsed.error.issues[0].message);
        return false;
      }

      const files = parsed.data.images.map((base64, i) => {
        const blob = base64ToBlob(base64);
        return new File([blob], `image-${i}.jpg`, { type: "image/jpeg" });
      });

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const uploadRes = await mediaApi.uploadMultiple(formData);
      const mediaIds = uploadRes.data.map((m: { id: string }) => m.id);

      await postApi.create({
        caption: parsed.data.caption,
        location: parsed.data.location,
        hashtags: parsed.data.hashtags
          ?.split("#")
          .filter(Boolean)
          .map((h) => h.trim()),
        music_id: parsed.data.musicId,
        media_ids: mediaIds,
      });

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to create post");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading, serverError };
}

// helper convert base64 → Blob
function base64ToBlob(base64: string) {
  const [meta, data] = base64.split(",");
  const mime = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}
