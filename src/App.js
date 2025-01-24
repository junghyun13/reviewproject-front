import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/common/Header.jsx'; 
import RestaurantDetail from "./components/pages/RestaurantDetail";
import TodayRandom from "./components/pages/TodayRandom";
import WheelOfFortune from './components/pages/WheelOfFortune.jsx';
import Login from './components/pages/Login.jsx';
import Signup from './components/pages/Signup.jsx';
import Map from './components/pages/Map.jsx';
import MyPage from './components/pages/MyPage.jsx';
import BoardList from './components/pages/BoardList'; // BoardList 컴포넌트 추가
import BoardDetail from './components/pages/BoardDetail';
import EditPost from './components/pages/EditPost.jsx';

import WritePost from './components/pages/WritePost'; // WritePost 컴포넌트 추가
import TopReviewers from './components/pages/TopReviewers'; // 추가된 TopReviewers 컴포넌트

function App() {
  const [user, setUser] = useState(null); // 사용자 상태 추가

  return (
    <Router>
      {/* user 상태를 Header 컴포넌트에 전달 */}
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Map />} /> 
        <Route path="/today-random" element={<TodayRandom />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/wheel" element={<WheelOfFortune />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/commars" element={<Map/>} /> 
        <Route path="/community" element={<BoardList />} /> {/* 커뮤니티 라우트 추가 */}
        <Route path="/board/:postId" element={<BoardDetail />} />
        <Route path="/edit/:postId" element={<EditPost />} />
        <Route path="/write" element={<WritePost />} /> {/* 글쓰기 폼 라우트 추가 */}
        <Route path="/top-reviewers" element={<TopReviewers />} /> {/* 경로 추가 */}
      </Routes>
    </Router>
  );
}


export default App;
