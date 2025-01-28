/* global kakao */
import './Map.css';
import { useEffect, useState } from 'react';

function App() {
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(false);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울 시청 위도, 경도
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const API_BASE_URL = 'http://localhost:8080/api/restaurants';

  const handleSidebarClick = (option) => {
    setSelectedOption(option);
    setIsSecondSidebarOpen(true);
  };

  const fetchNearbyRestaurants = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Nearby Restaurants:', data);
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
    }
  };

  const searchByKeyword = async () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search?keyword=${keyword}`);
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

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=c7958a7c0d07a3b72a7fee938b0703d8&libraries=services';
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
          <button onClick={searchByKeyword}>검색</button>
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

      {isDetailSidebarOpen && selectedPlace && (
        <div className="detail-sidebar">
          <h3>{selectedPlace.name}</h3>
          <p>카테고리: {selectedPlace.category}</p>
          <p>별점: {selectedPlace.rating}</p>
          <p>리뷰: {selectedPlace.review}</p>
          <button onClick={() => setIsDetailSidebarOpen(false)}>닫기</button>
        </div>
      )}

      <div id="map" className="map"></div>
    </div>
  );
}

export default App;
