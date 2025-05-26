import React, { useState, useEffect, memo } from "react";
import { Carousel } from "react-bootstrap";
import { backendHost } from "../../../api-config";
import { userId } from "../../UserId";
import axios from "axios";
import { imageUrl, imgKitImagePath } from "../../../image-path";
import "./HomePageCarousel.css";
import mobileImage1 from "../../../assets/img/banner2.jpg";
import mobileImage2 from "../../../assets/img/banner1.jpg";

const HomePageCarousel = memo(() => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const carouselImages = {
    desktop: [
      {
        src: `${imageUrl}/tr:w-1300,h-380,f-webp/assets/img/desktop-banner002.jpg`,
        alt: "Healthcare Banner 1 - Find the best doctors near you",
        title: "Healthcare Services Banner",
      },
      {
        src: `${imageUrl}/tr:w-1300,h-380,f-webp/assets/img/desktop-banner001.jpg`,
        alt: "Healthcare Banner 2 - Book online doctor consultation",
        title: "Online Doctor Consultation",
      },
    ],
    mobile: [ {
      src:`${imageUrl}/tr:f-webp/assets/img/Mobile-banner003.jpg`,
      alt: "Mobile Healthcare Banner 2",
      title: "Mobile Doctor Consultation",
    },
      {
        src: `${imageUrl}/tr:f-webp/assets/img/Mobile-banner004.jpg`,
        alt: "Mobile Healthcare Banner 1",
        title: "Mobile Healthcare Services",
      },
      
    ],
  };

  const clickCounter = async () => {
    try {
      const uid = userId || 0;
      await axios.post(`${backendHost}/video/consult/counts/${uid}`);
    } catch (error) {
      console.error(error);
    }
  };

  const currentImages = isMobile
    ? carouselImages.mobile
    : carouselImages.desktop;

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  return (
    <section
      className={`doctor-patient-banner-container ${
        imagesLoaded ? "loaded" : "loading"
      }`}
      aria-label="Healthcare Services Carousel"
    >
      <Carousel interval={4000} pause={false}>
        {currentImages.map((img, idx) => (
          <Carousel.Item key={idx}>
            <img
              src={img.src}
              alt={img.alt}
              title={img.title}
              className="img-fluid rounded doctor-patient-banner"
              loading={idx === 0 ? "eager" : "lazy"}
              width={isMobile ? "100%" : "1300"}
              height={isMobile ? "280" : "380"}
              onLoad={idx === 0 ? handleImageLoad : undefined}
              decoding={idx === 0 ? "sync" : "async"}
              fetchPriority={idx === 0 ? "high" : "low"}
            />

            {idx === 1 && (
              <Carousel.Caption>
                <button
                  className="doctor-patient-banner-btn"
                  onClick={() => {
                    window.location.href = "/doctor";
                    clickCounter();
                  }}
                  aria-label="Start Online Doctor Consultation"
                >
                  Consult Now
                </button>
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
});

HomePageCarousel.displayName = "HomePageCarousel";

export default HomePageCarousel;
