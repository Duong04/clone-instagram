import { motion } from "motion/react";
import { Heart, MessageCircle } from "lucide-react";

const images = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/explore${i}/600/600`,
  likes: Math.floor(Math.random() * 10000),
  comments: Math.floor(Math.random() * 500),
  isLarge: i % 10 === 1 || i % 10 === 6,
}));
export const ExplorePage = () => {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[935px] mx-auto pt-8 pb-16 px-4"
    >
      <div className="columns-2 md:columns-3 gap-2">
        {images.map((img) => (
          <motion.div 
            key={img.id} 
            variants={item}
            className={`relative group cursor-pointer aspect-square overflow-hidden mb-2 ${img.isLarge ? 'row-span-2 col-span-1' : ''}`}
          >
            <img 
              src={img.url} 
              alt="Explore" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-bold">
              <div className="flex items-center gap-1">
                <Heart className="fill-white w-6 h-6" />
                <span>{img.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="fill-white w-6 h-6" />
                <span>{img.comments}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
