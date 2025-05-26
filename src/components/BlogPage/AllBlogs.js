import React, { useEffect, useState } from "react";
import UpdatedHeader from "../Header/Header";
import axios from "axios";
import { backendHost } from "../../api-config";
import headers from "../../api-fetch";
import { Link } from "react-router-dom";
import "./AllBlogs.css";
import SubscriberComponent from "../LandingPage/HomeComponents/SubscriberComponent";
import Footer from "../Footer/Footer";
import { imageUrl, imgKitImagePath } from "../../image-path";
import Heart from "../../assets/img/heart.png";
import CuresGrid from "../LandingPage/HomeComponents/CuresGrid";
import DoctorCures from "../LandingPage/HomeComponents/DoctorCures";
import { Helmet } from "react-helmet";

function CureGrid({ items, isMobile, onNext, onPrev, hasPrev }) {
  const displayItem = isMobile ? items.slice(0, 6) : items;
  return (
    <section className="cure-grid container">
      <h2 className="landing-page__title">Cures</h2>
      <div className="cure-grid__list">
        {displayItem.map((item) => {
          const imgLoc = item.content_location || "";
          const hasJson =
            imgLoc.includes("cures_articleimages") && imgLoc.endsWith(".json");
          const bgImage = hasJson
            ? `${imageUrl}/tr:h-230,w-320,f-webp/${
                imgLoc.replace(".json", ".png").split("/webapps/")[1]
              }`
            : `${imageUrl}/tr:h-400,w-250,f-webp/cures_articleimages//299/default.png`;

          return (
            <div className="curesGrid__container">
              <div
                style={{ backgroundImage: `url(${bgImage})` }}
                className="curesGrid__image"
              >
                <div className="cure-card__info">
                  <Link
                    key={item.id}
                    to={`/cure/${item.article_id}-${item.title}`}
                    className="cure-card"
                  >
                    <p className="expert-card__meta">
                      {item.authors_name} · {formatDate(item.published_date)}
                    </p>
                    <h3 className="cure-card__title">{item.title}</h3>
                    {/* <p className="cure-card__preview">
                      {getPreview(item.content)}
                    </p> */}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="cure-grid__pagination"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        {hasPrev ? (
          <span
            className="cure-grid__prev"
            style={{ cursor: "pointer" }}
            onClick={onPrev}
          >
            ← Previous
          </span>
        ) : (
          <span /> // empty to keep spacing
        )}
        <span
          className="cure-grid__next"
          style={{ cursor: "pointer" }}
          onClick={onNext}
        >
          Next →
        </span>
      </div>
    </section>
  );
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AllBlogs() {
  const [items, setItems] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [offset, setOffset] = useState(0);
  const [expertPage, setExpertPage] = useState(0);
  const expertPageSize = 4;
  const totalExpertPages = Math.ceil(experts.length / expertPageSize);
  const limit = isMobile ? 7 : 12;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchArticles() {
      try {
        const [curesRes, expertsRes] = await Promise.all([
          axios.get(
            `${backendHost}/article/allkv?limit=${limit}&offset=${offset}`,
            { headers, signal }
          ),
          axios.get(`${backendHost}/article/allkvfeatured?limit=24`, {
            headers,
            signal,
          }),
        ]);

        setItems(curesRes.data);
        setExperts(expertsRes.data);
        setLoaded(true);
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        console.error("Failed to fetch articles:", err);
      }
    }

    fetchArticles();
    return () => controller.abort();
  }, [offset, isMobile]);

  const handleNext = () => setOffset((prev) => prev + limit);
  const handlePrev = () => setOffset((prev) => Math.max(prev - limit, 0));

  return (
    <div className="all-blogs-page">
      <Helmet>
        <title>All Cures - Health and Wellness Articles</title>
        <meta
          name="description"
          content="Discover expert-written health and wellness articles, cures, and medical advice from qualified healthcare professionals."
        />
        <meta
          name="keywords"
          content="health articles, wellness, medical advice, cures, healthcare"
        />
        <meta
          property="og:title"
          content="All Cures - Health and Wellness Articles"
        />
        <meta
          property="og:description"
          content="Discover expert-written health and wellness articles, cures, and medical advice from qualified healthcare professionals."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <UpdatedHeader />
      {loaded ? (
        <main>
          <CuresGrid title={"Recent Cures"} blogPage={true} />
          <Link to="/doctor" aria-label="Visit doctor section">
            <img
              src={`${imgKitImagePath}/assets/img/bannersdestop-mobiles-06.jpg`}
              alt="Promo Banner - Find a Doctor"
              className="promo-banner"
              loading="lazy"
            />
          </Link>
          <CureGrid
            items={items}
            isMobile={isMobile}
            onNext={handleNext}
            onPrev={handlePrev}
            hasPrev={offset > 0}
          />
          <Link to="/doctor" aria-label="Visit doctor section">
            <img
              src={`${imgKitImagePath}/assets/img/bannersdestopmobiles-01.jpg`}
              alt="Promo Banner - Doctor Services"
              className="promo-banner"
              loading="lazy"
            />
          </Link>
          <DoctorCures blogPage={true} />
          <SubscriberComponent />
        </main>
      ) : (
        <div className="loader my-4" role="status" aria-label="Loading content">
          <img src={Heart} alt="All Cures Logo" id="heart" />
        </div>
      )}
      <Footer />
    </div>
  );
}
