import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { AboutOwnerModal } from "./components/AboutOwnerModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoginModal } from "./components/LoginModal";
import { AppProvider, useAppContext } from "./context/AppContext";
import { AboutPage } from "./pages/AboutPage";
import { DetailPage } from "./pages/DetailPage";
import { HomePage } from "./pages/HomePage";
import { StoryReaderPage } from "./pages/StoryReaderPage";
import { UploadPage } from "./pages/UploadPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AppRoutes() {
  const { page } = useAppContext();

  return (
    <AnimatePresence mode="wait">
      {page === "home" && <HomePage key="home" />}
      {page === "detail" && <DetailPage key="detail" />}
      {page === "reader" && <StoryReaderPage key="reader" />}
      {page === "upload" && <UploadPage key="upload" />}
      {page === "about" && <AboutPage key="about" />}
    </AnimatePresence>
  );
}

function AppLayout() {
  const { page } = useAppContext();
  const showFooter = page !== "reader";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppRoutes />
      {showFooter && <Footer />}
      <LoginModal />
      <AboutOwnerModal />
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </QueryClientProvider>
  );
}
