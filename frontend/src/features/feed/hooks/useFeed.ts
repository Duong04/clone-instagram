import { useEffect, useRef } from 'react'
import { useFeedStore } from '../store/useFeedStore'

export const useFeed = () => {
  const feed = useFeedStore((s) => s.feed)
  const isLoading = useFeedStore((s) => s.isLoading)
  const hasMore = useFeedStore((s) => s.hasMore)
  const error = useFeedStore((s) => s.error)
  const loadMore = useFeedStore((s) => s.loadMore)
  const reset = useFeedStore((s) => s.reset)
  
  const initialized = useRef(false)
  
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    
    if (feed.length === 0) {
      loadMore()
    }
    
  }, [])
  
  return { feed, isLoading, hasMore, error, loadMore, reset }
}