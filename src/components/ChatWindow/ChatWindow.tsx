import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Trash2, Loader } from 'lucide-react';
import styles from './ChatWindow.module.css';
import { Message, Video } from '../../types';

interface ChatWindowProps {
  selectedVideo: Video | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onExportChat: () => void;
  isLoading?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedVideo,
  messages,
  onSendMessage,
  onClearChat,
  onExportChat,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedVideo) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const exportChatAsText = () => {
    const chatContent = messages
      .map(
        (msg) =>
          `[${formatTime(msg.timestamp)}] ${msg.sender === 'user' ? 'You' : 'Bot'}: ${msg.content}`
      )
      .join('\n');

    const header = `Video Bot Chat Export\n${selectedVideo?.title}\n${'='.repeat(50)}\n\n`;
    const fullContent = header + chatContent;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(fullContent)}`);
    element.setAttribute('download', `chat-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!selectedVideo) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>🎥</div>
          <h2 className={styles.emptyTitle}>No Video Selected</h2>
          <p className={styles.emptyText}>
            Please add and select a video to start asking questions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>{selectedVideo.title}</h2>
          <p className={styles.subtitle}>Ask questions about this video</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.actionBtn}
            onClick={exportChatAsText}
            title="Export Chat"
            disabled={messages.length === 0}
          >
            <Download size={18} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.dangerBtn}`}
            onClick={onClearChat}
            title="Clear Chat"
            disabled={messages.length === 0}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>
            <p>No messages yet. Start by asking a question about the video!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${styles[message.sender]}`}
            >
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{message.content}</p>
                {message.timestamp_reference && (
                  <div className={styles.timestamp}>
                    {message.timestamp_reference}
                  </div>
                )}
              </div>
              <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something about the video..."
          className={styles.textarea}
          disabled={!selectedVideo || isLoading}
          rows={3}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || !selectedVideo || isLoading}
          title="Send Message"
        >
          {isLoading ? <Loader size={20} className={styles.spinner} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};