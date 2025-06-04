import React, { useState, memo } from "react";
import ReactPlayer from "react-player";
import "./ExpertAdviceComponent.css";

const videos = [
  "https://www.youtube.com/shorts/Hjh_tGBtL1U",
  "https://www.youtube.com/shorts/YA-UDrEFVec",
  "https://www.youtube.com/shorts/N5i20fg_fFU",
];

// Memoize the video player component to prevent unnecessary re-renders
const VideoPlayer = memo(({ url, onReady }) => (
  <ReactPlayer
    url={url}
    muted
    loop={false}
    controls
    width="100%"
    height="100%"
    onReady={onReady}
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
));

export default function ExpertAdviceComponent() {
  const [loadedVideos, setLoadedVideos] = useState({});

  const handleVideoLoad = (index) => {
    setLoadedVideos((prev) => ({ ...prev, [index]: true }));
  };
  console.log("Video initialised");
  

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
              <VideoPlayer url={url} onReady={() => handleVideoLoad(idx)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
