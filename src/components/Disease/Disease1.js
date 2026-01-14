/* eslint-disable no-dupe-class-members */
import React, { Component, createRef } from "react";
import { Suspense, lazy } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Select, MenuItem } from "@material-ui/core";

import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import CenterWell from "./CenterWell";
import Sidebar from "./leftMenu";
import SidebarRight from "./RightMenu";

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { backendHost } from "../../api-config";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import Input from "@material-ui/core/Input";
import ArticleComment from "../ArticleComment";
import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";
import ArticleRating from "../ArticleRating";
import Favourite from "../favourite";
import Favourites from "../UpdateFavourite";

import HelmetMetaData from "../HelmetMetaData";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import AyurvedaAd from "../../assets/healthcare/img/images/Banner-ads/97x90 Plain.jpg";
import PersianAd from "../../assets/healthcare/img/images/Banner-ads/Persian.jpg";
import CarouselPreview from "./CarouselPreview";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { PreviewTab } from "./PreviewTab";
import Heart from "../../assets/img/heart.png";
import { userId } from "../UserId";
import { userAccess } from "../UserAccess";
import Date from "../Date";
import { imagePath, imgKitImagePath } from "../../image-path";
import { faKeybase } from "@fortawesome/free-brands-svg-icons";
import headers from "../../api-fetch";

import axiosInstance from "../../axiosInstance";

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

// const CenterWelll = lazy(() => import('./CenterWell'));
const SidebarRightt = lazy(() => import("./RightMenu"));

const LazySideBarRight = (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <SidebarRightt {...props} />
  </Suspense>
);

class Disease extends Component {
  constructor(props) {
    super(props);
    this.childDiv = React.createRef();
    this.adSpacRef = React.createRef();

    this.containerRef = createRef();
    this.handleScroll = this.handleScroll.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);

    this.state = {
      images: [],
      currentIndexx: 0,
      items: [],
      carouselItems: [],
      comment: [],
      isLoaded: false,
      ratingValue: "",
      rating: [],
      ratingVal: [],
      param: this.props.match.params,
      disease: "",
      regions: "",
      regionPostsLoaded: false,
      regionalPost: [],
      showMore: false,
      value: "",
      type: [],
      favourite: [],
      diseaseList: [],
      cures: [],
      showAlert: false,
      alertMsg: "",
      showCuresCards: false,
      modalState: false,
      url: window.location.href,
      ads: "",
      isWindowLoaded: false,
      adId: "",
      likeClicked: null,
      dislikeClicked: null,
      showSource: false,
      alertShown: false,
      isModalOpen: false,
      currentIndex: 0, // State variable for the current index
    };
    this.handleShows = this.handleShows.bind(this);
  }

  handleShow() {
    // this.setState({ modalState: !this.state.modalState })
    if (this.state.url.includes("?whatsapp")) {
      return this.setState({
        modelState: false,
      });
    } else {
      return setTimeout(() => {
        this.setState(
          {
            modalState: true,
          },
          () => {
            this.floaterShow();
          }
        );
      }, 4000);
    }
  }

  showModal() {
    // get value from localStorage
    var is_modalState = sessionStorage.getItem("alrState");
    if (is_modalState != "alredy shown") {
      "#myModal".show();
      sessionStorage.setItem("alreadyShow", "alredy shown");
    } else {
      console.log(is_modalState);
    }
  }

  handleShows() {
    this.setState({ modalState: !this.state.modalState });
    this.handleModalClose();
  }

  showModal() {
    this.setState({ modalState: !this.state.modalState });
  }

  likeButton = () => {
    // console.log("like clicked")
    this.setState({
      likeClicked: true,
      dislikeClicked: false,
    });
    axios.post(
      `${backendHost}/article/like/${this.props.match.params.id.split("-")[0]}`
    );
  };

  dislikeButton = () => {
    // console.log("dislike clicked")
    this.setState({
      dislikeClicked: true,
      likeClicked: false,
    });
    axios.post(
      `${backendHost}/article/dislike/${
        this.props.match.params.id.split("-")[0]
      }`
    );
  };

  handleSource = () => {
    console.log("clicked source");

    this.setState((prevState) => ({
      showSource: !prevState.showSource,
    }));
  };

  fetchBlog = async () => {
    var id = this.props.match.params.id.split("-")[0];
    if (/^[0-9]+$/.test(id)) {
      // Test if URL contains article_id or TITLE

      Promise.all([
        fetch(`${backendHost}/article/${id}`, {
          method: "GET",
          headers: headers,
        }) // if URL contains article_id
          .then((res) => res.json()),
        // fetch(`${backendHost}/sponsored/parent_disease_id/${this.props.match.params.id.split('-')[0]}`)
        //   .then((res) => res.json()),
      ]).then(([json, json_new]) => {
        // console.log(json)

        this.setState(
          {
            isLoaded: true,
            items: json,
          },
          () => {
            this.regionalPosts(json.disease_condition_id);
            this.diseasePosts(json.dc_name);
            this.getDisease();

            this.fetchCountriesCures();
            this.comments(this.props.match.params.id.split("-")[0]);
            this.getRating(this.props.match.params.id.split("-")[0]);
            this.getRate(this.props.match.params.id.split("-")[0]);
            if (userAccess) {
              this.getFavourite(this.props.match.params.id.split("-")[0]);
            }
            this.fetchParentDiseaseId(this.props.match.params.id.split("-")[0]);
            this.loadFloater();

            // document.title = `${this.state.items.title}`;
            const newTitle = `${json.title}`;
            document.title = newTitle;
            console.log("Document Title:", newTitle);
          }
        );

        // console.log('id', this.props.match.params.id.split('-')[0]);

        // console.log('parent_dc_id:', json_new.parent_dc_id);
        // if (json_new.parent_dc_id !== 0) {
        //   console.log('delayed not null');
        //   this.fetchData(json_new.parent_dc_id);
        // }
      });
    } else {
      // if URL contains title

      Promise.all([
        fetch(`${backendHost}/article/title/${id}`, {
          method: "GET",
          headers: headers,
        }) // if URL contains article_id
          .then((res) => res.json()),
        // fetch(`${backendHost}/sponsored/parent_disease_id/${this.props.match.params.id.split('-')[0]}`)
        //   .then((res) => res.json()),
      ]).then(([json, json_new]) => {
        this.setState(
          {
            isLoaded: true,
            items: json,
          },
          () => {
            this.regionalPosts(json.disease_condition_id);
            this.diseasePosts(json.dc_name);
            this.getDisease();

            this.fetchCountriesCures();
            this.comments(this.props.match.params.id.split("-")[0]);
            this.getRating(this.props.match.params.id.split("-")[0]);
            this.getRate(this.props.match.params.id.split("-")[0]);
            if (userAccess) {
              this.getFavourite(this.props.match.params.id.split("-")[0]);
            }

            this.fetchParentDiseaseId(this.props.match.params.id.split("-")[0]);
            this.loadFloater();

            // document.title = `${this.state.items.title}`;
            const newTitle = `${json.title}`;
            document.title = newTitle;
            console.log("Document Title:", newTitle);
          }
        );

        console.log("id", this.props.match.params.id.split("-")[0]);
        // console.log('parent_dc_id:', json_new.parent_dc_id);
        // if (json_new.parent_dc_id !== 0) {
        //   console.log('delayed not null');
        //   this.fetchData(json_new.parent_dc_id);
        // }
      });
    }
  };

  floaterInterval = null;
  floaterShow = () => {
    this.floaterInterval = setInterval(this.rotateImages, 3000);
  };

  handleModalClose = () => {
    if (this.floaterInterval) {
      clearInterval(this.floaterInterval);
    }
  };

  rotateImages = () => {
    this.setState((prevState) => ({
      currentIndexx: (prevState.currentIndexx + 1) % this.state.images.length,
    }));
  };

  Alert = (msg) => {
    this.setState({
      showAlert: true,
      alertMsg: msg,
    });
    setTimeout(() => {
      this.setState({
        showAlert: false,
      });
    }, 5000);
  };
  pageLoading = async () => {
    var id = this.props.match.params.id.split("-")[0];
    if (this.state.url.includes("?whatsapp")) {
      await axios.post(
        `${backendHost}/article/${id}/${userId ? userId : 0}/jsession/whatsapp`
      );
    } else {
      await axios.post(
        `${backendHost}/article/${id}/${userId ? userId : 0}/jsession//NA`
      );
    }
  };
  componentDidMount() {
    const pageLoad = async () => {
      var id = this.props.match.params.id.split("-")[0];
      await axios
        .post(`${backendHost}/${id}/${userId}`)
        .then((res) => {
          // console.log(res.data)
          this.setState({
            afterSubmitLoad: false,
          });
        })
        .catch((err) => {});
    };

    pageLoad();
    this.pageLoading();
  }

  fetchData = async (parent_dc_id) => {
    // console.log('DC_Cond:', parent_dc_id);
    // Check if parent_dc_id is passed correctly
    try {
      // Send parent_dc_id as a request parameter
      const response = await axios.get(
        `${backendHost}/sponsored/list/ads/url/2`,
        {
          params: {
            DC_Cond: parent_dc_id,
          },
        }
      );
      // console.log("API call successful");

      // Check the response data
      // console.log("Response data:", response.data);

      if (response.data != "All Ads are Served") {
        const id = response.data.split("/")[3];
        const ids = id.match(/\d+/);
        const adsId = ids[0];

        // console.log(adsId)
        //    console.log(id)

        this.setState({
          adId: adsId,
        });
      }
      const newResponse = `https://all-cures.com:444${response.data}`;

      // Check if state is being updated correctly
      // console.log("New Response:", newResponse);

      this.setState({
        ads: newResponse,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  postSubscribtion() {
    //  var mobileNumber = this.state.mobile.split('+')
    var phoneNumber = this.state.value.split("+")[1];
    var countryCodeLength = phoneNumber.length % 10;
    var countryCode = phoneNumber.slice(0, countryCodeLength);
    var StringValue = phoneNumber.slice(countryCodeLength).replace(/,/g, "");
    if (phoneNumber) {
      this.setState({
        afterSubmitLoad: true,
      });
      axios
        .post(`${backendHost}/users/subscribe/${StringValue}`, {
          nl_subscription_disease_id: this.state.disease.join(","),
          nl_sub_type: this.state.type.indexOf("1") === -1 ? 0 : 1,
          nl_subscription_cures_id: this.state.cures.join(","),
          country_code: countryCode,
        })
        .then((res) => {
          this.setState({
            afterSubmitLoad: false,
          });
          if (res.data === 1) {
            this.Alert("You have successfully subscribed to our Newsletter");
          } else {
            this.Alert("Some error occured! Please try again later.");
          }
        })
        .catch((err) => {
          this.setState({
            afterSubmitLoad: false,
          });
          this.Alert("Some error occured! Please try again later.");
        });
    } else {
      this.Alert("Please enter a valid number!");
    }
  }

  postSubscribtions() {
    var phoneNumber = this.state.value.split("+")[1];
    var countryCodeLength = phoneNumber.length % 10;
    var countryCode = phoneNumber.slice(0, countryCodeLength);
    var StringValue = phoneNumber.slice(countryCodeLength).replace(/,/g, "");
    if (phoneNumber) {
      this.setState({
        afterSubmitLoad: true,
      });
      axios
        .post(`${backendHost}/users/subscribe/${StringValue}`, {
          nl_subscription_disease_id: this.state.disease.join(","),
          nl_sub_type: 1,
          nl_subscription_cures_id: this.state.cures.join(","),
          country_code: countryCode,
        })
        .then((res) => {
          this.setState({
            afterSubmitLoad: false,
          });
          if (res.data === 1) {
            this.Alert("You have successfully subscribed to our Newsletter");
          } else {
            this.Alert("Some error occured! Please try again later.");
          }
        })
        .catch((err) => {
          this.setState({
            afterSubmitLoad: false,
          });
          this.Alert("Some error occured! Please try again later.");
        });
    } else {
      this.Alert("Please enter a valid number!");
    }
  }

  fetchCountriesCures = () => {
    fetch(
      `${backendHost}/isearch/treatmentregions/${this.state.items.disease_condition_id}`
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          regions: json,
        });
      })
      .catch((err) => null);
  };

  getRating = (ratingId) => {
    axios
      .get(`${backendHost}/rating/target/${ratingId}/targettype/2/avg`)
      .then((res) => {
        this.setState({
          ratingValue: res.data,
        });
      })
      .catch((err) => null);
  };

  getRate = (articleId) => {
    axios
      .get(
        `${backendHost}/rating/target/${articleId}/targettype/2?userid=${
          userId ? userId : 0
        }`
      )
      .then((res) => {
        this.setState({
          rating: res.data[0].ratingVal,
        });
      })
      .catch((err) => null);
  };

  getFavourite = (articleid) => {
    axios
      .get(
        `${backendHost}/favourite/userid/${userId}/articleid/${articleid}/favourite`
      )
      .then((res) => {
        this.setState({
          favourite: res.data[0].status,
        });
      })
      .catch((err) => null);
  };
  regionalPosts(id) {
    fetch(`${backendHost}/isearch/treatmentregions/${id}`) // /isearch/treatmentregions/${this.state.diseaseCondition}
      .then((res) => res.json())
      .then((json) => {
        // console.log('regional posts')
        this.setState({
          regionPostsLoaded: true,
          regionalPost: json,
        });
      })
      .catch((err) => null);
  }
  comments(article_id) {
    // For all available blogs "/blogs"
    fetch(`${backendHost}/rating/target/${article_id}/targettype/2`)
      .then((res) => res.json())
      .then((json) => {
        var temp = [];
        json.forEach((i) => {
          if (i.reviewed === 1 && i.comments !== "null") {
            temp.push(i);
          }
        });
        this.setState({
          comment: temp,
        });
      })
      .catch((err) => null);
  }

  showRating = (val) => {
    if (document.getElementById("avg-rating")) {
      for (let i = 0; i < val; i++) {
        document
          .getElementById("avg-rating")
          .children[i].classList.add("checked");
      }
    }
  };

  toggleShowCuresCards = (val) => {
    this.setState({ showCuresCards: val });
  };

  showComments = (item, i) => {
    return (
      <>
        <div className="col-12">
          <div className="card my-4 ">
            <div className="card-body d-flex">
              <div className="comment-img">
                <i className="fas fa-user-md fa-4x pl-3 mb-2"></i>
                <h6 className="card-subtitle my-2 text-muted">
                  {item.first_name} {item.last_name}
                </h6>
              </div>
              <div>
                <h5 className="h5 mt-3"> {item.comments}</h5>
                <div className="card-info"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  handleSelect = function (subs) {
    const flavors = [];
    for (let i = 0; i < subs.length; i++) {
      flavors.push(subs[i].value);
    }
    this.setState({
      type: flavors,
    });
  };

  handleClick = (ad) => {
    // console.log('Image clicked!',ad);
    axios.put(`${backendHost}/sponsored/ads/clicks/${ad}`);
  };
  getDisease = () => {
    axiosInstance
      .get(`/article/all/table/disease_condition`)
      .then((res) => {
        // console.log('getdisease')
        this.setState({
          diseaseList: res.data,
        });
      })
      .catch((err) => null);
  };

  fetchParentDiseaseId(id) {
    return fetch(`${backendHost}/sponsored/parent_disease_id/${id}`)
      .then((res) => res.json())
      .then((json) => {
        // console.log('recieved',id)
        //  console.log(json.parent_dc_id)

        // console.log('parent_dc_id:', json.parent_dc_id);

        if (json.parent_dc_id != 0) {
          // console.log('delayd not null')

          this.fetchData(json.parent_dc_id);

          this.setState({
            isAdsLoaded: true,
          });
        }
      })
      .catch((err) => null);
  }

  diseasePosts(dcName) {
    return fetch(`${backendHost}/isearch/${dcName}`)
      .then((res) => res.json())
      .then((json) => {
        // console.log('disease posts')

        var temp = [];
        json.forEach((i) => {
          if (i.pubstatus_id === 3) {
            temp.push(i);
          }
        });
        this.setState({
          carouselItems: temp,
        });

        const currentArticleId = this.props.match.params.id.split("-")[0];

        // Filter carouselItems to exclude the current article
        const filteredCarouselItems = this.state.carouselItems.filter(
          (item) => item.article_id !== currentArticleId
        );

        // Check if the initial currentIndex needs to be adjusted
        if (
          this.state.carouselItems.length > 0 &&
          this.state.carouselItems[0].article_id == currentArticleId
        ) {
          this.setState({
            carouselItems: filteredCarouselItems,
            currentIndex: 1 % filteredCarouselItems.length, // Move to the next index if the first item matches
          });
        } else {
          this.setState({
            carouselItems: filteredCarouselItems,
          });
        }
      })
      .catch((err) => null);
  }

  componentDidMount() {
    // window.scrollTo(0, 0);
    setTimeout(() => {
      if (this.adSpacRef.current) {
        this.adSpacRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
    const isMobileView = window.innerWidth <= 768;
    window.scrollTo({
      top: isMobileView ? 650 : 0, // Adjust the values as needed
      behavior: "smooth",
    });

    window.addEventListener("scroll", this.handleScroll);

    this.fetchBlog();
    this.handleShow();
    this.getDisease();
    this.pageLoading();

    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";

    const currentURL = window.location.href.toLowerCase();

    const canonicalURL = currentURL.replace(/(https?:\/\/)?www\./, "$1");

    if (canonicalURL.match(/\/cure\/\d+/)) {
      const id = this.props.match.params.id.split("-")[0];

      fetch(`${backendHost}/article/${id}`, {
        method: "GET",
        headers: headers,
      })
        .then((res) => res.json())
        .then((json) => {
          const title = json.title;
          canonicalLink.href = `${
            window.location.origin
          }/cure/${id}-${title.replace(/\s+/g, "-")}`;
          document.head.appendChild(canonicalLink);
          console.log("Canonical Link:", canonicalLink.outerHTML);
        })
        .catch((err) => {
          canonicalLink.href = canonicalURL;
          document.head.appendChild(canonicalLink);
          console.log("Canonical Link:", canonicalLink.outerHTML);
        });
    } else {
      canonicalLink.href = canonicalURL;
      document.head.appendChild(canonicalLink);
      console.log("Canonical Link:", canonicalLink.outerHTML);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const container = this.containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight && !this.state.alertShown) {
        this.setState((prevState) => ({
          alertShown: true,
          isModalOpen: true,
        }));
        // alert("You've reached the end of the div!");
      } else if (scrollTop + clientHeight < scrollHeight) {
        this.setState({ alertShown: false });
      }
    }
  }

  // handleLinkClick = (e, url) => {
  //   e.preventDefault();
  //   window.scrollTo(0, 0);
  //   setTimeout(() => {
  //     window.location.href = url;
  //   }, 0);
  // }

  handleLinkClick = (e, url) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    axios.post(
      `${backendHost}/analytics/clicks?articleID=${
        this.props.match.params.id.split("-")[0]
      }`
    );
    this.setState(
      (prevState) => ({
        isModalOpen: false,
        currentIndex:
          (prevState.currentIndex + 1) % this.state.carouselItems.length, // Update the index
      }),
      () => {
        setTimeout(() => {
          this.props.history.push(url);
        }, 0);
        const container = this.containerRef.current;
        if (container) {
          container.scrollTop = 0;
        }
      }
    );
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchBlog();

      window.scrollTo(0, 340);
      this.setState({
        likeClicked: null,
        dislikeClicked: null,
        showSource: null,
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      disease: e.target.value,
    });
  };

  IsJsonValid(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return [];
    }
    return JSON.parse(str).blocks;
  }

  render() {
    var { isLoaded, items, carouselItems, text } = this.state;

    if (!isLoaded) {
      return (
        <>
          <Header history={this.props.history} />
          <Container className="my-5 loading">
            <div className="loader">
              <img src={Heart} alt="All Cures Logo" id="heart" />
            </div>
          </Container>
          <Footer />
        </>
      );
    } else if (isLoaded) {
      // FInding distinct regions from fetchCountriesData()
      const finalRegions = [];
      console.log("regions", this.state.regions);

      const map = new Map();
      for (const item of this.state.regions) {
        if (!map.has(item.countryname)) {
          map.set(item.countryname, true); // set any value to Map
          finalRegions.push({
            countryname: item.countryname,
          });
        }
      }

      var artContent = items.content;
      var a = JSON.parse(decodeURIComponent(artContent));
      var b = a.blocks;
      console.log("img", b);

      return (
        <div>
          <div>
            {this.state.afterSubmitLoad && (
              <div className="loader main on-submit-loading">
                <img src={Heart} alt="All Cures Logo" id="heart" />
              </div>
            )}
            {this.state.showAlert && (
              <div className="alert alert-success pop-up border-bottom">
                <div className="h5 mb-0 text-center">{this.state.alertMsg}</div>
                <div className="timer"></div>
              </div>
            )}
          </div>
          <Header history={this.props.history} />
          <HelmetMetaData
            title={items.title}
            description={b[0].data.text}
            keywords={items.keywords}
            image={
              `${imagePath}` +
              items.content_location
                .replace("json", "png")
                .split("/webapps/")[1]
            }
          ></HelmetMetaData>

          <div className="ad-spac" ref={this.adSpacRef}>
            <button
              className="btn"
              data-toggle="modal"
              data-target=".bd-example-modal-lg"
            >
              <img
                src={`${imgKitImagePath}/tr:w-900,f-webp/assets/img/97x90_Plain.jpg`}
                alt="advertisment"
              />
            </button>
          </div>

          <Row>
            <div className="left-menu pb-3">
              <div id="sidebar-wrapper">
                {this.state.regionalPost.length !== 0 && (
                  <Sidebar
                    diseaseId={items.disease_condition_id}
                    id={this.props.match.params.id}
                    regionalPosts={
                      this.state.regionPostsLoaded
                        ? this.state.regionalPost
                        : null
                    }
                    name={items.dc_name}
                  />
                )}
              </div>

              {/* 
                    <button className="btn pl-4 mt-2 " id="left-menu-ad" data-toggle="modal"data-target=".bd-example-modal-lg">
                                 <img className="pl-4" src={PersianAd} alt="ad"/>
                                 </button> */}

              {
                this.state.ads ? (
                  this.state.ads !==
                  "https://all-cures.com:444All Ads are Served" ? (
                    <div className="d-flex justify-content-center">
                      <img
                        className="mt-5"
                        id="left-menu-ad"
                        src={this.state.ads}
                        alt="adjjjj"
                        onClick={() => this.handleClick(this.state.adId)}
                      />
                    </div>
                  ) : (
                    <button
                      className="btn pl-4 mt-2 "
                      id="left-menu-ad"
                      data-toggle="modal"
                      data-target=".bd-example-modal-lg"
                    >
                      {/* <img className="pl-4" src={PersianAd} alt="adhhh"
                                 /> */}
                      <img
                        className="pl-4"
                        src={`${imgKitImagePath}/tr:w-180,f-webp/assets/img/Persian.jpg`}
                        alt="adhhh"
                      />
                    </button>
                  )
                ) : null

                // : <button className="btn pl-4 mt-2 " id="left-menu-ad" data-toggle="modal"data-target=".bd-example-modal-lg">
                //  <img className="pl-4" src={PersianAd} alt="adhhh"/>
                //  </button>
              }
            </div>

            <Col md={7} id="page-content-wrapper" className="col-xs-12 pb-5">
              <div id="center-well" ref={this.containerRef}>
                <Breadcrumb>
                  <Breadcrumb.Item className="mt-1 pb-2" href="/" id="s1">
                    Home
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className="mt-1" id="s1">
                    <Link to={`/searchcures/${items.dc_name}`}>
                      {items.dc_name}
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className="mt-1" id="s1">
                    {items.type.includes(1) &&
                    !this.props.match.params.cureType ? (
                      <Link to="#">Overview</Link>
                    ) : (
                      <Link to="#">Cures</Link>
                    )}
                  </Breadcrumb.Item>

                  {items.parent_Medicine_type != null && (
                    <Breadcrumb.Item className="mt-1 pb-2" id="s1">
                      {items.parent_Medicine_type}
                    </Breadcrumb.Item>
                  )}

                  <Breadcrumb.Item className="mt-1 pb-2" id="s1">
                    {items.medicine_type_name}
                  </Breadcrumb.Item>
                </Breadcrumb>

                <div
                  className="  px-2 py-2"
                  style={{ backgroundColor: "#e9ecef" }}
                >
                  <div id="" className="">
                    {/* Sharing icons */}

                    <div className="  share-buttons-region ml-2" id="filter">
                      <div
                        className="d-flex justify-content-end margin-auto"
                        id="article-acc-to-regions"
                      >
                        <div>
                          {finalRegions
                            ? finalRegions.map(
                                (i) =>
                                  i.countryname !== null && (
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
                                          boxShadow:
                                            "0 4px 6px rgba(0, 0, 0, 0.1)",
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
                                          style={{
                                            fontSize: "14px",
                                            color: "#fff",
                                          }}
                                        ></i>
                                        <span style={{ color: "#fff" }}>
                                          {i.countryname}
                                        </span>
                                        <i
                                          className="fas fa-chevron-down"
                                          style={{
                                            fontSize: "10px",
                                            color: "#fff",
                                          }}
                                        ></i>
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu
                                        className="countryDrop"
                                        style={{
                                          minWidth: "180px",
                                          padding: "6px",
                                          borderRadius: "8px",
                                          fontSize: "11px",
                                          boxShadow:
                                            "0 6px 12px rgba(0, 0, 0, 0.15)",
                                          background:
                                            "linear-gradient(145deg, #f0f0f0, #d9d9d9)",
                                          border: "none",
                                        }}
                                      >
                                        {this.state.regionalPost.map(
                                          (j) =>
                                            j.countryname === i.countryname && (
                                              <Dropdown.Item
                                                href="#"
                                                className="pt-2"
                                                key={j.article_id}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent:
                                                    "space-between",
                                                  padding: "10px",
                                                  borderRadius: "5px",
                                                  transition:
                                                    "background-color 0.3s",
                                                }}
                                              >
                                                <Link
                                                  to={`/cure/${j.article_id}`}
                                                  className="d-flex justify-content-between align-items-center mr-2 w-100"
                                                  style={{
                                                    textDecoration: "none",
                                                    color: "#00415e",
                                                    fontWeight: "500",
                                                  }}
                                                >
                                                  <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div className="card-title mr-5">
                                                      {j.title.substr(0, 27) +
                                                        "..."}
                                                    </div>
                                                    <div>
                                                      {j.type.includes(1) ? (
                                                        <div
                                                          className="chip overview"
                                                          style={{
                                                            backgroundColor:
                                                              "#00415e",
                                                            color: "white",
                                                            padding: "2px 8px",
                                                            borderRadius: "5px",
                                                            fontSize: "12px",
                                                          }}
                                                        >
                                                          Overview
                                                        </div>
                                                      ) : j.type.includes(2) ? (
                                                        <div
                                                          className="chip cure"
                                                          style={{
                                                            backgroundColor:
                                                              "#00415e",
                                                            color: "white",
                                                            padding: "2px 8px",
                                                            borderRadius: "5px",
                                                            fontSize: "12px",
                                                          }}
                                                        >
                                                          Cures
                                                        </div>
                                                      ) : j.type.includes(3) ? (
                                                        <div
                                                          className="chip symptoms"
                                                          style={{
                                                            backgroundColor:
                                                              "#6c757d",
                                                            color: "white",
                                                            padding: "2px 8px",
                                                            borderRadius: "5px",
                                                            fontSize: "12px",
                                                          }}
                                                        >
                                                          Symptoms
                                                        </div>
                                                      ) : null}
                                                    </div>
                                                  </div>
                                                </Link>
                                              </Dropdown.Item>
                                            )
                                        )}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  )
                              )
                            : null}
                        </div>
                      </div>
                    </div>

                    <div id="" className="">
                      <FacebookShareButton
                        url={encodeURI(
                          `https://all-cures.com${this.props.location.pathname}`
                        )}
                        quote={`All-Cures - ${items.title}`}
                        hashtag={`#allCures#${items.title}`}
                        className="socialMediaButton"
                      >
                        <FacebookIcon size={36} />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={encodeURI(
                          `https://all-cures.com${this.props.location.pathname}`
                        )}
                        title={`All-Cures - ${items.title}`}
                        hashtag={`#allCures#${items.title}`}
                        className="socialMediaButton"
                      >
                        <TwitterIcon size={36} />
                      </TwitterShareButton>
                      <WhatsappShareButton
                        url={encodeURI(
                          `https://all-cures.com${this.props.location.pathname}`
                        )}
                        title={`*All Cures -* ${items.title}`}
                        separator=": "
                        className="socialMediaButton"
                      >
                        <WhatsappIcon size={36} />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
                {this.props.match.params.cureType ? null : (
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
                            content = this.IsJsonValid(
                              decodeURIComponent(i.content)
                            );
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
                          var id = this.props.match.params.id.split("-")[0];
                          return i.article_id != id ? (
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
                )}
                <Row className="align-items-center justify-content-between mx-2">
                  <Col md={6}>
                    {userAccess ? (
                      <>
                        {this.state.rating.length === 0 ? (
                          <span className="text-muted medium">
                            You have not rated yet. Please rate.
                          </span>
                        ) : (
                          <p
                            className="small font-weight-bold"
                            style={{ color: "#00415e" }}
                          >
                            Your previous rating: {this.state.rating}{" "}
                            <span className="icon-star-1"></span>
                            <br />
                            Rate again below:
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-muted small">Rate here:</div>
                    )}
                    <div id="docRate" className="">
                      <ArticleRating
                        article_id={this.props.match.params.id.split("-")[0]}
                      />
                    </div>
                  </Col>

                  <Col
                    md={6}
                    className="d-flex align-items-center justify-content-end"
                  >
                    <span className="small text-muted">
                      Was this article helpful?
                    </span>
                    <button
                      className="btn btn-link p-1 mx-2"
                      onClick={this.likeButton}
                      aria-label="Like"
                    >
                      {this.state.likeClicked ? (
                        <ThumbUpIcon
                          style={{ fontSize: "20px", color: "#00415e" }}
                        />
                      ) : (
                        <ThumbUpOutlinedIcon
                          style={{ fontSize: "20px", color: "#6c757d" }}
                        />
                      )}
                    </button>
                    <button
                      className="btn btn-link p-1"
                      onClick={this.dislikeButton}
                      aria-label="Dislike"
                    >
                      {this.state.dislikeClicked ? (
                        <ThumbDownIcon
                          style={{ fontSize: "20px", color: "#00415e" }}
                        />
                      ) : (
                        <ThumbDownOutlinedIcon
                          style={{ fontSize: "20px", color: "#6c757d" }}
                        />
                      )}
                    </button>
                  </Col>
                </Row>

                {this.props.match.params.cureType ? (
                  <CarouselPreview type="cures" dcName={`${items.dc_name}`} />
                ) : (
                  <>
                    <div className="article-title-container">
                      <h1 className=" font-weight-bold text-decoration-underline">
                        {items.title}
                      </h1>

                      {this.state.ratingValue ? (
                        <div
                          className="average-rating mb-4 ml-3 mt-2"
                          id="avg-rating"
                        >
                          <span class="fa fa-star opacity-7"></span>
                          <span class="fa fa-star opacity-7"></span>
                          <span class="fa fa-star opacity-7"></span>
                          <span class="fa fa-star opacity-7"></span>
                          <span class="fa fa-star opacity-7"></span>
                        </div>
                      ) : null}

                      {/* Call average rating fetch function */}
                      {this.state.ratingValue
                        ? this.showRating(this.state.ratingValue)
                        : null}
                    </div>

                    {/* Center Well article main content */}
                    <div id="article-main-content">
                      {b.map((i, idx) => {
                        const fileUrl = i.data.file ? i.data.file.url : null;
                        const imageUrl = fileUrl
                          ? `https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-1000,f-webp/cures_articleimages/${fileUrl.replace(
                              /^.*[\\/]/,
                              ""
                            )}`
                          : null;

                        // console.log('Original URL:', fileUrl);
                        // console.log('Modified URL:', imageUrl);

                        return (
                          <CenterWell
                            key={idx}
                            pageTitle={items.title}
                            level={i.data.level}
                            content={i.data.content}
                            type={i.type}
                            text={i.data.text}
                            title={i.data.title}
                            message={i.data.message}
                            source={i.data.source}
                            embed={i.data.embed}
                            caption={i.data.caption}
                            alignment={i.data.alignment}
                            imageUrl={imageUrl}
                            link={i.data.link}
                            url={i.data.url}
                            item={i.data.items}
                            props={this.props}
                          />
                        );
                      })}

                      {this.state.carouselItems &&
                        this.state.carouselItems.length > 0 && (
                          <div className="">
                            <div className="">
                              <div className="d-flex justify-content-center mt-2 mb-2">
                                <div>
                                  <Link
                                    to={`/cure/${
                                      carouselItems[this.state.currentIndex]
                                        .article_id
                                    }-${
                                      carouselItems[this.state.currentIndex]
                                        .title
                                    }`}
                                    className="fs-08"
                                    onClick={(e) =>
                                      this.handleLinkClick(
                                        e,
                                        `/cure/${
                                          carouselItems[this.state.currentIndex]
                                            .article_id
                                        }-${
                                          carouselItems[this.state.currentIndex]
                                            .title
                                        }`
                                      )
                                    }
                                  >
                                    <div className="mb-2">
                                      <h4>
                                        Click here to read the next article.
                                      </h4>
                                    </div>
                                  </Link>

                                  {(() => {
                                    const imageLocation =
                                      carouselItems[this.state.currentIndex]
                                        .content_location;
                                    let imageLoc;
                                    if (
                                      imageLocation &&
                                      imageLocation.includes(
                                        "cures_articleimages"
                                      )
                                    ) {
                                      imageLoc =
                                        `https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,h-250,f-webp/` +
                                        imageLocation
                                          .replace("json", "png")
                                          .split("/webapps/")[1];
                                    } else {
                                      imageLoc =
                                        "https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/cures_articleimages//299/default.png";
                                    }
                                    return (
                                      <div className="d-flex justify-content-center">
                                        <div>
                                          <img
                                            src={imageLoc}
                                            alt="Article Image"
                                          />
                                          <p className="mt-2 fs-5">
                                            {
                                              carouselItems[
                                                this.state.currentIndex
                                              ].title
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* <div className="">
        <div className="">
   
      <div className="d-flex justify-content-center mt-2 mb-2">
        <div>

      
      <Link to={`/cure/${carouselItems[this.state.currentIndex].article_id}-${carouselItems[this.state.currentIndex].title}`} className='fs-08' 
      onClick={(e) => this.handleLinkClick(e, `/cure/${carouselItems[this.state.currentIndex].article_id}-${carouselItems[this.state.currentIndex].title}`)}>
      
      <div className="mb-2"><h4>Click here to read the next article.</h4></div>
      </Link>


      {
    (() => {
      const imageLocation = carouselItems[this.state.currentIndex].content_location;
      let imageLoc;
      if (imageLocation && imageLocation.includes('cures_articleimages')) {
        imageLoc = `https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/` + imageLocation.replace('json', 'png').split('/webapps/')[1];
      } else {
        imageLoc = 'https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/cures_articleimages//299/default.png';
      }
      return (
        <div className="d-flex justify-content-center">
          <div>
        <img src={imageLoc} alt="Article Image" />
        <p className="mt-2 fs-5">{carouselItems[this.state.currentIndex].title}</p>
           </div>
        
        </div>
      );
    })()
  }


      </div>
      </div>
      </div>

       </div> */}
                    </div>
                    <hr />
                    {/* Author */}
                    {items.authors_name ? (
                      <div className="h5 text-left ml-3 mb-2">
                        <span>Author: </span>{" "}
                        {items.authored_by.includes(7) ? (
                          items.authors_name
                        ) : (
                          <Link to={`/doctor/${items.reg_doc_pat_id}`}>
                            {" "}
                            {items.authors_name}
                          </Link>
                        )}
                      </div>
                    ) : null}
                    <div className="h6 text-muted text-left ml-3 mb-4">
                      <span>Published on: </span>
                      {items.published_date ? (
                        <Date dateString={items.published_date} />
                      ) : (
                        items.published_date
                      )}
                    </div>
                  </>
                )}

                {userAccess ? (
                  <div id="favbutton">
                    {this.state.favourite.length === 0 ? (
                      <Favourite
                        article_id={this.props.match.params.id.split("-")[0]}
                      />
                    ) : (
                      <Favourites
                        article_id={this.props.match.params.id.split("-")[0]}
                      />
                    )}
                  </div>
                ) : null}
              </div>

              <div className="ml-3 mt-3">
                <button
                  className="btn  btn-primary"
                  onClick={this.handleSource}
                >
                  Source
                </button>
              </div>

              <div>
                <h5 className=" ml-3 mt-3 ">
                  {" "}
                  {this.state.showSource && items.window_title}{" "}
                </h5>
              </div>

              {/* Review Button (Rating + Comment) */}
              {userAccess ? (
                <div className="ml-3 mb-3">
                  <ArticleComment
                    refreshComments={this.comments}
                    article_id={this.props.match.params.id.split("-")[0]}
                  />
                </div>
              ) : null}

              {/* <h5>Source :  <a href="https://all-cures.com/Editorial" style={{textTransform:"none"}}>https://all-cures.com/editorial/</a></h5> */}
              {/* <h5  className=" ml-3 ">Source: {items.window_title}</h5> */}

              <div id="comments-column">
                {/* SHOW ALL COMMENTS */}
                <div className="main-hero">
                  {!this.state.showMore
                    ? this.state.comment
                        .slice(0, 1)
                        .map((item, i) => this.showComments(item, i))
                    : this.state.comment.map((item, i) =>
                        this.showComments(item, i)
                      )}
                </div>
                {this.state.comment
                  ? this.state.comment.length > 1 && (
                      <button
                        id="show-hide-comments"
                        className="white-button-shadow btn w-75 mb-4 ml-3"
                        onClick={() => {
                          this.state.showMore
                            ? this.setState({
                                showMore: false,
                              })
                            : this.setState({
                                showMore: true,
                              });
                        }}
                      >
                        {!this.state.showMore ? "Show more" : "Hide"}
                      </button>
                    )
                  : null}
              </div>
            </Col>
            <Col id="right-sidebar-wrapper">
              <SidebarRight
                title={items.title}
                history={this.props.history}
                dcName={items.dc_name}
                id={items.article_id}
              />
            </Col>
          </Row>
          <div>
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
          </div>
          <div
            className="modal fade bd-example-modal-lg"
            id="diseaseModal"
            role="dialog"
            aria-labelledby="myLargeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg" id="diseaseModal">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <section className="appStore">
                  <div className="container">
                    <div className="row">
                      <div
                        className="appStoreBg clearfix"
                        style={{
                          display: "flex",
                          width: "100%",
                          flexWrap: "wrap",
                        }}
                      >
                        <div className="col-md-6 col-sm-6 col-sx-12">
                          <div className="innerapp">
                            <div className="doc-img">
                              {/* <img src={Doct} alt="doct"/> */}
                              <div className="aaa">
                                <div className="container">
                                  <h3 className="text-dark">
                                    Subscribe Your Disease/Cures Type
                                  </h3>
                                </div>
                                <br />
                                <select
                                  multiple
                                  name="type"
                                  placeholder="Type"
                                  value={this.state.type}
                                  onChange={(e) => {
                                    this.handleSelect(e.target.selectedOptions);
                                  }}
                                  required
                                  className="form-control"
                                >
                                  <option value="1">All</option>
                                  <option value="2">Disease</option>
                                  <option value="3">Cures</option>
                                </select>
                              </div>
                              {this.state.type ? (
                                this.state.type.indexOf("2") === -1 ? null : (
                                  <div className="col-lg-6 form-group">
                                    <label htmlFor="">Disease</label>
                                    <Select
                                      multiple
                                      value={this.state.disease}
                                      onChange={(e) =>
                                        this.setState({
                                          disease: e.target.value,
                                        })
                                      }
                                      input={
                                        <Input id="select-multiple-chip" />
                                      }
                                      className="form-control"
                                    >
                                      {this.state.diseaseList.map((lan) => {
                                        return (
                                          <MenuItem
                                            key={lan[0].toString()}
                                            value={lan[0]}
                                          >
                                            {lan[1]}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </div>
                                )
                              ) : null}
                              {this.state.type ? (
                                this.state.type.indexOf("3") === -1 ? null : (
                                  <div className="col-lg-6 form-group">
                                    <label htmlFor="">Cure</label>
                                    <Select
                                      multiple
                                      value={this.state.cures}
                                      onChange={(e) =>
                                        this.setState({
                                          cures: e.target.value,
                                        })
                                      }
                                      input={
                                        <Input id="select-multiple-chip" />
                                      }
                                      className="form-control"
                                    >
                                      {this.state.diseaseList.map((lan) => {
                                        return (
                                          <MenuItem
                                            key={lan[0].toString()}
                                            value={lan[0]}
                                          >
                                            {lan[1]}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </div>
                                )
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-sx-12 bg-white subs-hero-2">
                          <div className="subscribe">
                            <h1 className="text-dark">All Cures</h1>
                            <div className="h5">
                              Sign up for our free <span>Disease/Cures</span>{" "}
                              Weekly Newsletter
                            </div>
                            <br />
                            <div className="h5">
                              Get <span>doctor-approved</span> health tips,
                              news, and more
                            </div>
                            <div className="form-group relative">
                              <div className="aaa">
                                <PhoneInput
                                  placeholder="Enter phone number"
                                  value={this.state.value}
                                  defaultCountry="IN"
                                  onChange={(newValue) => {
                                    this.setState({
                                      value: newValue,
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <button
                                  className="bcolor rounded py-2"
                                  onClick={() => {
                                    this.postSubscribtion();
                                  }}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div
            className={
              "modal fade" +
              (this.state.modalState ? " show d-block" : " d-none")
            }
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" id="diseaseModal">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    onClick={this.handleShows}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <section className="appStore">
                  <div className="container">
                    <div className="row">
                      <div
                        className="appStoreBg clearfix"
                        style={{
                          display: "flex",
                          width: "100%",
                          flexWrap: "wrap",
                        }}
                      >
                        <div className="col-md-6 col-sm-6 col-sx-12">
                          <div className="innerapp">
                            <div className="doc-img">
                              {/* <img src={Doct} alt="doct"/> */}

                              {this.state.images.length > 0 ? (
                                <img
                                  src={`${imgKitImagePath}/tr:w-300,f-webp${
                                    this.state.images[this.state.currentIndexx]
                                  }`}
                                  alt="doct"
                                  style={{ maxHeight: "400px", width: "405px" }}
                                />
                              ) : (
                                <img
                                  src={`${imgKitImagePath}/tr:w-300,f-webp/assets/img/doct.png`}
                                  alt="doctor"
                                  style={{ maxHeight: "400px", width: "397px" }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-sx-12 bg-white subs-hero-2">
                          <div className="subscribe">
                            <h1 className="text-dark">All Cures</h1>
                            <div className="h5">
                              Sign up for our free <span>All Cures</span> Daily
                              Newsletter
                            </div>
                            <br />
                            <div className="h5">
                              Get <span>doctor-approved</span> health tips,
                              news, and more
                            </div>
                            <div className="form-group relative">
                              <div className="aaa">
                                <PhoneInput
                                  placeholder="Enter phone number"
                                  value={this.state.value}
                                  defaultCountry="IN"
                                  onChange={(newValue) => {
                                    this.setState({
                                      value: newValue,
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <button
                                  className="bcolor rounded py-2"
                                  onClick={() => {
                                    this.postSubscribtion();
                                  }}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      );
    }
  }
}

export default Disease;
