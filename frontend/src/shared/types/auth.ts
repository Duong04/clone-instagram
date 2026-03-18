export interface User {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url?: string
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
 
export interface Response {
  data: User
}
 
export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
}
 