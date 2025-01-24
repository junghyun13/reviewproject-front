/* global kakao */
import './Map.css';
import { useEffect, useState } from 'react';

function App() {
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const handleSidebarClick = (option) => {
    setSelectedOption(option);
    setIsSecondSidebarOpen(true);
  };

  const searchPlaces = () => {
    if (!window.kakao || !window.kakao.maps) {
      alert('Kakao Maps API is not loaded yet.');
      return;
    }

    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=c7958a7c0d07a3b72a7fee938b0703d8&libraries=services';
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };
        const newMap = new kakao.maps.Map(mapContainer, options);
        setMap(newMap);
      });
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!map) return;
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    if (places.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      const newMarkers = places.map((place, idx) => {
        const position = new kakao.maps.LatLng(place.y, place.x);
        const marker = new kakao.maps.Marker({ position });
        marker.setMap(map);
        bounds.extend(position);
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
        <a href="#" onClick={() => handleSidebarClick('길찾기')}>길찾기</a>
        <a href="#" onClick={() => handleSidebarClick('찜')}>찜</a>
        <a href="#" onClick={() => handleSidebarClick('인기 키워드')}>인기 키워드</a>
      </div>

      {isSecondSidebarOpen && selectedOption === '검색' && (
        <div className="second-sidebar">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={searchPlaces}>검색</button>
          <br />
          <button onClick={() => setIsSecondSidebarOpen(false)}>닫기</button>

          {/* 검색된 식당 목록 표시 */}
          {places.length > 0 && (
            <div className="search-results">
              {places.map((place, index) => (
                <div key={index} className="place-item">
                  <img
                    src={place.place_url ? `https://placeimg.com/200/200/food` : ''}
                    alt={place.place_name}
                    className="place-image"
                  />
                  <div className="place-details">
                    <h4>{place.place_name}</h4>
                    <p>{place.address_name}</p>
                    <p>{place.category_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isSecondSidebarOpen && selectedOption !== '검색' && (
        <div className="second-sidebar">
          <h3>{selectedOption}</h3>
          <p>{`${selectedOption}에 대한 상세 내용이 여기에 표시됩니다.`}</p>
          <button onClick={() => setIsSecondSidebarOpen(false)}>닫기</button>
        </div>
      )}

      <div id="map" className="map"></div>
    </div>
  );
}

export default App;
