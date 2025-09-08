import React, { useState, useEffect } from "react";
import { backendHost } from "../../api-config";
import { Link } from "react-router-dom";
import CenterWell from "../Disease/CenterWell";
import { createArticlePath } from "../../utils/slugUtils";
import Heart from "../../assets/img/heart.png";
import Date from "../Date";
import { useHistory } from "react-router";

const ArticlePreview = (props) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [articleFilter, setArticleFilter] = useState(
    props.dcName ? props.dcName : "recent"
  );
  const history = useHistory();

  function diseasePosts(type) {
    // For specific blogs like "/blogs/diabetes"
    // if(type){
    fetch(`${backendHost}/isearch/${type}`)
      .then((res) => res.json())
      .then((json) => {
        setLoaded(true);
        setItems(json);
      })
      .catch((err) => null);
  }

  function allPosts() {
    // For all available blogs "/blogs"

    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });

    console.log("All Posts");
    fetch(`${backendHost}/article/allkv?limit=9&offset=${offset}`, {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        //   .then((res) => res.json())
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        console.log("Article Response from articellpreview", json);

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
        }
        setLoaded(true);
      })
      .catch((err) => null);
  }

  function articleFilterClick(e, filter) {
    setArticleFilter(filter);
    var siblings = e.target.parentNode.parentElement.children;
    if (siblings) {
      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].classList.contains("active")) {
          siblings[i].classList.remove("active");
        }
      }
      e.target.parentElement.classList.add("active");
    }
  }

  function paginateButtons(e) {
    var siblings = e.target.parentElement.children;
    if (siblings) {
      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].classList.contains("active")) {
          siblings[i].classList.remove("active");
        }
      }
      e.target.classList.add("active");
    }
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
    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });
    fetch(`${backendHost}/article/allkv?limit=9&offset=${offset}`, {
      headers: headers,
    })
      .then((res) => {
        //   .then((res) => res.json())
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })

      .then((json) => {
        console.log("json 2", json);
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
          console.log("temp Item", temp);

          setItems(temp);
        } else if (articleFilter === "earliest") {
          console.log("3 run");
          json.forEach((i) => {
            if (i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp);
        }
        setLoaded(true);
      })
      .catch(function (error) {
        console.log(error);
      });
    // allPosts()
  }, []);

  useEffect(
    (e) => {
      const headers = new Headers({
        Authorization: "Bearer local@7KpRq3XvF9",
      });
      fetch(`${backendHost}/article/allkv?limit=9&offset=${offset}`, {
        headers: headers,
      })
        .then((res) => {
          //   .then((res) => res.json())
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((json) => {
          console.log("json 1");
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
          }
          setLoaded(true);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    [offset]
  );

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
          <div className="row">
            <div className="tab-nav">
              {props.type === "cures" ? null : (
                <>
                  <div className="comman-heading">
                    <div className="h4 mt-4 text-capitalize">
                      {articleFilter} Cures
                    </div>
                  </div>
                  <div>
                    <ul>
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            allPosts();
                            articleFilterClick(e, "recent");
                          }}
                        >
                          Recent
                        </button>
                      </li>
                      {/* <li role="presentation" className='my-1'>
                      <button className="btn mr-2" onClick={(e) => { 
                            allPosts() 
                            articleFilterClick(e, 'earliest')
                        }}>Earliest</button>
                   </li> */}
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            diseasePosts("diabetes");
                            articleFilterClick(e, "diabetes");
                          }}
                        >
                          Diabetes
                        </button>
                      </li>
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            diseasePosts("Thyroid");
                            articleFilterClick(e, "Thyroid");
                          }}
                        >
                          Thyroid
                        </button>
                      </li>
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            diseasePosts("arthritis");
                            articleFilterClick(e, "arthritis");
                          }}
                        >
                          Arthritis
                        </button>
                      </li>
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            diseasePosts("Insomnia");
                            articleFilterClick(e, "Insomnia");
                          }}
                        >
                          Insomnia
                        </button>
                      </li>
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            diseasePosts("migraine");
                            articleFilterClick(e, "migraine");
                          }}
                        >
                          Migraine
                        </button>
                      </li>
                      {/* <li role="presentation" className='my-1'>
                      <button className="btn mr-2" onClick={(e) => {
                            diseasePosts('Hypertension')
                            articleFilterClick(e, 'Hypertension')
                        }}>Hypertension</button>
                   </li> */}
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            diseasePosts("Skin Care");
                            articleFilterClick(e, "Skin Care");
                          }}
                        >
                          Skin Care
                        </button>
                      </li>
                      <li role="presentation" className="my-1">
                        <button
                          className="btn mr-2"
                          onClick={(e) => {
                            diseasePosts("Psoriasis");
                            articleFilterClick(e, "Psoriasis");
                          }}
                        >
                          Psoriasis
                        </button>
                      </li>
                      {/* <li role="presentation" className='my-1'>
                      <button className="btn mr-2" onClick={(e) => {
                            diseasePosts('Healthy Living')
                            articleFilterClick(e, 'Healthy Living')
                        }}>Healthy Living</button>
                   </li> */}
                      {/* <li role="presentation" className='my-1'>
                      <button className="btn" onClick={(e) => articleFilterClick(e, 'recent')}>Most Rated</button>
                   </li> */}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="row">
            <div className="main-hero" id="main-hero">
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
                          `https://ik.imagekit.io/hg4fpytvry/product-images/tr:h-250,w-300,f-webp/` +
                          imgLocation
                            .replace("json", "png")
                            .split("/webapps/")[1];
                      } else {
                        imageLoc =
                          " https://ik.imagekit.io/hg4fpytvry/product-images/tr:h-250,w-300,f-webp/cures_articleimages//299/default.png";
                      }

                      const articlePath = createArticlePath(
                        i.article_id,
                        i.title
                      );
                      return (
                        <div className="col-4" key={i.article_id.toString()}>
                          <div className="card my-2 w-100">
                            <div className="card-img">
                              <img src={imageLoc} />
                            </div>
                            <div className="card-body">
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
                                <Link to={articlePath}>
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
                                            <CenterWell
                                              key={idx}
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

          {articleFilter === "recent" ? (
            <div className="pagination-preview">
              <button
                className="btn border mr-2 active"
                onClick={(e) => {
                  setOffset(0);
                  paginateButtons(e);
                }}
              >
                1
              </button>
              <button
                className="btn border mr-2"
                onClick={(e) => {
                  setOffset(9);
                  paginateButtons(e);
                }}
              >
                2
              </button>
              <button
                className="btn border mr-2"
                onClick={(e) => {
                  setOffset(18);
                  paginateButtons(e);
                }}
              >
                3
              </button>
              <button
                className="btn border mr-2"
                onClick={(e) => {
                  setOffset(27);
                  paginateButtons(e);
                }}
              >
                4
              </button>
              <button
                className="btn border mr-2"
                onClick={(e) => {
                  setOffset(36);
                  paginateButtons(e);
                }}
              >
                5
              </button>
              <button
                className="btn border mr-2"
                onClick={(e) => {
                  setOffset(45);
                  paginateButtons(e);
                }}
              >
                6
              </button>
              <button
                className="btn border mr-2"
                onClick={(e) => {
                  setOffset(54);
                  paginateButtons(e);
                }}
              >
                7
              </button>
              <button
                className="btn border mr-2"
                onClick={(e) => {
                  setOffset(63);
                  paginateButtons(e);
                }}
              >
                8
              </button>
              {/* <button className='btn border mr-2' onClick={() => setOffset(81)}>9</button> */}
              <button
                className="btn border mr-2 show-all-cures"
                id="show-all-cures"
                onClick={() => history.push("/searchcures")}
              >
                Show All
              </button>
            </div>
          ) : null}
        </div>
      </>
    );
  }
};

export default ArticlePreview;
