import React, { useState, useEffect } from "react";
import "./AppBanner.css";

const AppBanner = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if the popup has been shown in the current session
    const popupShown = getCookie("popupShown");

    // If the popup has not been shown in the current session, show it after a delay
    if (!popupShown) {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isMobileDevice) {
        setTimeout(() => {
          setShowPopup(true);
        }, 2000);
      }
    }
  }, []);

  const openAppOrStore = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      window.location.href = "https://www.all-cures.com/appRedirect";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.location.href = "https://www.all-cures.com/appRedirect";
    }

    // Close the popup
    setShowPopup(false);
    // Set a cookie to indicate that the popup has been shown
    setCookie("popupShown", true, 1); // Set cookie to expire after 1 day
  };

  const closePopup = () => {
    // Close the popup
    setShowPopup(false);
    // Set a cookie to indicate that the popup has been shown
    setCookie("popupShown", true, 1); // Set cookie to expire after 1 day
  };

  // Function to set a cookie
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
  };

  // Function to get a cookie
  const getCookie = (name) => {
    const keyValue = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return keyValue ? true : false;
  };

  return (
    <div>
      {showPopup && (
        <div id="app-bnr" className="app-bnr d-md-none">
          <p style={{ textAlign: "center" }}>
            Download our app for the best experience.
          </p>
          <div className="d-flex justify-content-center">
            <button onClick={openAppOrStore} className="btn btn-secondary mb-2">
              Open in App
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <button onClick={closePopup} className="btn btn-secondary mb-2">
              Stay on the Website
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppBanner;
