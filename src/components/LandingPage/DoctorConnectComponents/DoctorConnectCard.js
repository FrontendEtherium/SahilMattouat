import React, { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import DummyDoc from "../../../assets/healthcare/img/images/defaultDoc1.png";
import { userId } from "../../UserId";
import Test from "../test";

import axios from "axios";
import { backendHost } from "../../../api-config";
import "./DoctorConnectCard.css";
import { imgKitImagePath } from "../../../image-path";
import { Link } from "react-router-dom";
import RateTooltip from "../../../ui/Tooltip";

function DoctorConnectCard({ doc, onConsult }) {
  const imgLoc = doc.imgLoc ? `${imgKitImagePath}/${doc.imgLoc}` : DummyDoc;
  const [showModal, setShowModal] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);

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
        <Link
          to={`/doctor/${doc.docID}-${doc.firstName}-${doc.lastName}`}
          id="profile"
        >
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
                 {doc?.fee?.totalFee && (
                <span className="doctor-pill doctor-pill-fee">
                  ₹{doc?.fee?.totalFee}
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
                </span>
              )}
              <div className="doctor-hospital">{doc.hospitalAffiliated}</div>
              <div className="doctor-separator"></div>
            </div>
          </div>
        </Link>
        <div className="book-button-container">
          {doc.videoService === 1 && (
            <div className="book-availability">Available</div>
          )}
          <button className="book-button" onClick={consult}>
            <LocalPharmacyIcon className="book-button-icon" />
            Consult
          </button>
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
