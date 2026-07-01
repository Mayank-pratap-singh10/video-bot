import React, { useState, useCallback, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './App.module.css';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { VideoInput } from './components/VideoInput/VideoInput';
import { ChatWindow } from './components/ChatWindow/ChatWindow';
import { ChatHistory } from './components/ChatHistory/ChatHistory';
import { Video, Message, ChatSession } from './types';

const App: React.FC = () => {
  // State Management
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('videos');
    const savedSessions = localStorage.getItem('chatSessions');

    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch (e) {
        console.error('Error loading videos:', e);
      }
    }

    if (savedSessions) {
      try {
        setChatSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error('Error loading sessions:', e);
      }
    }
  }, []);

  // Save videos to localStorage
  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  // Save chat sessions to localStorage
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Handle adding new video
  const handleAddVideo = useCallback((video: Video) => {
    setVideos((prev) => [video, ...prev]);
    setSelectedVideo(video);
    startNewSession(video);
  }, []);

  // Handle video selection
  const handleSelectVideo = useCallback((video: Video) => {
    setSelectedVideo(video);
    // Try to find existing session for this video
    const existingSession = chatSessions.find((session) => session.videoId === video.id);
    if (existingSession) {
      setCurrentSessionId(existingSession.id);
      setMessages(existingSession.messages);
    } else {
      startNewSession(video);
    }
  }, [chatSessions]);

  // Start new chat session
  const startNewSession = (video: Video) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      videoId: video.id,
      videoTitle: video.title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  // Handle sending message
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedVideo || !currentSessionId) return;

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
        videoId: selectedVideo.id,
      };

      setMessages((prev) => [...prev, userMessage]);

      // Simulate bot response
      setIsLoading(true);
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateBotResponse(content, selectedVideo.title),
          sender: 'bot',
          timestamp: new Date(),
          videoId: selectedVideo.id,
          timestamp_reference: generateTimestampReference(),
        };

        setMessages((prev) => [...prev, botMessage]);

        // Update session
        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, userMessage, botMessage],
                  updatedAt: new Date(),
                }
              : session
          )
        );

        setIsLoading(false);
      }, 1500);
    },
    [selectedVideo, currentSessionId]
  );

  // Generate bot response (placeholder)
  const generateBotResponse = (question: string, videoTitle: string): string => {
    const responses = [
      `Based on the "${videoTitle}", your question about "${question}" relates to the key concepts discussed around the ${Math.floor(Math.random() * 15) + 1} minute mark.`,
      `Great question! The video addresses this topic in detail. According to the content, ${question.toLowerCase()} is covered extensively.`,
      `This is an important aspect of "${videoTitle}". The video explains that the answer involves several key points related to your query.`,
      `Excellent inquiry! The "${videoTitle}" provides a comprehensive explanation about ${question.toLowerCase()}.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Generate timestamp reference
  const generateTimestampReference = (): string => {
    const minutes = Math.floor(Math.random() * 120);
    const seconds = Math.floor(Math.random() * 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Handle clearing chat
  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear this chat?')) {
      setMessages([]);
      if (currentSessionId) {
        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === currentSessionId
              ? { ...session, messages: [], updatedAt: new Date() }
              : session
          )
        );
      }
    }
  }, [currentSessionId]);

  // Handle exporting chat
  const handleExportChat = useCallback(() => {
    console.log('Exporting chat...');
  }, []);

  // Handle selecting chat session
  const handleSelectSession = useCallback((session: ChatSession) => {
    const video = videos.find((v) => v.id === session.videoId);
    if (video) {
      setSelectedVideo(video);
      setCurrentSessionId(session.id);
      setMessages(session.messages);
    }
  }, [videos]);

  // Handle deleting session
  const handleDeleteSession = useCallback((sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      setChatSessions((prev) => prev.filter((session) => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    }
  }, [currentSessionId]);

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button
            className={styles.menuBtn}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className={styles.title}>🎬 Video Bot</h1>
          <p className={styles.subtitle}>Ask questions. Save time. Learn faster.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarContent}>
            <VideoInput
              onAddVideo={handleAddVideo}
              onSelectVideo={handleSelectVideo}
              videos={videos}
            />
            {chatSessions.length > 0 && (
              <ChatHistory
                sessions={chatSessions}
                currentSessionId={currentSessionId}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
              />
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.main}>
          <div className={styles.splitView}>
            {/* Video Section */}
            <div className={styles.videoSection}>
              {selectedVideo ? (
                <VideoPlayer
                  url={selectedVideo.url}
                  title={selectedVideo.title}
                />
              ) : (
                <div className={styles.placeholderVideo}>
                  <div className={styles.placeholderContent}>
                    <div className={styles.placeholderIcon}>📺</div>
                    <h2>No Video Selected</h2>
                    <p>Add a video to get started</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Section */}
            <div className={styles.chatSection}>
              <ChatWindow
                selectedVideo={selectedVideo}
                messages={messages}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                onExportChat={handleExportChat}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;