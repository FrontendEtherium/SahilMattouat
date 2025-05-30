import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendHost } from "../../../api-config";
import "./TopDoctorStyles.css";
import { imgKitImagePath } from "../../../image-path";
import { userAccess } from "../../UserAccess";
import { userId } from "../../UserId";
import AppointmentModal from "../../../features/BookAppointment";
import Test from "../test";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import DoctorConnectCard from "./DoctorConnectCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function TopDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTopDoctor = async () => {
      try {
        const { data } = await axios.get(
          `${backendHost}/rotation/doctors/list`
        );
        setDoctors(data);
      } catch (error) {
        setError("Failed to fetch doctors.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopDoctor();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  const handleConsult = (docId) => {
    setSelectedDocId(docId);
    setShowAppointmentModal(true);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center error">{error}</div>;

  return (
    <>
      <div className="container">
        <h2>Top Doctors</h2>
        <div className="top-doctors-slider">
          <Slider {...sliderSettings}>
            {doctors.map((doctor, index) => (
              <div key={doctor.docID || index} className="slider-item">
                <DoctorConnectCard doc={doctor} onConsult={handleConsult} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {showAppointmentModal && (
        <AppointmentModal
          show={showAppointmentModal}
          onHide={() => setShowAppointmentModal(false)}
          docId={selectedDocId}
          userId={userId}
        />
      )}
    </>
  );
}

export default TopDoctor;
