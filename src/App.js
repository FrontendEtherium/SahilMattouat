import React, { useEffect } from "react";
import Main from "./components/MainComponent";
import CookieConsent from "react-cookie-consent";
import AppBanner from "./components/LandingPage/AppBanner";
import { Link } from "react-router-dom";
import "./cookie.css";
import clarity from "@microsoft/clarity";
const App = () => {
  useEffect(() => {
    clarity.init("q9o6f2uidb");
  }, []);
  return (
    <div>
      <Main />
      <div>
        <CookieConsent
          style={{
            background: "#022a3c",
            width: "80%",

            borderRadius: "10px",

            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1000",
            textAlign: "center",
            maxWidth: "80%", // For better responsiveness
          }}
          buttonStyle={{
            background: "#4585FF",
            color: "white",

            fontSize: "12px",
            borderRadius: "5px",

            border: "none",
            alignItem: "center",
          }}
          buttonText="Accept"
          contentClasses="myclass"
          buttonWrapperClasses="buttonClass"
        >
          <div
            className="cookie-consent-text"
            style={{
              color: "#fff",
              margin: "0",
              maxWidth: "100%",
            }}
          >
            We use cookies to ensure you have the best browsing experience on
            our website. By using our site, you acknowledge that you have read
            and understood our{" "}
            <a className="text-underline text-white" href="/">
              Cookie Policy
            </a>{" "}
            &{" "}
            <a
              className="text-underline text-white"
              href="/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
            .
          </div>
        </CookieConsent>
      </div>

      <AppBanner />
    </div>
  );
};

export default App;
