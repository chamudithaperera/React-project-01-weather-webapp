import React from 'react';
import '../App.css';
import CurrentWeather from './CurrentWeather';

const HomePage = () => (
  <div className="glass-bg" style={{ flexDirection: 'column' }}>
    <CurrentWeather />
    <input className="search-bar" type="text" placeholder="Search for location" />
  </div>
);

export default HomePage; 