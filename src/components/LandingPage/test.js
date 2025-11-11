import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Alert } from "react-bootstrap";
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

import "./test.css";
import ErrorBoundary from "../ErrorBoundary";

const Test = (props) => {
  const [click, setClick] = useState(true);
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState("off");
  const [signInpassword, setPass] = useState("");
  const [buttonClick, setClicked] = useState("");

  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [password, setPassword] = useState({
    firstPassword: "",
    secondPassword: "",
  });
  const [userType, setUserType] = useState("other");
  const [buttonSignUpClick, setSignUpClicked] = useState("");
  const [number, setMname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validEmail, setValidEmail] = useState();
  const [hasError, sethasError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(true);
  const [alert, setAlert] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [validLength, upperCase, lowerCase, match] = usePasswordValidation({
    firstPassword: password.firstPassword,
    secondPassword: password.secondPassword,
  });

  const setFirst = (event) => {
    setPassword({ ...password, firstPassword: event.target.value });
  };
  const setSecond = (event) => {
    setPassword({ ...password, secondPassword: event.target.value });
  };

  const SignUpForm = async (e, props) => {
    e.preventDefault();
    setSignUpClicked(1);

    // Validate phone number
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      setPhoneError(true);
      return;
    } else {
      setPhoneError(false);
    }

    if (validEmail && upperCase && lowerCase && match) {
      axios.defaults.withCredentials = true;

      // Parse phone number to get country ISO code and national number
      let countryCode = "";
      let nationalNumber = number; // fallback to old number field

      if (phoneNumber) {
        try {
          const parsedPhone = parsePhoneNumber(phoneNumber);
          countryCode = parsedPhone.country; // This gives us "IN", "US", etc.
          nationalNumber = parsedPhone.nationalNumber;
        } catch (error) {
          console.error("Error parsing phone number:", error);
          setPhoneError(true);
          return;
        }
      }

      const params = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        psw: password.firstPassword,
        "psw-repeat": password.secondPassword,
        // rempwd: rempwd,
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
          if (response.data === "Email Address already Exists in the System") {
            document.getElementById("signup-msg").innerText =
              "Email already exists!";
          } else if (response.data.registration_id) {
            // Registration successful - now log the user in automatically
            setAlert("Registered Successfully!!!");

            // Set user cookies and localStorage for registration response
            Cookies.set("uName", response.data.first_name, { expires: 365 });
            if (response.data.docID) {
              localStorage.setItem("doctorid", response.data.docID);
            }
            if (response.data.value) {
              localStorage.setItem("token", response.data.value);
            }

            // Now perform automatic login to set proper authentication cookies
            setTimeout(() => {
              axios.defaults.withCredentials = true;
              axios
                .post(
                  `${backendHost}/login?cmd=login&email=${email}&psw=${password.firstPassword}&rempwd=1`
                )
                .then((loginResponse) => {
                  if (loginResponse.data.registration_id) {
                    // Login successful - authentication cookies should now be set by server
                    console.log(
                      "Auto-login after registration successful:",
                      loginResponse.data
                    );

                    // Update any additional data from login response
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
                      localStorage.setItem("token", loginResponse.data.value);
                    }

                    // Redirect to homepage with proper authentication
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  } else {
                    console.error("Auto-login failed after registration");
                    // Still redirect, user can login manually if needed
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  }
                })
                .catch((loginError) => {
                  console.error(
                    "Auto-login error after registration:",
                    loginError
                  );
                  // Still redirect, user can login manually if needed
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                });
            }, 1000); // Wait 1 second to show success message
          }

          // Clear alert after some time if registration wasn't successful
          if (!response.data.registration_id) {
            setTimeout(() => {
              setAlert("");
            }, 5000);
          }
        })
        .catch((err) => {
          setTimeout(() => {
            setSignUpClicked(3);
          }, 5000);
          document.getElementById("signup-msg").innerText =
            "Some error occured!";
        });
    } else {
      return;
    }
  };

  const handleEmail = (e) => {
    var re = /^[a-zA-Z-0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (!re.test(e.target.value)) {
      setValidEmail(false);
    } else {
      setEmail(e.target.value);
      setValidEmail(true);
    }
  };

  const handleClick = () => {
    if (click === true) {
      document.getElementById("container").classList.add("right-panel-active");
    } else {
      document
        .getElementById("container")
        .classList.remove("right-panel-active");
    }
  };

  const loginForm = async (e) => {
    e.preventDefault();
    setClicked(1);
    // Sett withCredentials on $axios before creating instance
    axios.defaults.withCredentials = true;
    axios
      .post(
        `${backendHost}/login?cmd=login&email=${email}&psw=${signInpassword}&rempwd=${rememberMe}`
      )
      .then((response) => {
        if (response.data.registration_id) {
          console.log("response login", response.data);

          Cookies.set("uName", response.data.first_name, { expires: 365 });
          localStorage.setItem("doctorid", response.data.docID);
          localStorage.setItem("token", response.data.value);
          setTimeout(() => {
            if (props.path) {
              window.location = props.path;
            } else {
              window.location.reload();
            }
          }, 500);
        } else {
          document.getElementById("login-msg").innerText =
            "Some error occured!";
        }
      })
      .catch((err) => {
        setLoginSuccess(false);
        if (err.response) {
          if (err.response.data.includes("Incorrect email")) {
            document.getElementById("login-msg").innerText =
              "Incorrect email or password";
          } else {
            document.getElementById("login-msg").innerText =
              "Some error occured!";
          }
        } else {
          return;
        }
      });
  };

  return (
    <>
      {hasError && <ErrorBoundary></ErrorBoundary>}

      {!hasError && (
        <div className="sign">
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body>
              <div className="container sign" id="container">
                <div className="form-container sign-up-container">
                  <form className="sign" onSubmit={SignUpForm}>
                    <div className="h2 py-0 my-1">Create Account</div>
                    <span>or use your email for registration</span>

                    {parseInt(buttonSignUpClick) === 1 ? (
                      <div
                        id="signup-msg"
                        className="alert alert-danger mt-2 py-1 px-3 border border-dark"
                      ></div>
                    ) : null}
                    <input
                      className="px-2 py-1 rounded border-dark border"
                      type="text"
                      placeholder="First Name"
                      onChange={(e) => setFname(e.target.value)}
                      required
                    />
                    <input
                      className="px-2 py-1 rounded border-dark border"
                      type="text"
                      placeholder="Last Name"
                      onChange={(e) => setLname(e.target.value)}
                      required
                    />
                    <input
                      className="px-2 py-1 rounded border-dark border"
                      type="email"
                      placeholder="Email"
                      onChange={(e) => handleEmail(e)}
                      required
                    />
                    <div className="phone-input-container">
                      <PhoneInput
                        placeholder="Mobile Number"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        defaultCountry="IN"
                        style={{ paddingLeft: "10px" }}
                      />

                      {phoneError && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          Please enter a valid phone number
                        </div>
                      )}
                    </div>
                    <input
                      className="px-2 py-1 rounded border-dark border"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setFirst(e)}
                      required
                    />
                    {buttonSignUpClick === 1 ? (
                      <div className="rounded alert-danger">
                        <div className="alert-msg">
                          {!validEmail && <div>◼ Enter Valid Email! </div>}
                          {phoneError && (
                            <div>◼ Enter Valid Phone Number! </div>
                          )}
                          {!validLength && (
                            <div>
                              ◼ Password should contain at least 8 characters!{" "}
                            </div>
                          )}
                          {!upperCase && (
                            <div>
                              ◼ Password should contain at least 1 uppercase
                              character!{" "}
                            </div>
                          )}
                          {!lowerCase && (
                            <div>
                              ◼ Password should contain at least 1 lowercase
                              character!{" "}
                            </div>
                          )}
                          {!match && <div>◼ Passwords don't match! </div>}
                        </div>
                      </div>
                    ) : null}
                    <input
                      className="px-2 py-1 rounded border-dark border"
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) => setSecond(e)}
                      autoComplete="off"
                      required
                    />

                    <FormControl className="mb-4 w-75">
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
                    <button type="submit" className="ghost">
                      Sign Up
                    </button>
                  </form>
                </div>
                <div className="form-container sign-in-container">
                  <form className="sign" onSubmit={loginForm}>
                    <h1 id="headSign">Sign in</h1>
                    <span id="accText">or use your account</span>

                    {buttonClick === 1 && !loginSuccess && (
                      <div
                        id="login-msg"
                        className="alert alert-danger mt-2 py-1 px-3 border border-dark"
                      >
                        Some Error Occured
                      </div>
                    )}

                    <input
                      className="p-2 rounded border-dark border"
                      type="email"
                      placeholder="Email"
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="p-2 rounded border-dark border"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPass(e.target.value)}
                    />
                    <Link
                      className="text-dark"
                      to="/loginForm/verify"
                      id="forgetPass"
                    >
                      Forgot your password?
                    </Link>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="Terms"
                            value={rememberMe}
                            onClick={(e) =>
                              e.target.value === "off"
                                ? setRememberMe("on")
                                : setRememberMe("off")
                            }
                          />
                        }
                        label="Remember Me"
                      />
                    </FormGroup>
                    <button className="ghost" id="btn1">
                      Sign In
                    </button>
                  </form>
                </div>
                <div className="overlay-container">
                  <div className="overlay">
                    <div className="overlay-panel overlay-left">
                      <h1>Welcome Back!</h1>
                      <p className="text-center">
                        To keep connected with us please login with your
                        personal info or
                      </p>
                      <button
                        onClick={(e) => handleClick(setClick(true))}
                        className="ghost"
                        id="signIn"
                      >
                        Sign In
                      </button>
                    </div>
                    <div
                      className="overlay-panel overlay-right"
                      id="rightPanel"
                    >
                      <h1 id="headSign">Hello, Friend!</h1>
                      <p>
                        Enter your personal details and start journey with us
                      </p>
                      <button
                        onClick={(e) => handleClick(setClick(false))}
                        className="ghost"
                        id="signUp"
                      >
                        Sign Up
                      </button>
                    </div>

                    {alert && (
                      <Alert variant="success" className="h6 mx-3">
                        {alert}
                      </Alert>
                    )}
                  </div>
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
