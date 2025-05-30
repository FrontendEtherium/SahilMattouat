import React, { Component } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Rating from "../StarRating";
import Doct from "../../assets/img/doct.png";
import "../../assets/healthcare/css/main.css";
import "../../assets/healthcare/css/responsive.css";

import "../../assets/healthcare/icomoon/style.css";
import { Container, Button } from "react-bootstrap";
import axios from "axios";
import EditProfile from "./EditProfile";
import { backendHost } from "../../api-config";
import Comment from "../Comment";
import "../../assets/healthcare/css/mobile.css";
// import ArticleComment from '../ArticleComment';
import { userId } from "../UserId";
import { userAccess } from "../UserAccess";
import AllPost from "../BlogPage/Allpost";
import Heart from "../../assets/img/heart.png";
import { Alert } from "react-bootstrap";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import HelmetMetaData from "../HelmetMetaData";
import { imagePath } from "../../image-path";
import Chat from "./Chat";
import { Tabs, Tab } from "react-bootstrap";

// import Calendar from 'react-calendar';
import dayjs from "dayjs";

import DailyIframe from "@daily-co/daily-js";

import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import AppointmentModal from "../../features/BookAppointment";
import Test from "../LandingPage/test";

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.primary.contrastText,
  },
}));

class ServerDay extends Component {
  render() {
    const {
      highlightedDays = [],
      day,
      outsideCurrentMonth,
      ...other
    } = this.props;

    const isSelected =
      !this.props.outsideCurrentMonth &&
      highlightedDays.includes(day.format("YYYY-MM-DD"));

    return (
      <HighlightedDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        selected={isSelected}
      />
    );
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);
    const params = props.match.params;
    this.editToggle = this.editToggle.bind(this);
    this.state = {
      showAppointmentModal: false,
    };
    this.fetchDoctorData = this.fetchDoctorData.bind(this);
    this.state = {
      items: [],
      articleItems: [],
      comment: [],
      ratingValue: "",
      rating: [],
      firstName: [],
      lastName: [],
      isLoaded: false,
      param: params,
      edit: false,
      showMore: false,
      modalShow: false,
      show: false,
      imageExists: false,
      selectedFile: "",
      isFilePicked: false,
      imageUploadLoading: false,
      showAlert: false,
      alertMsg: "",

      docid: null,
      initial: 4,
      doctImage: [],
      isDefaultImage: false,
      selectedDate: null,
      selectedTime: null,
      callFrame: null,
      videoLink: null,
      availStatus: null,
      // value: new Date(),
      // date: new Date()

      value: dayjs(),
      // highlightedDays: [ "2024-03-06", "2024-03-15",'2024-03-11','2024-03-18','2024-04-03'],
      highlightedDays: [],
      unavailableDates: [],
      // unavailableDates:[ "2024-03-07", "2024-03-16",'2024-03-12','2024-03-19'],
      // timeSlots:['10:00:00 AM','10:45:00 AM','11:30:00 AM','12:15:00 PM','13:00:00 PM','13:45:00 PM','14:30:00 PM','15:15:00 PM','16:00:00 PM','16:45:00 PM','17:30:00 PM'],
      timeSlots: [],
      unbookedSlots: [],
      selectedTimeSlot: "",
      selectedDate: "", // Initialize selectedDate state
      alert: false,
      alertBooking: false,
      bookingLoading: false,
      userAvailStatus: "",
      amount: null,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  disableDate = (date) => {
    const currentDate = new Date();
    const isPastDate = date < currentDate;
    const isBooked = this.state.highlightedDays.includes(
      date.format("YYYY-MM-DD")
    );
    const isUnavail = this.state.unavailableDates.includes(
      date.format("YYYY-MM-DD")
    );
    return isBooked || isUnavail;
  };

  handleDatesChange = (newValue) => {
    this.setState({
      value: newValue,
      selectedDate: newValue.format("YYYY-MM-DD"), // Update selectedDate state
    });

    fetch(
      `${backendHost}/appointments/get/Slots/${
        this.props.match.params.id.split("-")[0]
      }`
    )
      .then((res) => res.json())
      .then((json) => {
        // Extract the totalDates from the JSON response
        const totalDates = json.totalDates;

        // Extract the first date from totalDates object
        const firstDate = Object.keys(totalDates)[0];

        // Extract the timeslots for the first date
        const timeslots = totalDates[firstDate];

        const unbookedSlots = json.unbookedSlots[this.state.selectedDate] || [];

        this.setState({
          unbookedSlots: unbookedSlots,
        });
      });
  };

  handleTimeChange = (newTime) => {
    this.setState({ selectedTime: newTime });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  // Image Upload
  changeHandler = (event) => {
    if (event.target.files[0].size > 1048576) {
      this.Alert("Image should be less than 1MB!");
      return;
    }
    this.setState(
      {
        selectedFile: event.target.files[0],
      },
      (event) => this.handleImageSubmission(event)
    );
  };

  bookAppn = (e) => {
    e.preventDefault();

    // console.log('clicked booking');
    // console.log('time', dayjs(this.state.selectedTime).format("HH:mm"));

    axios
      .post(`${backendHost}/appointments/create`, {
        docID: this.state.docid,
        userID: parseInt(userId),
        appointmentDate: this.state.selectedDate,
        startTime: this.state.selectedTimeSlot,
        paymentStatus: 0,
        amount: "1.00",
        currency: "INR",
      })
      .then((res) => {
        let enc = res.data;

        const response = JSON.stringify(enc);

        const responseObject = JSON.parse(response);

        localStorage.setItem("encKey", responseObject.encRequest);
        localStorage.setItem("apiResponse", JSON.stringify(res.data));

        const redirectURL =
          "https://www.all-cures.com/paymentRedirection" +
          `?encRequest=${responseObject.encRequest}` +
          `&accessCode=AVWN42KL59BP42NWPB`;

        window.location.href = redirectURL;
      });
  };

  handleImageSubmission = (e) => {
    // e.preventDefault()
    this.setState({ imageUploadLoading: true });
    const formData = new FormData();
    formData.append("File", this.state.selectedFile);
    fetch(
      `${backendHost}/dashboard/imageupload/doctor/${
        this.props.match.params.id.split("-")[0]
      }`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setTimeout(() => {
          this.setState({
            isFilePicked: true,
            imageUploadLoading: false,
          });
        }, 5000);

        this.Alert("Image uploaded successfully.");
      })
      .catch((error) => {
        return;
      });
  };
  Alert = (msg) => {
    console.log(msg);
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
  postLead = (id) => {
    this.showModal();
    axios
      .post(
        `${backendHost}/leads/count/${this.props.match.params.id.split("-")[0]}`
      )

      .then((res) => {
        console.log("id", res.data);
      })
      .catch((err) => err);
  };

  allPosts = () => {
    // For all available blogs "/blogs"
    fetch(
      `${backendHost}/article/authallkv/reg_type/1/reg_doc_pat_id/${
        this.props.match.params.id.split("-")[0]
      }?offset=0&limit=${this.state.initial}`
    )
      .then((res) => res.json())
      .then((json) => {
        var temp = [];
        json.forEach((i) => {
          if (i.pubstatus_id === 3) {
            temp.push(i);
          }
        });
        this.setState((prevState) => ({
          articleItems: temp,
          initial: prevState.initial + 4,
        }));
      })
      .catch((err) => {
        return;
      });
  };

  getComments = (id) => {
    axios
      .get(`${backendHost}/rating/target/${id}/targettype/1`)
      .then((res) => {
        var temp = [];
        res.data.forEach((i) => {
          if (i.reviewed === 1 && i.comments !== "null") {
            temp.push(i);
          }
        });
        this.setState({
          comment: temp,
        });
      })
      .catch((err) => {
        return;
      });
  };

  showComments = (item, i) => {
    return (
      <>
        <div className="col-12">
          <div className="card my-4 ">
            <div className="card-body">
              <h5 className="h6"> {item.comments}</h5>
              <div className="card-info">
                <h6 className="card-subtitle mb-2 text-muted">
                  <b>By : </b> {item.first_name} {item.last_name}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

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

  getRate = (docId) => {
    axios
      .get(
        `${backendHost}/rating/target/${docId}/targettype/1?userid=${userId}`
      )
      .then((res) => {
        this.setState({
          rating: res.data[0].ratingVal,
        });
      })
      .catch((err) => {
        return;
      });
  };

  fetchDoctorData = (id) => {
    fetch(`${backendHost}/DoctorsActionController?DocID=${id}&cmd=getProfile`)
      // .then(res => JSON.parse(res))
      .then((res) => res.json())
      .then((json) => {
        // console.log('firstname', 'id',id,json.firstName)
        // document.title = `${json.firstName} ${json.lastName}`;

        this.setState({
          isLoaded: true,
          items: json,
          docid: json.docID,
        });
      });
  };

  fetchAvailStatus = (id) => {
    fetch(`${backendHost}/video/get/${id}/availability`)
      // .then(res => JSON.parse(res))
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          availStatus: json,
        });
        // console.log('availStatus',this.state.availStatus)
      });
  };

  fetchUserAvailStatus = (id) => {
    fetch(`${backendHost}/appointments/get/${id}/${userId}`)
      // .then(res => JSON.parse(res))
      .then((res) => res.json())
      .then((json) => {
        // console.log('useravailstatus',id,userId)

        // console.log('useravailStatus',json)

        const currentDate = new Date();
        const currentTime =
          currentDate.getHours() + ":" + currentDate.getMinutes();

        let availability = 0;
        json.forEach((appointment) => {
          if (
            appointment.appointmentDate ===
            currentDate.toISOString().split("T")[0]
          ) {
            // Check if current time is within the time range of the appointment
            if (
              currentTime >= appointment.startTime &&
              currentTime <= appointment.endTime
            ) {
              availability = 1;
              // If a match is found, you can break the loop since you have already found the availability
              return;
            }
          }
        });
        // Set availability state based on the check
        this.setState({
          userAvailStatus: availability,
        });
      });
  };

  fetchAppointmentDetails = (id) => {
    fetch(`${backendHost}/appointments/get/Slots/${id}`)
      .then((res) => res.json())
      .then((json) => {
        const firstDate = Object.keys(json.totalDates)[0];

        // Extract the timeslots for the first date
        const timeslots = json.totalDates[firstDate];

        const highlightedDate = json.completelyBookedDates;

        this.setState({
          timeSlots: timeslots,
          highlightedDays: highlightedDate,
        });

        //

        const totalDates = Object.keys(json.totalDates);

        const generateDateRange = (startDate, endDate) => {
          const dates = [];
          let currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().slice(0, 10));
            currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
          }
          return dates;
        };

        // Generate all possible dates for the next 30 days
        const currentDate = new Date();
        const next30Days = new Date(
          currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const allPossibleDates = generateDateRange(currentDate, next30Days);

        // Find the missing dates
        const missingDates = allPossibleDates.filter(
          (date) => !totalDates.includes(date)
        );

        // console.log('missing dates',missingDates)

        this.setState({
          unavailableDates: missingDates,
        });

        const unbookedSlots = json.unbookedSlots[this.state.selectedDate] || [];

        // Set the state of unbookedSlots using the extracted unbooked slots
        this.setState({
          unbookedSlots: unbookedSlots,
          amount: json.amount,
        });
      });
  };

  showRating = (val) => {
    if (document.getElementById("doctor-avg-rating")) {
      for (let i = 0; i < val; i++) {
        document
          .getElementById("doctor-avg-rating")
          .children[i].classList.add("checked");
      }
    }
  };

  editToggle = () => {
    if (this.state.edit === false) {
      this.setState({
        edit: true,
      });
    } else {
      this.setState({
        edit: false,
      });
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchDoctorData(this.props.match.params.id.split("-")[0]);
    this.fetchAvailStatus(this.props.match.params.id.split("-")[0]);
    this.fetchUserAvailStatus(this.props.match.params.id.split("-")[0]);
    this.fetchAppointmentDetails(this.props.match.params.id.split("-")[0]);
    this.getComments(this.props.match.params.id.split("-")[0]);
    this.getRating(this.props.match.params.id.split("-")[0]);
    this.getRate(this.props.match.params.id.split("-")[0]);
    this.allPosts();
    // this.getImg();

    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";

    const currentURL = window.location.href;
    // Remove "www" from the URL if it's present
    const canonicalURL = currentURL.replace(/(https?:\/\/)?www\./, "$1");

    if (canonicalURL.match(/\/profile\/\d+-[a-zA-Z0-9-]+/)) {
      canonicalLink.href = canonicalURL;
      // Log the constructed canonical link to the console
      console.log("Canonical Link:", canonicalLink.outerHTML);
    } else if (canonicalURL.match(/\/profile\/\d+/)) {
      // If URL contains only ID
      const id = this.props.match.params.id.split("-")[0];

      // Fetch the first name and last name based on the ID
      fetch(`${backendHost}/DoctorsActionController?DocID=${id}&cmd=getProfile`)
        .then((res) => res.json())
        .then((json) => {
          // Use the first name and last name directly from the API response
          const firstName = json.firstName;
          const lastName = json.lastName;

          canonicalLink.href = `${window.location.origin}/profile/${id}-${firstName}-${lastName}`;
          document.head.appendChild(canonicalLink);

          // Log the constructed canonical link to the console
          console.log("Canonical Link:", canonicalLink.outerHTML);
        })
        .catch((err) => {
          // Handle the error or use a default name
          canonicalLink.href = canonicalURL;
          document.head.appendChild(canonicalLink);

          // Log the constructed canonical link to the console
          console.log("Canonical Link:", canonicalLink.outerHTML);
        });
    } else {
      canonicalLink.href = canonicalURL;
      // Log the constructed canonical link to the console
      console.log("Canonical Link:", canonicalLink.outerHTML);
    }
  }

  setModalShow = (action) => {
    this.setState({
      modalShow: action,
    });
  };
  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  handleShow = () => {
    this.setState({
      show: true,
    });
  };

  handleTimeSlot = (time) => {
    // console.log('handle')
    //     console.log('time',time)
    this.setState(
      { selectedTimeSlot: time }
      // () => {
      //   console.log("selectedslot", this.state.selectedTimeSlot);
      // }
    );
  };

  checkIfImageExits = (imageUrl) => {
    fetch(imageUrl, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          this.setState({
            imageExists: true,
          });
        } else {
          this.setState({
            imageExists: false,
          });
        }
      })
      .catch((err) => {
        return;
      });
  };
  consult = () => {
    if (userAccess && userId) {
      this.setState({ showAppointmentModal: true });
    } else {
      this.setState({ show: true });
    }
  };
  onError = (e) => {
    e.target.parentElement.innerHTML = `<i class="fas fa-user-md fa-6x"></i>`;
  };

  initVideoChat = () => {
    // console.log('idcreated',docid)
    const id = this.props.match.params.id.split("-")[0];

    // console.log('idcreated',id)

    fetch(`${backendHost}/video/create/room/${id}`)
      // .then(res => JSON.parse(res))
      .then((res) => res.json())
      .then((json) => {
        if (!this.state.callFrame && json != "Error") {
          // Initialize the video chat
          const newCallFrame = DailyIframe.createFrame({
            // Check if callFrame already exists
            showLeaveButton: true,
          });

          // newCallFrame.join({ url: 'https://uat.daily.co/qLxOzn6ZKVyqkQ6YByzL' });
          newCallFrame.join({ url: json });

          // Attach a listener for the 'left-meeting' event
          newCallFrame.on("left-meeting", () => {
            // When leaving the meeting, destroy the frame
            newCallFrame.destroy();
            this.setState({ callFrame: null });
          });

          this.setState({ callFrame: newCallFrame });
        }
      });
  };

  render() {
    const { value, highlightedDays } = this.state;
    const today = dayjs();

    const { selectedDate, selectedTime } = this.state;
    var { isLoaded, items } = this.state;
    if (!isLoaded) {
      return (
        <>
          <Header history={this.props.history} />
          <div className="loader my-4">
            {/* <i className="fa fa-spinner fa-spin fa-6x" /> */}
            <img src={Heart} alt="All Cures Logo" id="heart" />
          </div>
          <Footer />
        </>
      );
    } else if (isLoaded && items == null) {
      return (
        <>
          <Header history={this.props.history} />
          <Container className="mt-5 my-5">
            <h3 className="m-auto text-center">
              <span className="icon-loupe "></span>
            </h3>
            <h3 className="text-center">Doctor not found</h3>
          </Container>
          <Footer />
        </>
      );
    } else if (isLoaded) {
      const { isFilePicked, showAlert, alertMsg } = this.state;
      return (
        <div>
          {showAlert && (
            <div className="alert alert-success pop-up border-bottom">
              <div className="h5 mb-0 text-center">{alertMsg}</div>
              <div className="timer"></div>
            </div>
          )}
          <HelmetMetaData
            title={items.prefix + " " + items.firstName + " " + items.lastName}
            description={items.about}
            image={`${imagePath}/cures_articleimages/doctors/${items.docID}.png`}
            keywords={
              items.firstName +
              " " +
              items.lastName +
              " , " +
              items.hospitalAffiliated +
              " , " +
              items.primarySpl
            }
          ></HelmetMetaData>
          <Header history={this.props.history} />

          <section className="Profileleft">
            <div className="container">
              <div className="row">
                <div className="col-md-8 pd-0">
                  <div className="profile-card clearfix">
                    <div className="col-md-3">
                      <div className="profileImageBlok">
                        <div
                          className="profile-card-img text-center"
                          id="profile-card-img"
                        >
                          {/* {
                            imageUploadLoading?
                              <div className="loader">
                                <img src={Heart} alt="All Cures Logo" id="heart"/>
                              </div>
                            : null
                          } */}
                          <h1 style={{ display: "none" }}>
                            All Cures is a product developed, managed and owned
                            by Etherium Technologies. Our mission is to make it
                            simple and convenient for users to get information
                            on Cures from anywhere in the world. Our belief is
                            that your wellness is your well-being. We are
                            passionate about giving our users the unique
                            experience that is both fulfilling and wholesome.
                          </h1>
                          <h2 style={{ display: "none" }}>
                            Ayurveda, Homeopathy, Chinese Medicine, Persian,
                            Unani
                          </h2>
                          {items.imgLoc ? (
                            <>
                              <img
                                alt={items.firstName}
                                src={`https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-180,h-230,f-webp${items.imgLoc}`}
                              />
                            </>
                          ) : (
                            <i class="fas fa-user-md fa-6x"></i>
                          )}
                        </div>
                        {this.state.items.videoService === 1 && (
                          <button
                            type="button"
                            className="btn btn-primary border-0"
                            data-toggle="modal"
                            onClick={() => this.consult()}
                            data-target="#exampleModal"
                            style={{
                              backgroundColor: "#00415e",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <VideocamRoundedIcon />
                            Consult Now
                          </button>
                        )}

                        {this.props.match.params.id.split("-")[0] === userId ||
                        userAccess == 9 ? (
                          <>
                            <label for="fileInput" className="image-edit-icon">
                              <i className="fas fa-edit fa-2x"></i>
                            </label>
                            <input
                              id="fileInput"
                              type="file"
                              name="file"
                              onChange={this.changeHandler}
                              required
                            />
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-9">
                      <div className="profile-info">
                        <div className="profile-infoL-card">
                          <div className="profile-info-name" id="DocDetails">
                            <div className="h4 font-weight-bold">
                              {items.prefix} {items.firstName}{" "}
                              {items.middleName} {items.lastName}{" "}
                              {/* Show average rating */}
                              {this.state.ratingValue ? (
                                <div
                                  className=" mt-2 mb-4"
                                  id="doctor-avg-rating"
                                >
                                  <span class="fa fa-star opacity-7"></span>
                                  <span class="fa fa-star opacity-7"></span>
                                  <span class="fa fa-star opacity-7"></span>
                                  <span class="fa fa-star opacity-7"></span>
                                  <span class="fa fa-star opacity-7"></span>
                                </div>
                              ) : null}
                            </div>
                            <div className="h5 text-capitalize">
                              <i class="fas fa-award pr-1"></i>
                              {/* {items.Primary_Spl.toLowerCase()} */}
                              {items.primarySpl}
                            </div>
                            <div className="h5 ">{items.experience}</div>

                            <div className="h5 text-capitalize">
                              <i class="fas fa-hospital pr-1"></i>
                              {items.hospitalAffiliated} {items.country}
                            </div>

                            <div></div>
                          </div>
                        </div>
                        <div className="rating-reviews">
                          <div className="profile-info-rating">
                            <h2>
                              <form className="rating"></form>
                            </h2>
                          </div>
                          <div className="reviews">
                            {userAccess === "9" ||
                            parseInt(userId) ===
                              parseInt(
                                this.props.match.params.id.split("-")[0]
                              ) ? (
                              <Button
                                variant="dark"
                                onClick={() => this.setModalShow(true)}
                              >
                                Edit Profile
                              </Button>
                            ) : null}

                            {this.state.show && (
                              <Test
                                show={true}
                                onHide={() => this.setState({ show: false })}
                              />
                            )}

                             {/* <div
                              className="modal"
                              id="exampleModal"
                              tabindex="0"
                              role="dialog"
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >  */}
                              {userId && (
                                <AppointmentModal
                                  show={this.state.showAppointmentModal}
                                  onHide={() =>
                                    this.setState({
                                      showAppointmentModal: false,
                                    })
                                  }
                                  unbookedSlots={this.state.unbookedSlots}
                                  disableDate={this.disableDate}
                                  onDateChange={this.handleDatesChange}
                                  onBookAppointment={(timeSlot) =>
                                    this.handleTimeSlot(timeSlot)
                                  }
                                  bookingLoading={this.state.bookingLoading}
                                  alertBooking={this.state.alertBooking}
                                  docId={this.state.docid}
                                  userId={userId}
                                />
                              )}
                            {/* </div> */}

                            <EditProfile
                              show={this.state.modalShow}
                              onHide={() => this.setModalShow(false)}
                              items={items}
                              fetchDoctor={this.fetchDoctorData}
                              id={this.props.match.params.id.split("-")[0]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabs
                    defaultActiveKey="about"
                    id="doctorTabs"
                    className="mt-4 mb-4 d-flex "
                  >
                    <Tab.Pane
                      eventKey="about"
                      title={
                        <span className="px-3 py-2 d-inline-block">
                          <i className="fas fa-info-circle mr-2"></i> About
                        </span>
                      }
                    >
                      <div className="p-4">
                        <div className="h4 font-weight-bold mb-4">
                          About {items.prefix} {items.firstName}{" "}
                          {items.middleName} {items.lastName}
                        </div>
                        <div id="about-contain" className="pl-3">
                          {items.about ? (
                            <p className="text one">
                              {items.about.includes("•")
                                ? items.about.split("•").map((i, idx) => (
                                    <li key={idx} className="mb-2">
                                      {i}
                                    </li>
                                  ))
                                : items.about}
                            </p>
                          ) : (
                            <p>No information available.</p>
                          )}
                          {items.websiteUrl ? (
                            <a
                              href={items.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="h6 mt-3 d-inline-block"
                            >
                              {items.websiteUrl}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane
                      eventKey="education"
                      title={
                        <span className="px-3 py-2 d-inline-block">
                          <i className="fas fa-graduation-cap mr-2"></i>{" "}
                          Education
                        </span>
                      }
                    >
                      <div className="p-4">
                        <div className="abt-eduction">
                          <div className="h4 font-weight-bold mb-4">
                            Education
                          </div>
                          <div className="pl-3">
                            {items.degDesc ? (
                              items.degDesc
                            ) : (
                              <p>No information available.</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-5">
                          <div className="h4 font-weight-bold mb-4">
                            Accomplishments
                          </div>
                          <div className="pl-3">
                            {items.awards ? (
                              items.awards.split("•").map((award, idx) => (
                                <li key={idx} className="mb-2">
                                  {award}
                                </li>
                              ))
                            ) : (
                              <p>No information available.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane
                      eventKey="miscellaneous"
                      title={
                        <span className="px-3 py-2 d-inline-block">
                          <i className="fas fa-map-marker-alt mr-2"></i>{" "}
                          Miscellaneous
                        </span>
                      }
                    >
                      <div className="p-4">
                        <div className="abt-eduction">
                          <div className="h4 font-weight-bold mb-4">
                            Miscellaneous
                          </div>
                          <div className="pl-3">
                            {items.city ||
                            items.state ||
                            items.country ||
                            items.gender ? (
                              <>
                                {items.city && (
                                  <div className="h6 font-weight-bold mb-3">
                                    City:{" "}
                                    <span className="font-weight-normal">
                                      {items.city}
                                    </span>
                                  </div>
                                )}
                                {items.state && (
                                  <div className="h6 font-weight-bold mb-3">
                                    State:{" "}
                                    <span className="font-weight-normal">
                                      {items.state}
                                    </span>
                                  </div>
                                )}
                                {items.country && (
                                  <div className="h6 font-weight-bold mb-3">
                                    Country:{" "}
                                    <span className="font-weight-normal">
                                      {items.country}
                                    </span>
                                  </div>
                                )}
                                {items.gender && (
                                  <div className="h6 font-weight-bold mb-3">
                                    Gender:{" "}
                                    <span className="font-weight-normal">
                                      {items.gender === 2 ? "Male" : "Female"}
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <p>No information available.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane
                      eventKey="services"
                      title={
                        <span className="px-3 py-2 d-inline-block">
                          <i className="fas fa-stethoscope mr-2"></i> Services
                          Offered
                        </span>
                      }
                    >
                      <div className="p-4">
                        <div className="about-specialties">
                          <div className="h4 font-weight-bold mb-4">
                            Specialties
                          </div>
                          <div className="pl-3">
                            {items.primarySpl || items.otherSpecializations ? (
                              <>
                                {items.primarySpl && (
                                  <ul className="list-unstyled">
                                    <li className="mb-2">{items.primarySpl}</li>
                                  </ul>
                                )}
                                {items.otherSpecializations && (
                                  <ul className="list-unstyled">
                                    <li className="mb-2">
                                      {items.otherSpecializations}
                                    </li>
                                  </ul>
                                )}
                              </>
                            ) : (
                              <p>No information available.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tabs>

                  {userAccess ? (
                    <>
                      {this.state.rating.length === 0 ? (
                        <span className="h5 mt-3">
                          {" "}
                          You feedback is valuable to us, Please rate here...{" "}
                        </span>
                      ) : (
                        <p className="h5 mt-3">
                          Your Earlier Rated {this.state.rating}{" "}
                          <span className="icon-star-1"></span>
                          <br />
                          Rate Again,
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="h5 mt-3">Rate here</div>
                  )}
                  <div id="">
                    <Rating
                      docid={this.props.match.params.id.split("-")[0]}
                      ratingVal={this.state.rating}
                    />
                  </div>

                  {userId && items.chatService == 1 && userAccess != 1 ? (
                    <>
                      {console.log("loc", items.imgLoc)}
                      {items.imgLoc ? (
                        <Chat
                          imageURL={items.imgLoc}
                          items={items}
                          docid={this.state.docid}
                        />
                      ) : (
                        <Chat
                          dummy={<i class="fas fa-user-sm "></i>}
                          items={items}
                          docid={items.docID}
                        />
                      )}
                    </>
                  ) : null}

                  <div className="comment-box">
                    {userId ? (
                      <>
                        <Comment
                          refreshComments={this.getComments}
                          docid={this.props.match.params.id.split("-")[0]}
                        />
                      </>
                    ) : null}
                  </div>

                  {/* SHOW ALL COMMENTS */}
                  <div className="main-hero">
                    {!this.state.showMore
                      ? this.state.comment
                          .slice(0, 3)
                          .map((item, i) => this.showComments(item, i))
                      : this.state.comment.map((item, i) =>
                          this.showComments(item, i)
                        )}
                  </div>
                  {this.state.comment
                    ? this.state.comment.length > 3 && (
                        <button
                          id="show-hide-comments"
                          className="white-button-shadow btn w-100"
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
                <div className="col-md-4">
                  <div
                    className="profile-card doctors-article d-flex flex-column hideScroll"
                    style={{ overflowY: " auto", maxHeight: "960px" }}
                  >
                    <div className="h5 font-weight-bold mb-3">
                      {/* No cures By Dr. {items.docname_first} {items.docname_middle} {items.docname_last} yet */}
                      <div className="text-center">Explore Cures</div>
                    </div>
                    {this.state.articleItems
                      ? this.state.articleItems.map((i, index) => (
                          <AllPost
                            id={i.article_id}
                            title={i.title}
                            f_title={i.friendly_name}
                            w_title={i.window_title}
                            type={i.type}
                            content={decodeURIComponent(
                              i.content
                                ? i.content.includes("%22%7D%7D%5D%7D")
                                  ? i.content
                                  : i.content.replace("%7D", "%22%7D%7D%5D%7D")
                                : null
                            )}
                            // type = {i.type}
                            published_date={i.published_date}
                            over_allrating={i.over_allrating}
                            // country = {i.country_id}
                            imgLocation={i.content_location}
                            // history = {props.history}
                          />
                        ))
                      : null}

                    {this.state.articleItems.length > 0 && (
                      <div className="d-grid mt-3 mb-5 text-center">
                        <button
                          onClick={this.allPosts}
                          type="button"
                          className="btn btn-danger"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="chat">
            <div className="container">
              <div className="row">
                <div className="">
                  {" "}
                  <a href="//#">
                    {" "}
                    <span className="icon-chatbot">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                      <span className="path5"></span>
                      <span className="path6"></span>
                      <span className="path7"></span>
                      <span className="path8"></span>
                      <span className="path9"></span>
                      <span className="path10"></span>
                      <span className="path11"></span>
                      <span className="path12"></span>
                      <span className="path13"></span>
                      <span className="path14"></span>
                      <span className="path15"></span>
                      <span className="path16"></span>
                      <span className="path17"></span>
                      <span className="path18"></span>
                      <span className="path19"></span>
                    </span>{" "}
                  </a>{" "}
                </div>
              </div>
            </div>
          </section>
          <div></div>
          {/* <div
            className="modal fade bd-example-modal-lg"
            tabindex="-1"
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
                              <img src={Doct} alt="doct" />
                            </div>
                            <div className="btn-Gropu">
                              <a href="/#" className="appBTN">
                                App Store
                              </a>
                              <a href="/#" className="appBTN">
                                App Store
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div> */}
          <Footer />
        </div>
      );
    }
  }
}

export default Profile;
export { ServerDay };
