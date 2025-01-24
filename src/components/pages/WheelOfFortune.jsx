import React, { useState, useEffect } from "react";
import "./WheelOfFortune.css";
import { useNavigate, useLocation } from "react-router-dom";

function WheelOfFortune() {
  const location = useLocation(); // 전달된 state를 가져옴
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState(location.state?.restaurants || []); // 전달받은 데이터 사용
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (restaurants.length === 0) {
      // 전달된 데이터가 없으면 fetch로 랜덤 데이터를 불러옴
      fetchRestaurants();
    }
  }, [restaurants]);

  const fetchRestaurants = () => {
    fetch(`http://localhost:8080/api/random`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleSpin = () => {
    if (restaurants.length > 0 && !spinning) {
      setSpinning(true);

      // 상위 5개 목록에서 랜덤으로 선택
      const topRestaurants = restaurants.slice(0, 5);
      const randomIndex = Math.floor(Math.random() * topRestaurants.length);
      const rotation = 360 * 5 + (360 / topRestaurants.length) * randomIndex; // 5바퀴 돌고 섹터 정렬
      document.querySelector(".wheel").style.transform = `rotate(${rotation}deg)`;

      setTimeout(() => {
        setSelectedRestaurant(topRestaurants[randomIndex]);
        setSpinning(false);
      }, 2000); // 2초 후에 멈춤
    }
  };

  const handleImageClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  // 고정된 색상 배열
  const fixedColors = ["red", "orange", "green", "blue", "purple"];

  const topRestaurants = restaurants.slice(0, 5); // 상위 5개만 돌림판에 표시

  return (
    <div className="WheelOfFortune">
      <h1>오늘의 맛집 돌림판</h1>
      <div className={`wheel-container ${spinning ? "spinning" : ""}`}>
        <div className="wheel">
          {topRestaurants.map((restaurant, index) => (
            <div
              key={index}
              className="wheel-segment"
              style={{
                transform: `rotate(${(360 / topRestaurants.length) * index}deg)`,
                backgroundColor: fixedColors[index % fixedColors.length],  // 고정 색상 적용
              }}
            >
              <span>{restaurant.name}</span>
            </div>
          ))}
          <div className="wheel-center"></div>
        </div>
      </div>

      <div className="action-group">
        <button onClick={handleSpin} disabled={spinning}>
          돌림판 돌리기
        </button>
      </div>

      {selectedRestaurant && (
        <div className="selected-restaurant">
          <h3>선택된 맛집</h3>
          <img
            src={selectedRestaurant.image}
            alt="선택된 식당 이미지"
            onClick={() => handleImageClick(selectedRestaurant.id)}
            style={{ cursor: "pointer" }}
          />
          <h3>{selectedRestaurant.name}</h3>
          <p>⭐ {selectedRestaurant.rating} / 5.0</p>
          <p>{selectedRestaurant.reviewSummary}</p>
        </div>
      )}
    </div>
  );
}

export default WheelOfFortune;
