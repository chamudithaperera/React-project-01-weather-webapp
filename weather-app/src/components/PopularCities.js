import React, { useEffect, useState } from 'react';
import '../App.css';
import citiesData from './cities.json';

const API_KEY = '54bccc8665dee92f062dc136a6060eb3';

const weatherIcons = {
  Rain: '🌧️',
  Clouds: '⛅',
  Clear: '☀️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
};

function haversine(lat1, lon1, lat2, lon2) {
  // Calculate distance between two lat/lon points in km
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const PopularCities = () => {
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCountryCode = async (lat, lon) => {
      // Use Nominatim for reverse geocoding
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await res.json();
      return data.address && data.address.country_code ? data.address.country_code.toUpperCase() : null;
    };

    const getNearbyCities = (lat, lon, country) => {
      // Filter cities by country, sort by distance, pick 20 closest, then 5 random
      const filtered = citiesData.filter(city => city.country === country);
      const sorted = filtered
        .map(city => ({ ...city, dist: haversine(lat, lon, city.lat, city.lon) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 20);
      // Shuffle and pick 5
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
      return sorted.slice(0, 5);
    };

    const fetchWeatherForCities = async (cities) => {
      return Promise.all(
        cities.map(city =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`)
            .then(res => res.json())
            .then(data => ({
              name: city.name,
              main: data.weather && data.weather[0] ? data.weather[0].main : 'Clear',
              desc: data.weather && data.weather[0] ? data.weather[0].description : '',
            }))
        )
      );
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const country = await getCountryCode(lat, lon);
            if (!country) throw new Error('Could not determine country');
            const cities = getNearbyCities(lat, lon, country);
            if (cities.length === 0) throw new Error('No cities found in your country');
            const weather = await fetchWeatherForCities(cities);
            setCitiesWeather(weather);
            setLoading(false);
          } catch (e) {
            setError(e.message);
            setLoading(false);
          }
        },
        () => {
          setError('Location permission denied.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported.');
      setLoading(false);
    }
  }, []);

  return (
    <div className="weather-card glass-card popular-cities-card">
      <div className="popular-cities-header">
        <span>Popular Cities</span>
        <span className="view-more">View more</span>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#b3e0ff', margin: '18px 0' }}>Loading...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: '#ffb3b3', margin: '18px 0' }}>{error}</div>
      ) : (
        <div className="popular-cities-list">
          {citiesWeather.map((city, idx) => (
            <div className="popular-city-row" key={city.name}>
              <span className="popular-city-icon">{weatherIcons[city.main] || '🌈'}</span>
              <span className="popular-city-name">{city.name}</span>
              <span className="popular-city-desc">{city.desc.charAt(0).toUpperCase() + city.desc.slice(1)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularCities; 