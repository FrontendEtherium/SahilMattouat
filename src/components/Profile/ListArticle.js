import React from "react";
import { Link } from "react-router-dom";
import { createArticlePath } from "../../utils/slugUtils";

const ListArticle = ({
  id,
  title,
  f_title,
  w_title,
  country,
  type,
  pubstatus_id,
  dis,
}) => {
  if (parseInt(dis) === 0) dis = true;
  else dis = false;
  // const [deleteAlert, setAlert] = useState(false)

  // const singlePostDelete = (id) => {
  //     axios.delete(`${backendHost}/article/${id}`)
  //     .then(res => {
  //         singlePostDelete()
  //         // setAlert(true)
  //         // setTimeout(() => {
  //         //     setAlert(false)
  //         // }, 4000);
  //     })
  //     .then(err => {
  //     })
  //     .catch(err =>
  //     )
  // }

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
                {pubstatus_id === 1 ? (
                  <div className="chip overview mr-2">Work In Progress</div>
                ) : pubstatus_id === 2 ? (
                  <div className="chip symptoms mr-2">Under Review</div>
                ) : pubstatus_id === 3 ? (
                  <div className="chip cure mr-2">Published </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ListArticle;
