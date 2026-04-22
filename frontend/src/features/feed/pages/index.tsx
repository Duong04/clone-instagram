import { StoryCircle } from "~/shared/components/cards/StoryCircle";
import { MOCK_STORIES, MOCK_USER } from "~/mockData";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Plus } from "lucide-react";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import { FeedList } from "../components/FeedList";
import { StorySkeleton } from "~/shared/components/common/Skeleton";
import { useEffect, useState } from "react";

export const FeedPage = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center pt-4 md:pt-8 pb-16 px-2 md:px-4"
    >
      <div className="w-full md:max-w-[935px] flex gap-8">
        {/* FEED */}
        <div className="w-full grid grid-cols-1 md:max-w-[614px] mx-auto min-w-0">
          {/* STORIES */}
          <div className="stories border-b border-zinc-200 md:border md:rounded-lg px-2 py-4 my-3">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={3}
              slidesPerView={3}
              observer={true}
              observeParents={true}
              breakpoints={{
                340: { slidesPerView: 4 },
                430: { slidesPerView: 5 },
                580: { slidesPerView: 6 },
                1024: { slidesPerView: 7 },
              }}
              className="w-full"
              style={{ padding: "6px 0" }}
            >
              <SwiperSlide key={user?.id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center gap-1">
                    <div className="p-[3px] rounded-full instagram-gradient">
                      <div className="p-[2px] bg-white rounded-full">
                        <img
                          src={user?.avatar?.url}
                          alt={user?.username}
                          className="w-14 h-14 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-5 right-3 bg-[#0095f6] border-2 border-white rounded-full p-0.5 text-white">
                      <Plus className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-zinc-500 truncate w-16 text-center">
                      Your Story
                    </span>
                  </div>
                </motion.div>
              </SwiperSlide>
              {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => 
                <SwiperSlide key={i}>
                    <StorySkeleton />
                  </SwiperSlide>
            )
              ) : (
                MOCK_STORIES.map((story) => (
                  <SwiperSlide key={story.id}>
                    <StoryCircle story={story} />
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>

          {/* POSTS */}
          <div className="space-y-6">
            <FeedList />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="hidden xl:block w-[320px] pt-4">
          {/* USER */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={MOCK_USER.avatar}
                alt={MOCK_USER.username}
                className="w-12 h-12 rounded-full border border-zinc-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-semibold text-sm">{MOCK_USER.username}</p>
                <p className="text-zinc-500 text-sm">{MOCK_USER.fullName}</p>
              </div>
            </div>

            <button className="text-[#0095f6] text-xs font-semibold hover:text-zinc-500">
              Switch
            </button>
          </div>

          {/* SUGGESTIONS HEADER */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-semibold text-sm">
              Suggested for you
            </span>

            <button className="text-black text-xs font-semibold hover:text-zinc-500">
              See All
            </button>
          </div>

          {/* SUGGESTIONS LIST */}
          <div className="space-y-3">
            {MOCK_STORIES.slice(0, 5).map((story) => (
              <div key={story.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-8 h-8 rounded-full border border-zinc-200"
                    referrerPolicy="no-referrer"
                  />

                  <div>
                    <p className="font-semibold text-xs">
                      {story.user.username}
                    </p>

                    <p className="text-zinc-500 text-[10px]">
                      Followed by user_123 + 2 more
                    </p>
                  </div>
                </div>

                <button className="text-[#0095f6] text-xs font-semibold hover:text-zinc-500">
                  Follow
                </button>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="mt-8 text-[11px] text-zinc-400 space-y-4">
            <p>
              About • Help • Press • API • Jobs • Privacy • Terms • Locations •
              Language • Meta Verified
            </p>

            <p>© {new Date().getFullYear()} INSTAGRAM FROM META</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
