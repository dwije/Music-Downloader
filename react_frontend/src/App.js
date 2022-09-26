import { useEffect, useState } from 'react';
import './App.css';
import Home from "./Home";
import SpotifyAPIFetch from './SpotifyAPIFetch';
import YouTubeAPIFetch from './YouTubeAPIFetch';

function App() {
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;