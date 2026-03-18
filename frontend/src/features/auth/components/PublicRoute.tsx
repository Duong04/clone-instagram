import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore()

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}