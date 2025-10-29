import React, { useState } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import axios from "axios";
import { Alert, Form, Button, Spinner } from "react-bootstrap";
import "../styles.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useHistory } from "react-router";

function Feedback() {
  const MAX_FEEDBACK_LENGTH = 500;
  const MIN_FEEDBACK_LENGTH = 10;
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("");
  const [whatsappAlert, setWhatsappAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useHistory();
  const charactersRemaining = Math.max(0, MAX_FEEDBACK_LENGTH - feedback.length);

  const resetAlerts = () => {
    setAlert(false);
    setError("");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    resetAlerts();

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address or leave the field blank.");
      return;
    }

    if (feedback.trim().length < MIN_FEEDBACK_LENGTH) {
      setError("Please share a few more details so we can understand your feedback.");
      return;
    }

    let countryCode = "";
    let phoneNumber = "";

    if (phoneValue) {
      const parsed = parsePhoneNumberFromString(phoneValue || "");

      if (!parsed) {
        setError("Please enter a valid phone number.");
        return;
      }

      countryCode = `+${parsed.countryCallingCode}`;
      phoneNumber = parsed.nationalNumber || "";
    }

    try {
      setIsSubmitting(true);
      await axios.post("https://all-cures.com:444/cures/feedback", {
        firstname: firstName || "",
        lastname: lastName || "",
        email: email || "",
        phonenumber: phoneNumber,
        countryCode,
        feedback,
        whatsappAlert: whatsappAlert === true,
      });

      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 4000);

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneValue("");
      setFeedback("");
      setWhatsappAlert(null);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header history={history} />

      <div className="promo-page feedbackmobile">
        <div className="container">
          <div className="card my-3">
            <div className="card-title h3 text-center py-2 border-bottom">
              Share your feedback or testimonial
            </div>
            <form onSubmit={submitForm}>
              <div className="row m-4">
                <Form.Group
                  className="col-md-6 float-left"
                  style={{ zIndex: 2 }}
                >
                  <Form.Label>Enter Your First Name (Optional)</Form.Label>
                  <Form.Control
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    name=""
                    placeholder="Enter Your First Name..."
                  />
                </Form.Group>
                <Form.Group
                  className="col-md-6 float-left"
                  style={{ zIndex: 2 }}
                >
                  <Form.Label>Enter Your Last Name (Optional)</Form.Label>
                  <Form.Control
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    name=""
                    placeholder="Enter Your Last Name..."
                  />
                </Form.Group>
                <Form.Group
                  className="col-md-6 float-left"
                  style={{ zIndex: 2 }}
                >
                  <Form.Label>Enter Your Email (Optional)</Form.Label>
                  <Form.Control
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    name=""
                    placeholder="Enter Your Email..."
                  />
                  <Form.Text muted>
                    We&apos;ll only use this to follow up if we have questions.
                  </Form.Text>
                </Form.Group>
                <Form.Group
                  className="col-md-6 float-left"
                  style={{ zIndex: 2 }}
                >
                  <Form.Label>Enter Your Phone Number (Optional)</Form.Label>
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    placeholder="Enter Your Phone Number..."
                    value={phoneValue}
                    onChange={(value) => setPhoneValue(value || "")}
                    className="phone-input"
                  />
                  <Form.Text muted>
                    We store the number with your country code to stay in touch for testimonials.
                  </Form.Text>
                </Form.Group>
                <Form.Group
                  className="col-md-6 float-left"
                  style={{ zIndex: 2 }}
                >
                  <Form.Label>
                    Would you like to subscribe to our WhatsApp alerts on
                    health?
                  </Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      name="whatsapp"
                      type="radio"
                      checked={whatsappAlert === true}
                      onChange={() => setWhatsappAlert(true)}
                      className="radio-button"
                      required
                    />
                    <Form.Check
                      inline
                      label="No"
                      name="whatsapp"
                      type="radio"
                      checked={whatsappAlert === false}
                      onChange={() => setWhatsappAlert(false)}
                      className="radio-button"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group
                  className="col-md-12 float-left"
                  style={{ zIndex: 2 }}
                >
                  <Form.Label>Enter Your Feedback</Form.Label>

                  <Form.Control
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    as="textarea"
                    placeholder="Tell us what stood out about your experience..."
                    style={{ height: "100px" }}
                    maxLength={MAX_FEEDBACK_LENGTH}
                    required
                  />
                  <Form.Text muted>
                    {`${charactersRemaining} characters remaining`}
                  </Form.Text>
                </Form.Group>
                {error ? (
                  <Alert variant="danger" className="h6 mx-3">
                    {error}
                  </Alert>
                ) : null}
                {alert ? (
                  <Alert variant="success" className="h6 mx-3">
                    Thanks For Your Feedback!!
                  </Alert>
                ) : null}
              </div>
              <div className="col-md-12 text-center">
                <Button
                  type="submit"
                  className="btn btn-dark col-md-12 mb-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "8px" }}
                      />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Feedback;
