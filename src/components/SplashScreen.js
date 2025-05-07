import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => (
  <div className="splash-bg">
    <div className="cloud cloud1"></div>
    <div className="cloud cloud2"></div>
    <div className="splash-content">
      <div className="weather-icon">
        {/* Example SVG icon for weather (cloud with sun and rain) */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="55" rx="22" ry="13" fill="#fff" opacity="0.9"/>
          <ellipse cx="55" cy="50" rx="13" ry="10" fill="#e0f7fa" opacity="0.8"/>
          <circle cx="30" cy="45" r="10" fill="#ffe082" opacity="0.8"/>
          <rect x="36" y="65" width="3" height="10" rx="1.5" fill="#4fc3f7"/>
          <rect x="44" y="67" width="3" height="8" rx="1.5" fill="#4fc3f7"/>
          <rect x="52" y="65" width="3" height="10" rx="1.5" fill="#4fc3f7"/>
        </svg>
      </div>
      <h1 className="app-title">Weatherly</h1>
      <p className="tagline">Your daily weather at a glance</p>
      <div className="loader"></div>
    </div>
  </div>
);

export default SplashScreen; 