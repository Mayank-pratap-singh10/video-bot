import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Video, Message, ChatSession } from "../types";
import { AppState } from "./AppState";
import StorageService from "../services/storage";

interface AppContextType extends AppState {
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  setSelectedVideo: React.Dispatch<React.SetStateAction<Video | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setCurrentSessionId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setIsSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const saved = StorageService.load<AppState>();

  const [videos, setVideos] = useState<Video[]>(
    saved?.videos ?? []
  );

  const [selectedVideo, setSelectedVideo] =
    useState<Video | null>(saved?.selectedVideo ?? null);

  const [messages, setMessages] = useState<Message[]>(
    saved?.messages ?? []
  );

  const [chatSessions, setChatSessions] =
    useState<ChatSession[]>(saved?.chatSessions ?? []);

  const [currentSessionId, setCurrentSessionId] =
    useState<string | null>(
      saved?.currentSessionId ?? null
    );

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(saved?.isSidebarOpen ?? true);

  useEffect(() => {
    StorageService.save({
      videos,
      selectedVideo,
      messages,
      chatSessions,
      currentSessionId,
      isSidebarOpen,
    });
  }, [
    videos,
    selectedVideo,
    messages,
    chatSessions,
    currentSessionId,
    isSidebarOpen,
  ]);

  return (
    <AppContext.Provider
      value={{
        videos,
        selectedVideo,
        messages,
        chatSessions,
        currentSessionId,
        isSidebarOpen,
        setVideos,
        setSelectedVideo,
        setMessages,
        setChatSessions,
        setCurrentSessionId,
        setIsSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}