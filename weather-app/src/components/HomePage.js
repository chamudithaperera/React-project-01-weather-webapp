import React from 'react';
import '../App.css';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import PopularCities from './PopularCities';

const HomePage = () => (
  <div className="glass-bg" style={{ flexDirection: 'column' }}>
    <CurrentWeather />
    <input className="search-bar" type="text" placeholder="Search for location" />
    <Forecast />
    <PopularCities />
  </div>
);

export default HomePage; 