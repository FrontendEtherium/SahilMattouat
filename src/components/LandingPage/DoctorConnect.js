// src/components/DoctorConnect/DoctorConnect.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
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

// Debounce utility to prevent rapid API calls
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Cache storage for API responses (session cache)
const doctorCacheStore = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const trackEvent = useCallback(
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

  // Memoized fetch function with caching
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const offset = (currentPage - 1) * 10;
    const cacheKey = `${medicineType}-${offset}`;
    
    // Check cache first
    const cached = doctorCacheStore.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      // Use cached data
      setDocList(cached.data);
      setTotalPages(cached.totalPages);
      setLoading(false);
      return;
    }
    
    let url = `${backendHost}/video/get/doctors?offset=${offset}`;

    const medTypeID = MED_TYPE_MAP[medicineType];
    if (medTypeID) {
      url += `&medTypeID=${medTypeID}`;
    }

    try {
      const res = await fetch(url);
      const json = await res.json();
      
      const data = json.data || [];
      const totalPages = json.totalPagesCount?.totalPages || 0;
      
      // Store in cache
      doctorCacheStore.set(cacheKey, {
        data,
        totalPages,
        timestamp: Date.now()
      });

      setDocList(data);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDocList([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, medicineType]);

  // fetch whenever type or page changes
  useEffect(() => {
    // Debounce scroll to avoid jank on mobile
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
    
    fetchDoctors();
    
    return () => clearTimeout(scrollTimeout);
  }, [fetchDoctors]);

  // Track events
  useEffect(() => {
    trackEvent("DoctorConnect Viewed");
  }, [medicineType, trackEvent]);

  useEffect(() => {
    trackEvent("DoctorConnect Pagination Changed", { page: currentPage });
  }, [currentPage, trackEvent]);

  // Change speciality handler with debounce to prevent rapid API calls
  const handleChangeSpecialityRaw = useCallback((slug) => {
    trackEvent("DoctorConnect Filter Changed", {
      previousSpeciality: medicineType || "all",
      nextSpeciality: slug || "all",
    });
    if (slug) {
      history.push(`/doctor-connect/${slug}`);
    } else {
      history.push(`/doctor-connect`);
    }
  }, [medicineType, trackEvent, history]);
  
  // Debounced version to prevent rapid clicks (300ms wait)
  const changeSpeciality = useCallback(
    debounce(handleChangeSpecialityRaw, 300),
    [handleChangeSpecialityRaw]
  );

  // Memoized handleConsultClick function
  const handleConsultClick = useCallback((docId) => {
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
  }, [docList, trackEvent]);

  // Render modal using portal to document body
  const renderModal = useCallback(() => {
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
  }, [showAppointmentModal, selectedDocId]);

  // Optimized pagination button rendering - show max 5 buttons
  const renderPageButtons = useCallback(() => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxButtons) {
      const halfWindow = Math.floor(maxButtons / 2);
      startPage = Math.max(1, currentPage - halfWindow);
      endPage = Math.min(totalPages, startPage + maxButtons - 1);
      
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
    }

    // Show first page button if not in range
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          type="button"
          className="pagination-button"
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis-start" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Show page buttons in range
    for (let i = startPage; i <= endPage; i++) {
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

    // Show last page button if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis-end" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          type="button"
          className="pagination-button"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  }, [currentPage, totalPages]);

  return (
    <>
  {/* <Header showSearch={false} /> */}

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

{/*      {docList.length === 0 ? (
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
              )}    */}
           {loading ? (
             <div
                style={{
                padding: "40px",
                textAlign: "center",
                minHeight: "40vh",
                }}
                >
                <h3>Loading doctors...</h3>
                </div>
                ) : docList.length === 0 ? (
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

{/*    <aside className="doc-sidebar">
              
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
            </aside>  */}
          </div>
        </div>

{/* <Footer /> */}
<Footer hideCuresLinks={true} />
      </div>

      {/* Modal rendered using portal to document body */}
      {renderModal()}
    </>
  );
}

export default DoctorConnect;
