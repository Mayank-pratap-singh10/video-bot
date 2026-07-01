import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const getEmbedUrl = (inputUrl: string): string => {
    // Handle YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = inputUrl.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    // Handle YouTube IDs directly
    if (/^[a-zA-Z0-9_-]{11}$/.test(inputUrl)) {
      return `https://www.youtube.com/embed/${inputUrl}`;
    }
    return inputUrl;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className={styles.playerContainer}>
      <div className={styles.videoWrapper}>
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        ></iframe>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className={styles.controls}>
          <button 
            className={styles.controlBtn}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button 
            className={styles.controlBtn}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <span className={styles.title}>{title}</span>

          <button 
            className={styles.controlBtn}
            title="Fullscreen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};