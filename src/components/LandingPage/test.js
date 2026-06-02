// import React, { useState } from "react";
// import { Modal } from "react-bootstrap";
// import { Alert } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";
// import {
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Checkbox,
//   FormGroup,
//   FormControlLabel,
// } from "@material-ui/core";
// import { usePasswordValidation } from "../hooks/usePasswordValidation";
// import { backendHost } from "../../api-config";
// import PhoneInput from "react-phone-number-input";
// import { isValidPhoneNumber } from "react-phone-number-input";
// import { parsePhoneNumber } from "libphonenumber-js";

// import "./test.css";
// import ErrorBoundary from "../ErrorBoundary";

// const Test = (props) => {
//   const [click, setClick] = useState(true);
//   const [email, setEmail] = useState("");
//   const [rememberMe, setRememberMe] = useState("off");
//   const [signInpassword, setPass] = useState("");
//   const [buttonClick, setClicked] = useState("");

//   const [firstName, setFname] = useState("");
//   const [lastName, setLname] = useState("");
//   const [password, setPassword] = useState({
//     firstPassword: "",
//     secondPassword: "",
//   });
//   const [userType, setUserType] = useState("other");
//   const [buttonSignUpClick, setSignUpClicked] = useState("");
//   const [number, setMname] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [validEmail, setValidEmail] = useState();
//   const [hasError, sethasError] = useState(false);
//   const [loginSuccess, setLoginSuccess] = useState(true);
//   const [alert, setAlert] = useState("");
//   const [phoneError, setPhoneError] = useState(false);

//   const [validLength, upperCase, lowerCase, match] = usePasswordValidation({
//     firstPassword: password.firstPassword,
//     secondPassword: password.secondPassword,
//   });

//   const setFirst = (event) => {
//     setPassword({ ...password, firstPassword: event.target.value });
//   };
//   const setSecond = (event) => {
//     setPassword({ ...password, secondPassword: event.target.value });
//   };

//   const SignUpForm = async (e, props) => {
//     e.preventDefault();
//     setSignUpClicked(1);

//     // Validate phone number
//     if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
//       setPhoneError(true);
//       return;
//     } else {
//       setPhoneError(false);
//     }

//     if (validEmail && upperCase && lowerCase && match) {
//       axios.defaults.withCredentials = true;

//       // Parse phone number to get country ISO code and national number
//       let countryCode = "";
//       let nationalNumber = number; // fallback to old number field

//       if (phoneNumber) {
//         try {
//           const parsedPhone = parsePhoneNumber(phoneNumber);
//           countryCode = parsedPhone.country; // This gives us "IN", "US", etc.
//           nationalNumber = parsedPhone.nationalNumber;
//         } catch (error) {
//           console.error("Error parsing phone number:", error);
//           setPhoneError(true);
//           return;
//         }
//       }

//       const params = {
//         firstname: firstName,
//         lastname: lastName,
//         email: email,
//         psw: password.firstPassword,
//         "psw-repeat": password.secondPassword,
//         // rempwd: rempwd,
//         rempwd: "1",
//         doc_patient: userType,
//         acceptTnc: "1",
//         number: nationalNumber,
//         country_code: countryCode,
//         Age: null,
//       };
//       axios
//         .post(`${backendHost}/registration/add/new`, params, {
//           headers: { "Access-Control-Allow-Credentials": true },
//         })
//         .then((response) => {
//           if (response.data === "Email Address already Exists in the System") {
//             document.getElementById("signup-msg").innerText =
//               "Email already exists!";
//           } else if (response.data.registration_id) {
//             // Registration successful - now log the user in automatically
//             setAlert("Registered Successfully!!!");

//             // Set user cookies and localStorage for registration response
//             Cookies.set("uName", response.data.first_name, { expires: 365 });
//             if (response.data.docID) {
//               localStorage.setItem("doctorid", response.data.docID);
//             }
//             if (response.data.value) {
//               localStorage.setItem("token", response.data.value);
//             }

//             // Now perform automatic login to set proper authentication cookies
//             setTimeout(() => {
//               axios.defaults.withCredentials = true;
//               axios
//                 .post(
//                   `${backendHost}/login?cmd=login&email=${email}&psw=${password.firstPassword}&rempwd=1`
//                 )
//                 .then((loginResponse) => {
//                   if (loginResponse.data.registration_id) {
//                     // Login successful - authentication cookies should now be set by server
//                     console.log(
//                       "Auto-login after registration successful:",
//                       loginResponse.data
//                     );

//                     // Update any additional data from login response
//                     Cookies.set("uName", loginResponse.data.first_name, {
//                       expires: 365,
//                     });
//                     if (loginResponse.data.docID) {
//                       localStorage.setItem(
//                         "doctorid",
//                         loginResponse.data.docID
//                       );
//                     }
//                     if (loginResponse.data.value) {
//                       localStorage.setItem("token", loginResponse.data.value);
//                     }

//                     // Redirect to homepage with proper authentication
//                     setTimeout(() => {
//                       window.location.reload();
//                     }, 500);
//                   } else {
//                     console.error("Auto-login failed after registration");
//                     // Still redirect, user can login manually if needed
//                     setTimeout(() => {
//                       window.location.reload();
//                     }, 500);
//                   }
//                 })
//                 .catch((loginError) => {
//                   console.error(
//                     "Auto-login error after registration:",
//                     loginError
//                   );
//                   // Still redirect, user can login manually if needed
//                   setTimeout(() => {
//                     window.location.reload();
//                   }, 500);
//                 });
//             }, 1000); // Wait 1 second to show success message
//           }

//           // Clear alert after some time if registration wasn't successful
//           if (!response.data.registration_id) {
//             setTimeout(() => {
//               setAlert("");
//             }, 5000);
//           }
//         })
//         .catch((err) => {
//           setTimeout(() => {
//             setSignUpClicked(3);
//           }, 5000);
//           document.getElementById("signup-msg").innerText =
//             "Some error occured!";
//         });
//     } else {
//       return;
//     }
//   };

//   const handleEmail = (e) => {
//     var re = /^[a-zA-Z-0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
//     if (!re.test(e.target.value)) {
//       setValidEmail(false);
//     } else {
//       setEmail(e.target.value);
//       setValidEmail(true);
//     }
//   };

//   const handleClick = () => {
//     if (click === true) {
//       document.getElementById("container").classList.add("right-panel-active");
//     } else {
//       document
//         .getElementById("container")
//         .classList.remove("right-panel-active");
//     }
//   };

//   const loginForm = async (e) => {
//     e.preventDefault();
//     setClicked(1);
//     // Sett withCredentials on $axios before creating instance
//     axios.defaults.withCredentials = true;
//     axios
//       .post(
//         `${backendHost}/login?cmd=login&email=${email}&psw=${signInpassword}&rempwd=${rememberMe}`
//       )
//       .then((response) => {
//         if (response.data.registration_id) {
//           console.log("response login", response.data);

//           Cookies.set("uName", response.data.first_name, { expires: 365 });
//           localStorage.setItem("doctorid", response.data.docID);
//           localStorage.setItem("token", response.data.value);
//           setTimeout(() => {
//             if (props.path) {
//               window.location = props.path;
//             } else {
//               window.location.reload();
//             }
//           }, 500);
//         } else {
//           document.getElementById("login-msg").innerText =
//             "Some error occured!";
//         }
//       })
//       .catch((err) => {
//         setLoginSuccess(false);
//         if (err.response) {
//           if (err.response.data.includes("Incorrect email")) {
//             document.getElementById("login-msg").innerText =
//               "Incorrect email or password";
//           } else {
//             document.getElementById("login-msg").innerText =
//               "Some error occured!";
//           }
//         } else {
//           return;
//         }
//       });
//   };

//   return (
//     <>
//       {hasError && <ErrorBoundary></ErrorBoundary>}

//       {!hasError && (
//         <div className="sign">
//           <Modal
//             {...props}
//             size="lg"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//           >
//             <Modal.Body>
//               <div className="container sign" id="container">
//                 <div className="form-container sign-up-container">
//                   <form className="sign" onSubmit={SignUpForm}>
//                     <div className="h2 py-0 my-1">Create Account</div>
//                     <span>or use your email for registration</span>

//                     {parseInt(buttonSignUpClick) === 1 ? (
//                       <div
//                         id="signup-msg"
//                         className="alert alert-danger mt-2 py-1 px-3 border border-dark"
//                       ></div>
//                     ) : null}
//                     <input
//                       className="px-2 py-1 rounded border-dark border"
//                       type="text"
//                       placeholder="First Name"
//                       onChange={(e) => setFname(e.target.value)}
//                       required
//                     />
//                     <input
//                       className="px-2 py-1 rounded border-dark border"
//                       type="text"
//                       placeholder="Last Name"
//                       onChange={(e) => setLname(e.target.value)}
//                       required
//                     />
//                     <input
//                       className="px-2 py-1 rounded border-dark border"
//                       type="email"
//                       placeholder="Email"
//                       onChange={(e) => handleEmail(e)}
//                       required
//                     />
//                     <div className="phone-input-container">
//                       <PhoneInput
//                         placeholder="Mobile Number"
//                         value={phoneNumber}
//                         onChange={setPhoneNumber}
//                         defaultCountry="IN"
//                         style={{ paddingLeft: "10px" }}
//                       />

//                       {phoneError && (
//                         <div
//                           className="text-danger mt-1"
//                           style={{ fontSize: "12px" }}
//                         >
//                           Please enter a valid phone number
//                         </div>
//                       )}
//                     </div>
//                     <input
//                       className="px-2 py-1 rounded border-dark border"
//                       type="password"
//                       placeholder="Password"
//                       onChange={(e) => setFirst(e)}
//                       required
//                     />
//                     {buttonSignUpClick === 1 ? (
//                       <div className="rounded alert-danger">
//                         <div className="alert-msg">
//                           {!validEmail && <div>◼ Enter Valid Email! </div>}
//                           {phoneError && (
//                             <div>◼ Enter Valid Phone Number! </div>
//                           )}
//                           {!validLength && (
//                             <div>
//                               ◼ Password should contain at least 8 characters!{" "}
//                             </div>
//                           )}
//                           {!upperCase && (
//                             <div>
//                               ◼ Password should contain at least 1 uppercase
//                               character!{" "}
//                             </div>
//                           )}
//                           {!lowerCase && (
//                             <div>
//                               ◼ Password should contain at least 1 lowercase
//                               character!{" "}
//                             </div>
//                           )}
//                           {!match && <div>◼ Passwords don't match! </div>}
//                         </div>
//                       </div>
//                     ) : null}
//                     <input
//                       className="px-2 py-1 rounded border-dark border"
//                       type="password"
//                       placeholder="Confirm Password"
//                       onChange={(e) => setSecond(e)}
//                       autoComplete="off"
//                       required
//                     />

//                     <FormControl className="mb-4 w-75">
//                       <InputLabel id="demo-simple-select-label">
//                         User Type
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-label"
//                         id="demo-simple-select"
//                         value={userType}
//                         onChange={(e) => setUserType(e.target.value)}
//                         required
//                       >
//                         <MenuItem value="doctor">Doctor</MenuItem>
//                         <MenuItem value="other">Other</MenuItem>
//                       </Select>
//                     </FormControl>
//                     <button type="submit" className="ghost">
//                       Sign Up
//                     </button>
//                   </form>
//                 </div>
//                 <div className="form-container sign-in-container">
//                   <form className="sign" onSubmit={loginForm}>
//                     <h1 id="headSign">Sign in</h1>
//                     <span id="accText">or use your account</span>

//                     {buttonClick === 1 && !loginSuccess && (
//                       <div
//                         id="login-msg"
//                         className="alert alert-danger mt-2 py-1 px-3 border border-dark"
//                       >
//                         Some Error Occured
//                       </div>
//                     )}

//                     <input
//                       className="p-2 rounded border-dark border"
//                       type="email"
//                       placeholder="Email"
//                       autoComplete="off"
//                       onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <input
//                       className="p-2 rounded border-dark border"
//                       type="password"
//                       placeholder="Password"
//                       onChange={(e) => setPass(e.target.value)}
//                     />
//                     <Link
//                       className="text-dark"
//                       to="/loginForm/verify"
//                       id="forgetPass"
//                     >
//                       Forgot your password?
//                     </Link>
//                     <FormGroup>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             name="Terms"
//                             value={rememberMe}
//                             onClick={(e) =>
//                               e.target.value === "off"
//                                 ? setRememberMe("on")
//                                 : setRememberMe("off")
//                             }
//                           />
//                         }
//                         label="Remember Me"
//                       />
//                     </FormGroup>
//                     <button className="ghost" id="btn1">
//                       Sign In
//                     </button>
//                   </form>
//                 </div>
//                 <div className="overlay-container">
//                   <div className="overlay">
//                     <div className="overlay-panel overlay-left">
//                       <h1>Welcome Back!</h1>
//                       <p className="text-center">
//                         To keep connected with us please login with your
//                         personal info or
//                       </p>
//                       <button
//                         onClick={(e) => handleClick(setClick(true))}
//                         className="ghost"
//                         id="signIn"
//                       >
//                         Sign In
//                       </button>
//                     </div>
//                     <div
//                       className="overlay-panel overlay-right"
//                       id="rightPanel"
//                     >
//                       <h1 id="headSign">Hello, Friend!</h1>
//                       <p>
//                         Enter your personal details and start journey with us
//                       </p>
//                       <button
//                         onClick={(e) => handleClick(setClick(false))}
//                         className="ghost"
//                         id="signUp"
//                       >
//                         Sign Up
//                       </button>
//                     </div>

//                     {alert && (
//                       <Alert variant="success" className="h6 mx-3">
//                         {alert}
//                       </Alert>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </Modal.Body>
//           </Modal>
//         </div>
//       )}
//     </>
//   );
// };

// export default Test;

//new Model
import React, { useState } from "react";

import { Modal } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import {
  // Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import { usePasswordValidation } from "../hooks/usePasswordValidation";
import { backendHost } from "../../api-config";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";

import "./test.css";
import ErrorBoundary from "../ErrorBoundary";
import { useRef } from "react";

const Test = (props) => {
  const [click, setClick] = useState(true);
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState("off");
  const [signInpassword, setPass] = useState("");
  const [buttonClick, setClicked] = useState("");
  // ===== NEW LOGIN STATES =====
  const [loginType, setLoginType] = useState("email");

  const [mobileNumber, setMobileNumber] = useState("");
  const [mobilePassword, setMobilePassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  // ============================
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [password, setPassword] = useState({
    firstPassword: "",
    secondPassword: "",
  });
  const [mobileView, setMobileView] = useState("signup");
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userType, setUserType] = useState("other");
  const [buttonSignUpClick, setSignUpClicked] = useState("");
  const [number, setMname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [hasError, sethasError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(true);
  const [alert, setAlert] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageType, setOtpMessageType] = useState("");
  const [loginError, setLoginError] = useState("");
  const options = [
    { value: "doctor", label: "Doctor" },
    { value: "other", label: "Other" },
  ];

  const [
    validLength,
    hasNumber,
    upperCase,
    lowerCase,
    match,
    specialCharFromHook,
  ] = usePasswordValidation({
    firstPassword: password.firstPassword,
    secondPassword: password.secondPassword,
  });

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  // CHANGED
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.firstPassword);
  const [loginMessage, setLoginMessage] = useState("");
  const setFirst = (event) => {
    setPassword({ ...password, firstPassword: event.target.value });
  };

  const setSecond = (event) => {
    setPassword({ ...password, secondPassword: event.target.value });
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SignUpForm = async (e, props) => {
    e.preventDefault();
    setSignupError("");
    setSignUpClicked(1);

    setPhoneError("");
    if (!validLength || !upperCase || !lowerCase || !specialCharFromHook) {
      passwordRef.current?.focus();

      passwordRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }
    if (!match) {
      confirmPasswordRef.current?.focus();

      confirmPasswordRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    // Validate phone number
    // CHANGED: Mobile mandatory

    if (!phoneNumber) {
      setPhoneError("Mobile number is required");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError("Please enter a valid mobile number");
      return;
    }
    if (!validEmail) {
      return;
    }

    if (
      validEmail &&
      validLength &&
      upperCase &&
      lowerCase &&
      specialCharFromHook &&
      match
    ) {
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
        rempwd: "on",
        doc_patient: userType,
        acceptTnc: "on",
        acceptPolicy: "on",
        number: nationalNumber,
        country_code: countryCode,
        Age: null,
      };

      axios
        .post(`${backendHost}/auth/register-user`, params, {
          headers: { "Access-Control-Allow-Credentials": true },
        })
        .then((response) => {
          if (typeof response.data === "string") {
            if (
              response.data.toLowerCase().includes("exists") ||
              response.data.toLowerCase().includes("duplicate") ||
              response.data.toLowerCase().includes("already")
            ) {
              setLoginMessage(
                "An account already exists with this mobile number.",
              );

              if (isMobile) {
                setMobileView("login");
              } else {
                handleClick("signin");
              }
              return;
            }

            if (
              response.data.toLowerCase().includes("error") ||
              response.data.toLowerCase().includes("failed") ||
              response.data.toLowerCase().includes("invalid")
            ) {
              setSignupError(response.data);
              return;
            }
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
                  `${backendHost}/login?cmd=login&email=${email}&psw=${password.firstPassword}&rempwd=1`,
                )
                .then((loginResponse) => {
                  if (loginResponse.data.registration_id) {
                    // Login successful - authentication cookies should now be set by server
                    console.log(
                      "Auto-login after registration successful:",
                      loginResponse.data,
                    );

                    // Update any additional data from login response
                    Cookies.set("uName", loginResponse.data.first_name, {
                      expires: 365,
                    });
                    if (loginResponse.data.docID) {
                      localStorage.setItem(
                        "doctorid",
                        loginResponse.data.docID,
                      );
                    }
                    if (loginResponse.data.value) {
                      localStorage.setItem("token", loginResponse.data.value);
                    }

                    // Redirect to homepage with proper authentication
                    setTimeout(() => {
                      window.location.reload();
                    }, 3500);
                  } else {
                    console.error("Auto-login failed after registration");
                    // Still redirect, user can login manually if needed
                    setTimeout(() => {
                      window.location.reload();
                    }, 3500);
                  }
                })
                .catch((loginError) => {
                  console.error(
                    "Auto-login error after registration:",
                    loginError,
                  );
                  // Still redirect, user can login manually if needed
                  setTimeout(() => {
                    window.location.reload();
                  }, 3500);
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
          setSignupError("Some error occurred!");
        });
    } else {
      return;
    }
  };

  // CHANGED: Email optional
  const handleEmail = (e) => {
    const value = e.target.value.trim();

    setEmail(value);

    if (!value) {
      setValidEmail(true);
      return;
    }

    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    setValidEmail(re.test(value));
  };
  const handleClick = (type) => {
    if (type === "signup") {
      setClick(false);

      document.getElementById("container").classList.add("right-panel-active");
    } else {
      setClick(true);

      document
        .getElementById("container")
        .classList.remove("right-panel-active");
    }
  };

  // ===== SEND OTP FUNCTION =====
  const sendOtp = async () => {
    try {
      setSendingOtp(true);

      axios.defaults.withCredentials = true;

      // Mobile number required
      if (!mobileNumber) {
        setOtpMessage("Mobile number is required.");
        setOtpMessageType("error");
        return;
      }

      // Mobile number format validation
      if (!isValidPhoneNumber(mobileNumber)) {
        setOtpMessage("Please enter a valid mobile number.");
        setOtpMessageType("error");
        return;
      }
      let countryCodeForOtp = "";
      let nationalNumber = "";

      if (mobileNumber) {
        try {
          const parsedPhone = parsePhoneNumber(mobileNumber);

          countryCodeForOtp = "+" + parsedPhone.countryCallingCode;
          nationalNumber = parsedPhone.nationalNumber;
        } catch (error) {
          console.error("Error parsing phone number:", error);
          setOtpMessage("Please enter a valid phone number");
          setOtpMessageType("error");
          return;
        }
      }

      const response = await axios.post(`${backendHost}/auth/send-otp`, null, {
        params: {
          mobile: nationalNumber,
          countryCode: countryCodeForOtp,
        },
      });

      if (response.data.success) {
        setOtpSent(true);
        setOtpMessage("OTP sent successfully.");
        setOtpMessageType("success");
      } else {
        setOtpMessage("Unable to send OTP. Please try again.");
        setOtpMessageType("error");
      }
    } catch (error) {
      console.log(error);
      setOtpMessage(
        "This number is not registered on WhatsApp. Please enter a valid WhatsApp number.",
      );
      setOtpMessageType("error");
    } finally {
      setSendingOtp(false);
    }
  };
  // =============================
  // ===== VERIFY OTP FUNCTION =====
  const verifyOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      // Extract country code and national number from phone number

      let countryCodeForVerify = "";
      let nationalNumber = "";
      if (mobileNumber) {
        try {
          const parsedPhone = parsePhoneNumber(mobileNumber);
          countryCodeForVerify = "+" + parsedPhone.countryCallingCode;
          nationalNumber = parsedPhone.nationalNumber;
        } catch (error) {
          console.error("Error parsing phone number:", error);
          window.alert("Please enter a valid phone number");
          return;
        }
      }

      const response = await axios.post(`${backendHost}/auth/verify-otp`, {
        mobile: nationalNumber,
        countryCode: countryCodeForVerify,
        otp: otp,
        rememberPassword: 1,
      });

      if (response.data.data && response.data.data.registration_id) {
        Cookies.set("uName", response.data.data.first_name, {
          expires: 365,
        });
        localStorage.setItem("doctorid", response.data.data.docID);
        localStorage.setItem("token", response.data.data.value);
        window.location.reload();
      } else {
        window.alert("Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      alert("OTP Verification Failed");
    }
  };
  // =================================
  const loginForm = async (e) => {
    e.preventDefault();

    setClicked(1);
    setLoginError("");
    axios.defaults.withCredentials = true;

    // =========================================
    // EMAIL LOGIN (YOUR EXISTING LOGIN)
    // =========================================

    if (loginType === "email") {
      axios
        .post(
          `${backendHost}/login?cmd=login&email=${email}&psw=${signInpassword}&rempwd=1`,
          //    `${backendHost}/login-user?email=${email}&password=${signInpassword}&loginType=EMAIL&rempwd=1`,

          {},
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          if (response.data.registration_id) {
            console.log("response login", response.data);

            Cookies.set("uName", response.data.first_name, {
              expires: 365,
            });

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
            setLoginSuccess(false);
            setLoginError("Some error occurred!");
          }
        })
        .catch((err) => {
          setLoginSuccess(false);

          if (err.response) {
            if (err.response.data.includes("Incorrect email")) {
              setLoginSuccess(false);
              setLoginError("Incorrect email or password");
            } else {
              setLoginSuccess(false);
              setLoginError("Some error occurred!");
            }
          }
        });
    }

    // =========================================
    // MOBILE + PASSWORD LOGIN
    // =========================================
    else if (loginType === "mobile-password") {
      axios
        .post(
          `${backendHost}/login-user?mobile=${mobileNumber}&password=${mobilePassword}&loginType=MOBILE&rempwd=1`,

          {},
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          if (response.data.registration_id) {
            Cookies.set("uName", response.data.first_name, {
              expires: 365,
            });

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
            setLoginSuccess(false);
            setLoginError("Invalid Mobile Number or Password!");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoginSuccess(false);
          setLoginError("Some error occurred!");
        });
    }
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
            centered={!isMobile}
            dialogClassName={isMobile ? "sign-mobile-modal" : ""}
          >
            <Modal.Body className={isMobile ? "sign-mobile-body" : ""}>
              <div className="container sign" id="container">
                <div
                  className={`form-container sign-up-container ${
                    mobileView === "login" ? "mobile-hidden" : ""
                  }`}
                >
                  <form className="sign" onSubmit={SignUpForm}>
                    <div className="signup-heading">Create Account</div>
                    <span>or use your email for registration</span>

                    {signupError && (
                      <div className="signup-error">
                        <div>{signupError}</div>
                      </div>
                    )}
                    <TextField
                      variant="outlined"
                      size="small"
                      label="First Name"
                      aria-label="First name"
                      className="input-field"
                      onChange={(e) => setFname(e.target.value)}
                      required
                    />
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Last Name"
                      aria-label="Last name"
                      className="input-field"
                      onChange={(e) => setLname(e.target.value)}
                    />
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Email"
                      type="email"
                      aria-label="Signup email"
                      className="input-field"
                      onChange={(e) => handleEmail(e)}
                    />
                    <div className="phone-input-container">
                      <PhoneInput
                        placeholder="Mobile Number"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        defaultCountry="IN"
                        style={{ paddingLeft: "10px" }}
                      />
                      {/* CHANGED: Dynamic professional error */}
                      {/* {phoneError && (
                        <div className="validation-error">{phoneError}</div>
                      )} */}
                      {phoneError && (
                        <div className="mobile-field-error">{phoneError}</div>
                      )}
                    </div>
                    <TextField
                      inputRef={passwordRef}
                      variant="outlined"
                      size="small"
                      label="Password"
                      type="password"
                      className={`input-field ${
                        buttonSignUpClick === 1 &&
                        (!validLength ||
                          !upperCase ||
                          !lowerCase ||
                          !specialCharFromHook)
                          ? "field-invalid"
                          : ""
                      }`}
                      onChange={(e) => setFirst(e)}
                      required
                    />
                    <TextField
                      inputRef={confirmPasswordRef}
                      variant="outlined"
                      size="small"
                      label="Confirm Password"
                      type="password"
                      aria-label="Confirm password"
                      className={`input-field ${
                        buttonSignUpClick === 1 && !match ? "field-invalid" : ""
                      }`}
                      onChange={(e) => setSecond(e)}
                      autoComplete="off"
                      required
                    />

                    {buttonSignUpClick === 1 && !match && (
                      <div className="field-error">Passwords do not match.</div>
                    )}
                    <div className="password-hint">
                      Password must contain 8+ characters, uppercase, lowercase,
                      and a special character.✅
                    </div>
                    <div className="custom-field">
                      <label className="custom-label" htmlFor="userType">
                        User Type
                      </label>
                      <Select
                        options={options}
                        value={options.find((opt) => opt.value === userType)}
                        onChange={(option) => setUserType(option.value)}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        menuIsOpen={menuOpen}
                        onMenuOpen={() => setMenuOpen(true)}
                        onMenuClose={() => setMenuOpen(false)}
                        isSearchable={false}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="ghost"
                      aria-label="Sign up"
                      id="signUp"
                    >
                      Sign Up
                    </Button>
                    <div className="mobile-login-switch">
                      <span>Already have an account?</span>

                      <span
                        className="switch-link"
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileView("login");
                        }}
                      >
                        Sign In
                      </span>
                    </div>
                  </form>
                </div>
                <div
                  className={`form-container sign-in-container ${
                    mobileView === "login" ? "mobile-visible" : ""
                  }`}
                >
                  <form
                    className={`sign ${useOtpLogin ? "otp-mode" : ""}`}
                    onSubmit={loginForm}
                  >
                    <h1 id="headSign">Sign In</h1>

                    <span id="accText">
                      {useOtpLogin && otpSent
                        ? "We have sent you an OTP on your mobile"
                        : "Access your healthcare account securely"}
                    </span>
                    {loginError && (
                      <div className="otp-error-message">{loginError}</div>
                    )}

                    {loginMessage && (
                      <div className="existing-account-message">
                        {loginMessage}
                      </div>
                    )}
                    {/* LOGIN FIELD */}
                    {useOtpLogin ? (
                      <>
                        {otpMessage && (
                          <div
                            className={
                              otpMessageType === "success"
                                ? "otp-success-message"
                                : "otp-error-message"
                            }
                          >
                            {otpMessage}
                          </div>
                        )}
                        <div className="phone-input-container login-phone">
                          <label className="login-label">Mobile Number</label>

                          <PhoneInput
                            placeholder="Enter mobile number"
                            value={mobileNumber}
                            onChange={setMobileNumber}
                            defaultCountry="IN"
                            international
                            countryCallingCodeEditable={false}
                            disabled={otpSent}
                          />
                        </div>

                        {otpSent && (
                          <div className="phone-input-container login-phone">
                            <label className="login-label">OTP</label>

                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              className="otp-input-field"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                            />

                            <button
                              type="button"
                              className="edit-number-link"
                              onClick={() => {
                                setOtpSent(false);
                                setOtp("");
                              }}
                            >
                              Change mobile number
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <label className="custom-label">
                          Mobile Number / Email ID
                        </label>

                        <TextField
                          variant="outlined"
                          size="small"
                          label=""
                          aria-label="Login Email or Mobile"
                          className="input-field"
                          autoComplete="off"
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value.includes("@")) {
                              setEmail(value);

                              setLoginType("email");
                            } else {
                              setMobileNumber(value);

                              setLoginType("mobile-password");
                            }
                          }}
                        />
                      </>
                    )}

                    {/* PASSWORD FIELD */}
                    {!useOtpLogin && (
                      <>
                        <label className="custom-label">Password</label>

                        <TextField
                          variant="outlined"
                          size="small"
                          label=""
                          type="password"
                          aria-label="Login Password"
                          className="input-field"
                          onChange={(e) => {
                            setPass(e.target.value);

                            setMobilePassword(e.target.value);
                          }}
                        />
                      </>
                    )}

                    {/* LOGIN ROW */}

                    {!useOtpLogin && (
                      <div className="login-row">
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
                            label="Remember me for 30 days"
                          />
                        </FormGroup>

                        <Link
                          className="text-dark"
                          to="/loginForm/verify"
                          id="forgetPass"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    {/* OTP LOGIN TOGGLE */}

                    <div className="otp-toggle">
                      <label className="otp-toggle-label">
                        <input
                          type="checkbox"
                          checked={useOtpLogin}
                          onChange={(e) => {
                            setUseOtpLogin(e.target.checked);

                            setOtpSent(false);

                            if (e.target.checked) {
                              setLoginType("otp");
                            } else {
                              setLoginType("mobile-password");
                            }
                          }}
                        />

                        <span>Login with OTP instead of password</span>
                      </label>
                    </div>

                    {/* LOGIN BUTTON */}

                    {!useOtpLogin && (
                      <button className="ghost" id="btn1">
                        Login
                      </button>
                    )}

                    {useOtpLogin && !otpSent && (
                      <button
                        type="button"
                        className="ghost"
                        onClick={sendOtp}
                        disabled={sendingOtp}
                      >
                        {sendingOtp ? "Sending OTP..." : "Send OTP"}
                      </button>
                    )}

                    {useOtpLogin && otpSent && (
                      <button
                        type="button"
                        className="ghost"
                        id="verifyBtn"
                        onClick={verifyOtp}
                      >
                        Verify OTP
                      </button>
                    )}

                    <div className="mobile-login-switch">
                      <span>Don’t have an account?</span>

                      <span
                        className="switch-link"
                        onClick={() => setMobileView("signup")}
                      >
                        Sign Up
                      </span>
                    </div>
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
                        onClick={() => {
                          setMenuOpen(false);
                          handleClick("signin");
                        }}
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
                      <h1>Hello, Friend!</h1>
                      <p>
                        Enter your personal details and start journey with us
                      </p>
                      <button
                        onClick={() => handleClick("signup")}
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
