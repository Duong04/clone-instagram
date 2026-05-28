import { Navigate } from "react-router-dom";
import { SplashScreen } from "~/shared/components/common/SplashScreen";
import { useAuthStore } from "../store/useAuthStore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isInitialized  } = useAuthStore();

  if (!isInitialized ) return <SplashScreen />;
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
