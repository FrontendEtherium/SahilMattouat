import React, { Component } from "react";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Heart from "../../assets/img/heart.png";
import Doct from "../../assets/img/doct.png";
import { imgKitImagePath } from "../../image-path";

import axios from "axios";
import "../../assets/healthcare/css/main.css";
import "../../assets/healthcare/css/responsive.css";
import "../../assets/healthcare/css/animate.css";
import "../../assets/healthcare/icomoon/style.css";
import "./custom.css";
import Carousel1 from "./Caousel1";
import Carousel2 from "./Carousel2";
// import CarouselReview from './CarouselReview';
import { Carousel, Dropdown } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

import "react-phone-number-input/style.css";
import "./Home.css";
import { backendHost } from "../../api-config";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Test from "./test";
import { env } from "process";
import { userId } from "../UserId";
import { userAccess } from "../UserAccess";
import ArticlePreview from "./ArticlePreview";
import TrendingArticles from "./TrendingArticles";
import FeaturedArticles from "./FeaturedArticles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import headers from "../../api-fetch";
import DoctorSearch from "../Header/DoctorSearch";

env.REACT_APP = "http://115.246.93.94:8080/cures";

class Home extends Component {
  constructor(props) {
    super(props);
    const params = props.match.params;
    this.state = {
      images: [],
      carouselImages: [
        `${imgKitImagePath}/assets/img/HomePage1.jpg`,
        `${imgKitImagePath}/assets/img/HomePage2.jpg`,
      ],
      currentIndex: 0,
      isUnaniDropdownOpen: false,
      afterSubmitLoad: false,
      showAlert: false,
      alertMsg: "",
      articleFilter: "",
      article: "",
      users: [],
      city: "",
      name: "",
      value: "",
      texts: "",
      cityList: [],
      pinList: [],
      suggestions: [],
      suggestionsDoc: [],
      doctor: [],
      diseaseTitle: [],
      mobile: "",
      getPincode: null,
      getCityName: null,
      edit: false,
      doctorLoaded: false,
      modalShow: this.props.location.state
        ? this.props.location.state.modalShow
        : false,
      path: this.props.location.state ? this.props.location.state.path : "",
      show: false,
      docname: "",
      spec1: [],
      param: params,
      cures: [],
      disease: [],
      setVisible: false,
      searchParams: {
        city: "",
        Pincode: "",
        name: "",
        subscription: "",
      },
      ads: "",
      adId: "",
    };
  }

  componentDidMount() {
    if (userId) {
      this.setState({ modalShow: false });
    }

    this.loadFloater();

    const loadUsers = async () => {
      await axios
        .get(`${backendHost}/city/all`)
        .then((res) => {
          this.setState({
            users: res.data,
          });
          this.state.users.map((u) =>
            this.state.cityList.push(u.Cityname, u.Pincode)
          );
        })
        .catch((res) => null);
    };
    loadUsers();

    const loaddoctor = async () => {
      await axios
        .get(`${backendHost}/IntegratedActionController`)
        .then((res) => {
          this.setState({
            doctor: res.data,
            doctorLoaded: true,
          });
        })
        .catch((res) => null);
    };
    loaddoctor();

    Promise.all([
      fetch(`${backendHost}/article/all/table/disease_condition`, {
        headers: headers,
      }).then((res) => res.json()),
    ])
      .then(([diseaseData]) => {
        this.setState({
          isLoaded: true,
          speciality: diseaseData,
        });
      })
      .then(() => {
        this.state.speciality.map((i) => this.state.spec1.push(i[3]));
      })
      .catch((res) => null);

    window.onload = () => {
      this.fetchData();
    };
  }

  loadFloater = async () => {
    // console.log("checkgin the api 123");
    //    console.log('call floater')
    await axios
      .get(`${backendHost}/data/newsletter/get`)
      .then((res) => {
        // console.log(res.data)
        this.setState({
          images: res.data,
        });
      })
      .catch((res) => null);
    // console.log("1232121 testing");
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
      currentIndex: (prevState.currentIndex + 1) % this.state.images.length,
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.article !== this.state.article && this.state.article) {
      axios
        .get(`${backendHost}/isearch/combo/${this.state.article}`)
        .then((res) => {
          this.setState({
            diseaseTitle: res.data,
          });
        });
    }
  }

  diseasePosts() {
    // For specific cures like "/cures/diabetes"
    console.log("not delayed");
    fetch(`${backendHost}/isearch/${this.state.param.type}`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          items: json,
        });
      })
      .catch((err) => null);
  }

  fetchData = async () => {
    try {
      const response = await axios.get(
        `${backendHost}/sponsored/list/ads/url/1`
      );
      console.log("response API call successful", response); // Check if this log is printed

      if (response.data != "All Ads are Served") {
        const id = response.data.split("/")[3];
        const ids = id.match(/\d+/);
        const adsId = ids[0];

        console.log(adsId);
        console.log(id);

        this.setState({
          adId: adsId,
        });
      }

      const newResponse = `https://all-cures.com:444${response.data}`;
      console.log(newResponse);
      this.setState({
        //  ads: response.data,
        ads: newResponse,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  handleClick = (ad) => {
    console.log("Image clicked!", ad);
    axios.put(`${backendHost}/sponsored/ads/clicks/${ad}`);
  };

  postSubscribtion() {
    var phoneNumber = this.state.value.split("+")[1];
    console.log(this.state.value);
    var countryCodeLength = phoneNumber.length % 10;
    var countryCode = phoneNumber.slice(0, countryCodeLength);
    var StringValue = phoneNumber.slice(countryCodeLength).replace(/,/g, "");
    console.log(isValidPhoneNumber(this.state.value));

    if (!isValidPhoneNumber(this.state.value)) {
      this.Alert("Please enter a 10-digit phone number!");
      return; // Exit the function if the phone number is not 10 digits
    }

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

        if (res.data === "Subscribed") {
          this.Alert("You have successfully subscribed to our Newsletter");
        } else if (res.data === "Already subscribed") {
          // Add a check for 'already_subscribed' response
          this.Alert("You are already subscribed to our Newsletter");
        } else {
          this.Alert("Some error occurred! Please try again later.");
        }
      })
      .catch((err) => {
        this.setState({
          afterSubmitLoad: false,
        });
        this.Alert("Some error occurred! Please try again later.");
      });
  }
  handleChange = (e) =>
    this.setState({
      searchParams: {
        ...this.state.searchParams,
        [e.target.name]: e.target.value,
      },
    });

  logout = async (e) => {
    console.log("Logout started");

    fetch(`${backendHost}/LogoutActionController`, {
      method: "POST",
      credentials: "include",
      headers: { "Access-Control-Allow-Credentials": true },
    })
      //  axios.defaults.withCredentials = true
      //  axios.post(`${backendHost}/LogoutActionController`,{ headers: {'Access-Control-Allow-Credentials': true}}
      //  )
      .then((res) => {
        // if(res.data === '/cures/Login.html?msg=You have successfully logged out.'){
        Cookies.remove("uName");
        setTimeout(() => {
          window.location.reload();
        }, 500);
        // }
      })
      .catch((res) => null);
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
  setModalShow = (action) => {
    this.setState({
      modalShow: action,
    });
  };
  setMobile = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  };
  setCountryCode = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  };

  handleUnaniMouseEnter = () => {
    this.setState({ isUnaniDropdownOpen: true });
  };

  handleUnaniMouseLeave = () => {
    this.setState({ isUnaniDropdownOpen: false });
  };

  onSearch = (e) => {
    var { city, name } = this.state;
    e.preventDefault();
    if (city && name) {
      this.props.history.push(`/search/${city}/${name}`);
    } else if (city) {
      this.props.history.push(`/search/${city}`);
    } else if (name) {
      this.props.history.push(`/searchName/${name}`);
    }
  };

  articleSearch = (e) => {
    e.preventDefault();
    if (this.state.article) {
      this.props.history.push(`/searchcures/${this.state.article}`);
    } else {
      this.props.history.push(`/searchcures`);
    }
  };

  clickCounter = async () => {
    try {
      if (userId) {
        await axios.post(`${backendHost}/video/consult/counts/${userId}`);
      } else {
        await axios.post(`${backendHost}/video/consult/counts/0`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
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
        <div className="profilePage">
          <div className="">
            <section className=" zIndex-2">
              <div className="webAlign">
                <div className="row d-flex">
                  <div className="header" style={{ width: "100%" }}>
                    <div className=" logo mt-1">
                      <Link to="/">
                        <img
                          src={`${imgKitImagePath}/tr:w-300,f-webp/assets/img/heart.png`}
                          alt="All Cures Logo"
                        />
                        <span>All Cures</span>
                      </Link>
                    </div>

                    <div class="fgrow">
                      <nav class="navbar navbar-expand-lg navbar-light bg-light newHeader">
                        <button
                          class="navbar-toggler"
                          type="button"
                          data-toggle="collapse"
                          data-target="#navbarNavDropdown"
                          aria-controls="navbarNavDropdown"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span class="navbar-toggler-icon"></span>
                        </button>
                        <div
                          class="collapse navbar-collapse"
                          id="navbarNavDropdown"
                        >
                          <ul class="navbar-nav">
                            <li class="nav-item">
                              <a class="nav-link" href="/">
                                Home
                              </a>
                            </li>
                            <li class="nav-item dropdown">
                              <a
                                class="nav-link dropdown-toggle"
                                href="#"
                                id="categoriesDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                Categories
                              </a>
                              <div
                                class="dropdown-menu"
                                aria-labelledby="categoriesDropdown"
                              >
                                <a
                                  class="dropdown-item"
                                  href="/searchcategory/disease/1"
                                >
                                  Arthritis
                                </a>
                                <a
                                  class="dropdown-item"
                                  href="/searchcategory/disease/74"
                                >
                                  Diabetes
                                </a>
                                <a
                                  class="dropdown-item"
                                  href="/searchcategory/disease/50"
                                >
                                  Hypertension
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/allcategory">
                                  View More
                                </a>
                              </div>
                            </li>
                            <li class="nav-item dropdown ">
                              <a
                                class="nav-link dropdown-toggle"
                                href="#trends"
                                id="trendingCuresDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                Trending Cures
                              </a>
                              <div
                                class="dropdown-menu"
                                aria-labelledby="trendingCuresDropdown"
                              >
                                <a
                                  class="dropdown-item"
                                  href="/searchmedicine/medicinetype/1"
                                >
                                  Ayurveda
                                </a>
                                <a
                                  class="dropdown-item"
                                  href="/searchmedicine/medicinetype/4"
                                >
                                  Chinese Medicine
                                </a>
                                <a
                                  class="dropdown-item"
                                  href="/searchmedicine/medicinetype/12"
                                  onMouseEnter={this.handleUnaniMouseEnter}
                                  onMouseLeave={this.handleUnaniMouseLeave}
                                >
                                  Arabic
                                  <li
                                    className="nav-item dropdown newDropdown"
                                    onMouseEnter={this.handleUnaniMouseEnter}
                                    onMouseLeave={this.handleUnaniMouseLeave}
                                  >
                                    <a
                                      className="nav-link dropdown-toggle"
                                      href="#"
                                      id="unaniDropdownToggle"
                                      role="button"
                                      data-bs-toggle="dropdown"
                                    >
                                      <span
                                        style={{
                                          fontSize: "1rem",
                                          color: " #212529",
                                        }}
                                      >
                                        {" "}
                                        <ArrowDropDownIcon />
                                      </span>
                                    </a>
                                    {this.state.isUnaniDropdownOpen && (
                                      <ul
                                        className="dropdown-menu newDropdown-menu"
                                        aria-labelledby="unaniDropdownToggle"
                                      >
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            href="/searchmedicine/medicinetype/2"
                                          >
                                            {" "}
                                            Unani
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            href="/searchmedicine/medicinetype/3"
                                          >
                                            Persian
                                          </a>
                                        </li>
                                      </ul>
                                    )}
                                  </li>
                                </a>
                                <a
                                  class="dropdown-item"
                                  href="/searchmedicine/medicinetype/6"
                                >
                                  Japanese
                                </a>
                                <a
                                  class="dropdown-item"
                                  href="/searchmedicine/medicinetype/5"
                                >
                                  Scandinavian
                                </a>
                              </div>
                            </li>
                            <li class="nav-item">
                              <a class="nav-link" href="/AboutUs">
                                About Us
                              </a>
                            </li>
                            {/* <li className="nav-item">
                              <a className="nav-link" href="/webstories">
                                Webstories
                              </a>
                            </li> */}
                          </ul>
                        </div>
                      </nav>
                    </div>
                    <form
                      onSubmit={(e) => this.articleSearch(e)}
                      className="searchHeader"
                      id="searchArticle"
                    >
                      <div className="col-md-12 row">
                        <div className="col-md-10 p-0">
                          <Autocomplete
                            className="bg-white color-black"
                            freeSolo
                            value={this.state.article}
                            onChange={(event, newValue) => {
                              this.setState({
                                article: newValue,
                              });
                            }}
                            inputValue={
                              this.state.article ? this.state.article : ""
                            }
                            onInputChange={(event, newInputValue) => {
                              this.setState({
                                article: newInputValue,
                              });
                            }}
                            id="combo-box-demo"
                            options={
                              this.state.article
                                ? this.state.article.length >= 1
                                  ? this.state.diseaseTitle
                                  : []
                                : []
                            }
                            sx={{ width: 170 }}
                            renderInput={(params) => (
                              <TextField {...params} label="Search Cures" />
                            )}
                          />
                        </div>
                        <div className="col-md-2 p-0 mainBtn">
                          <button
                            className="btn search-main-btns color-white"
                            id="searchHead"
                            type="submit"
                          >
                            <i
                              className="fas header-search fa-search"
                              id="iconSearch"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="loginSign d-flex">
                      {userAccess ? (
                        <Link
                          className="btn mr-2 primary-btn-color loginSignbtn color-blue-dark"
                          id="Article"
                          to="/article"
                        >
                          <img
                            src={`${imgKitImagePath}/tr:w-300,f-webp/assets/img/edit_black_48dp.svg`}
                            alt="create cures"
                            className="filter-white"
                            height="30px"
                          />
                        </Link>
                      ) : (
                        <button
                          className="btn mr-2 primary-btn-color loginSignbtn color-blue-dark"
                          id="Article"
                          onClick={() => this.setModalShow(true)}
                        >
                          <img
                            src={`${imgKitImagePath}/tr:w-300,f-webp/assets/img/edit_black_48dp.svg`}
                            alt="create cures"
                            className="filter-white"
                            height="30px"
                          />
                        </button>
                      )}
                      <ToggleButton
                        userName={Cookies.get("uName")}
                        setModalShow={this.setModalShow}
                        userAccess={userAccess}
                        logout={this.logout}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Test
                show={this.state.modalShow}
                path={this.state.path}
                onHide={() => this.setModalShow(false)}
              />
            </section>
          </div>
        </div>
        {/* old banner */}
        {/* <section className="banner">
          <div className="banner-title h1 d-flex justify-content-center align-items-center">
            <h1 className="color-white font-weight-bold " id="head1">
              All Cures
            </h1>
            <div className="h2 color-white text-center" id="head1">
              Getting You Closer To Cures From Around The World
            </div>
          </div>
        </section> */}
        <div className="doctor-patient-banner-container">
          <Carousel interval={4000} pause={false} indicators={true}>
            {this.state.carouselImages.map((img, index) => (
              <Carousel.Item key={index}>
                {index + 1 === 2 ? (
                  <img
                    src={img}
                    alt={`Doctor Patient Connect ${index + 1}`}
                    className="img-fluid rounded doctor-patient-banner"
                  />
                ) : (
                  <a href="#trends">
                    <img
                      src={img}
                      alt={`Doctor Patient Connect ${index + 1}`}
                      className="img-fluid rounded doctor-patient-banner"
                    />
                  </a>
                )}

                {index + 1 === 2 && (
                  <Carousel.Caption>
                    <button
                      className="doctor-patient-banner-btn"
                      onClick={() => {
                        window.location.href = "/landing-doctor";
                        this.clickCounter();
                      }}
                    >
                      Consult Now
                    </button>
                  </Carousel.Caption>
                )}
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <DoctorSearch />
        <section className="tabslider clerfix">
          <div className="container">
            <div className="row">
              <div className="tab-nav">
                <div
                  className="comman-heading"
                  itemscope
                  itemtype="http://all-cures.com/Product"
                >
                  <h1 style={{ display: "none" }}>
                    All Cures is a product developed, managed and owned by
                    Etherium Technologies. Our mission is to make it simple and
                    convenient for users to get information on Cures from
                    anywhere in the world. Our belief is that your wellness is
                    your well-being. We are passionate about giving our users
                    the unique experience that is both fulfilling and wholesome.
                  </h1>
                  <h2 style={{ display: "none" }}>
                    Ayurveda, Homeopathy, Chinese Medicine, Persian, Unani
                  </h2>
                  <div className="h4 mt-4" itemprop="Category">
                    Choose by Diseases
                  </div>
                </div>
              </div>
              <Carousel1 city={this.state.searchParams.city} />
            </div>
          </div>
        </section>

        <section className="mb-5 mt-2">
          <div className="container">
            <div className="row">
              <div className="comman-heading">
                <div className="h4">Featured Cures</div>
              </div>
            </div>
            <div className="row">
              <FeaturedArticles />
            </div>
          </div>
        </section>

        {/* {
                           
                              this.state.ads!=="https://uat.all-cures.com:444All Ads are Served" ? (
                                 <div className="container">
                                    <div>
                              <img className="mb-4"  src={this.state.ads}/>
                              </div>
                              </div>
                              ):null
                            
                            
         }   */}

        {this.state.ads ? (
          this.state.ads !== "https://all-cures.com:444All Ads are Served" ? (
            <div className="container d-flex justify-content-center">
              <img
                className=" mb-5 ml-1"
                id="left-menu-ad"
                src={this.state.ads}
                alt="ad"
                onClick={() => this.handleClick(this.state.adId)}
              />{" "}
            </div>
          ) : null
        ) : null}

        <section className="mb-5 mt-2">
          <div className="container" id="trends">
            <div className="row">
              <div className="comman-heading">
                <div className="h4">Trending Cures</div>
              </div>
            </div>
            <div className="row">
              <TrendingArticles />
            </div>
          </div>
        </section>

        <section className="trending-section">
          <ArticlePreview articleFilter={this.state.articleFilter} />
        </section>

        <section className="specialists mt-3">
          <div className="container">
            <div className="row">
              <div className="comman-heading">
                <div className="h4 mt-4">Choose by Doctors</div>
              </div>
            </div>
            <div className="row">
              <div className="nav-btn prev-slide"></div>
              <div className="nav-btn next-slide"></div>
              <Carousel2 />
            </div>
          </div>
        </section>

        {/* <section className="consultunt">
         <div className="container">
            <div className="row">
               <div className="consultunt-inner">
                  <h1>Meet Our Consultants Online</h1>
                  <p>Video visits can address immediate medical issues or routine healthcare needs. Doctors are ready to treat a variety of issues or help you with prescriptions or referrals.</p>
                  <div className="startVideo">
                     <Link to="#" className="btn-bg startVideoBtn allBtn">Start Video Consultation</Link>
                  </div>
               </div>
            </div>
         </div>
      </section> */}
        {/* <section className="doctor">
         <div className="container">
            <div className="row">
               <div className="comman-heading">
               <div className="h4">Our Top Doctors</div>
               </div>
            </div>
            
            <div className="row">
               <Carousel2/>
            </div>
        
         </div>
         
      </section><br/><br/> */}
        {/* <section className="partner">
         <div className="container">
            <div className="row">
               <div className="partnerBG">
                  <h2>Be our Partners and <br/> Expand your Client base</h2>
                  <div className="learnBtn">
                     <Link href="/#" className="btn-bg nearmoreBtn">Learn More</Link>
                  </div>
               </div>
            </div>
         </div>
      </section> */}
        {/* <section className="testomonial" id="testimonials">
         <div className="container">
            <div className="row">
               <div className="comman-heading">
                  <h2>What our patients say</h2>
               </div>
            </div>
            <div className="row">
               <CarouselReview/>
                   
            </div> 
       
         </div>
      </section> */}
        <div>
          <button
            id="mobile-subscribe-fixed-btn"
            className="btn newsletter-icon rounded subscribe-btn newsletter_float"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
            onClick={this.floaterShow}
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
          className="modal fade bd-example-modal-lg mt-5"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  onClick={this.handleModalClose}
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
                          <div className="doc-img ">
                            {this.state.images.length > 0 ? (
                              <img
                                src={`https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp${
                                  this.state.images[this.state.currentIndex]
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
                            Get <span>doctor-approved</span> health tips, news,
                            and more
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
function ToggleButton(props) {
  if (props.userAccess) {
    return (
      <>
        <Dropdown>
          <Dropdown.Toggle
            className="header-drop text-capitalize"
            id="drop-down"
          >
            <img
              className="filter-white"
              src={`${imgKitImagePath}/tr:w-300,f-webp/assets/img/account_circle_black_48dp.svg`}
              height="30px"
              alt="account"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Link className="text-dark btn" to={`/user/profile`}>
                Profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/editSubscribe" className="text-dark btn">
                Edit Subscription
              </Link>
            </Dropdown.Item>

            <Dropdown.Item>
              <Link to="/chatlist" className="text-dark btn">
                My Inbox
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link className="text-dark btn" to={`/bookings`}>
                My Bookings
              </Link>
            </Dropdown.Item>

            {props.userAccess >= 4 ? (
              <Dropdown.Item>
                <Link to="/dashboard" className="text-dark btn">
                  Dashboard
                </Link>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item>
                <Link to="/my-cures" className="text-dark btn">
                  My Favourite Cures
                </Link>
              </Dropdown.Item>
            )}

            <Dropdown.Item>
              <button
                className="btn text-dark text-capitalize"
                onClick={props.logout}
              >
                {" "}
                Logout
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
  return (
    <>
      <button
        className="btn primary-btn-color text-light loginSignbtn color-blue-darks"
        variant="dark"
        style={{ width: "10rem" }}
        onClick={() => props.setModalShow(true)}
      >
        Sign in/Sign up
      </button>
      {/* <Link 
         className="btn-white loginSignbtn color-blue-dark" 
         to={{pathname: props.match, search: '?login=true', state: {open: true}}}
      >
         Sign in/Sign up
      </Link> */}
    </>
  );
}

export default Home;
