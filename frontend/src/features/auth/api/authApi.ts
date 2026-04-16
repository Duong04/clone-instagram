import api from '~/shared/libs/axios'
import type { LoginRequest, AuthResponse, RegisterRequest } from '~/shared/types/auth'

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },
 
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
 
  getMe: async () => {
    const res = await api.get('/users/me')
    return res.data
  },
}
 