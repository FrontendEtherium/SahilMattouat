import React, { useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const DirectResponsePage = () => {
  useEffect(() => {
    const sendMessageAndRedirect = async () => {
      try {
        if (
          window.ReactNativeWebView &&
          typeof window.ReactNativeWebView.postMessage === "function"
        ) {
          await window.ReactNativeWebView.postMessage(
            "Direct Payment Successful",
          );
        } else {
          console.warn("ReactNativeWebView is not available");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        // orderId already comes in URL
        const params = new URLSearchParams(window.location.search);

        const orderId = params.get("orderId");

        window.location.href = `https://www.all-cures.com/directStatusPayment?orderId=${orderId}`;
      }
    };

    sendMessageAndRedirect();
  }, []);

  return (
    <>
      <Header />

      <div></div>

      <Footer />
    </>
  );
};

export default DirectResponsePage;
