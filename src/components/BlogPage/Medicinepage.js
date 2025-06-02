import React, { Component } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AllPost from "./Allpost.js";
import { backendHost } from "../../api-config";
import { Link } from "react-router-dom";
import Heart from "../../assets/img/heart.png";
import Subscribe from "../Subscribe";

export default class Medicinepage extends Component {
  constructor(props) {
    super(props);
    const params = props.match.params;

    this.state = {
      limit: 15,
      offset: 0,
      dc: props.location.search.split("&")[1],
      noMoreArticles: false,
      param: params,
      items: [],
      isLoaded: false,
      LoadMore: false,
      regionPostsLoaded: false,
      country: new URLSearchParams(this.props.location.search).get("c"),
      diseaseCondition: new URLSearchParams(this.props.location.search).get(
        "dc"
      ),
      articleFilter: "recent",
    };
  }

  // Helper function to extract medicine type ID from URL parameter like "1-ayurveda"
  extractMedicineTypeId(medicineTypeParam) {
    if (!medicineTypeParam) return null;
    // If it contains a hyphen, extract the number before the first hyphen
    if (medicineTypeParam.includes("-")) {
      return medicineTypeParam.split("-")[0];
    }
    // If it's just a number (backward compatibility)
    return medicineTypeParam;
  }

  // Helper function to extract title from URL parameter like "1-ayurveda"
  extractMedicineTypeTitle(medicineTypeParam) {
    if (!medicineTypeParam) return null;
    // If it contains a hyphen, extract and format the title part
    if (medicineTypeParam.includes("-")) {
      const titlePart = medicineTypeParam.split("-").slice(1).join("-");
      // Convert kebab-case to Title Case
      return titlePart
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    // If it's just a number, return null (no title available)
    return null;
  }

  allPosts(loadMore) {
    // For all available blogs "/blogs"
    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });
    if (loadMore === "loadMore") {
      this.setState({ LoadMore: false });
    }
    if (this.state.noMoreArticles) {
      return;
    } else {
      fetch(
        `${backendHost}/article/allkv?limit=${this.state.limit}&offset=${this.state.offset}`,
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
            this.setState({ noMoreArticles: true });
            return null;
          }
          var temp = [];
          if (this.state.articleFilter === "recent") {
            json.forEach((i) => {
              if (i.pubstatus_id === 3) {
                temp.push(i);
              }
            });
            this.setState({
              isLoaded: true,
              items: [...this.state.items, ...temp],
            });
          } else if (this.state.articleFilter === "earliest") {
            json.forEach((i) => {
              if (i.pubstatus_id === 3) {
                temp.push(i);
              }
            });
            this.setState({ isLoaded: true, items: temp.reverse() });
          }
          this.setState({ LoadMore: true });
        })
        .catch((err) => {
          return;
        });
    }
  }
  medicinePosts(medicine_type) {
    // For specific blogs like "/blogs/diabetes"
    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });

    fetch(`${backendHost}/isearch/medicinetype/${medicine_type}`, {
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
        this.setState({
          isLoaded: true,
          items: json,
        });
      })
      .catch((err) => {
        return;
      });
    // }
  }
  componentDidMount() {
    // if(this.props.match.params.type === undefined){
    //   this.allPosts()
    // }
    if (this.props.match.params.medicineType !== undefined) {
      const medicineTypeId = this.extractMedicineTypeId(
        this.props.match.params.medicineType
      );
      this.medicinePosts(medicineTypeId);
    } else if (this.props.location.search) {
      this.regionalPosts();
    } else {
      this.allPosts();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.match.params.medicineType !==
      this.props.match.params.medicineType
    ) {
      if (this.props.match.params.medicineType) {
        const medicineTypeId = this.extractMedicineTypeId(
          this.props.match.params.medicineType
        );
        this.medicinePosts(medicineTypeId);
      } else {
        this.allPosts();
      }
    }
  }
  regionalPosts() {
    fetch(
      `${backendHost}/isearch/treatmentregions/${this.state.dc.split("=")[1]}`
    ) // /isearch/treatmentregions/${this.state.diseaseCondition}
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          regionPostsLoaded: true,
          items: json.reverse(),
        });
      })
      .catch((err) => {
        return;
      });
  }
  render() {
    var { isLoaded, items, regionPostsLoaded, LoadMore } = this.state;

    return (
      <>
        <Header history={this.props.history} />

        <div className="container my-4">
         
          {this.state.param.medicineType ? (
            <>
              <h1 className="h2 text-center">
                Cures related to "
                {this.extractMedicineTypeTitle(this.state.param.medicineType) ||
                  this.extractMedicineTypeId(this.state.param.medicineType)}
                "
              </h1>
              <h2
                className="h5 text-center text-muted"
                style={{ fontSize: "clamp(0.875rem, 3vw, 1.25rem)" }}
              >
                Explore Proven Natural Remedies from Trusted Healing Systems
              </h2>
            </>
          ) : (
            <h1 className="h2 text-center">All Cures</h1>
          )}
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
                 {this.extractMedicineTypeTitle(this.state.param.medicineType) ||
                  this.extractMedicineTypeId(this.state.param.medicineType)}
              </li>
            </ol>
          </nav>
          <div className="row mt-4" id="posts-container" >
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
                allPostsContent={() => this.allPosts()}
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
  }
}
