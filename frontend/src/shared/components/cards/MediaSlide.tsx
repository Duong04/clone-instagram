
interface MediaProps {
    media_type: string;
    url: string;
}

export const MediaSlide = ({ media_type, url }: MediaProps) => {
  const isVideo = media_type.startsWith("video");

  return isVideo ? (
    <video
      src={url}
      className="w-full h-full object-cover"
      controls
    />
  ) : (
    <img
      src={url}
      alt="post-content"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
  );
};