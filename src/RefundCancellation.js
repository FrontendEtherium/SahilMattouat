// src/RefundCancellation.js
import React, { useEffect } from "react";
import "./PrivacyPolicy.css";
import Header from "./components/Header/Header";

const RefundCancellation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className="privacy-policy">
        <h1>Refund &amp; Cancellation Policy</h1>

        <section>
          <h2>Introduction</h2>
          <p>
            This Refund &amp; Cancellation Policy applies to paid services
            purchased on All-Cures.com and the All-Cures mobile applications
            (together, the &ldquo;Platform&rdquo;), which are operated by
            Etherium Technologies Private Limited (&ldquo;All-Cures&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;). Paid
            services currently include online doctor consultations and
            appointment bookings scheduled through the Platform. By making a
            payment on the Platform you agree to the terms set out below,
            together with our Terms &amp; Conditions and Privacy Policy.
          </p>
        </section>

        <section>
          <h2>Cancellation by the User</h2>
          <p>
            You may cancel a booked consultation from the
            &ldquo;Bookings&rdquo; section of your account or by contacting us
            using the details below.
          </p>
          <ul>
            <li>
              <strong>More than 4 hours before the scheduled slot:</strong> you
              are eligible for a full refund of the amount paid, or you may
              reschedule the consultation to another available slot at no extra
              cost.
            </li>
            <li>
              <strong>Within 4 hours of the scheduled slot:</strong> the
              consultation is treated as confirmed and the amount paid is
              non-refundable, as the practitioner&rsquo;s time has already been
              reserved for you.
            </li>
            <li>
              <strong>No-show:</strong> if you do not join the consultation at
              the scheduled time and did not cancel in advance, no refund is
              payable.
            </li>
          </ul>
        </section>

        <section>
          <h2>Cancellation by the Practitioner or All-Cures</h2>
          <p>
            If a consultation is cancelled by the practitioner, or cannot be
            completed due to a technical failure attributable to the Platform
            (for example, the video session could not be established), you are
            entitled to a full refund of the amount paid, or you may choose to
            reschedule at no additional cost. We will notify you by email or
            phone in such cases.
          </p>
        </section>

        <section>
          <h2>Situations Where a Refund Is Not Available</h2>
          <ul>
            <li>The consultation has already been completed.</li>
            <li>
              You provided an incorrect phone number, email address or other
              details that prevented the consultation from taking place.
            </li>
            <li>
              You were unable to attend due to a poor internet connection,
              device issue or other problem on your side that is not
              attributable to the Platform.
            </li>
            <li>
              You are dissatisfied with the medical opinion or advice provided.
              Consultations are advisory in nature and a specific outcome or
              diagnosis cannot be guaranteed.
            </li>
            <li>
              Requests for cancellation made after the applicable time window
              described above.
            </li>
          </ul>
        </section>

        <section>
          <h2>How to Request a Refund</h2>
          <p>
            To request a cancellation or refund, contact us at{" "}
            <a href="mailto:info@etheriumtech.com">info@etheriumtech.com</a>{" "}
            or call <a href="tel:00911912959035">0091 191 295 9035</a> with the
            following information:
          </p>
          <ul>
            <li>The registered name and mobile number on your account.</li>
            <li>The booking or order reference number.</li>
            <li>The date and time of the consultation.</li>
            <li>The reason for the cancellation or refund request.</li>
          </ul>
          <p>
            We will acknowledge your request within 2 business days and inform
            you whether it qualifies for a refund under this Policy.
          </p>
        </section>

        <section>
          <h2>Refund Method and Timelines</h2>
          <p>
            All approved refunds are made to the original payment method used
            for the transaction, through our payment gateway partner
            (CCAvenue). We do not issue refunds in cash or to any third-party
            account.
          </p>
          <ul>
            <li>
              Approved refunds are initiated by All-Cures within 3 business days
              of approval.
            </li>
            <li>
              Once initiated, the amount is typically credited back to your
              bank account, card or wallet within 5 to 7 business days,
              depending on your bank or card issuer.
            </li>
            <li>
              Any payment gateway charges, taxes or convenience fees levied by
              banks or third parties may be deducted from the refund where
              permitted by law.
            </li>
          </ul>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            Etherium Technologies Private Limited
            <br />
            92/6, Trikuta Nagar, Jammu, Jammu and Kashmir 180020, India
            <br />
            Email:{" "}
            <a href="mailto:info@etheriumtech.com">info@etheriumtech.com</a>
            <br />
            Phone: <a href="tel:00911912959035">0091 191 295 9035</a>
          </p>
        </section>

        <section>
          <h2>Changes to this Policy</h2>
          <p>
            We may update this Refund &amp; Cancellation Policy from time to
            time. Any changes will be effective when posted on this page, and
            the version in force at the time of your transaction will apply to
            that transaction.
          </p>
        </section>
      </div>
    </>
  );
};

export default RefundCancellation;
