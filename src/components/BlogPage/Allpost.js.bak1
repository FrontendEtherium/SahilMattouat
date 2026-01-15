import React from "react";
import { Link } from "react-router-dom";
import CenterWell from "../Disease/CenterWell";
import Date from "../Date";
import { imagePath } from "../../image-path";
import { createArticlePath } from "../../utils/slugUtils";

const AllPost = ({
  id,
  title,
  content,
  docID,
  f_title,
  country,
  type,
  published_date,
  over_allrating,
  imgLocation,
  authorName,
}) => {
  // console.log('docid',docID)
  function IsJsonValid(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return [];
    }
    return JSON.parse(str).blocks;
  }
  var previewContent = [];
  if (content) {
    previewContent = IsJsonValid(content);
  }
  var imageLoc = "";
  if (imgLocation && imgLocation.includes("cures_articleimages")) {
    imageLoc =
      `${imagePath}` + imgLocation.replace("json", "png").split("/webapps/")[1];
  } else {
    imageLoc = "${imagePath}cures_articleimages//299/default.png";
  }

  const articlePath = createArticlePath(id, title);

  return (
    <>
      <div
        key={id.toString()}
        className="d-flex cures-search-tab w-100 card mb-5"
      >
        <div className="col-md-3 cures-tab-img rounded px-0">
          <img src={`${imageLoc}`} alt={title} />
          {/* {
                                    over_allrating !== 0?
                                    <div className='checked'id="starMob"><span class="fa fa-star checked mr-1"></span>{Math.round(over_allrating * 10) / 10}</div>
                                    : null
                                } */}
        </div>
        <div className="col-md-9 mb-25r">
          {/* <div className="card-body"> */}
          {/* <div className='col-md-3'></div> */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <Link
                to={articlePath}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="card-title h5 text-capitalize">
                  {title.toLowerCase()}
                </div>
              </Link>
            </div>
            {over_allrating !== 0 ? (
              <div className="checked" id="starWeb">
                <span class="fa fa-star checked mr-1"></span>
                {Math.round(over_allrating * 10) / 10}
              </div>
            ) : null}
          </div>

          <div className="card-info">
            {/* <div className="card-subtitle text-muted text-capitalize">{w_title.toLowerCase()}</div> */}
            <div className="card-article-content-preview">
              {previewContent && previewContent !== undefined
                ? previewContent.map(
                    (j, idx) =>
                      idx < 1 && (
                        <CenterWell
                          key={idx}
                          content={j.data.content}
                          type={j.type}
                          text={j.data.text.substr(0, 250) + "..."}
                          title={j.data.title}
                          message={j.data.message}
                          source={j.data.source}
                          embed={j.data.embed}
                          caption={j.data.caption}
                          alignment={j.data.alignment}
                          imageUrl={j.data.file ? j.data.file.url : null}
                          url={j.data.url}
                        />
                      )
                  )
                : null}
            </div>
            <div className="text-left mt-2 text-muted" id="publish-date">
              {authorName !== "All Cures Team" ? (
                <Link to={`/doctor/${docID}`}>{authorName}</Link>
              ) : (
                authorName
              )}{" "}
              ▪️ {<Date dateString={published_date} />}
            </div>
          </div>
          <div className="cures-tab-chips">
            {
              type.includes("1") || type === "1" ? (
                <div className="chip overview">Overview</div>
              ) : null
              //     <div className="chip cure">Cures</div>
              // : type === '3'?
              //     <div className="chip symptoms">Symptoms</div>
              // : null
            }
            {type.includes("2") || type === "2" ? (
              <div className="chip cure">Cure</div>
            ) : null}
            {type.includes("3") || type === "3" ? (
              <div className="chip symptoms">Symptoms</div>
            ) : null}
            {country !== 0 ? (
              country === 9 ? (
                <div className="chip country ml-2 color-white">India</div>
              ) : country === 10 ? (
                <div className="chip country ml-2 color-white">Iran</div>
              ) : country === 11 ? (
                <div className="chip country ml-2 color-white">China</div>
              ) : country === 12 ? (
                <div className="chip country ml-2 color-white">Japan</div>
              ) : country === 14 ? (
                <div className="chip country ml-2 color-white">Netherland</div>
              ) : country === 13 ? (
                <div className="chip country ml-2 color-white">Greece</div>
              ) : country === 15 ? (
                <div className="chip country ml-2 color-white">Australia</div>
              ) : country === 17 ? (
                <div className="chip country ml-2 color-white">Pakistan</div>
              ) : country === 19 ? (
                <div className="chip country ml-2 color-white">Malaysia</div>
              ) : country === 20 ? (
                <div className="chip country ml-2 color-white">South Korea</div>
              ) : country === 21 ? (
                <div className="chip country ml-2 color-white">UAE</div>
              ) : country === 22 ? (
                <div className="chip country ml-2 color-white">
                  United States
                </div>
              ) : country === 23 ? (
                <div className="chip country ml-2 color-white">Ireland</div>
              ) : country === 24 ? (
                <div className="chip country ml-2 color-white">Vietnam</div>
              ) : country === 25 ? (
                <div className="chip country ml-2 color-white">Sri Lanka</div>
              ) : country === 26 ? (
                <div className="chip country ml-2 color-white">
                  Saudi Arabia
                </div>
              ) : null
            ) : null}
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};
export default AllPost;
