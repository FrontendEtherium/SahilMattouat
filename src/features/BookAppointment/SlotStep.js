import React, { useEffect, useState } from "react";
import { Spinner, Badge } from "react-bootstrap";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { backendHost } from "../../api-config";

const SlotStep = ({ docId, bookingData, setBookingData, onNext }) => {
  const today = dayjs();

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsData, setSlotsData] = useState({});
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (docId) {
      fetchSlots();
    }
  }, [docId]);

  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);
      setError("");

      const response = await fetch(`${backendHost}/appointments/get/Slots/${docId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch slots");
      }

      const json = await response.json();

      setSlotsData(json.unbookedSlots || {});
      setHighlightedDays(json.completelyBookedDates || []);

      const totalDates = Object.keys(json.totalDates || {});
      const next30Days = [];

      for (let i = 0; i <= 30; i++) {
        next30Days.push(dayjs().add(i, "day").format("YYYY-MM-DD"));
      }

      const missingDates = next30Days.filter((date) => !totalDates.includes(date));
      setUnavailableDates(missingDates);

      setBookingData({
        ...bookingData,
        amount: json.amount || bookingData.amount,
      });
    } catch (err) {
      console.error("Slots fetch error:", err);
      setError("Failed to load slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const disableDate = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");

    return (
      date.isBefore(today, "day") ||
      highlightedDays.includes(formattedDate) ||
      unavailableDates.includes(formattedDate)
    );
  };

  const handleDateChange = (newValue) => {
    const selectedDate = newValue.format("YYYY-MM-DD");

    setBookingData({
      ...bookingData,
      selectedDate,
      selectedTimeSlot: "",
      appointmentDateTime: "",
    });
  };

  const handleTimeSelect = (time) => {
    const cleanTime = time.length === 5 ? `${time}:00` : time;

    setBookingData({
      ...bookingData,
      selectedTimeSlot: time,
      appointmentDateTime: `${bookingData.selectedDate}T${cleanTime}`,
    });
  };

  const formatTimeSlot = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;

    return `${adjustedHours}:${minutes < 10 ? "0" : ""}${minutes} ${suffix}`;
  };

  const handleNext = () => {
    if (!bookingData.selectedDate || !bookingData.selectedTimeSlot) {
      alert("Please select date and time");
      return;
    }

    onNext();
  };

  const currentSlots = bookingData.selectedDate
    ? slotsData[bookingData.selectedDate] || []
    : [];

  return (
    <div>
      <h5 className="mb-3">Step 1: Select Slot</h5>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-12 col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="mb-0 d-flex align-items-center">
                <CalendarTodayIcon className="mr-2" />
                Select Date
              </h6>
            </div>

            <div className="card-body p-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  defaultValue={today}
                  minDate={today}
                  maxDate={today.add(1, "month")}
                  onChange={handleDateChange}
                  showToolbar={false}
                  shouldDisableDate={disableDate}
                  slotProps={{
                    actionBar: { actions: [] },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light">
              <h6 className="mb-0 d-flex align-items-center">
                <AccessTimeIcon className="mr-2" />
                Select Time
              </h6>
            </div>

            <div className="card-body p-3">
              {!bookingData.selectedDate ? (
                <div className="text-center text-muted py-5">
                  <AccessTimeIcon style={{ fontSize: "2.5rem", opacity: 0.3 }} />
                  <p className="mt-3">Please select a date first</p>
                </div>
              ) : loadingSlots ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading available slots...</p>
                </div>
              ) : currentSlots.length > 0 ? (
                <>
                  <div className="mb-3">
                    <Badge variant="info">
                      {currentSlots.length} slots available
                    </Badge>
                  </div>

                  <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                    {currentSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`btn ${
                          bookingData.selectedTimeSlot === time
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {formatTimeSlot(time)}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-muted py-5">
                  No slots available for this date
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary px-4" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SlotStep;
