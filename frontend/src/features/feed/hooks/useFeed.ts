import { useEffect } from 'react'
import { useFeedStore } from '../store/feedStore'

export const useFeed = () => {
  const { feed, isLoading, hasMore, loadMore, reset } = useFeedStore()

  useEffect(() => {
    if (feed.length === 0) loadMore()
    return () => reset()
  }, [])

  return { feed, isLoading, hasMore, loadMore }
}