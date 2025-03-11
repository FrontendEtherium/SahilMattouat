import React from "react";
import Header from "../Header/Header";
import "./DoctorConnect.css";
import Medicine from "../../assets/img/doctorLandingMain.png";
import FeaturedArticles from "./FeaturedArticles";
import DoctorsArticles from "./DoctorConnectComponents/DoctorsArticles";
import ValuesSection from "./DoctorConnectComponents/ValuesSection";
import Footer from "../Footer/Footer";
import DoctorByMedicineType from "./DoctorConnectComponents/DoctorByMedicineType";
import TopDoctor from "./DoctorConnectComponents/TopDoctor";
// import DoctorCarousel from "./DoctorConnectComponents/DoctorAnimatedCarousel";

import { imgKitImagePath } from "../../image-path";
import DoctorCarousel from "./DoctorConnectComponents/DoctorAnimatedCarousel";
function DoctorLandingPage() {
  return (
    <>
      <Header showSearch={false} />
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <img
          src={`${imgKitImagePath}/assets/img/ConsultationBanner.jpg`}
          alt="3 Step Image"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <main className="background-screen">
        {/* <section className="upper-section-container">
          <h2 className="upper-section-container-text">
            Discover Harmony and Healing through our various systems of medicine
          </h2>
          <img
            src={Medicine}
            alt="All-cures Medicine"
            className="upper-section-container-text-image"
          />
        </section> */}
        <TopDoctor />

        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            marginTop: "20px",
          }}
        >
          <img
            src="https://ik.imagekit.io/qi0xxmh2w/productimages/assets/img/3step.jpg"
            alt="3 Step Image"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <DoctorByMedicineType />

        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            gap: "5px",

            marginTop: "30px",
          }}
        >
          <img
            src={`${imgKitImagePath}/assets/img/Offerbanner.jpg`}
            alt="3 Step Image"
            style={{ width: "50%", height: "auto" }}
          />
          <img
            src={`${imgKitImagePath}/assets/img/banner02.jpg`}
            alt="3 Step Image"
            style={{ width: "50%", height: "auto" }}
          />
        </div>

        <ValuesSection />

        <section className="mb-64 mt-10 " style={{ height: "650px" }}>
          <div className="container" id="trends">
            <div className="row">
              <div className="values-section__title">
                Read top articles from our health experts
              </div>
            </div>
            <div className="row mt-4">
              <DoctorsArticles />
            </div>
          </div>
        </section>
        {/* <DoctorCarousel/> */}
      </main>
      <Footer />
    </>
  );
}

export default DoctorLandingPage;
