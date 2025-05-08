import React from 'react';
import '../App.css';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import PopularCities from './PopularCities';

const HomePage = () => (
  <div className="glass-bg">
    <div className="content-container">
      <CurrentWeather />
      <input 
        className="search-bar" 
        type="text" 
        placeholder="Search for a city..." 
        aria-label="Search for a city"
      />
      <Forecast />
      <PopularCities />
    </div>
  </div>
);

export default HomePage; 