import React from "react";
import parse from "html-react-parser";

const DoctorTrendingCuresCard = ({
  pageTitle,
  index,
  imageUrl,
  content,
  type,
  text,
  title,
  message,
  source,
  embed,
  caption,
  alignment,
  ratingVal,
  url,
  item,
  level,
  props,
  link,
}) => {
  var list;
  var rows;
  var textContent;
  if (typeof text === "string") {
    // Modify the HTML string to ensure it is wrapped in an <h2> tag
    textContent = level === 2 ? `<h2>${text}</h2>` : text;
    textContent = parse(textContent);
  }
  if (content) {
    rows = content.map((row) => {
      return `<tr style="border: 1px solid #ebebeb" className="text-center">${row.reduce(
        (acc, cell) =>
          acc +
          `<td className="tc-table__cell text-center p-2" style="border: 1px solid #ebebeb; text-align: center;
                padding: 0.6rem;">${cell}</td>`,
        ""
      )}</tr>`;
    });
  }
  return (
    <>
      <div key={index}>
        {
          {
            header: (
              <div className="ce-block py-2">
                <div className="ce-block__content">
                  <div className="ce-paragraph cdx-block">
                    <div className={`h${level}`}>{textContent}</div>
                  </div>
                </div>
              </div>
            ),
            warning: (
              <div className="ce-block p-1">
                <div
                  className="ce-block__content p-3"
                  style={{
                    border: "1px solid black",
                    borderRadius: "0.35rem",
                    background: "#f5f09f",
                  }}
                >
                  <strong>
                    <span style={{ color: "red", fontSize: "1.2rem" }}>⚠</span>{" "}
                    {title}:{" "}
                  </strong>
                  <span>{message}</span>
                </div>
              </div>
            ),
            delimiter: (
              <h1 className="text-center fw-bold pt-3" id="delimiter">
                * * *
              </h1>
            ),
            embed: (
              <div className="ce-block ce-block--focused py-2">
                <div className="ce-block__content">
                  <div className="cdx-block embed-tool">
                    <preloader className="embed-tool__preloader">
                      <div className="embed-tool__url">{source}</div>
                    </preloader>
                    <iframe
                      title="embed-title"
                      allowfullscreen=""
                      src={embed}
                      className="embed-tool__content"
                      height="320"
                      frameborder="0"
                    ></iframe>
                  </div>
                  <div className="text-center">
                    <i>{caption}</i>
                  </div>
                </div>
              </div>
            ),
            quote: (
              <div
                style={{ textAlign: { alignment } }}
                className="ce-block ce-block--focused my-3 py-2"
              >
                <div className="ce-block__content">
                  <h3
                    style={{ fontStyle: "italic", fontSize: "1.2rem" }}
                    className="cdx-block"
                  >
                    "{textContent}"
                  </h3>
                </div>
                <div className="text-center">
                  <i>- {caption}</i>
                </div>
              </div>
            ),
            image: (
              <div className="ce-block py-2">
                <div className="ce-block__content">
                  <div className="cdx-block cdx-simple-image">
                    <div className="cdx-simple-image__picture">
                      <img src={imageUrl} alt={pageTitle} />
                    </div>
                    <div className="text-center">
                      <i>{caption}</i>
                    </div>
                  </div>
                </div>
              </div>
            ),
            // 'image' :
            list: (
              <div className="ce-block py-2">
                <div className="ce-block__content">
                  <div className="ce-paragraph cdx-block">
                    {/* <ul className="cdx-list--unordered"> */}
                    {item
                      ? (list = item.map((i) => (
                          <li className="cdx-list__item" key={i.toString()}>
                            {i}
                          </li>
                        )))
                      : null}
                    {/* </ul> */}
                  </div>
                </div>
              </div>
            ),
            table: (
              <table className="tc-table text-center">
                <tbody>
                  {typeof rows == "object" ? rows.map((r) => parse(r)) : null}
                </tbody>
              </table>
            ),
            linkTool: (
              <div className="ce-block py-2">
                <div className="ce-block__content">
                  <a target="_blank" href={`${link}`}>
                    {link}
                  </a>
                </div>
              </div>
            ),
            simpleImage: (
              <div className="ce-block py-2">
                <div className="ce-block__content">
                  <div className="cdx-block cdx-simple-image">
                    <div className="cdx-simple-image__picture">
                      <img src={url} alt={caption} />
                    </div>
                    <div className="text-center">
                      <i>{caption}</i>
                    </div>
                  </div>
                </div>
              </div>
            ),
          }[type]
        }
      </div>
    </>
  );
};

export default DoctorTrendingCuresCard;
