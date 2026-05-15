import React, { useState } from "react";
import axios from "axios";
import { backendHost } from "../../api-config";

const OtpPaymentStep = ({ bookingData, onBack }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const getAmountValue = () => {
    if (typeof bookingData.amount === "number") {
      return bookingData.amount;
    }

    if (typeof bookingData.amount === "string") {
      return Number(bookingData.amount);
    }

    if (
      typeof bookingData.amount === "object" &&
      bookingData.amount !== null
    ) {
      return Number(
        bookingData.amount.totalFee ||
          bookingData.amount.amount ||
          bookingData.amount.baseFee ||
          0
      );
    }

    return 0;
  };

  const verifyOtpAndPay = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      console.log("VERIFY OTP PAYLOAD:", {
  mobile: Number(bookingData.mobile),
  countryCode: bookingData.countryCode,
  otp: otp,
  firstName: bookingData.firstName,
  lastName: bookingData.lastName,
  acceptTnC: "Yes",
  acceptPolicy: "Yes",
  lockId: bookingData.lockId,
  amount: getAmountValue(),
});

      const response = await axios.post(
        `${backendHost}/auth/verify-otp`,
        {
          mobile: Number(bookingData.mobile),
          countryCode: bookingData.countryCode,
          otp: otp,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          acceptTnC: "Yes",
          acceptPolicy: "Yes",
          lockId: bookingData.lockId,
          amount: getAmountValue(),
        }
      );

      console.log("VERIFY OTP RESPONSE:", response.data);

      const paymentData = response.data?.data?.paymentData;

      if (!paymentData?.encRequest || !paymentData?.accessCode) {
        alert("Payment data not received");
        return;
      }

      localStorage.setItem("encKey", paymentData.encRequest);
      localStorage.setItem(
        "apiResponse",
        JSON.stringify(response.data)
      );

      const redirectURL = `https://www.all-cures.com/paymentRedirection?encRequest=${paymentData.encRequest}&accessCode=${paymentData.accessCode}`;

      window.location.href = redirectURL;
    } catch (error) {
      console.error("OTP verify/payment error:", error);

      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          error.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5>Step 3: Verify OTP</h5>

      <div className="mb-3">
        <label>Enter OTP</label>

        <input
          className="form-control"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
      </div>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back
        </button>

        <button
          className="btn btn-success"
          onClick={verifyOtpAndPay}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Pay"}
        </button>
      </div>
    </div>
  );
};

export default OtpPaymentStep;
