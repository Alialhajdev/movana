import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import "./styles.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <StoreProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster richColors theme="dark" />
        </StoreProvider>
      </I18nProvider>
    </QueryClientProvider>
  </StrictMode>
);
