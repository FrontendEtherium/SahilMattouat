import React, { useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const AppRedirect = () => {
  const openAppOrStore = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      // Redirect to Play Store if the app didn't open in a reasonable time
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.etherium.allcures&hl=en&gl=US";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // Redirect to App Store if the app didn't open in a reasonable time
      window.location.href =
        "https://apps.apple.com/in/app/all-cures/id6748640097";
    }
  };

  useEffect(() => {
    console.log("i am available");

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      // Redirect to Play Store if the app didn't open in a reasonable time
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.etherium.allcures&hl=en&gl=US";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // Redirect to App Store if the app didn't open in a reasonable time
      window.location.href =
        "https://apps.apple.com/in/app/all-cures/id6748640097";
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="container mt-5 mb-5" style={{ height: "100px" }}>
        <div className=" d-flex justify-content-center mt-5">
          {" "}
          <button onClick={openAppOrStore} className=" btn btn-secondary mb-2">
            Open in App
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppRedirect;
