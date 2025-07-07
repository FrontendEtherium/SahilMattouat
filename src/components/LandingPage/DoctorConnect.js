// src/components/DoctorConnect/DoctorConnect.js
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory, useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import DoctorConnectCard from "./DoctorConnectComponents/DoctorConnectCard";
import DoctorConnectSearch from "./DoctorConnectComponents/DoctorConnectSearch";
import AppointmentModal from "../../features/BookAppointment";
import { userId } from "../UserId";
import { backendHost } from "../../api-config";
import { imgKitImagePath } from "../../image-path";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./DoctorConnect.css";

const MED_TYPE_MAP = {
  ayurveda: 1,
  homeopathy: 8,
  persian: 3,
  naturopathy: 9,
  unani: 2,
  chinese: 4,
};

function DoctorConnect() {
  const { medicineType } = useParams(); // slug or undefined
  const history = useHistory();
  const [docList, setDocList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  // reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [medicineType]);

  // fetch whenever type or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchDoctors();
  }, [medicineType, currentPage]);

  async function fetchDoctors() {
    const offset = (currentPage - 1) * 10;
    let url = `${backendHost}/video/get/doctors?offset=${offset}`;

    const medTypeID = MED_TYPE_MAP[medicineType];
    if (medTypeID) {
      url += `&medTypeID=${medTypeID}`;
    }

    try {
      const res = await fetch(url);
      const json = await res.json();
      setDocList(json.data || []);
      setTotalPages(json.totalPagesCount?.totalPages || 0);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  }

  // passed down to <DoctorConnectSearch>
  const changeSpeciality = (slug) => {
    if (slug) {
      history.push(`/doctor-connect/${slug}`);
    } else {
      history.push(`/doctor-connect`);
    }
  };

  const handleConsultClick = (docId) => {
    setSelectedDocId(docId);
    setShowAppointmentModal(true);
  };

  // Render modal using portal to document body
  const renderModal = () => {
    if (!showAppointmentModal) return null;

    return ReactDOM.createPortal(
      <AppointmentModal
        show={showAppointmentModal}
        onHide={() => setShowAppointmentModal(false)}
        docId={selectedDocId}
        userId={userId}
      />,
      document.body
    );
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          type="button"
          className={`pagination-button${currentPage === i ? " active" : ""}`}
          aria-current={currentPage === i ? "page" : undefined}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Header showSearch={false} />

      <div className="doctor-connect-container">
        <div className="doctor-connect-content">
          <img
            src={`${imgKitImagePath}/assets/img/docchartdp.jpg`}
            alt="Doctor Connect Banner"
            className="doc-banner"
          />

          <div className="doc-search-section">
            <DoctorConnectSearch
              speciality={medicineType}
              changeSpeciality={changeSpeciality}
            />
          </div>

          <div className="doc-text-container">
            <div className="doc-text-item">
              {/* <img src="/assets/icon/check.svg" alt="check" /> */}
              <div>
                Book appointments with minimum wait-time & verified doctor
                details
              </div>
            </div>
          </div>

          <div className="doc-grid">
            <div className="doc-list-section">
              {docList.map((doc) => (
                <DoctorConnectCard
                  key={doc.id}
                  doc={doc}
                  onConsult={handleConsultClick}
                />
              ))}

              <nav className="pagination-container" aria-label="Pagination">
                <button
                  type="button"
                  className="pagination-button"
                  aria-label="Previous"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeftIcon />
                </button>

                {renderPageButtons()}

                <button
                  type="button"
                  className="pagination-button"
                  aria-label="Next"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <NavigateNextIcon />
                </button>
              </nav>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Modal rendered using portal to document body */}
      {renderModal()}
    </>
  );
}

export default DoctorConnect;
