/* global kakao */
import './Map.css';
import { useEffect, useState } from 'react';

function Map() {
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(false);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [isFavoriteSidebarOpen, setIsFavoriteSidebarOpen] = useState(false);
  const [isKeywordSidebarOpen, setIsKeywordSidebarOpen] = useState(false);
  const [isKeywordRestaurantSidebarOpen, setIsKeywordRestaurantSidebarOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState('');
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [reviewer, setReviewer] = useState('');
  const [keywords, setKeywords] = useState('');
  const [review, setReview] = useState('');
  const [userEmail, setUserEmail] = useState('user1@example.com'); // 사용자 이메일

  const API_BASE_URL = 'http://localhost:8080/api/restaurants';

  const handleSidebarClick = (option) => {
    setSelectedOption(option);
    setIsSecondSidebarOpen(true);
  };

  const handleSaveReview = async () => {
    if (!reviewer || !keywords || !review || !selectedPlace) {
      alert('모든 항목을 작성해주세요!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/mypage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer,
          restaurantId: selectedPlace.id,
          keywords,
          review,
        }),
      });

      if (!response.ok) {
        throw new Error('리뷰 저장 실패');
      }

      alert('리뷰가 저장되었습니다!');
      setReviewer('');
      setKeywords('');
      setReview('');
    } catch (error) {
      console.error('Error saving review:', error);
      alert('리뷰 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleAddToFavorites = async (restaurantId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/mypage/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, restaurantId }),
      });

      const data = await response.json();
      if (data.message) {
        alert(data.message);
      } else {
        alert('찜 목록에 추가되었습니다!');
      }

      fetchFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('찜 목록에 추가하는데 실패했습니다.');
    }
  };

  const fetchNearbyRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
    }
  };

  const searchByKeyword = async (searchKeyword = keyword) => {
    if (!searchKeyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search?keyword=${searchKeyword}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error searching by keyword:', error);
    }
  };

  const fetchPlaceDetails = async (placeName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/detail?name=${placeName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedPlace(data);
      setIsDetailSidebarOpen(true);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mypage/favorites?email=${userEmail}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchPopularKeywords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/popular-keywords`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPopularKeywords(data);
    } catch (error) {
      console.error('Error fetching popular keywords:', error);
    }
  };

  const fetchRestaurantsByKeyword = async (keyword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/keyword-search?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlaces(data);
      setIsKeywordRestaurantSidebarOpen(true);
    } catch (error) {
      console.error('Error fetching restaurants by keyword:', error);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=c7958a7c0d07a3b72a7fee938b0703d8&libraries=services';
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
          level: 3,
        };
        const newMap = new kakao.maps.Map(mapContainer, options);
        setMap(newMap);
      });
    };
    document.head.appendChild(script);
    fetchNearbyRestaurants();
    fetchPopularKeywords();
  }, []);

  useEffect(() => {
    if (!map) return;

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    if (places.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      const newMarkers = places.map((place) => {
        const position = new kakao.maps.LatLng(place.latitude, place.longitude);
        const marker = new kakao.maps.Marker({ position });
        marker.setMap(map);
        bounds.extend(position);

        kakao.maps.event.addListener(marker, 'click', () => {
          fetchPlaceDetails(place.name);
        });

        return marker;
      });
      map.setBounds(bounds);
      setMarkers(newMarkers);
    }
  }, [places]);

  return (
    <div className="App">
      <div className="sidebar">
        <a href="#" onClick={() => handleSidebarClick('검색')}>검색</a>
        <a href="#" onClick={() => handleSidebarClick('키워드 검색')}>키워드 검색</a>
        <a href="#" onClick={() => setIsFavoriteSidebarOpen(true)}>찜</a>
        <a href="#" onClick={() => setIsKeywordSidebarOpen(true)}>인기 키워드</a>
      </div>

      {isSecondSidebarOpen && selectedOption === '검색' && (
        <div className="second-sidebar">
          <button onClick={fetchNearbyRestaurants}>현재 위치 주변 검색</button>
          <button onClick={() => setIsSecondSidebarOpen(false)}>닫기</button>
          {places.length > 0 ? (
            <ul>
              {places.map((place) => (
                <li key={place.id} onClick={() => fetchPlaceDetails(place.name)}>
                  {place.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>주변에 검색된 식당이 없습니다.</p>
          )}
        </div>
      )}

      {isSecondSidebarOpen && selectedOption === '키워드 검색' && (
        <div className="second-sidebar">
          <input
            type="text"
            placeholder="키워드를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={() => searchByKeyword(keyword)}>검색</button>
          <button onClick={() => setIsSecondSidebarOpen(false)}>닫기</button>
          {places.length > 0 ? (
            <ul>
              {places.map((place) => (
                <li key={place.id} onClick={() => fetchPlaceDetails(place.name)}>
                  {place.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      )}

      {isKeywordSidebarOpen && (
        <div className="second-sidebar">
          <h3>인기 키워드</h3>
          <button onClick={() => setIsKeywordSidebarOpen(false)}>닫기</button>
          {popularKeywords.length > 0 ? (
            <ul>
              {popularKeywords.map((keyword, index) => (
                <li key={index} onClick={() => fetchRestaurantsByKeyword(keyword)}>
                  {keyword}
                </li>
              ))}
            </ul>
          ) : (
            <p>인기 키워드가 없습니다.</p>
          )}
        </div>
      )}

      {isKeywordRestaurantSidebarOpen && (
        <div className="second-sidebar">
          <h3>키워드로 검색된 식당</h3>
          <button onClick={() => setIsKeywordRestaurantSidebarOpen(false)}>닫기</button>
          {places.length > 0 ? (
            <ul>
              {places.map((place) => (
                <li key={place.id} onClick={() => fetchPlaceDetails(place.name)}>
                  {place.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>검색된 식당이 없습니다.</p>
          )}
        </div>
      )}

      {isFavoriteSidebarOpen && (
        <div className="second-sidebar">
          <h3>내 찜 목록</h3>
          <button onClick={fetchFavorites}>불러오기</button>
          <button onClick={() => setIsFavoriteSidebarOpen(false)}>닫기</button>
          {favorites.length > 0 ? (
            <ul>
              {favorites.map((fav) => (
                <li key={fav.id} onClick={() => fetchPlaceDetails(fav.name)}>
                  {fav.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>찜 목록이 비어 있습니다.</p>
          )}
        </div>
      )}

      {isDetailSidebarOpen && selectedPlace && (
        <div className="detail-sidebar">
          <h3>{selectedPlace.name}</h3>
          <p>카테고리: {selectedPlace.category}</p>
          <p>별점: {selectedPlace.rating}</p>
          <p>리뷰: {selectedPlace.review}</p>
          <button onClick={() => setIsDetailSidebarOpen(false)}>닫기</button>
          <button onClick={() => handleAddToFavorites(selectedPlace.id)}>찜하기</button>

          <div className="review-form">
            <h4>리뷰 작성하기</h4>
            <input
              type="text"
              placeholder="리뷰어 이름"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
            />
            <input
              type="text"
              placeholder="키워드"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <textarea
              placeholder="리뷰 내용"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button onClick={handleSaveReview}>리뷰 작성</button>
          </div>
        </div>
      )}

      <div id="map" className="map"></div>
    </div>
  );
}

export default Map;
