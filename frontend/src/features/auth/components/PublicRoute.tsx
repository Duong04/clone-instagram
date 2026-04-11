import { Navigate } from 'react-router-dom'
import { SplashScreen } from '~/shared/components/common/SplashScreen'
import { useAuthStore } from '~/store/authStore'

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuthStore() 

  if (isLoading) {
    return <SplashScreen />
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}