import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";
import axios from "axios";
import { backendHost } from "../../../api-config";
import "./SubscriberComponent.css";

function SubscriberComponent({ disease = [], cures = [] }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, msg: "" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!isValidPhoneNumber(value)) {
      setAlert({ show: true, msg: "Please enter a valid phone number!" });
      setTimeout(() => setAlert({ show: false, msg: "" }), 5000);
      return;
    }
    setLoading(true);

    // Parse phone number using libphonenumber-js
    const phoneNumber = parsePhoneNumber(value);
    const countryCode = phoneNumber.countryCallingCode;
    const number = phoneNumber.nationalNumber;

    axios
      .post(`${backendHost}/users/subscribe/${number}`, {
        nl_subscription_disease_id: disease.join(","),
        nl_sub_type: 1,
        nl_subscription_cures_id: cures.join(","),
        country_code: countryCode,
      })
      .then((res) => {
        let msg;
        if (res.data === "Subscribed")
          msg = "You have successfully subscribed!";
        else if (res.data === "Already subscribed")
          msg = "You are already subscribed!";
        else msg = "Some error occurred. Please try later.";
        setAlert({ show: true, msg });
      })
      .catch(() =>
        setAlert({ show: true, msg: "Some error occurred. Please try later." })
      )
      .finally(() => setLoading(false));
  };

  return (
    <section className="container" aria-label="Newsletter subscription">
      {alert.show && (
        <div className="subscriber-alert" role="alert" aria-live="polite">
          {alert.msg}
        </div>
      )}
      <div className="subscriber-upper">
        <p className="subscriber-policy">
          Sign up to receive the latest health updates, prevention tips and a
          weekly digest delivered straight to your inbox!
        </p>
        <form className="subscriber-form" onSubmit={handleSubscribe}>
          <label htmlFor="phone-input" className="visually-hidden">
            Phone Number
          </label>
          <PhoneInput
            id="phone-input"
            className="subscriber-input"
            placeholder="Enter your phone number"
            value={value}
            defaultCountry="IN"
            onChange={setValue}
            aria-label="Phone number"
            aria-required="true"
          />
          <button
            type="submit"
            className="subscriber-button"
            disabled={loading}
            aria-label={loading ? "Subscribing..." : "Subscribe to newsletter"}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
      <p className="subscriber-policy-footer">
        By signing up, you agree to the terms of use and privacy policy*
      </p>
    </section>
  );
}

export default SubscriberComponent;
