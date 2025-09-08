import React from "react";
import CenterWell from "./CenterWell";
import { createArticlePath } from "../../utils/slugUtils";
const Post = ({
  id,
  title,
  content,
  f_title,
  w_title,
  history,
  type,
  country,
  published_date,
}) => {
  return (
    <>
      <div style={{ width: "95%" }}>
        <div className="ml-3">
          {/* <div className="card-body"> */}

          <div className="justify-content-between align-items-center mb-2">
            <div className="card">
              <button
                onClick={(e) => history.push(createArticlePath(id, title))}
                className="btn d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="card-title h6 mb-1 font-weight-bold text-capitalize">
                    {title}
                  </div>
                  <div className="h7 text-muted">{w_title}</div>
                  <div id="right-menu-card-article-content-preview">
                    {/* {
                                    content && JSON.parse(content) ?
                                    JSON.parse(content).blocks.map((j, idx) => idx<1 && (
                                        <CenterWell
                                            content = {j.data.content}
                                            type = {j.type}
                                            text = {j.data.text}
                                            title = {j.data.title}
                                            message = {j.data.message}
                                            source = {j.data.source}
                                            embed = {j.data.embed}
                                            caption = {j.data.caption}
                                            alignment = {j.data.alignment}
                                            imageUrl = {j.data.file? j.data.file.url: null}
                                            url = {j.data.url}
                                        />
                                    ))
                                    : null
                                } */}
                  </div>
                  <div className="h7 text-muted text-left">
                    Published on: {published_date}
                  </div>
                </div>
                {/* <div>
                                        {
                                type === '1'?
                                    <div className="chip overview mr-2">Overview</div>
                                : type === '2'?
                                    <div className="chip cure mr-2">Cures</div>
                                : type === '3'?
                                    <div className="chip symptoms mr-2">Symptoms</div>
                                : null
                            }
                            </div> */}
                {/*
                            {   
                                country !== 0?
                                    country === 9?
                                        <div className ="chip country">India</div>
                                        : country === 10?
                                            <div className="chip country">Iran</div>
                                            :null
                                        : null
                            }
                                        </div> */}
              </button>
            </div>
          </div>

          {/* <div className="card-info">
                            <hr/>
                        </div> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};
export default Post;
