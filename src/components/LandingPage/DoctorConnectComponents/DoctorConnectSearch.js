// src/components/DoctorConnect/DoctorConnectComponents/DoctorConnectSearch.js
import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faFlask,
  faMortarPestle,
  faSpa,
  faCapsules,
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import "./DoctorConnectSearch.css";

// Use string slugs to match route params for filtering
const fields = [
  { slug: "ayurveda", title: "Ayurveda", icon: faLeaf },
  { slug: "homeopathy", title: "Homeopathy", icon: faFlask },
  { slug: "persian", title: "Persian", icon: faMortarPestle },
  { slug: "naturopathy", title: "Naturopathy", icon: faSpa },
  { slug: "unani", title: "Unani", icon: faCapsules },
  { slug: "chinese", title: "Chinese", icon: faYinYang },
];

function DoctorConnectSearch({ changeSpeciality, speciality }) {
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");

  // Update selectedSpeciality when speciality prop changes
  useEffect(() => {
    setSelectedSpeciality(speciality || "");
  }, [speciality]);

  // Handler for searching by doctor name (requires min 3 chars)
  const handleSearchByName = () => {
    if (searchName.trim().length >= 3) {
      window.location.href = `/searchName/${encodeURIComponent(searchName)}`;
    }
  };

  // Handler for searching by city (requires min 3 chars)
  const handleSearchByCity = () => {
    if (searchCity.trim().length >= 3) {
      window.location.href = `/search/${encodeURIComponent(searchCity)}`;
    }
  };

  // On speciality select change, push route and update state
  const handleSpecialityChange = (e) => {
    const slug = e.target.value;
    setSelectedSpeciality(slug);
    changeSpeciality(slug);
  };

  return (
    <div className="search-container">
      <div className="search-input-group">
        {/* Search by Name */}
        <div>
          <label className="search-input-label">Search Doctor By Name</label>
          <div className="input-wrapper">
            <div className="input-icon">
              <PersonIcon />
            </div>
            <input
              type="text"
              placeholder="Enter doctor's name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleSearchByName}
              disabled={searchName.trim().length < 3}
              className={`input-button ${
                searchName.trim().length >= 3
                  ? "input-button--enabled"
                  : "input-button--disabled"
              }`}
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Search by City */}
        <div>
          <label className="search-input-label">Search Doctor By City</label>
          <div className="input-wrapper">
            <div className="input-icon">
              <LocationOnIcon />
            </div>
            <input
              type="text"
              placeholder="Enter city name"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleSearchByCity}
              disabled={searchCity.trim().length < 3}
              className={`input-button ${
                searchCity.trim().length >= 3
                  ? "input-button--enabled"
                  : "input-button--disabled"
              }`}
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Filter by Speciality */}
        <div>
          <label className="search-input-label">
            Filter Doctor by Speciality
          </label>
          <div className="input-wrapper">
            <select
              className="input-field"
              value={selectedSpeciality}
              onChange={handleSpecialityChange}
            >
              <option value="">All Specialities</option>
              {fields.map((field) => (
                <option key={field.slug} value={field.slug}>
                  {field.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorConnectSearch;
