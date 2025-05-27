import React, { useState, useEffect } from "react";
import { imgKitImagePath } from "../../image-path";
import Header from "../Header/Header";
import { Link, useLocation } from "react-router-dom";
import FeaturedBlogs from "./HomeComponents/FeaturedBlogs";
import TrendingCures from "./HomeComponents/TrendingCures";
import DoctorCures from "./HomeComponents/DoctorCures";
import TrustPartnerSection from "./HomeComponents/TrustPartnerSection";
import CuresGrid from "./HomeComponents/CuresGrid";
import OurExpert from "./HomeComponents/OurExpert";
import ExpertAdviceComponent from "./HomeComponents/ExpertAdviceComponent";
import SubscriberComponent from "./HomeComponents/SubscriberComponent";
import Footer from "../Footer/Footer";

import "../../assets/healthcare/css/main.css";
import "../../assets/healthcare/css/responsive.css";

import "../../assets/healthcare/icomoon/style.css";
import "./custom.css";
import "./Home.css";
import HomePageCarousel from "./HomeComponents/HomePageCarousel";
import TrendingSearches from "./HomeComponents/TrendingSearches";

function Home() {
  // const [ads, setAds] = useState("");
  // const [adId, setAdId] = useState("");

  // useEffect(() => {
  //   const fetchAds = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${backendHost}/sponsored/list/ads/url/1`
  //       );
  //       if (response.data !== "All Ads are Served") {
  //         const idSegment = response.data.split("/")[3];
  //         const match = idSegment.match(/\d+/);
  //         if (match) setAdId(match[0]);
  //       }
  //       setAds(`https://all-cures.com:444${response.data}`);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchAds();
  // }, []);

  // const handleAdClick = () => {
  //   axios.put(`${backendHost}/sponsored/ads/clicks/${adId}`);
  // };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // Add scroll to top effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Add home-page class to body when component mounts
    document.body.classList.add("home-page");

    // Remove home-page class when component unmounts
    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="main-content">
        <HomePageCarousel />
        <TrendingSearches isMobile={isMobile} />
        <FeaturedBlogs isMobile={isMobile} />

        <Link to="/doctor">
          <img
            src={`${imgKitImagePath}/assets/img/bannersdestop-mobiles-06.jpg`}
            alt="Promo Banner"
            className="promo-banner"
          />
        </Link>

        <TrendingCures isMobile={isMobile} />
        <DoctorCures isMobile={isMobile} />
        <TrustPartnerSection />
        <CuresGrid />
        <Link to="/doctor">
          <img
            src={`${imgKitImagePath}/assets/img/bannersdestopmobiles-01.jpg`}
            alt="Promo Banner"
            className="promo-banner"
          />
        </Link>
        <OurExpert isMobile={isMobile} />
        <ExpertAdviceComponent />

        <Link to="/doctor">
          <img
            src={`${imgKitImagePath}/assets/img/Resizedbannermobdesk2.jpg`}
            alt="Promo Banner"
            className="promo-banner"
          />
        </Link>

        <SubscriberComponent />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
