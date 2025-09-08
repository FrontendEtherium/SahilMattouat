// src/components/CuresGrid.jsx
import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { backendHost } from "../../../api-config";
import headers from "../../../api-fetch";
import Heart from "../../../assets/img/heart.png";
import { Link } from "react-router-dom";
import "./CuresGrid.css";
import { imagePath, imageUrl } from "../../../image-path";
import { createArticlePath } from "../../../utils/slugUtils";

const CuresGrid = memo(({ title = "Cures", blogPage }) => {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        const { data } = await axios.get(
          `${backendHost}/article/allkv?limit=5`,
          { headers }
        );
        if (isMounted) {
          setItems(data);
          setLoaded(true);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoaded(true); // Set loaded even on error to show fallback
        }
      }
    };

    // Start loading immediately
    fetchItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayItems = isMobile ? items.slice(0, 3) : items;

  return (
    <section className="cures-container container" aria-label={title}>
      <h1 className="landing-page__title">{title}</h1>

      <div className="cures-grid__grid">
        {!loaded
          ? // Show skeleton loading state
            Array.from({ length: isMobile ? 3 : 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="cures-grid__item container skeleton-loading"
                style={{ backgroundColor: "#f0f0f0" }}
              >
                <div className="cures-grid__overlay">
                  <div
                    className="skeleton-text"
                    style={{
                      height: "20px",
                      width: "80%",
                      backgroundColor: "#e0e0e0",
                    }}
                  />
                  <div
                    className="skeleton-text"
                    style={{
                      height: "16px",
                      width: "40%",
                      backgroundColor: "#e0e0e0",
                      marginTop: "8px",
                    }}
                  />
                </div>
              </div>
            ))
          : displayItems.map((item) => {
              let contentObj = { blocks: [] };
              try {
                contentObj = JSON.parse(decodeURIComponent(item.content));
              } catch {}

              const imgLoc = item.content_location || "";
              const hasJson =
                imgLoc.includes("cures_articleimages") &&
                imgLoc.endsWith(".json");

              const imageLoc = hasJson
                ? isMobile
                  ? `${imageUrl}tr:h-200,w-250//${
                      imgLoc.replace(".json", ".png").split("/webapps/")[1]
                    }`
                  : `${imageUrl}tr:h-300,w-375/${
                      imgLoc.replace(".json", ".png").split("/webapps/")[1]
                    }`
                : "https://ik.imagekit.io/qi0xxmh2w/productimages/tr:h-100,w-300,f-webp/cures_articleimages//299/default.png";

              // Format title for URL
              const articlePath = createArticlePath(
                item.article_id,
                item.title
              );

              return (
                <div
                  key={item.article_id}
                  className="cures-grid__item container"
                  style={{ backgroundImage: `url(${imageLoc})` }}
                >
                  <Link
                    to={articlePath}
                    className="cures-grid__link"
                    aria-label={`Read article: ${item.title}`}
                  >
                    <div className="cures-grid__overlay">
                      <h2 className="cures-grid__headline">{item.title}</h2>
                      <span className="cures-grid__cta">Read more →</span>
                    </div>
                  </Link>
                </div>
              );
            })}
      </div>
      {!blogPage && (
        <Link to="allcures" aria-label="View all cures">
          <div className="featured-blogs__all">See all {">"} </div>
        </Link>
      )}
    </section>
  );
});

CuresGrid.displayName = "CuresGrid";

export default CuresGrid;
