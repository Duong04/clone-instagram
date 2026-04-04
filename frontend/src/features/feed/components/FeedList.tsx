import { useFeed } from "../hooks/useFeed";
import { PostCard } from "~/shared/components/cards/PostCard";
import { useIntersection } from "~/shared/hooks/useIntersection";

export const FeedList = () => {
  const { feed, isLoading, hasMore, error, loadMore } = useFeed();
  const bottomRef = useIntersection(() => {
    if (hasMore && !isLoading) loadMore();
  });

  return (
    <div>
      {feed.map((item) => (
        <PostCard key={item.feed_id} item={item} />
      ))}

      {error && (
        <div>
          <p>Lỗi: {error}</p>
          <button onClick={loadMore}>Thử lại</button>
        </div>
      )}

      {isLoading && <p>Đang tải...</p>}

      <div ref={bottomRef} style={{ height: 1 }} />
    </div>
  );
};
