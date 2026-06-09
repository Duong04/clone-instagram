export interface User {
  id: string
  email: string
  username: string
  name: string
  bio?: string
  website?: string | null
  is_private: boolean
  avatar?: Avatar
  _count: Count
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
 
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  username: string
  password: string
}

export interface UpdateProfileRequest {
  name?: string
  username?: string
  bio?: string | null
  website?: string | null
  is_private?: boolean
}
 
export interface AuthResponse {
  data: User
}
 
export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
}
 
