import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { backendHost } from "../../api-config";

import axios from "axios";

const WebstoriesList = () => {
  const [webStoriesList, setWebStoriesList] = useState([]);

  const fetchList = (e) => {
    axios
      .get(`${backendHost}/data/webStories/get `)
      .then((res) => {
        setWebStoriesList(res.data);
        console.log(res.data);
      })

      .catch((res) => {
        return;
      });
  };

  useEffect(() => {
    document.title = "All Cures | Dashboard | VideoChat";
    fetchList();
  }, []);
  // const AvailDelete = (ServiceId) => {
  //     console.log('delete')
  //     axios.delete(`${backendHost}/sponsored/delete/service/${ServiceId}`)
  //     .then(res => {

  //     })
  //     .catch(err => {
  //         return;
  //     })
  // }

  return (
    <div>
      <div className="container mb-4">
        <div className="row">
          {webStoriesList
            ? webStoriesList.map((i) => {
                return (
                  <div className="card col-md-5 mt-5 mx-3 border p-3 h6">
                    <div className="card-title h4">
                      <span className="font-weight-bold">Title:</span> {i.title}
                    </div>
                    <div className="pb-2">
                      <span className="font-weight-bold">ID: </span>
                      {i.webID}
                    </div>
                    <div className="pb-2">
                      <span className="font-weight-bold">Created On: </span>
                      {i.createDate}
                    </div>

                    <div className="pb-2">
                      <span className="font-weight-bold">Description:</span>{" "}
                      {i.description}
                    </div>
                    <div className="pb-2">
                      <span className="font-weight-bold">Link:</span> {i.link}
                    </div>
                    <div className="pb-2">
                      <img
                        src={`https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/${i.image}`}
                      />
                    </div>

                    <div className="row mx-1 my-2">
                      <Link
                        to={`/dashboard?webstoriesUpdate=${i.webID}`}
                        className="col-md-3 btn mr-2"
                        style={{ backgroundColor: "#9289be", color: "#fff" }}
                      >
                        Edit
                      </Link>

                      {/* { i.status===1?
                                      <button onClick={() => {
                                        const confirmBox = window.confirm(
                                            "Are you sure?"
                                        )
                                        if (confirmBox === true) {
                                            AvailDelete(i.serviceId)
                                        }
                                    }} className="col-md-4 btn btn-dark">De-activate</button>
                                     :<button className="col-md-4 btn btn-dark" disabled>De-activated</button>
                                } */}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default WebstoriesList;
