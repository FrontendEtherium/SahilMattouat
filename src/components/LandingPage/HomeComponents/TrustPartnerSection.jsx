import React from "react";
import "./TrustPartnerSection.css";

// Import your SVGs or PNGs—these will be code-split and lazy-loaded by default
import { ReactComponent as PersonalizedIcon } from "../../../assets/icon/personalized-care.svg";
import { ReactComponent as ExpertsIcon } from "../../../assets/icon/trusted-experts.svg";
import { ReactComponent as TeleconIcon } from "../../../assets/icon/global-teleconsultation.svg";
import { ReactComponent as AccessIcon } from "../../../assets/icon/accessible-24x7.svg";

const FEATURES = [
  {
    Icon: PersonalizedIcon,
    title: "Personalized Care For You",
    description: "Expert advice tailored to you through online consultations.",
  },
  {
    Icon: ExpertsIcon,
    title: "Trusted Natural Cure Experts",
    description: "Certified in global traditional medicine systems.",
  },
  {
    Icon: TeleconIcon,
    title: "Rooted in Science & Tradition",
    description: "Blending ancient healing with modern care.",
  },
  {
    Icon: AccessIcon,
    title: "Doctor-Led Wellness Journeys",
    description: "Certified experts guide your personalized path to healing.",
  },
];

const TrustPartnerSection = () => (
  <section
    className="trust-partner container"
    aria-labelledby="trust-partner-title"
  >
    <h2 className="landing-page__title">
      Why all-cures.com Is Your Trusted Partner in Holistic Health
    </h2>
    <div
      style={
        {
          // backgroundColor: "#f8f9fd",
          // borderRadius: "12px",
        }
      }
    >
      <div className="trust-partner__grid">
        {FEATURES.map(({ Icon, title, description }) => (
          <div
            key={title}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f8f9fd",
              padding: "8px",
              borderRadius: "12px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            <Icon
              className="trust-partner__icon"
              aria-hidden="true"
              focusable="false"
            />
            <article className="trust-partner__card">
              <h3 className="trust-partner__card-title">{title}</h3>
              <p className="trust-partner__card-desc">{description}</p>
            </article>
          </div>
        ))}
      </div>
      <p className="trust-partner__footer">
        For years, we've been a trusted holistic health platform, blending
        alternative medicine with expert care for your well-being.
      </p>
    </div>
  </section>
);

export default React.memo(TrustPartnerSection);
