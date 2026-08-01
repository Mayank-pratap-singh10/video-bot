import { Video, Message, ChatSession } from "./index.tsx";

export interface AppState {
  videos: Video[];
  selectedVideo: Video | null;
  messages: Message[];
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  isSidebarOpen: boolean;
}