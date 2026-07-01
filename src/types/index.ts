export interface Video {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  addedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  videoId?: string;
  timestamp_reference?: string;
}

export interface ChatSession {
  id: string;
  videoId: string;
  videoTitle: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}