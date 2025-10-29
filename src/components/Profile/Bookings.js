import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useHistory } from "react-router-dom";
import { backendHost } from "../../api-config";
import { userId } from "../UserId";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";

import "./Bookings.css";
import {  imgKitImagePath } from "../../image-path";

const Bookings = () => {
  const history = useHistory();
  const [value, setValue] = useState(0);
  const [data, setData] = useState([]);
  const [docData, setDocData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve doctor ID if logged in as doctor; else handle user
  const docID = localStorage.getItem("doctorid");

  // Fetch appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendHost}/appointments/get/user/${userId}`
        );
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching user appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDocData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendHost}/appointments/get/${docID}`
        );
        const json = await response.json();
        setDocData(json);
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (docID != 0) {
      fetchDocData();
    } else {
      fetchData();
    }
  }, [docID]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Tabs utility for MUI
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box className="appointment-tab-content">
            <Typography component="div">{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  // Patient appointment card - shows doctor info with image and medicine type
  const PatientAppointmentCard = ({ appointment }) => {
    const {
      appointmentDate,
      startTime,
      endTime,
      status,
      doctorName,
      imgLoc,
      medicineType,
    } = appointment;

    const statusText =
      status === 0 ? "Upcoming" : status === 2 ? "Completed" : "Other";

    const statusClass =
      status === 0
        ? "status-upcoming"
        : status === 2
        ? "status-completed"
        : "status-other";

    return (
      <div className="appointment-item">
        <div className={`status-indicator ${statusClass}`}>{statusText}</div>

        <div className="appointment-content">
          <div className="profile-image-section">
            {imgLoc ? (
              <img
                src={`${imgKitImagePath}${imgLoc}`}
                alt={`Dr. ${doctorName}`}
                className="profile-avatar"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="profile-placeholder"
              style={{ display: imgLoc ? "none" : "flex" }}
            >
              {doctorName?.charAt(0)?.toUpperCase() || "D"}
            </div>
          </div>

          <div className="appointment-details">
            <div className="appointment-header">
              <h3 className="person-name">Dr. {doctorName}</h3>
            </div>

            {medicineType && (
              <div className="specialty-badge">{medicineType}</div>
            )}

            <div className="appointment-meta">
              <div className="meta-item">
                <i className="fas fa-calendar-alt meta-icon"></i>
                <span className="meta-label">Date:</span>
                <span className="meta-value">{appointmentDate}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock meta-icon"></i>
                <span className="meta-label">Time:</span>
                <span className="meta-value">
                  {startTime} - {endTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Doctor appointment card - shows patient info (simpler)
  const DoctorAppointmentCard = ({ appointment }) => {
    const { appointmentDate, startTime, endTime, status, userName } =
      appointment;

    const statusText =
      status === 0 ? "Upcoming" : status === 2 ? "Completed" : "Other";

    const statusClass =
      status === 0
        ? "status-upcoming"
        : status === 2
        ? "status-completed"
        : "status-other";

    return (
      <div className="appointment-item">
        <div className={`status-indicator ${statusClass}`}>{statusText}</div>

        <div className="appointment-content">
          <div className="profile-image-section">
            <div className="profile-placeholder">
              {userName?.charAt(0)?.toUpperCase() || "P"}
            </div>
          </div>

          <div className="appointment-details">
            <div className="appointment-header">
              <h3 className="person-name">{userName}</h3>
            </div>

            <div className="appointment-meta">
              <div className="meta-item">
                <i className="fas fa-calendar-alt meta-icon"></i>
                <span className="meta-label">Date:</span>
                <span className="meta-value">{appointmentDate}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock meta-icon"></i>
                <span className="meta-label">Time:</span>
                <span className="meta-value">
                  {startTime} - {endTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => <div className="appointment-skeleton"></div>;

  // Empty state component
  const EmptyState = ({ type }) => (
    <div className="empty-appointments">
      <div className="empty-icon">
        <i className="fas fa-calendar-times"></i>
      </div>
      <h3 className="empty-title">No {type.toLowerCase()} appointments</h3>
      <p className="empty-subtitle">
        {type === "Upcoming"
          ? "You don't have any upcoming appointments scheduled."
          : "You haven't completed any appointments yet."}
      </p>
    </div>
  );

  // Filter appointments by status
  const getFilteredAppointments = (appointments, statusFilter) => {
    return appointments.filter(
      (appointment) => appointment.status === statusFilter
    );
  };

  const upcomingAppointments =
    docID != 0
      ? getFilteredAppointments(docData, 0)
      : getFilteredAppointments(data, 0);

  const completedAppointments =
    docID != 0
      ? getFilteredAppointments(docData, 2)
      : getFilteredAppointments(data, 2);

  return (
    <div>
      <Header history={history} />

      <div className="appointments-container">
        {/* Page Header */}
        <div className="appointments-header mt-30">
          <h1 className="appointments-title">My Appointments</h1>
          <p className="appointments-subtitle">
            {docID != 0
              ? "Manage your patient appointments and consultations"
              : "View and manage your medical appointments"}
          </p>
        </div>

        {/* Tab Section */}
        <div className="appointment-tabs-wrapper">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "#b9daf1" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                centered
                variant="fullWidth"
              >
                <Tab
                  label={`Upcoming Appointments (${upcomingAppointments.length})`}
                  {...a11yProps(0)}
                />
                <Tab
                  label={`Completed Appointments (${completedAppointments.length})`}
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>

            {/* Upcoming Appointments */}
            <CustomTabPanel value={value} index={0}>
              {loading ? (
                <>
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                </>
              ) : upcomingAppointments.length === 0 ? (
                <EmptyState type="Upcoming" />
              ) : (
                upcomingAppointments.map((appointment, index) =>
                  docID != 0 ? (
                    <DoctorAppointmentCard
                      key={`upcoming-${appointment.appointmentID}-${index}`}
                      appointment={appointment}
                    />
                  ) : (
                    <PatientAppointmentCard
                      key={`upcoming-${appointment.appointmentID}-${index}`}
                      appointment={appointment}
                    />
                  )
                )
              )}
            </CustomTabPanel>

            {/* Completed Appointments */}
            <CustomTabPanel value={value} index={1}>
              {loading ? (
                <>
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                </>
              ) : completedAppointments.length === 0 ? (
                <EmptyState type="Completed" />
              ) : (
                completedAppointments.map((appointment, index) =>
                  docID != 0 ? (
                    <DoctorAppointmentCard
                      key={`completed-${appointment.appointmentID}-${index}`}
                      appointment={appointment}
                    />
                  ) : (
                    <PatientAppointmentCard
                      key={`completed-${appointment.appointmentID}-${index}`}
                      appointment={appointment}
                    />
                  )
                )
              )}
            </CustomTabPanel>
          </Box>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bookings;
