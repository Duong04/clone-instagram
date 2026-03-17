import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import type { Post } from '~/shared/types';
import { cn } from "~/shared/utils/cn";
import { motion, AnimatePresence } from "motion/react";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

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
              src={post.user.avatar} 
              alt={post.user.username} 
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm hover:text-zinc-500 cursor-pointer transition-colors">{post.user.username}</span>
            {post.user.isVerified && (
              <svg aria-label="Verified" className="w-3 h-3 text-[#0095f6]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.688 8.858-6.17 6.17a1.144 1.144 0 0 1-1.618 0l-3.592-3.592a1.144 1.144 0 0 1 1.618-1.618l2.783 2.783 5.362-5.362a1.144 1.144 0 0 1 1.617 1.619Z"></path>
              </svg>
            )}
            <span className="text-zinc-500 text-sm">• {post.timestamp}</span>
          </div>
        </div>
        <button className="hover:text-zinc-500 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image with Double Tap Like */}
      <div 
        className="relative aspect-square bg-zinc-100 overflow-hidden cursor-pointer"
        onDoubleClick={handleLike}
      >
        <img 
          src={post.image} 
          alt="Post content" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-24 h-24 fill-white text-white drop-shadow-2xl" />
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
              onClick={handleLike}
              className={cn("hover:opacity-60 transition-opacity", isLiked && "text-red-500")}
            >
              <Heart className={cn("w-7 h-7", isLiked && "fill-current")} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} className="hover:opacity-60 transition-opacity">
              <MessageCircle className="w-7 h-7" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} className="hover:opacity-60 transition-opacity">
              <Send className="w-7 h-7" />
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.8 }} className="hover:opacity-60 transition-opacity">
            <Bookmark className="w-7 h-7" />
          </motion.button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2">{post.likes.toLocaleString()} likes</p>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span>{post.caption}</span>
        </div>

        {/* Comments */}
        <button className="text-zinc-500 text-sm mb-2 hover:text-zinc-400 transition-colors">
          View all {post.comments} comments
        </button>

        {/* Add Comment */}
        <div className="flex items-center justify-between mt-2">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="text-sm w-full outline-none bg-transparent"
          />
          <button className="text-[#0095f6] font-semibold text-sm hover:text-[#00376b] transition-colors">
            Post
          </button>
        </div>
      </div>
    </motion.div>
  );
};
