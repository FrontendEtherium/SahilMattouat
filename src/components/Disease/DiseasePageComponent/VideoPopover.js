import React, { useState } from "react";
import ReactPlayer from "react-player";

// Import Material-UI icons
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

const VideoPopover = ({ videoURL }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        // Adjust width and height for a portrait aspect ratio (e.g., 9:16)
        width: isExpanded ? "200px" : "150px",
        height: isExpanded ? "355px" : "265px",
        backgroundColor: "#000",
        zIndex: 10000,
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        overflow: "hidden",
        transition: "width 0.3s ease, height 0.3s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          display: "flex",
          gap: "5px",
          zIndex: 10001,
        }}
      >
        <button
          onClick={toggleExpand}
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            padding: "4px",
            cursor: "pointer",
          }}
        >
          {isExpanded ? (
            <FullscreenExitIcon style={{ fontSize: "20px" }} />
          ) : (
            <FullscreenIcon style={{ fontSize: "20px" }} />
          )}
        </button>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            padding: "4px",
            cursor: "pointer",
          }}
        >
          <CloseIcon style={{ fontSize: "20px" }} />
        </button>
      </div>
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <ReactPlayer
          url={videoURL}
          playing
          loop
          controls
          // Video will start muted when not expanded and unmuted when expanded
          muted={!isExpanded}
          width="100%"
          height="100%"
          config={{
            file: {
              attributes: {
                playsInline: true,
                autoPlay: true,
                style: {
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default VideoPopover;
