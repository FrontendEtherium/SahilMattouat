import React, { useState, useEffect } from "react";
import { backendHost } from "../../api-config";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import Avatar from "@mui/material/Avatar";

import { green, red } from "@mui/material/colors";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const DirectResponseRedirect = () => {
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const orderId = params.get("orderId");

    if (!orderId) {
      console.log("Order ID missing");
      return;
    }

    const interval = setInterval(() => {
      fetch(`${backendHost}/payment/get/payment-udpates/${orderId}`)
        .then(async (res) => {
          const text = await res.text();

          console.log("Raw Response:", text);

          if (!text || text.trim() === "") {
            return null;
          }

          return JSON.parse(text);
        })
        .then((data) => {
          console.log("Parsed Data:", data);

        if (data === "Success") {
            setPaymentStatus("Success");

            clearInterval(interval);
          } else if (data === "Failed") {
            setPaymentStatus("Failed");

            clearInterval(interval);
          }
        })
        .catch((err) => {
          console.log("Fetch Error:", err);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />

      <div style={{ marginTop: "4rem" }}>
        {/* Loading */}
        {!paymentStatus && (
          <>
            <div className="container d-flex justify-content-center mb-2">
              <h4>Please wait while we complete your Payment...</h4>
            </div>

            <div className="container d-flex justify-content-center mt-2 mb-5">
              <h2>Do not refresh the page...</h2>
            </div>
          </>
        )}

        {/* Success */}
        {paymentStatus === "Success" && (
          <div className="container d-flex justify-content-center">
            <div
              className="card shadow-lg pt-3 m-3"
              style={{
                minHeight: "400px",
                width: "500px",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-center">
                  <Avatar
                    sx={{
                      bgcolor: green[800],
                      width: 80,
                      height: 80,
                    }}
                  >
                    <CheckIcon
                      sx={{
                        width: 56,
                        height: 56,
                      }}
                    />
                  </Avatar>
                </div>

                <div
                  className="d-flex justify-content-center"
                  style={{ color: "green" }}
                >
                  <h2>Success</h2>
                </div>

                <div className="mt-4 text-center">
                  <p
                    style={{
                      fontSize: "22px",
                      textAlign: "center",
                    }}
                  >
                    Your payment has been completed successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Failed */}
        {paymentStatus === "Failed" && (
          <div className="container d-flex justify-content-center">
            <div
              className="card shadow-lg pt-3 m-3"
              style={{
                minHeight: "400px",
                width: "500px",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-center">
                  <Avatar
                    sx={{
                      bgcolor: red[700],
                      width: 80,
                      height: 80,
                    }}
                  >
                    <CloseIcon
                      sx={{
                        width: 56,
                        height: 56,
                      }}
                    />
                  </Avatar>
                </div>

                <div
                  className="d-flex justify-content-center"
                  style={{ color: "red" }}
                >
                  <h2>Payment Failed</h2>
                </div>

                <div className="mt-4 text-center">
                  <p
                    style={{
                      fontSize: "22px",
                      textAlign: "center",
                    }}
                  >
                    Your payment could not be completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DirectResponseRedirect;
