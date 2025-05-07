import React, { useEffect, useState } from 'react';
import '../App.css';

const API_KEY = '54bccc8665dee92f062dc136a6060eb3';
const DEFAULT_CITY = 'London';

const weatherIcons = {
  Rain: '🌧️',
  Clouds: '⛅',
  Clear: '☀️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
};

const CurrentWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = (url) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setWeather(data);
          setLoading(false);
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        },
        () => {
          // If user denies or error, fallback to default city
          fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${API_KEY}&units=metric`);
        }
      );
    } else {
      fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${API_KEY}&units=metric`);
    }
  }, []);

  if (loading) return <div className="weather-card glass-card">Loading...</div>;
  if (!weather || weather.cod !== 200) return <div className="weather-card glass-card">Weather data not found.</div>;

  const main = weather.weather[0].main;
  const icon = weatherIcons[main] || '🌈';
  const temp = Math.round(weather.main.temp);
  const desc = weather.weather[0].description;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const pressure = weather.main.pressure;
  const time = new Date(weather.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="weather-card glass-card">
      <div className="weather-header">Current Weather</div>
      <div className="weather-time">{time}</div>
      <div className="weather-main">
        <span className="weather-icon">{icon}</span>
        <span className="weather-temp">{temp}°C</span>
      </div>
      <div className="weather-desc">{desc.charAt(0).toUpperCase() + desc.slice(1)}</div>
      <div className="weather-stats">
        <div><span role="img" aria-label="pressure">〰️</span><br />{pressure}</div>
        <div><span role="img" aria-label="humidity">💧</span><br />{humidity}%</div>
        <div><span role="img" aria-label="wind">🌬️</span><br />{wind}km/h</div>
        <div><span role="img" aria-label="clouds">☀️</span><br />{weather.clouds.all}</div>
      </div>
    </div>
  );
};

export default CurrentWeather; 