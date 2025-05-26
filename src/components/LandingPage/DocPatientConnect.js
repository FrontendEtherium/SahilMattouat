import React, { Component } from "react";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link, useParams } from "react-router-dom";
import { backendHost } from "../../api-config";
import { withRouter } from "react-router-dom";
import { userId } from "../UserId";
import { userAccess } from "../UserAccess";

import { Container, Button } from "react-bootstrap";

import dayjs from "dayjs";

import { subDays, isBefore, addDays } from "date-fns";
import DailyIframe from "@daily-co/daily-js";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  StaticDatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";

import { Modal, Alert } from "react-bootstrap";
import Heart from "../../assets/img/heart.png";
import Test from "./test";

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

class DocPatientConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      selectedTime: null,
      callFrame: null,
      videoLink: null,
      availStatus: null,
      value: dayjs(),
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
      data: [],
      originalData: [],
      filteredData: [], // Initialize filtered data state
      docID: "",
      isLoaded: false,
      items: [],
      modalShow: false,
      docId: "",
      searchQuery: "",
      showAlert: false,
      appointmentAlert: false,
      signInAlert: false,
      signInAlertDocId: null,
      amount: null,
    };
  }

  componentDidMount() {
    this.getFeaturedDoctors();
    this.fetchData();
  }

  bookAppn = (e) => {
    e.preventDefault();

    console.log("clicked booking");
    console.log("time", dayjs(this.state.selectedTime).format("HH:mm"));

    axios
      .post(`${backendHost}/appointments/create`, {
        docID: this.state.docId,
        userID: parseInt(userId),
        appointmentDate: this.state.selectedDate,
        startTime: this.state.selectedTimeSlot,
        paymentStatus: 0,
        amount: this.state.amount,
        currency: "INR",
      })
      .then((res) => {
        let enc = res.data;
        console.log("resppp", enc);
        const response = JSON.stringify(enc);

        const responseObject = JSON.parse(response);
        console.log("res", responseObject.encRequest);

        localStorage.setItem("encKey", responseObject.encRequest);
        localStorage.setItem("apiResponse", JSON.stringify(res.data));

        if (res.data.Count == 0) {
          this.setState({
            appointmentAlert: true,
          });
          setTimeout(() => {
            this.setState({
              appointmentAlert: false,
            });
          }, 6000);
        } else {
          const redirectURL =
            "https://www.all-cures.com/paymentRedirection" +
            `?encRequest=${responseObject.encRequest}` +
            `&accessCode=AVWN42KL59BP42NWPB`; // Your accessCode here

          // Redirecting to the URL
          window.location.href = redirectURL;
        }

        // If enc is a string, parse it to an object
        // if (typeof enc === 'string') {
        //     try {
        //         enc = JSON.parse(enc);
        //     } catch (error) {
        //         console.error('Error parsing enc:', error);
        //     }
        // }

        // Sending the modified payload
        // return fetch("https://test.ccavenue.com/transaction.do?command=initiateTransaction", {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON({
        //         encRequest: enc,
        //         accessCode: "AVKI05LC59AW25IKWA"
        //     })
        // });

        // const form = document.createElement('form');
        // form.setAttribute('method', 'post');
        // form.setAttribute('action', 'https://test.ccavenue.com/transaction.do?command=initiateTransaction');
        // form.style.display = 'none'; // Hide the form

        // // Create and append hidden input fields for encRequest and accessCode
        // const encRequestInput = document.createElement('input');
        // encRequestInput.setAttribute('type', 'hidden');
        // encRequestInput.setAttribute('name', 'encRequest');
        // encRequestInput.setAttribute('value', responseObject.encRequest);

        // const accessCodeInput = document.createElement('input');
        // accessCodeInput.setAttribute('type', 'hidden');
        // accessCodeInput.setAttribute('name', 'access_code');
        // accessCodeInput.setAttribute('value', 'AVNH05LB56CF25HNFC');
        // // accessCodeInput.setAttribute('value', 'AVWN42KL59BP42NWPB');

        // // Append input fields to the form
        // form.appendChild(encRequestInput);
        // form.appendChild(accessCodeInput);

        // // Append the form to the document body
        // document.body.appendChild(form);

        // // Submit the form
        // form.submit();
      });
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log("Response:", data);
    //     // Handle successful response data
    // })
    // .catch(error => {
    //     console.error("Fetch Error:", error);
    //     // Handle fetch error
    // });
  };

  getFeaturedDoctors = () => {
    // try {
    //   fetch(`${backendHost}/SearchActionController?cmd=getResults&FeaturedDoctors=901,903,905,872,907,923,873,894,885,874,941`)
    //   .then(res => res.json())
    //   .then(json => {
    //     this.setState({
    //       isLoaded: true,
    //       items: json.map.DoctorDetails.myArrayList,
    //     })
    //     console.log(this.state.items)
    //   })
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
  };

  handleProfileClick = () => {
    // Close the modal programmatically
    const modalElement = document.getElementById("exampleModalCenter");
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.hide();

    // Navigate to the doctor's profile
    const { docId } = this.state;
    window.location.href = `/doctor/${docId}`;
  };

  fetchData = async () => {
    try {
      const response = await fetch(`${backendHost}/video/get/doctors/list`);
      const json = await response.json();
      this.setState({
        data: json,
        filteredData: json,
        originalData: json,
        isLoaded: true,
      });
      console.log(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getDocId = async (id) => {
    console.log("doctorid", id);
    await new Promise((resolve) => {
      this.setState({ docId: id }, resolve);
    });

    this.fetchAvailStatus(this.state.docId);
    this.fetchAppointmentDetails(this.state.docId);

    axios.post(`${backendHost}/video/post/leads?userID=${userId}&docID=${id}`);
  };
  handleSearchInputChange = (event) => {
    this.setState({
      searchQuery: event.target.value,
      showAlert: false, // Hide alert on input change
    });
  };

  handleSearch = () => {
    const { searchQuery, originalData } = this.state;
    const filteredData = originalData.filter(
      (doctor) =>
        doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredData.length === 0) {
      this.setState({
        filteredData: originalData,
        showAlert: true,
      });

      setTimeout(() => {
        this.setState({
          showAlert: false,
        });
      }, 6000);
    } else {
      this.setState({
        filteredData,
        showAlert: false,
      });
    }
  };

  handleDatesChange = (newValue) => {
    this.setState({
      value: newValue,
      selectedDate: newValue.format("YYYY-MM-DD"), // Update selectedDate state
    });

    fetch(`${backendHost}/appointments/get/Slots/14485`)
      .then((res) => res.json())
      .then((json) => {
        console.log("response amount", json.amount);

        // Extract the totalDates from the JSON response
        const totalDates = json.totalDates;

        // Extract the first date from totalDates object
        const firstDate = Object.keys(totalDates)[0];

        // Extract the timeslots for the first date
        const timeslots = totalDates[firstDate];

        // console.log('Allslots',timeslots)
        // console.log(json.unbookedSlots,'unbooked')
        // console.log('selected state',this.state.selectedDate)

        const unbookedSlots = json.unbookedSlots[this.state.selectedDate] || [];

        // Check if unbookedSlots array is empty

        // if (unbookedSlots.length === 0) {
        //   console.log('No unbooked slots available for the selected date',this.state.selectedDate);
        // }

        // Set the state of unbookedSlots using the extracted unbooked slots
        this.setState({
          unbookedSlots: unbookedSlots,
          amount: json.amount,
        });
      });
  };

  handleTimeChange = (newTime) => {
    this.setState({ selectedTime: newTime });
  };

  handleTimeSlot = (time) => {
    this.setState({ selectedTimeSlot: time });
  };

  handleSignInAlert = (docID) => {
    this.setState({
      signInAlertDocId: docID,
      signInAlert: true,
    });
    setTimeout(() => {
      this.setState({
        signInAlert: false,
      });
    }, 5000);
  };

  fetchAvailStatus = (id) => {
    fetch(`${backendHost}/video/get/14485/availability`)
      // .then(res => JSON.parse(res))
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          availStatus: json,
        });
        // console.log('availStatus',this.state.availStatus)
        // console.log('availStatus',this.state.availStatus)
      });
  };

  fetchAppointmentDetails = (id) => {
    fetch(`${backendHost}/appointments/get/Slots/14485`)
      .then((res) => res.json())
      .then((json) => {
        // console.log('response',json)

        // Extract the totalDates from the JSON response
        //  const totalDates = json.totalDates;

        // Extract the first date from totalDates object
        const firstDate = Object.keys(json.totalDates)[0];

        // Extract the timeslots for the first date
        const timeslots = json.totalDates[firstDate];

        // console.log('Allslots',timeslots)
        // console.log(json.unbookedSlots,'unbooked')
        // console.log('selected state',this.state.selectedDate)
        //  console.log('Allslots',timeslots)
        //  console.log(json.unbookedSlots,'unbooked')
        //  console.log('selected state',this.state.selectedDate)

        const highlightedDate = json.completelyBookedDates;
        // console.log(highlightedDate,'highlighteddates')

        //  console.log(highlightedDate,'highlighteddates')

        // Set the state of timeslots using the extracted timeslots
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

        // Check if unbookedSlots array is empty
        // if (unbookedSlots.length === 0) {
        //   console.log('No unbooked slots available for the selected date',this.state.selectedDate);
        // }

        //  if (unbookedSlots.length === 0) {
        //    console.log('No unbooked slots available for the selected date',this.state.selectedDate);
        //  }

        // Set the state of unbookedSlots using the extracted unbooked slots
        this.setState({
          unbookedSlots: unbookedSlots,
        });
      });
  };

  render() {
    const { value, highlightedDays, filteredData, searchQuery } = this.state;
    const today = dayjs();

    const { selectedDate, selectedTime } = this.state;
    const sortedData = this.state.filteredData.sort(
      (a, b) => b.videoService - a.videoService
    );

    if (!this.state.isLoaded) {
      return (
        <>
          <Header history={this.props.history} />
          <div className="loader my-4">
            <img src={Heart} alt="All Cures Logo" id="heart" />
          </div>
          <Footer />
        </>
      );
    } else {
      return (
        <div>
          <Header history={this.props.history} />

          <div className="row ml-2 mt-5 d-flex justify-content-center">
            <div className="col-md-3">
              <input
                type="text"
                value={searchQuery}
                onChange={this.handleSearchInputChange}
                placeholder="Search Available Doctors"
                className="form-control "
              />
            </div>
            <div className="col-md-2 mt-2">
              <button className="btn btn-primary" onClick={this.handleSearch}>
                Search
              </button>
            </div>
          </div>

          {this.state.showAlert && (
            <div
              className="d-flex justify-content-center"
              style={{ width: "100%" }}
            >
              <div style={{ width: "50%" }} className="">
                <Alert variant="warning" className="h6 mx-3 text-center">
                  Doctor not found!!!
                </Alert>
              </div>
            </div>
          )}

          {sortedData &&
            sortedData.map((d) => {
              return (
                <div className="d-flex justify-content-center align-items-center">
                  <div
                    key={d.id}
                    className="card shadow-sm mt-2 mb-4 docPatientCard"
                  >
                    <div className="card-body">
                      {this.state.signInAlert &&
                        this.state.signInAlertDocId === d.docID && (
                          <div className="" style={{ width: "50%" }}>
                            <Alert
                              variant="warning"
                              className="h6 mx-3 text-center"
                            >
                              Sign in first to book an Appointment!!!
                            </Alert>
                          </div>
                        )}
                      <div className="d-flex align-items-center">
                        <div className="mr-5">
                          <div className="mb-2 bookings">
                            <p>
                              <span className="fw-bold">
                                Dr. {d.firstName} {d.lastName}
                              </span>
                            </p>
                          </div>
                          <div className="mb-2 bookings">
                            <p>{d.hospitalAffiliated}</p>
                          </div>
                          <div className="mb-2 bookings">
                            {!userId && (
                              <button
                                type="button"
                                className="btn btn-primary bg-dark"
                                onClick={() => this.handleSignInAlert(d.docID)}
                              >
                                Schedule
                              </button>
                            )}

                            {/* <Test
                              show={this.state.modalShow}
                              onHide={() => this.setState({ modalShow: false })}
                              backdrop={false} // Disable the dark background
                            /> */}

                            {
                              userId && d.videoService == 1 ? (
                                <button
                                  type="button"
                                  className="btn btn-primary bg-dark"
                                  data-toggle="modal"
                                  data-target="#exampleModal"
                                  onClick={() => this.getDocId(d.docID)}
                                >
                                  Schedule
                                </button>
                              ) : userId && d.videoService == 0 ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                  onClick={() => this.getDocId(d.docID)}
                                >
                                  Schedule
                                </button>
                              ) : null // You can replace `null` with any fallback UI or message if needed
                            }

                            {/* <button
                          type="button"
                          className="btn btn-primary bg-dark border-0 ml-2"
                          data-toggle="modal"
                          data-target="#exampleModal"
                        >
                          Schedule now
                        </button> */}
                            {/* <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModalCenter">
                               Book Now
                                   </button> */}

                            <div
                              class="modal fade"
                              id="exampleModalCenter"
                              tabindex="-1"
                              role="dialog"
                              aria-labelledby="exampleModalCenterTitle"
                              aria-hidden="true"
                            >
                              <div
                                class="modal-dialog modal-dialog-centered"
                                role="document"
                              >
                                <div class="modal-content">
                                  <div class="modal-header"></div>
                                  <div class="modal-body p-3">
                                    🚫 This doctor is not available right now.
                                    We will get back to you ASAP. Meanwhile,
                                    check the doctor's profile to read articles
                                    and know more about him. 📄👨‍⚕️
                                  </div>
                                  <div class="modal-footer">
                                    <button
                                      type="button"
                                      class="btn btn-secondary"
                                      data-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                    {/* <button
                                      type="button"
                                      class="btn btn-primary"
                                    >
                                      {" "}
                                      <Link
                                        to={`/doctor/${this.state.docId}`}
                                        className="text-white"
                                      >
                                        Go to Doctor's Profile
                                      </Link>
                                    </button> */}

                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={this.handleProfileClick}
                                    >
                                      Go to Doctor's Profile
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bookings-img text-center ml-auto  flex-end">
                          <i
                            className="fas fa-user-md fa-6x"
                            style={{ width: "100%", maxWidth: "100px" }}
                          ></i>
                        </div>

                        <div
                          class="modal fade"
                          id="exampleModal"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog" role="document">
                            <div
                              class="modal-content"
                              style={{ minWidth: "600px" }}
                            >
                              <div class="modal-header">
                                <h5
                                  class="modal-title p-3 font-weight-bold "
                                  id="exampleModalLabel"
                                >
                                  Schedule your Appointment
                                </h5>
                                <button
                                  type="button"
                                  class="close appn"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div
                                class="modal-body"
                                style={{ minHeight: "500px" }}
                              >
                                {/* <div className="d-flex">
                                   
                                  </div> */}

                                {/* <Calendar onChange={this.onChange} value={this.state.value} /> */}

                                {/* 
                                    <div style={this.calendarStyle}>
                                  <Calendar 
                                   onChange={this.state.date} 
                                   value={this.state.value}
                                   tileContent={this.tileContent}
                                 className="calButton"
                                    />

                                    </div>

                                  <p className='text-center'>
          <span className='bold'>Selected Date:</span>{' '}
          {this.state.date.toDateString()}
        </p> */}

                                <div className="row">
                                  <div className=" col-md-8">
                                    <LocalizationProvider
                                      dateAdapter={AdapterDayjs}
                                    >
                                      <DemoContainer
                                        components={[
                                          "DatePicker",
                                          "TimePicker",
                                        ]}
                                      >
                                        {/* <StaticDatePicker
    label="Select Date"
    value={selectedDate}
    onChange={this.handleDateChange}
    sx={{
        '.MuiPickersDay-root': {
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#2196f3',
            border: '1px solid',
            backgroundColor: '#bbdefb',
            '&:nth-child(even)': {
                backgroundColor: '#FFC0CB', // Example color for even days
            },
            '&:nth-child(odd)': {
                backgroundColor: '#87CEEB', // Example color for odd days
            },
        },
    }}
/> */}

                                        <StaticDatePicker
                                          defaultValue={today}
                                          minDate={today}
                                          maxDate={today.add(1, "month")}
                                          slots={{
                                            day: ServerDay,
                                          }}
                                          slotProps={{
                                            day: {
                                              highlightedDays,
                                            },
                                          }}
                                          onChange={this.handleDatesChange} // Add onChange to update selectedDate
                                          showToolbar={false}
                                          shouldDisableDate={this.disableDate}
                                          // renderDay={this.renderDay}
                                        />

                                        {/* <TimePicker
                                        label="Select Time"
                                        value={selectedTime}
                                        onChange={this.handleTimeChange}
                                        minutesStep={15}
                                      /> */}
                                      </DemoContainer>
                                    </LocalizationProvider>
                                  </div>
                                  <div className="col-sm-12 col-md-4 p-5">
                                    {this.state.selectedDate && (
                                      <>
                                        <p> Select Time Slot</p>

                                        {this.state.timeSlots &&
                                          this.state.timeSlots.map(
                                            (time, index) => {
                                              const isUnbooked =
                                                this.state.unbookedSlots.includes(
                                                  time
                                                );
                                              const isSelected =
                                                this.state.selectedTimeSlot ===
                                                time;

                                              // Parse the time slot to get hours and minutes
                                              const [hours, minutes] =
                                                time.split(":");

                                              // Get the current date and time
                                              const currentDate = new Date();
                                              const currentDateString =
                                                currentDate.toDateString();
                                              const currentTime =
                                                currentDate.getHours() * 60 +
                                                currentDate.getMinutes(); // Current time in minutes

                                              // Get the selected date
                                              const selectedDate = new Date(
                                                this.state.selectedDate
                                              );
                                              const selectedDateString =
                                                selectedDate.toDateString();

                                              // Check if the selected date is today
                                              const isToday =
                                                currentDateString ===
                                                selectedDateString;

                                              // Calculate the time slot in minutes
                                              const timeSlotTime =
                                                parseInt(hours) * 60 +
                                                parseInt(minutes);

                                              // Check if the time slot is for today and in the past
                                              const isPast =
                                                isToday &&
                                                timeSlotTime < currentTime;

                                              return (
                                                <div className="row pt-2">
                                                  <div col-md-6 className="">
                                                    <div
                                                      style={{
                                                        minWidth: "100px",
                                                      }}
                                                    >
                                                      <Button
                                                        variant={
                                                          isSelected
                                                            ? "primary"
                                                            : isUnbooked
                                                            ? "outline-primary"
                                                            : "outline-danger"
                                                        }
                                                        disabled={
                                                          !isUnbooked || isPast
                                                        }
                                                        className="w-100 d-block"
                                                        onClick={() =>
                                                          this.handleTimeSlot(
                                                            time
                                                          )
                                                        }
                                                      >
                                                        {time}
                                                      </Button>
                                                      {/* onClick={()=>this.handleTimeSlot(time)} */}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  {this.state.amount && (
                                    <p
                                      className="ml-4 my-2"
                                      style={{ fontSize: "18px" }}
                                    >
                                      Consultation Fee: Rs {this.state.amount}{" "}
                                    </p>
                                  )}
                                  {this.state.selectedDate && (
                                    <p
                                      className="ml-4 my-2"
                                      style={{ fontSize: "18px" }}
                                    >
                                      Date:{" "}
                                      {dayjs(this.state.selectedDate).format(
                                        "YYYY-MM-DD"
                                      )}
                                    </p>
                                  )}

                                  {this.state.selectedTimeSlot && (
                                    <p
                                      className="ml-4 my-2"
                                      style={{ fontSize: "18px" }}
                                    >
                                      Time:{this.state.selectedTimeSlot}
                                      {/* {dayjs(selectedTime).format("HH:mm")} */}
                                    </p>
                                  )}
                                </div>

                                {this.state.selectedTimeSlot && (
                                  <Button
                                    variant="dark"
                                    onClick={this.bookAppn}
                                    className="p-2 m-4"
                                  >
                                    Book Appointment
                                  </Button>
                                )}
                                {/* <Button
                                variant="dark"
                                onClick={this.payment}
                                className="p-2 m-4"
                              >
                                Pay Now
                              </Button> */}

                                {this.state.bookingLoading ? (
                                  <Alert variant="danger" className="h6 mx-3">
                                    Please wait while we book your Appointment!!
                                  </Alert>
                                ) : null}

                                {this.state.appointmentAlert ? (
                                  <Alert variant="success" className="h6 mx-3">
                                    Booked successfully!! Check your Email.
                                  </Alert>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          <Footer />
        </div>
      );
    }
  }
}

export default withRouter(DocPatientConnect);
