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
function TopDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center error">{error}</div>;
  const consult = () => {
    if (userAccess && userId) {
      setShowAppointmentModal(true);
    } else {
      setShowModal(true);
    }
  };
  return (
    <>
      {" "}
      <div className="container">
        <h2>Top Doctors</h2>

        <div className="grid">
          {doctors.map((doctor) => (
            <DoctorConnectCard doc={doctor} />
          ))}
        </div>
      </div>
    </>
  );
}

export default TopDoctor;
