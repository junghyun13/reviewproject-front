import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터를 가져오기 위한 hook

function RestaurantDetail() {
  const { id } = useParams(); // URL의 :id 값을 가져옴
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/restaurant/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setRestaurant(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  if (!restaurant) {
    return <p>Loading...</p>;
  }

  return (
    <div className="RestaurantDetail">
      <h1>{restaurant.name}</h1>
      <img src={restaurant.image} alt="식당 이미지" />
      <p>⭐ {restaurant.rating} / 5.0</p>
      <p>특징: {restaurant.keywords}</p>
      <p>리뷰 요약: {restaurant.reviewSummary}</p>
    </div>
  );
}

export default RestaurantDetail;
