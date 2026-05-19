import React, { useEffect } from "react";
import { backendHost } from "../../api-config";
const DirectPayment = () => {
  useEffect(() => {
    const startPayment = async () => {
      try {
        const response = await fetch(`${backendHost}/payment/basic`);

        const data = await response.json();

        console.log("Payment Data:", data);

        const form = document.createElement("form");

        form.method = "POST";

        form.action =
          "https://secure.ccavenue.com/transaction.do?command=initiateTransaction";

        form.style.display = "none";

        // encRequest
        const encInput = document.createElement("input");

        encInput.type = "hidden";

        encInput.name = "encRequest";

        encInput.value = data.encRequest;

        // access_code
        const accessInput = document.createElement("input");

        accessInput.type = "hidden";

        accessInput.name = "access_code";

        accessInput.value = data.accessCode;

        form.appendChild(encInput);

        form.appendChild(accessInput);

        document.body.appendChild(form);

        form.submit();
      } catch (error) {
        console.log("Payment Error:", error);
      }
    };

    startPayment();
  }, []);

  return null;
};

export default DirectPayment;
