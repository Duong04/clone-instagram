import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import { cn } from "~/shared/utils/cn";
import { motion, AnimatePresence } from "motion/react";
import type { FeedItem } from "~/shared/types/feed";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { MediaSlide } from "./MediaSlide";
import { formatRelativeTime } from "~/shared/utils/formatDate";
import { useLike } from "~/features/feed/hooks/useLike";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { useModal } from "~/shared/context/modal/modalContext";

interface FeedItemCardProps {
  item: FeedItem;
}

export const PostCard = ({ item }: FeedItemCardProps) => {
  const { openPostDetail } = useModal();
  const sortedMedia = [...item.media].sort((a, b) => a.position - b.position);
  const hasMultiple = sortedMedia.length > 1;
  const { handleLike } = useLike();
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showHeart, setShowHeart] = useState(false);
  const [heartColor, setHeartColor] = useState<"orange" | "pink">("orange");

  const showHeartAnimation = () => {
    setHeartColor(Math.random() > 0.5 ? "orange" : "pink");
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const onDoubleTap = () => {
    if (!item.is_liked) handleLike(item.feed_id, item.feed_type, item.is_liked);
    showHeartAnimation();
  };

  const oneClickTap = () => {
    if (!item.is_liked) showHeartAnimation();
    handleLike(item.feed_id, item.feed_type, item.is_liked);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white border-b border-zinc-200 md:border md:rounded-lg mb-4 max-w-full mx-auto overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-[2px] rounded-full instagram-gradient cursor-pointer"
          >
            <img
              src={item.user.avatar?.url}
              alt={item.user.name}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm hover:text-zinc-500 cursor-pointer transition-colors">
              {item.user.username}
            </span>
            {/* {item.user?.isVerified && (
              <svg aria-label="Verified" className="w-3 h-3 text-[#0095f6]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.688 8.858-6.17 6.17a1.144 1.144 0 0 1-1.618 0l-3.592-3.592a1.144 1.144 0 0 1 1.618-1.618l2.783 2.783 5.362-5.362a1.144 1.144 0 0 1 1.617 1.619Z"></path>
              </svg>
            )} */}
            <span className="text-zinc-500 text-sm">
              • {formatRelativeTime(item.created_at)}
            </span>
          </div>
        </div>
        <button className="hover:text-zinc-500 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image with Double Tap Like */}
      <div
        className="flex flex-col relative aspect-square bg-zinc-100 overflow-hidden cursor-pointer"
        onDoubleClick={onDoubleTap}
      >
        {hasMultiple ? (
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={true}
            navigation={true}
            className="w-full"
          >
            {sortedMedia.map((m) => (
              <SwiperSlide key={m.id}>
                <MediaSlide media_type={m.media.media_type} url={m.media.url} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          sortedMedia[0] && (
            <MediaSlide
              media_type={sortedMedia[0].media.media_type}
              url={sortedMedia[0].media.url}
            />
          )
        )}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: 0, y: 0 }}
              animate={{
                scale: [0, 1.5, 1.2, 1],
                rotate: [0, -20, 20, -20, 20, 0],
                y: [0, -60, -120],
                opacity: [0, 1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                times: [0, 0.2, 0.8, 1],
                ease: "easeOut",
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient
                    id={`heart-gradient-${item.id}`}
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        heartColor === "orange" ? "#ff8a00" : "#ff0080"
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        heartColor === "orange" ? "#ff0000" : "#ff66b2"
                      }
                    />
                  </linearGradient>
                </defs>
              </svg>
              <Heart
                className={cn(
                  "w-28 h-28",
                  heartColor === "orange"
                    ? "drop-shadow-[0_0_30px_rgba(255,69,0,0.6)]"
                    : "drop-shadow-[0_0_30px_rgba(255,0,128,0.6)]",
                )}
                style={{
                  fill: `url(#heart-gradient-${item.id})`,
                  stroke: "none",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={oneClickTap}
              className={cn(
                "hover:opacity-60 transition-opacity",
                item.is_liked && "text-red-500",
              )}
            >
              <Heart
                className={cn("w-7 h-7", item.is_liked && "fill-current")}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => openPostDetail(item)}
              className="hover:opacity-60 transition-opacity"
            >
              <MessageCircle className="w-7 h-7" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              className="hover:opacity-60 transition-opacity"
            >
              <Send className="w-7 h-7" />
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            className="hover:opacity-60 transition-opacity"
          >
            <Bookmark className="w-7 h-7" />
          </motion.button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2">
          {item.like_count.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{item.user.username}</span>
          <span>{item.caption}</span>
        </div>

        {/* Comments */}
        <button
          onClick={() => openPostDetail(item)}
          className="text-zinc-500 text-sm mb-2 hover:text-zinc-400 transition-colors"
        >
          View all {item.comment_count} comments
        </button>

        {/* Add Comment */}
        <div className="flex items-center gap-2 mt-2 relative">
          <div ref={emojiPickerRef}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="hover:opacity-60 transition-opacity"
            >
              <Smile className="w-6 h-6 text-zinc-500" />
            </button>
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 z-50"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    theme={Theme.LIGHT}
                    autoFocusSearch={false}
                    width={300}
                    height={400}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (comment.trim()) {
                  setComment("");
                  setShowEmojiPicker(false);
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                }
              }
            }}
            rows={1}
            className="text-sm w-full outline-none bg-transparent resize-none py-1 max-h-[100px] no-scrollbar"
          />
          <button
            disabled={!comment.trim()}
            className={cn(
              "font-semibold text-sm transition-colors pt-1",
              comment.trim()
                ? "text-[#0095f6] hover:text-[#00376b]"
                : "text-[#0095f6]/50 cursor-default",
            )}
            onClick={(e) => {
              if (comment.trim()) {
                setComment("");
                setShowEmojiPicker(false);
                // Find the textarea in the same container and reset its height
                const container = (e.target as HTMLElement).parentElement;
                const textarea = container?.querySelector("textarea");
                if (textarea) textarea.style.height = "auto";
              }
            }}
          >
            Post
          </button>
        </div>
      </div>
    </motion.div>
  );
};
