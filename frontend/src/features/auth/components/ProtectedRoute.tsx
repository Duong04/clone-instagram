import { useEffect } from "react"
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { getMe, isLoggedIn, isLoading  } = useAuthStore()

  useEffect(() => {
    getMe();
  }, []);

  if (isLoading) return <div>Loading...</div>

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}