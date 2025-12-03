import React from "react";
import "./DoctorConnectMobileFilters.css";

const fields = [
  { slug: "ayurveda", title: "Ayurveda" },
  { slug: "homeopathy", title: "Homeopathy" },
  { slug: "persian", title: "Persian" },
  { slug: "naturopathy", title: "Naturopathy" },
  { slug: "unani", title: "Unani" },
  { slug: "chinese", title: "Chinese" },
];

const DoctorConnectMobileFilters = ({ speciality, changeSpeciality }) => {
  const handleChange = (event) => {
    changeSpeciality(event.target.value);
  };

  return (
    <section className="doctor-connect-mobile-filter" aria-label="Filter by speciality">
      <label htmlFor="doctor-connect-mobile-select">Speciality</label>
      <div className="doctor-connect-mobile-select-wrapper">
        <select
          id="doctor-connect-mobile-select"
          value={speciality || ""}
          onChange={handleChange}
        >
          <option value="">All Specialities</option>
          {fields.map((field) => (
            <option key={field.slug} value={field.slug}>
              {field.title}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default DoctorConnectMobileFilters;
