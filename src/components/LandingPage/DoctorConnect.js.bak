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
import mixpanel from "mixpanel-browser";

const MED_TYPE_MAP = {
  ayurveda: 1,
  homeopathy: 8,
  persian: 3,
  naturopathy: 9,
  unani: 2,
  chinese: 4,
};

const SPECIALITY_FILTERS = [
  { slug: "", label: "All Specialities" },
  { slug: "ayurveda", label: "Ayurveda" },
  { slug: "homeopathy", label: "Homeopathy" },
  { slug: "persian", label: "Persian" },
  { slug: "naturopathy", label: "Naturopathy" },
  { slug: "unani", label: "Unani" },
  { slug: "chinese", label: "Chinese" },
];

function DoctorConnect() {
  const { medicineType } = useParams(); // slug or undefined
  const history = useHistory();
  const [docList, setDocList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const trackEvent = React.useCallback(
    (eventName, props = {}) => {
      try {
        mixpanel?.track?.(eventName, {
          userId: userId || null,
          medicineType: medicineType || "all",
          currentPage,
          ...props,
        });
      } catch (trackingError) {
        console.warn("Mixpanel tracking failed:", trackingError);
      }
    },
    [medicineType, currentPage]
  );

  // reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [medicineType]);

  // fetch whenever type or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchDoctors();
  }, [medicineType, currentPage]);

  useEffect(() => {
    trackEvent("DoctorConnect Viewed");
  }, [medicineType, trackEvent]);

  useEffect(() => {
    trackEvent("DoctorConnect Pagination Changed", { page: currentPage });
  }, [currentPage, trackEvent]);

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
    trackEvent("DoctorConnect Filter Changed", {
      previousSpeciality: medicineType || "all",
      nextSpeciality: slug || "all",
    });
    if (slug) {
      history.push(`/doctor-connect/${slug}`);
    } else {
      history.push(`/doctor-connect`);
    }
  };

  const handleConsultClick = (docId) => {
    const doctor =
      docList.find((entry) => entry?.docID === docId || entry?.id === docId) ||
      {};
    trackEvent("DoctorConnect Consult Clicked", {
      docId,
      docName:
        doctor.firstName && doctor.lastName
          ? `${doctor.firstName} ${doctor.lastName}`
          : undefined,
      speciality: doctor.medicineTypeName,
      city: doctor.cityName,
    });
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
          <div className="doc-grid">
            <section className="doc-list-section">
              <div className="doc-hero doc-hero-inline">
                <p className="doc-hero-subtitle">Available Doctors</p>
                <h1 className="doc-hero-title">
                  Consult The Right Expert For You
                </h1>
              </div>
              <div className="doc-inline-filter" aria-label="Filter doctors">
                <div className="doc-inline-filter-label">Speciality</div>
                <select
                  className="doc-inline-filter-select"
                  value={medicineType || ""}
                  onChange={(e) => changeSpeciality(e.target.value)}
                >
                  {SPECIALITY_FILTERS.map((option) => (
                    <option key={option.slug || "all"} value={option.slug}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {docList.length === 0 ? (
                <div className="doc-list-empty">
                  <h3>No doctors found for this filter.</h3>
                  <p>
                    Try exploring another speciality or search by city & name
                    using the smart filters.
                  </p>
                  <button
                    type="button"
                    className="doc-hero-button doc-list-empty-button"
                    onClick={() => changeSpeciality("")}
                  >
                    View all doctors
                  </button>
                </div>
              ) : (
                docList.map((doc) => (
                  <DoctorConnectCard
                    key={doc.docID || doc.id}
                    doc={doc}
                    onConsult={handleConsultClick}
                  />
                ))
              )}

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
            </section>

            <aside className="doc-sidebar">
              
                <img
                  src={`${imgKitImagePath}/assets/img/banner02.jpg`}
                  alt="Consult with expert doctors"
                  className="doc-sidebar-banner-image"
                />
          

              <div className="doc-sidebar-card doc-sidebar-search">
                <div className="doc-sidebar-search-heading">
                  <p>Smart Filters</p>
                 
                  <span>
                    Search by doctor name, city, or refine by speciality below.
                    Press enter to run a search instantly.
                  </span>
                </div>
                <div className="doc-search-section">
                  <DoctorConnectSearch
                    speciality={medicineType}
                    changeSpeciality={changeSpeciality}
                  />
                </div>
              </div>
            </aside>
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
