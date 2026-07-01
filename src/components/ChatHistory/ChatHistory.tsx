import React from 'react';
import { MessageCircle, X, Clock } from 'lucide-react';
import styles from './ChatHistory.module.css';
import { ChatSession } from '../../types';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (sessions.length === 0) {
    return (
      <div className={styles.empty}>
        <MessageCircle size={24} className={styles.emptyIcon} />
        <p>No chat history yet</p>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      <h3 className={styles.title}>Chat History</h3>
      <div className={styles.sessionsList}>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`${styles.sessionItem} ${
              currentSessionId === session.id ? styles.active : ''
            }`}
            onClick={() => onSelectSession(session)}
          >
            <div className={styles.sessionInfo}>
              <p className={styles.sessionTitle}>{session.videoTitle}</p>
              <div className={styles.sessionMeta}>
                <Clock size={12} />
                <span>{formatDate(session.createdAt)}</span>
                <span className={styles.messageCount}>
                  {session.messages.length} messages
                </span>
              </div>
            </div>
            <button
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              title="Delete session"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};