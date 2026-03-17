import React from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music } from "lucide-react";

export const ReelsPage = () => {
  const reels = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    user: {
      username: `creator_${i}`,
      avatar: `https://picsum.photos/seed/creator${i}/150/150`,
    },
    caption: "Check out this amazing view! 🌊 #nature #reels #viral",
    music: "Original Audio - creator_music",
    likes: "1.2M",
    comments: "12.4K",
  }));

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {reels.map((reel) => (
        <div key={reel.id} className="h-screen w-full flex items-center justify-center snap-start bg-black relative">
          <div className="relative h-[90vh] aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden shadow-2xl">
            <img 
              src={`https://picsum.photos/seed/reel${reel.id}/1080/1920`} 
              alt="Reel content" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            
            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="flex items-center gap-3 mb-3">
                <img src={reel.user.avatar} className="w-8 h-8 rounded-full border border-white" alt="" referrerPolicy="no-referrer" />
                <span className="font-semibold text-sm">{reel.user.username}</span>
                <button className="border border-white/50 px-2 py-0.5 rounded-md text-xs font-semibold hover:bg-white/10">Follow</button>
              </div>
              <p className="text-sm mb-3 line-clamp-2">{reel.caption}</p>
              <div className="flex items-center gap-2 text-xs">
                <Music className="w-3 h-3" />
                <span className="truncate">{reel.music}</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="absolute right-4 bottom-10 flex flex-col items-center gap-6 text-white">
              <div className="flex flex-col items-center gap-1">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Heart className="w-7 h-7" />
                </button>
                <span className="text-xs font-semibold">{reel.likes}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MessageCircle className="w-7 h-7" />
                </button>
                <span className="text-xs font-semibold">{reel.comments}</span>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Send className="w-7 h-7" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Bookmark className="w-7 h-7" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MoreHorizontal className="w-7 h-7" />
              </button>
              <div className="w-8 h-8 rounded-md border-2 border-white overflow-hidden">
                <img src={reel.user.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
