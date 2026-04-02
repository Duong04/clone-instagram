import { useEffect, useRef } from "react";
import { useFeed } from "../hooks/useFeed";
import { PostCard } from "~/shared/components/cards/PostCard";

export const FeedList = () => {
  const { feed, isLoading, hasMore, loadMore } = useFeed();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      },
      { threshold: 0.1 },
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div>
      {feed.map((item) => (
        <PostCard key={item.feed_id} item={item} />
      ))}
      {isLoading && <p>Loading...</p>}
      <div ref={bottomRef} />
    </div>
  );
};
