import React from "react";
import "./index.css";
import App from "./App";
import "./assets/healthcare/css/mobile.css";

import "@fortawesome/fontawesome-svg-core";
import "@fortawesome/free-solid-svg-icons";

import { hydrate, render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const rootElement = document.getElementById("root");


const AppWithRouter = () => (
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

if (rootElement.hasChildNodes()) {
  hydrate(<AppWithRouter />, rootElement);
} else {
  render(<AppWithRouter />, rootElement);
}
