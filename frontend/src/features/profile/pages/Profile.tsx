import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Bookmark,
  Clapperboard,
  Grid,
  Heart,
  MessageCircle,
  Settings,
  UserSquare,
} from "lucide-react";
import { cn } from "~/shared/utils/cn";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import { useModal } from "~/shared/context/modal/modalContext";
import { useIntersection } from "~/shared/hooks/useIntersection";
import type { FeedItem } from "~/shared/types/feed";
import { getFeedMedia } from "~/shared/utils/feedMedia";
import { EditProfileModal } from "../components/EditProfileModal";
import { useProfileContent } from "../hooks/useProfileContent";

type TabType = "posts" | "saved" | "tagged";

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const getMe = useAuthStore((s) => s.getMe);
  const { openPostDetail } = useModal();
  const { items, isLoading, hasMore, error, loadMore } =
    useProfileContent(activeTab);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && !error) loadMore();
  }, [error, hasMore, isLoading, loadMore]);
  const bottomRef = useIntersection(handleLoadMore);

  useEffect(() => {
    getMe();
  }, [getMe]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[935px] mx-auto pt-8 pb-16 px-4"
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-12"
      >
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-20 h-20 md:w-40 md:h-40 rounded-full p-1 border border-zinc-200 cursor-pointer"
          >
            <img
              src={user?.avatar?.url}
              alt={user?.username}
              className="w-full h-full rounded-full object-cover bg-zinc-100"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <h2 className="text-xl font-normal">{user?.username}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="bg-zinc-100 hover:bg-zinc-200 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Edit Profile
              </button>
              <button className="bg-zinc-100 hover:bg-zinc-200 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                View Archive
              </button>
              <button className="p-1 hover:bg-zinc-100 rounded-lg transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-10 mb-6 border-y md:border-none py-3 md:py-0">
            <div className="text-center md:text-left">
              <span className="font-bold">{user?._count.total_content ?? 0}</span> posts
            </div>
            <div className="text-center md:text-left">
              <span className="font-bold">{user?._count.followers ?? 0}</span> followers
            </div>
            <div className="text-center md:text-left">
              <span className="font-bold">{user?._count.following ?? 0}</span> following
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="font-bold text-sm mb-1">{user?.name}</p>
            <p className="text-sm whitespace-pre-line">{user?.bio ?? "No bio."}</p>
          </div>
        </div>
      </motion.header>

      <div className="border-t border-zinc-200 flex justify-center gap-12">
        <ProfileTabButton
          active={activeTab === "posts"}
          icon={<Grid className="w-3 h-3" />}
          label="Posts"
          onClick={() => setActiveTab("posts")}
        />
        <ProfileTabButton
          active={activeTab === "saved"}
          icon={<Bookmark className="w-3 h-3" />}
          label="Saved"
          onClick={() => setActiveTab("saved")}
        />
        <ProfileTabButton
          active={activeTab === "tagged"}
          icon={<UserSquare className="w-3 h-3" />}
          label="Tagged"
          onClick={() => setActiveTab("tagged")}
        />
      </div>

      <motion.div
        key={activeTab}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2"
      >
        {items.map((post) => (
          <motion.div
            key={post.feed_id}
            variants={item}
            onClick={() => openPostDetail(post)}
            className="relative group cursor-pointer aspect-square overflow-hidden bg-zinc-100"
          >
            <ProfileGridMedia post={post} />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-bold">
              <div className="flex items-center gap-1">
                <Heart className="fill-white w-6 h-6" />
                <span>{post.like_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="fill-white w-6 h-6" />
                <span>{post.comment_count}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mt-2">
          {Array.from({ length: items.length === 0 ? 6 : 3 }).map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm text-zinc-500 mb-3">{error}</p>
          <button
            onClick={loadMore}
            className="bg-zinc-100 hover:bg-zinc-200 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {items.length === 0 && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-4">
            {activeTab === "posts" ? (
              <Grid className="w-8 h-8" />
            ) : activeTab === "saved" ? (
              <Bookmark className="w-8 h-8" />
            ) : (
              <UserSquare className="w-8 h-8" />
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {activeTab === "posts"
              ? "No posts yet"
              : activeTab === "saved"
                ? "Save"
                : "Photos of you"}
          </h3>
          <p className="text-zinc-500 max-w-xs">
            {activeTab === "posts"
              ? "Share photos and videos to see them here."
              : activeTab === "saved"
                ? "Save photos and videos that you want to see again. Only you can see what you've saved."
                : "When people tag you in photos, they'll appear here."}
          </p>
        </div>
      )}

      <div ref={bottomRef} className="h-1" />
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </motion.div>
  );
};

const ProfileTabButton = ({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 py-4 border-t -mt-[1px] text-xs font-bold tracking-widest uppercase transition-colors",
      active
        ? "border-black text-black"
        : "border-transparent text-zinc-400 hover:text-black",
    )}
  >
    {icon}
    {label}
  </button>
);

const ProfileGridMedia = ({ post }: { post: FeedItem }) => {
  const firstMedia = getFeedMedia(post).sort((a, b) => a.position - b.position)[0];
  const media = firstMedia?.media;

  if (!media) {
    return <div className="w-full h-full bg-zinc-100" />;
  }

  if (media.media_type.startsWith("video")) {
    return (
      <div className="relative w-full h-full bg-black">
        <video
          src={media.url}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          muted
          playsInline
          preload="metadata"
        />
        <Clapperboard className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow" />
      </div>
    );
  }

  return (
    <img
      src={media.url}
      alt={post.caption ?? "Profile post"}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      referrerPolicy="no-referrer"
    />
  );
};
