import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '~/store/useAuthStore'

interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? 'http://localhost'}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let isRefreshing = false
let queue: Array<() => void> = []

const AUTH_ENDPOINTS = ['/auth/refresh', '/auth/login', '/auth/logout']

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as CustomConfig

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (AUTH_ENDPOINTS.some(endpoint => originalRequest.url?.includes(endpoint))) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push(() => resolve(api(originalRequest)))
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await api.post('/auth/refresh')
      queue.forEach((cb) => cb())
      queue = []
      return api(originalRequest)
    } catch (err) {
      queue = []
      useAuthStore.getState().logout()
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)
export default api