import { RouterProvider } from "react-router-dom";
import { router } from "~/routes";
import "./App.css";
import "swiper/swiper-bundle.css";
import { ModalProvider } from "./shared/context/modal/modal-provider";

function App() {
  return (
    <>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </>
  );
}

export default App;
