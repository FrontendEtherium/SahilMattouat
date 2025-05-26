import React, { useEffect, useState } from "react";
import { backendHost } from "../../../api-config";
import headers from "../../../api-fetch";
import axios from "axios";
import Heart from "../../../assets/img/heart.png";
import "./FeaturedBlogs.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { imagePath, imageUrl } from "../../../image-path";

function FeaturedBlogs({ isMobile }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const carouselSettings = {
    infinite: true,

    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await axios.get(`${backendHost}/article/allkv/DC`, {
          headers,
        });
        setItems(data);
        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };
    getPost();
  }, []);

  if (!loaded) {
    return (
      <div className="loader my-4">
        <img src={Heart} alt="All Cures Logo" id="heart" />
      </div>
    );
  }

  const displayItems = isMobile ? items.slice(0, 3) : items;

  return (
    <section className="container">
      <h1 className="landing-page__title">Featured Cures</h1>
      {!isMobile ? (
        <Slider {...carouselSettings}>
          {displayItems.map((item) => {
            let contentObj;
            try {
              contentObj = JSON.parse(decodeURIComponent(item.content || ""));
            } catch {
              contentObj = null;
            }

            // Build image URL
            const imgLoc = item.content_location || "";
            const hasCustom =
              imgLoc.includes("cures_articleimages") &&
              imgLoc.endsWith(".json");
            const imageLoc = hasCustom
              ? `${imageUrl}/tr:w-275,h-220,f-webp/${
                  imgLoc.replace("json", "png").split("/webapps/")[1]
                }`
              : "https://ik.imagekit.io/hg4fpytvry/product-images/tr:h-220,w-275,f-webp/cures_articleimages//299/default.png";

            // Preview text
            const previewText =
              contentObj?.blocks?.[0]?.data?.text?.slice(0, 58) ||
              "No preview available.";

            return (
              <div key={item.id} className="featured-blogs__item">
                <div className="featured-blogs__image">
                  <img src={imageLoc} alt={item.title} loading="lazy" />
                </div>
                <Link to={`/cure/${item.article_id}-${item.title}`}>
                  <div className="featured-blogs__content">
                    <h2 className="featured-blogs__headline">{item.title}</h2>
                    <p className="featured-blogs__paragraph">
                      {previewText}...
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}> 
          {displayItems.map((item) => {
            let contentObj;
            try {
              contentObj = JSON.parse(decodeURIComponent(item.content || ""));
            } catch {
              contentObj = null;
            }

            // Build image URL
            const imgLoc = item.content_location || "";
            const hasCustom =
              imgLoc.includes("cures_articleimages") &&
              imgLoc.endsWith(".json");
            const imageLoc = hasCustom
              ? `${imageUrl}/tr:w-275,h-220,f-webp/${
                  imgLoc.replace("json", "png").split("/webapps/")[1]
                }`
              : "https://ik.imagekit.io/hg4fpytvry/product-images/tr:h-250,w-300,f-webp/cures_articleimages//299/default.png";

            // Preview text
            const previewText =
              contentObj?.blocks?.[0]?.data?.text?.slice(0, 50) ||
              "No preview available.";

            return (
              <div key={item.id} className="featured-blogs__item">
                <div className="featured-blogs__image">
                  <img src={imageLoc} alt={item.title} loading="lazy" />
                </div>
                <Link to={`/cure/${item.article_id}-${item.title}`}>
                  <div className="featured-blogs__content">
                    <h2 className="featured-blogs__headline">{item.title}</h2>
                    <p className="featured-blogs__paragraph">
                      {previewText}...
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      <Link to="allcures">
        <div className="featured-blogs__all">See all {">"} </div>
      </Link>
    </section>
  );
}

export default FeaturedBlogs;
