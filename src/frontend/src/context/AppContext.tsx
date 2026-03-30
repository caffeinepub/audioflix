import { type ReactNode, createContext, useContext, useState } from "react";
import type { ContentItem, ContentItemWithLikes } from "../backend";

export type Page = "home" | "detail" | "reader" | "upload" | "about";

export interface DisplayContent {
  id: string;
  title: string;
  authorName: string;
  description: string;
  genre: string;
  contentType: "audio" | "story";
  textContent: string;
  coverImage?: string;
  likeCount?: number;
  blobId?: { getDirectURL: () => string };
  thumbnailBlobId?: { getDirectURL: () => string };
  isBackend?: boolean;
  originalItem?: ContentItem | ContentItemWithLikes;
}

interface AppContextType {
  page: Page;
  selectedContent: DisplayContent | null;
  navigate: (page: Page, content?: DisplayContent) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  aboutOwnerOpen: boolean;
  setAboutOwnerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const [selectedContent, setSelectedContent] = useState<DisplayContent | null>(
    null,
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [aboutOwnerOpen, setAboutOwnerOpen] = useState(false);

  const navigate = (newPage: Page, content?: DisplayContent) => {
    setPage(newPage);
    if (content) setSelectedContent(content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppContext.Provider
      value={{
        page,
        selectedContent,
        navigate,
        loginModalOpen,
        setLoginModalOpen,
        aboutOwnerOpen,
        setAboutOwnerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
