import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Rating from "../StarRating";
import "../../assets/healthcare/css/main.css";
import "../../assets/healthcare/css/responsive.css";

import "../../assets/healthcare/icomoon/style.css";
import { Container, Button } from "react-bootstrap";
import axios from "axios";
import EditProfile from "./EditProfile";
import { backendHost } from "../../api-config";
import Comment from "../Comment";
import "../../assets/healthcare/css/mobile.css";

import { userId } from "../UserId";
import { userAccess } from "../UserAccess";
import AllPost from "../BlogPage/Allpost";
import Heart from "../../assets/img/heart.png";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import HelmetMetaData from "../HelmetMetaData";
import { imagePath } from "../../image-path";
import Chat from "./Chat";
import { Tabs, Tab } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faEdit,
  faGraduationCap,
  faHospital,
  faInfoCircle,
  faMapMarkerAlt,
  faStethoscope,
  faStar,
  faUser,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";

import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import AppointmentModal from "../../features/BookAppointment";

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.primary.contrastText,
  },
}));

const ServerDay = (props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !outsideCurrentMonth && highlightedDays.includes(day.format("YYYY-MM-DD"));

  return (
    <HighlightedDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      selected={isSelected}
    />
  );
};

const Profile = (props) => {
  const historyHook = useHistory();
  const params = useParams();
  const doctorParamId = props.match?.params?.id || params.id;
  const doctorId = doctorParamId?.split("-")[0];
  const history = props.history || historyHook;

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [items, setItems] = useState([]);
  const [articleItems, setArticleItems] = useState([]);
  const [comment, setComment] = useState([]);
  const [ratingValue, setRatingValue] = useState("");
  const [rating, setRating] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [docid, setDocid] = useState(null);
  const [initial, setInitial] = useState(4);
  const selectedDocId = docid || doctorId;

  const showAlertMessage = useCallback((msg) => {
    setShowAlert(true);
    setAlertMsg(msg);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, []);

  const changeHandler = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 1048576) {
      showAlertMessage("Image should be less than 1MB!");
      return;
    }
    setSelectedFile(file);
    handleImageSubmission(file);
  };

  const handleImageSubmission = (fileParam) => {
    const fileToUpload = fileParam || selectedFile;
    if (!fileToUpload || !doctorId) {
      return;
    }
    const formData = new FormData();
    formData.append("File", fileToUpload);
    fetch(`${backendHost}/dashboard/imageupload/doctor/${doctorId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        showAlertMessage("Image uploaded successfully.");
      })
      .catch(() => {
        return;
      });
  };

  const allPosts = (limit) => {
    if (!doctorId) {
      return;
    }
    const fetchLimit = limit ?? initial;
    fetch(
      `${backendHost}/article/authallkv/reg_type/1/reg_doc_pat_id/${doctorId}?offset=0&limit=${fetchLimit}`
    )
      .then((res) => res.json())
      .then((json) => {
        var temp = [];
        json.forEach((i) => {
          if (i.pubstatus_id === 3) {
            temp.push(i);
          }
        });
        setArticleItems(temp);
        setInitial((prevInitial) => prevInitial + 4);
      })
      .catch(() => {
        return;
      });
  };

  const getComments = (id) => {
    axios
      .get(`${backendHost}/rating/target/${id}/targettype/1`)
      .then((res) => {
        var temp = [];
        res.data.forEach((i) => {
          if (i.reviewed === 1 && i.comments !== "null") {
            temp.push(i);
          }
        });
        setComment(temp);
      })
      .catch(() => {
        return;
      });
  };

  const showComments = (item) => {
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

  const getRating = (docId) => {
    axios
      .get(`${backendHost}/rating/target/${docId}/targettype/1/avg`)
      .then((res) => {
        setRatingValue(res.data);
      })
      .catch(() => {
        return;
      });
  };

  const getRate = (docId) => {
    axios
      .get(
        `${backendHost}/rating/target/${docId}/targettype/1?userid=${userId}`
      )
      .then((res) => {
        setRating(res.data[0].ratingVal);
      })
      .catch(() => {
        return;
      });
  };

  const fetchDoctorData = (id) => {
    fetch(`${backendHost}/DoctorsActionController?DocID=${id}&cmd=getProfile`)
      .then((res) => res.json())
      .then((json) => {
        setIsLoaded(true);
        setItems(json);
        setDocid(json.docID);
      });
  };

  const showRating = useCallback((val) => {
    if (document.getElementById("doctor-avg-rating")) {
      for (let i = 0; i < val; i++) {
        document
          .getElementById("doctor-avg-rating")
          .children[i].classList.add("checked");
      }
    }
  }, []);

  const consult = () => {
    setShowAppointmentModal(true);
  };

  useEffect(() => {
    if (ratingValue) {
      const timer = setTimeout(() => {
        showRating(ratingValue);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [ratingValue, showRating]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!doctorId) {
      return;
    }
    setInitial(4);
    fetchDoctorData(doctorId);
    getComments(doctorId);
    getRating(doctorId);
    getRate(doctorId);
    allPosts(4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  if (!isLoaded) {
    return (
      <>
        <Header history={history} />
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
        <Header history={history} />
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
          canonicalUrl={`https://www.all-cures.com/profile/${items.docID}-${items.firstName}-${items.lastName}`}
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
        <Header history={history} />

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
                          simple and convenient for users to get information on
                          Cures from anywhere in the world. Our belief is that
                          your wellness is your well-being. We are passionate
                          about giving our users the unique experience that is
                          both fulfilling and wholesome.
                        </h1>
                        <h2 style={{ display: "none" }}>
                          Ayurveda, Homeopathy, Chinese Medicine, Persian, Unani
                        </h2>
                        {items.imgLoc ? (
                          <>
                            <img
                              alt={items.firstName}
                              src={`https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-150,h-200,f-webp${items.imgLoc}`}
                            />
                          </>
                        ) : (
                          <FontAwesomeIcon icon={faUserMd} size="6x" />
                        )}
                      </div>
                      {items.videoService === 1 && (
                        <button
                          type="button"
                          className="btn btn-primary border-0 mt-2"
                          data-toggle="modal"
                          onClick={() => consult()}
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

                      {doctorId === userId || userAccess == 9 ? (
                        <>
                          <label htmlFor="fileInput" className="image-edit-icon">
                            <FontAwesomeIcon icon={faEdit} size="2x" />
                          </label>
                          <input
                            id="fileInput"
                            type="file"
                            name="file"
                            onChange={changeHandler}
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
                            {items.prefix} {items.firstName} {items.middleName}{" "}
                            {items.lastName} {/* Show average rating */}
                            {ratingValue ? (
                              <div
                                className=" mt-2 mb-4"
                                id="doctor-avg-rating"
                              >
                                {[...Array(5)].map((_, idx) => (
                                  <FontAwesomeIcon
                                    key={`avg-star-${idx}`}
                                    icon={faStar}
                                    className="opacity-7 mr-1"
                                  />
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <div className="h5 text-capitalize">
                            <FontAwesomeIcon
                              icon={faAward}
                              className="pr-1"
                            />
                            {items.primarySpl}
                          </div>
                          <div className="h5 ">{items.experience}</div>

                          <div className="h5 text-capitalize">
                            <FontAwesomeIcon
                              icon={faHospital}
                              className="pr-1"
                            />
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
                          parseInt(userId) === parseInt(doctorId) ? (
                            <Button variant="dark" onClick={() => setModalShow(true)}>
                              Edit Profile
                            </Button>
                          ) : null}

                          {/* <div
                              className="modal"
                              id="exampleModal"
                              tabindex="0"
                              role="dialog"
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >  */}
                      
                            <AppointmentModal
                              show={showAppointmentModal}
                              onHide={() => setShowAppointmentModal(false)}
                              docId={docid}
                    
                            />
                        
                          {/* </div> */}

                          <EditProfile
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            items={items}
                            fetchDoctor={fetchDoctorData}
                            id={doctorId}
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
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="mr-2"
                        />{" "}
                        About
                      </span>
                    }
                  >
                    <div className="p-4">
                      <div className="h4 font-weight-bold mb-4">
                        About {items.prefix} {items.firstName} {items.middleName}{" "}
                        {items.lastName}
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
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="mr-2"
                        />{" "}
                        Education
                      </span>
                    }
                  >
                    <div className="p-4">
                      <div className="abt-eduction">
                        <div className="h4 font-weight-bold mb-4">Education</div>
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
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="mr-2"
                        />{" "}
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
                        <FontAwesomeIcon
                          icon={faStethoscope}
                          className="mr-2"
                        />{" "}
                        Services Offered
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
                    {rating.length === 0 ? (
                      <span className="h5 mt-3">
                        {" "}
                        You feedback is valuable to us, Please rate here...{" "}
                      </span>
                    ) : (
                      <p className="h5 mt-3">
                        Your Earlier Rated {rating}{" "}
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
                  <Rating docid={doctorId} ratingVal={rating} />
                </div>

                {userId && items.chatService == 1 && userAccess != 1 ? (
                  <>
                    {items.imgLoc ? (
                      <Chat
                        imageURL={items.imgLoc}
                        items={items}
                        docid={docid}
                      />
                    ) : (
                      <Chat
                        dummy={<FontAwesomeIcon icon={faUser} size="sm" />}
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
                        refreshComments={getComments}
                        docid={doctorId}
                      />
                    </>
                  ) : null}
                </div>

                {/* SHOW ALL COMMENTS */}
                <div className="main-hero">
                  {!showMore
                    ? comment.slice(0, 3).map((item) => showComments(item))
                    : comment.map((item) => showComments(item))}
                </div>
                {comment
                  ? comment.length > 3 && (
                      <button
                        id="show-hide-comments"
                        className="white-button-shadow btn w-100"
                        onClick={() => {
                          showMore ? setShowMore(false) : setShowMore(true);
                        }}
                      >
                        {!showMore ? "Show more" : "Hide"}
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
                  {articleItems
                    ? articleItems.map((i) => (
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
                          published_date={i.published_date}
                          over_allrating={i.over_allrating}
                          imgLocation={i.content_location}
                        />
                      ))
                    : null}

                  {articleItems.length > 0 && (
                    <div className="d-grid mt-3 mb-5 text-center">
                      <button
                        onClick={() => allPosts(initial)}
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
        <Footer />
      </div>
    );
  }
};

export default Profile;
export { ServerDay };
