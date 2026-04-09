import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import { MOCK_USER } from "~/mockData";
import { cn } from "~/shared/utils/cn";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import { formatRelativeTime } from "~/shared/utils/formatDate";
import { MediaSlide } from "~/shared/components/cards/MediaSlide";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useLike } from "~/features/feed/hooks/useLike";
import { useFeedStore } from "~/features/feed/store/feedStore";
import { useComment } from "~/features/feed/hooks/useComment";

interface PostDetailModalProps {
  feedId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PostDetailModal = ({
  feedId,
  isOpen,
  onClose,
}: PostDetailModalProps) => {
  const item = useFeedStore((state) =>
    state.feed.find((i) => i.feed_id === feedId),
  );
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showHeart, setShowHeart] = useState(false);
  const { handleLike } = useLike();
  const [expandedReplies, setExpandedReplies] = useState<number[]>([]);
  const [heartColor, setHeartColor] = useState<"orange" | "pink">("orange");
  const { createComment, loadComments, loadReplies } = useComment(
    item!.feed_id,
    item!.feed_type,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log(loadComments);
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const showHeartAnimation = () => {
    setHeartColor(Math.random() > 0.5 ? "orange" : "pink");
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  if (!item) return null;
  const sortedMedia = [...(item?.media ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const hasMultiple = sortedMedia.length > 1;
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

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    setComment("");
    setShowEmojiPicker(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    createComment(comment);
  };

  const mockComments = [
    {
      id: 1,
      user: {
        username: "traveler_99",
        avatar: "https://picsum.photos/seed/u1/50/50",
      },
      text: "Wow, this looks amazing! 😍",
      timestamp: "2h",
      likes: 12,
      replies: [
        {
          id: 101,
          user: {
            username: "nature_lover",
            avatar: "https://picsum.photos/seed/u2/50/50",
          },
          text: "Totally agree! Best spot ever.",
          timestamp: "1h",
        },
        {
          id: 102,
          user: { username: "johndoe", avatar: MOCK_USER.avatar },
          text: "Thanks! It was a great trip.",
          timestamp: "30m",
        },
      ],
    },
    {
      id: 2,
      user: {
        username: "photo_pro",
        avatar: "https://picsum.photos/seed/u3/50/50",
      },
      text: "Great composition and lighting! What camera did you use?",
      timestamp: "4h",
      likes: 5,
      replies: [
        {
          id: 201,
          user: { username: "johndoe", avatar: MOCK_USER.avatar },
          text: "Shot this on a Sony A7III with a 35mm lens.",
          timestamp: "3h",
        },
      ],
    },
    {
      id: 3,
      user: {
        username: "adventure_seeker",
        avatar: "https://picsum.photos/seed/u4/50/50",
      },
      text: "Where exactly is this? Need to add it to my bucket list!",
      timestamp: "6h",
      likes: 2,
      replies: [],
    },
    {
      id: 4,
      user: {
        username: "foodie_vibe",
        avatar: "https://picsum.photos/seed/u5/50/50",
      },
      text: "Did you find any good places to eat nearby?",
      timestamp: "8h",
      likes: 0,
      replies: [],
    },
    {
      id: 5,
      user: {
        username: "sunset_hunter",
        avatar: "https://picsum.photos/seed/u6/50/50",
      },
      text: "The colors are just breathtaking. 🌅",
      timestamp: "12h",
      likes: 24,
      replies: [],
    },
    {
      id: 6,
      user: {
        username: "wanderlust_soul",
        avatar: "https://picsum.photos/seed/u7/50/50",
      },
      text: "I was there last year, such a magical place.",
      timestamp: "1d",
      likes: 8,
      replies: [],
    },
  ];

  const toggleReplies = (id: number) => {
    setExpandedReplies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-zinc-300 z-[110]"
          >
            <X className="w-8 h-8" />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", damping: 25, stiffness: 300 },
            }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            className="relative w-full max-w-[1200px] h-[90vh] md:h-full max-h-[900px] bg-white rounded-t-2xl md:rounded-r-lg overflow-hidden flex flex-col md:flex-row shadow-2xl mt-auto md:mt-0"
          >
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-9 h-1 bg-zinc-300 rounded-full" />
            </div>

            {/* Left: Image (Hidden on mobile comments view) */}
            <div
              onDoubleClick={onDoubleTap}
              className="relative hidden lg:flex flex-1 bg-black items-center justify-center overflow-hidden h-full"
            >
              {hasMultiple ? (
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={true}
                  navigation={true}
                  className="w-full h-full"
                >
                  {sortedMedia.map((m) => (
                    <SwiperSlide key={m.id}>
                      <MediaSlide
                        media_type={m.media.media_type}
                        url={m.media.url}
                      />
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

            {/* Right: Comments Section */}
            <div className="w-full lg:w-[450px] flex flex-col bg-white h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 shrink-0">
                <div className="hidden md:flex items-center gap-3">
                  <img
                    src={item.user.avatar?.url}
                    alt={item.user.username}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">
                      {item.user.username}
                    </span>
                    {/* {item.user.isVerified && (
                      <svg
                        aria-label="Verified"
                        className="w-3 h-3 text-[#0095f6]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.688 8.858-6.17 6.17a1.144 1.144 0 0 1-1.618 0l-3.592-3.592a1.144 1.144 0 0 1 1.618-1.618l2.783 2.783 5.362-5.362a1.144 1.144 0 0 1 1.617 1.619Z"></path>
                      </svg>
                    )} */}
                  </div>
                </div>

                {/* Mobile Header Title */}
                <div className="md:hidden flex-1 text-center">
                  <span className="font-bold text-base">Comments</span>
                </div>

                <div className="flex items-center gap-4">
                  <button className="md:hidden hover:opacity-60 transition-opacity">
                    <Send className="w-6 h-6" />
                  </button>
                  <button className="hidden md:block hover:text-zinc-500 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                {/* Caption as first comment (Desktop only) */}
                <div className="hidden md:flex gap-3">
                  <img
                    src={item.user.avatar?.url}
                    alt={item.user.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-sm">
                    <span className="font-semibold mr-2">
                      {item.user.username}
                    </span>
                    <span className="text-zinc-800">{item.caption}</span>
                    <p className="text-zinc-400 text-xs mt-2 uppercase tracking-tight">
                      {formatRelativeTime(item.created_at)}
                    </p>
                  </div>
                </div>

                {/* Actual Comments */}
                {mockComments.map((c) => (
                  <div key={c.id} className="space-y-4">
                    <div className="flex gap-3">
                      <img
                        src={c.user.avatar}
                        alt={c.user.username}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-semibold mr-2">
                              {c.user.username}
                            </span>
                            <span className="text-zinc-800">{c.text}</span>
                          </div>
                          <button className="flex-shrink-0">
                            <Heart className="w-3 h-3 text-zinc-400" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-zinc-400 text-xs uppercase tracking-tight">
                            {c.timestamp}
                          </p>
                          {c.likes > 0 && (
                            <button className="text-zinc-500 text-xs font-semibold">
                              {c.likes} likes
                            </button>
                          )}
                          <button className="text-zinc-500 text-xs font-semibold">
                            Reply
                          </button>
                        </div>

                        {/* View Replies Toggle */}
                        {c.replies.length > 0 && (
                          <div className="mt-4">
                            <button
                              onClick={() => toggleReplies(c.id)}
                              className="flex items-center gap-3 text-zinc-500 text-xs font-semibold hover:text-zinc-800 transition-colors"
                            >
                              <div className="w-6 h-[1px] bg-zinc-300" />
                              {expandedReplies.includes(c.id)
                                ? "Hide replies"
                                : `View replies (${c.replies.length})`}
                            </button>

                            {/* Nested Replies */}
                            <AnimatePresence>
                              {expandedReplies.includes(c.id) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 space-y-4 overflow-hidden"
                                >
                                  {c.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3">
                                      <img
                                        src={reply.user.avatar}
                                        alt={reply.user.username}
                                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="flex-1 text-sm">
                                        <div className="flex items-start justify-between gap-2">
                                          <div>
                                            <span className="font-semibold mr-2">
                                              {reply.user.username}
                                            </span>
                                            <span className="text-zinc-800">
                                              {reply.text}
                                            </span>
                                          </div>
                                          <button className="flex-shrink-0">
                                            <Heart className="w-3 h-3 text-zinc-400" />
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                          <p className="text-zinc-400 text-xs uppercase tracking-tight">
                                            {reply.timestamp}
                                          </p>
                                          <button className="text-zinc-500 text-xs font-semibold">
                                            Reply
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions & Input */}
              <div className="border-t border-zinc-100 p-4 shrink-0">
                {/* Quick Emoji Bar */}
                <div className="flex items-center justify-between mb-4 px-2">
                  {["❤️", "🙌", "🔥", "👏", "😢", "😍", "😮", "😂"].map(
                    (emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setComment((prev) => prev + emoji)}
                        className="text-2xl hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ),
                  )}
                </div>

                <div className="hidden md:flex items-center justify-between mb-4">
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
                        className={cn(
                          "w-7 h-7",
                          item.is_liked && "fill-current",
                        )}
                      />
                    </motion.button>
                    <button className="hover:opacity-60 transition-opacity">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="hover:opacity-60 transition-opacity">
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="hover:opacity-60 transition-opacity">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                <div className="hidden md:block">
                  <p className="font-semibold text-sm mb-1">
                    {item.like_count.toLocaleString()} likes
                  </p>
                  <p className="text-zinc-400 text-[10px] uppercase tracking-wider mb-4">
                    {formatRelativeTime(item.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3 relative">
                  <img
                    src={MOCK_USER.avatar}
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover border border-zinc-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex items-start bg-zinc-50 rounded-2xl border border-zinc-200 px-4 py-2">
                    <textarea
                      placeholder="Bạn nghĩ gì về nội dung này?"
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height =
                          Math.min(e.target.scrollHeight, 120) + "px";
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleCommentSubmit();
                        }
                      }}
                      rows={1}
                      className="text-sm w-full outline-none bg-transparent resize-none py-1 max-h-[120px] no-scrollbar"
                    />
                    <div className="flex items-center gap-3 pt-1">
                      <button className="text-xs font-bold text-zinc-400 hover:text-zinc-600">
                        GIF
                      </button>
                      <button
                        disabled={!comment.trim()}
                        className={cn(
                          "font-semibold text-sm transition-colors",
                          comment.trim() ? "text-[#0095f6]" : "hidden",
                        )}
                        onClick={handleCommentSubmit}
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Desktop Emoji Picker Toggle */}
                  <div className="hidden md:block" ref={emojiPickerRef}>
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
                          className="absolute bottom-full right-0 mb-2 z-50"
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
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
