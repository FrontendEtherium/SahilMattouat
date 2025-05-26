import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Select, MenuItem } from "@material-ui/core";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../BlogPage/tools";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Input from "@material-ui/core/Input";

import { Checkbox, FormControlLabel } from "@material-ui/core";
import { backendHost } from "../../api-config";
import CenterWell from "../Disease/CenterWell";
import { userId } from "../UserId";
import { userAccess } from "../UserAccess";
import { Modal } from "react-bootstrap";
import Heart from "../../assets/img/heart.png";
import { imagePath } from "../../image-path";
import axiosInstance from "../../axiosInstance";

const EditModal = (props) => {
  const editId = useParams();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [articleDisplay, setArticleDisplay] = useState("");
  const [contentType, setContentType] = useState("");
  const [type, setType] = useState([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [copyright, setCopyright] = useState("");
  const [language, setLanguage] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [medicineList, setMedicineList] = useState([]);
  const [author, setAuthor] = useState([]);
  const [country, setCountry] = useState("");
  const [win, setWin] = useState("");
  const [articleStatus, setArticleStatus] = useState();
  const [editedBy, setEditedBy] = useState(0);
  const [disease, setDisease] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [diseaseList, setDiseaseList] = useState([]);
  const [lanList, setLanList] = useState([]);
  const [authList, setAuthList] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [disclaimerId, setDisclaimerId] = useState([]);
  const [comment, setComment] = useState("");
  // const [show, setShow] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [lgShow, setLgShow] = useState(false);
  const [smShow, setSmShow] = useState(false);

  const [image, setImage] = useState(null);
  const [contentSmall, setContentSmall] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [afterSubmitLoad, setafterSubmitLoad] = useState(false);
  const [jsonValid, setJsonValid] = useState(false);

  const [updateSubscribers, setUpdateSubscribers] = useState(false);
  const [featuredArticle, setFeaturedArticle] = useState("");

  const [selectedFile, setSelectedFile] = useState();

  const [isFilePicked, setIsFilePicked] = useState(false);

  const [path, setPath] = useState("");
  const [intro, setIntro] = useState("");

  const [description, setDescription] = useState("");

  function Alert(msg) {
    setShowAlert(true);
    setAlertMsg(msg);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }

  const getPosts = () => {
    axios.defaults.withCredentials = true;
    axiosInstance
      .get(`/article/${editId.id}`, {
        headers: { "Access-Control-Allow-Credentials": true },
      })
      .then((res) => {
        setEditedBy(res.data.edited_by);
        setAuthor(JSON.parse(res.data.authored_by));
        setTitle(res.data.title);
        setDisclaimer(res.data.disclaimer_id);
        setCopyright(res.data.copyright_id);
        setLanguage(res.data.language_id);
        setWin(res.data.window_title);
        setArticleStatus(res.data.pubstatus_id);
        setArticleDisplay(res.data.friendly_name);
        setType(res.data.type);
        setFeaturedArticle(res.data.type);
        setContentType(res.data.content_type);
        setFeaturedArticle(res.data.featured_article);
        setCountry(res.data.country_id);
        setDisease(res.data.disease_condition_id);
        setComment(res.data.comments);
        setMedicineType(res.data.medicine_type);
        setKeywords(res.data.keywords);
        setContentSmall(decodeURIComponent(res.data.content_small));
        setArticleContent(JSON.parse(decodeURIComponent(res.data.content)));
        setPath(
          res.data.content_location.replace("json", "png").split("/webapps/")[1]
        );
        setIntro(res.data.introduction);
        setDescription(res.data.description);
      })
      .catch((err) => {
        return;
      });
  };

  const token = localStorage.getItem("token");

  const singlePostEdit = (e) => {
    e.preventDefault();
    setafterSubmitLoad(true);
    if (parseInt(articleStatus) === 3) {
      const headers = {
        Authorization: `Bearer ${token} `,
        "Content-Type": "application/json",
      };
      axios
        .post(
          `${backendHost}/article/update/${editId.id}`,
          {
            title: title,
            description: description,
            introduction: intro,
            friendly_name: articleDisplay,
            // "subheading": "1",,
            content_type: contentType,
            type: type,
            // "keywords": "1",
            window_title: win,
            // "content_location": "1",
            authored_by: author,
            published_by: parseInt(userId),
            // "edited_by": 1,
            // "copyright_id": parseInt(copyright),
            // "disclaimer_id": parseInt(disclaimer),
            copyright_id: 11,
            disclaimer_id: 1,
            pubstatus_id: parseInt(articleStatus),
            medicine_type: parseInt(medicineType),
            language_id: parseInt(language),
            articleContent: encodeURIComponent(JSON.stringify(articleContent)),
            country_id: parseInt(country),
            keywords: keywords,
            comments: comment,
            disease_condition_id: disease,
            update_subscribers: updateSubscribers,
            featured_article: featuredArticle,
            content_small: encodeURIComponent(contentSmall),
          },
          {
            headers: headers,
          }
        )
        .then((res) => {
          setafterSubmitLoad(false);
          if (res.data === 1) {
            Alert("Updated article successfully.");
          } else {
            Alert("Some error occured. Try again later");
          }
          // setSuccMsg('Updated Successfully')
        })
        .catch((res) => {
          setafterSubmitLoad(false);
          Alert("Some error occured. Try again later");
        });
    } else {
      const headers = {
        Authorization: `Bearer ${token} `,
        "Content-Type": "application/json",
      };
      axios
        .post(
          `/article/update/${editId.id}`,
          {
            title: title,
            description: description,
            introduction: intro,
            friendly_name: articleDisplay,
            // "subheading": "1",
            content_type: contentType,
            type: type,
            // "keywords": "1",
            window_title: win,
            // "content_location": "1",
            authored_by: author,
            // "published_by": 1,
            edited_by: parseInt(userId),
            // "copyright_id": parseInt(copyright),
            // "disclaimer_id": parseInt(disclaimer),
            disease_condition_id: disease,
            copyright_id: 11,
            disclaimer_id: 1,
            pubstatus_id: parseInt(articleStatus),
            medicine_type: parseInt(medicineType),
            language_id: parseInt(language),
            articleContent: encodeURIComponent(JSON.stringify(articleContent)),
            comments: comment,
            keywords: keywords,
            country_id: parseInt(country),
            update_subscribers: updateSubscribers,
            featured_article: featuredArticle,
            content_small: encodeURIComponent(contentSmall),
          },
          {
            headers: headers,
          }
        )
        .then((res) => {
          setafterSubmitLoad(false);
          if (res.data === 1) {
            Alert("Updated article successfully.");
          } else {
            Alert("Some error occured. Try again later");
          }
        })
        .catch((err) => {
          setafterSubmitLoad(false);
          Alert("Some error occured. Try again later");
        });
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const checkAccess = (stat) => {
    if (
      parseInt(userAccess) === 9 ||
      [author].includes(userId) ||
      parseInt(editedBy) === parseInt(userId) ||
      parseInt(userAccess) === 4 ||
      parseInt(userAccess) === 7
    ) {
      return null;
    } else if (stat === 2 && parseInt(userAccess) === 7) {
      return null;
    } else {
      document.getElementById("article-submit").disabled = true;
      window.alert("Restricted Access!!");
    }
  };

  const getLanguages = () => {
    axiosInstance
      .get(`/article/all/table/languages`)

      .then((res) => {
        setLanList(res.data);
      })
      .catch((err) => {
        return;
      });
  };

  const getMedicine = () => {
    axiosInstance
      .get(`/article/all/table/medicinetype`)
      .then((res) => {
        setMedicineList(res.data);
      })
      .catch((err) => {
        return;
      });
  };

  const getAuthor = () => {
    axiosInstance
      .get(`/article/all/table/author`)
      .then((res) => {
        setAuthList(res.data);
      })
      .catch((err) => {
        return;
      });
  };

  const getCountries = () => {
    axiosInstance
      .get(`/article/all/table/countries`)
      .then((res) => {
        setCountriesList(res.data);
      })
      .catch((err) => {
        return;
      });
  };

  const getDisclaimer = () => {
    axiosInstance
      .get(`/article/all/table/disclaimer`)
      .then((res) => {
        setDisclaimerId(res.data);
      })
      .catch((err) => {
        return;
      });
  };
  const getDisease = () => {
    axiosInstance
      .get(`/article/all/table/disease_condition`)
      .then((res) => {
        setDiseaseList(res.data);
      })
      .catch((err) => {
        return;
      });
  };

  const onAuthorChange = (e) => {
    if (author.includes(e.target.value)) {
      return null;
    } else {
      setAuthor(e.target.value);
    }
  };

  useEffect(() => {
    if (editId.id) {
      getPosts();
    }
    getLanguages();
    getAuthor();
    getCountries();
    getDisclaimer();
    getDisease();
    getMedicine();
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    if (author !== undefined && parseInt(editedBy) !== 0) {
      checkAccess(articleStatus, author, editedBy);
    }
    // eslint-disable-next-line
  }, [articleStatus]);

  const instanceRef = useRef(null);

  const handleSelect = function (e, c) {
    const ctype = [];
    for (let i = 0; i < c.length; i++) {
      ctype.push(c[i].value);
    }
    setType(ctype);
  };

  const handleSelectFeatured = function (e) {
    const selectedOption = e.target.value;
    setFeaturedArticle(selectedOption);
  };

  const sanitizer = (input) => {
    const output = {
      ...input,
      blocks: input.blocks.map((block) => {
        if (block.type === "link") {
          return {
            ...block,
            data: {
              ...block.data,
              target: "_blank",
            },
          };
        }
        return block;
      }),
    };
    return output;
  };

  const submitArticleForm = async (e) => {
    setafterSubmitLoad(true);
    e.preventDefault();
    axios.defaults.withCredentials = true;

    axios
      .post(
        `${backendHost}/article/create/new`,
        {
          title: title,
          description: description,
          introduction: intro,
          friendlyName: articleDisplay,
          contentType: contentType,
          type: type,
          // "keywords": "1",
          winTitle: win,
          // "content_location": "1",
          authById: author.length !== 0 ? author : [],
          // "published_by": 1,
          // "copyright_id": parseInt(copyright),
          // "disclaimer_id": parseInt(disclaimer),
          copyId: 11,
          disclaimerId: 1,
          diseaseConditionId: disease,
          medicine_type: parseInt(medicineType),
          articleStatus: articleStatus ? articleStatus : 2,
          language: parseInt(language),
          articleContent: encodeURIComponent(JSON.stringify(articleContent)),
          comments: comment,
          keywords: keywords,
          countryId: country,
          featured_article: featuredArticle,
        },
        {
          headers: {
            Authorization: `Bearer ${token} `, // Assuming Bearer token
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setafterSubmitLoad(false);
        if (parseInt(res.data) === 1) {
          Alert("Cure created successfully! Wait for approval 😄");
        } else if (res.data === -2) {
          Alert("Overview of this disease already exists.");
        } else if (res.data === -3) {
          Alert("Article's Title already exists! Please change the title.");
        } else {
          Alert("Some error occured! Please try again later.");
        }
      })
      .catch((err) => {
        setafterSubmitLoad(false);
        Alert("Some error occured! Please try again later.");
      });
  };
  const handleImageSubmission = () => {
    // e.preventDefault()
    const formData = new FormData();
    formData.append("File", selectedFile);
    fetch(`${backendHost}/dashboard/imageupload/article/${editId.id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        Alert("Image uploaded successfully.");
        setIsFilePicked(true);
      })
      .catch((error) => {
        return;
      });
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    handleImageSubmission();
  }, [selectedFile]);

  async function handleSave() {
    const savedData = await instanceRef.current.save();
    setArticleContent(savedData);
  }

  function IsJsonValid(str) {
    try {
      var json = JSON.parse(str);
      if (typeof json === "object") setJsonValid(true);
    } catch (e) {
      setJsonValid(false);
    }
  }
  // send Update checkbox handler
  const handleMessage = (event) => {
    setUpdateSubscribers(event.target.checked);
  };

  useEffect(() => {
    IsJsonValid(contentSmall);
  }, [contentSmall]);
  return (
    <>
      {props.search === "?article" ? null : <Header history={history} />}
      {showAlert && (
        <div className="alert alert-success pop-up border-bottom">
          <div className="h5 mb-0 text-center">{alertMsg}</div>
          <div className="timer"></div>
        </div>
      )}
      {afterSubmitLoad && (
        <div className="loader main on-submit-loading">
          <img src={Heart} alt="All Cures Logo" id="heart" />
        </div>
      )}
      <div className="transparent_bg">
        <div className="container">
          <div className="card">
            <h2 className="mainTitle text-center h3 py-3 card-header">Cure</h2>
            <div className="card-body">
              <form
                action=""
                onSubmit={(e) => {
                  editId.id ? singlePostEdit(e) : submitArticleForm(e);
                  // handleSave()
                }}
              >
                <div id="accordion">
                  <div className="card">
                    <div
                      className="card-header"
                      id="headingOne"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <h5 className="mb-0">Cure Details</h5>
                    </div>

                    <div
                      id="collapseOne"
                      className="collapse show"
                      aria-labelledby="headingOne"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6 form-group">
                            <label htmlFor="">Title</label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter title"
                              className="form-control"
                              required
                            />
                          </div>

                          <div className="col-lg-6 form-group">
                            <label htmlFor="">
                              Enter Keyword Introduction (Optional)
                            </label>
                            <input
                              type="text"
                              value={intro}
                              onChange={(e) => setIntro(e.target.value)}
                              placeholder="Enter keyword"
                              className="form-control"
                            />
                          </div>
                          {parseInt(userAccess) === 7 ||
                          parseInt(userAccess) === 9 ? (
                            <>
                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Cure Display Name</label>
                                <input
                                  type="text"
                                  value={articleDisplay}
                                  onChange={(e) =>
                                    setArticleDisplay(e.target.value)
                                  }
                                  placeholder="Enter title"
                                  className="form-control"
                                />
                              </div>

                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Content Type</label>
                                <select
                                  name="contentType"
                                  placeholder="Content Type"
                                  value={contentType}
                                  onChange={(e) => {
                                    setContentType(e.target.value);
                                  }}
                                  required
                                  className="form-control"
                                >
                                  <option>Open this select menu</option>
                                  <option value="article">Article</option>
                                  <option value="video">Video</option>
                                </select>
                              </div>

                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Type</label>
                                <select
                                  multiple
                                  name="type"
                                  placeholder="Type"
                                  value={type}
                                  onChange={(e) => {
                                    handleSelect(e, e.target.selectedOptions);
                                  }}
                                  required
                                  className="form-control"
                                >
                                  <option value="1">Overview</option>
                                  <option value="2">Treatment</option>
                                  <option value="3">Symptoms</option>
                                </select>
                              </div>

                              {/* <div className="col-lg-6 form-group">
                    <label htmlFor="">Disclaimer ID</label>
                    <select name="" value={disclaimer}  onChange={(e) => setDisclaimer(e.target.value)} className="form-control" id="">
                    <option>Open this select menu</option>
                        {disclaimerId.map((lan) => {
                            return (
                                <option value={lan[0]}>{lan[0]}</option>
                            )
                        })}
                    </select>
                    
                </div>
                <div className="col-lg-6 form-group">
                    <label htmlFor="">Copyright ID</label>
                    <select name="" value={copyright}  onChange={(e) => setCopyright(e.target.value)} className="form-control" id="">
                    <option>Open this select menu</option>
                        <option value="11">Temporary</option>
                    </select>
                    
                </div> */}
                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Cure Status</label>
                                <select
                                  name=""
                                  value={articleStatus}
                                  onChange={(e) =>
                                    setArticleStatus(e.target.value)
                                  }
                                  className="form-control"
                                  id=""
                                >
                                  <option>Open this select menu</option>
                                  <option value="1">Work in Progress</option>
                                  <option value="2">Review</option>
                                  {editId.id ? (
                                    <option value="3">Publish</option>
                                  ) : null}
                                </select>
                              </div>
                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Language</label>
                                <select
                                  value={language}
                                  name=""
                                  onChange={(e) => setLanguage(e.target.value)}
                                  className="form-control"
                                  id=""
                                >
                                  <option>Open this select menu</option>
                                  {lanList.map((lan) => {
                                    return (
                                      <option value={lan[0]}>{lan[1]}</option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Type Of Medicine</label>
                                <select
                                  value={medicineType}
                                  name=""
                                  onChange={(e) =>
                                    setMedicineType(e.target.value)
                                  }
                                  className="form-control"
                                  id=""
                                >
                                  <option>Open this select menu</option>
                                  {medicineList.map((lan) => {
                                    return (
                                      <option value={lan[0]}>{lan[1]}</option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Disease and Conditions</label>
                                <select
                                  value={disease}
                                  name=""
                                  onChange={(e) => setDisease(e.target.value)}
                                  className="form-control"
                                  id=""
                                >
                                  <option>Open this select menu</option>

                                  {diseaseList.map((lan) => {
                                    //const selected = (optionState === option.value) ? selected : false;
                                    //lan[7] it has parent child relationship value
                                    if (lan[7]) {
                                      return (
                                        <option
                                          style={{ paddingLeft: "50px" }}
                                          value={lan[0]}
                                        >
                                          &nbsp;&nbsp;{lan[3]}
                                        </option>
                                      );
                                    } else {
                                      return (
                                        <option
                                          style={{ fontWeight: "bold" }}
                                          value={lan[0]}
                                        >
                                          {lan[3]}
                                        </option>
                                      );
                                    }
                                  })}
                                </select>
                              </div>

                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Author</label>
                                <Select
                                  multiple
                                  value={author}
                                  onChange={(e) => onAuthorChange(e)}
                                  input={<Input id="select-multiple-chip" />}
                                  // MenuProps={MenuProps}
                                  placeholder="Select Author"
                                  className="form-control"
                                >
                                  {authList.map((lan) => {
                                    return (
                                      <MenuItem key={lan[0]} value={lan[0]}>
                                        {lan[1] + " " + lan[3]}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </div>

                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Sources</label>
                                <textarea
                                  value={win}
                                  onChange={(e) => setWin(e.target.value)}
                                  placeholder="Enter title"
                                  className="form-control"
                                />
                              </div>

                              <div className="col-lg-6 form-group">
                                <label htmlFor="">Description</label>
                                <textarea
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  placeholder="Enter Description"
                                  className="form-control"
                                />
                              </div>
                              {type ? (
                                type.indexOf("2") === -1 ? null : (
                                  <div className="form-group col-lg-6">
                                    <label htmlFor="">Country</label>
                                    <select
                                      name="country"
                                      value={country}
                                      onChange={(e) =>
                                        setCountry(e.target.value)
                                      }
                                      placeholder="Country"
                                      required=""
                                      className="form-control"
                                    >
                                      <option>Select Country</option>
                                      {countriesList.map((c) => {
                                        return (
                                          <option value={c[0]}>{c[1]}</option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                )
                              ) : null}
                              <div className="col-md-6 float-left">
                                <label>Keywords</label>
                                <input
                                  className="form-control"
                                  value={keywords}
                                  // defaultValue={about}
                                  onChange={(e) => setKeywords(e.target.value)}
                                  name="keywords"
                                  as="textarea"
                                  placeholder="Enter Keywords here"
                                  // style={{ height: '100px' }}
                                />
                              </div>
                              {editId.id ? (
                                <div
                                  className="col-md-6 float-left"
                                  style={{ zIndex: 2 }}
                                >
                                  <input
                                    type="file"
                                    name="file"
                                    onChange={changeHandler}
                                  />

                                  {isFilePicked ? (
                                    <div>
                                      <img
                                        src={`${imagePath}/${path}?d=${parseInt(
                                          Math.random() * 10000
                                        )}`}
                                        width={500}
                                      />
                                    </div>
                                  ) : (
                                    <p>Select a file to show details</p>
                                  )}
                                </div>
                              ) : null}
                            </>
                          ) : null}

                          <div className="col-md-6 float-left">
                            <label>Remarks</label>
                            <input
                              className="form-control"
                              value={comment}
                              // defaultValue={about}
                              onChange={(e) => setComment(e.target.value)}
                              name="comments"
                              as="textarea"
                              placeholder="Leave a comment here"
                            />
                          </div>

                          <div className="col-lg-6 form-group">
                            <label htmlFor="">Featured Article</label>
                            <select
                              multiple
                              name="featured"
                              placeholder="Featured"
                              value={featuredArticle}
                              onChange={handleSelectFeatured}
                              className="form-control"
                            >
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div
                      className="card-header collapsed"
                      id="headingTwo"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      <h5 className="mb-0">Write Cure Here</h5>
                    </div>
                    <div
                      id="collapseTwo"
                      className="collapse"
                      aria-labelledby="headingTwo"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {articleContent.time && (
                          <EditorJs
                            onChange={handleSave}
                            data={articleContent}
                            // enableReInitialize = {true}
                            instanceRef={(instance) =>
                              (instanceRef.current = instance)
                            }
                            tools={EDITOR_JS_TOOLS}
                            sanitizer={sanitizer}
                          />
                        )}
                        {articleContent === "" ? (
                          <EditorJs
                            onChange={handleSave}
                            instanceRef={(instance) =>
                              (instanceRef.current = instance)
                            }
                            tools={EDITOR_JS_TOOLS}
                            sanitizer={sanitizer}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                {/* {succMsg ? <h4 className="mt-3 alert alert-success">{succMsg}</h4> : null} */}
                <FormControlLabel
                  label=" I certify that i am at least 13years old and I have read and  "
                  checked
                  control={<Checkbox name="Terms" value="on" required />}
                  required
                />
                <FormControlLabel
                  label="   Accept Terms & Conditions"
                  checked
                  control={<Checkbox name="Terms" value="on" required />}
                  required
                  onClick={() => setSmShow(true)}
                />
                <Modal
                  size="lg"
                  show={smShow}
                  onHide={() => setSmShow(false)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title
                      id="example-modal-sizes-title-lg"
                      className="container"
                    >
                      <b> Terms And Conditions Of Use</b>
                    </Modal.Title>
                  </Modal.Header>
                  <hr />
                  <Modal.Body>
                    <h2 className="cols__main-title cols__main-title--top container">
                      PLEASE READ THESE TERMS AND CONDITIONS OF USE CAREFULLY
                      BEFORE USING THIS SITE.
                    </h2>
                    <br />
                    <p className="p1 container">
                      By using this site, you signify your assent to these Terms
                      and Conditions. If you do not agree to all of these Terms
                      and Conditions, do not use this site!
                      <br />
                      Etherium Technologies, the owner and publisher of
                      All-cures.com ("AC") may revise and update these Terms and
                      Conditions at any time. Your continued usage of the
                      all-cures.com website ("AC Site," or the "Site,") will
                      mean you accept those changes.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      The Site Does Not Provide Medical Advice
                    </h2>
                    <p className="p1 container">
                      The contents of the All-cures.com Site, such as text,
                      graphics, images, and other materials created by Etherium
                      Technologies or obtained from Etherium Technologies’
                      licensors, and other materials contained on the
                      All-cures.com Site (collectively, "Content") are for
                      informational purposes only. The Content is not intended
                      to be a substitute for professional medical advice,
                      diagnosis, or treatment. Always seek the advice of your
                      physician or other qualified health provider with any
                      questions you may have regarding a medical condition.
                      Never disregard professional medical advice or delay in
                      seeking it because of something you have read on the
                      All-cures.com Site!
                      <br />
                      If you think you may have a medical emergency, call your
                      doctor or Emergency immediately. All-cures.com does not
                      recommend or endorse any specific tests, physicians,
                      products, procedures, opinions, or other information that
                      may be mentioned on the Site. Reliance on any information
                      provided by all-cures.com, all-cures.com employees, others
                      appearing on the Site at the invitation of all-cures.com,
                      or other visitors to the Site is solely at your own risk.
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      Children's Privacy
                    </h2>
                    <p className="p1 container">
                      We are committed to protecting the privacy of children.
                      You should be aware that this Site is not intended or
                      designed to attract children under the age of 13. We do
                      not collect personally identifiable information from any
                      person we actually know is a child under the age of 13.
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      Use of the Content
                    </h2>
                    <p className="p1 container">
                      The Content posted on this Site is protected by the
                      copyright laws inIndia and in foreign countries.
                      All-cures.com authorizes you to view or download a single
                      copy of the Content solely for your personal,
                      non-commercial use if you include the copyright notice
                      located at the end of the material, for example: "©2016,
                      All-cures.com. All rights reserved" and other copyright
                      and proprietary rights notices that are contained in the
                      Content. Any special rules for the use of certain software
                      and other items accessible on the All-cures.com Site may
                      be included elsewhere within the Site and are incorporated
                      into these Terms and Conditions by reference.
                      <br />
                      Title to the Content remains with All-cures.com or its
                      licensors. Any use of the Content not expressly permitted
                      by these Terms and Conditions is a breach of these Terms
                      and Conditions and may violate copyright, trademark, and
                      other laws. Content and other features are subject to
                      change or termination without notice in the editorial
                      discretion of All-cures.com. All rights not expressly
                      granted herein are reserved to All-cures.com and its
                      licensors.
                      <br />
                      If you violate any of these Terms and Conditions, your
                      permission to use the Content automatically terminates and
                      you must immediately destroy any copies you have made of
                      any portion of the Content.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Liability of All-cures.com and Its Licensors
                    </h2>
                    <p className="p1 container">
                      The use of the All-cures.com Site and the Content is at
                      your own risk.
                      <br />
                      When using the All-cures.com Site, information will be
                      transmitted over a medium that may be beyond the control
                      and jurisdiction of All-cures.com and its suppliers.
                      Accordingly, All-cures.com assumes no liability for or
                      relating to the delay, failure, interruption, or
                      corruption of any data or other information transmitted in
                      connection with use of the All-cures.com Site.
                      <br />
                      The All-cures.com Site and the Content are provided on an
                      "as is" basis. All-cures.com, ITS LICENSORS, AND ITS
                      SUPPLIERS, TO THE FULLEST EXTENT PERMITTED BY LAW,
                      DISCLAIM ALL WARRANTIES, EITHER EXPRESS OR IMPLIED,
                      STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE
                      IMPLIED WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT OF
                      THIRD PARTIES' RIGHTS, AND FITNESS FOR PARTICULAR PURPOSE.
                      Without limiting the foregoing, All-cures.com, its
                      licensors, and its suppliers make no representations or
                      warranties about the following:
                      <br />
                      1. The accuracy, reliability, completeness, currentness,
                      or timeliness of the Content, software, links, or
                      communications provided on or through the use of the
                      All-cures.com Site or All-cures.com.
                      <br />
                      2. The satisfaction of any government regulations
                      requiring disclosure of information on prescription drug
                      products or the approval or compliance of any software
                      tools with regard to the Content contained on the
                      All-cures.com Site.
                      <br />
                      In no event shall All-cures.com, its licensors, its
                      suppliers, or any third parties mentioned on the
                      All-cures.com Site be liable for any damages (including,
                      without limitation, incidental and consequential damages,
                      personal injury/wrongful death, lost profits, or damages
                      resulting from lost data or business interruption)
                      resulting from the use of or inability to use the
                      All-cures.com Site or the Content, whether based on
                      warranty, contract, tort, or any other legal theory, and
                      whether or not All-cures.com , its licensors, its
                      suppliers, or any third parties mentioned on the
                      All-cures.com Site are advised of the possibility of such
                      damages. All-cures.com, its licensors, its suppliers, or
                      any third parties mentioned on the All-cures.com Site are
                      not liable for any personal injury, including death,
                      caused by your use or misuse of the Site, Content, or
                      Public Areas (as defined below).{" "}
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      User Content and Submissions
                    </h2>
                    <p className="p1 container">
                      The personal information you submit to AllCures-Info.com
                      is governed by the All-cures.com Privacy Policy. To the
                      extent there is an inconsistency between this Agreement
                      and the All-cures.com Privacy Policy, this Agreement shall
                      govern.
                      <br />
                      The Site contains functionality and other interactive
                      areas, including blogs, user reviews and comments on
                      information, user reviews on the Physician Directory, etc.
                      (collectively "Public Areas") that allow users to post or
                      upload content and other information, including comments,
                      images, questions, reviews, and other materials (the “User
                      Content”). Users may also upload User Content via our
                      official brand presence on social media platforms and
                      branded hashtags, including, without limitation Facebook,
                      Twitter, Google Plus, YouTube, Instagram, and Pinterest,
                      (collectively "Social Media Platforms"). You agree that
                      you will not post, upload, or transmit any communications
                      or User Content of any type to the Public Areas or Social
                      Media Platforms that infringe or violate any rights of any
                      party. By submitting communications or User Content to the
                      Public Areas or Social Media Platforms, you agree to
                      comply with these Terms and Conditions and other
                      applicable polices, such as our Reviews Guidelines.
                      All-cures.com reserves the right to remove User Content
                      for any reason, including User Content that we believe
                      violates these Terms and Conditions or our other policies,
                      such as our Reviews Guidelines. By submitting any
                      communications or User Content to the Public Areas or
                      Social Media Platforms, you further agree that such
                      submission is non-confidential for all purposes. It is
                      important to note that All-cures.com is not responsible
                      for the operation, terms of use or policies of any Social
                      Media Platform. Before using any Social Media Platform you
                      should review its terms of use and policies, including its
                      privacy policy.
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      User Submissions — Image, Video, Audio Files
                    </h2>
                    <p className="p1 container">
                      You agree to only post or upload media (like photos,
                      videos, or audio) on the All-cures.comSite or a Social
                      Media Platform that you have taken yourself or that you
                      have all rights to transmit and license and which do not
                      violate trademark, copyright, privacy, or any other rights
                      of any other person. Photos or videos of celebrities and
                      cartoon or comic images are usually copyrighted by the
                      owner.
                      <br />
                      To protect your privacy, you agree that you will not
                      submit any media that contains Personally Identifiable
                      Information (like name, phone number, email address or web
                      site URL) of you or of anyone else. Uploading media like
                      images or video of other people without their permission
                      is strictly prohibited.
                      <br />
                      By uploading any media on the All-cures.com Site or a
                      Social Media Platform, you warrant that you have
                      permission from all persons appearing in your media for
                      you to make this contribution and grant rights described
                      herein. Never post a picture or video of or with someone
                      else unless you have their explicit permission.
                      <br />
                      It is strictly prohibited to upload media of any kind that
                      contain expressions of hate, abuse, offensive images or
                      conduct, obscenity, pornography, sexually explicit or any
                      material that could give rise to any civil or criminal
                      liability under applicable law or regulations or that
                      otherwise may be in conflict with these Terms and
                      Conditions, or the All-cures.com Privacy Policy.
                      <br />
                      You agree that you will not upload any material that
                      contains software viruses or any other computer code,
                      files or programs designed to interrupt, destroy or limit
                      the functionality of any computer software or this Web
                      site.
                      <br />
                      By uploading any media on the All-cures.comSite or a
                      Social Media Platform like a photo or video: (a) you grant
                      to All-cures.com a perpetual, irrevocable, non-exclusive,
                      worldwide, royalty-free, fully sublicensable right and
                      license to use, copy, print, publicly display, reproduce,
                      modify, publish, post, transmit, create derivative works
                      from, and distribute the media and any material included
                      in the media; (b) you certify that any person pictured in
                      the submitted media (or, if a minor, his/her parent/legal
                      guardian) authorizes All-cures.com to use, copy, print,
                      publicly display, reproduce, modify, publish, post,
                      transmit, create derivative works from, and distribute the
                      media and any material included in such media; and (c) you
                      agree to indemnify All-cures.com and its affiliates,
                      directors, officers and employees and hold them harmless
                      from any and all claims and expenses, including attorneys'
                      fees, arising from the media and/or your failure to comply
                      with these Terms and Conditions.
                      <br />
                      All-cures.com reserves the right to review all media prior
                      to submission to the site and to remove any media for any
                      reason, at any time, without prior notice, at our sole
                      discretion.
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      Passwords
                    </h2>
                    <p className="p1 container">
                      All-cures.com has several tools that allow you to record
                      and store information. You are responsible for taking all
                      reasonable steps to ensure that no unauthorized person
                      shall have access to your All-cures.com passwords or
                      accounts. It is your sole responsibility to: (1) control
                      the dissemination and use of sign-in name, screen name and
                      passwords; (2) authorize, monitor, and control access to
                      and use of your All-cures.com account and password; (3)
                      promptly inform All-cures.com if you believe your account
                      or password has been compromised or if there is any other
                      reason you need to deactivate a password. To send us an
                      email, use the "Contact Us" links located at the bottom of
                      every page of our site. You grant All-cures.com and all
                      other persons or entities involved in the operation of the
                      Site the right to transmit, monitor, retrieve, store, and
                      use your information in connection with the operation of
                      the Site. All-cures.com cannot and does not assume any
                      responsibility or liability for any information you
                      submit, or your or third parties' use or misuse of
                      information transmitted or received using All-cures.com
                      tools and services.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Advertisements, Searches, and Links to Other Sites
                    </h2>
                    <p className="p1 container">
                      All-cures.com may provide links to third-party web sites.
                      All-cures.com also may select certain sites as priority
                      responses to search terms you enter and All-cures.com may
                      agree to allow advertisers to respond to certain search
                      terms with advertisements or sponsored content.
                      All-cures.com does not recommend and does not endorse the
                      content on any third-party websites. All-cures.com is not
                      responsible for the content of linked third-party sites,
                      sites framed within the All-cures.com Site, third-party
                      sites provided as search results, or third-party
                      advertisements, and does not make any representations
                      regarding their content or accuracy. Your use of
                      third-party websites is at your own risk and subject to
                      the terms and conditions of use for such sites.
                      All-cures.com does not endorse any product, service, or
                      treatment advertised on the All-cures.com Site.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Jurisdiction
                    </h2>
                    <p className="p1 container">
                      You expressly agree that exclusive jurisdiction for any
                      dispute with All-cures.com, or in any way relating to your
                      use of the All-cures.com Site, resides in the courts of
                      Jammu (India) and you further agree and expressly consent
                      to the exercise of personal jurisdiction in the courts of
                      Jammu (India) in connection with any such dispute
                      including any claim involving All-cures.com or its
                      affiliates, subsidiaries, employees, contractors,
                      officers, directors, telecommunication providers, and
                      content providers.
                      <br />
                      These Terms and Conditions are governed by the internal
                      substantive laws of the Union Territory of J&K, without
                      respect to its conflict of laws principles. If any
                      provision of these Terms and Conditions is found to be
                      invalid by any court having competent jurisdiction, the
                      invalidity of such provision shall not affect the validity
                      of the remaining provisions of these Terms and Conditions,
                      which shall remain in full force and effect. No waiver of
                      any of these Terms and Conditions shall be deemed a
                      further or continuing waiver of such term or condition or
                      any other term or condition.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Complete Agreement
                    </h2>
                    <p className="p1 container">
                      Except as expressly provided in a particular "legal
                      notice" on the All-cures.com Site, these Terms and
                      Conditions and the All-cures.com Privacy Policy constitute
                      the entire agreement between you and All-cures.com with
                      respect to the use of the All-cures.com Site, and Content.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Thank you for your cooperation. We hope you find the
                      All-cures.com Site helpful and convenient to use!{" "}
                    </h2>
                  </Modal.Body>
                </Modal>

                <FormControlLabel
                  control={<Checkbox name="Policy" value="on" required />}
                  label="Privacy Policy"
                  checked
                  required
                  onClick={() => setLgShow(true)}
                />

                {parseInt(userAccess) === 7 || parseInt(userAccess) === 9 ? (
                  <FormControlLabel
                    control={<Checkbox name="message" value="on" />}
                    label="Send Update to Subscribers"
                    checked={updateSubscribers}
                    onClick={handleMessage}
                  />
                ) : null}

                <Modal
                  size="lg"
                  show={lgShow}
                  onHide={() => setLgShow(false)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg" container>
                      <b> Privacy Policy</b>
                    </Modal.Title>
                  </Modal.Header>
                  <hr />
                  <Modal.Body>
                    <h2 className="cols__main-title cols__main-title--top container">
                      Introduction
                    </h2>

                    <p className="p1 container">
                      Welcome to All-Cures. Etherium Technologies hereinafter
                      called as ETPL (“us”, “we”, or “our”) operates
                      <a href="https://www.all-cures.com">
                        {" "}
                        www.all-cures.com{" "}
                      </a>
                      (hereinafter referred to as “Service”). Our Privacy Policy
                      governs your visit to{" "}
                      <a href="https://www.all-cures.com">
                        www.all-cures.com,
                      </a>{" "}
                      and explains how we collect, safeguard and disclose
                      information that results from your use of our Service. We
                      use your data to provide and improve Service. By using
                      Service, you agree to the collection and use of
                      information in accordance with this policy. Unless
                      otherwise defined in this Privacy Policy, the terms used
                      in this Privacy Policy have the same meanings as in our
                      Terms and Conditions. Our Terms and Conditions (“Terms”)
                      govern all use of our Service and together with the
                      Privacy Policy constitutes your agreement with us
                      (“agreement”).
                    </p>
                    <br />

                    <h2
                      className="cols__main-title cols__main-title--top"
                      container
                    >
                      Definitions
                    </h2>

                    <p className="p1" container>
                      SERVICE means{" "}
                      <a href="https://www.all-cures.com">www.all-cures.com </a>
                      PERSONAL DATA means data about a living individual who can
                      be identified from those data (or from those and other
                      information either in our possession or likely to come
                      into our possession). USAGE DATA is data collected
                      automatically either generated by the use of Service or
                      from Service infrastructure itself (for example, the
                      duration of a page visit). COOKIES are small files stored
                      on your device (computer or mobile device). DATA
                      CONTROLLER means a natural or legal person who (either
                      alone or jointly or in common with other persons)
                      determines the purposes for which and the manner in which
                      any personal data are, or are to be, processed. For the
                      purpose of this Privacy Policy, we are a Data Controller
                      of your data. DATA PROCESSORS (OR SERVICE PROVIDERS) means
                      any natural or legal person who processes the data on
                      behalf of the Data Controller. We may use the services of
                      various Service Providers in order to process your data
                      more effectively. DATA SUBJECT is any living individual
                      who is the subject of Personal Data. THE USER is the
                      individual using our Service. The User corresponds to the
                      Data Subject, who is the subject of Personal Data.
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      Information Collection and Use
                    </h2>
                    <p className="p1 container">
                      We collect several different types of information for
                      various purposes to provide and improve our Service to
                      you.
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      Types of Data Collected
                    </h2>
                    <p className="p1 container">
                      <b>Personal Data</b>
                      <br />
                      While using our Service, we may ask you to provide us with
                      certain personally identifiable information that can be
                      used to contact or identify you (“Personal Data”).
                      Personally identifiable information may include, but is
                      not limited to:
                      <br />
                      • Email address
                      <br />
                      • First name and last name
                      <br />
                      • Cookies and Usage Data
                      <br />
                      We may use your Personal Data to contact you with
                      newsletters, marketing or promotional materials and other
                      information that may be of interest to you. You may opt
                      out of receiving any, or all, of these communications from
                      us by emailing us at{" "}
                      <a href="mailto:support@all-cures.com">
                        support@all-cures.com
                      </a>
                      .<br />
                      <b>Usage Data</b>
                      <br />
                      We may also collect information that your browser sends
                      whenever you visit our Service or when you access Service
                      by or through a mobile device (“Usage Data”).
                      <br />
                      This Usage Data may include information such as your
                      computer's Internet Protocol address (e.g. IP address),
                      browser type, browser version, the pages of our Service
                      that you visit, the time and date of your visit, the time
                      spent on those pages, unique device identifiers and other
                      diagnostic data.
                      <br />
                      When you access Service with a mobile device, this Usage
                      Data may include information such as the type of mobile
                      device you use, your mobile device unique ID, the IP
                      address of your mobile device, your mobile operating
                      system, the type of mobile Internet browser you use,
                      unique device identifiers and other diagnostic data.
                      <br />
                      <b>Tracking Cookies Data</b>
                      <br />
                      We use cookies and similar tracking technologies to track
                      the activity on our Service and we hold certain
                      information.
                      <br />
                      Cookies are files with a small amount of data which may
                      include an anonymous unique identifier. Cookies are sent
                      to your browser from a website and stored on your device.
                      Other tracking technologies are also used such as beacons,
                      tags and scripts to collect and track information and to
                      improve and analyze our Service.
                      <br />
                      You can instruct your browser to refuse all cookies or to
                      indicate when a cookie is being sent. However, if you do
                      not accept cookies, you may not be able to use some
                      portions of our Service.
                      <br />
                      Examples of Cookies we use:
                      <br />
                      • Session Cookies: We use Session Cookies to operate our
                      Service.
                      <br />
                      • Preference Cookies: We use Preference Cookies to
                      remember your preferences and various settings.
                      <br />
                      • Security Cookies: We use Security Cookies for security
                      purposes.
                      <br />
                      • Advertising Cookies: Advertising Cookies are used to
                      serve you with advertisements that may be relevant to you
                      and your interests.
                      <br />
                      • Use of Data
                      <br />
                      ETPL uses the collected data for various purposes:
                      <br />
                      • to provide and maintain our Service;
                      <br />
                      • to notify you about changes to our Service;
                      <br />
                      • to allow you to participate in interactive features of
                      our Service when you choose to do so;
                      <br />
                      • to provide customer support;
                      <br />
                      • to gather analysis or valuable information so that we
                      can improve our Service;
                      <br />
                      • to monitor the usage of our Service;
                      <br />
                      • to detect, prevent and address technical issues;
                      <br />
                      • to fulfill any other purpose for which you provide it;
                      <br />
                      • to carry out our obligations and enforce our rights
                      arising from any contracts entered into between you and
                      us, including for billing and collection;
                      <br />
                      • to provide you with notices about your account and/or
                      subscription, including expiration and renewal notices,
                      email-instructions, etc.;
                      <br />
                      • to provide you with news, special offers and general
                      information about other goods, services and events which
                      we offer that are similar to those that you have already
                      purchased or enquired about unless you have opted not to
                      receive such information;
                      <br />
                      • in any other way we may describe when you provide the
                      information;
                      <br />
                      • for any other purpose with your consent.
                      <br />
                      • Retention of Data
                      <br />
                      We will retain your Personal Data only for as long as is
                      necessary for the purposes set out in this Privacy Policy.
                      We will retain and use your Personal Data to the extent
                      necessary to comply with our legal obligations (for
                      example, if we are required to retain your data to comply
                      with applicable laws), resolve disputes, and enforce our
                      legal agreements and policies
                      <br />
                      We will also retain Usage Data for internal analysis
                      purposes. Usage Data is generally retained for a shorter
                      period, except when this data is used to strengthen the
                      security or to improve the functionality of our Service,
                      or we are legally obligated to retain this data for longer
                      time periods.
                    </p>
                    <br />

                    <h2 className="cols__main-title cols__main-title--top container">
                      Transfer of Data
                    </h2>
                    <p className="p1 container">
                      We will retain your Personal Data only for as long as is
                      necessary for the purposes set out in this Privacy Policy.
                      We will retain and use your Personal Data to the extent
                      necessary to comply with our legal obligations (for
                      example, if we are required to retain your data to comply
                      with applicable laws), resolve disputes, and enforce our
                      legal agreements and policies
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Disclosure of Data
                    </h2>
                    <p className="p1 container">
                      We may disclose personal information that we collect, or
                      you provide.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Disclosure for Law Enforcement.
                    </h2>
                    <p className="p1 container">
                      Under certain circumstances, we may be required to
                      disclose your Personal Data if required to do so by law or
                      in response to valid requests by public authorities.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Business Transaction.
                    </h2>
                    <p className="p1 container">
                      If we or our subsidiaries are involved in a merger,
                      acquisition or asset sale, your Personal Data may be
                      transferred.
                      <br />
                      Other cases. We may disclose your information also:
                      <br />
                      • to our subsidiaries and affiliates;
                      <br />
                      • for the purpose of including your company’s logo on our
                      website;
                      <br />
                      • Security of Data
                      <br />
                      The security of your data is important to us but remember
                      that no method of transmission over the Internet or method
                      of electronic storage is 100% secure. While we strive to
                      use commercially acceptable means to protect your Personal
                      Data, we cannot guarantee its absolute security.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Service Providers
                    </h2>
                    <p className="p1 container">
                      We may employ third party companies and individuals to
                      facilitate our Service (“Service Providers”), provide
                      Service on our behalf, perform Service-related services or
                      assist us in analyzing how our Service is used.
                      <br />
                      These third parties have access to your Personal Data only
                      to perform these tasks on our behalf and are obligated not
                      to disclose or use it for any other purpose.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Analytics
                    </h2>
                    <p className="p1 container">
                      We may use third-party Service Providers to monitor and
                      analyze the use of our Service.
                      <br />
                      Google Analytics
                      <br />
                      Google Analytics is a web analytics service offered by
                      Google that tracks and reports website traffic. Google
                      uses the data collected to track and monitor the use of
                      our Service. This data is shared with other Google
                      services. Google may use the collected data to
                      contextualise and personalise the ads of its own
                      advertising network.
                      <br />
                      For more information on the privacy practices of Google,
                      please visit the Google Privacy Terms web page:{" "}
                      <a
                        href="https://policies.google.com/privacy?hl=en
"
                      >
                        https://policies.google.com/privacy?hl=en
                      </a>
                      <br />
                      We also encourage you to review the Google's policy for
                      safeguarding your data:{" "}
                      <a href="https://support.google.com/analytics/answer/6004245">
                        https://support.google.com/analytics/answer/6004245
                      </a>
                      .
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Changes to This Privacy Policy
                    </h2>
                    <p className="p1 container">
                      We may update our Privacy Policy from time to time. We
                      will notify you of any changes by posting the new Privacy
                      Policy on this page.
                      <br />
                      We will let you know via email and/or a prominent notice
                      on our Service, prior to the change becoming effective and
                      update “effective date” at the top of this Privacy Policy.
                      <br />
                      You are advised to review this Privacy Policy periodically
                      for any changes. Changes to this Privacy Policy are
                      effective when they are posted on this page.
                    </p>
                    <br />
                    <h2 className="cols__main-title cols__main-title--top container">
                      Contact Us
                    </h2>
                    <p className="p1 container">
                      If you have any questions about this Privacy Policy,
                      please contact us:
                      <br />
                      By email:{" "}
                      <a href="mailto:support@all-cures.com">
                        support@all-cures.com
                      </a>
                      .<br />
                      By visiting this page on our website:{" "}
                      <a href="https://www.all-cures.com">www.all-cures.com</a>.
                    </p>
                  </Modal.Body>
                </Modal>
                <div className="form-group">
                  {editId.id && !jsonValid ? (
                    <button
                      type="submit"
                      id="article-submit"
                      className="btn mt-3 btn-dark"
                      disabled
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      type="submit"
                      id="article-submit"
                      className="btn mt-3 btn-dark"
                    >
                      Submit
                    </button>
                  )}
                  {/* <button 
                            type="submit" 
                            id="article-submit" 
                            className="btn mt-3 btn-dark"
                        >Submit</button> */}
                </div>
              </form>
              <div id="article-preview">
                {articleContent.time
                  ? articleContent.blocks.map((i) => (
                      <CenterWell
                        content={i.data.content}
                        type={i.type}
                        level={i.data.level}
                        text={i.data.text}
                        title={i.data.title}
                        message={i.data.message}
                        source={i.data.source}
                        embed={i.data.embed}
                        caption={i.data.caption}
                        alignment={i.data.alignment}
                        imageUrl={i.data.file ? i.data.file.url : null}
                        url={i.data.url}
                        link={i.data.link}
                      />
                    ))
                  : null}
              </div>
              {parseInt(userAccess) === 7 || parseInt(userAccess) === 9 ? (
                <>
                  <hr />
                  <div className="h5">Content JSON Preview</div>
                  <textarea
                    className="w-100"
                    value={contentSmall}
                    onChange={(e) => {
                      setContentSmall(e.target.value);
                      IsJsonValid(e.target.value);
                    }}
                  ></textarea>
                  JSON{" "}
                  {jsonValid ? (
                    <span className="text-success">Valid</span>
                  ) : (
                    <span className="text-danger">Invalid</span>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {props.search === "?article" ? null : <Footer />}
    </>
  );
};

export default EditModal;
