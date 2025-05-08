import React, { useEffect, useState } from 'react';
import '../App.css';
import citiesData from './cities.json';

const API_KEY = '54bccc8665dee92f062dc136a6060eb3';

function getGreeting(hour) {
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function getCityCoords(cityName) {
  const city = citiesData.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  return city ? { lat: city.lat, lon: city.lon } : null;
}

const HomePage = () => {
  // State
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState('');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Greeting and clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setGreeting(getGreeting(now.getHours()));
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user location on mount
  useEffect(() => {
    if (!coords) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => setCoords(getCityCoords('London'))
        );
      } else {
        setCoords(getCityCoords('London'));
      }
    }
  }, [coords]);

  // Fetch weather when coords change
  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        setWeather(data.current);
        setHourly(data.hourly ? data.hourly.slice(0, 6) : []);
        setWeekly(data.daily ? data.daily.slice(0, 6) : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch weather.');
        setLoading(false);
      });
  }, [coords]);

  // Search bar logic
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    setSuggestions(
      citiesData.filter(c => c.name.toLowerCase().startsWith(search.toLowerCase())).slice(0, 5)
    );
  }, [search]);

  const handleSearchSelect = (city) => {
    setSearch(city);
    setSuggestions([]);
    const cityCoords = getCityCoords(city);
    if (cityCoords) setCoords(cityCoords);
  };

  // Weather icon
  const weatherIcons = {
    Rain: '🌧️', Clouds: '⛅', Clear: '☀️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️',
  };

  // Render
  return (
    <div className="main-bg">
      <div className="main-card exact-layout">
        {/* LEFT SECTION */}
        <div className="main-card-left exact-left">
          <div className="greeting-time-card white-card">
            <div className="greeting">{greeting}</div>
            <div className="current-time">{time}</div>
          </div>
          <div className="main-weather-card white-card">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : weather ? (
              <>
                <div className="main-weather-temp">{Math.round(weather.temp)}°</div>
                <div className="main-weather-desc">{weather.weather[0].main}</div>
                <div className="main-weather-stats">
                  <span>{weather.wind_speed} mph</span>
                  <span>{weather.humidity} %</span>
                </div>
              </>
            ) : null}
          </div>
          <div className="weekly-forecast-row">
            {weekly.map((day, idx) => {
              const date = new Date(day.dt * 1000);
              const dayName = idx === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' });
              return (
                <div className={`weekly-day${idx === 0 ? ' active' : ''}`} key={day.dt}>
                  {dayName}<br/>
                  <span>{Math.round(day.temp.day)}°<br/>{day.weather[0].main}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="main-card-right exact-right">
          <div className="search-bar-card white-card" style={{ position: 'relative' }}>
            <input
              className="search-bar-input"
              type="text"
              placeholder="Search for a city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => search && setSuggestions(
                citiesData.filter(c => c.name.toLowerCase().startsWith(search.toLowerCase())).slice(0, 5)
              )}
            />
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((c, i) => (
                  <div key={c.name} className="search-suggestion" onClick={() => handleSearchSelect(c.name)}>
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="hourly-forecast-card white-card">
            <div className="hourly-title">Hourly Forecast</div>
            <div className="hourly-forecast-grid">
              {hourly.map((h, idx) => (
                <div className="hourly-cell" key={h.dt}>
                  <div>{new Date(h.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true })}</div>
                  <div>{Math.round(h.temp)}°</div>
                  <div>{h.weather[0].main}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="town-weather-card white-card">
            {/* Town-wise weather: reuse your previous PopularCities logic here if needed */}
            Town Weather details
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 