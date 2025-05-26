import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { withRouter } from "react-router";
import AllPost from "./Allpost";
import "./style.css";
import { backendHost } from "../../api-config";

const Side = (props) => {
  const [isloaded, setisLoaded] = useState(true);
  const [items, setItems] = useState([]);

  function allPosts() {
    const headers = new Headers({
      Authorization: "Bearer local@7KpRq3XvF9",
    });
    fetch(`${backendHost}/article/allkv`, {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        setisLoaded(true);
        setItems(json.reverse());
      })
      .catch((res) => {
        return;
      });
  }
  useEffect(() => {
    allPosts();
  }, []);

  return (
    <>
      <Nav
        className="col-xs-2  d-md-block sidebar"
        activeKey="/home"
        onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
      >
        <div className="sidebar-sticky"></div>

        <Nav.Item className="set-width">
          <div className="h3 pl-4 pb-3 font-weight-bold">
            <u>Recent Cures</u>
          </div>
          {items
            ? items.map(
                (i, index) =>
                  index < 10 &&
                  (i.pubstatus_id === 3 ? ( // Selects articles with publish status = 3 (Published)
                    <AllPost
                      id={i.article_id}
                      title={i.title}
                      f_title={i.friendly_name}
                      w_title={i.window_title}
                    />
                  ) : null)
              )
            : null}
        </Nav.Item>
      </Nav>
    </>
  );
};
const SidebarRight = withRouter(Side);
export default SidebarRight;
