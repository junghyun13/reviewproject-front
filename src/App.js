import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; // Assuming you want to keep your styles here
import Header from './components/common/Header.jsx'; // Import Header component
import RestaurantDetail from "./components/pages/RestaurantDetail";
import Home from './components/pages/Home.jsx';
import TodayRandom from "./components/pages/TodayRandom";
import WheelOfFortune from './components/pages/WheelOfFortune.jsx';
import Login from './components/pages/Login.jsx';
import Signup from './components/pages/Signup.jsx';
import Map from './components/pages/Map.jsx';
import MyPage from './components/pages/MyPage.jsx';

function App() {
return (
  <Router>
  <Header /> 
  <Routes>
    <Route path="/" element={<Map />} /> 
    <Route path="/home" element={<Home />} />
    <Route path="/today-random" element={<TodayRandom />} />
    <Route path="/restaurant/:id" element={<RestaurantDetail />} />
    <Route path="/wheel" element={<WheelOfFortune />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/commars" element={<Map/>} /> 
  </Routes>
</Router>
);
}

export default App;