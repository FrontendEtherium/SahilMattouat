import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Button, Alert, Spinner, Badge } from "react-bootstrap";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import axios from "axios";
import { backendHost } from "../api-config";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { userId } from "../components/UserId";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";
import Cookies from "js-cookie";
import RateTooltip from "../ui/Tooltip";
import mixpanel from "mixpanel-browser";

// Professional medical styling with mobile responsiveness
const medicalStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .appointment-summary-card {
    background: #ffffff;
    border: 1px solid #e8eaed;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
  }
  
  .appointment-summary-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
  
  .medical-blue {
    color: #1976d2;
  }
  
  .medical-green {
    color: #2e7d4f;
  }
  
  .trust-indicator {
    background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);
    border-left: 4px solid #1976d2;
  }
  
  .phone-input {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 3rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: #ffffff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  .phone-input:focus-within {
    border-color: #00415e;
    box-shadow: 0 0 0 0.2rem rgba(0, 65, 94, 0.15);
  }
  
  .phone-input .PhoneInputCountry {
    display: flex;
    align-items: center;
    padding: 0 0.65rem;
    border-right: 1px solid #e2e6ea;
    background-color: transparent;
  }
  
  .phone-input .PhoneInputCountrySelect {
    color: #00415e;
    font-weight: 600;
  }
  
  .phone-input .PhoneInputCountrySelect:focus {
    outline: none;
  }
  
  .phone-input .PhoneInputInput {
    flex: 1;
    border: none;
    padding: 0.65rem 0.85rem;
    font-size: 1rem;
    height: 100%;
    color: #212529;
    background: transparent;
  }
  
  .phone-input .PhoneInputInput:focus {
    outline: none;
  }
  
  .phone-input .PhoneInputInput::placeholder {
    color: #9aa0a6;
  }
  
  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .appointment-modal-dialog {
      margin: 10px !important;
      max-width: calc(100% - 20px) !important;
      position: relative;
      z-index: 10000;
    }
    
    .appointment-modal-content {
      border-radius: 12px !important;
      display: flex;
      flex-direction: column;
    }
    
    .appointment-modal-header {
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 10;
      background: white;
      border-bottom: 1px solid #e9ecef;
      padding: 15px 20px !important;
    }
    
    .appointment-modal-header h5 {
      font-size: 1.1rem !important;
    }
    
    .appointment-modal-body {
      padding: 15px 20px !important;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }
    
    .appointment-info-card {
      margin-bottom: 15px !important;
    }
    
    .appointment-info-text {
      font-size: 0.75rem !important;
    }
    
    .appointment-calendar-container {
      padding: 10px !important;
    }
    
    .appointment-time-slots-container {
      padding: 10px !important;
      max-height: 250px !important;
    }
    
    .appointment-time-slot {
      min-width: 75px !important;
      font-size: 0.8rem !important;
      padding: 6px 10px !important;
    }
    
    .appointment-summary-mobile {
      margin-top: 20px !important;
    }
    
    .appointment-summary-icon {
      width: 32px !important;
      height: 32px !important;
      font-size: 0.8rem !important;
    }
    
    .appointment-summary-label {
      font-size: 0.65rem !important;
    }
    
    .appointment-summary-value {
      font-size: 0.85rem !important;
    
    }
    
    .appointment-summary-fee {
      font-size: 0.95rem !important;
    }
    
    .appointment-book-btn-mobile {
      width: 100% !important;
      margin-top: 20px !important;
      font-size: 0.95rem !important;
    }
    
    .appointment-trust-text {
      font-size: 0.75rem !important;
    }
    
    .appointment-ready-indicator {
      font-size: 0.8rem !important;
      padding: 8px 16px !important;
    }
    
    /* Calendar specific mobile styles */
    .MuiPickersCalendarHeader-root {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
    
    .MuiDayPicker-monthContainer {
      min-height: 180px !important;
    }
    
    .MuiPickersDay-root {
      width: 32px !important;
      height: 32px !important;
      font-size: 0.8rem !important;
    }
    
    .MuiPickersCalendarHeader-label {
      font-size: 0.9rem !important;
    }
    
    .MuiIconButton-root {
      padding: 6px !important;
    }
  }
  
  @media (max-width: 480px) {
    .appointment-modal-dialog {
      margin: 5px !important;
      max-width: calc(100% - 10px) !important;
    }
    
    .appointment-modal-header {
      padding: 12px 15px !important;
    }
    
    .appointment-modal-body {
      padding: 12px 15px !important;
    }
    
    .appointment-summary-container {
      flex-direction: column !important;
      gap: 10px !important;
    }
    
    .appointment-time-slot {
      min-width: 70px !important;
      font-size: 0.75rem !important;
      padding: 5px 8px !important;
    }
    
    .MuiPickersDay-root {
      width: 28px !important;
      height: 28px !important;
      font-size: 0.75rem !important;
    }
  }
`;

// Inject styles into document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = medicalStyles;
  document.head.appendChild(styleSheet);
}

// Custom Day Highlighting with improved styling
const CustomDay = styled(PickersDay)(
  ({ theme, day, selectedDate, isHighlighted }) => ({
    ...(selectedDate &&
      day.format("YYYY-MM-DD") === selectedDate && {
        backgroundColor: "#00415e",
        color: "#fff",
        borderRadius: "50%",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#00314b",
          transform: "scale(1.1)",
          transition: "all 0.2s ease",
        },
      }),
    ...(isHighlighted && {
      backgroundColor: "#ff6b6b",
      color: "#fff",
      borderRadius: "50%",
      "&:hover": {
        backgroundColor: "#ff5252",
      },
    }),
  })
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AppointmentModal = ({ show, onHide, alertBooking, docId }) => {
  const initialUserId = userId ? parseInt(userId, 10) : null;
  const [activeUserId, setActiveUserId] = useState(initialUserId);
  const [registrationCompleted, setRegistrationCompleted] = useState(
    Boolean(initialUserId)
  );
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccessMessage, setRegistrationSuccessMessage] =
    useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showExistingAccountPrompt, setShowExistingAccountPrompt] =
    useState(false);
  const [existingAccountPassword, setExistingAccountPassword] = useState("");
  const [existingAccountLoading, setExistingAccountLoading] = useState(false);
  const [existingAccountError, setExistingAccountError] = useState(null);

  const today = dayjs();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [amount, setAmount] = useState(null);
  const [unbookedSlots, setUnbookedSlot] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const modalRef = useRef(null);
  const bookingButtonRef = useRef(null);
  const calendarSectionRef = useRef(null);
  const modalOpenedRef = useRef(false);

  const trackEvent = useCallback(
    (eventName, props = {}) => {
      try {
        mixpanel?.track?.(eventName, {
          docId,
          userId: activeUserId || null,
          ...props,
        });
      } catch (trackingError) {
        console.warn("Mixpanel tracking failed:", trackingError);
      }
    },
    [docId, activeUserId]
  );

  const requiresRegistration = !registrationCompleted;
  const showRegistrationCard =
    requiresRegistration ||
    showExistingAccountPrompt ||
    Boolean(registrationSuccessMessage);

  const handleTimeSlot = useCallback(
    (time) => {
      if (!registrationCompleted) {
        setError("Please complete registration before selecting a time slot.");
        return;
      }

      setSelectedTimeSlot(time);
      setError(null); // Clear any previous errors when selecting a new time slot
      trackEvent("Appointment Time Selected", {
        selectedTimeSlot: time,
        selectedDate,
      });

      // Auto-scroll to show booking button after time selection
      setTimeout(() => {
        // Use ref if available, otherwise try querySelector
        const bookingButton =
          bookingButtonRef.current ||
          document.querySelector('button[onClick="bookAppn"]');
        if (bookingButton) {
          bookingButton.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        } else {
          // Fallback: scroll the modal content to bottom
          const modalElement =
            modalRef.current || document.querySelector(".modal-content");
          if (modalElement) {
            modalElement.scrollTo({
              top: modalElement.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      }, 400); // Increased delay to ensure DOM updates are complete
    },
    [registrationCompleted, selectedDate, trackEvent]
  );
  const [currency, setCurrency] = useState("₹");
  const [paid, setPaid] = useState(false);
  const disableDate = useCallback(
    (date) => {
      const currentDate = dayjs().startOf("day");
      const checkDate = dayjs(date).startOf("day");
      const isPastDate = checkDate.isBefore(currentDate);
      const isBooked = highlightedDays.includes(date.format("YYYY-MM-DD"));
      const isUnavail = unavailableDates?.includes(date.format("YYYY-MM-DD"));
      return isPastDate || isBooked || isUnavail;
    },
    [highlightedDays, unavailableDates]
  );

  const fetchAppointmentDetails = useCallback(
    async (date, overrideUserId, options = {}) => {
      const bookingUserId = overrideUserId ?? activeUserId;
      if (!docId || !bookingUserId) return;

      const { autoSelect } = options;
      const shouldAutoSelect =
        typeof autoSelect === "boolean" ? autoSelect : !date && !selectedDate;

      setLoadingSlots(true);
      setError(null);

      try {
        const response = await fetch(
          `${backendHost}/appointments/get/Slots/${docId}/${bookingUserId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointment slots");
        }

        const json = await response.json();
        setCurrency(json.currency_symbol);
        setPaid(json.isPaid);
        const highlightedDate = json.completelyBookedDates || [];
        setHighlightedDays(highlightedDate);

        const totalDates = Object.keys(json.totalDates || {});

        const generateDateRange = (startDate, endDate) => {
          const dates = [];
          let currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().slice(0, 10));
            currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
          }
          return dates;
        };

        // Generate all possible dates for the next 30 days
        const currentDate = new Date();
        const next30Days = new Date(
          currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const allPossibleDates = generateDateRange(currentDate, next30Days);

        // Find the missing dates
        const missingDates = allPossibleDates.filter(
          (date) => !totalDates.includes(date)
        );
        setUnavailableDates(missingDates);

        const availableEntries = Object.entries(
          json.unbookedSlots || {}
        ).filter(([, slots]) => Array.isArray(slots) && slots.length > 0);

        if (shouldAutoSelect && availableEntries.length > 0) {
          const sortedEntries = [...availableEntries].sort(
            ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
          );
          const [firstDate, slots] = sortedEntries[0];

          if (selectedDate !== firstDate) {
            setSelectedDate(firstDate);
          }

          setUnbookedSlot(slots);

          if (
            slots.length > 0 &&
            (!selectedTimeSlot || !slots.includes(selectedTimeSlot))
          ) {
            setSelectedTimeSlot(slots[0]);
          }
        } else {
          const targetDate = date || selectedDate;
          const slotsForDateRaw =
            targetDate && json.unbookedSlots
              ? json.unbookedSlots[targetDate] || []
              : [];
          const slotsForDate = Array.isArray(slotsForDateRaw)
            ? slotsForDateRaw
            : [];

          setUnbookedSlot(slotsForDate);

          if (selectedTimeSlot && !slotsForDate.includes(selectedTimeSlot)) {
            setSelectedTimeSlot("");
          }
        }

        setAmount(json.amount);
        setAppointmentData(json);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setError("Failed to load appointment slots. Please try again.");
      } finally {
        setLoadingSlots(false);
      }
    },
    [docId, activeUserId, selectedDate, selectedTimeSlot]
  );

  const handleExistingAccountLogin = useCallback(
    async (event) => {
      event.preventDefault();
      if (existingAccountLoading) return;

      setExistingAccountError(null);
      setError(null);

      if (!email || !existingAccountPassword) {
        setExistingAccountError("Enter your password to continue.");
        return;
      }

      try {
        setExistingAccountLoading(true);
        axios.defaults.withCredentials = true;
        trackEvent("Appointment Login Attempt", {
          emailDomain: email ? email.split("@")[1] || "" : "",
        });
        const loginResponse = await axios.post(
          `${backendHost}/login?cmd=login&email=${encodeURIComponent(
            email.trim()
          )}&psw=${encodeURIComponent(existingAccountPassword)}&rempwd=1`
        );

        if (loginResponse.data?.registration_id) {
          const loginData = loginResponse.data;
          const loggedInUserId = loginData.registration_id;

          if (loginData.first_name) {
            Cookies.set("uName", loginData.first_name, { expires: 365 });
          }
          if (loginData.docID) {
            localStorage.setItem("doctorid", `${loginData.docID}`);
          }
          if (loginData.value) {
            localStorage.setItem("token", loginData.value);
          }

          setActiveUserId(loggedInUserId);
          trackEvent("Appointment Login Success", {
            registrationId: loggedInUserId,
          });
          setRegistrationCompleted(true);
          setShowExistingAccountPrompt(false);
          setExistingAccountPassword("");
          setExistingAccountError(null);
          setRegistrationSuccessMessage(
            "Welcome back! You're ready to pick a slot."
          );
          await fetchAppointmentDetails(selectedDate, loggedInUserId, {
            autoSelect: true,
          });
        } else {
          setExistingAccountError(
            "Incorrect email or password. Please try again."
          );
          trackEvent("Appointment Login Failed", {
            reason: "invalid-credentials",
          });
        }
      } catch (loginException) {
        console.error("Existing account login error:", loginException);
        const msg =
          loginException.response?.data &&
          typeof loginException.response.data === "string" &&
          loginException.response.data.includes("Incorrect email")
            ? "Incorrect email or password. Please try again."
            : "Sign-in failed. Please try again.";
        setExistingAccountError(msg);
        trackEvent("Appointment Login Failed", {
          reason: "api-error",
          message:
            typeof loginException?.response?.data === "string"
              ? loginException.response.data
              : "",
        });
      } finally {
        setExistingAccountLoading(false);
      }
    },
    [
      existingAccountLoading,
      email,
      existingAccountPassword,
      fetchAppointmentDetails,
      selectedDate,
      trackEvent,
    ]
  );

  useEffect(() => {
    if (registrationSuccessMessage && calendarSectionRef.current) {
      calendarSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      const timer = setTimeout(() => setRegistrationSuccessMessage(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccessMessage]);

  const handleRegistration = useCallback(
    async (event) => {
      event.preventDefault();
      if (registrationLoading) return;

      setRegistrationError(null);
      setRegistrationSuccessMessage("");
      setExistingAccountError(null);
      setShowExistingAccountPrompt(false);

      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedEmail = email.trim();
      const emailDomain = trimmedEmail.split("@")[1] || "";

      if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !phone) {
        setRegistrationError("Please fill in all required fields.");
        trackEvent("Appointment Registration Failed", {
          reason: "missing-fields",
        });
        return;
      }

      if (!emailRegex.test(trimmedEmail)) {
        setRegistrationError("Please enter a valid email address.");
        trackEvent("Appointment Registration Failed", {
          reason: "invalid-email",
        });
        return;
      }

      if (!isValidPhoneNumber(phone)) {
        setRegistrationError("Please enter a valid phone number.");
        trackEvent("Appointment Registration Failed", {
          reason: "invalid-phone",
        });
        return;
      }

      setRegistrationLoading(true);
      trackEvent("Appointment Registration Started", {
        emailDomain,
      });

      let countryDialCode = "";
      let nationalNumber = "";

      try {
        const parsedPhone = parsePhoneNumber(phone);
        if (parsedPhone) {
          countryDialCode = parsedPhone.countryCallingCode
            ? `+${parsedPhone.countryCallingCode}`
            : "";
          nationalNumber = parsedPhone.nationalNumber
            ? String(parsedPhone.nationalNumber)
            : "";
        }
      } catch (phoneParseError) {
        console.warn("Phone parse error:", phoneParseError);
        setRegistrationError("Please enter a valid phone number.");
        setRegistrationLoading(false);
        return;
      }

      if (!nationalNumber) {
        setRegistrationError("Please enter a valid phone number.");
        setRegistrationLoading(false);
        return;
      }

      const payload = {
        firstname: trimmedFirstName,
        lastname: trimmedLastName,
        email: trimmedEmail,
        number: nationalNumber,
        country_code: countryDialCode,
      };

      try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(
          `${backendHost}/registration/add/auto`,
          payload,
          {
            headers: {
              "Access-Control-Allow-Credentials": true,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        const responseMessage =
          typeof data === "string"
            ? data
            : typeof data?.message === "string"
            ? data.message
            : "";

        const isEmailDuplicate =
          typeof responseMessage === "string" &&
          responseMessage
            .toLowerCase()
            .includes("email address already exists");

        const isExplicitFailure =
          typeof data === "object" &&
          data !== null &&
          Object.prototype.hasOwnProperty.call(data, "success") &&
          data.success === false;

        if (typeof data === "string" || isExplicitFailure) {
          if (isEmailDuplicate) {
            setShowExistingAccountPrompt(true);
            setExistingAccountPassword("");
            setExistingAccountError(null);
            setRegistrationError(null);
            trackEvent("Appointment Registration Failed", {
              reason: "duplicate-email",
            });
          } else if (responseMessage) {
            setRegistrationError(responseMessage);
            trackEvent("Appointment Registration Failed", {
              reason: "api-error",
              message: responseMessage,
            });
          } else {
            setRegistrationError("Registration failed. Please try again.");
            trackEvent("Appointment Registration Failed", {
              reason: "unknown-error",
            });
          }
          return;
        }

        const userPayload =
          typeof data === "object" && data !== null ? data.user || {} : {};

        const extractedRegistrationId =
          data?.registration_id ??
          data?.registrationId ??
          data?.registrationID ??
          userPayload?.registration_id ??
          userPayload?.registrationId ??
          userPayload?.registrationID ??
          null;

        if (!extractedRegistrationId) {
          setRegistrationError(
            "Registration failed. Please try again in a moment."
          );
          trackEvent("Appointment Registration Failed", {
            reason: "missing-registration-id",
          });
          return;
        }

        const newUserId = extractedRegistrationId;
        const successMessage =
          typeof data?.message === "string" && data.message
            ? data.message
            : "Registration successful. You’re all set to pick a slot.";

        setShowExistingAccountPrompt(false);
        setActiveUserId(newUserId);
        trackEvent("Appointment Registration Success", {
          registrationId: newUserId,
          autoLoggedIn: Boolean(userPayload.pass_word),
        });
        setRegistrationCompleted(true);
        setRegistrationSuccessMessage(successMessage);

        if (userPayload.first_name || trimmedFirstName) {
          Cookies.set("uName", userPayload.first_name || trimmedFirstName, {
            expires: 365,
          });
        }
        if (userPayload.docID) {
          localStorage.setItem("doctorid", `${userPayload.docID}`);
        }
        if (userPayload.value) {
          localStorage.setItem("token", userPayload.value);
        }

        let effectiveUserId = newUserId;

        const autoLoginPassword =
          typeof userPayload.pass_word === "string"
            ? userPayload.pass_word
            : "";
        if (autoLoginPassword) {
          try {
            axios.defaults.withCredentials = true;
            const loginResponse = await axios.post(
              `${backendHost}/login?cmd=login&email=${encodeURIComponent(
                trimmedEmail
              )}&psw=${encodeURIComponent(autoLoginPassword)}&rempwd=1`
            );

            if (loginResponse.data?.registration_id) {
              const loginData = loginResponse.data;
              if (loginData.first_name) {
                Cookies.set("uName", loginData.first_name, { expires: 365 });
              }
              if (loginData.docID) {
                localStorage.setItem("doctorid", `${loginData.docID}`);
              }
              if (loginData.value) {
                localStorage.setItem("token", loginData.value);
              }
              effectiveUserId = loginData.registration_id;
              setActiveUserId(loginData.registration_id);
            }
          } catch (autoLoginError) {
            console.warn(
              "Auto-login after registration failed:",
              autoLoginError
            );
          }
        }

        await fetchAppointmentDetails(selectedDate, effectiveUserId, {
          autoSelect: true,
        });
      } catch (registrationException) {
        console.error("Registration error:", registrationException);
        const responseData = registrationException.response?.data;
        const responseMessage =
          typeof responseData === "string"
            ? responseData
            : typeof responseData?.message === "string"
            ? responseData.message
            : "";
        const duplicateEmail =
          typeof responseMessage === "string" &&
          responseMessage
            .toLowerCase()
            .includes("email address already exists");

        if (duplicateEmail) {
          setShowExistingAccountPrompt(true);
          setExistingAccountPassword("");
          setExistingAccountError(null);
          setRegistrationError(null);
          trackEvent("Appointment Registration Failed", {
            reason: "duplicate-email",
          });
        } else if (responseMessage) {
          setRegistrationError(responseMessage);
          trackEvent("Appointment Registration Failed", {
            reason: "api-error",
            message: responseMessage,
          });
        } else {
          setRegistrationError(
            "Something went wrong while registering. Please try again."
          );
          trackEvent("Appointment Registration Failed", {
            reason: "unknown-error",
          });
        }
      } finally {
        setRegistrationLoading(false);
      }
    },
    [
      registrationLoading,
      firstName,
      lastName,
      email,
      phone,
      fetchAppointmentDetails,
      selectedDate,
      trackEvent,
    ]
  );

  useEffect(() => {
    const isRegistered = Boolean(activeUserId);
    setRegistrationCompleted(isRegistered);
    if (isRegistered) {
      setShowExistingAccountPrompt(false);
    }
  }, [activeUserId]);

  useEffect(() => {
    if (show && docId && activeUserId) {
      fetchAppointmentDetails(selectedDate);
    }
  }, [show, docId, selectedDate, activeUserId, fetchAppointmentDetails]);

  const bookAppn = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError(null);

    if (!activeUserId) {
      setError("Please complete registration before booking an appointment.");
      trackEvent("Appointment Booking Blocked", {
        reason: "missing-user",
      });
      setBookingLoading(false);
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      setError("Please select both a date and a time slot to continue.");
      trackEvent("Appointment Booking Blocked", {
        reason: "missing-date-or-time",
      });
      setBookingLoading(false);
      return;
    }

    try {
      trackEvent("Appointment Booking Initiated", {
        selectedDate,
        selectedTimeSlot,
        amount: amount?.totalFee,
        currency,
      });
      const numericUserId = parseInt(activeUserId, 10);
      const response = await axios.post(`${backendHost}/appointments/create`, {
        docID: docId,
        userID: numericUserId,
        appointmentDate: selectedDate,
        startTime: selectedTimeSlot,
        paymentStatus: 0,
        amount: amount.totalFee,
        currency: "INR",
      });

      const responseObject = response.data;
      console.log("responseObject", responseObject);
      localStorage.setItem("encKey", responseObject.encRequest);
      localStorage.setItem("apiResponse", JSON.stringify(response.data));

      if (responseObject.Count == 0) {
        trackEvent("Appointment Booking Success", {
          selectedDate,
          selectedTimeSlot,
          paymentStatus: "not-required",
        });
        window.location.href = "/booking-successful";
        return;
      }

      trackEvent("Appointment Booking Redirecting", {
        selectedDate,
        selectedTimeSlot,
        paymentStatus: "gateway",
      });
      const redirectURL = `https://www.all-cures.com/paymentRedirection?encRequest=${responseObject.encRequest}&accessCode=AVWN42KL59BP42NWPB`;
      window.location.href = redirectURL;
    } catch (error) {
      console.error("Error while booking appointment:", error);
      trackEvent("Appointment Booking Failed", {
        selectedDate,
        selectedTimeSlot,
        message:
          typeof error?.response?.data === "string"
            ? error.response.data
            : "request-error",
      });
      setError("Failed to book the appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDatesChange = useCallback(
    (newValue) => {
      if (!registrationCompleted) {
        setError("Complete a quick registration to unlock available dates.");
        return;
      }

      const formattedDate = newValue.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      setSelectedTimeSlot(""); // Reset time slot when date changes
      setError(null); // Clear errors when date changes
      trackEvent("Appointment Date Selected", {
        selectedDate: formattedDate,
      });
    },
    [registrationCompleted, trackEvent]
  );

  const formatTimeSlot = useCallback((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes < 10 ? "0" : ""}${minutes} ${suffix}`;
  }, []);

  const handleModalClose = useCallback(() => {
    trackEvent("Appointment Modal Closed");
    modalOpenedRef.current = false;
    setSelectedDate(null);
    setSelectedTimeSlot("");
    setError(null);
    setBookingLoading(false);
    setLoadingSlots(false);
    setRegistrationError(null);
    setRegistrationSuccessMessage("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRegistrationLoading(false);
    setShowExistingAccountPrompt(false);
    setExistingAccountPassword("");
    setExistingAccountError(null);
    setExistingAccountLoading(false);
    onHide();
  }, [onHide, trackEvent]);

  // Handle escape key and backdrop click
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && show) {
        handleModalClose();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [show, handleModalClose]);

  useEffect(() => {
    if (show && !modalOpenedRef.current) {
      trackEvent("Appointment Modal Opened");
      modalOpenedRef.current = true;
    } else if (!show) {
      modalOpenedRef.current = false;
    }
  }, [show, trackEvent]);

  return createPortal(
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{
        display: show ? "block" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1050,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(2px)",
      }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="appointment-modal-title"
      aria-hidden={!show}
    >
      <div
        className="modal-dialog modal-dialog-centered appointment-modal-dialog"
        role="document"
        style={{
          maxWidth: "95%",
          width: "95%",
          margin: "2.5% auto",
        }}
      >
        <div
          className="modal-content shadow-lg border-0 appointment-modal-content"
          ref={modalRef}
        >
          <div className="modal-header text-black appointment-modal-header">
            <h5
              className="modal-title font-weight-bold d-flex align-items-center"
              id="appointment-modal-title"
            >
              <CalendarTodayIcon
                className="mr-2"
                style={{ fontSize: "1.2rem" }}
              />
              Schedule Your Appointment
            </h5>
            <button
              type="button"
              className="close text-white"
              onClick={handleModalClose}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                opacity: 0.8,
                transition: "opacity 0.2s",
                marginRight: "10px",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "1")}
              onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body p-4 appointment-modal-body">
            {showRegistrationCard && (
              <div className="border rounded-3 bg-white shadow-sm p-3 p-lg-4 mb-4">
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Badge variant="primary" className="mr-2">
                      Step 1 of 2
                    </Badge>
                    <span className="font-weight-bold text-dark">
                      {showExistingAccountPrompt
                        ? "Sign in to continue"
                        : "Create your booking profile"}
                    </span>
                  </div>
                  <small className="text-muted mt-2 mt-sm-0">
                    {showExistingAccountPrompt
                      ? "Use your All Cures password to access booking."
                      : "Takes less than a minute to finish."}
                  </small>
                </div>

                <div className="mt-3">
                  {showExistingAccountPrompt ? (
                    <>
                      <Alert
                        variant="info"
                        className="d-flex align-items-center mb-3"
                      >
                        <CheckCircleIcon className="mr-2" />
                        We found your account. Sign in to continue booking.
                      </Alert>
                      <form onSubmit={handleExistingAccountLogin}>
                        <div className="row g-3">
                          <div className="col-12 col-md-6">
                            <label className="text-muted small mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              inputMode="email"
                              autoComplete="email"
                              autoFocus={!email}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label className="text-muted small mb-1">
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Enter password"
                              autoComplete="current-password"
                              value={existingAccountPassword}
                              onChange={(e) =>
                                setExistingAccountPassword(e.target.value)
                              }
                              autoFocus={Boolean(email)}
                              required
                            />
                          </div>
                        </div>
                        {existingAccountError && (
                          <Alert
                            variant="danger"
                            className="mt-3 mb-0 d-flex align-items-center"
                          >
                            <ErrorIcon className="mr-2" />
                            {existingAccountError}
                          </Alert>
                        )}
                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mt-4">
                          <Button
                            variant="link"
                            type="button"
                            className="px-0 mb-3 mb-md-0"
                            onClick={() => {
                              setShowExistingAccountPrompt(false);
                              setExistingAccountPassword("");
                              setExistingAccountError(null);
                              setRegistrationError(null);
                            }}
                          >
                            Use a different email
                          </Button>
                          <div className="d-flex flex-column flex-md-row align-items-md-center">
                            <Button
                              variant="link"
                              type="button"
                              className="px-0 mr-md-3 mb-2 mb-md-0"
                              onClick={() => {
                                if (typeof window !== "undefined") {
                                  window.location.href = "/loginForm/verify";
                                }
                              }}
                            >
                              Forgot password?
                            </Button>
                            <Button
                              type="submit"
                              disabled={existingAccountLoading}
                              className="px-4 py-2"
                              style={{
                                backgroundColor: "#1976d2",
                                borderColor: "#1976d2",
                              }}
                            >
                              {existingAccountLoading ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    className="mr-2"
                                  />
                                  Signing in...
                                </>
                              ) : (
                                "Sign in & Continue"
                              )}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </>
                  ) : requiresRegistration ? (
                    <form onSubmit={handleRegistration}>
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label className="text-muted small mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            autoFocus
                            inputMode="text"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="text-muted small mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Last name"
                            inputMode="text"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="text-muted small mb-1">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email address"
                            inputMode="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="text-muted small mb-1">
                            Mobile Number
                          </label>
                          <PhoneInput
                            international
                            defaultCountry="IN"
                            value={phone}
                            onChange={setPhone}
                            countryCallingCodeEditable={false}
                            inputProps={{
                              name: "phone",
                              autoComplete: "tel",
                              required: true,
                            }}
                            className="phone-input"
                            placeholder="Enter mobile number"
                          />
                        </div>
                      </div>
                      {registrationError && (
                        <Alert
                          variant="danger"
                          className="mt-3 mb-0 d-flex align-items-center"
                        >
                          <ErrorIcon className="mr-2" />
                          {registrationError}
                        </Alert>
                      )}
                      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mt-4">
                        <small className="text-muted mb-3 mb-md-0">
                          We’ll send appointment updates to this email and
                          number.
                        </small>
                        <div className="d-flex flex-column flex-md-row align-items-md-center">
                          <Button
                            variant="link"
                            type="button"
                            className="px-0 mb-2 mb-md-0 mr-md-3"
                            onClick={() => {
                              setShowExistingAccountPrompt(true);
                              setExistingAccountPassword("");
                              setExistingAccountError(null);
                              setRegistrationError(null);
                            }}
                          >
                            I already have an account
                          </Button>
                          <Button
                            type="submit"
                            disabled={registrationLoading}
                            className="px-4 py-2"
                            style={{
                              backgroundColor: "#1976d2",
                              borderColor: "#1976d2",
                            }}
                          >
                            {registrationLoading ? (
                              <>
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  className="mr-2"
                                />
                                Registering...
                              </>
                            ) : (
                              "Register & Continue"
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <Alert
                      variant="success"
                      className="mb-0 d-flex flex-column flex-md-row align-items-md-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <CheckCircleIcon className="mr-2" />
                        <span>{registrationSuccessMessage}</span>
                      </div>
                      <div className="mt-3 mt-md-0 text-muted small">
                        We’ve emailed your login details. You can now pick a
                        slot.
                      </div>
                    </Alert>
                  )}
                </div>
              </div>
            )}

            {!registrationCompleted && !showExistingAccountPrompt && (
              <div className="mb-3 px-3 py-2 bg-light border rounded text-muted small">
                Finish Step 1 to unlock the calendar and time slots.
              </div>
            )}

            <div ref={calendarSectionRef}>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <Badge variant="secondary" className="mr-2">
                    Step 2 of 2
                  </Badge>
                  <span className="font-weight-bold text-dark">
                    Schedule your appointment
                  </span>
                </div>
                <small className="text-muted mt-2 mt-sm-0">
                  {registrationCompleted
                    ? "Pick a date to see the latest availability."
                    : "Complete Step 1 above to activate booking."}
                </small>
              </div>

              <div
                style={{
                  opacity: registrationCompleted ? 1 : 0.65,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Instructions */}
                <div
                  className="alert alert-info mb-4 appointment-info-card"
                  role="alert"
                >
                  <div className="d-flex align-items-center">
                    <CheckCircleIcon
                      className="mr-2"
                      style={{ fontSize: "1.1rem" }}
                    />
                    <div className="appointment-info-text">
                      <strong>How to book:</strong> Select a date from the
                      calendar, then choose an available time slot. Red dates
                      are fully booked, and gray dates are unavailable.
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* Date Picker */}
                  <div className="col-12 col-lg-6 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 d-flex align-items-center">
                          <CalendarTodayIcon className="mr-2" />
                          Select Date
                        </h6>
                      </div>
                      <div className="card-body p-3 appointment-calendar-container">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <StaticDatePicker
                              defaultValue={today}
                              minDate={today}
                              maxDate={today.add(1, "month")}
                              slots={{
                                actionBar: () => null,
                                day: (props) => (
                                  <CustomDay
                                    {...props}
                                    selected={
                                      selectedDate &&
                                      props.day.format("YYYY-MM-DD") ===
                                        selectedDate
                                    }
                                    isHighlighted={highlightedDays.includes(
                                      props.day.format("YYYY-MM-DD")
                                    )}
                                  />
                                ),
                              }}
                              slotProps={{ day: { highlightedDays } }}
                              onChange={handleDatesChange}
                              showToolbar={false}
                              shouldDisableDate={disableDate}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>

                  {/* Time Slot Section */}
                  <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 d-flex align-items-center">
                          <AccessTimeIcon className="mr-2" />
                          Select Time
                        </h6>
                      </div>
                      <div className="card-body p-3 appointment-time-slots-container">
                        {!selectedDate ? (
                          <div className="text-center text-muted py-5">
                            <AccessTimeIcon
                              style={{ fontSize: "2.5rem", opacity: 0.3 }}
                            />
                            <p className="mt-3 appointment-info-text">
                              Please select a date first
                            </p>
                          </div>
                        ) : loadingSlots ? (
                          <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3 appointment-info-text">
                              Loading available slots...
                            </p>
                          </div>
                        ) : unbookedSlots && unbookedSlots.length > 0 ? (
                          <>
                            <div className="mb-3">
                              <Badge
                                variant="info"
                                className="mb-2 appointment-info-text"
                              >
                                {unbookedSlots.length} slot
                                {unbookedSlots.length !== 1 ? "s" : ""}{" "}
                                available
                              </Badge>
                            </div>
                            <div
                              className="d-flex flex-wrap justify-content-center"
                              style={{
                                gap: "8px",
                                maxHeight: "300px",
                                overflowY: "auto",
                              }}
                            >
                              {unbookedSlots.map((time, index) => {
                                const formattedTime = formatTimeSlot(time);
                                const isSelected = selectedTimeSlot === time;

                                return (
                                  <Button
                                    key={index}
                                    onClick={() => handleTimeSlot(time)}
                                    variant={
                                      isSelected ? "primary" : "outline-primary"
                                    }
                                    size="sm"
                                    className="position-relative appointment-time-slot"
                                    style={{
                                      minWidth: "90px",
                                      transition: "all 0.2s ease",
                                      transform: isSelected
                                        ? "scale(1.05)"
                                        : "scale(1)",
                                    }}
                                  >
                                    {formattedTime}
                                  </Button>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-muted py-5">
                            <ErrorIcon
                              style={{ fontSize: "2.5rem", opacity: 0.3 }}
                            />
                            <p className="mt-3 appointment-info-text">
                              No available slots for this date
                            </p>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => setSelectedDate(null)}
                              className="appointment-info-text"
                            >
                              Choose Different Date
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Appointment Summary */}
                {(selectedDate || selectedTimeSlot) && (
                  <div
                    className="appointment-summary-card mt-4 appointment-summary-mobile"
                    style={{ animation: "fadeInUp 0.3s ease-out" }}
                  >
                    <div className="trust-indicator p-3 mb-0">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-0 font-weight-600 text-dark appointment-info-text">
                          Appointment Details
                        </h6>
                        <div
                          className="d-flex align-items-center text-muted appointment-trust-text"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <CheckCircleIcon
                            style={{
                              fontSize: "0.9rem",
                              marginRight: "4px",
                              color: "#1976d2",
                            }}
                          />
                          Secure Booking
                        </div>
                      </div>
                    </div>

                    <div className="card-body pt-3 pb-4">
                      <div className="row g-3 appointment-summary-container">
                        {selectedDate && (
                          <div className="col-12 col-md-4">
                            <div
                              className="d-flex align-items-center p-3 border rounded-3"
                              style={{
                                backgroundColor: "#f8fbff",
                                borderColor: "#e3f2fd !important",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle me-3 appointment-summary-icon"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  fontSize: "0.9rem",
                                }}
                              >
                                <CalendarTodayIcon
                                  style={{ fontSize: "1.1rem" }}
                                />
                              </div>
                              <div className="ml-2">
                                <div
                                  className="text-muted appointment-summary-label"
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  Appointment Date
                                </div>
                                <div
                                  className="font-weight-bold text-dark appointment-summary-value "
                                  style={{ fontSize: "0.95rem" }}
                                >
                                  {dayjs(selectedDate).format("MMM DD, YYYY")}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedTimeSlot && (
                          <div className="col-12 col-md-4">
                            <div
                              className="d-flex align-items-center p-3 border rounded-3"
                              style={{
                                backgroundColor: "#f8fbff",
                                borderColor: "#e3f2fd !important",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle me-3 appointment-summary-icon"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                }}
                              >
                                <AccessTimeIcon
                                  style={{ fontSize: "1.1rem" }}
                                />
                              </div>
                              <div className="ml-2">
                                <div
                                  className="text-muted appointment-summary-label"
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  Scheduled Time
                                </div>
                                <div
                                  className="font-weight-bold text-dark appointment-summary-value"
                                  style={{ fontSize: "1rem" }}
                                >
                                  {formatTimeSlot(selectedTimeSlot)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {amount && (
                          <div className="col-12 col-md-4">
                            <div
                              className="d-flex align-items-center p-3 border rounded-3"
                              style={{
                                backgroundColor: "#fffbf0",
                                borderColor: "#fff3cd !important",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle me-3 appointment-summary-icon"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#f57c00",
                                  color: "white",
                                }}
                              >
                                {currency}
                              </div>
                              <div className="ml-2">
                                <div
                                  className="text-muted appointment-summary-label"
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  Consultation Fee
                                </div>
                                <div
                                  className="font-weight-bold appointment-summary-fee"
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "#f57c00",
                                  }}
                                >
                                  {paid ? (
                                    <>
                                      {currency} {amount.totalFee}
                                      <RateTooltip
                                        title={
                                          <>
                                            <strong>Base Fee:</strong> ₹
                                            {amount?.baseFee} <br />
                                            <strong>Platform Fee:</strong> ₹
                                            {amount?.etheriumPart} <br />
                                            <strong>GST:</strong> ₹{amount?.gst}{" "}
                                            <br />
                                          </>
                                        }
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <span>
                                        Free{" "}
                                        <span
                                          style={{
                                            fontSize: "0.55rem",
                                            color: "#6c757d",
                                          }}
                                        >
                                          (First two consultations are free)
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Book Appointment Button */}
                {selectedTimeSlot && (
                  <div className="text-center mt-4">
                    <Button
                      ref={bookingButtonRef}
                      size="lg"
                      onClick={bookAppn}
                      disabled={bookingLoading}
                      className="px-5 py-3 appointment-book-btn-mobile"
                      style={{
                        backgroundColor: "#1976d2",
                        borderColor: "#1976d2",
                        color: "white",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "1rem",
                        minWidth: "200px",
                        boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                        transition: "all 0.2s ease",
                        border: "2px solid #1976d2",
                      }}
                      onMouseEnter={(e) => {
                        if (!bookingLoading) {
                          e.target.style.backgroundColor = "#1565c0";
                          e.target.style.borderColor = "#1565c0";
                          e.target.style.boxShadow =
                            "0 4px 12px rgba(25, 118, 210, 0.3)";
                          e.target.style.transform = "translateY(-1px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!bookingLoading) {
                          e.target.style.backgroundColor = "#1976d2";
                          e.target.style.borderColor = "#1976d2";
                          e.target.style.boxShadow =
                            "0 2px 8px rgba(25, 118, 210, 0.2)";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {bookingLoading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="mr-2"
                          />
                          Processing Payment...
                        </>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                          <CheckCircleIcon
                            style={{ fontSize: "1.1rem", marginRight: "8px" }}
                          />
                          Book Appointment
                        </div>
                      )}
                    </Button>
                    <div
                      className="mt-2 text-muted appointment-trust-text"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Secure payment powered by trusted gateway
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {bookingLoading && (
                  <Alert
                    variant="info"
                    className="text-center mt-3 border-0 shadow-sm"
                  >
                    <Spinner animation="border" size="sm" className="mr-2" />
                    Redirecting to payment gateway...
                  </Alert>
                )}
                {alertBooking && (
                  <Alert
                    variant="success"
                    className="text-center mt-3 border-0 shadow-sm"
                  >
                    <CheckCircleIcon className="mr-2" />
                    Appointment booked successfully!
                  </Alert>
                )}
                {error && (
                  <Alert
                    variant="danger"
                    className="text-center mt-3 border-0 shadow-sm"
                  >
                    <ErrorIcon className="mr-2" />
                    {error}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ml-3"
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </Button>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AppointmentModal;
