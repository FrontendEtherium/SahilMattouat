import React, { useState, memo, useRef } from "react";
import ReactPlayer from "react-player";
import "./ExpertAdviceComponent.css";

const videos = [
  "https://www.youtube.com/shorts/Hjh_tGBtL1U",
  "https://www.youtube.com/shorts/YA-UDrEFVec",
  "https://www.youtube.com/shorts/N5i20fg_fFU",
  "https://www.youtube.com/shorts/lhkehJDzVvo",
  "https://www.youtube.com/shorts/Q4oOfCo5nT8",
  
];

// Memoize the video player component to prevent unnecessary re-renders
const VideoPlayer = memo(
  ({ url, onReady, isPlaying, onPlay, onPause, playerRef }) => (
    <ReactPlayer
      ref={playerRef}
      url={url}
      muted
      loop={false}
      controls
      width="100%"
      height="100%"
      onReady={onReady}
      playing={isPlaying}
      onPlay={onPlay}
      onPause={onPause}
      config={{
        youtube: {
          playerVars: {
            controls: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 0,
            origin: window.location.origin,
            iv_load_policy: 3,
            fs: 1,
            playsinline: 1,
          },
        },
      }}
      loading="lazy"
    />
  )
);

export default function ExpertAdviceComponent() {
  const [loadedVideos, setLoadedVideos] = useState({});
  const [playingIndex, setPlayingIndex] = useState(null);
  const playersRef = useRef({});

  const handleVideoLoad = (index) => {
    setLoadedVideos((prev) => ({ ...prev, [index]: true }));
  };

  const handlePlay = (index) => {
    // Reset previous video's timer if there was one playing
    if (
      playingIndex !== null &&
      playingIndex !== index &&
      playersRef.current[playingIndex]
    ) {
      playersRef.current[playingIndex].seekTo(0);
    }
    setPlayingIndex(index);
  };

  const handlePause = (index) => {
    if (playingIndex === index) {
      setPlayingIndex(null);
    }
  };

  return (
    <section
      className="expert-advice container"
      aria-label="Expert Advice Videos"
    >
      <h2 className="landing-page__title">Expert Advice in 60 Seconds</h2>
      <div className="expert-advice__scroll">
        {videos.map((url, idx) => (
          <div key={idx} className="expert-advice__item">
            <div className="expert-advice__wrapper">
              {!loadedVideos[idx] && (
                <div className="expert-advice__loading">
                  <div className="expert-advice__loading-spinner"></div>
                </div>
              )}
              <VideoPlayer
                url={url}
                onReady={() => handleVideoLoad(idx)}
                isPlaying={playingIndex === idx}
                onPlay={() => handlePlay(idx)}
                onPause={() => handlePause(idx)}
                playerRef={(player) => (playersRef.current[idx] = player)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
