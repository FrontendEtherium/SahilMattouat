import React, { useEffect, useState, useCallback, useRef } from "react";
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
  
  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .appointment-modal-dialog {
      margin: 10px !important;
      max-width: calc(100% - 20px) !important;
    }
    
    .appointment-modal-content {
      border-radius: 12px !important;
    }
    
    .appointment-modal-header {
      padding: 15px 20px !important;
    }
    
    .appointment-modal-header h5 {
      font-size: 1.1rem !important;
    }
    
    .appointment-modal-body {
      padding: 15px 20px !important;
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

const AppointmentModal = ({ show, onHide, alertBooking, docId, userId }) => {
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

  const handleTimeSlot = useCallback((time) => {
    setSelectedTimeSlot(time);
    setError(null); // Clear any previous errors when selecting a new time slot

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
  }, []);

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
    async (date) => {
      if (!docId) return;

      setLoadingSlots(true);
      setError(null);

      try {
        const response = await fetch(
          `${backendHost}/appointments/get/Slots/${docId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointment slots");
        }

        const json = await response.json();

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

        // Get unbooked slots for the selected date
        const unbookedSlots = json.unbookedSlots?.[date] || [];
        setUnbookedSlot(unbookedSlots);
        setAmount(json.amount);
        setAppointmentData(json);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setError("Failed to load appointment slots. Please try again.");
      } finally {
        setLoadingSlots(false);
      }
    },
    [docId]
  );

  useEffect(() => {
    if (show && docId) {
      fetchAppointmentDetails(selectedDate);
    }
  }, [show, docId, selectedDate, fetchAppointmentDetails]);

  const bookAppn = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendHost}/appointments/create`, {
        docID: docId,
        userID: parseInt(userId),
        appointmentDate: selectedDate,
        startTime: selectedTimeSlot,
        paymentStatus: 0,
        amount: amount,
        currency: "INR",
      });

      const responseObject = response.data;
      console.log("responseObject", responseObject);
      localStorage.setItem("encKey", responseObject.encRequest);
      localStorage.setItem("apiResponse", JSON.stringify(response.data));
      let res = localStorage.getItem("apiResponse");

      console.log("res", res);

      const redirectURL = `https://www.all-cures.com/paymentRedirection?encRequest=${responseObject.encRequest}&accessCode=AVWN42KL59BP42NWPB`;
      window.location.href = redirectURL;
    } catch (error) {
      console.error("Error while booking appointment:", error);
      setError("Failed to book the appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDatesChange = useCallback((newValue) => {
    const formattedDate = newValue.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setSelectedTimeSlot(""); // Reset time slot when date changes
    setError(null); // Clear errors when date changes
  }, []);

  const formatTimeSlot = useCallback((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes < 10 ? "0" : ""}${minutes} ${suffix}`;
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedDate(null);
    setSelectedTimeSlot("");
    setError(null);
    setBookingLoading(false);
    setLoadingSlots(false);
    onHide();
  }, [onHide]);

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

  return (
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
                  <strong>How to book:</strong> Select a date from the calendar,
                  then choose an available time slot. Red dates are fully
                  booked, and gray dates are unavailable.
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
                            {unbookedSlots.length !== 1 ? "s" : ""} available
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
                            <CalendarTodayIcon style={{ fontSize: "1.1rem" }} />
                          </div>
                          <div className="ml-2">
                            <div
                              className="text-muted appointment-summary-label"
                              style={{ fontSize: "0.75rem", fontWeight: "500" }}
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
                            <AccessTimeIcon style={{ fontSize: "1.1rem" }} />
                          </div>
                          <div className="ml-2">
                            <div
                              className="text-muted appointment-summary-label"
                              style={{ fontSize: "0.75rem", fontWeight: "500" }}
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
                            ₹
                          </div>
                          <div className="ml-2">
                            <div
                              className="text-muted appointment-summary-label"
                              style={{ fontSize: "0.75rem", fontWeight: "500" }}
                            >
                              Consultation Fee
                            </div>
                            <div
                              className="font-weight-bold appointment-summary-fee"
                              style={{ fontSize: "1.1rem", color: "#f57c00" }}
                            >
                              ₹{amount}
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
                      <Spinner animation="border" size="sm" className="mr-2" />
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
  );
};

export default AppointmentModal;
