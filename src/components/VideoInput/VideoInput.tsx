import React, { useState } from 'react';
import { Plus, X, Copy, Check } from 'lucide-react';
import styles from './VideoInput.module.css';
import { Video } from '../../types';
import API from "../../api";

interface VideoInputProps {
  onAddVideo: (video: Video) => void;
  onSelectVideo: (video: Video) => void;
  videos: Video[];
}

export const VideoInput: React.FC<VideoInputProps> = ({ 
  onAddVideo, 
  onSelectVideo, 
  videos 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddVideo = async () => {
  if (!inputValue.trim()) return;

  const video: Video = {
    id: Date.now().toString(),
    url: inputValue.trim(),
    title: extractTitle(inputValue),
    addedAt: new Date(),
  };

  try {

    // Extract Video ID
    let videoId = inputValue.trim();

    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {

      const match = videoId.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );

      if (match) {
        videoId = match[1];
      }
    }

    await API.post("/load-video", {
      video_id: videoId,
    });

    onAddVideo(video);

    setInputValue("");
    setIsExpanded(false);

  } catch (err) {
    alert("Unable to process this video.");
    console.log(err);
  }
};

  const extractTitle = (url: string): string => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `Video ${videos.length + 1}`;
    }
    try {
      const urlObj = new URL(url);
      return urlObj.hostname || `Video ${videos.length + 1}`;
    } catch {
      return `Video ${videos.length + 1}`;
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(url);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddVideo();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        {!isExpanded ? (
          <button 
            className={styles.expandBtn}
            onClick={() => setIsExpanded(true)}
          >
            <Plus size={20} />
            <span>Add Video</span>
          </button>
        ) : (
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Enter YouTube URL or Video ID"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.input}
              autoFocus
            />
            <button 
              className={styles.addBtn}
              onClick={handleAddVideo}
              disabled={!inputValue.trim()}
            >
              <Plus size={18} />
            </button>
            <button 
              className={styles.cancelBtn}
              onClick={() => {
                setIsExpanded(false);
                setInputValue('');
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {videos.length > 0 && (
        <div className={styles.videoList}>
          <h3 className={styles.listTitle}>Added Videos ({videos.length})</h3>
          <div className={styles.videos}>
            {videos.map((video) => (
              <div 
                key={video.id}
                className={styles.videoItem}
                onClick={() => onSelectVideo(video)}
              >
                <div className={styles.videoInfo}>
                  <p className={styles.videoTitle}>{video.title}</p>
                  <p className={styles.videoUrl}>{video.url}</p>
                </div>
                <button
                  className={styles.copyBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(video.url);
                  }}
                  title="Copy URL"
                >
                  {copiedId === video.url ? (
                    <Check size={16} className={styles.checkIcon} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};