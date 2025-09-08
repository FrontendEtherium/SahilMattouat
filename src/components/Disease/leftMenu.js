import React, { useState, useEffect, useMemo } from "react";
import { Nav } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import "./style.css";
import { backendHost } from "../../api-config";
import { createArticlePath } from "../../utils/slugUtils";

const Side = ({ diseaseId, id, name }) => {
  const [items, setItems] = useState([]);
  const [regionalPosts, setRegionalPosts] = useState([]);
  const [overviewArticle, setOverviewArticle] = useState("");

  useEffect(() => {
    if (diseaseId) {
      fetchAllPosts();
      fetchRegionalPosts();
    }
  }, [diseaseId]);

  // Fetch all posts related to the disease
  const fetchAllPosts = async () => {
    try {
      const response = await fetch(
        `${backendHost}/isearch/hierarchy/${diseaseId}`
      );
      const data = await response.json();
      const filteredItems = data.filter((item) => item.dc_status === 1);
      setItems(filteredItems);
    } catch (error) {
      console.error("Error fetching all posts:", error);
    }
  };

  // Fetch regional posts for the disease
  const fetchRegionalPosts = async () => {
    try {
      const response = await fetch(
        `${backendHost}/isearch/treatmentregions/${diseaseId}`
      );
      const data = await response.json();
      setRegionalPosts(data);

      // Extract overview article
      const overview = data.find((post) => post.type.includes(1));
      if (overview) {
        const overviewPath = createArticlePath(
          overview.article_id,
          overview.title
        );
        setOverviewArticle(overviewPath.split("/").pop());
      }
    } catch (error) {
      console.error("Error fetching regional posts:", error);
    }
  };

  // Memoize related items to avoid unnecessary re-renders
  const relatedItems = useMemo(() => {
    return items.map((item) => (
      <div className="menu-item" key={item.dc_id}>
        <Link to={`/searchcures/${item.dc_name}`} className="text-dark h6">
          {item.dc_name}
        </Link>
      </div>
    ));
  }, [items]);

  return (
    <Nav className="d-md-block" activeKey="/home">
      <Nav.Item className="set-width pl-3">
        <div className="h3 pl-2 pb-1" id="l-menu">
          <u className="text-decoration-none">Menu</u>
        </div>
        <div className="guide mt-4">
          <div className="h5 pl-2">{name} Guide</div>
          <div className="menu-item">
            <Link className="text-dark h6" to={`/cure/${overviewArticle}`}>
              Overview & Facts
            </Link>
          </div>
        </div>
        {items.length > 0 && (
          <div className="related mt-5">
            <div className="h4 pl-2 pr-4">Related to {name}</div>
            {relatedItems}
          </div>
        )}
      </Nav.Item>
    </Nav>
  );
};

const Sidebar = withRouter(Side);
export default React.memo(Sidebar);
