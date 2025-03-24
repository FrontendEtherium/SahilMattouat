import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import axios from "axios";
import ArticleRating from "../../ArticleRating";
import { backendHost } from "../../../api-config";
import { userAccess } from "../../UserAccess";
import { userId } from "../../UserId";

const RatingButton = React.memo(
  ({ clicked, onClick, IconActive, IconInactive }) => (
    <button className="btn btn-link p-1 mx-2" onClick={onClick}>
      {clicked ? (
        <IconActive style={{ fontSize: "20px", color: "#00415e" }} />
      ) : (
        <IconInactive style={{ fontSize: "20px", color: "#6c757d" }} />
      )}
    </button>
  )
);

function Rating({ id }) {
  // console.log("Rating Re-rendered");

  const [state, setState] = useState({
    likeClicked: false,
    dislikeClicked: false,
    rating: [],
  });

  const articleId = useMemo(() => id.split("-")[0], [id]);

  const likeButton = useCallback(async () => {
    setState((prev) => ({ ...prev, likeClicked: true, dislikeClicked: false }));

    try {
      await axios.post(`${backendHost}/article/like/${articleId}`);
    } catch (error) {
      console.error("Error liking article:", error);
    }
  }, [articleId]);

  const dislikeButton = useCallback(async () => {
    setState((prev) => ({ ...prev, likeClicked: false, dislikeClicked: true }));

    try {
      await axios.post(`${backendHost}/article/dislike/${articleId}`);
    } catch (error) {
      console.error("Error disliking article:", error);
    }
  }, [articleId]);

  useEffect(() => {
    const getRate = async () => {
      try {
        const response = await axios.get(
          `${backendHost}/rating/target/${articleId}/targettype/2?userid=${
            userId || 0
          }`
        );
        const data = response.data;
        if (data[0]?.ratingVal !== state.rating) {
          setState((prev) => ({ ...prev, rating: data[0]?.ratingVal || [] }));
        }
      } catch (error) {
        console.error("Error fetching rate:", error);
      }
    };

    getRate();
  }, [articleId]);

  return (
    <Row className="align-items-center justify-content-between mx-2">
      <Col md={6}>
        {userAccess ? (
          state.rating.length === 0 ? (
            <span className="text-muted medium">
               Rate here:
            </span>
          ) : (
            <p className="small font-weight-bold" style={{ color: "#00415e" }}>
              Your previous rating: {state.rating}{" "}
              <span className="icon-star-1"></span>
              <br />
              Rate again below:
            </p>
          )
        ) : (
          <div className="text-muted small">Rate here:</div>
        )}
        <div id="docRate">
          <ArticleRating article_id={articleId} />
        </div>
      </Col>
      <Col md={6} className="d-flex align-items-center justify-content-end">
        <span className="small text-muted">Was this article helpful?</span>
        <RatingButton
          clicked={state.likeClicked}
          onClick={likeButton}
          IconActive={ThumbUpIcon}
          IconInactive={ThumbUpOutlinedIcon}
        />
        <RatingButton
          clicked={state.dislikeClicked}
          onClick={dislikeButton}
          IconActive={ThumbDownIcon}
          IconInactive={ThumbDownOutlinedIcon}
        />
      </Col>
    </Row>
  );
}

export default React.memo(Rating);
