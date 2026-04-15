import { Navigate } from "react-router-dom";
import { SplashScreen } from "~/shared/components/common/SplashScreen";
import { useAuthStore } from "~/store/authStore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuthStore();

  console.log(isLoggedIn)
  if (isLoading) return <SplashScreen />;
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
