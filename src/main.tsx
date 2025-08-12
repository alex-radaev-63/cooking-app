import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GroceryProvider } from "./Components/context/GroceryContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GroceryProvider>
      <App />
    </GroceryProvider>
  </StrictMode>
);
