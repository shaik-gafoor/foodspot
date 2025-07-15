// src/components/AppDownload/AppDownload.jsx

import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <h2>Download Our App</h2>
      <p>Get your favorite food in just a few taps!</p>
      <div className="app-dowload-platforms">
        <img src={assets.play_store} alt="Download on Play Store" />
        <img src={assets.app_store} alt="Download on App Store" />
      </div>
    </div>
  );
};

export default AppDownload;
