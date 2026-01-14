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
  country,
  type,
  published_date,
  over_allrating,
  imgLocation,
  authorName,
}) => {
  // ✅ Safe JSON parser
  const parseEditorContent = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed?.blocks) ? parsed.blocks : [];
    } catch {
      return [];
    }
  };

  const blocks = content ? parseEditorContent(content) : [];

  // ✅ Image handling
  const imageLoc =
    imgLocation && imgLocation.includes("cures_articleimages")
      ? `${imagePath}${imgLocation.replace("json", "png").split("/webapps/")[1]}`
      : `${imagePath}cures_articleimages/299/default.png`;

  const articlePath = createArticlePath(id, title);
  const safeType = String(type || "");

  return (
    <div className="d-flex cures-search-tab w-100 card mb-5">
      <div className="col-md-3 cures-tab-img rounded px-0">
        <img src={imageLoc} alt={title || "article"} />
      </div>

      <div className="col-md-9 mb-25r">
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link to={articlePath}>
            <div className="card-title h5 text-capitalize">
              {(title || "").toLowerCase()}
            </div>
          </Link>

          {over_allrating !== 0 && (
            <div className="checked" id="starWeb">
              <span className="fa fa-star checked mr-1"></span>
              {Math.round(over_allrating * 10) / 10}
            </div>
          )}
        </div>

        <div className="card-info">
          <div className="card-article-content-preview">
            {blocks.map((block, idx) => {
              const data = block?.data || {};
              return (
                <CenterWell
                  key={idx}
                  content={data.text || ""}
                  type={block?.type || ""}
                  text={
                    typeof data.text === "string"
                      ? data.text.substring(0, 250) + "..."
                      : ""
                  }
                  title={data.title || ""}
                  message={data.message || ""}
                  source={data.source || ""}
                  embed={data.embed || ""}
                  caption={data.caption || ""}
                  alignment={data.alignment || ""}
                  imageUrl={data.file?.url || null}
                  url={data.url || ""}
                />
              );
            })}
          </div>

          <div className="text-left mt-2 text-muted" id="publish-date">
            {authorName !== "All Cures Team" ? (
              <Link to={`/doctor/${docID}`}>{authorName}</Link>
            ) : (
              authorName
            )}{" "}
            ▪️ <Date dateString={published_date} />
          </div>
        </div>

        <div className="cures-tab-chips">
          {safeType.includes("1") && <div className="chip overview">Overview</div>}
          {safeType.includes("2") && <div className="chip cure">Cure</div>}
          {safeType.includes("3") && <div className="chip symptoms">Symptoms</div>}

          {country === 9 && <div className="chip country ml-2 color-white">India</div>}
          {country === 10 && <div className="chip country ml-2 color-white">Iran</div>}
          {country === 11 && <div className="chip country ml-2 color-white">China</div>}
          {country === 12 && <div className="chip country ml-2 color-white">Japan</div>}
          {country === 13 && <div className="chip country ml-2 color-white">Greece</div>}
          {country === 14 && <div className="chip country ml-2 color-white">Netherland</div>}
          {country === 15 && <div className="chip country ml-2 color-white">Australia</div>}
          {country === 17 && <div className="chip country ml-2 color-white">Pakistan</div>}
          {country === 19 && <div className="chip country ml-2 color-white">Malaysia</div>}
          {country === 20 && <div className="chip country ml-2 color-white">South Korea</div>}
          {country === 21 && <div className="chip country ml-2 color-white">UAE</div>}
          {country === 22 && <div className="chip country ml-2 color-white">United States</div>}
          {country === 23 && <div className="chip country ml-2 color-white">Ireland</div>}
          {country === 24 && <div className="chip country ml-2 color-white">Vietnam</div>}
          {country === 25 && <div className="chip country ml-2 color-white">Sri Lanka</div>}
          {country === 26 && <div className="chip country ml-2 color-white">Saudi Arabia</div>}
        </div>
      </div>
    </div>
  );
};

export default AllPost;
