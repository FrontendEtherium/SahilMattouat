import React, { Component } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ProfileTab from "./ProfileTab";
import Cookies from "js-cookie";
import Doct from "../../assets/img/doct.png";
import "../../assets/healthcare/css/main.css";
import "../../assets/healthcare/css/responsive.css";

import "../../assets/healthcare/icomoon/style.css";
import { Form, Container } from "react-bootstrap";
import axios from "axios";
import { backendHost } from "../../api-config";
import Test from "../LandingPage/test";
import Heart from "../../assets/img/heart.png";
import headers from "../../api-fetch";

class Search extends Component {
  constructor(props) {
    super(props);
    const params = props.match.params;
    this.state = {
      url: props.url,
      items: [],
      ratingValue: "",
      isLoaded: false,
      param: params,
      acPerm: Cookies.get("acPerm"),
      reload: false,
      speciality: [],
      articleValues: {
        diseaseConditionId: 1,
      },
    };
  }

  handleArticleChange = (e) => {
    this.setState({
      articleValues: {
        ...this.state.articleValues,
        [e.target.name]: e.target.value,
      },
    });
  };

  fetchDoctors(city, lat, lon) {
    if (city && this.props.match.params.name) {
      document.title = `All Cures | ${city} | ${this.props.match.params.name}`;
      fetch(
        `${backendHost}/SearchActionController?cmd=getResults&city=${city}&doctors=${
          this.props.match.params.name
        }&Latitude=${Cookies.get("latitude")}&Longitude=${Cookies.get(
          "longitude"
        )}`
      )
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            isLoaded: true,
            items: json.map.DoctorDetails.myArrayList,
          });
        })
        .catch((err) => {
          return;
        });
    } else if (this.props.match.params.name && !city) {
      document.title = `All Cures | ${this.props.match.params.name}`;
      fetch(
        `${backendHost}/SearchActionController?cmd=getResults&doctors=${
          this.props.match.params.name
        }&Latitude=${Cookies.get("latitude")}&Longitude=${Cookies.get(
          "longitude"
        )}`
      )
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            isLoaded: true,
            items: json.map.DoctorDetails.myArrayList,
          });
        })
        .catch((err) => {
          return;
        });
    } else if (city && !this.props.match.params.name) {
      document.title = `All Cures | ${city}`;
      fetch(
        `${backendHost}/SearchActionController?cmd=getResults&city=${city}&Latitude=${Cookies.get(
          "latitude"
        )}&Longitude=${Cookies.get("longitude")}`
      )
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            isLoaded: true,
            items: json.map.DoctorDetails.myArrayList,
            acPerm: Cookies.get("acPerm"),
          });
        })
        .catch((err) => {
          return;
        });
    }
  }

  fetchDiseaseList() {
    Promise.all([
      fetch(`${backendHost}/article/all/table/disease_condition`, {
        headers: headers,
      }).then((res) => res.json()),
    ])
      .then((diseaseData) => {
        this.setState({
          speciality: diseaseData,
        });
      })
      .catch((err) => {
        return;
      });
  }
  getRating = (docId) => {
    axios
      .get(`${backendHost}/rating/target/${docId}/targettype/1/avg`)
      .then((res) => {
        this.setState(
          {
            ratingValue: res.data,
          },
          () => {
            setTimeout(() => {
              this.showRating(this.state.ratingValue);
            }, 1000);
          }
        );
      })
      .catch((err) => {
        return;
      });
  };
  // USE if statement
  componentDidMount() {
    this.fetchDoctors(this.props.match.params.city);
    this.fetchDiseaseList();
    this.getRating(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.city !== this.props.match.params.city) {
      this.fetchDoctors(this.props.match.params.city);
    }
  }

  setModalShow = (action) => {
    this.setState({
      modalShow: action,
    });
  };

  render() {
    var { isLoaded, items } = this.state;
    if (!isLoaded) {
      return (
        <>
          <Header history={this.props.history} url={this.props.match.url} />
          <div className="loader my-4">
            {/* <i className="fa fa-spinner fa-spin fa-6x" /> */}
            <img src={Heart} alt="All Cures Logo" id="heart" />
          </div>
          <Footer />
        </>
      );
    } else if (isLoaded && items.length === 0) {
      if (this.state.param.city) {
        return (
          <>
            <Header history={this.props.history} url={this.props.match.url} />
            <Container className="mt-5 my-5 loading">
              <h3 className="pt-5 text-center">
                <span className="icon-loupe "></span>
              </h3>
              <h3 className="mt-3 text-center">
                We couldn't find any doctors matching in '
                {this.props.match.params.city}'
              </h3>
              <p className="text-center">You can try again. </p>
            </Container>
            <Footer />
          </>
        );
      } else if (this.state.param.name) {
        return (
          <>
            <Header history={this.props.history} />
            <Container className="mt-5 my-5">
              <h3 className="pt-5 text-center">
                <span className="icon-loupe "></span>
              </h3>
              <h3 className="text-center">
                We couldn't find any doctors matching in '
                {this.state.param.name}'
              </h3>
              <p className="text-center">You could try again. </p>
            </Container>
            <Footer />
          </>
        );
      }
    } else if (isLoaded) {
      return (
        <div>
          <Header history={this.props.history} url={this.props.match.url} />
          <section className="physicians-tab">
            <div className="container">
              <div className="row">
                <div className="col-md-10 pd-0">
                  <div className="tab-nav">
                    <div className="comman-heading">
                      <h2>All Physicians</h2>
                    </div>
                  </div>
                  {items.map((i) => (
                    <ProfileTab
                      docID={i.map.docID}
                      docid={i.map.doctorid}
                      firstName={i.map.firstName}
                      lastName={i.map.lastName}
                      name={i.map.name}
                      pSpl={i.map.primarySpl}
                      hospital={i.map.hospitalAffliated}
                      state={i.map.state}
                      country={i.map.country}
                      acPerm={this.state.acPerm}
                      url={this.props.url}
                      reload={this.state.reload}
                      setModalShow={this.setModalShow}
                      key={i.map.doctorid}
                      eduTraining={i.map.edu_training}
                      ratingVal={this.state.ratingvalue}
                      img={i.map.imgLoc}
                    />
                  ))}
                  <Test
                    show={this.state.modalShow}
                    onHide={() => this.setModalShow(false)}
                  />
                </div>
              </div>
            </div>
          </section>

          <div>
            {/* <button i className=" newsletter-icon btn  newsletter_float" data-toggle="modal"data-target=".bd-example-modal-lg">
      Subscribe
     
            </button> */}
          </div>
      

          <Footer />
        </div>
      );
    }
  }
}
export default Search;
