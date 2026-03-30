import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "./ScrollableButton.css";

function ScrollableButton({ linkTo, children }) {
  const history = useHistory();
  const buttonRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  const [buttonInitialTop, setButtonInitialTop] = useState(null);
  const scrollTimeoutRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Set the button's initial position on mount
  useEffect(() => {
    const setInitialPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const buttonTop = rect.top + scrollTop;
        setButtonInitialTop(buttonTop);
      }
    };

    setTimeout(setInitialPosition, 100);
    window.addEventListener("resize", setInitialPosition);

    return () => window.removeEventListener("resize", setInitialPosition);
  }, []);

  // Handle scroll event
  useEffect(() => {
    if (buttonInitialTop === null) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollOffset = scrollTop - buttonInitialTop;
      const viewportHeight = window.innerHeight;

      // Mark that user is scrolling
      setIsScrolling(true);

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // While scrolling: button follows the scroll
      if (scrollOffset > 0) {
        setTranslateY(scrollOffset);
      } else {
        setTranslateY(0);
      }

      // Set timeout for when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        
        // When scroll stops: position button in middle of viewport
        if (scrollOffset > 0) {
          // Calculate middle of screen position
          const middleOffset = scrollOffset + (viewportHeight / 2) - 70;
          setTranslateY(middleOffset);
        } else {
          // At top: button stays at original position
          setTranslateY(0);
        }
      }, 150); // 150ms delay after scroll stops
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [buttonInitialTop]);

  const handleConsultClick = () => {
    history.push(linkTo || "/doctor-connect");
  };

  return (
    <button
      ref={buttonRef}
      className="scrollable-button__button"
      onClick={handleConsultClick}
      style={{
        transform: `translateY(${translateY}px)`,
      }}
    >
      {children || "Consult Now"}
    </button>
  );
}

export default ScrollableButton;
