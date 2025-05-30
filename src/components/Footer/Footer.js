// src/components/Footer.jsx
import React, { memo } from "react";
import { Link } from "react-router-dom";
import GooglePlay from "../../assets/icon/googleplay.png";
import AppStore from "../../assets/icon/appstore.png";
import { imgKitImagePath } from "../../image-path";
import "./Footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CopyrightIcon from "@mui/icons-material/Copyright";
import WhiteHeart from "../../assets/icon/whiteheart.svg";

const CuresData = [
  { title: "Ayurveda", medicineType: 1, img: "ayurveda04.png" },
  { title: "Chinese", medicineType: 4, img: "Chinese04.png" },
  { title: "Homeopathy", medicineType: 8, img: "Homopathy04.png" },
  { title: "Unani", medicineType: 2, img: "Unani04.png" },
  { title: "Japanese", medicineType: 6, img: "Japanese04.png" },
  { title: "Naturopathy", medicineType: 9, img: "Naturpathy04.png" },
];

// Social media data moved outside component
const socialMediaLinks = [
  {
    href: "https://www.facebook.com/allcuresinfo",
    icon: <FacebookIcon style={{ color: "#fff" }} />,
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/company/etherium-technologies/",
    icon: <LinkedInIcon style={{ color: "#fff" }} />,
    label: "LinkedIn",
  },
  {
    href: "https://www.youtube.com/@all-cures",
    icon: <YouTubeIcon style={{ color: "#fff" }} />,
    label: "YouTube",
  },
  {
    href: "https://www.instagram.com/allcuresinfo/",
    icon: <InstagramIcon style={{ color: "#fff" }} />,
    label: "Instagram",
  },
];

const Footer = () => (
  <>
    <footer
      className="d-none d-lg-block"
      role="contentinfo"
      aria-label="Main footer"
    >
      {/* Top blue section */}
      <div className="footer-top text-white">
        <div className="container">
          <div className="row" style={{ justifyContent: "space-between" }}>
            {/* 1) Logo */}
            <div className="col-lg-2 footer-brand">
              <a
                href="/"
                className="d-flex align-items-center justify-content-start"
                style={{ flexDirection: "column" }}
                aria-label="All Cures Home"
              >
                <img
                  src={WhiteHeart}
                  style={{
                    height: "70px",
                    width: "70px",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                  alt="All Cures Logo"
                  loading="lazy"
                />
                <span className="brand-text">ALL CURES</span>
              </a>
            </div>

            {/* 2) About Us */}
            <div className="col-lg-2">
              <ul className="list-unstyled footer-links">
                <li>
                  <Link to="/AboutUs" aria-label="Learn more about All Cures">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/AboutUs" aria-label="Contact All Cures team">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/allcures" aria-label="Explore all cures">
                    Cures
                  </Link>
                </li>
                <li className="mt-3">
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "12px",
                      lineHeight: "1.4",
                    }}
                  >
                    Etherium Technologies Private Limited,
                    <br />
                    92/6, Trikuta Nagar,
                    <br />
                    Jammu, Jammu and Kashmir 180020
                  </div>
                </li>
              </ul>
            </div>

            {/* 3) Ayurveda… */}
            <div className="col-lg-2">
              <ul className="list-unstyled footer-links">
                {CuresData.map((cure) => (
                  <li key={cure.medicineType}>
                    <Link
                      to={`/searchmedicine/medicinetype/${cure.medicineType}`}
                      aria-label={`Explore ${cure.title} treatments`}
                    >
                      <div style={{ color: "white" }}>{cure.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4) Privacy & Feedback */}
            <div className="col-lg-2">
              <ul className="list-unstyled footer-links">
                <li>
                  <Link to="/privacy" aria-label="Read our privacy policy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    aria-label="Read our terms and conditions"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" aria-label="Share your feedback with us">
                    Share your Feedback
                  </Link>
                </li>
              </ul>
            </div>

            {/* 5) Downloads + Social */}
            <div className="col-lg-2">
              <p className="download-heading">Download the All-Cures App:</p>
              <div className="app-badges mb-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.allcures"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download All Cures from Google Play Store"
                >
                  <img
                    src={GooglePlay}
                    alt="Get it on Google Play"
                    className="badge-img"
                    loading="lazy"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/all-cures/id1659590351"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download All Cures from Apple App Store"
                >
                  <img
                    src={AppStore}
                    alt="Download on the App Store"
                    className="badge-img"
                    loading="lazy"
                  />
                </a>
              </div>
              <ul className="list-inline social-icons mb-0">
                {socialMediaLinks.map((item, i) => (
                  <li key={i} className="list-inline-item mx-2">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${item.label}`}
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grey disclaimer */}
      <div className="footer-bottom">
        <div className="container">
          <p className="disclaimer mb-0">
            Disclaimer: Content available on All Cures website is not intended
            to be a substitute for professional medical advice, diagnosis, or
            treatment. It is strongly recommended to consult your physician or
            other qualified medical practitioner with any questions you may have
            regarding a medical condition. The website should not be used as a
            source for treatment of any medical condition.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              fontSize: "12px",
            }}
          >
            <p>
              All rights reserved. Copyright
              <CopyrightIcon style={{ fontSize: "1rem", margin: "0 2px" }} />
              2022
              <a href="https://etheriumtech.com" rel="noopener noreferrer">
                Etherium Technologies
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>

    {/* ── MOBILE FOOTER (<992px) ── */}
    <footer
      className="d-block d-lg-none"
      role="contentinfo"
      aria-label="Mobile footer"
    >
      {/* Top blue section */}
      <div className="footer-top text-white">
        <div className="container">
          <div className="row">
            {/* left col */}
            <div className="col-4 text-center footer-mobile-left">
              <a href="/" className="d-block mb-3" aria-label="All Cures Home">
                <img
                  src={WhiteHeart}
                  style={{
                    height: "50px",
                    width: "50px",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                  alt="All Cures Logo"
                  loading="lazy"
                />
                <div className="brand-text">All CURES</div>
              </a>
              <div
                style={{
                  color: "#fff",
                  fontSize: "10px",
                  lineHeight: "1.3",
                  marginTop: "10px",
                }}
              >
                Etherium Technologies Private Limited,
                <br />
                92/6, Trikuta Nagar,
                <br />
                Jammu, Jammu and Kashmir 180020
              </div>
            </div>

            {/* right col */}
            <div className="col-4 footer-mobile-right">
              <h5 className="quick-links-heading">Quick Links</h5>
              <ul className="list-unstyled footer-links mb-3">
                <li>
                  <Link to="/AboutUs" aria-label="Learn more about All Cures">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/AboutUs" aria-label="Contact All Cures team">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/cures" aria-label="Explore all cures">
                    Cures
                  </Link>
                </li>
              </ul>
              <ul className="list-unstyled footer-links">
                {CuresData.map((cure) => (
                  <li key={cure.medicineType}>
                    <Link
                      to={`/searchmedicine/${cure.title.toLowerCase()}-cures`}
                      aria-label={`Explore ${cure.title} treatments`}
                    >
                      <div style={{ color: "white" }}>{cure.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-4 footer-mobile-right">
              <ul className="list-unstyled footer-links mb-3">
                <li>
                  <Link to="/privacy" aria-label="Read our privacy policy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    aria-label="Read our terms and conditions"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/newsletter"
                    aria-label="Subscribe to our newsletter"
                  >
                    Subscribe to our Newsletter
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" aria-label="Share your feedback with us">
                    Share your Feedback
                  </Link>
                </li>
              </ul>

              <p className="download-heading mb-2">
                Download the All-Cures App:
              </p>
              <div className="app-badges mb-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.allcures"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download All Cures from Google Play Store"
                >
                  <img
                    src={GooglePlay}
                    alt="Get it on Google Play"
                    className="badge-img"
                    loading="lazy"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/all-cures/id1659590351"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download All Cures from Apple App Store"
                >
                  <img
                    src={AppStore}
                    alt="Download on the App Store"
                    className="badge-img"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grey disclaimer */}
      <div className="footer-bottom">
        <div className="container">
          <p className="disclaimer mb-0 text-center">
            Disclaimer: Content available on All Cures website is not intended
            to be a substitute for professional medical advice, diagnosis, or
            treatment. It is strongly recommended to consult your physician or
            other qualified medical practitioner with any questions you may have
            regarding a medical condition. The website should not be used as a
            source for treatment of any medical condition.
          </p>
        </div>
      </div>
    </footer>
  </>
);

export default memo(Footer);
