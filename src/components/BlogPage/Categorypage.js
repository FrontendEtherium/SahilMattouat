import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AllPost from "./Allpost.js";
import { backendHost } from "../../api-config";
import { Link, useLocation, useHistory } from "react-router-dom";
import Heart from "../../assets/img/heart.png";
import Subscribe from "../Subscribe";
import headers from "../../api-fetch.js";

const Categorypage = (props) => {
  const location = useLocation();
  const history = useHistory();
  const params = props.match.params;
  const [limit] = useState(15);
  const [offset, setOffset] = useState(0);
  const [dc] = useState(location.search.split("&")[1]);
  const [noMoreArticles, setNoMoreArticles] = useState(false);
  const [param] = useState(params);
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [LoadMore, setLoadMore] = useState(false);
  const [regionPostsLoaded, setRegionPostsLoaded] = useState(false);
  const [country] = useState(new URLSearchParams(location.search).get("c"));
  const [diseaseCondition] = useState(
    new URLSearchParams(location.search).get("dc")
  );
  const [articleFilter] = useState("recent");

  const extractDiseaseId = (diseaseParam) => {
    if (!diseaseParam) return undefined;
    // Extract the ID from the format "74-diabetes" or "diabetes-74"
    const match = diseaseParam.match(/^(\d+)-/);
    return match ? match[1] : diseaseParam;
  };

  const allPosts = (loadMore) => {
    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });

    if (loadMore === "loadMore") {
      setLoadMore(false);
    }

    if (noMoreArticles) {
      return;
    }

    fetch(`${backendHost}/article/allkv?limit=${limit}&offset=${offset}`, {
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
        if (json.length === 0) {
          setNoMoreArticles(true);
          return null;
        }
        var temp = [];
        if (articleFilter === "recent") {
          json.forEach((i) => {
            if (i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems((prevItems) => [...prevItems, ...temp]);
        } else if (articleFilter === "earliest") {
          json.forEach((i) => {
            if (i.pubstatus_id === 3) {
              temp.push(i);
            }
          });
          setItems(temp.reverse());
        }
        setIsLoaded(true);
        setLoadMore(true);
      })
      .catch((err) => {
        return;
      });
  };

  const categoryPosts = (disease_condition_id) => {
    fetch(`${backendHost}/isearch/diseases/${disease_condition_id}`, {
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
        setItems(json);
        setIsLoaded(true);
      })
      .catch((err) => {
        return;
      });
  };

  const regionalPosts = () => {
    fetch(`${backendHost}/isearch/treatmentregions/${dc.split("=")[1]}`)
      .then((res) => res.json())
      .then((json) => {
        setRegionPostsLoaded(true);
        setItems(json.reverse());
      })
      .catch((err) => {
        return;
      });
  };

  useEffect(() => {
    const diseaseId = extractDiseaseId(props.match.params.disease_condition_id);
    if (diseaseId !== undefined) {
      categoryPosts(diseaseId);
    } else if (location.search) {
      regionalPosts();
    } else {
      allPosts();
    }
  }, []);

  useEffect(() => {
    const diseaseId = extractDiseaseId(props.match.params.disease_condition_id);
    if (diseaseId !== undefined) {
      categoryPosts(diseaseId);
    } else {
      allPosts();
    }
  }, [props.match.params.disease_condition_id]);

  const getDiseaseName = () => {
    if (props.match.params.disease_condition_id) {
      // Extract the name part from the URL (everything after the ID and hyphen)
      const parts = props.match.params.disease_condition_id.split("-");
      if (parts.length > 1) {
        // Remove the ID part and join the rest
        return parts
          .slice(1)
          .join("-")
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      return parts[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return "All Cures";
  };

  return (
    <>
      <Header />
      <div className="container my-4">
        {/* Breadcrumb */}

        {/* Headings */}
        <h1
          className="h3 text-center font-weight-bold"
          style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
        >
          Cures related to "{getDiseaseName()}"
        </h1>
        <h2
          className="h5 text-center text-muted"
          style={{ fontSize: "clamp(0.875rem, 3vw, 1.25rem)" }}
        >
          Explore Proven Natural Remedies from Trusted Healing Systems
        </h2>
        <nav aria-label="breadcrumb mb-4">
          <ol
            className="breadcrumb"
            style={{ display: "flex", alignItems: "center" }}
          >
            <li
              className="breadcrumb-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className="breadcrumb-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Link to="/allcures">Cures</Link>
            </li>
            <li
              className="breadcrumb-item active"
              style={{ display: "flex", alignItems: "center" }}
              aria-current="page"
            >
              {getDiseaseName()}
            </li>
          </ol>
        </nav>
        <div className="row mt-4" id="posts-container">
          {items.map((i) => (
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
          ))}
        </div>
      </div>
      {/* <div>
        <button
          id="mobile-subscribe-fixed-btn"
          className="btn newsletter-icon rounded subscribe-btn newsletter_float"
          data-toggle="modal"
          data-target=".bd-example-modal-lg"
        >
          Subscribe
        </button>
        <Link to="/feedback">
          <button
            id="mobile-feedback-fixed-btn"
            className="btn newsletter-icon rounded subscribe-btn newsletter_float"
          >
            Feedback
          </button>
        </Link>
        <Subscribe />
      </div> */}
      <Footer />
    </>
  );
};

export default Categorypage;
