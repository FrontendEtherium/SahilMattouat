import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CenterWell from "../CenterWell";
import { userAccess } from "../../UserAccess";
import Favourite from "../../favourite";
import Favourites from "../../UpdateFavourite";
import { backendHost } from "../../../api-config";
import { userId } from "../../UserId";
const ArticleDetails = React.memo(
  ({
    title,

    parsedContent,
    carouselItems,
    currentIndex,
    handleLinkClick,
    authorsName,
    authoredBy,
    regDocPatId,
    publishedDate,
    id,
  }) => {
    // console.log("article details poage re rendered");

    const [state, setState] = useState({
      showSource: false,
      favourite: [],
      ratingValue: "",
    });
    const articleId = id.split("-")[0];
    useEffect(() => {
      getRating();
      if (userAccess) {
        getFavourite();
      }
    }, []);
    const getRating = async () => {
      try {
        const response = await fetch(
          `${backendHost}/rating/target/${articleId}/targettype/2/avg`
        );
        const data = await response.json();


        setState((prev) => ({ ...prev, ratingValue: data }));
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };
    const getFavourite = async () => {
      try {
        const response = await fetch(
          `${backendHost}/favourite/userid/${userId}/articleid/${articleId}/favourite`
        );
        const data = await response.json();
        setState((prev) => ({ ...prev, favourite: data[0]?.status || [] }));
      } catch (error) {
        console.error("Error fetching favourite status:", error);
      }
    };
    return (
      <div>
        <div className="article-title-container">
          <h1 className="font-weight-bold text-decoration-underline">
            {title}
          </h1>

          {state.ratingValue !== 0 && (
            <div className="average-rating mb-4 ml-3 mt-2" id="avg-rating">
              {[...Array(5)].map((_, index) => (
                <span key={index} className="fa fa-star opacity-7"></span>
              ))}
            </div>
          )}
        </div>

        <div id="article-main-content">
          {parsedContent.blocks?.map((block, idx) => {
            const fileUrl = block.data.file?.url || null;
            const imageUrl = fileUrl
              ? `https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-1000,f-webp/cures_articleimages/${fileUrl.replace(
                  /^.*[\\/]/,
                  ""
                )}`
              : null;

            return (
              <CenterWell
                key={idx}
                pageTitle={title}
                level={block.data.level}
                content={block.data.content}
                type={block.type}
                text={block.data.text}
                title={block.data.title}
                message={block.data.message}
                source={block.data.source}
                embed={block.data.embed}
                caption={block.data.caption}
                alignment={block.data.alignment}
                imageUrl={imageUrl}
                link={block.data.link}
                url={block.data.url}
                item={block.data.items}
              />
            );
          })}

          {carouselItems?.length > 0 && (
            <div className="d-flex justify-content-center mt-2 mb-2">
              <div>
                <Link
                  to={`/cure/${carouselItems[currentIndex]?.article_id}-${carouselItems[currentIndex]?.title?.replace(/\s+/g, "-")}`}
                  className="fs-08"
                  onClick={() =>
                    handleLinkClick(
                      `/cure/${carouselItems[currentIndex]?.article_id}-${carouselItems[currentIndex]?.title?.replace(/\s+/g, "-")}`
                    )
                  }
                >
                  <div className="mb-2">
                    <h4>Click here to read the next article.</h4>
                  </div>
                </Link>

                {carouselItems[currentIndex]?.content_location && (
                  <div className="d-flex justify-content-center">
                    <div>
                      <img
                        src={
                          carouselItems[
                            currentIndex
                          ]?.content_location.includes("cures_articleimages")
                            ? `https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,h-250,f-webp/${
                                carouselItems[currentIndex]?.content_location
                                  .replace("json", "png")
                                  .split("/webapps/")[1]
                              }`
                            : "https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/cures_articleimages//299/default.png"
                        }
                        alt="Article"
                      />
                      <p className="mt-2 fs-5">
                        {carouselItems[currentIndex]?.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <hr />

        {authorsName && (
          <div className="h5 text-left ml-3 mb-2">
            <span>Author: </span>
            {authoredBy?.includes(7) ? (
              authorsName
            ) : (
              <Link to={`/doctor/${regDocPatId}`}>{authorsName}</Link>
            )}
          </div>
        )}

        <div className="h6 text-muted text-left ml-3 mb-4">
          <span>Published on: </span>
          {publishedDate || "Unknown"}
        </div>
        {userAccess ? (
          <div id="favbutton">
            {state.favourite.length === 0 ? (
              <Favourite article_id={id.split("-")[0]} />
            ) : (
              <Favourites article_id={id.split("-")[0]} />
            )}
          </div>
        ) : null}
      </div>
    );
  }
);

export default ArticleDetails;
