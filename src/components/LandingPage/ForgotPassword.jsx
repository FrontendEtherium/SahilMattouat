import React, { useState } from "react";
import axios from "axios";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import { TextField, Button } from "@material-ui/core";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";

import { backendHost } from "../../api-config";
import SendIcon from "@material-ui/icons/Send";
import { Link } from "react-router-dom";
import { usePasswordValidation } from "../hooks/usePasswordValidation";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [
    validLength,
    hasNumber,
    upperCase,
    lowerCase,
    match,
    specialCharFromHook,
  ] = usePasswordValidation({
    firstPassword: newPassword,
    secondPassword: confirmPassword,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ==================================
  // SEND OTP
  // ==================================

  const sendOtp = async () => {
    try {
      setError("");

      if (!mobile) {
        setError("Please enter mobile number");
        return;
      }

      if (!isValidPhoneNumber(mobile)) {
        setError("Please enter a valid mobile number");
        return;
      }

      const parsedPhone = parsePhoneNumber(mobile);

      const response = await axios.post(`${backendHost}/auth/send-otp`, null, {
        params: {
          mobile: parsedPhone.nationalNumber,
          countryCode: "+" + parsedPhone.countryCallingCode,
          purpose: "FORGOT_PASSWORD",
        },
      });

      if (response.data.success) {
        setOtpSent(true);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to send OTP");
    }
  };

  // ==================================
  // VERIFY OTP
  // ==================================

  const verifyOtp = async () => {
    try {
      setError("");

      if (!otp) {
        setError("Please enter OTP");
        return;
      }

      const parsedPhone = parsePhoneNumber(mobile);

      const response = await axios.post(`${backendHost}/auth/verify-otp`, {
        mobile: parsedPhone.nationalNumber,
        countryCode: "+" + parsedPhone.countryCallingCode,
        otp,
        purpose: "FORGOT_PASSWORD",
      });

      if (response.data.success) {
        setOtpVerified(true);
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "OTP verification failed");
    }
  };

  // ==================================
  // RESET PASSWORD
  // ==================================

  const resetPassword = async () => {
    try {
      setError("");

      if (!validLength || !upperCase || !lowerCase || !specialCharFromHook) {
        setError(
          "Password must be at least 8 characters and contain uppercase, lowercase, and special characters",
        );
        return;
      }
      if (!match) {
        setError("Passwords do not match");
        return;
      }

      const parsedPhone = parsePhoneNumber(mobile);

      const response = await axios.post(`${backendHost}/auth/reset-password`, {
        mobile: parsedPhone.nationalNumber,
        countryCode: "+" + parsedPhone.countryCallingCode,
        password: newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to reset password");
    }
  };

  // ==================================
  // SUCCESS SCREEN
  // ==================================

  if (success) {
    return (
      <>
        <Header />

        <div className="forgot-page">
          <div className="forgot-container">
            <div className="forgot-card success-screen">
              <div className="success-icon">✓</div>

              <h2 className="success-title">Password Reset Successful</h2>

              <p className="success-text">
                Your password has been updated successfully.
              </p>

              <div className="back-login">
                <Link to="/?openLogin=true">Go To Login</Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ==================================
  // MAIN SCREEN
  // ==================================

  return (
    <>
      <Header />

      <div className="forgot-page">
        <div className="forgot-container">
          <div className="forgot-card">
            <h1 className="forgot-title">Reset Password</h1>

            <p className="forgot-subtitle">
              Recover access to your account using your WhatsApp registered
              mobile number.
            </p>

            {error && <div className="forgot-error">{error}</div>}

            {/* MOBILE NUMBER */}

            <label className="forgot-label">Mobile Number</label>

            <div className="phone-wrapper">
              <PhoneInput
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={setMobile}
                defaultCountry="IN"
                disabled={otpSent}
              />
            </div>

            {!otpSent && (
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                className="forgot-btn"
                onClick={sendOtp}
              >
                Send Verification Code
              </Button>
            )}

            {/* OTP SECTION */}

            {otpSent && !otpVerified && (
              <>
                <label className="forgot-label">OTP Verification</label>

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="forgot-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <Button
                  variant="contained"
                  className="forgot-btn"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </Button>

                <div className="back-login">
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      sendOtp();
                    }}
                  >
                    Resend OTP
                  </Link>
                </div>
              </>
            )}

            {/* PASSWORD SECTION */}

            {otpVerified && (
              <>
                <div className="forgot-verified">✓ Mobile Number Verified</div>

                <label className="forgot-label">New Password</label>

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="password"
                  className="forgot-input"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                />

                <label className="forgot-label">Confirm Password</label>

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="password"
                  className="forgot-input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                />

                <div className="forgot-password-hint">
                  Password must contain 8+ characters, uppercase, lowercase, and
                  a special character.✅
                </div>

                <Button
                  variant="contained"
                  className="forgot-btn"
                  onClick={resetPassword}
                >
                  Reset Password
                </Button>
              </>
            )}

            <div className="back-login">
              <Link to="/?openLogin=true">← Back to Login</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
