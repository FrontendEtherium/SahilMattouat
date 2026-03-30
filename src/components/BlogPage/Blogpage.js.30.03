import React, { useState, useEffect, useCallback } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AllPost from "./Allpost.js";
import { backendHost } from "../../api-config";
import { Link } from "react-router-dom";
import Heart from "../../assets/img/heart.png";
import headers from "../../api-fetch.js";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center my-5">
          <h2>Something went wrong.</h2>
          <p>
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Blogpage = (props) => {
  const params = props.match.params;
  const [state, setState] = useState({
    limit: 15,
    offset: 0,
    dc: props.location.search.split("&")[1],
    noMoreArticles: false,
    param: params,
    items: [],
    isLoaded: false,
    LoadMore: false,
    regionPostsLoaded: false,
    country: new URLSearchParams(props.location.search).get("c"),
    diseaseCondition: new URLSearchParams(props.location.search).get("dc"),
    articleFilter: "recent",
    isDiseasePostsActive: false,
    error: null,
    isLoading: false,
  });

  const allPosts = useCallback(
    (loadMore) => {
      if (loadMore === "loadMore") {
        setState((prev) => ({ ...prev, LoadMore: false }));
      }
      if (state.noMoreArticles) {
        return;
      } else {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        fetch(
          `${backendHost}/article/allkv?limit=${state.limit}&offset=${state.offset}`,
          {
            method: "GET",
            headers: headers,
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((json) => {
            if (json.length === 0) {
              setState((prev) => ({ ...prev, noMoreArticles: true }));
              return null;
            }
            let temp = [];
            if (state.articleFilter === "recent") {
              temp = json.filter((i) => i.pubstatus_id === 3);
            } else if (state.articleFilter === "earliest") {
              temp = json.filter((i) => i.pubstatus_id === 3);
            }
            temp.sort(
              (a, b) => new Date(b.published_date) - new Date(a.published_date)
            );
            setState((prev) => ({
              ...prev,
              LoadMore: true,
              isLoaded: true,
              isLoading: false,
              items: loadMore ? [...prev.items, ...temp] : temp,
            }));
          })
          .catch((err) => {
            setState((prev) => ({
              ...prev,
              error: "Failed to load articles. Please try again later.",
              isLoading: false,
            }));
          });
      }
    },
    [state.limit, state.offset, state.noMoreArticles, state.articleFilter]
  );

  const diseasePosts = useCallback((type) => {
    setState((prev) => ({ ...prev, isDiseasePostsActive: true }));
    fetch(`${backendHost}/isearch/${type}`)
      .then((res) => res.json())
      .then((json) => {
        json.sort(
          (a, b) => new Date(b.published_date) - new Date(a.published_date)
        );
        setState((prev) => ({
          ...prev,
          isLoaded: true,
          items: json,
        }));
      })
      .catch((err) => {
        return;
      });
  }, []);

  const regionalPosts = useCallback(() => {
    fetch(`${backendHost}/isearch/treatmentregions/${state.dc.split("=")[1]}`)
      .then((res) => res.json())
      .then((json) => {
        setState((prev) => ({
          ...prev,
          regionPostsLoaded: true,
          items: json.reverse(),
        }));
      })
      .catch((err) => {
        return;
      });
  }, [state.dc]);

  const handleScroll = useCallback(() => {
    const { articleFilter, isDiseasePostsActive } = state;

    if (isDiseasePostsActive) {
      return;
    }

    if (articleFilter === "recent" || articleFilter === "earliest") {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (bottom) {
        setState((prev) => ({
          ...prev,
          offset: prev.offset + 15,
        }));
        allPosts("loadMore");
      }
    }
  }, [state.articleFilter, state.isDiseasePostsActive, allPosts]);

  const articleFilterClick = useCallback((e, filter) => {
    setState((prev) => ({ ...prev, articleFilter: filter, offset: 0 }));
    var siblings = e.target.parentNode.parentElement.children;
    if (siblings) {
      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].classList.contains("active")) {
          siblings[i].classList.remove("active");
        }
      }
      e.target.parentElement.classList.add("active");
    }
  }, []);

  useEffect(() => {
    if (props.match.params.type !== undefined) {
      diseasePosts(props.match.params.type);
    } else if (props.location.search) {
      regionalPosts();
    } else {
      allPosts();
    }
  }, [
    props.match.params.type,
    props.location.search,
    diseasePosts,
    regionalPosts,
    allPosts,
  ]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const { isLoaded, items, regionPostsLoaded, LoadMore } = state;

  if (!isLoaded && !regionPostsLoaded) {
    return (
      <>
        <Header history={props.history} />
        <div className="loader my-4">
          <img
            src={Heart}
            alt="Loading indicator - All Cures Logo"
            id="heart"
          />
        </div>
        <Footer />
      </>
    );
  }

  if (state.error) {
    return (
      <>
        <Header history={props.history} />
        <div className="container text-center my-5">
          <h2>Error</h2>
          <p>{state.error}</p>
          <button
            className="btn btn-primary"
            onClick={() => allPosts()}
            aria-label="Retry loading articles"
          >
            Retry
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (isLoaded) {
    return (
      <ErrorBoundary>
        <Header history={props.history} />
        <div className="container cures-search my-4">
          {props.match.params.type ? (
            <>
              <h1 className="h3 text-capitalize text-center font-weight-bold ">
                Cures Related to "{props.match.params.type.toLowerCase()}"
              </h1>
              <h2 className="text-center h5 mb-4">
                Explore Proven Natural Remedies from Trusted Healing Systems
              </h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb ">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/allcures">Cures</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {props.match.params.type.toLowerCase()}
                  </li>
                </ol>
              </nav>
            </>
          ) : (
            <div className="tab-nav">
              <ul>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "recent",
                      }));
                      allPosts();
                      articleFilterClick(e, "recent");
                    }}
                    aria-label="Show recent articles"
                    aria-pressed={state.articleFilter === "recent"}
                  >
                    Recent
                  </button>
                </li>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "earliest",
                      }));
                      allPosts();
                      articleFilterClick(e, "earliest");
                    }}
                  >
                    Earliest
                  </button>
                </li>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "diabetes",
                      }));
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
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "arthritis",
                      }));
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
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "thyroid",
                      }));
                      diseasePosts("thyroid");
                      articleFilterClick(e, "thyroid");
                    }}
                  >
                    Thyroid
                  </button>
                </li>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "insomnia",
                      }));
                      diseasePosts("insomnia");
                      articleFilterClick(e, "insomnia");
                    }}
                  >
                    Insomnia
                  </button>
                </li>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "Hypertension",
                      }));
                      diseasePosts("Hypertension");
                      articleFilterClick(e, "Hypertension");
                    }}
                  >
                    Hypertension
                  </button>
                </li>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "Skin Care",
                      }));
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
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "migraine",
                      }));
                      diseasePosts("migraine");
                      articleFilterClick(e, "migraine");
                    }}
                  >
                    Migraine
                  </button>
                </li>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "Psoriasis",
                      }));
                      diseasePosts("Psoriasis");
                      articleFilterClick(e, "Psoriasis");
                    }}
                  >
                    Psoriasis
                  </button>
                </li>
                <li role="presentation" className="my-1">
                  <button
                    className="btn mr-2"
                    onClick={(e) => {
                      setState((prev) => ({
                        ...prev,
                        articleFilter: "Healthy Living",
                      }));
                      diseasePosts("Healthy Living");
                      articleFilterClick(e, "Healthy Living");
                    }}
                  >
                    Healthy Living
                  </button>
                </li>
              </ul>
            </div>
          )}

          {items.length === 0 &&
          !state.isLoaded &&
          (state.articleFilter !== "recent" || props.match.params.type) ? (
            <div className="my-5 py-4 h5 container text-center">
              We do not have any cures for this condition yet but our editorial
              team is working on it. In the meantime, if you have a cure, Please{" "}
              <Link to="/article">Click Here</Link> to add the cure to our site.
            </div>
          ) : null}

          <div className="row mt-4" id="posts-container">
            {items.map((i) =>
              i.pubstatus_id === 3 ? (
                <AllPost
                  docID={i.docID}
                  id={i.article_id}
                  title={i.title}
                  f_title={i.friendly_name}
                  w_title={i.window_title}
                  country={i.country_id}
                  content={decodeURIComponent(i.content)}
                  type={i.type}
                  imgLocation={i.content_location}
                  published_date={i.published_date}
                  key={i.article_id}
                  over_allrating={i.over_allrating}
                  authorName={i.authors_name}
                  allPostsContent={() => allPosts()}
                />
              ) : null
            )}
          </div>
        </div>
        {LoadMore &&
        (state.articleFilter === "recent" ||
          state.articleFilter === "earliest") ? (
          <div className="loader my-4">
            <img
              src={Heart}
              alt="Loading more articles - All Cures Logo"
              id="heart"
            />
          </div>
        ) : null}
        {state.noMoreArticles &&
        (state.articleFilter === "recent" ||
          state.articleFilter === "earliest") ? (
          <div className="container h4 text-center mb-5 pb-2">
            You have reached end of page. Thanks!
          </div>
        ) : null}
        <Footer />
      </ErrorBoundary>
    );
  } else if (regionPostsLoaded) {
    return (
      <>
        <Header history={props.history} />
        <div className="container my-4">
          {state.param.type ? (
            <h1 className="h2 text-center">
              Cures related to "{state.param.type}"
            </h1>
          ) : (
            <h1 className="h2 text-center">All Cures</h1>
          )}
          <div className="row" id="posts-container">
            {items.map((i) =>
              parseInt(i.country_id) === parseInt(state.country) ? (
                <AllPost id={i.article_id} title={i.title} key={i.article_id} />
              ) : null
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }
};

export default Blogpage;
