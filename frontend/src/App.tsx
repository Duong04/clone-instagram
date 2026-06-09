import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { router } from "~/routes";
import "./App.css";
import "swiper/swiper-bundle.css";
import { ModalProvider } from "~/shared/context/modal/modalProvider";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import { usePresenceSocket } from "~/features/realtime/hooks/usePresenceSocket";
import { useSocketConnection } from "~/shared/hooks/useSocketConnection";
import { Toaster } from 'sonner'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  const { getMe } = useAuthStore();
  useSocketConnection();
  usePresenceSocket();

  useEffect(() => {
    const init = async () => {
      await getMe();
    }
    init()
  }, []);

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Toaster position="top-center" richColors />
        <RouterProvider router={router} />
      </ModalProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
