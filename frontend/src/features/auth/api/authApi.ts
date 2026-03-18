import api from '~/shared/lib/axios'
import type { LoginRequest, Response, RegisterRequest } from '~/shared/types/auth'

export const authApi = {
  register: async (data: RegisterRequest): Promise<Response> => {
    const res = await api.post<Response>('/auth/register', data);
    return res.data
  },

  login: async (data: LoginRequest): Promise<Response> => {
    const res = await api.post<Response>('/auth/login', data)
    return res.data
  },
 
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
 
  getMe: async () => {
    const res = await api.get('/auth/profile')
    return res.data
  },
}
 