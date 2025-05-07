import React from 'react';
import '../App.css';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';

const HomePage = () => (
  <div className="glass-bg" style={{ flexDirection: 'column' }}>
    <CurrentWeather />
    <input className="search-bar" type="text" placeholder="Search for location" />
    <Forecast />
  </div>
);

export default HomePage; 