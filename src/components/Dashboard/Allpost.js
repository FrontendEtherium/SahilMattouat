import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { backendHost } from "../../api-config";
import axiosInstance from "../../axiosInstance";
import { createArticlePath } from "../../utils/slugUtils";

const AllPost = ({ id, title, w_title, dis, pubstatus_id }) => {
  console.log(pubstatus_id);
  if (parseInt(dis) === 0) dis = true;
  else dis = false;
  const [disable, setDisable] = React.useState(dis);
  const [deleteAlert, setAlert] = useState(false);

  const singlePostDelete = (id) => {
    axiosInstance
      .delete(`/article/${id}`)
      .then((res) => {
        singlePostDelete();
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      })
      .then((err) => {
        return;
      })
      .catch((err) => {
        return;
      });
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="card" style={{ background: "ghostwhite" }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link
                  to={createArticlePath(id, title)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <h5 className="card-title mb-1 p-0">{title}</h5>
                </Link>
                <div className="card-info">
                  <div className="h6">{w_title}</div>
                </div>
              </div>
              <div className="delete-edit-buttons">
                <Link className="btn btn-info btn-sm" to={`/article/${id}`}>
                  Edit
                </Link>

                {pubstatus_id == "1" ||
                pubstatus_id == "2" ||
                pubstatus_id == "3" ? (
                  <button
                    className="btn btn-danger btn-sm mr-2"
                    onClick={() => {
                      const confirmBox = window.confirm(
                        "Do you really want to delete this Crumb?"
                      );
                      if (confirmBox === true) {
                        singlePostDelete(id);
                      }
                    }}
                  >
                    {" "}
                    Delete
                  </button>
                ) : (
                  <button className="col-md-4 btn " disabled>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPost;
