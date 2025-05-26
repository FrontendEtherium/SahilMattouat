// src/components/DoctorByMedicineType.js
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf, // Ayurveda
  faFlask, // Homeopathy
  faMortarPestle, // Persian
  faSpa, // Naturopathy
  faCapsules, // Unani
  faYinYang, // Chinese
} from "@fortawesome/free-solid-svg-icons";

// NOTE: `slug` must match what your Route expects as :medicineType
const fields = [
  { slug: "ayurveda", title: "Ayurveda", icon: faLeaf },
  { slug: "homeopathy", title: "Homeopathy", icon: faFlask },
  { slug: "persian", title: "Persian", icon: faMortarPestle },
  { slug: "naturopathy", title: "Naturopathy", icon: faSpa },
  { slug: "unani", title: "Unani", icon: faCapsules },
  { slug: "chinese", title: "Chinese", icon: faYinYang },
];

function DoctorByMedicineType() {
  return (
    <section className="medicine-doc-container">
      <div className="medicine-doc-container-upper">
        <h2 className="medicine-doc-container-upper-text-heading">
          Consult Top Doctors Online for Any Health Concern
        </h2>
        <p className="medicine-doc-container-upper-text-subHeading">
          Video and Chat consultations with verified doctors in all specialties
        </p>
      </div>

      <div className="medicine-types-container">
        {fields.map((field) => (
          <Link
            key={field.slug}
            to={`/doctor-connect/${field.slug}`}
            className="medicine-type-card"
            aria-label={`Consult ${field.title} doctors`}
          >
            <FontAwesomeIcon
              icon={field.icon}
              className="medicine-icon"
              size="3x"
            />
            <h3 className="medicine-type-title">{field.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DoctorByMedicineType;
