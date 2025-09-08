import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "./leftMenu";
import SidebarRight from "./RightMenu";
import { backendHost } from "../../api-config";
import Heart from "../../assets/img/heart.png";
import "react-phone-number-input/style.css";
import HelmetMetaData from "../HelmetMetaData";
import headers from "../../api-fetch";
import { imagePath, imgKitImagePath } from "../../image-path";
import SubscriberBtn from "./DiseasePageComponent/SubscriberBtn.js";
import CarouselArticle from "./DiseasePageComponent/CarouselArticle";
import ArticleDetails from "./DiseasePageComponent/ArticleDetails";
import Breadcrumbs from "./DiseasePageComponent/Breadcrumbs";
import Rating from "./DiseasePageComponent/Rating.js";
import ArticleComments from "./DiseasePageComponent/ArticleComments.js";
import DiseaseModal from "./DiseasePageComponent/DiseaseModal.js";
import { userId } from "../UserId.js";
import VideoPopover from "./DiseasePageComponent/VideoPopover.js";
import InlineVideoPlayer from "./DiseasePageComponent/Video.js";
import {
  createCanonicalUrl,
  createArticlePath,
} from "../../utils/slugUtils";
const Disease = () => {
  const [state, setState] = useState({
    items: [],
    carouselItems: [],
    comment: [],
    isLoaded: false,
    favourite: [],
    regions: [],

    showMore: false,
    value: "",
    type: [],
    diseaseList: [],
    cures: [],
    showAlert: false,
    alertMsg: "",
    showCuresCards: false,
    modalState: false,
    adId: "",
    showSource: false,
    alertShown: false,
    isModalOpen: false,
    currentIndex: 1,
  });

  // console.log("component rendered");
  // const MarkdownPreview = lazy(() => import("./MarkdownPreview.js"));
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const containerRef = useRef(null);
  const [parsedContent, setParsedContent] = useState();
  const [diseaseConditionId, setDiseaseConditionId] = useState();
  const [regDocId, setRegDocId] = useState("");
  const [videoURL, setVideoURL] = useState();

  // Function to generate canonical URL for the article
  const getCanonicalUrl = () => {
    if (state.items && state.items.title) {
      const articleId = id.split("-")[0];
      return createCanonicalUrl(articleId, state.items.title);
    }
    // Fallback to current URL if article data not loaded yet
    const currentURL = window.location.href;
    return currentURL.replace(/(https?:\/\/)?www\./, "$1");
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBlog();
    };
    loadData();

    setTimeout(() => {
      if (adSpacRef.current) {
        adSpacRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
    const isMobileView = window.innerWidth <= 768;
    window.scrollTo({
      top: isMobileView ? 650 : 0,
      behavior: "smooth",
    });
  }, [id]);

  // Normalize URL to enforce hyphenated slug in the path
  useEffect(() => {
    if (state.items && state.items.title) {
      const articleId = id.split("-")[0];
      const expectedPath = createArticlePath(articleId, state.items.title);
      if (location.pathname !== expectedPath) {
        history.replace(`${expectedPath}${location.search || ""}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items.title, id]);
  const fetchVideoURL = async (id) => {
    console.log("id", id);

    try {
      const { data } = await axios.get(`${backendHost}/doctors/${id}/url`);
      setVideoURL(data);
      console.log("url", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (ad) => {
    // console.log('Image clicked!',ad);
    axios.put(`${backendHost}/sponsored/ads/clicks/${ad}`);
  };

  const fetchBlog = async () => {
    const articleId = id.split("-")[0];
    console.log(articleId)

    if (/^[0-9]+$/.test(articleId)) {
      // If the URL contains article_id
      try {
        const [json] = await Promise.all([
          fetch(`${backendHost}/article/${articleId}`, {
            method: "GET",
            headers,
          }).then((res) => res.json()),
        ]);
        const content = json.content;
        const parsedContent = JSON.parse(decodeURIComponent(content));
        setParsedContent(parsedContent);
        setState((prev) => ({
          ...prev,
          isLoaded: true,
          items: json,
        }));
        setDiseaseConditionId(json.disease_condition_id);

        setRegDocId(json.reg_doc_pat_id);
        await fetchVideoURL(json.reg_doc_pat_id);

        // Perform subsequent calls and updates
        await Promise.all([
          diseasePosts(json.dc_name),

          fetchParentDiseaseId(articleId),
        ]);

        // Update the document title
        document.title = json.title;
      } catch (error) {
        console.error("Error fetching article by ID:", error);
      }
    } else {
      // If the URL contains the title
      try {
        const [json] = await Promise.all([
          fetch(`${backendHost}/article/title/${articleId}`, {
            method: "GET",
            headers,
          }).then((res) => res.json()),
        ]);

        setState((prev) => ({
          ...prev,
          isLoaded: true,
          items: json,
        }));

        // Perform subsequent calls and updates
        await Promise.all([
          diseasePosts(json.dc_name),
          fetchParentDiseaseId(articleId),
        ]);

        // Update the document title
        document.title = json.title;
      } catch (error) {
        console.error("Error fetching article by title:", error);
      }
    }
  };

  const [initial, setInitial] = useState(15);
  const diseasePosts = async (dcName) => {
    try {
      const response = await fetch(
        `${backendHost}/isearch/limit/${dcName}?offset=0&limit=${initial}&&order=published_date:desc`
      );
      const data = await response.json();
      setState((prev) => ({ ...prev, carouselItems: data }));
    } catch (error) {
      console.error("Error fetching disease posts:", error);
    }
  };

  const fetchData = async (parent_dc_id) => {
    try {
      const response = await axios.get(
        `${backendHost}/sponsored/list/ads/url/2`,
        {
          params: { DC_Cond: parent_dc_id },
        }
      );

      if (response.data !== "All Ads are Served") {
        const id = response.data.split("/")[3];
        const ids = id.match(/\d+/);
        const adsId = ids[0];

        setState((prev) => ({ ...prev, adId: adsId }));
      }

      const newResponse = `https://all-cures.com:444${response.data}`;
      setState((prev) => ({ ...prev, ads: newResponse }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message }));
    }
  };
  useEffect(() => {
    pageLoading();
  }, []);

  const pageLoading = async () => {
    const articleId = id.split("-")[0];
    if (location.search.includes("whatsapp")) {
      await axios.post(
        `${backendHost}/article/${articleId}/${
          userId ? userId : 0
        }/jsession/whatsapp`
      );
    } else {
      await axios.post(
        `${backendHost}/article/${articleId}/${userId ? userId : 0}/jsession/NA`
      );
    }
  };

  const fetchParentDiseaseId = async (articleId) => {
    try {
      const response = await fetch(
        `${backendHost}/sponsored/parent_disease_id/${articleId}`
      );
      const data = await response.json();
      if (data.parent_dc_id !== 0) {
        await fetchData(data.parent_dc_id);
      }
    } catch (error) {
      console.error("Error fetching parent disease ID:", error);
    }
  };

  const handleSource = () => {
    setState((prev) => ({ ...prev, showSource: !prev.showSource }));
  };

  const toggleShowMoreComments = () => {
    setState((prev) => ({ ...prev, showMore: !prev.showMore }));
  };
  const adSpacRef = useRef();
  const handleLinkClick = async (e, url) => {
    window.scrollTo(0, 0); // Scroll to the top of the page

    try {
      // Send a POST request for analytics
      await axios.post(
        `${backendHost}/analytics/clicks?articleID=${id.split("-")[0]}`
      );
    } catch (error) {
      console.error("Error logging analytics:", error);
    }

    // Update the carousel index
    setState((prevState) => ({
      ...prevState,
      currentIndex:
        (prevState.currentIndex + 1) % prevState.carouselItems.length,
    }));

    // Navigate to the new page
    setTimeout(() => {
      history.push(url); // Use history.push to navigate
    }, 0);
  };

  if (!state.isLoaded) {
    return (
      <>
        <Header />
        <Container className="my-5 loading">
          <div className="loader">
            <img src={Heart} alt="All Cures Logo" id="heart" />
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Header history={history} />
      <HelmetMetaData
        title={state.items.title}
        keywords={state.items.keywords}
        image={
          `${imagePath}` +
          state.items.content_location
            .replace("json", "png")
            .split("/webapps/")[1]
        }
        publishedDate={state.items.published_date}
        canonicalUrl={getCanonicalUrl()}
      />
      <div className="ad-spac" ref={adSpacRef}>
        <button
          className="btn"
          data-toggle="modal"
          data-target=".bd-example-modal-lg"
        >
          <img
            src={`${imgKitImagePath}/tr:w-900,f-webp/assets/img/97x90_Plain.jpg`}
            alt="advertisment"
          />
        </button>
      </div>
      <Row>
        <div className="left-menu pb-3">
          <div id="sidebar-wrapper">
            <Sidebar
              diseaseId={state.items.disease_condition_id}
              id={id}
              name={state.items.dc_name}
            />
          </div>
          {state.ads &&
            (state.ads !== "https://all-cures.com:444All Ads are Served" ? (
              <div className="d-flex justify-content-center">
                <img
                  className="mt-5"
                  style={{ marginTop: "20px" }}
                  id="left-menu-ad"
                  src={state.ads}
                  alt="adjjjj"
                  onClick={() => handleClick(state.adId)}
                />
              </div>
            ) : (
              <button
                className="btn pl-4"
                id="left-menu-ad"
                data-toggle="modal"
                data-target=".bd-example-modal-lg"
                style={{ marginTop: "100px" }}
              >
                <img
                  className="pl-4"
                  src={`${imgKitImagePath}/tr:w-180,f-webp/assets/img/Persian.jpg`}
                  alt="adhhh"
                />
              </button>
            ))}
        </div>
        <Col md={7} id="page-content-wrapper" className="col-xs-12 pb-5">
          <div id="center-well" ref={containerRef}>
            <Breadcrumbs
              homeLink="/"
              dcName={state.items.dc_name}
              type={state.items.type}
              parentMedicineType={state.items.parent_Medicine_type}
              medicineTypeName={state.items.medicine_type_name}
            />
            <CarouselArticle
              diseaseConditionId={diseaseConditionId}
              carouselItems={state.carouselItems}
              id={id}
            />

            <ArticleDetails
              title={state.items.title}
              parsedContent={parsedContent}
              handleLinkClick={handleLinkClick}
              carouselItems={state.carouselItems}
              currentIndex={state.currentIndex}
              authorsName={state.items.authors_name}
              authoredBy={state.items.authored_by}
              regDocPatId={state.items.reg_doc_pat_id}
              publishedDate={state.items.published_date}
              id={id}
            />
            <Rating id={id} />
          </div>
          <div className="ml-3 mt-3">
            <button className="btn  btn-primary" onClick={handleSource}>
              Source
            </button>
          </div>

          <div>
            <h5 className=" ml-3 mt-3 ">
              {" "}
              {state.showSource && state.items.window_title}{" "}
            </h5>
          </div>

          <ArticleComments id={id} />
        </Col>
        <Col id="right-sidebar-wrapper">
          <SidebarRight
            title={state.items.title}
            history={history}
            dcName={state.items.dc_name}
            id={state.items.article_id}
            videoURL={videoURL}
          />
        </Col>
      </Row>
      <DiseaseModal />
      <SubscriberBtn />

      {videoURL && <VideoPopover videoURL={videoURL} regDocId={regDocId} />}

      <Footer />
    </div>
  );
};

export default Disease;
