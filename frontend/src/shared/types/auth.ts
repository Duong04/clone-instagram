export interface User {
  id: string
  email: string
  username: string
  name: string
  avatar?: Avatar
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
 
export interface AuthResponse {
  data: User
}
 
export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
}
 