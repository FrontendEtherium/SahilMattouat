import React, { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DummyDoc from "../../../assets/healthcare/img/images/defaultDoc1.png";
import { userId } from "../../UserId";
import Test from "../test";

import axios from "axios";
import { backendHost } from "../../../api-config";
import "./DoctorConnectCard.css";
import { imgKitImagePath } from "../../../image-path";
import RateTooltip from "../../../ui/Tooltip";

function DoctorConnectCard({ doc, onConsult }) {
  const imgLoc = doc.imgLoc ? `${imgKitImagePath}/${doc.imgLoc}` : DummyDoc;
  const [showModal, setShowModal] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);
  const showFee =
    !!doc?.fee &&
    [doc.fee.totalFee, doc.fee.baseFee, doc.fee.etheriumPart, doc.fee.gst].some(
      (val) => Number(val) > 0
    );

  const DoctorNotAvailable = async () => {
    setNotAvailable(true);
    try {
      await axios.post(
        `${backendHost}/video/post/leads?userID=${userId}&docID=${doc.docID}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const consult = () => {
    if (doc.videoService === 1) {
    
        onConsult(doc.docID);
     
    } else {
      DoctorNotAvailable();
    }
  };

  const handleProfileVisit = async () => {
    setNotAvailable(false);
    window.location.href = `/doctor/${doc.docID}`;
    try {
      await axios.post(
        `${backendHost}/video/post/leads?userID=${userId}&docID=${doc.docID}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="doctor-card">
        <div className="doctor-card-main">
          <div className="doctor-image-container">
            <img
              src={imgLoc}
              alt={`Dr.${doc.firstName} ${doc.lastName}`}
              className="doctor-image"
            />
          </div>
          <div className="doctor-details">
            <div className="doctor-name">
              Dr. {doc.firstName} {doc.lastName}{" "}
              <VerifiedIcon color="success" style={{ fontSize: "12px" }} />
            </div>
            <div className="doctor-specialty">{doc.medicineTypeName}</div>
            <div className="doctor-location">
              {doc.cityName}, {doc.addressCountry}
            </div>
            {showFee && (
              <div className="doctor-fee" aria-label="Consultation fee">
                <div className="doctor-fee-text">
                  <span className="doctor-fee-label">Consultation fee</span>
                  <span className="doctor-fee-amount">
                    <span className="doctor-fee-currency">₹</span>
                    <span className="doctor-fee-value">{doc?.fee?.totalFee}</span>
                    <span className="doctor-fee-note">incl. taxes</span>
                  </span>
                </div>
                <RateTooltip
                  title={
                    <>
                      <strong>Base Fee:</strong> ₹{doc?.fee?.baseFee} <br />
                      <strong>Platform Fee:</strong> ₹{doc?.fee?.etheriumPart}{" "}
                      <br />
                      <strong>GST:</strong> ₹{doc?.fee?.gst} <br />
                    </>
                  }
                />
              </div>
            )}
            <div className="doctor-hospital">{doc.hospitalAffiliated}</div>
            <div className="doctor-separator"></div>
          </div>
        </div>
        <div className="book-button-container">
          {doc.videoService === 1 && (
            <div className="book-availability" aria-label="Doctor available">
              <CheckCircleIcon className="book-availability-icon" />
              Available
            </div>
          )}
          <div className="book-button-row">
            <button className="book-button" onClick={consult}>
              <LocalPharmacyIcon className="book-button-icon" />
              Consult
            </button>
            <button className="profile-button" onClick={handleProfileVisit}>
              Visit Profile
            </button>
          </div>
        </div>
      </div>
      <Test show={showModal} onHide={() => setShowModal(false)} />
      {notAvailable && (
        <div className="modal-backdrop-doc" role="dialog" aria-modal="true">
          <div className="modal-container-doc">
            <div className="modal-header-doc">
              <h5 className="modal-title-doc">Doctor Unavailable Right Now</h5>
              <button
                className="modal-close-button-doc"
                onClick={() => setNotAvailable(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body-doc">
              <p>
                <span className="text-highlight">Unavailable:</span> This doctor
                is currently not available for consultations. Our team is
                working to update the availability status.
              </p>
              <p>
                Meanwhile, you can explore the doctor's profile to read
                articles, view their qualifications, and learn more about their
                expertise.
              </p>
              <p>Thank you for your patience!</p>
            </div>
            <div className="modal-footer-doc">
              <button
                className="modal-footer-button-doc"
                onClick={() => setNotAvailable(false)}
              >
                Close
              </button>
              <button
                className="modal-footer-button-doc"
                onClick={handleProfileVisit}
              >
                Visit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorConnectCard;
