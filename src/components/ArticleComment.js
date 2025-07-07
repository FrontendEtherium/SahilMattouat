import React, { useState } from "react";
import axios from "axios";
import { backendHost } from "../api-config";
import { Button, Modal } from "react-bootstrap";
import { userId } from "./UserId";
import { userAccess } from "./UserAccess";

const Comment = ({ refreshComments, article_id }, props) => {
  const [cmtText, setCmtText] = React.useState("");
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(true);
  const [comment, setComment] = useState();
  const [afterSubmitLoad, setafterSubmitLoad] = useState(false);

  function Alert(msg) {
    setShowAlert(true);
    setAlertMsg(msg);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const postComment = (e) => {
    setafterSubmitLoad(true);

    e.preventDefault();

    if (cmtText !== "") {
      axios
        .post(
          `${backendHost}/DoctorRatingActionController?comments=${cmtText}&ratedbyid=${userId}&ratedbytype=${userAccess}&targetid=${article_id}&targetTypeid=2&cmd=rateAsset`
        )
        .then((res) => {
          if (res.data === 1) {
            setafterSubmitLoad(false);
            setShow(false);
            Alert("You have added your comment successfully!");
          } else {
            setafterSubmitLoad(false);

            Alert("Some error occured! Please try again later");
          }
        })
        .catch((err) => {
          setafterSubmitLoad(false);
          Alert("Some error occured! Please try again later");
        });
      comments();
    } else {
      setafterSubmitLoad(false);
      Alert("Enter comment");
    }
  };

  const comments = async (articleId) => {
    try {
      const response = await fetch(
        `${backendHost}/rating/target/${articleId}/targettype/2`
      );
      const data = await response.json();
      const filteredComments = data.filter(
        (item) => item.reviewed === 1 && item.comments !== "null"
      );

      // Update the state with the filtered comments
      setComment(filteredComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="alert alert-success pop-up border-bottom">
          <div className="h5 mb-0 text-center">{alertMsg}</div>
          <div className="timer"></div>
        </div>
      )}
      {afterSubmitLoad && (
        <div className="loader main on-submit-loading">
          <i className="fa fa-spinner fa-spin fa-10x" />
        </div>
      )}
      <Button
        className="btn-article-search"
        id="textComment"
        onClick={handleShow}
      >
        Review This Cure
      </Button>

      <Modal show={show} onHide={handleClose} className="rounded mt-5">
        <Modal.Header className="bg-review py-3" closeButton>
          <Modal.Title className="pl-4">Comment Here...</Modal.Title>
        </Modal.Header>

        <Modal.Body className="rounded">
          <div className="pl-4"></div>

          <div className="pl-4">
            <form
              action=""
              onSubmit={(e) => postComment(e)}
              className="form-group"
            >
              <textarea
                name=""
                onChange={(e) => {
                  setCmtText(e.target.value);
                }}
                className="form-control"
                id="comment"
                cols="30"
                rows="4"
              ></textarea>

              <div className="my-4">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default Comment;
