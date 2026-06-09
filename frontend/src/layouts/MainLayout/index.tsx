import { useLocation } from "react-router-dom"
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from "motion/react"
import { Sidebar } from "./Sidebar"
import { BottomNav } from './BottomNav'
import { MobileHeader } from "./MobileHeader"
import { cn } from "~/shared/utils/cn"
import { useModal } from "~/shared/context/modal/modalContext"
import { CreatePostModal } from "~/features/posts/components/CreatePostModal"
import { PostDetailModal } from "~/features/posts/components/PostDetailModal"

export default function MainLayout() {
    const { isCreatePostOpen, closeCreatePost, selectedPost, closePostDetail } = useModal();
    const location = useLocation();
    const isReelsPage = location.pathname === "/reels";
    const isFeedPage = location.pathname === "/";

    return (
        <div className="flex min-h-screen bg-white">
        <Sidebar />
        {isFeedPage && <MobileHeader />}
        <main className={cn(
            "flex-1 transition-all duration-500 ease-in-out pb-12 md:pb-0",
            isReelsPage ? "ml-0 md:ml-[72px] xl:ml-60" : "ml-0 md:ml-[72px] xl:ml-60",
            isFeedPage && "pt-12 md:pt-0"
        )}>
            <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Outlet />
            </motion.div>
            </AnimatePresence>
        </main>
        <BottomNav />
        <CreatePostModal isOpen={isCreatePostOpen} onClose={closeCreatePost} />
        <PostDetailModal 
            feedId={selectedPost?.feed_id ?? null} 
            post={selectedPost}
            isOpen={!!selectedPost} 
            onClose={closePostDetail} 
        />
        </div>
    )
}
