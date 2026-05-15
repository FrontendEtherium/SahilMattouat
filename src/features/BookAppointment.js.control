import React, { useState } from "react";
import { createPortal } from "react-dom";
import SlotStep from "./BookAppointment/SlotStep";
import UserDetailsStep from "./BookAppointment/UserDetailsStep";
import OtpPaymentStep from "./BookAppointment/OtpPaymentStep";

const AppointmentModal = ({ show, onHide, docId }) => {
  const [step, setStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    selectedDate: "",
    selectedTimeSlot: "",
    appointmentDateTime: "",
    amount: null,

    firstName: "",
    lastName: "",
    mobile: "",
    countryCode: "+91",

    lockId: "",
  });

  const handleClose = () => {
    setStep(1);
    onHide();
  };

  if (!show) return null;

  return createPortal(
    <div
      className="modal fade show"
      style={{
        display: "block",
        position: "fixed",
        inset: 0,
        zIndex: 1050,
        backgroundColor: "rgba(0,0,0,0.7)",
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "900px", width: "95%" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Book Appointment</h5>

            <button
              type="button"
              className="close"
              onClick={handleClose}
            >
              <span>&times;</span>
            </button>
          </div>

          <div className="modal-body">
            {step === 1 && (
              <SlotStep
                docId={docId}
                bookingData={bookingData}
                setBookingData={setBookingData}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <UserDetailsStep
                docId={docId}
                bookingData={bookingData}
                setBookingData={setBookingData}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <OtpPaymentStep
                bookingData={bookingData}
                onBack={() => setStep(2)}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AppointmentModal;
