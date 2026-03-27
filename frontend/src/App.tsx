import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { router } from "~/routes";
import "./App.css";
import "swiper/swiper-bundle.css";
import { ModalProvider } from "./shared/context/modal/modalProvider";
import { useAuthStore } from "./store/authStore";
import { Toaster } from 'sonner'

function App() {
  const { getMe } = useAuthStore();
  useEffect(() => {
    const init = async () => {
      await getMe();
    }
    init()
  }, []);

  return (
    <>
      <ModalProvider>
        <Toaster position="top-center" richColors />
        <RouterProvider router={router} />
      </ModalProvider>
    </>
  );
}

export default App;
