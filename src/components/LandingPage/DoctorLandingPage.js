import React from "react";
import Header from "../Header/Header";
import "./DoctorConnect.css";

import ValuesSection from "./DoctorConnectComponents/ValuesSection";
import Footer from "../Footer/Footer";
import DoctorByMedicineType from "./DoctorConnectComponents/DoctorByMedicineType";
import TopDoctor from "./DoctorConnectComponents/TopDoctor";

import { imgKitImagePath } from "../../image-path";

import DoctorCures from "./HomeComponents/DoctorCures";
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
        <DoctorCures />
      </main>
      <Footer />
    </>
  );
}

export default DoctorLandingPage;
