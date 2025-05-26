import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { backendHost } from "../../../api-config";
import axios from "axios";
import "./OurExpert.css";
import { Link } from "react-router-dom";
import Heart from "../../../assets/img/heart.png";
import Slider from "react-slick";
import { userAccess } from "../../UserAccess";
import Test from "../test";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";
import { imageUrl } from "../../../image-path";

const OurExpert = React.memo(({ isMobile }) => {
  const [docData, setDocData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState(null);

  // Memoize carousel settings inside the component
  const carouselSettings = useMemo(
    () => ({
      infinite: true,
      speed: 700,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 4000,
      arrows: true,
      pauseOnFocus: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
      ],
    }),
    []
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(
          `${backendHost}/SearchActionController?cmd=getResults&FeaturedDoctors=901,903,905,872,907,923,873,894,885,874,941`,
          { signal: controller.signal }
        );
        if (isMounted) {
          setDocData(data.map.DoctorDetails.myArrayList);
          setLoaded(true);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && isMounted) {
          console.error(error);
          setError(error);
        }
      }
    };

    fetchDoctor();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleBookAppointment = useCallback((videoService, docID) => {
    if (!userAccess) {
      setModalShow(true);
    }
    if (videoService === 1) {
      // Handle video service
    }
  }, []);

  if (error) {
    return (
      <section className="container" aria-label="Error loading experts">
        <p>Unable to load experts. Please try again later.</p>
      </section>
    );
  }

  if (!loaded) {
    return (
      <section className="loader my-4" aria-label="Loading experts">
        <img src={Heart} alt="All Cures Logo" id="heart" />
      </section>
    );
  }

  return (
    <section className="container" aria-label="Our Medical Experts">
      <h1 className="landing-page__title">Meet Our Experts</h1>
      <Suspense fallback={<div>Loading experts...</div>}>
        <Slider {...carouselSettings}>
          {docData.map((doc) => (
            <article key={doc.map.docID} className="our-expert_card_container">
              <Link
                to={`/doctor/${doc.map.docID}-${doc.map.firstName}-${doc.map.lastName}`}
                className=""
                id=""
              >
                {doc.map.imgLoc ? (
                  <img
                    src={`${imageUrl}/tr:h-220,w-180,f-webp${doc.map?.imgLoc}`}
                    className="our-expert_image"
                    loading="lazy"
                    alt={`${doc.map?.prefix} ${doc.map.firstName} ${doc.map.lastName} - ${doc.map?.medicineType}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ""; // Clear src to prevent infinite loop
                
                    }}
                  />
                ) : (
                  <div
                    className="our-expert_image"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    role="img"
                    aria-label={`${doc.map?.prefix} ${doc.map.firstName} ${doc.map.lastName} profile picture`}
                  >
                    <FontAwesomeIcon icon={faUserMd} size="7x" />
                  </div>
                )}
                <h2 className="our-expert_heading">
                  {doc.map?.prefix} {doc.map.firstName} {doc.map.lastName}
                </h2>
                <h3 className="our-expert_sub_heading">
                  {doc.map?.medicineType}
                  {doc.map?.hospitalAffliated}
                </h3>
                {doc.map?.degDesc ? (
                  <h4 className="our-expert_sub_heading1">
                    {doc.map?.degDesc}
                  </h4>
                ) : (
                  <h4 className="our-expert_sub_heading1">-</h4>
                )}

                <div
                  className="our-expert__button"
                  onClick={() =>
                    handleBookAppointment(doc.map?.videoService, doc.map?.docID)
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={`Book appointment with ${doc.map.firstName} ${doc.map.lastName}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleBookAppointment(
                        doc.map?.videoService,
                        doc.map?.docID
                      );
                    }
                  }}
                >
                  Book an appointment
                </div>
              </Link>
            </article>
          ))}
        </Slider>
      </Suspense>
      <Test show={modalShow} onHide={() => setModalShow(false)} />
    </section>
  );
});

OurExpert.displayName = "OurExpert";

export default OurExpert;
