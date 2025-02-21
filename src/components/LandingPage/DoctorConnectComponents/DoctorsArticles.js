import React, { useState, useEffect } from "react";
import { backendHost } from "../../../api-config";
import { Link } from "react-router-dom";
import CenterWell from "../../Disease/CenterWell";
import Heart from "../../../assets/img/heart.png";
import Date from "../../Date";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core";
import DoctorTrendingCuresCard from "./DoctorTrendingCuresCard";

const options = {
  margin: 30,
  responsiveClass: true,
  nav: true,
  loop: false,
  dots: true,
  smartSpeed: 1000,
  singleItem: true,
  items: 1,
  responsive: {
    0: {
      items: 1,
    },
    400: {
      items: 1,
    },
    600: {
      items: 2,
    },
    700: {
      items: 2,
    },
    1000: {
      items: 3,
    },
  },
};

const DoctorsArticles = (props) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [articleFilter, setArticleFilter] = useState(
    props.dcName ? props.dcName : "recent"
  );

  function allPosts() {
    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });

    fetch(`${backendHost}/article/allkvfeatured`, {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        var temp = [];
        json.forEach((i) => {
          temp.push(i);
        });
        setItems(temp);
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function IsJsonValid(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return [];
    }
    return JSON.parse(str).blocks;
  }

  useEffect(() => {
    allPosts();
  }, []);

  if (!isLoaded) {
    return (
      <div className="loader my-4">
        <img src={Heart} alt="All Cures Logo" id="heart" />
      </div>
    );
  } else {
    return (
      <>
        <div className="container">
          <div className="row" marginBottom={10}>
            <div className="main-hero" id="main-hero">
              <OwlCarousel
                {...options}
                nav="true"
                id="featured"
                height={550}
                items={1}
                singleItem={true}
                margin={10}
              >
                {items.length !== 0
                  ? items
                      .filter((i, idx) => idx < 9)
                      .map(
                        (i) => {
                          var content = [];
                          var imgLocation = i.content_location;
                          var imageLoc = "";
                          if (i.content) {
                            content = IsJsonValid(
                              decodeURIComponent(i.content)
                            );
                          }
                          if (
                            imgLocation &&
                            imgLocation.includes("cures_articleimages")
                          ) {
                            imageLoc =
                              ` https://ik.imagekit.io/hg4fpytvry/product-images/tr:h-250,w-300,f-webp/` +
                              imgLocation
                                .replace("json", "png")
                                .split("/webapps/")[1];
                          } else {
                            imageLoc =
                              "https://ik.imagekit.io/hg4fpytvry/product-images/tr:h-250,w-300,f-webp/cures_articleimages//299/default.png";
                          }

                          var title = i.title;
                          var regex = new RegExp(" ", "g");

                          //replace via regex
                          title = title.replace(regex, "-");
                          return (
                            <div className="col-4">
                              <div className=" my-2 w-100">
                                <div className="card-img">
                                  <img src={imageLoc} />
                                </div>
                                <div className="card-body-doc-article">
                                  <h6 className="pb-2 text-muted">
                                    {i.authors_name !== "All Cures Team" ? (
                                      <Link to={`/doctor/${i.docID}`}>
                                        {i.authors_name}
                                      </Link>
                                    ) : (
                                      i.authors_name
                                    )}{" "}
                                    ▪️ {<Date dateString={i.published_date} />}
                                  </h6>
                                  <h5 className="card-title text-capitalize">
                                    <Link to={`/cure/${i.article_id}-${title}`}>
                                      {i.title.toLowerCase()}
                                    </Link>
                                  </h5>
                                  <div className="card-info">
                                    {/* <h6 className="card-subtitle mb-2 text-muted text-capitalize">
                                    {i.window_title.toLowerCase()}
                                </h6> */}

                                    <div className="card-text card-article-content-preview">
                                      {content
                                        ? content.map(
                                            (j, idx) =>
                                              idx < 1 && (
                                                <DoctorTrendingCuresCard
                                                  content={j.data.content}
                                                  type={j.type}
                                                  text={
                                                    j.data.text.substr(0, 250) +
                                                    "...."
                                                  }
                                                  title={j.data.title}
                                                  message={j.data.message}
                                                  source={j.data.source}
                                                  embed={j.data.embed}
                                                  caption={j.data.caption}
                                                  alignment={j.data.alignment}
                                                  imageUrl={
                                                    j.data.file
                                                      ? j.data.file.url
                                                      : null
                                                  }
                                                  url={j.data.url}
                                                />
                                              )
                                          )
                                        : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // : null
                      )
                  : null}
              </OwlCarousel>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default DoctorsArticles;
