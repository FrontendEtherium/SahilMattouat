import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useHistory } from "react-router-dom";
import { backendHost } from "../../api-config";
import { userId } from "../UserId";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import axios from "axios";

import "./Bookings.css";
import { imgKitImagePath } from "../../image-path";

const Bookings = () => {
  const history = useHistory();
  const [value, setValue] = useState(0);
  const [data, setData] = useState([]);
  const [docData, setDocData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prescription modal states
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // 'file' or 'notes'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Detect if user is on mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Retrieve doctor ID if logged in as doctor; else handle user
  const docID = localStorage.getItem("doctorid");

  // Max file size: 3MB
  const MAX_FILE_SIZE = 3 * 1024 * 1024;

  // Calculate default follow-up date (1 week from today)
  const getDefaultFollowUpDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  };

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

  // Open prescription modal for doctor
  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
    setFollowUpDate(getDefaultFollowUpDate());
    setPrescriptionFile(null);
    setPrescriptionNotes("");
    setUploadError("");
    setUploadSuccess(false);
    setFilePreview(null);
    setUploadMode("file");
  };

  // Close prescription modal
  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedAppointment(null);
    setPrescriptionFile(null);
    setPrescriptionNotes("");
    setUploadError("");
    setUploadSuccess(false);
    setFilePreview(null);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError("File size must be less than 3MB");
        setPrescriptionFile(null);
        setFilePreview(null);
        return;
      }
      setUploadError("");
      setPrescriptionFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Convert notes to PDF
  const convertNotesToPDF = () => {
    if (!prescriptionNotes.trim()) {
      setUploadError("Please enter prescription notes");
      return null;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    // Add header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Prescription", pageWidth / 2, 25, { align: "center" });

    // Add date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, 40);

    if (selectedAppointment) {
      doc.text(`Patient: ${selectedAppointment.userName || "N/A"}`, margin, 48);
      doc.text(
        `Appointment Date: ${selectedAppointment.appointmentDate || "N/A"}`,
        margin,
        56
      );
    }

    // Add prescription content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(prescriptionNotes, maxLineWidth);
    doc.text(lines, margin, 72);

    // Add follow-up date
    if (followUpDate) {
      const yPosition = 72 + lines.length * 7 + 20;
      doc.setFont("helvetica", "bold");
      doc.text(`Follow-up Date: ${followUpDate}`, margin, yPosition);
    }

    // Convert to blob
    const pdfBlob = doc.output("blob");
    return new File([pdfBlob], "prescription.pdf", { type: "application/pdf" });
  };

  // Upload prescription
  const handleUploadPrescription = async () => {
    if (!selectedAppointment) return;

    let fileToUpload = prescriptionFile;

    // If in notes mode, convert notes to PDF
    if (uploadMode === "notes") {
      fileToUpload = convertNotesToPDF();
      if (!fileToUpload) return;
    }

    if (!fileToUpload) {
      setUploadError("Please select a file or enter notes");
      return;
    }

    if (!followUpDate) {
      setUploadError("Please select a follow-up date");
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("appointmentId", selectedAppointment.appointmentID);
    formData.append("uploadedBy", docID);
    formData.append("followUpDate", followUpDate);

    try {
      const response = await axios.post(
        "https://all-cures.com:444/cures/prescriptions/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setUploadSuccess(true);
        // Refresh appointments after successful upload
        setTimeout(() => {
          closePrescriptionModal();
          // Refetch data
          if (docID != 0) {
            fetch(`${backendHost}/appointments/get/${docID}`)
              .then((res) => res.json())
              .then((json) => setDocData(json))
              .catch((err) => console.error(err));
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
      setUploadError(
        error.response?.data?.message ||
          "Failed to upload prescription. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // View prescription
  const viewPrescription = (prescriptionUrl) => {
    if (prescriptionUrl) {
      window.open(prescriptionUrl, "_blank");
    }
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
      prescription_url,
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

            {/* Prescription view for patient */}
            <div className="prescription-actions">
              {prescription_url ? (
                <button
                  className="prescription-btn view-btn"
                  onClick={() => viewPrescription(prescription_url)}
                >
                  <i className="fas fa-file-medical"></i>
                  View Prescription
                </button>
              ) : (
                <span className="prescription-pending">
                  <i className="fas fa-clock"></i>
                  Prescription pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Doctor appointment card - shows patient info (simpler)
  const DoctorAppointmentCard = ({ appointment }) => {
    const {
      appointmentDate,
      startTime,
      endTime,
      status,
      userName,
      prescription_url,
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

            {/* Prescription actions for doctor */}
            <div className="prescription-actions">
              {prescription_url ? (
                <button
                  className="prescription-btn view-btn"
                  onClick={() => viewPrescription(prescription_url)}
                >
                  <i className="fas fa-file-medical"></i>
                  View Prescription
                </button>
              ) : (
                <button
                  className="prescription-btn upload-btn"
                  onClick={() => openPrescriptionModal(appointment)}
                >
                  <i className="fas fa-upload"></i>
                  Upload Prescription
                </button>
              )}
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

      {/* Prescription Upload Modal */}
      <Modal
        show={showPrescriptionModal}
        onHide={closePrescriptionModal}
        centered
        size="lg"
        className="prescription-modal"
        contentClassName="prescription-modal-content"
      >
        <div className="prescription-modal-header">
          <div className="modal-header-content">
            <div className="modal-header-text">
              <h4>Upload Prescription</h4>
              <p>Add prescription for this appointment</p>
            </div>
          </div>
        </div>
        <Modal.Body>
          {uploadSuccess ? (
            <div className="upload-success">
              <i className="fas fa-check-circle"></i>
              <h4>Prescription Uploaded Successfully!</h4>
              <p>
                The prescription has been saved and shared with the patient.
              </p>
            </div>
          ) : (
            <>
              {/* Patient Info */}
              {selectedAppointment && (
                <div className="patient-info-card">
                  <div className="patient-avatar">
                    {selectedAppointment.userName?.charAt(0)?.toUpperCase() ||
                      "P"}
                  </div>
                  <div className="patient-details">
                    <h4>{selectedAppointment.userName}</h4>
                    <p>
                      Appointment: {selectedAppointment.appointmentDate} |{" "}
                      {selectedAppointment.startTime} -{" "}
                      {selectedAppointment.endTime}
                    </p>
                  </div>
                </div>
              )}

              {/* Mode Toggle */}
              <div className="upload-mode-toggle">
                <button
                  className={`mode-btn ${
                    uploadMode === "file" ? "active" : ""
                  }`}
                  onClick={() => setUploadMode("file")}
                >
                  <i className="fas fa-file-upload"></i>
                  Upload File/Photo
                </button>
                <button
                  className={`mode-btn ${
                    uploadMode === "notes" ? "active" : ""
                  }`}
                  onClick={() => setUploadMode("notes")}
                >
                  <i className="fas fa-pen"></i>
                  Write Notes
                </button>
              </div>

              {/* File Upload Mode */}
              {uploadMode === "file" && (
                <div className="file-upload-section">
                  <div className="upload-buttons">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*,.pdf"
                      style={{ display: "none" }}
                    />
                    <input
                      type="file"
                      ref={cameraInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      capture="environment"
                      style={{ display: "none" }}
                    />
                    <button
                      className="upload-option-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <i className="fas fa-folder-open"></i>
                      Choose File
                    </button>
                    {isMobile && (
                      <button
                        className="upload-option-btn"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <i className="fas fa-camera"></i>
                        Take Photo
                      </button>
                    )}
                  </div>

                  {prescriptionFile && (
                    <div className="file-preview">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="preview-image"
                        />
                      ) : (
                        <div className="file-info">
                          <i className="fas fa-file-pdf"></i>
                          <span>{prescriptionFile.name}</span>
                        </div>
                      )}
                      <button
                        className="remove-file-btn"
                        onClick={() => {
                          setPrescriptionFile(null);
                          setFilePreview(null);
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}

                  <p className="file-size-hint">
                    <i className="fas fa-info-circle"></i>
                    Maximum file size: 3MB. Accepted formats: Images and PDF
                  </p>
                </div>
              )}

              {/* Notes Mode */}
              {uploadMode === "notes" && (
                <div className="notes-section">
                  <textarea
                    className="prescription-notes-input"
                    placeholder="Enter prescription details here...

Example:
Rx
1. Medication name - dosage - frequency - duration
2. Medication name - dosage - frequency - duration

Instructions:
- Take after meals
- Avoid alcohol"
                    value={prescriptionNotes}
                    onChange={(e) => setPrescriptionNotes(e.target.value)}
                    rows={8}
                  ></textarea>
                  <p className="notes-hint">
                    <i className="fas fa-info-circle"></i>
                    Your notes will be converted to a PDF document
                  </p>
                </div>
              )}

              {/* Follow-up Date */}
              <div className="follow-up-section">
                <label className="follow-up-label">
                  <i className="fas fa-calendar-check"></i>
                  Follow-up Date
                </label>
                <input
                  type="date"
                  className="follow-up-input"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="upload-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {uploadError}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        {!uploadSuccess && (
          <Modal.Footer>
            <button
              className="modal-btn cancel-btn"
              onClick={closePrescriptionModal}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              className="modal-btn submit-btn"
              onClick={handleUploadPrescription}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload"></i>
                  Upload Prescription
                </>
              )}
            </button>
          </Modal.Footer>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default Bookings;
