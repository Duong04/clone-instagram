import { useState } from "react";
import { motion } from "motion/react";
import {
  Settings,
  Grid,
  Bookmark,
  UserSquare,
  Heart,
  MessageCircle,
} from "lucide-react";
import { cn } from "~/shared/utils/cn";
import { useAuthStore } from "~/store/authStore";

type TabType = "posts" | "saved" | "tagged";

const posts = Array.from({ length: 12 }).map((_, i) => ({
  id: `post-${i}`,
  url: `https://picsum.photos/seed/profile${i}/600/600`,
  likes: Math.floor(Math.random() * 5000),
  comments: Math.floor(Math.random() * 200),
}));

const savedPosts = Array.from({ length: 6 }).map((_, i) => ({
  id: `saved-${i}`,
  url: `https://picsum.photos/seed/saved${i}/600/600`,
  likes: Math.floor(Math.random() * 3000),
  comments: Math.floor(Math.random() * 100),
}));

const taggedPosts = Array.from({ length: 4 }).map((_, i) => ({
  id: `tagged-${i}`,
  url: `https://picsum.photos/seed/tagged${i}/600/600`,
  likes: Math.floor(Math.random() * 4000),
  comments: Math.floor(Math.random() * 150),
}));

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const { user } = useAuthStore();

  const getActiveData = () => {
    switch (activeTab) {
      case "posts":
        return posts;
      case "saved":
        return savedPosts;
      case "tagged":
        return taggedPosts;
      default:
        return posts;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
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
      {/* Header */}
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
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <h2 className="text-xl font-normal">{user?.username}</h2>
            <div className="flex gap-2">
              <button className="bg-zinc-100 hover:bg-zinc-200 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
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
              <span className="font-bold">{ user?._count.total_content }</span> posts
            </div>
            <div className="text-center md:text-left">
              <span className="font-bold">{ user?._count.followers }</span> followers
            </div>
            <div className="text-center md:text-left">
              <span className="font-bold">{ user?._count.following }</span> following
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="font-bold text-sm mb-1">{user?.name}</p>
            <p className="text-sm whitespace-pre-line">
              { user?.bio ?? 'No bio.🫠' }
            </p>
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="border-t border-zinc-200 flex justify-center gap-12">
        <button
          onClick={() => setActiveTab("posts")}
          className={cn(
            "flex items-center gap-2 py-4 border-t -mt-[1px] text-xs font-bold tracking-widest uppercase transition-colors",
            activeTab === "posts"
              ? "border-black text-black"
              : "border-transparent text-zinc-400 hover:text-black",
          )}
        >
          <Grid className="w-3 h-3" />
          Posts
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={cn(
            "flex items-center gap-2 py-4 border-t -mt-[1px] text-xs font-bold tracking-widest uppercase transition-colors",
            activeTab === "saved"
              ? "border-black text-black"
              : "border-transparent text-zinc-400 hover:text-black",
          )}
        >
          <Bookmark className="w-3 h-3" />
          Saved
        </button>
        <button
          onClick={() => setActiveTab("tagged")}
          className={cn(
            "flex items-center gap-2 py-4 border-t -mt-[1px] text-xs font-bold tracking-widest uppercase transition-colors",
            activeTab === "tagged"
              ? "border-black text-black"
              : "border-transparent text-zinc-400 hover:text-black",
          )}
        >
          <UserSquare className="w-3 h-3" />
          Tagged
        </button>
      </div>

      {/* Grid */}
      <motion.div
        key={activeTab}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2"
      >
        {getActiveData().map((post) => (
          <motion.div
            key={post.id}
            variants={item}
            className="relative group cursor-pointer aspect-square overflow-hidden bg-zinc-100"
          >
            <img
              src={post.url}
              alt="Profile post"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-bold">
              <div className="flex items-center gap-1">
                <Heart className="fill-white w-6 h-6" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="fill-white w-6 h-6" />
                <span>{post.comments}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {getActiveData().length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-4">
            {activeTab === "saved" ? (
              <Bookmark className="w-8 h-8" />
            ) : (
              <UserSquare className="w-8 h-8" />
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {activeTab === "saved" ? "Save" : "Photos of you"}
          </h3>
          <p className="text-zinc-500 max-w-xs">
            {activeTab === "saved"
              ? "Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved."
              : "When people tag you in photos, they'll appear here."}
          </p>
        </div>
      )}
    </motion.div>
  );
};
