export interface UserAuth {
  id: string
  email: string
  name: string
  username: string
  bio: string | null
  is_private: boolean
  _count: Count
  avatar: Avatar | null
}

export interface Count {
  followers: number
  following: number
  posts: number
  reels: number
  total_content: number
}

export interface Avatar {
  url: string
}
