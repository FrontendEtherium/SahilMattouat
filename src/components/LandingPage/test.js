import React, { useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import { usePasswordValidation } from "../hooks/usePasswordValidation";
import { backendHost } from "../../api-config";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";

import "react-phone-number-input/style.css";
import "./test.css";
import ErrorBoundary from "../ErrorBoundary";

const Test = (props) => {
  const [click, setClick] = useState(true);

  const [hasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Tabs
  const [loginMode, setLoginMode] = useState("email");
  const [signupMode, setSignupMode] = useState("email");
  const [mobileSignupType, setMobileSignupType] = useState("otp");

  // Email login
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState("off");
  const [signInpassword, setPass] = useState("");
  
  

  // Mobile login
  const [loginPhoneNumber, setLoginPhoneNumber] = useState("");
  const [loginMobilePassword, setLoginMobilePassword] = useState("");

  // Email signup
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [password, setPassword] = useState({
    firstPassword: "",
    secondPassword: "",
  });
  const [userType, setUserType] = useState("other");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validEmail, setValidEmail] = useState();
  const [phoneError, setPhoneError] = useState(false);

  // Mobile OTP signup
  const [mobileFirstName, setMobileFirstName] = useState("");
  const [mobileLastName, setMobileLastName] = useState("");
  const [signupPhoneNumber, setSignupPhoneNumber] = useState("");
  const [signupMobilePassword, setSignupMobilePassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [validLength, upperCase, lowerCase, match] = usePasswordValidation({
    firstPassword: password.firstPassword,
    secondPassword: password.secondPassword,
  });

  const showError = (message) => {
    setErrorMsg(message);
    setAlertMsg("");
  };

  const showSuccess = (message) => {
    setAlertMsg(message);
    setErrorMsg("");
  };

  const setFirst = (event) => {
    setPassword({ ...password, firstPassword: event.target.value });
  };

  const setSecond = (event) => {
    setPassword({ ...password, secondPassword: event.target.value });
  };

  const handleEmail = (e) => {
    const value = e.target.value;
    var re = /^[a-zA-Z-0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (!re.test(value)) {
      setValidEmail(false);
    } else {
      setEmail(value);
      setValidEmail(true);
    }
  };

  const handleClick = (isSignIn) => {
    setClick(isSignIn);
    setErrorMsg("");
    setAlertMsg("");

    const container = document.getElementById("container");
    if (!container) return;

    if (isSignIn) {
      container.classList.remove("right-panel-active");
    } else {
      container.classList.add("right-panel-active");
    }
  };

  const getPhonePayload = (value) => {
    const parsedPhone = parsePhoneNumber(value || "");

    return {
      mobile: parsedPhone.nationalNumber,
      countryCode: `+${parsedPhone.countryCallingCode}`,
    };
  };

  // EMAIL SIGNUP
  const SignUpForm = async (e) => {
    e.preventDefault();

    if (signupMode !== "email") return;

    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      setPhoneError(true);
      showError("Please enter a valid phone number");
      return;
    }

    setPhoneError(false);

    if (!validEmail || !validLength || !upperCase || !lowerCase || !match) {
      showError("Please check email and password rules");
      return;
    }

    setLoading(true);
    axios.defaults.withCredentials = true;

    let countryCode = "";
    let nationalNumber = "";

    if (phoneNumber) {
      const parsedPhone = parsePhoneNumber(phoneNumber);
      countryCode = parsedPhone.country;
      nationalNumber = parsedPhone.nationalNumber;
    }

    const params = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      psw: password.firstPassword,
      "psw-repeat": password.secondPassword,
      rempwd: "1",
      doc_patient: userType,
      acceptTnc: "1",
      number: nationalNumber,
      country_code: countryCode,
      Age: null,
    };

    axios
      .post(`${backendHost}/registration/add/new`, params, {
        headers: { "Access-Control-Allow-Credentials": true },
      })
      .then((response) => {
        console.log("Signup Response:", response.data);

        if (response.data === "Email Address already Exists in the System") {
          showError("Email already exists");
          setLoading(false);
          return;
        }

        if (response.data.registration_id) {
          showSuccess("Registered successfully");

          Cookies.set("uName", response.data.first_name, { expires: 365 });

          if (response.data.docID) {
            localStorage.setItem("doctorid", response.data.docID);
          }

          if (response.data.value) {
            localStorage.setItem("token", response.data.value);
          }

          setTimeout(() => {
  axios.defaults.withCredentials = true;

  axios
    .post(
      `${backendHost}/login`,
      null,
      {
        params: {
          cmd: "login",
          email: email,
          psw: password.firstPassword,
          rempwd: 1,
        },
        withCredentials: true,
      }
    )
    .then((loginResponse) => {
      console.log("Auto-login Response:", loginResponse.data);

      if (loginResponse.data && loginResponse.data.value) {

        Cookies.set("uName", loginResponse.data.first_name, {
          expires: 365,
        });

        if (loginResponse.data.docID) {
          localStorage.setItem(
            "doctorid",
            loginResponse.data.docID
          );
        }

        if (loginResponse.data.value) {
          localStorage.setItem(
            "token",
            loginResponse.data.value
          );
        }

        localStorage.setItem(
          "registration_id",
          loginResponse.data.registration_id
        );
        localStorage.setItem(
  "userId",
  loginResponse.data.registration_id
);

localStorage.setItem(
  "user_id",
  loginResponse.data.registration_id
);

Cookies.set(
  "registration_id",
  loginResponse.data.registration_id,
  {
    expires: 365,
  }
);

Cookies.set(
  "userId",
  loginResponse.data.registration_id,
  {
    expires: 365,
  }
);
        localStorage.setItem("isLoggedIn", "true");

        if (props.onHide) {
          props.onHide();
        }

        setTimeout(() => {
          if (props.path) {
            window.location = props.path;
          } else {
            window.location.href = "/";
          }
        }, 500);

      } else {
        showError("Signup successful but auto-login failed");
        setLoading(false);
      }
    })
    .catch((loginError) => {

      console.error(
        "Auto-login error after signup:",
        loginError.response?.data || loginError.message
      );

      showError("Signup successful but auto-login failed");
      setLoading(false);

    });

}, 1000);
        } else {
          showError("Registration failed");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Email signup error:", err.response?.data || err.message);
        showError("Some error occurred");
        setLoading(false);
      });
  };

  // EMAIL LOGIN
const loginForm = async (e) => {
  e.preventDefault();

  setLoading(true);
  axios.defaults.withCredentials = true;

  axios.post(
    `${backendHost}/login?cmd=login&email=${email}&psw=${signInpassword}&rempwd=${rememberMe}`
  )
    .then((response) => {
      console.log("Login Response:", response.data);

      if (response.data && response.data.first_name) {
        console.log("Login successful:", response.data);

        Cookies.set("uName", response.data.first_name, {
          expires: 365,
        });

        localStorage.setItem(
          "doctorid",
          response.data.docID
        );

        localStorage.setItem(
          "token",
          response.data.value
        );
        localStorage.setItem("isLoggedIn", "true");

        setTimeout(() => {
          if (props.onHide) {
            props.onHide();
          }
          
          if (props.path) {
            window.location = props.path;
          } else {
            window.location.reload();
          }
        }, 500);
      } else {
        showError("Incorrect email or password");
        setLoading(false);
      }
    })
    .catch((err) => {
      console.log("Email login error:", err.response?.data);
      showError("Incorrect email or password");
      setLoading(false);
    });
};

  // MOBILE SIGNUP - SEND OTP
  const sendOtp = async () => {
    if (!mobileFirstName || !mobileLastName || !signupPhoneNumber) {
  showError("Please fill name and mobile number");
  return;
}

if (mobileSignupType === "password" && !signupMobilePassword) {
  showError("Please enter password");
  return;
}
    try {
      setLoading(true);

      const { mobile, countryCode } = getPhonePayload(signupPhoneNumber);

      const response = await axios.post(
        `${backendHost}/auth/send-otp?mobile=${mobile}&countryCode=${encodeURIComponent(
          countryCode
        )}`
      );

      if (response.data.success) {
        setOtpSent(true);
        showSuccess("OTP sent successfully");
      } else {
        showError(response.data.message || "OTP send failed");
      }
    } catch (error) {
      console.log("Send OTP error:", error);
      showError("OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  // MOBILE SIGNUP - VERIFY OTP + REGISTER + LOGIN
 const verifyOtp = async () => {
  if (!otp) {
    showError("Please enter OTP");
    return;
  }

  try {
    setLoading(true);

    const { mobile, countryCode } = getPhonePayload(signupPhoneNumber);

    const verifyPayload = {
      mobile: String(mobile).replace(/\s/g, ""),
      countryCode: countryCode,
      otp: String(otp).trim(),
      firstName: mobileFirstName,
      lastName: mobileLastName,
      acceptTnC: "Yes",
      acceptPolicy: "Yes",
    };

    const verifyResponse = await axios.post(
      `${backendHost}/auth/verify-otp`,
      verifyPayload
    );

    if (!verifyResponse.data.success) {
      showError(verifyResponse.data.message || "OTP verification failed");
      return;
    }

    const userData = verifyResponse.data.data;

    if (userData?.value) {
  localStorage.setItem("token", userData.value);
}

if (userData?.docID) {
  localStorage.setItem("doctorid", userData.docID);
}

Cookies.set(
  "registration_id",
  userData.registration_id,
  { expires: 365 }
);

Cookies.set(
  "userId",
  userData.registration_id,
  { expires: 365 }
);

    if (userData?.registration_id) {
      localStorage.setItem("registration_id", userData.registration_id);
      localStorage.setItem("userId", userData.registration_id);
      localStorage.setItem("user_id", userData.registration_id);
    }

    if (userData?.first_name) {
      Cookies.set("uName", userData.first_name, { expires: 365 });
    }

    localStorage.setItem("isLoggedIn", "true");

    showSuccess("OTP signup successful");

    setTimeout(() => {
      if (props.path) {
        window.location = props.path;
      } else {
        window.location.reload();
      }
    }, 700);
  } catch (error) {
    showError(error.response?.data?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};

const handleMobilePasswordSignup = async () => {
  if (
    !mobileFirstName ||
    !mobileLastName ||
    !signupPhoneNumber ||
    !signupMobilePassword
  ) {
    showError("Please fill all password signup fields");
    return;
  }

  try {
    setLoading(true);

    const { mobile, countryCode } =
      getPhonePayload(signupPhoneNumber);

    const registerPayload = {
      mobile: String(mobile).replace(/\s/g, ""),
      countryCode: countryCode,
      password: signupMobilePassword,
      firstName: mobileFirstName,
      lastName: mobileLastName,
      acceptTnC: "Yes",
      acceptPolicy: "Yes",
    };

    const registerResponse = await axios.post(
      `${backendHost}/auth/register-mobile`,
      registerPayload
    );

    console.log(
      "Password Signup Response:",
      registerResponse.data
    );

    if (registerResponse.data.success) {
      const loginPayload = {
  mobile: String(mobile).replace(/\s/g, ""),
  countryCode: countryCode,
  password: signupMobilePassword,
};

const loginResponse = await axios.post(
  `${backendHost}/auth/login-mobile`,
  loginPayload
);

const loginData = loginResponse.data.data;

if (loginData?.value) {
  localStorage.setItem("token", loginData.value);
}

if (loginData?.registration_id) {
  localStorage.setItem(
    "registration_id",
    loginData.registration_id
  );

  localStorage.setItem(
    "userId",
    loginData.registration_id
  );

  localStorage.setItem(
    "user_id",
    loginData.registration_id
  );

  Cookies.set(
    "registration_id",
    loginData.registration_id,
    { expires: 365 }
  );

  Cookies.set(
    "userId",
    loginData.registration_id,
    { expires: 365 }
  );
}

if (loginData?.first_name) {
  Cookies.set("uName", loginData.first_name, {
    expires: 365,
  });
}

localStorage.setItem("isLoggedIn", "true");

setTimeout(() => {
  window.location.reload();
}, 500);
      showSuccess(
  "Account created successfully. Logging you in..."
);
    } else {
      showError(
        registerResponse.data.message ||
          "Mobile registration failed"
      );
    }
  } catch (error) {
    showError(
      error.response?.data?.message ||
        "Mobile registration failed"
    );
  } finally {
    setLoading(false);
  }
};

return (
    <>
      {hasError && <ErrorBoundary />}

      {!hasError && (
        <div className="sign">
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="auth-modal-dialog"
          >
            <Modal.Body className="auth-modal-body">
              <div className="container sign auth-container" id="container">
                {/* SIGN UP */}
                <div className="form-container sign-up-container">
                  <form className="sign auth-form" onSubmit={SignUpForm}>
                    <div className="h2 py-0 my-1 auth-title">
                      Create Account
                    </div>

                    <div className="auth-tabs">
                      <button
                        type="button"
                        className={signupMode === "email" ? "active" : ""}
                        onClick={() => {
                          setSignupMode("email");
                          setErrorMsg("");
                          setAlertMsg("");
                        }}
                      >
                        Email
                      </button>

                      <button
                        type="button"
                        className={signupMode === "mobile" ? "active" : ""}
                        onClick={() => {
                          setSignupMode("mobile");
                          setErrorMsg("");
                          setAlertMsg("");
                        }}
                      >
                        Mobile OTP
                      </button>
                    </div>

                    {errorMsg && !click && (
                      <div className="alert alert-danger auth-alert">
                        {errorMsg}
                      </div>
                    )}

                    {alertMsg && !click && (
                      <Alert variant="success" className="auth-alert">
                        {alertMsg}
                      </Alert>
                    )}

                    {signupMode === "email" && (
                      <>
                        <span className="auth-subtitle">
                          or use your email for registration
                        </span>

                        <input
                          className="px-2 py-1 rounded border-dark border auth-input"
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFname(e.target.value)}
                          required
                        />

                        <input
                          className="px-2 py-1 rounded border-dark border auth-input"
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLname(e.target.value)}
                          required
                        />

                        <input
                          className="px-2 py-1 rounded border-dark border auth-input"
                          type="email"
                          placeholder="Email"
                          onChange={(e) => handleEmail(e)}
                          required
                        />

                        <div className="phone-input-container auth-phone">
                          <PhoneInput
                            placeholder="Mobile Number"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            defaultCountry="IN"
                          />
                        </div>

                        {phoneError && (
                          <div className="auth-small-error">
                            Please enter a valid phone number
                          </div>
                        )}

                        <input
                          className="px-2 py-1 rounded border-dark border auth-input"
                          type="password"
                          placeholder="Password"
                          value={password.firstPassword}
                          onChange={setFirst}
                          required
                        />

                        <input
                          className="px-2 py-1 rounded border-dark border auth-input"
                          type="password"
                          placeholder="Confirm Password"
                          value={password.secondPassword}
                          onChange={setSecond}
                          autoComplete="off"
                          required
                        />

                        <FormControl className="auth-user-type">
                          <InputLabel id="demo-simple-select-label">
                            User Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                          >
                            <MenuItem value="doctor">Doctor</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>

                        <button
                          type="submit"
                          className="ghost auth-btn"
                          disabled={loading}
                        >
                          {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                      </>
                    )}

                    {signupMode === "mobile" && (
                      <>
                        <span className="auth-subtitle">
                          Register with mobile OTP
                        </span>
                        <div className="auth-tabs">
  <button
    type="button"
    className={mobileSignupType === "otp" ? "active" : ""}
    onClick={() => {
      setMobileSignupType("otp");
      setOtpSent(false);
      setErrorMsg("");
      setAlertMsg("");
    }}
  >
    OTP Signup
  </button>

  <button
    type="button"
    className={mobileSignupType === "password" ? "active" : ""}
    onClick={() => {
      setMobileSignupType("password");
      setOtpSent(false);
      setErrorMsg("");
      setAlertMsg("");
    }}
  >
    Password Signup
  </button>
</div>

                        <input
                          className="px-2 py-1 rounded border-dark border auth-input"
                          type="text"
                          placeholder="First Name"
                          value={mobileFirstName}
                          onChange={(e) => setMobileFirstName(e.target.value)}
                        />

                        <input
                          className="px-2 py-1 rounded border-dark border auth-input"
                          type="text"
                          placeholder="Last Name"
                          value={mobileLastName}
                          onChange={(e) => setMobileLastName(e.target.value)}
                        />

                        <div className="phone-input-container auth-phone">
                          <PhoneInput
                            placeholder="Mobile Number"
                            value={signupPhoneNumber}
                            onChange={setSignupPhoneNumber}
                            defaultCountry="IN"
                          />
                        </div>

                        {mobileSignupType === "password" && (
                        <input
                        className="px-2 py-1 rounded border-dark border auth-input"
                        type="password"
                        placeholder="Create Password"
                        value={signupMobilePassword}
                        onChange={(e) => setSignupMobilePassword(e.target.value)}
                        />
                        )}

                        {mobileSignupType === "otp" && !otpSent && (
  <button
    type="button"
    className="ghost auth-btn"
    onClick={sendOtp}
    disabled={loading}
  >
    {loading ? "Sending..." : "Send OTP"}
  </button>
)}

{mobileSignupType === "otp" && otpSent && (
  <>
    <input
      className="px-2 py-1 rounded border-dark border auth-input"
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />

    <button
      type="button"
      className="ghost auth-btn"
      onClick={verifyOtp}
      disabled={loading}
    >
      {loading ? "Verifying..." : "Verify OTP"}
    </button>

    <button
      type="button"
      className="auth-link-btn"
      onClick={sendOtp}
      disabled={loading}
    >
      Resend OTP
    </button>
  </>
)}

{mobileSignupType === "password" && (
  <button
    type="button"
    className="ghost auth-btn"
    onClick={handleMobilePasswordSignup}
    disabled={loading}
  >
    {loading ? "Creating..." : "Create Account"}
  </button>
)}
                      </>
                    )}
                  </form>
                </div>

                {/* SIGN IN */}
                <div className="form-container sign-in-container">
                  <form
                    className="sign auth-form"
                    onSubmit={loginForm}
                  >
                    <h1 id="headSign" className="auth-title">
                      Sign In
                    </h1>

                    <div className="auth-tabs">
                      <button
                        type="button"
                        className={loginMode === "email" ? "active" : ""}
                        onClick={() => {
                          setLoginMode("email");
                          setErrorMsg("");
                          setAlertMsg("");
                        }}
                      >
                        Email
                      </button>

                      <button
                        type="button"
                        className={loginMode === "mobile" ? "active" : ""}
                        onClick={() => {
                          setLoginMode("mobile");
                          setErrorMsg("");
                          setAlertMsg("");
                        }}
                      >
                        Mobile
                      </button>
                    </div>

                    {errorMsg && click && (
                      <div className="alert alert-danger auth-alert">
                        {errorMsg}
                      </div>
                    )}

                    {alertMsg && click && (
                      <Alert variant="success" className="auth-alert">
                        {alertMsg}
                      </Alert>
                    )}

                    {loginMode === "email" && (
                      <>
                        <span id="accText" className="auth-subtitle">
                          Login with your email account
                        </span>

                        <input
                          className="p-2 rounded border-dark border auth-input"
                          type="email"
                          placeholder="Email"
                          autoComplete="off"
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                          className="p-2 rounded border-dark border auth-input"
                          type="password"
                          placeholder="Password"
                          value={signInpassword}
                          onChange={(e) => setPass(e.target.value)}
                        />

                        <Link
                          className="text-dark auth-forgot"
                          to="/loginForm/verify"
                          id="forgetPass"
                        >
                          Forgot your password?
                        </Link>

                        <FormGroup className="auth-remember">
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="Terms"
                                checked={rememberMe === "on"}
                                onChange={(e) =>
                                  setRememberMe(e.target.checked ? "on" : "off")
                                }
                              />
                            }
                            label="Remember Me"
                          />
                        </FormGroup>

                        <button
                          type="submit"
                          className="ghost auth-btn"
                          id="btn1"
                          disabled={loading}
                        >
                          {loading ? "Signing In..." : "Sign In"}
                        </button>
                      </>
                    )}

                    {loginMode === "mobile" && (
                      <>
                        <span className="auth-subtitle">
                          Login with mobile number
                        </span>

                        <div className="phone-input-container auth-phone">
                          <PhoneInput
                            placeholder="Mobile Number"
                            value={loginPhoneNumber}
                            onChange={setLoginPhoneNumber}
                            defaultCountry="IN"
                          />
                        </div>

                        <input
                          className="p-2 rounded border-dark border auth-input"
                          type="password"
                          placeholder="Password"
                          value={loginMobilePassword}
                          onChange={(e) =>
                            setLoginMobilePassword(e.target.value)
                          }
                        />

                        <button
                          type="submit"
                          className="ghost auth-btn"
                          disabled={loading}
                        >
                          {loading ? "Signing In..." : "Mobile Sign In"}
                        </button>
                      </>
                    )}
                  </form>
                </div>

                {/* OVERLAY */}
                <div className="overlay-container">
                  <div className="overlay">
                    <div className="overlay-panel overlay-left">
                      <h1>Welcome Back!</h1>
                      <p className="text-center">
                        Already have an account? Login with email or mobile.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleClick(true)}
                        className="ghost"
                        id="signIn"
                      >
                        Sign In
                      </button>
                    </div>

                    <div className="overlay-panel overlay-right" id="rightPanel">
                      <h1 id="headSign">Hello, Friend!</h1>
                      <p>Create account using email or mobile OTP.</p>
                      <button
                        type="button"
                        onClick={() => handleClick(false)}
                        className="ghost"
                        id="signUp"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>

                {/* MOBILE SWITCH */}
                <div className="auth-mobile-switch">
                  <button
                    type="button"
                    className={click ? "active" : ""}
                    onClick={() => handleClick(true)}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={!click ? "active" : ""}
                    onClick={() => handleClick(false)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

export default Test;
