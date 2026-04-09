import { useFeed } from "../hooks/useFeed";
import { PostCard } from "~/features/posts/components/PostCard";
import { PostSkeleton } from "~/shared/components/common/Skeleton";
import { useIntersection } from "~/shared/hooks/useIntersection";

export const FeedList = () => {
  const { feed, isLoading, hasMore, error, loadMore } = useFeed();
  const bottomRef = useIntersection(() => {
    if (hasMore && !isLoading) loadMore();
  });

  return (
    <div>
      {isLoading && feed.length === 0 ? (
        Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))
      ) : (
        feed.map((item) => (
          <PostCard key={item.feed_id} item={item} />
        ))
      )}

      {isLoading && feed.length > 0 && (
        Array.from({ length: 2 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))
      )}

      {error && (
        <div>
          <p>Lỗi: {error}</p>
          <button onClick={loadMore}>Thử lại</button>
        </div>
      )}

      {isLoading && (
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-[#0095f6] rounded-full animate-spin" />
        </div>
      )}

      <div ref={bottomRef} style={{ height: 1 }} />
    </div>
  );
};