import React, { useEffect, useState } from 'react';
import '../App.css';

const API_KEY = '54bccc8665dee92f062dc136a6060eb3';
const DEFAULT_COORDS = { lat: 51.5074, lon: -0.1278 }; // London

const weatherIcons = {
  Rain: '🌧️',
  Clouds: '⛅',
  Clear: '☀️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
};

function getDayName(dt) {
  return new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
}
function getDateString(dt) {
  const d = new Date(dt * 1000);
  return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}, ${getDayName(dt)}`;
}

const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = (lat, lon) => {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
          setForecast(data.daily.slice(0, 7));
          setLoading(false);
        });
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchForecast(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          fetchForecast(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
        }
      );
    } else {
      fetchForecast(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
    }
  }, []);

  if (loading) return <div className="weather-card glass-card">Loading...</div>;
  if (!forecast) return <div className="weather-card glass-card">Forecast not found.</div>;

  return (
    <div className="weather-card glass-card forecast-card">
      <div className="weather-header">Forecast <span className="forecast-tabs"><button className="active">7 Days</button><button disabled>10 Days</button></span></div>
      <div className="forecast-list">
        {forecast.map((day, idx) => {
          const main = day.weather[0].main;
          const icon = weatherIcons[main] || '🌈';
          const min = Math.round(day.temp.min);
          const max = Math.round(day.temp.max);
          return (
            <div className={`forecast-row${idx === 3 ? ' selected' : ''}`} key={day.dt}>
              <span className="forecast-icon">{icon}</span>
              <span className="forecast-temp">{max}° / {min}°</span>
              <span className="forecast-date">{getDateString(day.dt)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast; 