import React, { Component, useState } from "react";
import axios from "axios";
import { backendHost } from "../../api-config";
import Header from "./Header";
import Footer from "../Footer/Footer";
import { userAccess } from "../UserAccess";
import Cookies from "js-cookie";

import DeleteLogin from "../LandingPage/DeleteLogin";
export default class AboutUs extends Component {
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
      modalShow: this.props.location.state
        ? this.props.location.state.modalShow
        : false,
      country: new URLSearchParams(this.props.location.search).get("c"),
      diseaseCondition: new URLSearchParams(this.props.location.search).get(
        "dc"
      ),
      articleFilter: "recent",
      mail: "info@etheriumtech.com",
    };
  }
  setModalShow = (action) => {
    this.setState({
      modalShow: action,
    });
  };
  render() {
    var { isLoaded, items, regionPostsLoaded, LoadMore, props } = this.state;
    return (
      <>
        <div>
          <Header history={this.props.history} />
          <div className="container mt-8">
            <h3>About Us</h3>
            <p className="mt-3">
              All Cures is a product developed, managed and owned by Etherium
              Technologies. Our mission is to make it simple and convenient for
              users to get information on Cures from anywhere in the world. Our
              belief is that your wellness is your well-being. We are passionate
              about giving our users the unique experience that is both
              fulfilling and wholesome.
            </p>
          </div>
          <div className="container mb-90" style={{ marginBottom: "20" }}>
            <h3>Contact Us</h3>
            <h5 className="mt-3">
              Email id:{" "}
              <a href="mailto:info@etheriumtech.com" id="email">
                {this.state.mail.toLowerCase()}
              </a>
            </h5>
            <h5>
              Phone No.: <a href="tel:+91 191 295 9035">+91 191 295 9035</a>
            </h5>
            <button
                className="about-consult-btn"
                onClick={() => (window.location.href = "/doctor-connect")}
                >
                Consult Now
           </button>
            <div class="container my-3">
              <h3>
                <a href="/feedback">
                  <button id="" className="article-search btn btn-dark mt-10">
                    Submit Your Feedback
                  </button>
                </a>
              </h3>
            </div>
          </div>
          <ToggleButton
            userName={Cookies.get("uName")}
            setModalShow={this.setModalShow}
            userAccess={userAccess}
            logout={this.logout}
          />
          <DeleteLogin
            show={this.state.modalShow}
            onHide={() => this.setModalShow(false)}
          />
          <Footer></Footer>
        </div>
      </>
    );
  }
}
function ToggleButton(props) {
  let [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div
        className="container mb-30"
        style={{ fontSize: ".9rem", marginTop: "6rem" }}
      >
        As a customer of AllCures, you have the ability to delete your profile.
        If your objective is for AllCures to not contact you, you have the
        ability of Unsubscribing to our NewsLetter by{" "}
        <a href="/editSubscribe">Editing your subscription. </a>
        If you would like to Delete your profile, you can do that by &nbsp;
        <button
          class=" text-dark "
          id="signIn"
          variant="dark"
          style={{
            border: "none",
            padding: "0",
            background: "white",
            marginLeft: ".1rem",
          }}
          onClick={() => props.setModalShow(true)}
        >
          Clicking Here.{" "}
        </button>
        If you would like AllCures to remove all your information from our
        databases, please send us an email at info@etheriumtech.com with the
        Subject of 'Delete My Profile'. In the subject of the body, also
        indicate your email address.
      </div>
    </>
  );
}
