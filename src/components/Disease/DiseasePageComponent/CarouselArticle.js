import React, { useState, useEffect, useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { Link, useLocation } from "react-router-dom";
import { backendHost } from "../../../api-config";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { PreviewTab } from "../PreviewTab";
const options = {
  responsiveClass: true,
  nav: true,
  loop: false,
  smartSpeed: 1000,
  autoPlay: true,
  responsive: {
    0: {
      items: 2,
    },
    400: {
      items: 2,
    },
    600: {
      items: 2,
    },
    700: {
      items: 3,
    },
    1000: {
      items: 4,
    },
  },
};
function CarouselArticle({ diseaseConditionId, carouselItems, id }) {
  const [region, setRegion] = useState([]);
  const location = useLocation();
  // console.log("carousel article re rendered");

  // Fetch regions once when the component mounts
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(
          `${backendHost}/isearch/treatmentregions/${diseaseConditionId}`
        );
        const data = await response.json();
        setRegion(data);
      } catch (error) {
        console.error("Error fetching regional posts:", error);
      }
    };
    fetchRegions();
  }, [diseaseConditionId]);
  function IsJsonValid(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return [];
    }
    return JSON.parse(str).blocks;
  }
  // Optimize finalRegions calculation
  const finalRegions = useMemo(() => {
    const uniqueRegions = [];
    const map = new Map();
    for (const item of region) {
      if (item.countryname && !map.has(item.countryname)) {
        map.set(item.countryname, true);
        uniqueRegions.push({ countryname: item.countryname });
      }
    }
    return uniqueRegions;
  }, [region]);

  // Placeholder for regionalPost
  const regionalPost = useMemo(() => region, [region]); // Simulating `state.regionalPost`

  return (
    <>
      <div className="px-2 py-2" style={{ backgroundColor: "#e9ecef" }}>
        <div className="share-buttons-region ml-2" id="filter">
          <div
            className="d-flex justify-content-end margin-auto"
            id="article-acc-to-regions"
          >
            <div>
              {finalRegions.map((i) => (
                <Dropdown key={i.countryname}>
                  <Dropdown.Toggle
                    className="mr-2 my-1 btn btn-info text-white"
                    style={{
                      borderRadius: "6px",
                      fontWeight: "500",
                      fontSize: "12px",
                      padding: "6px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      background: "#00415e",
                      border: "none",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.boxShadow =
                        "0 6px 8px rgba(0, 0, 0, 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.boxShadow =
                        "0 4px 6px rgba(0, 0, 0, 0.1)")
                    }
                  >
                    <i
                      className="fas fa-globe"
                      style={{ fontSize: "14px", color: "#fff" }}
                    ></i>
                    <span style={{ color: "#fff" }}>{i.countryname}</span>
                    <i
                      className="fas fa-chevron-down"
                      style={{ fontSize: "10px", color: "#fff" }}
                    ></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="countryDrop"
                    style={{
                      minWidth: "180px",
                      padding: "6px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      background: "linear-gradient(145deg, #f0f0f0, #d9d9d9)",
                      border: "none",
                    }}
                  >
                    {regionalPost
                      .filter((j) => j.countryname === i.countryname)
                      .map((j) => (
                        <Dropdown.Item
                          href="#"
                          className="pt-2"
                          key={j.article_id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px",
                            borderRadius: "5px",
                            transition: "background-color 0.3s",
                          }}
                        >
                          <Link
                            to={`/cure/${j.article_id}-${j.title.replace(/\s+/g, "-")}`}
                            className="d-flex justify-content-between align-items-center mr-2 w-100"
                            style={{
                              textDecoration: "none",
                              color: "#00415e",
                              fontWeight: "500",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <div className="card-title mr-5">
                                {j.title.substr(0, 27) + "..."}
                              </div>
                              <div>
                                {j.type.includes(1) ? (
                                  <div className="chip overview">Overview</div>
                                ) : j.type.includes(2) ? (
                                  <div className="chip cure">Cures</div>
                                ) : j.type.includes(3) ? (
                                  <div className="chip symptoms">Symptoms</div>
                                ) : null}
                              </div>
                            </div>
                          </Link>
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              ))}
            </div>
          </div>
        </div>

        <div>
          <FacebookShareButton
            url={encodeURI(`https://www.all-cures.com${location.pathname}`)}
            quote={`All-Cures`}
            hashtag={`#allCures`}
            className="socialMediaButton"
          >
            <FacebookIcon size={36} />
          </FacebookShareButton>
          <TwitterShareButton
            url={encodeURI(`https://www.all-cures.com${location.pathname}`)}
            title={`All-Cures`}
            hashtag={`#allCures`}
            className="socialMediaButton"
          >
            <TwitterIcon size={36} />
          </TwitterShareButton>
          <WhatsappShareButton
            url={encodeURI(`https://www.all-cures.com${location.pathname}`)}
            title={`All Cures`}
            separator=": "
            className="socialMediaButton"
          >
            <WhatsappIcon size={36} />
          </WhatsappShareButton>
        </div>
      </div>
      <div className="articles-carousel" id="articles-carousel">
        {carouselItems.length !== 0 ? (
          <OwlCarousel
            nav="true"
            items={4}
            margin={10}
            autoPlay="true"
            {...options}
          >
            {carouselItems.map((i) => {
              var content = [];
              var imgLocation = i.content_location;
              var imageLoc = "";
              if (i.content) {
                content = IsJsonValid(decodeURIComponent(i.content));
              }
              if (imgLocation && imgLocation.includes("cures_articleimages")) {
                imageLoc =
                  `https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/` +
                  imgLocation.replace("json", "png").split("/webapps/")[1];
              } else {
                imageLoc =
                  "https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/cures_articleimages//299/default.png";
              }
              var ids = id.split("-")[0];
              return i.article_id != ids ? (
                <PreviewTab
                  key={i.article_id.toString()}
                  id={i.article_id}
                  title={i.title}
                  windowTitle={i.window_title}
                  content={content}
                  imageLoc={imageLoc}
                />
              ) : null;
            })}
          </OwlCarousel>
        ) : null}
      </div>
    </>
  );
}

export default React.memo(CarouselArticle);
