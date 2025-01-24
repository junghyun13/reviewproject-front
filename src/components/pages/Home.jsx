import React from "react";
import './Home.css';

const Home = () => {
  return (
    <div className='Home'>
      <div>
      <h1>네이버 이미지 로딩 테스트</h1>
      <img
  src='https://marketplace.canva.com/EAGPyGJvURk/2/0/1131w/canva-%EB%B2%A0%EC%9D%B4%EC%A7%80-%EA%B7%B8%EB%A6%B0-%EA%B9%94%EB%81%94%ED%95%9C-%ED%95%9C%EA%B5%AD-%EC%9D%8C%EC%8B%9D-%EC%8B%9D%EB%8B%B9-%EB%A9%94%EB%89%B4-%EB%B9%84%EB%B9%94%EB%B0%A5-%ED%8F%AC%EC%8A%A4%ED%84%B0-noSNLj46DJU.jpg'
  alt="테스트 이미지"
  onError={(e) => {
    e.target.src = "default-image-url.jpg"; // 기본 이미지로 대체
    console.error("Image load error:", e.target.src);
  }}
  style={{ width: '100%', height: 'auto' }}
/>
    </div>
    </div>
  );
};

export default Home;
