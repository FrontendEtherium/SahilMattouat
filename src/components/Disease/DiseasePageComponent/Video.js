import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useTheme, useMediaQuery } from "@mui/material";
import "./Video.css";
const InlineVideoPlayer = ({ videoURL }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [containerWidth, setContainerWidth] = useState(300);
  const [showMessage, setShowMessage] = useState(false);
  const containerRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!isVisible) return null;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Maintain a 16:9 aspect ratio
  const containerHeight = isExpanded
    ? "auto"
    : `${(containerWidth * 9) / 16}px`;

  return (
    <div
      ref={containerRef}
      style={{
        width: isExpanded ? "100%" : "100%",
        height: containerHeight,
        backgroundColor: "#000",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        overflow: "hidden",
        position: "relative",
        margin: "20px auto",
        transition: "width 0.3s ease, height 0.3s ease",
      }}
    >
      {/* Control Icons */}
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          display: "flex",
          gap: "5px",
          zIndex: 10,
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

      {/* Video Wrapper */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <ReactPlayer
          url={videoURL}
          playing
          loop
          controls
          muted={!isExpanded}
          width="100%"
          height="100%"
          onProgress={({ playedSeconds }) => {
            if (playedSeconds >= 5) {
              setShowMessage(true);
            }
          }}
          config={{
            file: {
              attributes: {
                playsInline: true,
                autoPlay: true,
                style: {
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                },
              },
            },
          }}
        />
      </div>

      {/* Message Popup (Appears at 10 seconds) */}
      {showMessage && isExpanded && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 20,
            width: "100%",
          }}
        >
          <p>⚕️ Consult this doctor now!</p>
          <button
            className="buttonVideo"
            onClick={() => alert("Redirecting to consultation page...")}
          >
            <span class="buttonVideo-content">
              {/* <Link to={`/doctor/${regDocPatId}`}>Consult Now</Link> */}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InlineVideoPlayer;
