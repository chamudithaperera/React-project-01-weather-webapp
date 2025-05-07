import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Show splash for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? (
    <SplashScreen />
  ) : (
    <HomePage />
  );
}

export default App;
