import type { Story } from "~/shared/types";
import { motion } from "motion/react";

interface StoryCircleProps {
  story: Story;
}

export const StoryCircle = ({ story }: StoryCircleProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
    >
      <div className="p-[3px] rounded-full instagram-gradient">
        <div className="p-[2px] bg-white rounded-full">
          <img 
            src={story.user.avatar} 
            alt={story.user.username} 
            className="w-14 h-14 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <span className="text-xs text-zinc-600 truncate w-16 text-center">
        {story.user.username}
      </span>
    </motion.div>
  );
};
