import React, { memo, lazy, Suspense } from "react";
import "./TrendingCures.css";
import { imgKitImagePath } from "../../../image-path";

import { createSlug } from "../../../utils/slugUtils";

// Dynamically import Slider to reduce initial bundle size
const Slider = lazy(() => import("react-slick"));

const CuresData = [
  { title: "Ayurveda", medicineType: 1, img: "ayurveda04.png" },
  { title: "Chinese", medicineType: 4, img: "Chinese04.png" },
  { title: "Homeopathy", medicineType: 8, img: "Homopathy04.png" },
  { title: "Unani", medicineType: 2, img: "Unani04.png" },
  { title: "Japanese", medicineType: 6, img: "Japanese04.png" },
  { title: "Naturopathy", medicineType: 9, img: "Naturpathy04.png" },
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 400,
  slidesToShow: 6,
  slidesToScroll: 1,
  arrows: true,
  lazyLoad: "ondemand",
  swipeToSlide: true,
  touchThreshold: 10,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 6,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 390,
      settings: {
        slidesToShow: 3,
      },
    },
  ],
};

// Preload images
const preloadImages = () => {
  CuresData.forEach((cure) => {
    const img = new Image();
    img.src = `${imgKitImagePath}/assets/img/${cure.img}`;
  });
};

// Helper function to create SEO-friendly URL slug
const createUrlSlug = (medicineType, title) => {
  const titleSlug = createSlug(title);
  return `${medicineType}-${titleSlug}`;
};

const TrendingCures = memo(() => {
  React.useEffect(() => {
    preloadImages();
  }, []);

  return (
    <section className="container" role="region" aria-label="Trending Cures">
      <h1 className="landing-page__title">Trending Cures</h1>
      <Suspense
        fallback={<div className="trending-cures__loading">Loading...</div>}
      >
        <Slider
          {...sliderSettings}
          className="trending-cures__slider"
          aria-label="Trending cures carousel"
        >
          {CuresData.map((cure) => (
            <div
              key={cure.medicineType}
              className="trending-cures__card"
              role="article"
            >
              <a
                href={`/searchmedicine/medicinetype/${createUrlSlug(
                  cure.medicineType,
                  cure.title
                )}`}
                aria-label={`View ${cure.title} medicines`}
              >
                <img
                  loading="lazy"
                  width="85"
                  height="85"
                  src={`${imgKitImagePath}/assets/img/${cure.img}`}
                  alt={`${cure.title} medicine type - Traditional healing system`}
                  className="trending-cures__image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${imgKitImagePath}/assets/img/placeholder.png`;
                  }}
                />
                <div className="trending-cures__heading">{cure.title}</div>
              </a>
            </div>
          ))}
        </Slider>
      </Suspense>
    </section>
  );
});

TrendingCures.displayName = "TrendingCures";

export default TrendingCures;
