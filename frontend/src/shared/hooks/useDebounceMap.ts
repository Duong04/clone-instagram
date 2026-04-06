import { useRef } from 'react'

export const useDebounceMap = <T extends unknown[]>(
  fn: (key: string, ...args: T) => void,
  delay: number = 500
) => {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  return (key: string, ...args: T) => {
    clearTimeout(timers.current[key])
    timers.current[key] = setTimeout(() => {
      fn(key, ...args)
      delete timers.current[key]
    }, delay)
  }
}