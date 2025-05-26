import React, { Component } from "react";
import { backendHost } from "../api-config";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import Input from "@material-ui/core/Input";
import { Select, MenuItem } from "@material-ui/core";
import { userId } from "./UserId";
import Heart from "../assets/img/heart.png";
import { isValidPhoneNumber } from "react-phone-number-input";
import axiosInstance from "../axiosInstance";

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.childDiv = React.createRef();

    this.state = {
      items: [],
      carouselItems: [],
      comment: [],
      isLoaded: false,
      ratingValue: "",
      rating: [],
      ratingVal: [],
      // param : this.props.match.params,
      disease: "",
      regions: "",
      regionPostsLoaded: false,
      regionalPost: [],
      showMore: false,
      value: "",
      type: [],
      favourite: [],
      diseaseList: [],
      disease: [],
      cures: [],
      showAlert: false,
      alertMsg: "",
      showCuresCards: false,
    };
  }

  componentDidMount() {
    if (userId) {
      this.setState({ modalShow: false });
    }
  }

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
  handleSelect = function (subs) {
    const flavors = [];
    for (let i = 0; i < subs.length; i++) {
      flavors.push(subs[i].value);
    }
    this.setState({
      type: flavors,
    });
  };
  getDisease = () => {
    axiosInstance
      .get(`/article/all/table/disease_condition`)
      .then((res) => {
        this.setState({
          diseaseList: res.data,
        });
      })
      .catch((err) => null);
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    //this.fetchBlog()

    this.getDisease();
  }
  handleChange = (e) => {
    this.setState({
      disease: e.target.value,
    });
  };
  render() {
    return (
      <>
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
        <div
          className="modal fade bd-example-modal-lg"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
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
                                    input={<Input id="select-multiple-chip" />}
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
                                    input={<Input id="select-multiple-chip" />}
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
      </>
    );
  }
}
export default Subscribe;
