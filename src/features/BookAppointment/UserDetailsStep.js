import React, { useState } from "react";
import axios from "axios";
import { backendHost } from "../../api-config";

const UserDetailsStep = ({
  docId,
  bookingData,
  setBookingData,
  onBack,
  onNext,
}) => {
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (
      !bookingData.firstName ||
      !bookingData.lastName ||
      !bookingData.mobile
    ) {
      alert("Please enter first name, last name and mobile number");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendHost}/slots/lock-and-send-otp`,
        {
          doctorId: docId,
          appointmentDateTime: bookingData.appointmentDateTime,
          countryCode: bookingData.countryCode,
          mobile: Number(bookingData.mobile),
        }
      );

      console.log("LOCK OTP RESPONSE:", response.data);

      const lockId = response.data?.data?.lockId;

      if (!lockId) {
        alert("Lock ID not received from backend");
        return;
      }

      setBookingData({
        ...bookingData,
        lockId,
      });

      onNext();
    } catch (error) {
      console.error("Lock slot OTP error:", error);

      const errorMessage =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message ||
        "Failed to send OTP";

      // SLOT UNAVAILABLE HANDLE
      if (
        errorMessage.toLowerCase().includes("slot unavailable")
      ) {
        alert(
          "This slot is no longer available. Please select another slot."
        );

        onBack();
        return;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5>Step 2: Enter Details</h5>

      <div className="mb-3">
        <label>First Name</label>

        <input
          className="form-control"
          value={bookingData.firstName}
          onChange={(e) =>
            setBookingData({
              ...bookingData,
              firstName: e.target.value,
            })
          }
        />
      </div>

      <div className="mb-3">
        <label>Last Name</label>

        <input
          className="form-control"
          value={bookingData.lastName}
          onChange={(e) =>
            setBookingData({
              ...bookingData,
              lastName: e.target.value,
            })
          }
        />
      </div>

      <div className="mb-3">
        <label>Mobile Number</label>

        <input
          className="form-control"
          value={bookingData.mobile}
          onChange={(e) =>
            setBookingData({
              ...bookingData,
              mobile: e.target.value,
            })
          }
          placeholder="9876543211"
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
          className="btn btn-primary"
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default UserDetailsStep;
