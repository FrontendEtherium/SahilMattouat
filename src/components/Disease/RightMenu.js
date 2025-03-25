import React, { useEffect, useState, memo } from "react";
import { Nav } from "react-bootstrap";
import { withRouter } from "react-router";
import AllPost from "../BlogPage/Allpost";
import "./style.css";
import { Container } from "react-bootstrap";
import { backendHost } from "../../api-config";
import Heart from "../../assets/img/heart.png";
import InlineVideoPlayer from "./DiseasePageComponent/Video";

const Side = (props) => {
  const [isloaded, setisLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [initial, setInitial] = useState(5);

  function diseasePosts() {
    fetch(
      `${backendHost}/isearch/limit/${props.dcName}?offset=0&limit=${initial}&&order=published_date:desc`
    )
      .then((res) => res.json())
      .then((json) => {
        setInitial(initial + 5);
        setisLoaded(true);
        setItems(json);
      })
      .catch((err) => {
        return;
      });
  }

  useEffect(() => {
    // allPosts()
    diseasePosts();
  }, []);

  if (!isloaded) {
    return (
      <>
        <Container className="my-5 loading">
          <div className="h3 pb-3">
            <u className="text-decoration-none">{props.dcName} Cures</u>
          </div>
          <div className="loader">
            <img src={Heart} alt="All Cures Logo" id="heart" />
          </div>
        </Container>
      </>
    );
  } else {
    var id = props.id;
    return (
      <Nav className="col-xs-2  d-md-block sidebar" activeKey="/home">
        {/* <div style={{ padding: "10px", textAlign: "center", width: "100%" }}>
          {props.videoURL && <InlineVideoPlayer videoURL={props.videoURL} />}
        </div> */}

        <Nav.Item className="set-width" id="dc-right-menu">
          <div className="h4 pb-3">
            <u className="text-decoration-none">{props.dcName} Cures</u>
          </div>

          {items
            ? items.map((i, index) =>
                i.article_id != id ? (
                  <AllPost
                    docID={i.docID}
                    key={i.article_id.toString()}
                    id={i.article_id}
                    title={i.title}
                    f_title={i.friendly_name}
                    // w_title = {i.window_title}
                    type={i.type}
                    // authorName={i.author_name}
                    content={decodeURIComponent(i.content)}
                    // type = {i.type}
                    published_date={i.published_date}
                    over_allrating={i.over_allrating}
                    // country = {i.country_id}
                    imgLocation={i.content_location}
                    history={props.history}
                  />
                ) : null
              )
            : null}

          <div className="d-grid mt-3 mb-5 text-center">
            <button
              onClick={diseasePosts}
              type="button"
              className="btn btn-danger"
            >
              Load More
            </button>
          </div>
        </Nav.Item>
      </Nav>
    );
  }
};

const SidebarRight = withRouter(Side);
export default memo(SidebarRight);
