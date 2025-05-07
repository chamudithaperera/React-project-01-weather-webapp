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

const Forecast = () => {
  const [hourly, setHourly] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = (lat, lon) => {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
          if (data && data.hourly) {
            setHourly(data.hourly.slice(0, 12));
          } else {
            setHourly(null);
          }
          setLoading(false);
        })
        .catch(() => {
          setHourly(null);
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
  if (!hourly) return <div className="weather-card glass-card">Hourly forecast not found.</div>;

  return (
    <div className="weather-card glass-card forecast-card">
      <div className="hourly-forecast-section">
        <div className="hourly-title">Next 12 Hours</div>
        <div className="hourly-list">
          {hourly.map((hour) => {
            const main = hour.weather[0].main;
            const icon = weatherIcons[main] || '🌈';
            const temp = Math.round(hour.temp);
            const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div className="hourly-item" key={hour.dt}>
                <div className="hourly-time">{time}</div>
                <div className="hourly-icon">{icon}</div>
                <div className="hourly-temp">{temp}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Forecast; 