import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "./DoctorCarousel.css";
import { imgKitImagePath } from "../../../image-path";
import { backendHost } from "../../../api-config";
const DoctorCarousel = () => {
  const [doctors, setDoctors] = useState([]);
  const fallbackImg = "https://via.placeholder.com/200x200?text=No+Image";

  useEffect(() => {
    fetch(`${backendHost}/video/get/doctors/list?offset=1`)
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Error fetching doctor data:", err));
  }, []);

  return (
    <div className="doctor-carousel-wrapper">
      <h2 className="carousel-title">Meet Our Panel of Doctors</h2>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 100,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {doctors.map((doctor) => (
          <SwiperSlide key={doctor.docID}>
            <div className="doctor-card">
              <div className="doctor-image-wrapper">
                <img
                  src={
                    doctor.imgLoc
                      ? `${imgKitImagePath}/${doctor.imgLoc}`
                      : fallbackImg
                  }
                  alt={`${doctor.prefix} ${doctor.firstName} ${
                    doctor.lastName || ""
                  }`}
                  className="doctor-image"
                />
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">
                  {doctor.prefix} {doctor.firstName} {doctor.lastName || ""}
                </h3>
                {doctor.specialtyName && (
                  <p className="doctor-specialty">{doctor.specialtyName}</p>
                )}
                {doctor.about && (
                  <p className="doctor-about">
                    {doctor.about.length > 100
                      ? doctor.about.slice(0, 100) + "..."
                      : doctor.about}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DoctorCarousel;
