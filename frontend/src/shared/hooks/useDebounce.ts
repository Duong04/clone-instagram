import { useRef } from 'react'

export const useDebounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number = 500
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  return (...args: T) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fn(...args), delay)
  }
}