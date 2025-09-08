import React, { useState, useEffect } from "react";
import { backendHost } from "../../api-config";
import { Link } from "react-router-dom";
import CenterWell from "../Disease/CenterWell";
import OwlCarousel from "react-owl-carousel";
import { createArticlePath } from "../../utils/slugUtils";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const options = {
  margin: 30,
  responsiveClass: true,
  nav: true,
  loop: false,
  dots: true,
  smartSpeed: 1000,
  // responsive: {
  //     0: {
  //         items: 2,
  //     },
  //     400: {
  //         items: 2,
  //     },
  //     600: {
  //         items: 2,
  //     },
  //     700: {
  //         items: 3,
  //     },
  //     1000: {
  //         items: 4,

  //     }
  // },
};

const CarouselPreview = (props) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [articleFilter, setArticleFilter] = useState(
    props.dcName ? props.dcName : "recent"
  );

  // function diseasePosts(type){                     // For specific blogs like "/blogs/diabetes"
  //     // if(type){
  //       fetch(`${backendHost}/isearch/${type}`)
  //       .then((res) => res.json())
  //       .then((json) => {
  //         setLoaded(true)
  //         setItems(json)
  //       })
  //       .catch(err => null)
  //   }

  function allPosts() {
    // For all available blogs "/blogs"

    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });

    fetch(`${backendHost}/article/allkv`, {
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
        if (articleFilter === props.dcName) {
          json.forEach((i) => {
            if (
              i.dc_name === props.dcName &&
              i.pubstatus_id === 3 &&
              i.type.includes(2)
            ) {
              temp.push(i);
            }
          });
          setItems(temp);
        } else if (articleFilter === "recent") {
          json.forEach((i) => {
            if (i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp);
        } else if (articleFilter === "earliest") {
          json.forEach((i) => {
            if (i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp);
        } else if (articleFilter === "diabetes") {
          json.forEach((i) => {
            if (i.dc_name === "Diabetes" && i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp);
        } else if (articleFilter === "neurology") {
          json.forEach((i) => {
            if (i.dc_name === "Neurology" && i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp);
        } else if (articleFilter === "arthritis") {
          json.forEach((i) => {
            if (i.dc_name === "Arthritis" && i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp);
        } else if (articleFilter === "anemia") {
          json.forEach((i) => {
            if (i.dc_name === "Anemia" && i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp);
        }
        setLoaded(true);
      })
      .catch((err) => null);
  }

  // function articleFilterClick(e, filter) {
  //     setArticleFilter(filter)
  //     var siblings = e.target.parentNode.parentElement.children
  //     if(siblings){
  //         for(var i=0;i<siblings.length; i++){
  //             if(siblings[i].classList.contains('active')){
  //                 siblings[i].classList.remove('active')
  //             }
  //           }
  //         e.target.parentElement.classList.add('active')
  //     }
  // }

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
        <i className="fa fa-spinner fa-spin fa-6x" />
      </div>
    );
  } else {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="main-hero" id="">
              {items.length !== 0 ? (
                items
                  .filter((i, idx) => idx < 9)
                  .map(
                    (i) => {
                      var content = [];
                      var imgLocation = i.content_location;
                      var imageLoc = "";
                      if (i.content) {
                        content = IsJsonValid(decodeURIComponent(i.content));
                      }
                      if (
                        imgLocation &&
                        imgLocation.includes("cures_articleimages")
                      ) {
                        imageLoc =
                          `https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/` +
                          imgLocation
                            .replace("json", "png")
                            .split("/webapps/")[1];
                      } else {
                        imageLoc =
                          "https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/cures_articleimages//299/default.png";
                      }

                      const articlePath = createArticlePath(
                        i.article_id,
                        i.title
                      );

                      return (
                        <>
                          <OwlCarousel
                            nav="true"
                            items={1}
                            margin={10}
                            {...options}
                          >
                            <div className="carousel-articles">
                              <div className="col-md-12 my-3">
                                <div className="card d-flex justify-content-between">
                                  <div className="p-2 py-3 text-dark col-md-7 text-center">
                                    <Link to={articlePath}>
                                      <div className="text-capitalize h5">
                                        {i.title.toLowerCase()}
                                      </div>
                                    </Link>

                                    <p className="card-text card-article-content-preview">
                                      {content
                                        ? content.map(
                                            (j, idx) =>
                                              idx < 1 && (
                                                <CenterWell
                                                  content={j.data.content}
                                                  type={j.type}
                                                  text={
                                                    j.data.text.substr(0, 400) +
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
                                    </p>
                                  </div>
                                  {/* <div className="col-md-6 rounded" > */}
                                  <img
                                    className="col-md-5 rounded"
                                    src={imageLoc}
                                    alt="preview"
                                  />
                                  {/* </div> */}
                                </div>
                              </div>
                            </div>
                          </OwlCarousel>
                        </>
                      );
                    }

                    // : null
                  )
              ) : (
                <div className="my-5 py-4 h5 container text-center">
                  We do not have any cures for this condition yet but our
                  editorial team is working on it. In the meantime, if you have
                  a cure, Please <Link to="/article">Click Here</Link> to add
                  the cure to our site.
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default CarouselPreview;
