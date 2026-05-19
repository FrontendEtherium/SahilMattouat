import React from "react";
import { useState, useEffect } from "react";
import { backendHost } from "../../api-config";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Avatar from "@mui/material/Avatar";
import { green } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";

const ResponseRedirect = () => {
  const response = localStorage.getItem("apiResponse");

  const responseObject = JSON.parse(response);

  const [getResponse, setGetResponse] = useState("");
  useEffect(() => {
    fetch(
      `${backendHost}/payment/get/payment-udpates/${responseObject.orderID}`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("res", json);
        setGetResponse(json);
      });
  }, []);

  return (
    <div>
      <Header />
      <div style={{ marginTop: "4rem" }}>
        {!getResponse && (
          <>
            <div className="container d-flex justify-content-center mb-2">
              <h4> Please wait while we complete your Payment...</h4>
            </div>

            <div className="container d-flex justify-content-center mt-2 mb-5">
              <h2> Do not refresh the page...</h2>
            </div>
          </>
        )}
        {
          getResponse && (
            <>
              <div className="container d-flex justify-content-center">
                <div
                  className="card shadow-lg pt-3 m-3"
                  style={{ minHeight: "400px", width: "500px" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-center">
                      <Avatar
                        sx={{ bgcolor: green[800], width: 80, height: 80 }}
                      >
                        <CheckIcon sx={{ width: 56, height: 56 }} />
                      </Avatar>
                    </div>

                    <div
                      className="d-flex justify-content-center"
                      style={{ color: "green" }}
                    >
                      <h2>Success</h2>
                    </div>

                    <div className="mt-4 text-center">
                      <p style={{ fontSize: "22px", textAlign: "center" }}>
                        Your transaction has been completed successfully. Please
                        check your email for appointment details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )

          // <h3>Payment Status:{getResponse}</h3>
        }
      </div>

      <Footer />
    </div>
  );
};

export default ResponseRedirect;
